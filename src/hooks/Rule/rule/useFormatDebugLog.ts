import { getBridgeKey } from '@/common/tools'
import { LogResult, RuleOutput } from '@/types/enum'
import { groupBy } from 'lodash'

/**
 * Some Special Log Msg
 */
const enum LogMsg {
  RuleActivated = 'rule_activated',
  StopRendering = 'action_stopped_after_template_rendering',
}

export interface LogItem {
  time: string
  msg: string
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
const detectLogResult = (log: LogItem): boolean => {
  if (log.meta.reason) {
    return log.msg !== LogMsg.StopRendering ? false : true
  }
  return true
}
const detectLogArrResult = (logArr: Array<LogItem>): LogResult =>
  logArr.every(detectLogResult) ? LogResult.OK : LogResult.Error

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
      const targetLogMap = Object.keys(targetGroupedLogItemInfo).reduce(
        (obj: TargetLogMap, key) => {
          obj[key] = {
            result: detectLogArrResult(targetGroupedLogItemInfo[key]),
            info: targetGroupedLogItemInfo[key],
          }
          return obj
        },
        {},
      )
      ret[key] = {
        result: detectLogArrResult(logArr),
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
