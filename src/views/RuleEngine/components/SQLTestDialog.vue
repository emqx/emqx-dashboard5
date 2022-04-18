<template>
  <el-dialog
    :title="tl('testsql')"
    v-model="showDialog"
    top="60px"
    :width="1000"
    custom-class="SQL-test-dialog"
  >
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('testData')">
            <div class="label-container">
              <div class="from-select-container">
                <label>{{ tl('dataSource') }}</label>
                <FromSelect
                  v-model="dataType"
                  :ingress-bridge-list="ingressBridgeList"
                  :event-list="eventList"
                  @change="handleDataSourceChanged"
                  for-test
                />
                <el-tooltip
                  v-if="isDataTypeNoMatchSQL"
                  effect="dark"
                  :content="tl('dataTypeSQLNoMatch')"
                  placement="top-start"
                >
                  <el-icon class="icon-warning"><WarningFilled /></el-icon>
                </el-tooltip>
              </div>
              <div class="context-handlers">
                <el-tooltip effect="dark" :content="tl('doc')" placement="top-start">
                  <el-icon @click="goDoc"><QuestionFilled /></el-icon>
                </el-tooltip>
                <el-tooltip effect="dark" :content="tl('resetData')" placement="top-start">
                  <el-icon @click="resetContext"><Refresh /></el-icon>
                </el-tooltip>
                <el-tooltip effect="dark" :content="tl('formatJSON')" placement="top-start">
                  <el-icon @click="formatJSON"><MagicStick /></el-icon>
                </el-tooltip>
                <el-tooltip effect="dark" :content="tooltipForToggleBtn" placement="top-start">
                  <el-icon @click="toggleInputContextType"><EditPen /></el-icon>
                </el-tooltip>
              </div>
            </div>
            <div v-if="inputContextBy === InputContextType.JSON" class="monaco-container">
              <!-- <el-input type="textarea" rows="5" v-model="testParams.context" /> -->
              <Monaco
                :id="createRandomString()"
                v-model="contextObjStr"
                lang="json"
                :decoration-func="createLineDecoration"
              />
            </div>
            <TestSQLContextForm v-else v-model="testParams.context" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('testsql')">
            <div class="monaco-container">
              <Monaco
                :id="createRandomString()"
                v-model="testParams.sql"
                lang="sql"
                @change="handleSQLChanged"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('outputResult')">
            <div class="monaco-container">
              <Monaco :id="createRandomString()" v-model="testParams.output" lang="json" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="ft-flex">
        <el-button type="primary" :loading="testLoading" @click="submitTest()">
          {{ $t('Base.test') }}
        </el-button>
        <div>
          <el-button @click="cancel">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" @click="save" v-if="canSave">
            {{ $t('Base.save') }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'SQLTestDialog',
})
</script>

<script setup lang="ts">
import { defineProps, computed, defineEmits, WritableComputedRef, ref, Ref, PropType } from 'vue'
import { testsql } from '@/api/ruleengine'
import Monaco from '@/components/Monaco.vue'
import { createRandomString, getKeywordsFromSQL, parseJSONSafely } from '@/common/tools'
import { QuestionFilled, Refresh, MagicStick, EditPen } from '@element-plus/icons-vue'
import TestSQLContextForm from './TestSQLContextForm.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage } from 'element-plus'
import FromSelect from '../components/FromSelect.vue'
import { BridgeItem, RuleEvent } from '@/types/rule'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { WarningFilled } from '@element-plus/icons-vue'
import { RuleInputType } from '@/types/enum'

interface TestParams {
  context: Record<string, string>
  sql: string
  output: string
}

enum InputContextType {
  JSON,
  Form,
}

const { tl } = useI18nTl('RuleEngine')

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  sql: {
    type: String,
    default: '',
  },
  eventList: {
    type: Array as PropType<Array<RuleEvent>>,
    required: true,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
    required: true,
  },
  canSave: {
    type: Boolean,
    default: true,
  },
  customInput: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const testParams: Ref<TestParams> = ref({
  context: {},
  sql: '',
  output: '',
})
const contextObjStr: Ref<string> = ref('')
const testLoading = ref(false)
const inputContextBy = ref(InputContextType.JSON)
const dataType: Ref<string> = ref('')
const isDataTypeNoMatchSQL = ref(false)
let testColumnDescMap: Record<string, string> = {}

const showDialog: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const tooltipForToggleBtn = computed(() =>
  tl(
    inputContextBy.value === InputContextType.JSON ? 'switchToFormEditing' : 'switchToJSONEditing',
  ),
)

const { TOPIC_EVENT, findInputTypeNTarget, getTestColumns, transFromStrToFromArr } = useRuleUtils()

const setContextObjStr = () => {
  try {
    contextObjStr.value = JSON.stringify(testParams.value.context, null, 2)
    return Promise.resolve()
  } catch (error: any) {
    ElMessage.error(error?.toString())
    return Promise.reject()
  }
}

const setDataTypeNContext = () => {
  const { sql, eventList, ingressBridgeList, customInput: input } = props
  const { fromStr } = getKeywordsFromSQL(sql)
  const fromArr = transFromStrToFromArr(fromStr)
  const { type: inputType } = findInputTypeNTarget(fromArr[0], eventList, ingressBridgeList)
  const { context, descMap } = getTestColumns(inputType, fromArr[0], eventList)
  const customInput = input ? parseJSONSafely(input) : undefined

  testColumnDescMap = descMap
  if (inputType === RuleInputType.Topic) {
    dataType.value = TOPIC_EVENT
  } else {
    dataType.value = fromArr[0]
  }
  testParams.value = {
    sql,
    context: customInput ? customInput : context,
    output: '',
  }
}

const setObjByStr = async () => {
  try {
    testParams.value.context = JSON.parse(contextObjStr.value)
    return Promise.resolve()
  } catch (error: any) {
    ElMessage.error(error?.toString())
    return Promise.reject()
  }
}

const lineReg = /\s*"(\w+)":.+/
const createLineDecoration = (lineContent: string): string => {
  const matchRet = lineContent.match(lineReg)

  if (matchRet && matchRet.length >= 2) {
    const [totalStr, key] = matchRet
    return testColumnDescMap[key] || ''
  }
  return ''
}

const goDoc = () => {
  // TODO:
  window.open('https://www.emqx.io', '_blank')
}

const resetContext = () => {
  handleDataSourceChanged({ value: dataType.value })
  if (inputContextBy.value === InputContextType.JSON) {
    setContextObjStr()
  }
}

const formatJSON = () => {
  try {
    contextObjStr.value = JSON.stringify(JSON.parse(contextObjStr.value), null, 2)
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

const toggleInputContextType = async () => {
  if (inputContextBy.value === InputContextType.JSON) {
    await setObjByStr()
    inputContextBy.value = InputContextType.Form
  } else {
    await setContextObjStr()
    inputContextBy.value = InputContextType.JSON
  }
}

const compareTargetNFromStr = (
  targetType: RuleInputType,
  target: BridgeItem | RuleEvent | string,
  fromStr: string,
): boolean => {
  const inputs = transFromStrToFromArr(fromStr)
  let targetStrToCompare = ''

  if (inputs.length > 1) {
    return false
  }

  const { eventList = [], ingressBridgeList = [] } = props
  const { type: typeInSQL } = findInputTypeNTarget(inputs[0], eventList, ingressBridgeList)
  const typeNeedToCompare = typeInSQL === RuleInputType.Topic ? TOPIC_EVENT : inputs[0]
  // when comparing, if the type is topic, compare the TOPIC_EVENT;
  // if type is event, compare target.event
  // if type is bridge, compare bridge.id
  switch (targetType) {
    case RuleInputType.Topic:
      targetStrToCompare = target as string
      break
    case RuleInputType.Event:
      targetStrToCompare = (target as RuleEvent).event
      break
    case RuleInputType.Bridge:
      targetStrToCompare = (target as BridgeItem).idForRuleFrom
      break
  }
  return targetStrToCompare === typeNeedToCompare
}

const setContext = (obj: Record<string, string>) => {
  testParams.value.context = obj
  setContextObjStr()
}

const handleDataSourceChanged = ({ value }: { value: string }) => {
  // The data type switch will not change the SQL, but if the data type does not match the SQL,
  // a warning will be issued indicating that the data type does not match the SQL
  const { eventList = [], ingressBridgeList = [] } = props

  const { type, target } = findInputTypeNTarget(value, eventList, ingressBridgeList)
  const { fromStr } = getKeywordsFromSQL(testParams.value.sql)
  isDataTypeNoMatchSQL.value = !compareTargetNFromStr(type, target, fromStr)

  const { context } = getTestColumns(type, value, props.eventList || [])
  setContext(context)
}

const handleSQLChanged = () => {
  const { eventList = [], ingressBridgeList = [] } = props

  const { fromStr } = getKeywordsFromSQL(testParams.value.sql)
  const inputs = transFromStrToFromArr(fromStr)
  const { type: firstInputType } = findInputTypeNTarget(inputs[0], eventList, ingressBridgeList)
  dataType.value = inputs[0]

  const { context } = getTestColumns(firstInputType, inputs[0], eventList)
  setContext(context)
}

const getEventTypeInContext = () => {
  const { eventList = [], ingressBridgeList = [] } = props
  const { type, target } = findInputTypeNTarget(dataType.value, eventList, ingressBridgeList)
  if (type === RuleInputType.Event) {
    return dataType.value.match(/(\$events\/)([\w]+)/)?.[2]
  }
  if (type === RuleInputType.Bridge) {
    return `$bridges/${(target as BridgeItem).type}:*`
  }
  return TOPIC_EVENT.match(/(\$events\/)([\w]+)/)?.[2]
}

const submitTest = async () => {
  testLoading.value = true
  const context = {
    ...testParams.value.context,
    event_type: getEventTypeInContext(),
  }
  const res = await testsql({
    context,
    sql: testParams.value.sql,
  }).catch((e) => {
    testParams.value.output = e
  })

  if (res) {
    try {
      const text = JSON.stringify(res, null, 2)
      testParams.value.output = text
    } catch (e) {
      console.log(e)
      testParams.value.output = res
    }
  }
  testLoading.value = false
}

const save = () => {
  emit('save', testParams.value.sql)
  cancel()
}

const cancel = () => {
  showDialog.value = false
}

watch(showDialog, (val) => {
  if (val) {
    setDataTypeNContext()
    setContextObjStr()
  }
})
</script>

<style lang="scss" scoped>
.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}
.from-select-container {
  display: flex;
  align-items: center;
  label {
    flex-shrink: 0;
    padding-right: 16px;
    color: var(--el-text-color-secondary);
  }
}
.icon-warning {
  color: var(--el-color-warning);
}
.context-handlers {
  .el-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    background-color: #f1f1f1;
    cursor: pointer;
    &:not(:last-child) {
      margin-right: 4px;
    }
  }
}
.monaco-container {
  height: 180px;
}
.ft-flex {
  display: flex;
  justify-content: space-between;
}
</style>

<style lang="scss">
.SQL-test-dialog {
  .el-dialog__body {
    padding-top: 8px;
    padding-bottom: 4px;
  }
}
</style>
