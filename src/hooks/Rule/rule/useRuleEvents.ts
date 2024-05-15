import { getRuleEvents as queryRuleEvents } from '@/api/ruleengine'
import { RuleEvent } from '@/types/rule'
import { camelCase } from 'lodash'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const EVENT_SORT: Array<string> = [
  '$events/client_connected',
  '$events/client_disconnected',
  '$events/client_connack',
  '$events/client_check_authz_complete',
  '$events/session_subscribed',
  '$events/session_unsubscribed',
  '$events/schema_validation_failed',
  '$events/message_delivered',
  '$events/message_acked',
  '$events/message_dropped',
  '$events/delivery_dropped',
  '$events/message_publish',
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
      return Promise.reject(error)
    }
  }

  return {
    getEventList,
  }
}
