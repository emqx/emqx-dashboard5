import { addTrace, deleteTrace, getTraceLog, getTraceNodesMsg } from '@/api/diagnose'
import { applyRuleTest } from '@/api/ruleengine'
import { getKeywordsFromSQL } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import useSyncPolling from '@/hooks/useSyncPolling'
import { TraceRecord } from '@/types/diagnose'
import {
  EventForRule,
  LogTraceFormatter,
  RuleInputType,
  TestRuleTarget,
  TraceEncodeType,
} from '@/types/enum'
import { BasicRule, BridgeItem, RuleEvent, RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import { ElMessageBox } from 'element-plus'
import { cloneDeep, debounce, isArray, isEqual, mergeWith, startCase } from 'lodash'
import dayjs from 'dayjs'
import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import type { FormattedLog, LogItem } from './useFormatDebugLog'
import useFormatDebugLog from './useFormatDebugLog'
import { useRuleUtils } from './useRule'
import useRuleEvents from './useRuleEvents'

const BYTE_PER_PAGE = Math.pow(2, 30)

export default (): {
  logData: Ref<FormattedLog>
  emptyLogArr: () => void
  handleStopTest: () => void
  getLogItemTitle: (item: Record<string, any>) => string
  submitMockDataForTestRule: (ruleId: string, data: Record<string, any>) => Promise<any>
  startTest: (ruleId: string) => Promise<void>
} => {
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
        name: `DEBUG_RULE_${ruleId}_${dayjs().format('YYYYMMDD_HHmmssSSS')}`,
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

  const logLastPositionMap: Map<string, number> = new Map()
  const getCurrentTraceNodesMsg = async () => {
    try {
      if (!traceName) {
        return Promise.reject()
      }
      const data = await getTraceNodesMsg(traceName)
      const currentNodes = data.map(({ node }) => node)
      logLastPositionMap.forEach((position, node) => {
        if (!currentNodes.includes(node)) {
          logLastPositionMap.delete(node)
        }
      })
      data.forEach(({ node }) => {
        if (!logLastPositionMap.has(node)) {
          logLastPositionMap.set(node, 0)
        }
      })
    } catch (error) {
      //
    }
  }
  const getNewestLog = async () => {
    try {
      await getCurrentTraceNodesMsg()
      if (!needPolling.value) {
        return
      }
      logLastPositionMap.forEach(async (position, node) => {
        const { items, meta } = await getTraceLog(traceName, {
          node,
          bytes: BYTE_PER_PAGE,
          position: position,
        })
        const logArr = convertLogStrToLogArr(items)
        const filteredLogArr = traceStartTime ? filterExpiredLog(logArr, traceStartTime) : logArr
        const data = formatLog(filteredLogArr)
        logData.value = addNewLogToCurrentLog(logData.value, data)
        logLastPositionMap.set(node, meta.position)
      })
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

  const submitMockDataForTestRule = (ruleId: string, data: Record<string, any>) => {
    return applyRuleTest(ruleId, data)
  }

  /**
   * If testing with real data, polling starts when clicking start test
   */
  const startTest = async (ruleId: string) => {
    try {
      await createTrace(ruleId)
      if (!needPolling.value) {
        needPolling.value = true
        startPolling()
      }
    } catch (error) {
      //
    }
  }

  const handleStopTest = () => {
    needPolling.value = false
    logLastPositionMap.clear()
    deleteCurrentTrace()
  }

  onUnmounted(() => {
    if (needPolling.value) {
      needPolling.value = false
    }
    deleteCurrentTrace()
  })

  return {
    logData,
    emptyLogArr: emptyLogData,
    handleStopTest,
    getLogItemTitle,
    submitMockDataForTestRule,
    startTest,
  }
}

type DataType = BasicRule | RuleItem | { nodes: Array<Node>; edges: Array<Edge> }
export const useStatusController = (
  data?: Ref<DataType>,
): {
  isTesting: WritableComputedRef<boolean>
  savedAfterDataChange: WritableComputedRef<boolean>
  testTarget: WritableComputedRef<TestRuleTarget>
  isDataSaveButtonDisabled: ComputedRef<boolean>
  updateSavedData: (savedRule: DataType) => void
} => {
  const { state, commit, getters } = useStore()
  const isTesting = computed<boolean>({
    get() {
      return state.isTesting
    },
    set(val) {
      commit('SET_IS_TESTING', val)
    },
  })
  const savedAfterDataChange = computed<boolean>({
    get() {
      return state.savedAfterDataChange
    },
    set(val) {
      commit('SET_SAVED_AFTER_DATA_CHANGE', val)
    },
  })
  const testTarget = computed<TestRuleTarget>({
    get() {
      return state.testRuleTarget
    },
    set(val) {
      commit('SET_TEST_RULE_TARGET', val)
    },
  })

  const isDataSaveButtonDisabled = computed<boolean>(() => getters.isDataSaveButtonDisabled)

  const lastSavedData = ref<DataType | undefined>((data && data.value) || undefined)
  const updateSavedData = (savedData: DataType) => {
    savedAfterDataChange.value = isEqual(savedData, data?.value)
    lastSavedData.value = cloneDeep(savedData)
  }

  const compareDataAndUpdateSavedStatus = () => {
    savedAfterDataChange.value = isEqual(lastSavedData.value, data?.value)
  }

  const handleDataChanged = debounce(compareDataAndUpdateSavedStatus, 300)

  if (data) {
    watch(data, handleDataChanged)
  }

  return {
    isTesting,
    savedAfterDataChange,
    testTarget,
    isDataSaveButtonDisabled,
    updateSavedData,
  }
}

interface TestParams {
  context: Record<string, string>
}

export const useMockData = (
  props: Readonly<{
    ingressBridgeList: BridgeItem[]
    ruleData: Record<string, any>
  }>,
): {
  ruleSql: ComputedRef<string>
  dataType: Ref<string>
  testParams: Ref<TestParams>
  isDataTypeNoMatchSQL: Ref<boolean>
  eventList: Ref<Array<RuleEvent>>
  isFormModified: ComputedRef<boolean>
  resetContext: () => void
  getMockContext: () => Record<string, any>
  setDataTypeNContext: () => void
} => {
  const { tl, t } = useI18nTl('RuleEngine')

  const eventList = ref<Array<RuleEvent>>([])

  const ruleSql = computed(() => props.ruleData?.sql || '')
  const testParams: Ref<TestParams> = ref({ context: {} })

  /**
   * Used to check if the form has been modified
   */
  const initialTestParams = ref<null | Record<string, any>>(null)
  const isFormModified = computed(() => {
    if (!initialTestParams.value) {
      return false
    }
    return !isEqual(testParams.value, initialTestParams.value)
  })

  const dataType: Ref<string> = ref('')
  const isDataTypeNoMatchSQL = ref(false)

  const { getEventList } = useRuleEvents()
  const loadRuleEvents = async () => {
    try {
      eventList.value = await getEventList()
    } catch (error) {
      console.error(error)
    }
  }

  const { TOPIC_EVENT, findInputTypeNTarget, getTestColumns, transFromStrToFromArr } =
    useRuleUtils()

  const findSourceTypeAndTarget = (fromTarget: string) =>
    findInputTypeNTarget(fromTarget, eventList.value, props.ingressBridgeList)

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

  const setContext = (obj: Record<string, string>) => {
    testParams.value.context = obj
    initialTestParams.value = cloneDeep(testParams.value)
  }

  const compareTargetNFromStr = (
    targetType: RuleInputType,
    target: BridgeItem | RuleEvent | string,
    fromStr: string,
  ): boolean => {
    const inputs = transFromStrToFromArr(fromStr)
    const typeNeedToCompares = inputs.map((input) => {
      const { type: typeInSQL } = findSourceTypeAndTarget(input)
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

  const handleDataSourceChanged = ({ value }: { value: string }) => {
    // The data type switch will not change the SQL, but if the data type does not match the SQL,
    // a warning will be issued indicating that the data type does not match the SQL
    const { type, target } = findSourceTypeAndTarget(value)
    const { fromStr } = getKeywordsFromSQL(ruleSql.value)
    isDataTypeNoMatchSQL.value = !compareTargetNFromStr(type, target, fromStr)
    const { context } = getTestColumns(type, value, eventList.value || [])
    setContext(context)
  }

  const handleSQLChanged = (sql: string) => {
    const { type, target } = findSourceTypeAndTarget(dataType.value)
    const { fromStr } = getKeywordsFromSQL(sql)
    isDataTypeNoMatchSQL.value = !compareTargetNFromStr(type, target, fromStr)
  }

  const getEventTypeInContext = () => {
    const { type, target } = findSourceTypeAndTarget(dataType.value)
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

  const setDataType = (type: RuleInputType, firstInput: string) => {
    if (type === RuleInputType.Topic) {
      dataType.value = TOPIC_EVENT
    } else if (type === RuleInputType.Bridge) {
      dataType.value = EventForRule.MessagePublish
    } else {
      dataType.value = firstInput
    }
  }
  const setDataTypeNContext = () => {
    const { fromStr } = getKeywordsFromSQL(ruleSql.value)
    const [firstInput = ''] = transFromStrToFromArr(fromStr)
    const { type: inputType } = findSourceTypeAndTarget(firstInput)
    const { context } = getTestColumns(inputType, firstInput, eventList.value)
    setDataType(inputType, firstInput)
    testParams.value = { context }
  }

  watch(
    () => eventList.value,
    () => {
      handleDataSourceChanged({ value: dataType.value })
    },
  )

  watch(ruleSql, (val) => {
    handleSQLChanged(val)
  })

  watch(dataType, (val) => {
    handleDataSourceChanged({ value: val })
  })

  loadRuleEvents()

  return {
    ruleSql,
    dataType,
    testParams,
    isDataTypeNoMatchSQL,
    eventList,
    isFormModified,
    resetContext,
    getMockContext,
    setDataTypeNContext,
  }
}
