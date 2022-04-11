<template>
  <div class="iot-form">
    <el-form ref="formCom" :model="ruleValue" :rules="formRules" label-position="top">
      <el-card class="app-card">
        <div class="part-header">{{ tl('baseInfo') }}</div>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="tl('name')" required prop="name">
              <el-input v-model="ruleValue.name" />
            </el-form-item>
            <el-form-item :label="tl('note')">
              <el-input type="textarea" v-model="ruleValue.description" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="app-card">
        <div class="part-header">{{ tl('filterData') }}</div>
        <div class="sub-block-desc">
          <span>{{ tl('ruleSQLDesc') }}</span>
          <a href="https://www.emqx.io">{{ tl('doc') }}</a>
        </div>
        <el-row v-if="briefEditType">
          <el-col :span="14">
            <el-form-item class="self-required" :error="sqlPartValueFormError.from">
              <template #label>
                <div class="label-container">
                  <label>{{ tl('dataSource') }}(FROM)</label>
                  <el-tooltip effect="dark" :content="tl('changeSqlMethod')" placement="top-start">
                    <el-icon class="icon-edit" @click="toggleTypeForEditSQL">
                      <edit-pen />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
              <FromSelectList
                v-model="sqlPartValue.from"
                :ingress-bridge-list="ingressBridgeList"
                :event-list="ruleEventsList"
                @change="checkSQLPartValue('from')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="`${tl('select')}(SELECT)`" :error="sqlPartValueFormError.select">
              <div class="monaco-container is-small">
                <Monaco
                  :id="createRandomString()"
                  v-model="sqlPartValue.select"
                  lang="sql"
                  @change="checkSQLPartValue('select')"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="`${tl('where')}(WHERE)`" :error="sqlPartValueFormError.where">
              <div class="monaco-container is-small">
                <Monaco :id="createRandomString()" v-model="sqlPartValue.where" lang="sql" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="14">
            <el-form-item required prop="sql" class="self-required">
              <template #label>
                <div class="label-container">
                  <label>SQL</label>
                  <el-tooltip effect="dark" :content="tl('changeFormMethod')" placement="top-start">
                    <el-icon class="icon-edit" @click="toggleTypeForEditSQL">
                      <edit-pen />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
              <div class="monaco-container">
                <Monaco
                  :id="createRandomString()"
                  v-model="ruleValue.sql"
                  lang="sql"
                  @change="validate"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="sql-ft" :span="14">
            <el-button type="primary" plain @click="openTestDialog()" size="large">
              {{ tl('testsql') }}
            </el-button>
            <el-button class="btn-sql-temp" size="small" plain @click="showTemplateDrawer">
              {{ tl('SQLTemplates') }}
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <RuleOutputs v-model="ruleValue" />
    </el-form>
  </div>
  <SQLTestDialog
    v-model="testDialog"
    :sql="testSQL"
    :ingress-bridge-list="ingressBridgeList"
    :event-list="ruleEventsList"
    :customInput="inputForTest"
    @save="saveSQLFromTest"
  />
  <SQLTemplateDrawer
    v-model="isShowTemplateDrawer"
    @use-sql="useSQLTemplate"
    @test-sql="testSQLTemplate"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'iot-form',
})
</script>

<script lang="ts" setup>
import { ref, Ref, onMounted, watch, defineEmits, defineProps, defineExpose } from 'vue'
import { getBridgeList, getRuleEvents } from '@/api/ruleengine'
import { BridgeItem, RuleForm, BasicRule, RuleEvent } from '@/types/rule'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash'
import { MQTTBridgeDirection } from '@/types/enum'
import SQLTestDialog from './SQLTestDialog.vue'
import SQLTemplateDrawer from './SQLTemplateDrawer.vue'
import { EditPen } from '@element-plus/icons-vue'
import RuleOutputs from './RuleOutputs.vue'
import Monaco from '@/components/Monaco.vue'
import { createRandomString, getKeywordsFromSQL, checkIsValidArr } from '@/common/tools'
import FromSelectList from './FromSelectList.vue'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { DEFAULT_SELECT, DEFAULT_FROM } from '@/common/constants'
import useFormRules from '@/hooks/useFormRules'

const prop = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const { transFromStrToFromArr, transSQLFormDataToSQL } = useRuleUtils()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)
const testDialog = ref(false)
const bridgeList = ref([])
const ingressBridgeList: Ref<Array<BridgeItem>> = ref([])
const ruleEventsList: Ref<Array<RuleEvent>> = ref([])
const outputLoading = ref(false)
const briefEditType = ref(false)

const isShowTemplateDrawer = ref(false)

const ruleValueDefault = {
  name: '',
  sql: transSQLFormDataToSQL(DEFAULT_SELECT, [DEFAULT_FROM]),
  outputs: [],
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
const inputForTest = ref('')

const { createRequiredRule } = useFormRules()
const formCom = ref()
const formRules = {
  name: createRequiredRule(tl('name')),
  sql: createRequiredRule(tl('SQL')),
}

watch(
  () => JSON.stringify(ruleValue.value) + JSON.stringify(sqlPartValue.value),
  (val) => {
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

/**
 * sync data
 * Timing of function calls: 1. open test dialog; 2. form value changed; 3. component mounted
 * - When using form editing, sync data from form to sql
 * - when editing with sql, sync data from sql to form
 */
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

const loadBridgeList = async () => {
  outputLoading.value = true
  try {
    const res = await getBridgeList()
    bridgeList.value = res
  } catch (error) {
    console.error(error)
  } finally {
    outputLoading.value = false
  }
}

const loadIngressBridgeList = async () => {
  await loadBridgeList()
  ingressBridgeList.value = bridgeList.value.filter(
    (v: BridgeItem) => 'direction' in v && v.direction === MQTTBridgeDirection.In,
  )
}

const openTestDialog = () => {
  syncData()
  inputForTest.value = ''
  testDialog.value = true
}

const showTemplateDrawer = () => {
  isShowTemplateDrawer.value = true
}

const useSQLTemplate = (SQLTemp: string) => {
  ruleValue.value.sql = SQLTemp
  syncSQLDataToForm()
}

const testSQLTemplate = ({ sql, input }: { sql: string; input: string }) => {
  testSQL.value = sql
  inputForTest.value = input
  testDialog.value = true
}

const saveSQLFromTest = useSQLTemplate

const loadRuleEvents = async () => {
  try {
    ruleEventsList.value = await getRuleEvents()
  } catch (error) {
    console.error(error)
  }
}

const toggleTypeForEditSQL = () => {
  if (briefEditType.value) {
    syncFormDataToSQL()
  } else {
    syncSQLDataToForm()
  }
  briefEditType.value = !briefEditType.value
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

onMounted(() => {
  loadIngressBridgeList()
  loadRuleEvents()
  setRuleValue()
})

defineExpose({ validate })
</script>

<style lang="scss">
@import '~@/style/rule.scss';
</style>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 12px;
  }
}

.icon-edit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-color: #f2f2f2;
  cursor: pointer;
}
.el-form-item.is-required.self-required:not(.is-no-asterisk) {
  :deep(.el-form-item__label:after) {
    content: '';
    display: none;
  }
  .label-container > label::after {
    content: '*';
    color: var(--el-color-danger);
    margin-left: 4px;
  }
}
.el-form-item.is-error .monaco-container {
  border-color: var(--el-color-danger);
}

.monaco-container {
  margin-bottom: 20px;
}

.el-button--info.is-plain.btn-sql-temp {
  background-color: inherit;
}
.sql-ft {
  display: flex;
  justify-content: space-between;
}
</style>
