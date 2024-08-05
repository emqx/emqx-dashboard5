<template>
  <div class="rule-form">
    <el-row class="editor-row">
      <el-col :span="15" class="sql-col">
        <el-form
          ref="formCom"
          :model="ruleValue"
          :rules="formRules"
          :disabled="disabled"
          label-position="top"
          hide-required-asterisk
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item required prop="id">
                <el-input
                  v-model="ruleValue.id"
                  placeholder="ID"
                  :disabled="isEdit || nameDisabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="description">
                <el-input v-model="ruleValue.description" :placeholder="tl('note')" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item required prop="sql" class="self-required">
                <template #label>
                  <span>{{ tl('sqlEditor') }}</span>
                  <InfoTooltip :content="tl('ruleSQLDesc')" />
                  <p class="sub-block-desc">
                    <span>{{ tl('sqlEdit') }}</span>
                    <a :href="docMap.sqlGrammar" target="_blank">{{ tl('sqlSyntaxAndTem') }}</a>
                  </p>
                </template>
                <div class="monaco-container sql">
                  <Monaco
                    :id="createRandomString()"
                    :completion-provider="completionProvider"
                    :hover-provider="hoverProvider"
                    :disabled="disabled"
                    v-model="ruleValue.sql"
                    lang="rulesql"
                    @change="validate"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-button @click="openTemplateDrawer" type="primary" plain>
                {{ tl('SQLTemplates') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="9" class="action-col">
        <el-tabs class="io-tabs" v-model="rightBlockActiveTab">
          <el-tab-pane class="io-tab-pane" :label="tl('dataInput')" :name="RightTab.Sources">
            <RuleInputs
              v-model="ruleValue.sql"
              :disabled="disabled"
              :source-list="ingressBridgeList"
            />
          </el-tab-pane>
          <el-tab-pane class="io-tab-pane" :label="tl('actionOutputs')" :name="RightTab.Actions">
            <RuleOutputs v-model="ruleValue" :disabled="disabled" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row class="test-row">
      <SQLTest ref="testSQLRef" :rule-data="modelValue" :ingress-bridge-list="ingressBridgeList" />
    </el-row>
    <el-row class="oper-row">
      <el-col :span="24">
        <el-button @click="$router.push({ name: 'rule' })">
          {{ savedAfterDataChange ? tl('backToRuleList') : $t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post') || disabled || isDataSaveButtonDisabled"
          :loading="submitLoading"
          @click="$emit('save')"
        >
          {{ isEdit ? $t('Base.update') : $t('Base.save') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post') || disabled"
          plain
          @click="saveAsCopy"
          v-if="isEdit"
        >
          {{ tl('saveAsCopy') }}
        </el-button>
      </el-col>
    </el-row>
  </div>
  <SQLTemplateDrawer v-model="showSQLTemplateDrawer" @use-sql="useSQLTemplate" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'rule-form',
})
</script>

<script lang="ts" setup>
import { DEFAULT_FROM, DEFAULT_SELECT } from '@/common/constants'
import { checkIsValidArr, createRandomString, getKeywordsFromSQL } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useSourceList from '@/hooks/Rule/action/useSourceList'
import { useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useProvidersForMonaco from '@/hooks/Rule/useProvidersForMonaco'
import useDocLink from '@/hooks/useDocLink'
import useFormRules from '@/hooks/useFormRules'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { BridgeDirection, BridgeType, TestRuleTarget } from '@/types/enum'
import { BasicRule, BridgeItem, RuleEvent, RuleForm } from '@/types/rule'
import { cloneDeep } from 'lodash'
import {
  Ref,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  nextTick,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import RuleInputs from './RuleInputs.vue'
import RuleOutputs from './RuleOutputs.vue'
import SQLTemplateDrawer from './SQLTemplateDrawer.vue'
import SQLTest from './SQLTest.vue'

const prop = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  submitLoading: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  /**
   * for in create rule page but already saved
   */
  nameDisabled: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'save', 'save-as-copy'])

const { t } = useI18n()
const route = useRoute()
const { transFromStrToFromArr, transSQLFormDataToSQL } = useRuleUtils()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)
const ingressBridgeList: Ref<Array<BridgeItem>> = ref([])
const ruleEventsList: Ref<Array<RuleEvent>> = ref([])
const briefEditType = ref(false)
const testSQLRef = ref()

const ruleValueDefault = {
  id: '',
  sql: transSQLFormDataToSQL(DEFAULT_SELECT, [DEFAULT_FROM]),
  actions: [],
  description: '',
}

let modelValueCache = ''
const ruleValue: Ref<BasicRule | RuleForm> = ref({
  ...cloneDeep(ruleValueDefault),
  ...cloneDeep(prop.modelValue),
})

const { isTesting, testTarget, savedAfterDataChange, isDataSaveButtonDisabled } =
  useStatusController()

const ruleSql = computed(() => ruleValue.value.sql)

provide('sql', ruleSql)
provide('eventList', ruleEventsList)

const sqlPartValue = ref({
  from: [DEFAULT_FROM],
  select: DEFAULT_SELECT,
  where: '',
})
const sqlPartValueFormError = ref({
  from: '',
  select: '',
})
const fieldLabelMap = {
  from: tl('dataSource'),
  select: tl('select'),
}

const testSQL = ref('')
const showSQLTemplateDrawer = ref(false)

enum RightTab {
  Sources,
  Actions,
}
const rightBlockActiveTab = ref(RightTab.Actions)

const { createRequiredRule, createCommonIdRule } = useFormRules()
const formCom = ref()
const formRules = {
  id: [...createRequiredRule('ID'), ...createCommonIdRule()],
  sql: createRequiredRule(tl('SQL')),
}

const { docMap } = useDocLink()

const { completionProvider, hoverProvider, setExtDepData } = useProvidersForMonaco()

watch(
  () => JSON.stringify(ruleValue.value) + JSON.stringify(sqlPartValue.value),
  () => {
    syncData()
  },
)

watch(
  () => prop.modelValue,
  (val) => {
    if (JSON.stringify(val) !== modelValueCache) {
      setRuleValue()
    }
  },
)

const setRuleValue = () => {
  ruleValue.value = {
    ...cloneDeep(ruleValueDefault),
    ...cloneDeep(prop.modelValue),
  }
  if (briefEditType.value) {
    syncSQLDataToForm()
  }
}

const replaceSQLFrom = (from: string) => {
  const { fieldStr, whereStr } = getKeywordsFromSQL(ruleValue.value.sql)
  ruleValue.value.sql = transSQLFormDataToSQL(fieldStr, transFromStrToFromArr(from), whereStr)
}

const addBridgeToAction = (bridgeID: string) => {
  if (Array.isArray(ruleValue.value.actions)) {
    ruleValue.value.actions?.push(bridgeID)
  }
}

const { handleConnDirection } = useHandleActionItem()

const processAction = addBridgeToAction

const processSource = async (sourceId: string) => {
  replaceSQLFrom(`$bridges/${sourceId}`)
  await nextTick()
  rightBlockActiveTab.value = RightTab.Sources
}

const processConnector = async (
  direction: BridgeDirection,
  connName: string,
  connType: BridgeType,
) => {
  if (!connName || !connType) {
    return
  }
  if (direction === BridgeDirection.Ingress) {
    rightBlockActiveTab.value = RightTab.Sources
  }
}

/**
 * Handles the data from the query.
 * If `bridgeId` is provided in the route query, it processes the bridge(old actions) with the given `bridgeId`.
 * Otherwise, it handles the connection direction using the `processConnector` function.
 * @returns {Promise<void>} A promise that resolves when the data is handled.
 */
const handleDataFromQuery = async () => {
  const actionId = route.query.actionId?.toString()
  const sourceId = route.query.sourceId?.toString()

  if (actionId) {
    processAction(actionId)
  } else if (sourceId) {
    processSource(sourceId)
  } else {
    await handleConnDirection(processConnector as any)
  }
}

const syncFormDataToSQL = () => {
  const sql = transformSQL()
  testSQL.value = sql
  ruleValue.value.sql = sql
  return sql
}
const syncSQLDataToForm = () => {
  let { sql = '' } = ruleValue.value
  const { fieldStr, fromStr, whereStr } = getKeywordsFromSQL(sql)
  sqlPartValue.value = {
    from: transFromStrToFromArr(fromStr),
    select: fieldStr,
    where: whereStr,
  }
}
const syncData = () => {
  let sql = ruleValue.value.sql
  if (briefEditType.value) {
    sql = syncFormDataToSQL()
  } else {
    syncSQLDataToForm()
    testSQL.value = sql
  }
  const value = { ...ruleValue.value, sql }
  modelValueCache = JSON.stringify(value)
  emit('update:modelValue', value)
}

/**
 * trans form(select, from, where) to SQL
 */
const transformSQL = () => {
  const { select, from, where } = sqlPartValue.value
  return transSQLFormDataToSQL(select, from, where)
}

const { getSourceList } = useSourceList()
const loadIngressBridgeList = async () => {
  ingressBridgeList.value = await getSourceList()
}

const useSQLTemplate = (SQLTemp: string) => {
  ruleValue.value.sql = SQLTemp
  syncSQLDataToForm()
}

// const testSQLTemplate = ({ sql, input }: { sql: string; input: string }) => {
//   testSQL.value = sql
//   payloadForTest.value = input
// }

const openTemplateDrawer = () => {
  showSQLTemplateDrawer.value = true
}

// const eventDoNotNeedInRuleForm = '$events/message_publish'
// const eventListForFromSelect = computed(() => {
//   return ruleEventsList.value.filter(({ event }) => event !== eventDoNotNeedInRuleForm)
// })
const { getEventList } = useRuleEvents()
const loadRuleEvents = async () => {
  try {
    ruleEventsList.value = await getEventList()
  } catch (error) {
    console.error(error)
  }
}

// const toggleTypeForEditSQL = () => {
//   if (briefEditType.value) {
//     syncFormDataToSQL()
//   } else {
//     syncSQLDataToForm()
//   }
//   briefEditType.value = !briefEditType.value
// }

const { operationWarning } = useOperationConfirm()
const saveAsCopy = async () => {
  try {
    if (isTesting.value && testTarget.value === TestRuleTarget.Rule) {
      await operationWarning(tl('saveRuleStopTestingTip'))
      testSQLRef.value?.stopTest?.()
    }
    emit('save-as-copy')
  } catch (error) {
    //
  }
}

const selfValidate = () => {
  if (!briefEditType.value) {
    return Promise.resolve()
  }
  type Keys = Array<keyof typeof sqlPartValueFormError.value>
  const keys: Keys = Object.keys(sqlPartValueFormError.value) as Keys
  keys.forEach((key) => checkSQLPartValue(key))
  const pass = keys.every((key) => !sqlPartValueFormError.value[key])
  return pass ? Promise.resolve() : Promise.reject()
}

const checkSQLPartValue = (key: keyof typeof sqlPartValueFormError.value) => {
  const target = sqlPartValue.value[key]
  const isValid = !(
    (typeof target === 'string' && !target) ||
    (Array.isArray(target) && !checkIsValidArr(target))
  )
  sqlPartValueFormError.value[key] = isValid
    ? ''
    : t('Rule.inputFieldRequiredError', {
        name: fieldLabelMap[key],
      })
}

const validate = () => {
  return Promise.all([selfValidate(), formCom.value?.validate()])
}

onMounted(async () => {
  loadIngressBridgeList()
  setRuleValue()
  await loadRuleEvents()
  setExtDepData({ events: ruleEventsList.value, bridges: ingressBridgeList.value })
  handleDataFromQuery()
})

defineExpose({ validate })
</script>

<style lang="scss">
@import '~@/style/rule.scss';
</style>

<style lang="scss">
.rule-form {
  .sql-col {
    padding: 24px;
    border-right: 1px solid var(--color-border-normal);
  }
  .action-col {
    padding: 12px 24px;
    height: 640px;
    .io-tabs {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      > .el-tabs__content {
        padding: 4px;
        overflow-y: scroll;
      }
    }
    .el-tabs__nav {
      width: 100%;
    }
    .el-tabs__item {
      text-align: center;
      width: 50%;
    }
  }
  .part-header {
    margin-top: 12px;
  }
  .sub-block-desc {
    margin: 12px 0 16px 0;
    line-height: 1.6;
  }
  .monaco-container.sql {
    height: 400px;
  }
  .editor-row {
    border-bottom: 1px solid var(--color-border-normal);
  }
  .oper-row {
    padding: 24px;
    border-top: 1px solid var(--color-border-normal);
  }
  .test-row {
    padding: 24px;
  }
}
</style>
