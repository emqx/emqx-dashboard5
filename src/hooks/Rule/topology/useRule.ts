import { RULE_FROM_SEPARATOR } from '@/common/constants'
import { BridgeType, RuleInputType } from '@/types/enum'
import { BridgeItem, RuleEvent, TestColumnItem } from '@/types/rule'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { formatSELECTStatement } from '@/common/tools'

export const useRuleUtils = (): {
  TOPIC_EVENT: string
  findInputTypeNTarget: (
    inputItem: string,
    eventList: Array<RuleEvent>,
    bridgeList: Array<BridgeItem>,
  ) => {
    type: RuleInputType
    target: BridgeItem | RuleEvent | string
  }
  getTestColumns: (
    type: RuleInputType,
    value: string,
    eventList: Array<RuleEvent>,
  ) => {
    context: Record<string, string>
    descMap: Record<string, string>
  }
  transFromStrToFromArr: (fromStr: string) => Array<string>
  transSQLFormDataToSQL: (select: string, from: Array<string>, where?: string | undefined) => string
} => {
  const TOPIC_EVENT = '$events/message_publish'

  const { bridgeTypeList } = useBridgeTypeValue()
  const bridgeTypeValueList = bridgeTypeList.map(({ value }) => value)

  const findInputTypeNTarget = (
    inputItem: string,
    eventList: Array<RuleEvent>,
    bridgeList: Array<BridgeItem>,
  ): {
    type: RuleInputType
    target: BridgeItem | RuleEvent | string
  } => {
    const eventItem = eventList.find(({ event }) => event === inputItem)
    if (eventItem) {
      return {
        type: RuleInputType.Event,
        target: eventItem,
      }
    }

    const bridgeItem = bridgeList.find(({ idForRuleFrom }) => idForRuleFrom === inputItem)
    if (bridgeItem) {
      return {
        type: RuleInputType.Bridge,
        target: bridgeItem,
      }
    }

    return {
      type: RuleInputType.Topic,
      target: inputItem,
    }
  }

  /**
   * The id of bridge is spliced together by the front end, and the format is {type}:{name}
   * According to this rule to judge the type
   */
  const judgeBridgeTypeById = (bridgeId: string): BridgeType => {
    const reg = new RegExp(`^(${bridgeTypeValueList.join('|')}):`)
    const matchResult = bridgeId.match(reg)
    if (!matchResult || matchResult.length < 2) {
      return BridgeType.MQTT
    }
    const [, bridgeType] = matchResult
    return bridgeType as BridgeType
  }

  /**
   * event: use event test columns
   * bridge: use '$bridges/${bridge type}:*' event test columns
   * topic: use '$events/message_publish' event test columns
   * ps. if is topic, find event with same name first, otherwise use '$events/message_publish' event test columns
   * but if there is an event with the same name here, it will be judged as an event when judging, so use the event test directly
   */
  const getTestColumns = (
    type: RuleInputType,
    value: string,
    eventList: Array<RuleEvent>,
  ): { context: Record<string, string>; descMap: Record<string, string> } => {
    let test_columns: Record<string, TestColumnItem> = {}
    if (type === RuleInputType.Event) {
      test_columns = eventList.find(({ event }) => event === value)?.test_columns || {}
    } else if (type === RuleInputType.Bridge) {
      const bridgeType = judgeBridgeTypeById(value)
      test_columns =
        eventList.find(({ event }) => event === `$bridges/${bridgeType}:*`)?.test_columns || {}
    } else {
      test_columns = eventList.find(({ event }) => event === TOPIC_EVENT)?.test_columns || {}
    }
    const context: Record<string, string> = {}
    const descMap: Record<string, string> = {}
    Object.keys(test_columns).forEach((key) => {
      context[key] = test_columns[key][0]
      descMap[key] = test_columns[key][1]
    })
    return {
      context,
      descMap,
    }
  }

  const transFromStrToFromArr = (fromStr: string): Array<string> =>
    fromStr.split(RULE_FROM_SEPARATOR).map((item) => item.trim())

  const transFromDataArrToStr = (from: Array<string>): string => {
    return from.map((item) => `"${item}"`).join(`${RULE_FROM_SEPARATOR}\n  `)
  }

  const transSQLFormDataToSQL = (select: string, from: Array<string>, where?: string): string => {
    const rawSelectStr = `${!/^FOREACH/i.test(select.trim()) ? 'SELECT\n  ' : ''}${select}`
    const selectStr = formatSELECTStatement(rawSelectStr)
    const fromStr = `\nFROM\n  ${transFromDataArrToStr(from)}`
    let ret = selectStr + fromStr
    if (where) {
      ret += `\nWHERE ${where}`
    }
    return ret
  }

  return {
    TOPIC_EVENT,
    findInputTypeNTarget,
    getTestColumns,
    transFromStrToFromArr,
    transSQLFormDataToSQL,
  }
}
