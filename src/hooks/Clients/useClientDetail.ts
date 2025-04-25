import { Client } from '@/types/client'
import dayjs from 'dayjs'

type GetSessionInfoItem = (msg: string) => string | number | boolean

const useSessionInfoItem = () => {
  const { transSecondNumToSimpleStr } = useDurationStr()
  const { tl } = useI18nTl('Clients')

  const getSessionInfoItemValue = (msg: Client | Partial<Client>, key: string) => {
    switch (key) {
      case 'subscriptions':
        return msg.subscriptions_cnt + '/' + msg.subscriptions_max
      case 'mqueue':
        // 'durable: true' enables session persistence, making 'mqueue' unavailable.
        if (msg.durable && msg.mqueue_max === undefined) {
          return '-'
        }
        return msg.mqueue_len + '/' + msg.mqueue_max
      case 'inflight':
        return msg.inflight_cnt + '/' + msg.inflight_max
      case 'awaiting_rel':
        return msg.awaiting_rel_cnt + '/' + msg.awaiting_rel_max
      case 'created_at':
        return dayjs(msg[key]).format('YYYY-MM-DD HH:mm:ss')
      case 'heap_size':
        return `${msg.heap_size} bytes`
      case 'expiry_interval':
        return msg.expiry_interval === SESSION_NEVER_EXPIRE_TIME
          ? tl('neverExpire')
          : transSecondNumToSimpleStr(msg.expiry_interval as number)
      default:
        return msg[key as keyof Client] ?? ''
    }
  }

  return {
    getSessionInfoItemValue,
  }
}

export default (
  client: Ref<Partial<Client>> | ComputedRef<Partial<Client>>,
): {
  getSessionInfoItem: GetSessionInfoItem
} => {
  const { getSessionInfoItemValue } = useSessionInfoItem()

  const getSessionInfoItem: GetSessionInfoItem = (key) => {
    const msg = client.value
    return getSessionInfoItemValue(msg, key)
  }

  return {
    getSessionInfoItem,
  }
}

export const useClientInfoItem = (): {
  getSimpleClientInfoValue: (client: Client | Partial<Client>, key: string) => string
} => {
  const { tl } = useI18nTl('Clients')

  const getTimeStr = (val: number) => val && dayjs(val).format('YYYY-MM-DD HH:mm:ss')
  const getValueFuncMap = new Map<string, (client: Client) => string | number | undefined>([
    ['connected', (client: Client) => (client.connected ? tl('connected') : tl('disconnected'))],
    ['connected_at', (client: Client) => getTimeStr(client.connected_at)],
    ['disconnected_at', (client: Client) => getTimeStr(client.disconnected_at)],
    ['ip_address', (client: Client) => `${client.ip_address}:${client.port}`],
  ])
  const { clientFields } = useClientFields()
  const sessionFields = clientFields.session
  const { getSessionInfoItemValue } = useSessionInfoItem()
  /**
   * do not include ['proto_type','listener']
   */
  const getSimpleClientInfoValue = (client: Client | Partial<Client>, key: string): string => {
    if (getValueFuncMap.has(key)) {
      return (getValueFuncMap.get(key) as any)(client)
    }
    if (sessionFields.includes(key)) {
      return getSessionInfoItemValue(client as Client, key)
    }
    return client[key as keyof Client] ?? ''
  }
  return {
    getSimpleClientInfoValue,
  }
}
