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

export type EventWildcardOption = {
  event: string
  label: string
  contains: RuleEvent[]
  description: string
}

export default (): {
  allEventWildcardValue: string
  eventWildcardOptions: Ref<Array<EventWildcardOption>>
  getEventList: () => Promise<RuleEvent[]>
  getEventLabel: (event: string) => string
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

  const eventReg = new RegExp(`^${escapeRegExp(RULE_INPUT_EVENT_PREFIX)}`)
  const multipleLevelEventReg = new RegExp(`^(${escapeRegExp(RULE_INPUT_EVENT_PREFIX)}(\\w+)\\/).+`)
  const eventWildcardOptions = ref<Array<EventWildcardOption>>([])
  const allEventWildcardValue = `${RULE_INPUT_EVENT_PREFIX}${MULTI_LEVEL_WILDCARD}`
  const allEventWildcardLabelMap = new Map<string, string>([
    ['message', t('RuleEngine.message')],
    ['client', t('Dashboard.client')],
    ['session', t('Dashboard.session')],
    ['auth', t('Dashboard.auth')],
    ['sys', t('Alarm.system')],
  ])
  const getWildcardLabel = (block: string) => {
    const blockLabel = allEventWildcardLabelMap.get(block) ?? titleCase(block)
    return t('RuleEngine.allTargetEvents', { target: blockLabel })
  }
  const isZh = computed(() => state.lang === 'zh')
  const getEventCurrentLangLabel = ({ zh, en }: { zh: string; en: string }) =>
    isZh.value ? zh : en

  const generateEventWildcardOptions = (eventList: Array<RuleEvent>) => {
    const optMap = new Map<string, { label: string; contains: RuleEvent[] }>([
      [
        allEventWildcardValue,
        {
          label: t('RuleEngine.allEvents'),
          contains: eventList.filter(({ event }) => {
            return eventReg.test(event) && event !== TOPIC_EVENT
          }),
        },
      ],
    ])
    eventList.forEach((item) => {
      const { event } = item
      const matchRet = event.match(multipleLevelEventReg)
      const opt = matchRet && matchRet[1]
      if (opt) {
        const optValue = `${opt}#`
        if (optMap.has(optValue)) {
          optMap.get(optValue)?.contains.push(item)
        } else {
          optMap.set(optValue, { label: getWildcardLabel(matchRet[2]), contains: [item] })
        }
      }
    })
    const wildcardOptions = []
    for (const [key, value] of optMap.entries()) {
      if (value.contains.length > 1) {
        const { contains } = value
        const description = t('RuleEngine.containsEvents', {
          events: contains
            .map(({ title }, index) => ` ${index + 1}. ${getEventCurrentLangLabel(title)}`)
            .join('<br />'),
        })
        wildcardOptions.push({ event: key, ...value, description })
      }
    }
    return wildcardOptions
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
      eventWildcardOptions.value = generateEventWildcardOptions(eventList)
      return Promise.resolve(eventList)
    } catch (error) {
      commit('SET_RULE_EVENT_REQUEST', null)
      return Promise.reject(error)
    }
  }

  const lang = computed<'en' | 'zh'>(() => (state.lang === 'zh' ? 'zh' : 'en'))
  const getEventLabel = (event: string) => {
    const eventList: Array<RuleEvent> = state.ruleEventList
    const eventItem: RuleEvent | undefined = eventList.find((item) => item.event === event)
    if (eventItem) {
      return startCase(eventItem?.title[lang.value])
    }

    const eventWildcardItem: EventWildcardOption | undefined = eventWildcardOptions.value.find(
      (item) => item.event === event,
    )
    if (eventWildcardItem) {
      return eventWildcardItem.label
    }
    return event
  }

  return {
    allEventWildcardValue,
    eventWildcardOptions,
    getEventList,
    getEventLabel,
  }
}
