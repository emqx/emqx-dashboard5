import {
  MULTI_LEVEL_WILDCARD,
  RULE_FROM_SEPARATOR,
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  RULE_INPUT_EVENT_PREFIX,
  TOPIC_EVENT,
} from '@/common/constants'
import { addNewlineAfterComma, getTypeAndNameFromKey, splitOnComma } from '@/common/tools'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType, EventForRule, RuleInputType, RuleSQLKeyword } from '@/types/enum'
import { BridgeItem, RuleEvent, TestColumnItem } from '@/types/rule'
import { ComputedRef, computed, ref } from 'vue'
import useRuleEvents from './useRuleEvents'
import { escapeRegExp } from 'lodash'

export const useRuleUtils = (): {
  TOPIC_EVENT: string
  allMsgsAndEvents: ComputedRef<string[]>
  findInputTypeNTarget: (
    inputItem: string,
    eventList: Array<RuleEvent>,
    bridgeList: Array<BridgeItem>,
  ) => {
    type: RuleInputType
    target: BridgeItem | RuleEvent | string
  }
  getEventForShow: (event: string) => string
  getTestTargetEvent: (
    type: RuleInputType,
    value: string,
    eventList: Array<RuleEvent>,
  ) => RuleEvent | undefined
  getTestColumns: (
    type: RuleInputType,
    value: string,
    eventList: Array<RuleEvent>,
  ) => {
    context: Record<string, string>
    descMap: Record<string, string>
  }
  transFromStrToFromArr: (fromStr: string) => Array<string>
  transFromDataArrToStr: (from: Array<string>) => string
  transSQLFormDataToSQL: (select: string, from: Array<string>, where?: string | undefined) => string
  isMsgPubEvent: (event: string) => boolean
  replaceTargetPartInSQL: (sql: string, part: RuleSQLKeyword, newPartStr: string) => string
} => {
  const { bridgeTypeList } = useBridgeTypeValue()
  const bridgeTypeValueList = bridgeTypeList.map(({ value }) => value)

  const { getEventList } = useRuleEvents()
  const ruleEvents = ref<Array<RuleEvent>>([])
  ;(async () => {
    const list = await getEventList()
    const bridgeReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
    ruleEvents.value = list.filter(({ event }) => !bridgeReg.test(event))
  })()
  const allMsgsAndEvents = computed(() => {
    return ruleEvents.value.reduce((arr: Array<string>, { event }) => {
      if (isMsgPubEvent(event)) {
        return [...arr, MULTI_LEVEL_WILDCARD]
      }
      return [...arr, event]
    }, [])
  })

  const isMsgPubEvent = (event: string) => event === EventForRule.MessagePublish
  const getEventForShow = (event: string) => (isMsgPubEvent(event) ? '${topic}' : event)

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
   * @param value if type is source, value is source id
   */
  const getTestTargetEvent = (
    type: RuleInputType,
    value: string,
    eventList: Array<RuleEvent>,
  ): RuleEvent | undefined => {
    if (type === RuleInputType.Event) {
      return eventList.find(({ event }) => event === value)
    }
    if (type === RuleInputType.Bridge) {
      const bridgeType = judgeBridgeTypeById(value)
      return eventList.find(({ event }) => event === `$bridges/${bridgeType}:*`)
    }
    return eventList.find(({ event }) => event === TOPIC_EVENT)
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
    const targetEvent = getTestTargetEvent(type, value, eventList)
    const test_columns: Record<string, TestColumnItem> = targetEvent?.test_columns || {}
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

  const transFromStrToFromArr = (fromStr: string): Array<string> => {
    const rawArr = splitOnComma(fromStr)
    return rawArr.map((item) =>
      item
        .trim()
        .replace(/^\n|\n$/g, '')
        .trim()
        .replace(/^("|')|("|')$/g, ''),
    )
  }

  const transFromDataArrToStr = (from: Array<string>): string => {
    return from.map((item) => `"${item}"`).join(`${RULE_FROM_SEPARATOR}\n  `)
  }

  const transSQLFormDataToSQL = (select: string, from: Array<string>, where?: string): string => {
    const rawSelectStr = `${!/^FOREACH/i.test(select.trim()) ? 'SELECT\n  ' : ''}${select}`
    const selectStr = addNewlineAfterComma(rawSelectStr)
    const firstCharInFromStr = selectStr.slice(-1) === '\n' ? '' : '\n'
    const fromStr = `${firstCharInFromStr}FROM\n  ${transFromDataArrToStr(from)}`
    let ret = selectStr + fromStr
    if (where) {
      ret += `\nWHERE ${where}`
    }
    return ret
  }

  const SQLKeyWords = [
    RuleSQLKeyword.Select,
    RuleSQLKeyword.From,
    RuleSQLKeyword.Where,
    RuleSQLKeyword.Foreach,
    RuleSQLKeyword.Do,
    RuleSQLKeyword.Incase,
  ]
  const getSQLPart = (sql: string, part: RuleSQLKeyword) => {
    const otherKeyWords = SQLKeyWords.filter((key) => key !== part)
    const partReg = new RegExp(
      `${part}((\\s|\\n)+)(?<targetPart>((.|\\n)(?!${otherKeyWords.join(
        '|',
      )}))+)(\\n|\\s)*(${otherKeyWords.join('|')})?`,
      'i',
    )
    const matchRet = sql.match(partReg)
    return matchRet?.groups?.targetPart || ''
  }

  const replaceTargetPartInSQL = (sql: string, part: RuleSQLKeyword, newPartStr: string) => {
    const oldPartStr = getSQLPart(sql, part)
    if (oldPartStr.trim() === '') {
      return sql.replace(new RegExp(`${part}`, 'i'), (matched) => {
        return `${matched}\n  ${newPartStr}`
      })
    } else {
      return sql.replace(oldPartStr, newPartStr)
    }
  }

  return {
    TOPIC_EVENT,
    allMsgsAndEvents,
    findInputTypeNTarget,
    getTestTargetEvent,
    getTestColumns,
    transFromStrToFromArr,
    transFromDataArrToStr,
    transSQLFormDataToSQL,
    replaceTargetPartInSQL,
    isMsgPubEvent,
    getEventForShow,
  }
}

/**
 * Unlike RuleInputType, the action here is specific to what type of action it is.
 */
export const SourceType = {
  Message: 'message',
  Event: 'event',
  MQTTBroker: BridgeType.MQTT,
}
export const useRuleInputs = (): {
  getBridgeIdFromInput: (input: string) => string
  detectInputType: (from: string) => string
} => {
  const getBridgeIdFromInput = (input: string) => input.replace(RULE_INPUT_BRIDGE_TYPE_PREFIX, '')

  const getBridgeTypeFromId = (id: string): string => getTypeAndNameFromKey(id).type
  const eventInputReg = new RegExp(`^${escapeRegExp(RULE_INPUT_EVENT_PREFIX)}`)
  const bridgeInputReg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
  /**
   * @returns If the returned type is a bridge type, it is a specific bridge type
   */
  const detectInputType = (from: string): string => {
    if (eventInputReg.test(from)) {
      return SourceType.Event
    }
    // now has mqtt & http
    if (bridgeInputReg.test(from)) {
      return getBridgeTypeFromId(from.replace(RULE_INPUT_BRIDGE_TYPE_PREFIX, ''))
    }
    return SourceType.Message
  }

  return {
    getBridgeIdFromInput,
    detectInputType,
  }
}
