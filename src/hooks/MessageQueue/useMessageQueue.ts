import { MessageQueueDispatchStrategy, MessageQueueDispatchStrategyValue } from '@/types/typeAlias'

const useMessageQueue = () => {
  const { tl } = useI18nTl('MessageQueue')
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
  }
}

export default useMessageQueue
