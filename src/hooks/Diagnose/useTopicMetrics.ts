const UNSUPPORTED_TOPIC_METRICS_FILTER_REG = /^\$(share|queue)\//

const useTopicMetrics = () => {
  const isTopicCanCreateMetrics = (topic: string) =>
    !UNSUPPORTED_TOPIC_METRICS_FILTER_REG.test(topic.trim())

  return {
    isTopicCanCreateMetrics,
  }
}

export default useTopicMetrics
