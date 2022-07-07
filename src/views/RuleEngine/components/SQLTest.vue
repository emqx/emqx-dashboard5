<template>
  <div class="sql-test">
    <div class="part-header">{{ tl('test') }}</div>
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('dataSource')">
            <div class="from-select-container">
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
              <el-tooltip effect="dark" :content="tl('viewSQL')" placement="top-start">
                <el-icon @click="viewSQLExample"><View /></el-icon>
              </el-tooltip>
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
            <div v-if="inputContextBy === InputContextType.JSON" class="monaco-container">
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
        <el-col :span="12">
          <el-form-item :label="tl('outputResult')">
            <div class="monaco-container">
              <Monaco :id="createRandomString()" v-model="testParams.output" lang="json" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <el-col :span="12">
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
        </el-col> -->
    <!-- <template #footer>
      <div class="ft-flex">
        <el-button type="primary" :lochangeLoading" @click="submitTest()">
          {{ $t('Base.test') }}
        </el-button>
        <div>
          <el-button @click="cancel">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" @click="save" v-if="canSave">
            {{ tl('useSQLInput') }}
          </el-button>
        </div>
      </div>
    </template> -->
    <el-dialog v-model="sqlDialog" custom-class="sql-dialog" :title="tl('sqlExample')">
      <p>{{ eventDesc }}</p>
      <code-view v-if="sqlDialog" lang="sql" :code="sqlExample" />
      <template #footer>
        <el-button @click="useSQL(sqlExample)">
          {{ tl('useSQL') }}
        </el-button>
        <el-button @click="copyText(sqlExample)">
          {{ $t('Base.copy') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import useCopy from '@/hooks/useCopy'

export default defineComponent({
  name: 'SQLTest',
})
</script>

<script setup lang="ts">
import { defineProps, computed, defineEmits, ref, Ref, PropType, watch, defineExpose } from 'vue'
import { testsql } from '@/api/ruleengine'
import Monaco from '@/components/Monaco.vue'
import { createRandomString, getKeywordsFromSQL } from '@/common/tools'
import {
  QuestionFilled,
  Refresh,
  MagicStick,
  EditPen,
  WarningFilled,
  View,
} from '@element-plus/icons-vue'
import TestSQLContextForm from './TestSQLContextForm.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage } from 'element-plus'
import FromSelect from '../components/FromSelect.vue'
import { BridgeItem, RuleEvent } from '@/types/rule'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { RuleInputType } from '@/types/enum'
import useDocLink from '@/hooks/useDocLink'
import CodeView from '@/components/CodeView.vue'

interface TestParams {
  context: Record<string, string>
  output: string
}

enum InputContextType {
  JSON,
  Form,
}

const { tl } = useI18nTl('RuleEngine')

const props = defineProps({
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
  customPayload: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['changeLoading', 'use-sql'])

const testParams: Ref<TestParams> = ref({
  context: {},
  output: '',
})
const contextObjStr: Ref<string> = ref('')
const inputContextBy = ref(InputContextType.JSON)
const dataType: Ref<string> = ref('')
const isDataTypeNoMatchSQL = ref(false)
let testColumnDescMap: Record<string, string> = {}
const sqlDialog = ref(false)
const sqlExample = ref('')
const eventDesc = ref('')
const tooltipForToggleBtn = computed(() =>
  tl(
    inputContextBy.value === InputContextType.JSON ? 'switchToFormEditing' : 'switchToJSONEditing',
  ),
)
const { TOPIC_EVENT, findInputTypeNTarget, getTestColumns, transFromStrToFromArr } = useRuleUtils()

/**
 * for compare form, prevent change context after SQL was changed
 */
let preFrom = ''

const setContextObjStr = () => {
  try {
    contextObjStr.value = JSON.stringify(testParams.value.context, null, 2)
    return Promise.resolve()
  } catch (error: any) {
    ElMessage.error(error?.toString())
    return Promise.reject()
  }
}

const setObjByStr = async () => {
  try {
    if (inputContextBy.value === InputContextType.JSON) {
      testParams.value.context = JSON.parse(contextObjStr.value)
    }
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

const { docMap } = useDocLink()
const goDoc = () => {
  window.open(docMap.sqlTest, '_blank')
}

const store = useStore()

const viewSQLExample = () => {
  sqlDialog.value = true
  props.eventList.forEach((e) => {
    if (e.event === dataType.value) {
      sqlExample.value = e.sql_example
      const lang = store.state.lang as 'zh' | 'en'
      eventDesc.value = e.description[lang]
    }
  })
}

const useSQL = (SQLContent: string) => {
  emits('use-sql', SQLContent)
  sqlDialog.value = false
}

const { copyText } = useCopy()

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
  const { fromStr } = getKeywordsFromSQL(props.sql)
  isDataTypeNoMatchSQL.value = !compareTargetNFromStr(type, target, fromStr)
  const { context } = getTestColumns(type, value, props.eventList || [])
  setContext(context)
}

watch(
  () => props.eventList,
  (value) => {
    handleDataSourceChanged({ value: dataType.value })
  },
)

const handleSQLChanged = () => {
  const { eventList = [], ingressBridgeList = [] } = props
  const { fromStr } = getKeywordsFromSQL(props.sql)
  const [firstInput = ''] = transFromStrToFromArr(fromStr)
  if (preFrom === firstInput) {
    return
  }
  preFrom = firstInput
  const { type: firstInputType } = findInputTypeNTarget(firstInput, eventList, ingressBridgeList)
  setDataType(firstInputType, firstInput)
  const { context } = getTestColumns(firstInputType, firstInput, eventList)
  setContext(context)
}

watch(
  () => props.sql,
  (value) => {
    handleSQLChanged()
  },
)

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
  await setObjByStr()
  emits('changeLoading', true)
  const context = {
    ...testParams.value.context,
    event_type: getEventTypeInContext(),
  }
  try {
    const res = await testsql({
      context,
      sql: props.sql,
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
  } catch (e) {
    // ignore error
  } finally {
    emits('changeLoading', false)
  }
}

defineExpose({
  submitTest,
})

const setDataType = (type: RuleInputType, firstInput: string) => {
  if (type === RuleInputType.Topic) {
    dataType.value = TOPIC_EVENT
  } else {
    dataType.value = firstInput
  }
  handleDataSourceChanged({ value: dataType.value })
}

const setDataTypeNContext = () => {
  const { sql, eventList, ingressBridgeList, customPayload: payload } = props
  const { fromStr } = getKeywordsFromSQL(sql)
  const [firstInput = ''] = transFromStrToFromArr(fromStr)
  const { type: inputType } = findInputTypeNTarget(firstInput, eventList, ingressBridgeList)
  const { context, descMap } = getTestColumns(inputType, firstInput, eventList)
  if ('payload' in context && payload) {
    context.payload = payload
  }

  preFrom = firstInput
  testColumnDescMap = descMap
  setDataType(inputType, firstInput)
  testParams.value = { context, output: '' }
}

setDataTypeNContext()
</script>

<style lang="scss">
.sql-test {
  width: 100%;
  .from-select-container {
    display: flex;
    position: absolute;
    align-items: center;
    top: -34px;
    left: 85px;
  }
  .sql-example-btn {
    margin-left: 6px;
  }
  .icon-warning {
    color: var(--el-color-warning);
    margin-left: 6px;
  }
  .context-handlers {
    position: absolute;
    float: left;
    top: -34px;
    right: 0;
    font-size: 16px;
    .el-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 2px;
      background-color: var(--color-bg-split);
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
  .monaco-container {
    height: 200px;
    margin-top: 12px;
  }
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
