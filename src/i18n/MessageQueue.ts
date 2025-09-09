export default {
  createMessageQueue: {
    zh: '创建消息队列',
    en: 'Create Message Queue',
  },
  editMessageQueue: {
    zh: '编辑消息队列',
    en: 'Edit Message Queue',
  },
  topicFilter: {
    zh: '过滤主题',
    en: 'Topic Filter',
  },
  topicFilterDesc: {
    zh: '用于确定哪些消息进入消息队列的过滤器',
    en: 'The filter used to determine which messages are getting into the message queue.',
  },
  invalidTopicFilter: {
    zh: '无效的过滤主题格式',
    en: 'Invalid topic filter format',
  },
  dataRetentionPeriod: {
    zh: '数据保留期',
    en: 'Data Retention Period',
  },
  dataRetentionPeriodDesc: {
    zh: '消息队列中数据保留的时间',
    en: 'The period for which data is retained in the Message Queue.',
  },
  dispatchStrategy: {
    zh: '派发策略',
    en: 'Dispatch Strategy',
  },
  dispatchStrategyDesc: {
    zh: '用于确定消息队列中消息的派发策略',
    en: 'The strategy used to determine how messages are dispatched in the Message Queue.',
  },
  isLastvalue: {
    zh: '最后值语义',
    en: 'Last Value Semantics',
  },
  isLastvalueDesc: {
    zh: '指示消息是否具有最后值语义。最后值语义意味着消息覆盖同一主题中相同队列键的先前消息。',
    en: 'Indicates if the message has Last-Value semantics. Last-Value semantics means that messages overwrite previous messages with the same queue key in the same topic.',
  },
  dispatchStrategyRandom: {
    zh: '随机',
    en: 'Random',
  },
  dispatchStrategyLeastInflight: {
    zh: '最少未确认消息订阅者',
    en: 'Least Inflight Subscriber',
  },
  dispatchStrategyRoundRobin: {
    zh: '轮询',
    en: 'Round Robin',
  },
  deleteTip: {
    zh: '确定删除过滤主题为 {topicFilter} 的消息队列吗？',
    en: 'Confirm to delete message queue with topic filter {topicFilter}?',
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
