<template>
  <div class="iot-form">
    <el-form label-position="top">
      <div class="part-header">{{ tl('baseInfo') }}</div>
      <el-row>
        <el-col :span="14">
          <el-form-item :label="tl('ruleName')">
            <el-input v-model="ruleValue.name" />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="tl('note')">
            <el-input type="textarea" v-model="ruleValue.description" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">
        {{ tl('filterData') }}
        <el-button size="mini" class="part-btn" @click="briefEditType = !briefEditType">
          {{ tl('changeSqlMethod') }}
        </el-button>
      </div>
      <template v-if="briefEditType">
        <el-row>
          <el-col :span="14">
            <el-form-item label="FROM(Data Source)">
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
            <el-form-item label="SELECT(Data Transformation)">
              <el-input type="textarea" v-model="sqlPartValue.select" />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="WHERE(Condition)">
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
            <el-form-item :label="'SQL'">
              <el-input type="textarea" rows="10" v-model="ruleValue.sql" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <div class="part-header">{{ tl('output') }}</div>
      <el-row>
        <el-col :span="14">
          <template v-for="(item, index) in ruleValue.outputs" :key="item">
            <div class="outputs-item">
              <span>
                <img
                  :src="getOutputImage(item.function ? item.function : item.split(':')[0])"
                  width="80"
                />
              </span>
              <span>
                <div v-if="!item.function">{{ item.split(':')[1] }}</div>
                <div class="output-desc">
                  {{ (item.function ? item.function : item.split(':')[0]).toUpperCase() }}
                </div>
              </span>
              <span class="output-op">
                <el-button size="mini" @click="openOutputDialog(true, index)">
                  {{ $t('Base.edit') }}
                </el-button>
                <el-button size="mini" type="danger" @click="deleteOutput(index)">
                  {{ $t('Base.delete') }}
                </el-button>
              </span>
            </div>
          </template>
          <div class="outputs-item add" @click="openOutputDialog(false)">
            <span>{{ tl('addOutput') }}</span>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <SQLTestDialog v-model="testDialog" :test-data="testParams" :chosen-event="chosenEvent" />
  <RuleOutputsDialog
    v-model="showOutputDialog"
    :output="currentOutputItem"
    :output-disable-list="outputDisableList"
    @submit="submitOutput"
  />
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
import { ref, Ref, onMounted, watch, useAttrs, useSlots, defineEmits, defineProps } from 'vue'
import { getBridgeList, getRuleEvents } from '@/api/ruleengine'
import { BridgeItem, RuleForm, BasicRule } from '@/types/rule'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash'
import { ElMessageBox as MB } from 'element-plus'
import parser from 'js-sql-parser'
import { MQTTBridgeDirection, RuleOutput } from '@/types/enum'
import SQLTestDialog from './SQLTestDialog.vue'
import RuleOutputsDialog from './RuleOutputsDialog.vue'
import { OutputItem } from '@/types/rule'
import SQLTemplateDrawer from './SQLTemplateDrawer.vue'

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
const showOutputDialog = ref(false)
const testDialog = ref(false)
const bridgeList = ref([])
const ingressBridgeList = ref([])
const ruleEventsList = ref([])
const outputLoading = ref(false)
const sqlFromType = ref('topic')
const outputDisableList: Ref<Array<string>> = ref([])
const editIndex: Ref<number | undefined> = ref(undefined)
const chosenEvent: Ref<RuleEvent> = ref({} as RuleEvent)
const briefEditType = ref(true)
const currentOutputItem: Ref<OutputItem | undefined> = ref(undefined)

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

const calcDisableList = () => {
  outputDisableList.value = []
  if (!Array.isArray(ruleValue.value.outputs)) {
    return
  }
  ruleValue.value.outputs?.forEach((v: OutputItem) => {
    if (typeof v === 'string') {
      outputDisableList.value.push(v)
    } else if (typeof v === 'object') {
      //republish can be duplicated
      if (v.function === RuleOutput.Republish) return
      v.function && outputDisableList.value.push(v.function)
    }
  })
}

const openOutputDialog: (edit: boolean, itemIndex?: number | undefined) => void = async (
  edit = false,
  itemIndex,
) => {
  showOutputDialog.value = true
  let item: OutputItem | undefined
  editIndex.value = itemIndex
  if (itemIndex !== undefined && Array.isArray(ruleValue.value.outputs)) {
    item = ruleValue.value.outputs?.[itemIndex]
  }
  if (edit) {
    currentOutputItem.value = item
  } else {
    currentOutputItem.value = undefined
  }
  calcDisableList()
}

const submitOutput = (opObj: OutputItem) => {
  const output = ruleValue.value.outputs || []
  if (Array.isArray(output)) {
    if (!currentOutputItem.value) {
      output.push(opObj)
    } else {
      editIndex.value !== undefined && output.splice(editIndex.value, 1, opObj)
    }
  }
  calcDisableList()
}

const deleteOutput = async (itemIndex: number | undefined) => {
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  if (itemIndex !== undefined && Array.isArray(ruleValue.value.outputs)) {
    ruleValue.value.outputs?.splice(itemIndex, 1)
    calcDisableList()
  }
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

const getOutputImage = (item: string) => {
  try {
    return require(`@/assets/img/${item}.png`)
  } catch (e) {
    //May it be a user defined module
    console.log('ImgErr:', e)
  }
}

onMounted(() => {
  loadIngressBridgeList()
  loadRuleEvents()
  syncData()
})
</script>

<style lang="scss" scoped>
.outputs-item {
  height: 92px;
  border: var(--el-border-base);
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;

  span:nth-child(2) {
    flex-grow: 1;

    div {
      line-height: 200%;
    }

    .output-desc {
      color: #5b5b5b;
    }
  }

  .output-op {
    padding: 0 10px;
    visibility: hidden;
  }

  &.add {
    justify-content: center;
  }
  &:first-of-type {
    margin-top: 20px;
  }
  &:hover {
    border-color: var(--el-color-primary);
    cursor: pointer;
    span {
      color: var(--el-color-primary);
      visibility: visible;
    }
  }
}

.edit-output {
  color: var(--el-color-primary);
  line-height: 50px;
  cursor: pointer;
}

.embedded-config {
  border: var(--el-border-base);
  padding: 30px;
}
.part-btn {
  margin-left: 15px;
}

.sql-ft {
  display: flex;
  justify-content: space-between;
}
</style>
