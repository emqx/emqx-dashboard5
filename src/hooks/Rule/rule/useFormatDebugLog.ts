import { getBridgeKey } from '@/common/tools'
import { LogResult, RuleOutput } from '@/types/enum'
import { groupBy } from 'lodash'

/**
 * Some Special Log Msg
 * The list is not exhaustive
 */
const enum LogMsg {
  RuleActivated = 'rule_activated',
  SQLSelectClauseException = 'SELECT_clause_exception',
  SQLWhereClauseException = 'WHERE_clause_exception',
  SQLForeachClauseException = 'FOREACH_clause_exception',
  SQLIncaseClauseException = 'INCASE_clause_exception',
  ApplyRuleFailed = 'apply_rule_failed',
  SQLYieldedNoResult = 'SQL_yielded_no_result',
  StopRendering = 'action_stopped_after_template_rendering',
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
]

export interface LogItem {
  time: string
  msg: LogMsg
  meta: Record<string, any>
  level: string
}

export interface FormattedLog {
  /**
   * trigger time
   */
  [key: string]: {
    result: LogResult
    trigger: { event?: string; topic?: string }
    info: {
      /**
       * action id or rule id
       */
      [key: string]: {
        result: LogResult
        info: Array<LogItem>
      }
    }
  }
}

type TargetLogMap = FormattedLog[string]['info']

/**
 * return true is ok, false is error
 */
const detectLogItemResult = (log: LogItem): boolean => {
  if (log.meta.reason) {
    return log.msg !== LogMsg.StopRendering ? false : true
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

const detectTotalLogResult = (resultArr: Array<LogResult>): LogResult => {
  for (const item of resultArr) {
    if (item !== LogResult.OK) {
      return item
    }
  }
  return LogResult.OK
}

const detectActionLogArrResult = (logArr: Array<LogItem>): LogResult => {
  if (logArr.every(({ meta }) => !meta.result && !meta.reason)) {
    return LogResult.Pending
  }
  return logArr.every(detectLogItemResult) ? LogResult.OK : LogResult.Error
}

export default () => {
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

  const groupLogByTarget = (logArr: Array<LogItem>) => {
    return groupBy(logArr, (item) => {
      if (item.meta.action_info) {
        const { type, name, func, args } = item.meta.action_info
        if (type && name) {
          return getBridgeKey({ type, name })
        }
        if (func === RuleOutput.Republish && args.topic) {
          return `${func}:${args.topic}`
        }
        return func
      }
      return item.meta.rule_id || item.meta.rule_ids?.[0]
    })
  }

  const formatLog = (logStr: string) => {
    const ret: FormattedLog = {}
    const logArr = convertLogStrToLogArr(logStr)
    const timeGroupedMap = groupBy(logArr, (item) => {
      return item.meta.rule_trigger_time || item.meta.rule_trigger_times?.[0]
    })
    Object.entries(timeGroupedMap).forEach(([key, logArr]) => {
      const targetGroupedLogItemInfo = groupLogByTarget(logArr)
      const targetLogMap = Object.entries(targetGroupedLogItemInfo).reduce(
        (obj: TargetLogMap, [key, logArr]) => {
          const isRule = logArr.some(({ msg }) => msg === LogMsg.RuleActivated)
          const filteredLogArr = logArr.filter(({ msg }) => !EXCLUDED_LOGS.includes(msg))
          obj[key] = {
            result: isRule ? detectRuleExecLogArrResult(logArr) : detectActionLogArrResult(logArr),
            info: filteredLogArr,
          }
          return obj
        },
        {},
      )
      ret[key] = {
        result: detectTotalLogResult(Object.entries(targetLogMap).map(([, { result }]) => result)),
        trigger: findTrigger(logArr),
        info: targetLogMap,
      }
    })
    return ret
  }

  return {
    formatLog,
  }
}
