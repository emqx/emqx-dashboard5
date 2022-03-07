import { RULE_FROM_SEPARATOR } from '@/common/constants'
import { RuleInputType } from '@/types/enum'
import { BridgeItem, RuleEvent, RuleItem } from '@/types/rule'

export const useRuleUtils = () => {
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

    const bridgeItem = bridgeList.find(({ id }) => id === inputItem)
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
   * event: use event test columns
   * bridge: use '$events/message_publish' event test columns
   * topic: use '$events/message_publish' event test columns
   * ps. if is topic, find event with same name first, otherwise use '$events/message_publish' event test columns
   * but if there is an event with the same name here, it will be judged as an event when judging, so use the event test directly
   */
  const getTestColumns = (type: RuleInputType, value: string, eventList: Array<RuleEvent>) => {
    const defaultEvent = '$events/message_publish'
    let ret: Record<string, string> =
      eventList.find(({ event }) => event === defaultEvent)?.test_columns || {}
    if (type === RuleInputType.Event) {
      ret = eventList.find(({ event }) => event === value)?.test_columns || {}
    }
    return ret
  }

  const transFromStrToFromArr = (fromStr: string) =>
    fromStr.split(RULE_FROM_SEPARATOR).map((item) => item.trim())

  return {
    findInputTypeNTarget,
    getTestColumns,
    transFromStrToFromArr,
  }
}
