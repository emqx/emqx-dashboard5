<template>
  <div class="iot-form">
    <el-form label-position="top" size="small">
      <el-card shadow="never" class="app-card">
        <div class="part-header">{{ tl('baseInfo') }}</div>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="tl('name')">
              <el-input v-model="ruleValue.name" />
            </el-form-item>
            <el-form-item :label="tl('note')">
              <el-input type="textarea" v-model="ruleValue.description" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="never" class="app-card">
        <div class="part-header">{{ tl('filterData') }}</div>
        <div class="sub-block-desc">
          <span>{{ tl('ruleSQLDesc') }}</span>
          <a href="emqx.com">{{ tl('doc') }}</a>
        </div>
        <el-row v-if="briefEditType">
          <el-col :span="14">
            <el-form-item>
              <template #label>
                <div class="label-container">
                  <label>{{ tl('dataSource') }}(FROM)</label>
                  <el-tooltip effect="dark" :content="tl('changeSqlMethod')" placement="top-start">
                    <el-icon class="icon-edit" @click="briefEditType = !briefEditType">
                      <edit-pen />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
              <FromSelectList
                v-model="sqlPartValue.from"
                :ingress-bridge-list="ingressBridgeList"
                :event-list="ruleEventsList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="`${tl('select')}(SELECT)`">
              <div class="monaco-container is-small">
                <Monaco :id="createRandomString()" v-model="sqlPartValue.select" lang="sql" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="`${tl('where')}(WHERE)`">
              <div class="monaco-container is-small">
                <Monaco :id="createRandomString()" v-model="sqlPartValue.where" lang="sql" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="14">
            <el-form-item>
              <template #label>
                <div class="label-container">
                  <label>SQL</label>
                  <el-tooltip effect="dark" :content="tl('changeFormMethod')" placement="top-start">
                    <el-icon class="icon-edit" @click="briefEditType = !briefEditType">
                      <edit-pen />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
              <div class="monaco-container">
                <Monaco :id="createRandomString()" v-model="ruleValue.sql" lang="sql" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="sql-ft" :span="14">
            <el-button type="primary" plain size="small" @click="openTestDialog()">
              {{ tl('testsql') }}
            </el-button>
            <el-button size="mini" plain type="info" @click="showTemplateDrawer">
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
    :test-data="testParams"
    :first-input-item="firstInputItem"
    :ingress-bridge-list="ingressBridgeList"
    :event-list="ruleEventsList"
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
import { ref, Ref, onMounted, watch, defineEmits, defineProps } from 'vue'
import { getBridgeList, getRuleEvents } from '@/api/ruleengine'
import { BridgeItem, RuleForm, BasicRule, RuleEvent } from '@/types/rule'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash'
import { MQTTBridgeDirection, RuleInputType } from '@/types/enum'
import SQLTestDialog from './SQLTestDialog.vue'
import SQLTemplateDrawer from './SQLTemplateDrawer.vue'
import { EditPen } from '@element-plus/icons-vue'
import RuleOutputs from './RuleOutputs.vue'
import Monaco from '@/components/Monaco.vue'
import { createRandomString, getKeywordsFromSQL } from '@/common/tools'
import FromSelectList from './FromSelectList.vue'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { DEFAULT_SELECT, DEFAULT_FROM } from '@/common/constants'

const prop = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const { getTestColumns, transFromStrToFromArr, findInputTypeNTarget, transSQLFormDataToSQL } =
  useRuleUtils()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)
const testDialog = ref(false)
const bridgeList = ref([])
const ingressBridgeList: Ref<Array<BridgeItem>> = ref([])
const ruleEventsList: Ref<Array<RuleEvent>> = ref([])
const outputLoading = ref(false)
const firstInputItem: Ref<string> = ref('')
const briefEditType = ref(true)

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

const testParams = ref({
  sql: '',
  context: {},
})

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
  testParams.value.sql = sql
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
  const res = await getBridgeList().catch(() => {})
  if (res) {
    bridgeList.value = res
  }
  outputLoading.value = false
}

const loadIngressBridgeList = async () => {
  await loadBridgeList()
  ingressBridgeList.value = bridgeList.value.filter(
    (v: BridgeItem) => 'direction' in v && v.direction === MQTTBridgeDirection.In,
  )
}

const openTestDialog = () => {
  syncData()

  const from = sqlPartValue.value.from[0]
  firstInputItem.value = from
  const { type: inputType } = findInputTypeNTarget(
    from,
    ruleEventsList.value,
    ingressBridgeList.value,
  )
  const testColumns = getTestColumns(inputType, from, ruleEventsList.value)
  testParams.value.context = testColumns

  testDialog.value = true
}

const showTemplateDrawer = () => {
  isShowTemplateDrawer.value = true
}

const useSQLTemplate = (SQLTemp: string) => {
  const { fieldStr, fromStr, whereStr } = getKeywordsFromSQL(SQLTemp)
  sqlPartValue.value = {
    from: transFromStrToFromArr(fromStr),
    select: fieldStr,
    where: whereStr,
  }
  ruleValue.value.sql = SQLTemp
}

const testSQLTemplate = (SQLTemp: string) => {
  const { fromStr } = getKeywordsFromSQL(SQLTemp)
  const fromArr = transFromStrToFromArr(fromStr)
  const { type: inputType } = findInputTypeNTarget(
    fromArr[0],
    ruleEventsList.value,
    ingressBridgeList.value,
  )
  const testColumns = getTestColumns(inputType, fromArr[0], ruleEventsList.value)

  firstInputItem.value = fromArr[0]
  testParams.value = {
    sql: SQLTemp,
    context: testColumns,
  }

  testDialog.value = true
}

const saveSQLFromTest = useSQLTemplate

const loadRuleEvents = async () => {
  const res = await getRuleEvents().catch(() => {})
  if (res) {
    ruleEventsList.value = res
  }
}

onMounted(() => {
  loadIngressBridgeList()
  loadRuleEvents()
  setRuleValue()
})
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
  background-color: #f2f2f2;
  cursor: pointer;
}
.sql-ft {
  display: flex;
  justify-content: space-between;
}
</style>
