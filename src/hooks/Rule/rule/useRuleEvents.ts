import { getRuleEvents as queryRuleEvents } from '@/api/ruleengine'
import { EventForRule } from '@/types/enum'
import { RuleEvent } from '@/types/rule'

export const EVENT_SORT: Array<string> = [
  EventForRule.ClientCheckAuthnComplete,
  EventForRule.ClientConnected,
  EventForRule.ClientDisconnected,
  EventForRule.ClientConnack,
  EventForRule.ClientCheckAuthzComplete,
  EventForRule.SessionSubscribed,
  EventForRule.SessionUnsubscribed,
  EventForRule.SchemaValidationFailed,
  EventForRule.MessageTransformationFailed,
  EventForRule.MessageDelivered,
  EventForRule.MessageAcked,
  EventForRule.MessageDropped,
  EventForRule.MessageDeliveryDropped,
  EventForRule.MessagePublish,
  EventForRule.AlarmActivated,
  EventForRule.AlarmDeactivated,
  '$bridges/mqtt:*',
]

const getEventIndex = (event: string) => {
  const index = EVENT_SORT.findIndex((item) => item === event)
  return index === -1 ? EVENT_SORT.length : index
}

export default (): {
  getEventList: () => Promise<RuleEvent[]>
} => {
  const { state, commit } = useStore()
  const { t } = useI18n()

  const setLabelToEventList = (eventList: Array<RuleEvent>) => {
    // Use our own label instead of the one provided by api
    eventList.forEach((item) => {
      item.title.en = t(`RuleEvent.${camelCase(item.event)}`, {}, { locale: 'en' })
      item.title.zh = t(`RuleEvent.${camelCase(item.event)}`, {}, { locale: 'zh' })
    })
    return eventList
  }

  const getEventList = async () => {
    try {
      let eventList: Array<RuleEvent> = state.ruleEventList
      if (!eventList.length) {
        if (!state.ruleEventRequest) {
          const request = queryRuleEvents()
          commit('SET_RULE_EVENT_REQUEST', request)
        }
        const data: Array<RuleEvent> = await state.ruleEventRequest
        eventList = setLabelToEventList(
          data?.sort((a, b) => getEventIndex(a.event) - getEventIndex(b.event)),
        )
        commit('SET_RULE_EVENT_LIST', eventList)
      }
      return Promise.resolve(eventList)
    } catch (error) {
      commit('SET_RULE_EVENT_REQUEST', null)
      return Promise.reject(error)
    }
  }

  return {
    getEventList,
  }
}
