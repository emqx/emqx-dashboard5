import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import { EventForRule } from '@/types/enum'
import { camelCase } from 'lodash'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRuleUtils } from '../topology/useRule'

export default (): {
  eventDoNotNeedShow: string[]
  isMsgPubEvent: (event: string) => boolean
  getEventLabel: ({ zh, en }: { zh: string; en: string }) => string
  getEventDesc: (event: string) => string
  getEventDocLink: (event: string) => string
} => {
  const { state } = useStore()
  const { tl } = useI18nTl('RuleEngine')

  const eventDoNotNeedShow = ['$bridges/mqtt:*']
  const getEventLabel = ({ zh, en }: { zh: string; en: string }) => (isZh.value ? zh : en)
  const getEventDesc = (event: string) => tl(`${camelCase(event.slice(8))}Desc`)

  const zhHookMap: Record<string, string> = {
    [EventForRule.MessageDelivered]: '消息投递事件',
    [EventForRule.MessageAcked]: '消息确认事件',
    [EventForRule.MessageDropped]: '消息在转发的过程中被丢弃事件',
    [EventForRule.ClientConnected]: '终端连接成功事件',
    [EventForRule.ClientDisconnected]: '终端连接断开事件',
    [EventForRule.ClientConnack]: '连接确认事件',
    [EventForRule.ClientCheckAuthzComplete]: '鉴权完成事件',
    [EventForRule.SessionSubscribed]: '终端订阅成功事件',
    [EventForRule.SessionUnsubscribed]: '取消终端订阅成功事件',
    [EventForRule.DeliveryDropped]: '消息在投递的过程中被丢弃事件',
  }

  const isZh = computed(() => state.lang === 'zh')

  const { docMap } = useDocLink()
  const { isMsgPubEvent } = useRuleUtils()

  const getEventDocLink = (event: string) => {
    if (isMsgPubEvent(event)) {
      return docMap.ruleEventMsgPub
    }
    let hook = event.slice(1).replace(/(\/|_)/g, '-')
    if (isZh.value) {
      hook = `${zhHookMap[event] || ''}-${hook}`
    }
    return `${docMap.ruleEvent}#${hook}`
  }

  return {
    eventDoNotNeedShow,
    isMsgPubEvent,
    getEventLabel,
    getEventDesc,
    getEventDocLink,
  }
}
