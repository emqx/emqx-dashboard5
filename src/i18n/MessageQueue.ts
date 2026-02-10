export default {
  createMessageQueue: {
    zh: '创建队列',
    en: 'Create Queue',
  },
  editMessageQueue: {
    zh: '编辑队列',
    en: 'Edit Queue',
  },
  topicFilter: {
    zh: '过滤主题',
    en: 'Topic Filter',
  },
  topicFilterDesc: {
    zh: `用于确定哪些消息进入队列的过滤器。客户端可以通过订阅 \`$queue/{'{'}队列名称{'}'}/{'{'}过滤主题{'}'}\` 来从队列中消费消息，或者如果队列已存在，可以直接订阅 \`$queue/{'{'}队列名称{'}'}\``,
    en: `The filter used to determine which messages are getting into the queue.
Clients can consume messages from the queue by subscribing to \`$queue/{'{'}Queue Name{'}'}/{'{'}Topic Filter{'}'}\`, or \`$queue/{'{'}Queue Name{'}'}\` if the queue is known to exist.`,
  },
  dataRetentionPeriod: {
    zh: '数据保留期',
    en: 'Data Retention Period',
  },
  dataRetentionPeriodDesc: {
    zh: '队列中数据保留的时间',
    en: 'The period for which data is retained in the Queue.',
  },
  dispatchStrategy: {
    zh: '派发策略',
    en: 'Dispatch Strategy',
  },
  dispatchStrategyDesc: {
    zh: '用于确定队列中消息的派发策略',
    en: 'The strategy used to determine how messages are dispatched in the Queue.',
  },
  isLastvalue: {
    zh: '最后值语义',
    en: 'Last Value Semantics',
  },
  isLastvalueDesc: {
    zh: `指示消息是否具有最后值语义。最后值语义意味着消息覆盖同一主题中相同队列键的先前消息。<br />
请注意，启用此选项后，每条消息应该具有“队列键表达式”所配置的属性，以保存到队列中。`,
    en: `Indicates if the message has Last-Value semantics. Last-Value semantics means that messages overwrite previous messages with the same queue key in the same topic.<br />
Please note that each message should have the property set by "Queue Key Expression" to be saved in the queue.`,
  },
  keyExpression: {
    zh: '队列键表达式',
    en: 'Queue Key Expression',
  },
  keyExpressionDesc: {
    zh: `用于确定 Last-Value 队列中消息的队列键表达式，默认值为 \`message.from\`，即为消息的发送者客户端 ID，关于 variform 表达式可使用的函数及语法请参考 [Variform 表达式](https://docs.emqx.com/zh/emqx/latest/configuration/configuration.html#variform-%E8%A1%A8%E8%BE%BE%E5%BC%8F) 章节。注意：不支持从 \`message.payload.xxx\` 中取值作为队列键<br />
可使用的变量请参考以下数据结构：
`,
    en: `The expression used to determine the key of the message for Last-Value Queues, the default value is \`message.from\`, which is the client ID of the message publisher. For functions and syntax of variform expression, please refer to the [Variform Expressions](https://docs.emqx.com/en/emqx/latest/configuration/configuration.html#variform-expressions) chapter. Note: Extracting values from \`message.payload.xxx\` is not supported as queue key.
The variables can be referenced as follows:
`,
  },
  maxShardMessageCount: {
    zh: '最大分片消息数量',
    en: 'Max Shard Message Count',
  },
  maxShardMessageCountDesc: {
    zh: `队列中每个分片的最大消息数量，配置将进行持久化存储。`,
    en: `The maximum number of messages in a shard for the Queue, the configuration will be saved to the durable storage.`,
  },
  maxShardMessageBytes: {
    zh: '最大分片消息字节数',
    en: 'Max Shard Message Bytes',
  },
  maxShardMessageBytesDesc: {
    zh: `队列中每个分片的最大字节数，配置将进行持久化存储。`,
    en: `The maximum number of bytes in a shard for the Queue, the configuration will be saved to the durable storage.`,
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
    zh: '确定删除名为 {name} 的队列吗？',
    en: 'Confirm to delete queue with name {name}?',
  },
  // Guidance component
  createFirstMQTitle: {
    zh: '创建您的第一个 EMQX 队列',
    en: 'Create your first EMQX Queue',
  },
  mqGuidance1: {
    zh: '通过内置的队列扩展 MQTT 功能。EMQX 队列可实现分发任务、缓冲突发流量，并借助持久化支持和最后值缓存功能可靠地传递有效负载。',
    en: 'Extend MQTT with built-in queues. EMQX Queue helps you dispatch tasks, buffer bursts, and deliver commands reliably with durability and last value caching support.',
  },
  mqGuidance2: {
    zh: '即使客户端处于离线状态时也确保消息永不丢失。',
    en: 'Ensuring messages are never lost even when clients are offline.',
  },
  mqDisabledTip: {
    zh: '队列未启用，请先启用该功能。',
    en: 'Queues is not enabled, please enable it first.',
  },
  createMQQueue: {
    zh: '创建队列',
    en: 'Create Queue',
  },
  limiter: {
    zh: '消息限制',
    en: 'Limiter',
  },
  limitsDisabledTip: {
    zh: '常规队列消息限制无法在无限制和有限之间切换',
    en: 'Regular queues cannot be updated from limited to unlimited and vice versa',
  },
}
