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
        <template v-if="briefEditType">
          <el-row>
            <el-col :span="14">
              <el-form-item>
                <template #label>
                  <div class="label-container">
                    <label>{{ tl('dataSource') }}(FROM)</label>
                    <el-tooltip
                      effect="dark"
                      :content="tl('changeSqlMethod')"
                      placement="top-start"
                    >
                      <el-icon class="icon-edit" @click="briefEditType = !briefEditType">
                        <edit-pen />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-radio-group v-model="sqlFromType">
                  <el-radio label="topic" />
                  <el-radio label="bridge" />
                  <el-radio label="event" />
                </el-radio-group>
                <el-input v-if="sqlFromType === 'topic'" v-model="sqlPartValue.from" />
                <el-select v-if="sqlFromType === 'bridge'" v-model="sqlPartValue.from">
                  <el-option v-for="item in ingressBridgeList" :key="item.id" :value="item.id" />
                </el-select>
                <el-select v-if="sqlFromType === 'event'" v-model="sqlPartValue.from">
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
            <el-col class="sql-ft" :span="14">
              <el-button type="primary" plain size="small" @click="openTestDialog()">
                {{ tl('testsql') }}
              </el-button>
              <el-button size="mini" plain type="info" @click="showTemplateDrawer">
                {{ tl('SQLTemplates') }}
              </el-button>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row>
            <el-col :span="16">
              <el-form-item>
                <template #label>
                  <div class="label-container">
                    <label>SQL</label>
                    <el-tooltip
                      effect="dark"
                      :content="tl('changeFormMethod')"
                      placement="top-start"
                    >
                      <el-icon class="icon-edit" @click="briefEditType = !briefEditType">
                        <edit-pen />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-input type="textarea" rows="10" v-model="ruleValue.sql" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-card>
      <RuleOutputs v-model="ruleValue" />
    </el-form>
  </div>
  <SQLTestDialog v-model="testDialog" :test-data="testParams" :chosen-event="chosenEvent" />
  <SQLTemplateDrawer v-model="isShowTemplateDrawer" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

type RuleEvent = {
  test_columns: {
    payload: string
    qos: number
  }
  event: string
  columns: Array<string>
}

export default defineComponent({
  name: 'iot-form',
})
</script>

<script lang="ts" setup>
import { ref, Ref, onMounted, watch, defineEmits, defineProps } from 'vue'
import { getBridgeList, getRuleEvents } from '@/api/ruleengine'
import { BridgeItem, RuleForm, BasicRule } from '@/types/rule'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash'
import parser from 'js-sql-parser'
import { MQTTBridgeDirection } from '@/types/enum'
import SQLTestDialog from './SQLTestDialog.vue'
import SQLTemplateDrawer from './SQLTemplateDrawer.vue'
import { EditPen } from '@element-plus/icons-vue'
import RuleOutputs from './RuleOutputs.vue'

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
const ingressBridgeList = ref([])
const ruleEventsList = ref([])
const outputLoading = ref(false)
const sqlFromType = ref('topic')
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
  msg: '',
  metadata: {},
  sql: '',
})

watch(
  () => sqlFromType.value,
  () => {
    sqlPartValue.value.from = ''
  },
)

watch(
  () => [cloneDeep(ruleValue.value), cloneDeep(sqlPartValue.value)],
  (val) => {
    syncData()
  },
)

/**
 * sync data
 * Timing of function calls: 1. open test dialog; 2. form value changed; 3. component mounted
 */
const syncData = () => {
  const sql = transformSQL()
  emit('update:modelValue', { ...ruleValue.value, sql })
  testParams.value.sql = sql
  ruleValue.value.sql = transformSQL()
  parseStrSQL()
}

/**
 * trans form(select, from, where) to SQL
 */
const transformSQL = () => {
  const tempSql = [
    'SELECT',
    sqlPartValue.value.select,
    'FROM',
    ['"', sqlPartValue.value.from, '"'].join(''),
  ]
  if (sqlPartValue.value.where) tempSql.push('WHERE', sqlPartValue.value.where)

  return tempSql.map((v) => String(v).trim()).join(' ')
}

const parseStrSQL = () => {
  // const ast = parser.parse(ruleValue.value.sql);
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
    testParams.value.msg = chosenEvent.value?.test_columns?.payload
    testParams.value.metadata = chosenEvent.value?.test_columns
    Reflect.deleteProperty(testParams.value.metadata, 'payload')
  }

  if (sqlFromType.value === 'event') {
    const eventData = findProperEvent(sqlPartValue.value.from)
    eventData && setDataWithEvent(eventData)
  } else if (sqlFromType.value === 'topic') {
    const eventData = findProperEvent(sqlPartValue.value.from)
    if (eventData) {
      setDataWithEvent(eventData)
      return
    }
    const modifiedEvent = findProperEvent('$events/message_publish')
    modifiedEvent && setDataWithEvent(modifiedEvent)
  } else if (sqlFromType.value === 'bridge') {
    const modifiedEvent = findProperEvent('$events/message_publish')
    modifiedEvent && setDataWithEvent(modifiedEvent)
  }
}

const showTemplateDrawer = () => {
  isShowTemplateDrawer.value = true
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
  syncData()
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

.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-edit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #f2f2f2;
}
.sql-ft {
  display: flex;
  justify-content: space-between;
}
</style>
