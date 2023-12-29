<template>
  <div class="rule-form">
    <el-row class="editor-row">
      <el-col :span="15" class="sql-col">
        <el-form
          ref="formCom"
          :model="ruleValue"
          :rules="formRules"
          label-position="top"
          hide-required-asterisk
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item required prop="id">
                <el-input v-model="ruleValue.id" placeholder="ID" :disabled="isEdit" />
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
                    v-model="ruleValue.sql"
                    lang="sql"
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
          <el-tab-pane class="io-tab-pane" :label="tl('dataInput')" :name="RightTab.Events">
            <RuleInputs v-model="ruleValue.sql" :source-list="ingressBridgeList" />
          </el-tab-pane>
          <el-tab-pane class="io-tab-pane" :label="tl('actionOutputs')" :name="RightTab.Actions">
            <RuleOutputs v-model="ruleValue" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row class="test-row">
      <SQLTest
        ref="testSQLRef"
        :sql="ruleValue.sql"
        :ingress-bridge-list="ingressBridgeList"
        :event-list="ruleEventsList"
        :custom-payload="payloadForTest"
        @change-loading="handleTestLoadng"
        @save="saveSQLFromTest"
        @use-sql="useSQLTemplate"
      />
    </el-row>
    <el-row class="oper-row">
      <el-col :span="24">
        <el-button @click="$router.push({ name: 'rule' })">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          plain
          @click="saveAsCopy"
          v-if="isEdit"
        >
          {{ tl('saveAsCopy') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          :loading="submitLoading"
          @click="$emit('save')"
        >
          {{ isEdit ? $t('Base.update') : $t('Base.create') }}
        </el-button>
      </el-col>
    </el-row>
  </div>
  <SQLTemplateDrawer v-model="showSQLTemplateDrawer" @use-sql="useSQLTemplate" />
</template>

<script lang="ts">
import useSourceList from '@/hooks/Rule/action/useSourceList'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'rule-form',
})
</script>

<script lang="ts" setup>
import { getRuleEvents } from '@/api/ruleengine'
import { DEFAULT_FROM, DEFAULT_SELECT } from '@/common/constants'
import { checkIsValidArr, createRandomString, getKeywordsFromSQL } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import { useBridgeDirection } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useProvidersForMonaco from '@/hooks/Rule/useProvidersForMonaco'
import useDocLink from '@/hooks/useDocLink'
import useFormRules from '@/hooks/useFormRules'
import { BridgeDirection } from '@/types/enum'
import { BasicRule, BridgeItem, RuleEvent, RuleForm } from '@/types/rule'
import { cloneDeep } from 'lodash'
import { Ref, defineEmits, defineExpose, defineProps, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
const testLoading = ref(false)

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
const payloadForTest = ref('')
const showSQLTemplateDrawer = ref(false)

enum RightTab {
  Events,
  Actions,
}
const rightBlockActiveTab = ref(RightTab.Events)

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

const { judgeBridgeDirection } = useBridgeDirection()
const { getDetail } = useHandleActionItem()
const handleBridgeDataFromQuery = async () => {
  const bridgeId = route.query.bridgeId?.toString()
  if (!bridgeId) {
    return
  }
  const bridgeInfo = await getDetail(bridgeId)
  const direction = judgeBridgeDirection(bridgeInfo)
  if (direction === BridgeDirection.Both || direction === BridgeDirection.Egress) {
    addBridgeToAction(bridgeInfo.id)
  }
  if (direction === BridgeDirection.Both || direction === BridgeDirection.Ingress) {
    replaceSQLFrom(`$bridges/${bridgeInfo.id}`)
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

const saveSQLFromTest = useSQLTemplate

const handleTestLoadng = (val: boolean) => {
  testLoading.value = val
}

// const eventDoNotNeedInRuleForm = '$events/message_publish'
// const eventListForFromSelect = computed(() => {
//   return ruleEventsList.value.filter(({ event }) => event !== eventDoNotNeedInRuleForm)
// })
const loadRuleEvents = async () => {
  try {
    ruleEventsList.value = await getRuleEvents()
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

const saveAsCopy = () => {
  emit('save-as-copy')
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
  handleBridgeDataFromQuery()
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
