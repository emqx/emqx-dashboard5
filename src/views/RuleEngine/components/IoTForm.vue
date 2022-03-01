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
              <el-radio-group v-model="sqlFromType">
                <el-radio :label="RuleInputType.Topic" />
                <el-radio :label="RuleInputType.Bridge" />
                <el-radio :label="RuleInputType.Event" />
              </el-radio-group>
              <el-input v-if="sqlFromType === RuleInputType.Topic" v-model="sqlPartValue.from" />
              <el-select v-if="sqlFromType === RuleInputType.Bridge" v-model="sqlPartValue.from">
                <el-option v-for="item in ingressBridgeList" :key="item.id" :value="item.id" />
              </el-select>
              <el-select v-if="sqlFromType === RuleInputType.Event" v-model="sqlPartValue.from">
                <el-option v-for="item in ruleEventsList" :key="item.event" :value="item.event" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="`${tl('select')}(SELECT)`">
              <el-input type="textarea" v-model="sqlPartValue.select" />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="`${tl('where')}(WHERE)`">
              <el-input type="textarea" v-model="sqlPartValue.where" />
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
              <!-- <el-input type="textarea" rows="10" v-model="ruleValue.sql" /> -->
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
  <SQLTestDialog v-model="testDialog" :test-data="testParams" :chosen-event="chosenEvent" />
  <SQLTemplateDrawer v-model="isShowTemplateDrawer" @use-sql="useSQLTemplate" />
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

const prop = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)
const testDialog = ref(false)
const bridgeList = ref([])
const ingressBridgeList: Ref<Array<BridgeItem>> = ref([])
const ruleEventsList: Ref<Array<RuleEvent>> = ref([])
const outputLoading = ref(false)
const sqlFromType = ref(RuleInputType.Topic)
const chosenEvent: Ref<RuleEvent> = ref({} as RuleEvent)
const briefEditType = ref(true)

const isShowTemplateDrawer = ref(false)

const ruleValueDefault = {
  name: '',
  sql: '',
  outputs: [],
  description: '',
}

const ruleValue: Ref<BasicRule | RuleForm> = ref({
  ...cloneDeep(ruleValueDefault),
  ...cloneDeep(prop.modelValue),
})

const sqlPartValue = ref({
  from: 't/#',
  select: '*',
  where: '',
})

const testParams = ref({
  sql: '',
  context: {},
})

watch(
  () => sqlFromType.value,
  () => {
    sqlPartValue.value.from = ''
  },
)

watch(
  () => JSON.stringify(ruleValue.value) + JSON.stringify(sqlPartValue.value),
  (val) => {
    syncData()
  },
)

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
    from: fromStr,
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
  emit('update:modelValue', { ...ruleValue.value, sql })
}

/**
 * trans form(select, from, where) to SQL
 */
const transformSQL = () => {
  const tempSql = [
    'SELECT',
    sqlPartValue.value.select,
    '\n ',
    'FROM',
    ['"', sqlPartValue.value.from, '"'].join(''),
  ]
  if (sqlPartValue.value.where) tempSql.push('\nWHERE\n', ` ${sqlPartValue.value.where}`)

  return tempSql.map((v) => v.toString()).join(' ')
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
  testDialog.value = true
  syncData()

  function findProperEvent(event: string) {
    const properEvent = ruleEventsList.value.find((v: { event: string }) => v.event === event)
    return properEvent
  }

  function setDataWithEvent(properEvent: RuleEvent) {
    chosenEvent.value = properEvent
    testParams.value.context = chosenEvent.value?.test_columns
  }

  if (sqlFromType.value === RuleInputType.Event) {
    const eventData = findProperEvent(sqlPartValue.value.from)
    eventData && setDataWithEvent(eventData)
  } else if (sqlFromType.value === RuleInputType.Topic) {
    const eventData = findProperEvent(sqlPartValue.value.from)
    if (eventData) {
      setDataWithEvent(eventData)
      return
    }
    const modifiedEvent = findProperEvent('$events/message_publish')
    modifiedEvent && setDataWithEvent(modifiedEvent)
  } else if (sqlFromType.value === RuleInputType.Bridge) {
    const modifiedEvent = findProperEvent('$events/message_publish')
    modifiedEvent && setDataWithEvent(modifiedEvent)
  }
}

const showTemplateDrawer = () => {
  isShowTemplateDrawer.value = true
}

const useSQLTemplate = (SQLTemp: string) => {
  const { fieldStr, fromStr, whereStr } = getKeywordsFromSQL(SQLTemp)
  sqlPartValue.value = {
    from: fromStr,
    select: fieldStr,
    where: whereStr,
  }
  ruleValue.value.sql = SQLTemp
}

const loadRuleEvents = async () => {
  const res = await getRuleEvents().catch(() => {})
  if (res) {
    ruleEventsList.value = res
  }
}

onMounted(() => {
  loadIngressBridgeList()
  loadRuleEvents()
  syncFormDataToSQL()
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
