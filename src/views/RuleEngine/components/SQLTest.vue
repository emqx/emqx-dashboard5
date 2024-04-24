<template>
  <div class="sql-test">
    <div class="test-header">
      <label>{{ tl('test') }}</label>
      <InfoTooltip :content="tl('testDesc')" />
      <p class="sub-block-desc">{{ tl('testTip') }}</p>
      <el-switch v-model="isTesting" />
    </div>
    <el-collapse-transition>
      <div v-show="isTesting">
        <div class="vertical-align-center radio-group-container">
          <!-- TODO: -->
          <label> Test Target </label>
          <el-radio-group v-model="testTarget" @change="handleTestMethodChanged">
            <el-radio-button :label="TestRuleTarget.SQL">SQL</el-radio-button>
            <el-radio-button :label="TestRuleTarget.Rule">Rule</el-radio-button>
          </el-radio-group>
        </div>
        <div class="vertical-align-center radio-group-container" v-if="isTestRule">
          <!-- TODO: -->
          <label>Input Data </label>
          <el-radio-group v-model="inputData" @change="handleTestMethodChanged">
            <el-radio-button :label="InputData.Mock">Mock</el-radio-button>
            <el-radio-button :label="InputData.Real">Real</el-radio-button>
          </el-radio-group>
        </div>
        <div class="test-header" v-if="isMockInput">
          <label class="test-label">
            {{ tl('dataSource') }}
            <InfoTooltip :content="tl('dataSourceDesc')" />
          </label>
          <p v-if="isDataTypeNoMatchSQL" class="no-match-tip">
            {{ tl('dataTypeSQLNoMatch') }}
          </p>
          <FromSelect
            v-model="dataType"
            :ingress-bridge-list="ingressBridgeList"
            :event-list="eventList"
            for-test
          />
        </div>
        <el-divider />
        <el-row class="input-output-row" :gutter="26">
          <!-- Input data -->
          <el-col :span="12" v-if="isMockInput">
            <label class="test-label">
              {{ tl('testData') }}
              <InfoTooltip :content="tl('testDataDesc')" />
            </label>
            <el-card shadow="never" class="test-card with-border">
              <TestSQLContextForm v-model="testParams.context" />
            </el-card>
          </el-col>
          <el-col :span="12" v-else>
            <!-- TODO: -->
            <label class="test-label">Testing With Real Data </label>
            <el-card shadow="never" class="test-card with-border tip-card">
              <!-- TODO: -->
              <p class="tip" v-if="!isTestStarted">Please click Start Test</p>
              <p class="tip" v-else>Waiting for real input to trigger rule...</p>
            </el-card>
          </el-col>
          <!-- Output -->
          <el-col :span="12" v-if="!isTestRule">
            <label class="test-label" shadow="none">
              {{ tl('outputResult') }}
              <InfoTooltip :content="tl('outputResultDesc')" />
            </label>
            <el-card class="test-result">
              <div class="result-hd">
                <el-tooltip effect="dark" placement="top" :content="t('Base.copy')">
                  <el-button type="primary" class="btn-copy" link>
                    <el-icon class="icon-copy" :size="18" @click="copyText(resultData)">
                      <copy-document />
                    </el-icon>
                  </el-button>
                </el-tooltip>
              </div>
              <div class="monaco-container">
                <Monaco
                  :id="createRandomString()"
                  v-model="resultData"
                  class="payload"
                  lang="json"
                />
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" v-else>
            <label class="test-label" shadow="none">
              {{ tl('outputResult') }}
              <InfoTooltip :content="tl('outputResultDesc')" />
            </label>
            <el-card class="test-result rule-result">
              <el-scrollbar :max-height="480">
                <div class="collapse-wrap">
                  <LogDataDisplay :log-data="logData" :rule-id="ruleData.id" />
                </div>
              </el-scrollbar>
            </el-card>
          </el-col>
        </el-row>
        <el-button
          v-if="!isTestRule && isMockInput"
          type="primary"
          :loading="testLoading"
          plain
          :icon="CaretRight"
          @click="submitTestSQL"
        >
          {{ tl('testsql') }}
        </el-button>
        <template v-if="isTestRule">
          <template v-if="!isTestStarted">
            <el-button type="primary" plain @click="startTest" :disabled="!savedAfterRuleChange">
              <!-- TODO: -->
              Start Test
            </el-button>
            <span v-if="!savedAfterRuleChange">Please save first</span>
          </template>
          <template v-else>
            <el-button v-if="isMockInput" type="primary" plain @click="submitTestRule">
              <!-- TODO: -->
              Submit Test
            </el-button>
            <el-button plain @click="stopTest">
              <!-- TODO: -->
              Stop Test
            </el-button>
          </template>
        </template>
        <el-button v-if="isMockInput" plain :icon="RefreshRight" @click="resetContext">
          {{ t('Base.reset') }}
        </el-button>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { testsql } from '@/api/ruleengine'
import { createRandomString, getKeywordsFromSQL, waitAMoment } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import useDebugRule, { useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useCopy from '@/hooks/useCopy'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleInputType, TestRuleTarget } from '@/types/enum'
import { BridgeItem, RuleEvent } from '@/types/rule'
import { CaretRight, CopyDocument, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import JSONbig from 'json-bigint'
import { PropType, Ref, computed, defineProps, onUnmounted, ref, watch } from 'vue'
import FromSelect from '../components/FromSelect.vue'
import LogDataDisplay from './LogDataDisplay.vue'
import TestSQLContextForm from './TestSQLContextForm.vue'

const enum InputData {
  Mock = 'mock',
  Real = 'real',
}

const JSONbigNative = JSONbig({ useNativeBigInt: true })

interface TestParams {
  context: Record<string, string>
  output: string
}

const { tl, t } = useI18nTl('RuleEngine')

const props = defineProps({
  isEdit: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  eventList: {
    type: Array as PropType<Array<RuleEvent>>,
    required: true,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
    required: true,
  },
  ruleData: {
    type: Object,
    required: true,
  },
})

const ruleSql = computed(() => props.ruleData?.sql || '')

const isTestRule = computed(() => testTarget.value === TestRuleTarget.Rule)
const { isTesting, savedAfterRuleChange, testTarget } = useStatusController()

const testLoading = ref(false)
const resultData = ref<string>('')

// const showTest = ref(true)
const testParams: Ref<TestParams> = ref({
  context: {},
  output: '',
})
const dataType: Ref<string> = ref('')
const isDataTypeNoMatchSQL = ref(false)
const { TOPIC_EVENT, findInputTypeNTarget, getTestColumns, transFromStrToFromArr } = useRuleUtils()

const { copyText } = useCopy()

const resetContext = () => {
  ElMessageBox.confirm(tl('confirmReset'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
    .then(() => {
      handleDataSourceChanged({ value: dataType.value })
    })
    .catch(() => {
      // ignore
    })
}

const compareTargetNFromStr = (
  targetType: RuleInputType,
  target: BridgeItem | RuleEvent | string,
  fromStr: string,
): boolean => {
  const inputs = transFromStrToFromArr(fromStr)
  const { eventList = [], ingressBridgeList = [] } = props
  const typeNeedToCompares = inputs.map((input) => {
    const { type: typeInSQL } = findInputTypeNTarget(input, eventList, ingressBridgeList)
    const typeNeedToCompare = typeInSQL === RuleInputType.Topic ? TOPIC_EVENT : input
    return typeNeedToCompare
  })
  // when comparing, if the type is topic, compare the TOPIC_EVENT;
  // if type is event, compare target.event
  // if type is bridge, compare bridge.id
  let targetStrToCompare = ''
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
  return typeNeedToCompares.includes(targetStrToCompare)
}

const setContext = (obj: Record<string, string>) => {
  testParams.value.context = obj
}

const handleDataSourceChanged = ({ value }: { value: string }) => {
  // The data type switch will not change the SQL, but if the data type does not match the SQL,
  // a warning will be issued indicating that the data type does not match the SQL
  const { eventList = [], ingressBridgeList = [] } = props
  const { type, target } = findInputTypeNTarget(value, eventList, ingressBridgeList)
  const { fromStr } = getKeywordsFromSQL(ruleSql.value)
  isDataTypeNoMatchSQL.value = !compareTargetNFromStr(type, target, fromStr)
  const { context } = getTestColumns(type, value, props.eventList || [])
  setContext(context)
}

watch(
  () => props.eventList,
  () => {
    handleDataSourceChanged({ value: dataType.value })
  },
)

const handleSQLChanged = (sql: string) => {
  const { eventList = [], ingressBridgeList = [] } = props
  const { type, target } = findInputTypeNTarget(dataType.value, eventList, ingressBridgeList)
  const { fromStr } = getKeywordsFromSQL(sql)
  isDataTypeNoMatchSQL.value = !compareTargetNFromStr(type, target, fromStr)
}

watch(ruleSql, (val) => {
  handleSQLChanged(val)
})

watch(dataType, (val) => {
  handleDataSourceChanged({ value: val })
})

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

const getMockContext = () => {
  return {
    ...testParams.value.context,
    event_type: getEventTypeInContext(),
  }
}

const submitTestSQL = async () => {
  testLoading.value = true
  let res
  try {
    res = await testsql({ context: getMockContext(), sql: ruleSql.value })
  } catch (error) {
    //
  }
  try {
    if (res) {
      resultData.value = JSONbigNative.stringify(JSONbigNative.parse(res), null, 2)
      ElMessage.success(tl('testPassed'))
    }
  } catch (e) {
    const err = e as Error
    ElMessage.error(err.toString())
  } finally {
    testLoading.value = false
  }
}

const setDataType = (type: RuleInputType, firstInput: string) => {
  if (type === RuleInputType.Topic) {
    dataType.value = TOPIC_EVENT
  } else {
    dataType.value = firstInput
  }
}

const setDataTypeNContext = () => {
  const { eventList, ingressBridgeList } = props
  const { fromStr } = getKeywordsFromSQL(ruleSql.value)
  const [firstInput = ''] = transFromStrToFromArr(fromStr)
  const { type: inputType } = findInputTypeNTarget(firstInput, eventList, ingressBridgeList)
  const { context } = getTestColumns(inputType, firstInput, eventList)
  setDataType(inputType, firstInput)
  testParams.value = { context, output: '' }
}

const inputData = ref<InputData>(InputData.Mock)
const isMockInput = computed(
  () => testTarget.value === TestRuleTarget.SQL || inputData.value === InputData.Mock,
)

const {
  logData,
  emptyLogArr,
  handleStopTest,
  isSucLog,
  isFailLog,
  startTestRuleUseMockData,
  submitMockDataForTestRule,
  startTestRuleUseRealData,
  setCbAfterPolling,
} = useDebugRule()

const scrollLogToBottom = async (log: string) => {
  if (log) {
    await waitAMoment()
    const lastLogItem = document.querySelector('.rule-result .el-collapse-item:last-child')
    if (lastLogItem) {
      lastLogItem.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const isTestStarted = ref(false)
const startTest = async () => {
  isTestStarted.value = true
  try {
    if (isMockInput.value) {
      await startTestRuleUseMockData(props.ruleData.id)
    } else {
      await startTestRuleUseRealData(props.ruleData.id)
    }
    setCbAfterPolling(scrollLogToBottom)
  } catch (error) {
    //
  }
}
const submitTestRule = async () => {
  try {
    await submitMockDataForTestRule(props.ruleData.id, getMockContext())
  } catch (error) {
    //
  }
}
const handleTestMethodChanged = (val: TestRuleTarget) => {
  emptyLogArr()
  stopTest()
}
const stopTest = () => {
  handleStopTest()
  isTestStarted.value = false
}

setDataTypeNContext()

watch(() => props.ruleData, stopTest)

onUnmounted(() => {
  isTesting.value = false
})
</script>

<style lang="scss">
.sql-test {
  width: 100%;
  .test-header {
    margin-bottom: 16px;
    position: relative;
  }
  .test-label {
    margin-bottom: 8px;
    display: block;
  }
  .from-select {
    width: 50%;
    margin-top: 8px;
  }
  .no-match-tip {
    color: var(--el-color-warning);
    position: absolute;
    top: -14px;
    right: 50%;
  }
  .input-output-row {
    margin-bottom: 24px;
  }
  .test-card {
    .el-card__body {
      padding-top: 0px;
      padding-bottom: 0px;
    }
  }
  .test-result {
    height: 490px;
    .monaco-container {
      height: 412px;
    }
    .result-hd {
      display: flex;
      justify-content: flex-end;
      padding: 8px 0;
    }
  }
  .tip-card {
    height: 490px;
    .el-card__body {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  // FIXME: remove
  .radio-group-container {
    margin: 12px 0;
    > label {
      margin-right: 20px;
    }
  }
  .el-collapse-item__header {
    .tip {
      margin-left: 8px;
      opacity: 0.7;
    }
  }
}
</style>
