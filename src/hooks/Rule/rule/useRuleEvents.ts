import { useStore } from 'vuex'
import { getRuleEvents as queryRuleEvents } from '@/api/ruleengine'
import { RuleEvent } from '@/types/rule'

const EVENT_SORT: Array<string> = [
  '$events/client_connected',
  '$events/client_disconnected',
  '$events/client_connack',
  '$events/client_check_authz_complete',
  '$events/session_subscribed',
  '$events/session_unsubscribed',
  '$events/message_delivered',
  '$events/message_acked',
  '$events/message_dropped',
  '$events/delivery_dropped',
  '$events/message_publish',
  '$bridges/mqtt:*',
]

const getEventIndex = (event: string) => EVENT_SORT.findIndex((item) => item === event)

export default (): {
  getEventList: () => Promise<RuleEvent[]>
} => {
  const { state, commit } = useStore()

  const getEventList = async () => {
    try {
      let eventList: Array<RuleEvent> = state.ruleEventList
      if (!eventList.length) {
        if (!state.ruleEventRequest) {
          const request = queryRuleEvents()
          commit('SET_RULE_EVENT_REQUEST', request)
        }
        const data: Array<RuleEvent> = await state.ruleEventRequest
        eventList = data.sort((a, b) => getEventIndex(a.event) - getEventIndex(b.event))
        commit('SET_RULE_EVENT_LIST', eventList)
      }
      return Promise.resolve(eventList)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getEventList,
  }
}
