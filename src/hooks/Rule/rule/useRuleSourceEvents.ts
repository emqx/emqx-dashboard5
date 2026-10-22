import { LocalizedText } from '@/types/common'

export default (): {
  eventDoNotNeedShow: string[]
  isMsgPubEvent: (event: string) => boolean
  getEventLabel: (title: LocalizedText) => string
  getEventDesc: (event: string) => string
} => {
  const { state } = useStore()
  const { tl } = useI18nTl('RuleEngine')

  const eventDoNotNeedShow = ['$bridges/mqtt:*']
  const getEventLabel = (title: LocalizedText) => pickLangText(title, state.lang)
  const getEventDesc = (event: string) => tl(`${camelCase(event.slice(8))}Desc`)

  const { isMsgPubEvent } = useRuleUtils()

  return {
    eventDoNotNeedShow,
    isMsgPubEvent,
    getEventLabel,
    getEventDesc,
  }
}
