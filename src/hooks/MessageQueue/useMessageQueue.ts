import { getMessageQueues } from '@/api/messageQueue'
import { MessageQueueDispatchStrategy, MessageQueueDispatchStrategyValue } from '@/types/typeAlias'

export const useMessageTemplate = () => {
  const messageTemplate = `<pre>
{
    "flags": {
        "dup": false,
        "retain": false
    },
    "id": "00063f23103ef819d4e0000099f4000b",
    "timestamp": 1758269689231,
    "from": "p2K5KGVANDYmaIq1",
    "headers": {
        "peername": "127.0.0.1:43856",
        "protocol": "mqtt",
        "proto_ver": 5,
        "peerhost": "127.0.0.1",
        "username": null,
        "properties": {
            "User-Property": {
                "mq-key": "k-9"
            }
        },
        "client_attrs": {}
    },
    "payload": "payload-9",
    "topic": "t/9",
    "qos": 1
}
<pre />`
  return { messageTemplate }
}

const useMessageQueue = () => {
  const { tl } = useI18nTl('MessageQueue')

  const { messageTemplate } = useMessageTemplate()
  const descForKeyExpression = `${tl('keyExpressionDesc')}<br />${messageTemplate}`

  const notEnabledStatuses = [503, 404]
  const getQueueEnabledFromList = async () => {
    try {
      await getMessageQueues({ limit: 1 }, { errorsHandleCustom: notEnabledStatuses })
      return Promise.resolve(true)
    } catch (error: any) {
      if (error.status && notEnabledStatuses.includes(error.status)) {
        return Promise.resolve(false)
      }
      return Promise.reject(error)
    }
  }

  const dispatchStrategyOptions = [
    {
      value: MessageQueueDispatchStrategyValue.least_inflight,
      label: tl('dispatchStrategyLeastInflight'),
    },
    { value: MessageQueueDispatchStrategyValue.random, label: tl('dispatchStrategyRandom') },
    {
      value: MessageQueueDispatchStrategyValue.round_robin,
      label: tl('dispatchStrategyRoundRobin'),
    },
  ]
  const getDispatchStrategyLabel = (strategy: MessageQueueDispatchStrategy) => {
    return dispatchStrategyOptions.find((option) => option.value === strategy)?.label
  }
  return {
    dispatchStrategyOptions,
    getDispatchStrategyLabel,
    descForKeyExpression,
    getQueueEnabledFromList,
  }
}

export default useMessageQueue
