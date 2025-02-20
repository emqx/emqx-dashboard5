import useI18nTl from '@/hooks/useI18nTl'
import { useStore } from 'vuex'
import { useRuleUtils } from './useRule'

export default (): {
  eventDoNotNeedShow: string[]
  isMsgPubEvent: (event: string) => boolean
  getEventLabel: ({ zh, en }: { zh: string; en: string }) => string
  getEventDesc: (event: string) => string
} => {
  const { state } = useStore()
  const { tl } = useI18nTl('RuleEngine')

  const eventDoNotNeedShow = ['$bridges/mqtt:*']
  const getEventLabel = ({ zh, en }: { zh: string; en: string }) => (isZh.value ? zh : en)
  const getEventDesc = (event: string) => tl(`${camelCase(event.slice(8))}Desc`)

  const isZh = computed(() => state.lang === 'zh')

  const { isMsgPubEvent } = useRuleUtils()

  return {
    eventDoNotNeedShow,
    isMsgPubEvent,
    getEventLabel,
    getEventDesc,
  }
}
