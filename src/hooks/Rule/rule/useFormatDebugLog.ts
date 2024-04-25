import { getBridgeKey } from '@/common/tools'
import { BridgeType, LogResult, RuleOutput } from '@/types/enum'
import { groupBy, get, omit } from 'lodash'

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
  SQLYieldedResult = 'SQL_yielded_result',
  SQLYieldedNoResult = 'SQL_yielded_no_result',
  StopRendering = 'action_stopped_after_template_rendering',
  ActionSuccess = 'action_success',
  ActionTemplateRendered = 'action_template_rendered',
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

export const LogTargetType = {
  Rule: 'rule',
  Console: RuleOutput.Console,
  Republish: RuleOutput.Republish,
  Action: RuleOutput.DataBridge,
}
export type LogTargetTypeValue = typeof LogTargetType[keyof typeof LogTargetType]

export interface TargetLogInfo {
  [key: string]: Record<string, any>
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
  if (logArr.length === 0 || logArr.every(({ meta }) => !meta.result && !meta.reason)) {
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

  const getLogTypeAndTarget = (
    log: LogItem,
  ): { target: string; type: LogTargetTypeValue; targetInfo?: TargetLog['targetInfo'] } => {
    if (log.meta.action_info) {
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

  const neededInfoMap = new Map([
    [LogMsg.RuleActivated, 'meta.input'],
    [LogMsg.SQLYieldedResult, 'meta.result'],
    [LogMsg.SQLSelectClauseException, 'meta.reason'],
    [LogMsg.SQLWhereClauseException, 'meta.reason'],
    [LogMsg.SQLForeachClauseException, 'meta.reason'],
    [LogMsg.SQLIncaseClauseException, 'meta.reason'],
    [LogMsg.ApplyRuleFailed, 'meta.reason'],
  ])
  type TargetLogGenerator = (log: TargetLogInfo) => TargetLogInfo
  const generateRuleExecLogInfo: TargetLogGenerator = (log) => {
    return Object.entries(log).reduce((obj: TargetLogInfo, [key, item]) => {
      const neededKey = neededInfoMap.get(item.msg)
      if (neededKey) {
        obj[key] = get(item, neededKey)
      } else {
        obj[key] = item
      }
      return obj
    }, {})
  }
  const generateConsoleLogInfo: TargetLogGenerator = (log) => {
    return Object.entries(log).reduce((obj: TargetLogInfo, [key, item]) => {
      obj[key] = item
      return obj
    }, {})
  }
  const generateRepublishLogInfo: TargetLogGenerator = (log) => {
    return Object.entries(log).reduce((obj: TargetLogInfo, [key, item]) => {
      if (item.msg === LogMsg.ActionSuccess) {
        obj[key] = omit(item.meta.action_info, 'args.preprocessed_tmpl')
      } else {
        obj[key] = item
      }
      return obj
    }, {})
  }
  const generateMQTTLogInfo: TargetLogGenerator = (log) => log
  const generateHTTPLogInfo: TargetLogGenerator = (log) => {
    return Object.entries(log).reduce((obj: TargetLogInfo, [key, item]) => {
      if ([LogMsg.ActionSuccess, LogMsg.ActionTemplateRendered].includes(item.msg)) {
        obj[key] = item.meta.result
      } else {
        obj[key] = item
      }
      return obj
    }, {})
  }
  const bridgeLogGenerateMap = new Map([
    [BridgeType.MQTT, generateMQTTLogInfo],
    [BridgeType.Webhook, generateHTTPLogInfo],
  ])
  const generateActionLogInfo = (targetLog: TargetLog): TargetLog => {
    const { targetInfo } = targetLog
    const { type } = targetInfo || {}
    if (type) {
      const generator = bridgeLogGenerateMap.get(type as BridgeType)
      if (generator) {
        targetLog.info = generator(targetLog.info)
      }
    }
    return targetLog
  }

  const handleTargetLog = (targetLogData: TargetLog) => {
    const { type, info } = targetLogData
    if (type === LogTargetType.Rule) {
      targetLogData.info = generateRuleExecLogInfo(info)
    } else if (type === LogTargetType.Console) {
      targetLogData.info = generateConsoleLogInfo(info)
    } else if (type === LogTargetType.Republish) {
      targetLogData.info = generateRepublishLogInfo(info)
    } else if (type === LogTargetType.Action) {
      generateActionLogInfo(targetLogData)
    }
  }

  const formatLog = (logStr: string) => {
    const ret: FormattedLog = {}
    const logArr = convertLogStrToLogArr(logStr)
    const timeGroupedMap = groupBy(logArr, (item) => {
      return item.meta.rule_trigger_time || item.meta.rule_trigger_times?.[0]
    })
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
          if (EXCLUDED_LOGS.includes(logItem.msg)) {
            return obj
          }
          obj[target].info[logItem.msg] = logItem
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
    formatLog,
  }
}
