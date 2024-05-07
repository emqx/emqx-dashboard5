import { addTrace, deleteTrace, getTraceLog } from '@/api/diagnose'
import { applyRuleTest } from '@/api/ruleengine'
import useSyncPolling from '@/hooks/useSyncPolling'
import { TraceRecord } from '@/types/diagnose'
import { LogTraceFormatter, TraceEncodeType } from '@/types/enum'
import { BasicRule, RuleItem } from '@/types/rule'
import { cloneDeep, debounce, isArray, isEqual, isFunction, mergeWith, startCase } from 'lodash'
import moment from 'moment'
import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import type { FormattedLog, LogItem } from './useFormatDebugLog'
import useFormatDebugLog from './useFormatDebugLog'

const BYTE_PER_PAGE = Math.pow(2, 30)

export default () => {
  let traceName = ''
  let traceStartTime: undefined | number = undefined

  const logData = ref<FormattedLog>({})
  const emptyLogData = () => {
    logData.value = {}
  }

  const deleteCurrentTrace = async () => {
    try {
      if (traceName) {
        await deleteTrace(traceName)
        traceName = ''
        traceStartTime = undefined
        window.removeEventListener('beforeunload', deleteCurrentTrace)
      }
    } catch (error) {
      //
    }
  }
  /**
   * Create trace before get trace log
   */
  const createTrace = async (ruleId: string) => {
    try {
      deleteCurrentTrace()
      const nowTimestamp = new Date().getTime()
      const oneDayLaterTimestamp = nowTimestamp + 24 * 60 * 60 * 1000
      const traceData: TraceRecord = {
        name: `DEBUG_RULE_${ruleId}_${moment().format('YYYYMMDD_HHmmssSSS')}`,
        type: 'ruleid',
        ruleid: ruleId,
        payload_encode: TraceEncodeType.Text,
        start_at: new Date().toISOString(),
        end_at: new Date(oneDayLaterTimestamp).toISOString(),
        formatter: LogTraceFormatter.JSON,
      }
      const { name } = await addTrace(traceData)
      emptyLogData()
      traceName = name
      traceStartTime = nowTimestamp
      window.addEventListener('beforeunload', deleteCurrentTrace)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getLogItemTitle = (item: Record<string, any>) => {
    return startCase(item.msg)
  }
  const { convertLogStrToLogArr, filterExpiredLog, formatLog, detectTotalLogResult } =
    useFormatDebugLog()

  let cbAfterPolling: undefined | ((log: string) => void) = undefined
  const setCbAfterPolling = (cb: (logContent: string) => void) => {
    cbAfterPolling = cb
  }

  const mergeCustomize = (arr1: Array<LogItem>, arr2: Array<LogItem>) => {
    if (isArray(arr1) && isArray(arr2)) {
      return arr1.concat(arr2)
    }
  }
  const addNewLogToCurrentLog = (currentLog: FormattedLog, newLog: FormattedLog) => {
    const ret = mergeWith(currentLog, newLog, mergeCustomize)
    // calc total result
    Object.values(ret).forEach((logData) => {
      logData.result = detectTotalLogResult(Object.values(logData.info).map(({ result }) => result))
    })
    return ret
  }

  let logLastPosition = 0
  const getNewestLog = async () => {
    try {
      const { items, meta } = await getTraceLog(traceName, {
        bytes: BYTE_PER_PAGE,
        position: logLastPosition,
      })
      const logArr = convertLogStrToLogArr(items)
      const filteredLogArr = traceStartTime ? filterExpiredLog(logArr, traceStartTime) : logArr
      const data = formatLog(filteredLogArr)
      logData.value = addNewLogToCurrentLog(logData.value, data)
      logLastPosition = meta.position
      if (isFunction(cbAfterPolling)) {
        cbAfterPolling(items)
      }
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
      //
    }
  }

  const { needPolling, syncPolling } = useSyncPolling()
  needPolling.value = false
  const startPolling = () => {
    syncPolling(getNewestLog, 1500)
  }

  /**
   * If testing with mock data, poll after submitting mock data
   */
  const startTestRuleUseMockData = (ruleId: string) => {
    createTrace(ruleId)
  }
  const submitMockDataForTestRule = async (ruleId: string, data: Record<string, any>) => {
    try {
      await applyRuleTest(ruleId, data)
      if (!needPolling.value) {
        needPolling.value = true
        startPolling()
      }
    } catch (error) {
      //
    }
  }

  /**
   * If testing with real data, polling starts when clicking start test
   */
  const startTestRuleUseRealData = (ruleId: string) => {
    try {
      createTrace(ruleId)
      if (!needPolling.value) {
        needPolling.value = true
        startPolling()
      }
    } catch (error) {
      //
    }
  }

  const handleStopTest = () => {
    deleteCurrentTrace()
    needPolling.value = false
    logLastPosition = 0
  }

  onUnmounted(() => {
    if (needPolling.value) {
      needPolling.value = false
    }
    deleteCurrentTrace()
  })

  return {
    logData: logData,
    emptyLogArr: emptyLogData,
    handleStopTest,
    getLogItemTitle,
    startTestRuleUseMockData,
    submitMockDataForTestRule,
    startTestRuleUseRealData,
    setCbAfterPolling,
  }
}

export const useStatusController = (rule?: Ref<BasicRule | RuleItem>) => {
  const { state, commit, getters } = useStore()
  const isTesting = computed({
    get() {
      return state.isTesting
    },
    set(val) {
      commit('SET_IS_TESTING', val)
    },
  })
  const savedAfterRuleChange = computed({
    get() {
      return state.savedAfterRuleChange
    },
    set(val) {
      commit('SET_SAVED_AFTER_RULE_CHANGE', val)
    },
  })
  const testTarget = computed({
    get() {
      return state.testRuleTarget
    },
    set(val) {
      commit('SET_TEST_RULE_TARGET', val)
    },
  })

  const isRuleSaveButtonDisabled = computed(() => getters.isRuleSaveButtonDisabled)

  const lastSavedRule: Ref<BasicRule | RuleItem | undefined> = ref(
    (rule && rule.value) || undefined,
  )
  const updateSavedRule = (savedRule: BasicRule | RuleItem) => {
    savedAfterRuleChange.value = isEqual(savedRule, rule?.value)
    lastSavedRule.value = cloneDeep(savedRule)
  }

  const compareRuleAndUpdateSavedStatus = () => {
    savedAfterRuleChange.value = isEqual(lastSavedRule.value, rule?.value)
  }

  const handleRuleChanged = debounce(compareRuleAndUpdateSavedStatus, 300)

  if (rule) {
    watch(rule, handleRuleChanged)
  }

  return {
    isTesting,
    savedAfterRuleChange,
    testTarget,
    isRuleSaveButtonDisabled,
    updateSavedRule,
  }
}
