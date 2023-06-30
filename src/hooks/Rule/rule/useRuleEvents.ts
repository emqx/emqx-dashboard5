import { useStore } from 'vuex'
import { getRuleEvents as queryRuleEvents } from '@/api/ruleengine'
import { RuleEvent } from '@/types/rule'

export default (): {
  getEventList: () => Promise<RuleEvent[]>
} => {
  const { state, commit } = useStore()

  const getEventList = async () => {
    try {
      let eventList: Array<RuleEvent> = state.ruleEventList
      if (!eventList.length) {
        eventList = await queryRuleEvents()
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
