export default {
  createMessageQueue: {
    zh: '创建消息队列',
    en: 'Create Message Queue',
  },
  topicFilter: {
    zh: '主题过滤器',
    en: 'Topic Filter',
  },
  topicFilterDesc: {
    zh: '用于确定哪些消息进入消息队列的过滤器',
    en: 'Filter used to determine which messages enter the message queue',
  },
  topicFilterReadonly: {
    zh: '主题过滤器创建后不可修改',
    en: 'Topic filter cannot be modified after creation',
  },
  invalidTopicFilter: {
    zh: '无效的主题过滤器格式',
    en: 'Invalid topic filter format',
  },
  dataRetentionPeriod: {
    zh: '数据保留期',
    en: 'Data Retention Period',
  },
  dispatchStrategy: {
    zh: '派发策略',
    en: 'Dispatch Strategy',
  },
  isLastvalue: {
    zh: '最后值语义',
    en: 'Last Value Semantics',
  },
  dispatchStrategyRandom: {
    zh: '随机',
    en: 'Random',
  },
  dispatchStrategyLeastInflight: {
    zh: '最少飞行中',
    en: 'Least Inflight',
  },
  dispatchStrategyRoundRobin: {
    zh: '轮询',
    en: 'Round Robin',
  },
  deleteTip: {
    zh: '确定要删除消息队列 {topicFilter} 吗？',
    en: 'Are you sure you want to delete message queue {topicFilter}?',
  },
  // Guidance component
  createFirstMQTitle: {
    zh: '创建您的第一个 EMQX 队列',
    en: 'Create your first EMQX Queue',
  },
  mqGuidance1: {
    zh: '通过内置的消息队列扩展 MQTT 功能。EMQX 队列可实现分发任务、缓冲突发流量，并借助持久化支持和最后值缓存功能可靠地传递有效负载。',
    en: 'Extend MQTT with built-in message queuing. EMQX Queue helps you dispatch tasks, buffer bursts, and deliver commands reliably with durability and last value caching support.',
  },
  mqGuidance2: {
    zh: '即使客户端处于离线状态时也确保消息永不丢失。',
    en: 'Ensuring messages are never lost even when clients are offline.',
  },
  createMQQueue: {
    zh: '创建队列',
    en: 'Create Queue',
  },
}
