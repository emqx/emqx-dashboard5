import { getBridgeKey } from '@/common/tools'
import { RuleOutput } from '@/types/enum'
import { groupBy } from 'lodash'

export interface FormattedLog {
  /**
   * trigger time
   */
  [key: string]: {
    /**
     * action id or rule id
     */
    [key: string]: any[]
  }
}

export default () => {
  const convertLogStrToLogArr = (logStr: string) =>
    logStr
      .split('\n')
      .filter(Boolean)
      .map((item) => JSON.parse(item))

  const formatLog = (logStr: string) => {
    const ret: FormattedLog = {}
    const logArr = convertLogStrToLogArr(logStr)
    const timeGroupedMap = groupBy(logArr, (item) => {
      return item.meta.rule_trigger_time || item.meta.rule_trigger_times?.[0]
    })
    Object.entries(timeGroupedMap).forEach(([key, value]) => {
      const groupedLogItem = groupBy(value, (item) => {
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
      ret[key] = groupedLogItem
    })
    return ret
  }

  return {
    formatLog,
  }
}
