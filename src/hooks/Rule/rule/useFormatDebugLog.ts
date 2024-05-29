import { getBridgeKey } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType, LogResult, RuleOutput } from '@/types/enum'
import { stringifyObjSafely } from '@emqx/shared-ui-utils'
import { groupBy, get, omit, startCase } from 'lodash'

/**
 * Some Special Log Msg
 * The list is not exhaustive
 */
export const enum LogMsg {
  RuleActivated = 'rule_activated',
  SQLSelectClauseException = 'SELECT_clause_exception',
  SQLWhereClauseException = 'WHERE_clause_exception',
  SQLForeachClauseException = 'FOREACH_clause_exception',
  SQLIncaseClauseException = 'INCASE_clause_exception',
  ApplyRuleFailed = 'apply_rule_failed',
  SQLYieldedResult = 'SQL_yielded_result',
  SQLYieldedNoResult = 'SQL_yielded_no_result',
  StopRendering = 'action_stopped_after_template_rendering',
  ActionSuccess = 'action_success',
  ActionTemplateRendered = 'action_template_rendered',
  AsyncSendMsgToRemoteNode = 'async_send_msg_to_remote_node',
  OutOfService = 'out_of_service',
  ActionFailed = 'action_failed',
  RequestExpired = 'request_expired',
  RecursiveRepublishDetected = 'recursive_republish_detected',
  /* Do Not Need Start */
  CallActionFunction = 'call_action_function',
  RepublishMessage = 'republish_message',
  PublishTo = 'publish_to',
  BridgeAction = 'bridge_action',
  HTTPConnectorReceived = 'http_connector_received',
  /* Do Not Need End */
}
const EXCLUDED_LOGS = [
  LogMsg.CallActionFunction,
  LogMsg.RepublishMessage,
  LogMsg.PublishTo,
  LogMsg.BridgeAction,
  LogMsg.HTTPConnectorReceived,
  LogMsg.AsyncSendMsgToRemoteNode,
]

const ERROR_LOG_MSGS = [LogMsg.OutOfService, LogMsg.RecursiveRepublishDetected]

const RULE_LOGS = [
  LogMsg.RuleActivated,
  LogMsg.SQLSelectClauseException,
  LogMsg.SQLWhereClauseException,
  LogMsg.SQLForeachClauseException,
  LogMsg.SQLIncaseClauseException,
  LogMsg.ApplyRuleFailed,
  LogMsg.SQLYieldedResult,
  LogMsg.SQLYieldedNoResult,
]

export interface LogItem {
  time: string
  msg: LogMsg
  meta: Record<string, any>
  level: string
}

export const LogTargetType = {
  Rule: 'rule',
  Console: RuleOutput.Console,
  Republish: RuleOutput.Republish,
  Action: RuleOutput.DataBridge,
}
export type LogTargetTypeValue = typeof LogTargetType[keyof typeof LogTargetType]

export interface TargetLogInfo {
  [key: string]: {
    time: string
    logContent: Record<string, any>
  }
}
export interface TargetLog {
  target: string
  result: LogResult
  type: LogTargetTypeValue
  targetInfo?: {
    type?: string
    name?: string
    func?: string
    topic?: string
  }
  info: TargetLogInfo
  rawLogArr: Array<LogItem>
}
export interface TargetLogMap {
  /**
   * action id or rule id
   */
  [key: string]: TargetLog
}

export interface FormattedLog {
  /**
   * trigger time
   */
  [key: string]: {
    result: LogResult
    trigger: { event?: string; topic?: string }
    info: TargetLogMap
  }
}

type TargetLogGenerator = (log: TargetLogInfo) => TargetLogInfo

/**
 * return true is ok, false is error
 */
const detectLogItemResult = (log: LogItem): boolean => {
  if (log.meta.reason) {
    return log.msg !== LogMsg.StopRendering ? false : true
  } else if (ERROR_LOG_MSGS.includes(log.msg)) {
    return false
  }
  return true
}

const detectRuleExecLogArrResult = (logArr: Array<LogItem>): LogResult => {
  for (const item of logArr) {
    if (item.msg === LogMsg.SQLYieldedNoResult) {
      return LogResult.NoResult
    }
    if (item.meta.reason) {
      return LogResult.Error
    }
  }
  return LogResult.OK
}

const detectActionLogArrResult = (logArr: Array<LogItem>): LogResult => {
  if (
    logArr.length === 0 ||
    logArr.every(({ meta, msg }) => !meta.result && !meta.reason && msg !== LogMsg.OutOfService)
  ) {
    return LogResult.Pending
  }
  return logArr.every(detectLogItemResult) ? LogResult.OK : LogResult.Error
}

const neededInfoMap = new Map([
  [LogMsg.RuleActivated, 'meta.input'],
  [LogMsg.SQLYieldedResult, 'meta.result'],
  [LogMsg.SQLSelectClauseException, 'meta'],
  [LogMsg.SQLWhereClauseException, 'meta'],
  [LogMsg.SQLForeachClauseException, 'meta'],
  [LogMsg.SQLIncaseClauseException, 'meta'],
  [LogMsg.ApplyRuleFailed, 'meta'],
])

export default (): {
  convertLogStrToLogArr: (logStr: string) => Array<LogItem>
  filterExpiredLog: (logArr: Array<LogItem>, startTimestamp: number) => Array<LogItem>
  detectTotalLogResult: (resultArr: Array<LogResult>) => LogResult
  formatLog: (logArr: Array<LogItem>) => FormattedLog
} => {
  const convertLogStrToLogArr = (logStr: string): Array<LogItem> =>
    logStr
      .split('\n')
      .filter(Boolean)
      .map((item) => JSON.parse(item))

  const findTrigger = (totalLogArr: Array<LogItem>) => {
    const log = totalLogArr.find((item) => item.msg === LogMsg.RuleActivated)
    if (log) {
      const { event, topic } = log.meta?.input || {}
      return { event, topic }
    }
    return {}
  }

  const getLogTypeAndTarget = (
    log: LogItem,
  ): { target: string; type: LogTargetTypeValue; targetInfo?: TargetLog['targetInfo'] } => {
    if (log.meta.action_info && !RULE_LOGS.includes(log.msg)) {
      const { type, name, func, args } = log.meta.action_info
      if (type && name) {
        return {
          target: getBridgeKey({ type, name }),
          type: LogTargetType.Action,
          targetInfo: { type, name },
        }
      }
      if (func === RuleOutput.Republish && args.topic) {
        return {
          target: `${func}:${args.topic}`,
          type: LogTargetType.Republish,
          targetInfo: { topic: args.topic, func },
        }
      }
      return { target: func, type: LogTargetType.Console, targetInfo: { func } }
    }
    return { target: log.meta.rule_id || log.meta.rule_ids?.[0], type: LogTargetType.Rule }
  }

  const ruleLogMsgOrder: Map<string, number> = new Map([[LogMsg.RuleActivated, 99]])
  const handleRuleExecLogInfo: TargetLogGenerator = (log) => {
    return Object.keys(log)
      .sort((a, b) => (ruleLogMsgOrder.get(a) || 0) - (ruleLogMsgOrder.get(b) || 0))
      .reduce((obj: TargetLogInfo, key) => {
        const item = log[key]
        const { logContent } = item
        const neededKey = neededInfoMap.get(logContent.msg)
        if (neededKey) {
          item.logContent = get(logContent, neededKey)
        }
        obj[key] = item
        return obj
      }, {})
  }
  const handleConsoleLogInfo: TargetLogGenerator = (log) => {
    return log
  }
  const handleRepublishLogInfo: TargetLogGenerator = (log) => {
    return log
  }
  const handleMQTTLogInfo: TargetLogGenerator = (log) => log
  const handleHTTPLogInfo: TargetLogGenerator = (log) => {
    Object.values(log).forEach((item) => {
      const { logContent } = item
      if ([LogMsg.ActionSuccess, LogMsg.ActionTemplateRendered].includes(logContent.msg)) {
        item.logContent = logContent.meta.result
      }
    })
    return log
  }
  const bridgeLogGenerateMap = new Map([
    [BridgeType.MQTT, handleMQTTLogInfo],
    [BridgeType.Webhook, handleHTTPLogInfo],
  ])
  const handleActionLogInfo = (targetLog: TargetLog): TargetLog => {
    const { targetInfo } = targetLog
    const { type } = targetInfo || {}
    if (type) {
      const handler = bridgeLogGenerateMap.get(type as BridgeType)
      if (handler) {
        targetLog.info = handler(targetLog.info)
      }
    }
    return targetLog
  }

  const handleTargetLog = (targetLogData: TargetLog) => {
    const { type, info } = targetLogData
    if (type === LogTargetType.Rule) {
      targetLogData.info = handleRuleExecLogInfo(info)
    } else if (type === LogTargetType.Console) {
      targetLogData.info = handleConsoleLogInfo(info)
    } else if (type === LogTargetType.Republish) {
      targetLogData.info = handleRepublishLogInfo(info)
    } else if (type === LogTargetType.Action) {
      handleActionLogInfo(targetLogData)
    }
  }

  const resultOrder = [LogResult.Error, LogResult.Pending, LogResult.NoResult]
  const detectTotalLogResult = (resultArr: Array<LogResult>): LogResult => {
    for (const resultItem of resultOrder) {
      const withResult = resultArr.includes(resultItem)
      if (withResult) {
        return resultItem
      }
    }
    return LogResult.OK
  }

  /**
   * if `rule_trigger_ts` is [time1, time2]
   * then copy the log item to two items, one with `_timestamp` = time1, another with `_timestamp` = time2
   * Make it could show up in both execution results
   */
  const copyLogItemIfWithMultipleTriggerTime = (logArr: Array<LogItem>) => {
    const ret: Array<LogItem> = []
    logArr.forEach((item) => {
      const { rule_trigger_ts: timestampArr } = item.meta
      timestampArr.forEach((triggerTime: string) => {
        ret.push({ ...item, meta: { ...item.meta, _timestamp: triggerTime } })
      })
    })
    return ret
  }

  const getLogItemTriggerTime = ({ meta }: LogItem) => meta._timestamp

  /**
   * also filter the trigger time which is less than `startTimestamp`
   */
  const filterExpiredLog = (logArr: Array<LogItem>, startTimestamp: number) => {
    return logArr.filter(({ meta }) => {
      meta.rule_trigger_ts = meta.rule_trigger_ts.filter((ts: number) => ts >= startTimestamp)
      const { rule_trigger_ts: timestampArr } = meta
      return timestampArr.length && timestampArr.some((ts: number) => ts >= startTimestamp)
    })
  }

  /**
   * return true if the log need be dropped
   */
  const detectLogNeedBeDropped = (log: LogItem) => {
    let needBeDropped = false
    if (EXCLUDED_LOGS.includes(log.msg)) {
      needBeDropped = true
    }
    // about connector or useless msg
    if (
      (/connector/i.test(log.msg) ||
        log.meta.connector ||
        /msg =>/.test(log.msg) ||
        !RULE_LOGS.includes(log.msg)) &&
      !log.meta.action_info
    ) {
      console.warn(log)
      needBeDropped = true
    }
    return needBeDropped
  }

  const formatLog = (logArr: Array<LogItem>): FormattedLog => {
    const ret: FormattedLog = {}
    const timeGroupedMap = groupBy(
      copyLogItemIfWithMultipleTriggerTime(logArr),
      getLogItemTriggerTime,
    )
    Object.entries(timeGroupedMap).forEach(([key, logArr]) => {
      const targetLogMap: Record<string, TargetLog> = logArr.reduce(
        (obj: Record<string, TargetLog>, logItem) => {
          const { target, type, targetInfo = {} } = getLogTypeAndTarget(logItem)
          if (!obj[target]) {
            obj[target] = {
              result: LogResult.OK,
              type,
              target,
              targetInfo,
              info: {},
              rawLogArr: [],
            }
          }
          if (detectLogNeedBeDropped(logItem)) {
            return obj
          }
          obj[target].info[logItem.msg] = { time: logItem.time, logContent: logItem }
          obj[target].rawLogArr.push(logItem)
          return obj
        },
        {},
      )
      Object.entries(targetLogMap).forEach(([key, targetLog]) => {
        const { type, rawLogArr } = targetLog
        targetLogMap[key].result = (
          type === LogTargetType.Rule ? detectRuleExecLogArrResult : detectActionLogArrResult
        )(rawLogArr)
        handleTargetLog(targetLog)
      })
      ret[key] = {
        result: detectTotalLogResult(Object.values(targetLogMap).map(({ result }) => result)),
        trigger: findTrigger(logArr),
        info: targetLogMap,
      }
    })
    return ret
  }

  return {
    convertLogStrToLogArr,
    filterExpiredLog,
    detectTotalLogResult,
    formatLog,
  }
}

export const useShowLog = (): {
  getLogItemTitle: (targetLogData: TargetLog, logMsg: LogMsg) => string
  getLogItemContent: (
    targetLogData: TargetLog,
    logMsg: LogMsg,
    logContent: Record<string, any>,
  ) => string
} => {
  const { tl } = useI18nTl('RuleEngine')
  const commonActionLogMsgMap = new Map([
    [LogMsg.ActionTemplateRendered, tl('requestParameter')],
    [LogMsg.ActionSuccess, tl('actionExecutionLog')],
    [LogMsg.OutOfService, tl('actionOutOfService')],
    [LogMsg.ActionFailed, tl('actionFailed')],
    [LogMsg.RequestExpired, tl('requestExpired')],
  ])
  const ruleLogMsgMap = new Map([[LogMsg.RuleActivated, tl('eventData')]])
  const getRuleLogMsgTitle = (logMsg: LogMsg) => {
    const title = ruleLogMsgMap.get(logMsg)
    return title ? title : tl('executionResult')
  }
  const republishLogMsgMap = new Map([
    [LogMsg.ActionTemplateRendered, tl('requestParameter')],
    [LogMsg.RecursiveRepublishDetected, tl('recursiveRepublishDetected')],
  ])
  const getRepublishLogMsgTitle = (logMsg: LogMsg) => {
    let title = republishLogMsgMap.get(logMsg)
    if (!title) {
      const sTitle = commonActionLogMsgMap.get(logMsg)
      if (sTitle) {
        title = sTitle
      }
    }
    return title ? title : startCase(logMsg)
  }
  const consoleLogMsgMap = new Map([
    [LogMsg.ActionTemplateRendered, tl('consoleActionTemplateRendered')],
    [LogMsg.ActionSuccess, tl('actionExecutionLog')],
  ])
  const getConsoleLogMsgTitle = (logMsg: LogMsg) => {
    const title = consoleLogMsgMap.get(logMsg)
    return title ? title : startCase(logMsg)
  }
  const httpActionLogMsgMap = new Map([
    [LogMsg.ActionSuccess, tl('responseResult')],
    [LogMsg.StopRendering, tl('responseResult')],
  ])
  const actionTypeLogMsgMap = new Map([[BridgeType.Webhook, httpActionLogMsgMap]])

  const getActionLogMsgTitle = (targetLogData: TargetLog, logMsg: LogMsg) => {
    const { type } = targetLogData.targetInfo || {}
    let title: undefined | string = undefined
    if (type) {
      const map = actionTypeLogMsgMap.get(type as BridgeType)
      if (map) {
        const sTitle = map.get(logMsg)
        if (sTitle) {
          title = sTitle
        }
      }
    }
    if (!title) {
      const sTitle = commonActionLogMsgMap.get(logMsg)
      if (sTitle) {
        title = sTitle
      }
    }
    return title || startCase(logMsg)
  }
  const getLogItemTitle = (targetLogData: TargetLog, logMsg: LogMsg) => {
    const { type } = targetLogData
    if (type === LogTargetType.Rule) {
      return getRuleLogMsgTitle(logMsg)
    }
    if (type === LogTargetType.Republish) {
      return getRepublishLogMsgTitle(logMsg)
    }
    if (type === LogTargetType.Console) {
      return getConsoleLogMsgTitle(logMsg)
    }
    if (type === LogTargetType.Action) {
      return getActionLogMsgTitle(targetLogData, logMsg)
    }
    return startCase(logMsg)
  }

  const getRuleLogMsgContent = (
    logMsg: string,
    logContent: Record<string, any>,
  ): string | undefined => {
    if (logMsg === LogMsg.SQLYieldedNoResult) {
      return `SQL ${tl('failedNoResult')}`
    }
    const infoKey = neededInfoMap.get(logMsg as LogMsg)
    if ((infoKey === 'meta' && logContent.reason) || (!infoKey && logContent.meta.reason)) {
      return `SQL ${tl('failedException')}\n${logContent.reason || logContent.meta.reason}`
    }
  }
  const getHTTPLogMsgContent = (targetLogData: TargetLog, logMsg: LogMsg) => {
    if (logMsg === LogMsg.StopRendering) {
      return tl('stoppedRendering')
    }
  }
  const actionTypeLogContentMap = new Map([[BridgeType.Webhook, getHTTPLogMsgContent]])
  const getActionLogMsgContent = (targetLogData: TargetLog, logMsg: LogMsg) => {
    const { type } = targetLogData.targetInfo || {}
    let msg: string | undefined = ''
    if (type) {
      const handler = actionTypeLogContentMap.get(type as BridgeType)
      if (handler) {
        msg = handler(targetLogData, logMsg)
      }
    }
    return msg
  }
  const getLogItemContent = (
    targetLogData: TargetLog,
    logMsg: LogMsg,
    logContent: Record<string, any>,
  ) => {
    let msg: string | undefined = undefined
    const { type } = targetLogData
    if (type === LogTargetType.Rule) {
      msg = getRuleLogMsgContent(logMsg, logContent)
    } else if (type === LogTargetType.Action) {
      msg = getActionLogMsgContent(targetLogData, logMsg)
    }
    // `_timestamp` is for dashboard to group execution results
    // filter it out when showing the log content
    return msg ? msg : stringifyObjSafely(omit(logContent, ['_timestamp', 'meta._timestamp']), 2)
  }
  return {
    getLogItemTitle,
    getLogItemContent,
  }
}
