import { addTrace, deleteTrace, getTraceLog } from '@/api/diagnose'
import { applyRuleTest, createRules, updateRules } from '@/api/ruleengine'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import useI18nTl from '@/hooks/useI18nTl'
import useSyncPolling from '@/hooks/useSyncPolling'
import { TraceRecord } from '@/types/diagnose'
import { RuleOutput, TraceEncodeType } from '@/types/enum'
import { stringifyObjSafely } from '@emqx/shared-ui-utils'
import { isFunction, startCase } from 'lodash'
import moment from 'moment'
import { onUnmounted, ref } from 'vue'
import useBridgeTypeValue from '../bridge/useBridgeTypeValue'

const BYTE_PER_PAGE = Math.pow(2, 30)

export default () => {
  const { tl } = useI18nTl('RuleEngine')

  let traceName = ''

  const { getRuleDataForUpdate } = useRuleForm()
  /**
   * Create or update rule
   */
  const submitRule = (rule: any, isCreate: boolean) => {
    return isCreate ? createRules(rule) : updateRules(rule.id, getRuleDataForUpdate(rule))
  }

  const deleteCurrentTrace = async () => {
    try {
      if (traceName) {
        await deleteTrace(traceName)
        traceName = ''
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
        formatter: 'json',
      }
      const { name } = await addTrace(traceData)
      logArr.value = []
      traceName = name
      window.addEventListener('beforeunload', deleteCurrentTrace)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logArr = ref<Array<Record<string, any>>>([])

  const { getGeneralTypeLabel } = useBridgeTypeValue()
  const funcLabelMap = new Map([
    [RuleOutput.Console, tl('consoleOutput')],
    [RuleOutput.Republish, tl('republish')],
  ])
  const getLogItemTitle = (item: Record<string, any>) => {
    return startCase(item.msg)
  }
  const getLogSubInfo = (item: Record<string, any>) => {
    const actionInfo = item?.meta?.action_info || {}
    if (actionInfo.type && actionInfo.name) {
      return `${getGeneralTypeLabel(actionInfo.type)}: ${actionInfo.name}`
    }
    if (actionInfo.func) {
      return `${funcLabelMap.get(actionInfo.func) || actionInfo.func}`
    }
  }
  const generateLogArr = (logStr: string): Array<Record<string, any>> => {
    if (logStr) {
      return logStr
        .split('\n')
        .filter(Boolean)
        .map((item) => {
          const obj = JSON.parse(item)
          return {
            ...obj,
            title: getLogItemTitle(obj),
            subInfo: getLogSubInfo(obj),
            rawData: stringifyObjSafely(obj, 2),
          }
        })
    }
    return []
  }
  const isSucLog = (item: Record<string, any>) => {
    return item?.meta?.result === 'ok'
  }
  const isFailLog = (item: Record<string, any>) => {
    return !!item?.meta?.reason
  }

  let cbAfterPolling: undefined | ((log: string) => void) = undefined
  const setCbAfterPolling = (cb: (logContent: string) => void) => {
    cbAfterPolling = cb
  }

  let logLastPosition = 0
  const getNewestLog = async () => {
    try {
      const { items, meta } = await getTraceLog(traceName, {
        bytes: BYTE_PER_PAGE,
        position: logLastPosition,
      })
      const arr = generateLogArr(items)
      logArr.value.push(...arr)
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
    submitRule,
    logArr,
    handleStopTest,
    getLogItemTitle,
    isSucLog,
    isFailLog,
    startTestRuleUseMockData,
    submitMockDataForTestRule,
    startTestRuleUseRealData,
    setCbAfterPolling,
  }
}
