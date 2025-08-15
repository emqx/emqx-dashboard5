const useTopicMetrics = () => {
  const wildcardReg = /\/(#|\+)/
  const sharedSubReg = /^\$(share|queue)\//
  const isTopicCanCreateMetrics = (topic: string) =>
    !wildcardReg.test(topic) && !sharedSubReg.test(topic)
  return {
    isTopicCanCreateMetrics,
  }
}

export default useTopicMetrics
