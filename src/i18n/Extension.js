export default {
  retainer: {
    zh: '保留消息',
    en: 'Retainer',
  },
  sysTopics: {
    zh: '系统主题',
    en: 'System Topics',
  },
  sysTopicsDesc: {
    zh: '周期性将运行状态，使用统计和即时客户端事件发布到 $SYS/ 开头的系统主题。',
    en: 'Periodically publish running status, usage statistics and instant client events to system topics starting with $SYS/.',
  },
  rewrite: {
    zh: '主题重写',
    en: 'Topic Rewrite',
  },
  subscribe: {
    zh: '代理订阅',
    en: 'Auto Subscribe',
  },
  postpone: {
    zh: '延迟发布',
    en: 'Delayed Publish',
  },
  message: {
    zh: '事件消息',
    en: 'Event Message',
  },
  storage: {
    zh: '消息存储',
    en: 'Storage',
  },
  policy: {
    en: 'Policy',
    zh: '策略设置',
  },
  flowControl: {
    en: 'Flow Control',
    zh: '流控',
  },
  batchReadNumber: {
    zh: '批量加载数量',
    en: 'Batch Read Number',
  },
  batchDeliverNumber: {
    zh: '批量发布数量',
    en: 'Batch Deliver Number',
  },
  expire: {
    en: 'Expire',
    zh: '有效期',
  },
  intervalClean: {
    en: 'Clean',
    zh: '定时清理',
  },
  storageMethod: {
    zh: '存储方式',
    en: 'Method',
  },
  storageType: {
    zh: '存储类型',
    en: 'Type',
  },
  maxRetainedMessages: {
    zh: '最大保留消息数',
    en: 'Max Retained Messages',
  },
  maxPayloadSize: {
    zh: '最大消息负载大小',
    en: 'Max Payload Size',
  },
  enable: {
    zh: '启用',
    en: 'Enable',
  },
  enableDesc: {
    zh: '打开或关闭保留消息功能，停用后不会清除已保留消息',
    en: 'Enable retainer feature, disabling will not clear the saved retained messages',
  },
  enableDescDelay: {
    zh: '启用延迟发布功能，停用将终止延迟列表',
    en: 'Enable the delayed publish and disable it to delete the delayed list',
  },
  createDate: {
    zh: '发布时间',
    en: 'Created At',
  },
  unlimited: {
    zh: '不限',
    en: 'Unlimited',
  },
  custom: {
    zh: '自定义',
    en: 'Custom',
  },
  sTopic: {
    zh: '原始主题',
    en: 'Original Topic',
  },
  dTopic: {
    zh: '目标主题',
    en: 'Destination Topic',
  },
  delayedTime: {
    zh: '延迟时间',
    en: 'Delay',
  },
  remainTime: {
    zh: '剩余时间',
    en: 'Remaining',
  },
  publishTime: {
    zh: '发布时间',
    en: 'Publish Time',
  },
  eventTitleDesc: {
    zh: '将设备生命周期事件通过事件主题以 MQTT 消息的形式发布',
    en: 'Publish client life cycle events through events topic',
  },
  configMsg: {
    zh: '配置需要启用的事件消息',
    en: 'Configure event messages that need to be enabled',
  },
  client_connected: {
    en: 'Clients have already connected',
    zh: '客户端连接完成',
  },
  required: {
    zh: '请填写此项',
    en: 'Required',
  },
  client_disconnected: {
    en: 'Clients have already disconnected',
    zh: '客户端断开连接',
  },
  client_subscribed: {
    en: 'Clients have already subscribed',
    zh: '客户端完成订阅',
  },
  client_unsubscribed: {
    en: 'Clients have already unsubscribed',
    zh: '客户端取消订阅',
  },
  message_delivered: {
    en: 'Messages have already delivered',
    zh: '消息已投递',
  },
  message_dropped: {
    en: 'Messages have already dropped',
    zh: '消息已丢弃',
  },
  message_acked: {
    en: 'Messages have already acknowledged',
    zh: '消息已确认',
  },
  action: {
    zh: '动作类型',
    en: 'Action',
  },
  re: {
    zh: '正则表达式',
    en: 'Regex',
  },
  dataManage: {
    zh: '数据管理',
    en: 'Manage Data',
  },
  maxDelayedMsg: {
    zh: '最大延迟消息数',
    en: 'Max Delayed Messages',
  },
  builtInDatabase: {
    zh: '内置数据库',
    en: 'Built-in Database',
  },
  noExp: {
    en: 'Never Expire',
    zh: '永不过期',
  },
  sec: {
    en: 'Second',
    zh: '秒',
  },
  min: {
    en: 'Minute',
    zh: '分',
  },
  hour: {
    en: 'Hour',
    zh: '小时',
  },
  disable: {
    en: 'Disabled',
    zh: '禁用',
  },
  releaseInterval: {
    en: 'Quota Release Interval',
    zh: '单次发布周期',
  },
  openPayload: {
    en: 'Show Payload',
    zh: '查看 Payload',
  },
  needNumber: {
    en: 'It needs to be a number',
    zh: '请填写数字',
  },
  basicConfig: {
    zh: '基础配置',
    en: 'Basic Config',
  },
  messagePublishInterval: {
    zh: '消息发布周期',
    en: 'Messages publish interval',
  },
  heartbeatInterval: {
    zh: '心跳周期',
    en: 'Heartbeat interval',
  },
  clientEvent: {
    zh: '客户端事件',
    en: 'Client event',
  },
  clientConnected: {
    zh: '客户端已连接',
    en: 'Client connected',
  },
  clientDisconnected: {
    zh: '客户端断开连接',
    en: 'Client disconnected',
  },
  clientSubscribed: {
    zh: '客户端订阅',
    en: 'Client subscribed',
  },
  clientUnsubscribed: {
    zh: '客户端取消订阅',
    en: 'Client unsubscribed',
  },
  messages: {
    zh: '已保留消息',
    en: 'Retained Messages',
  },
  retainerDisabled: {
    zh: '保留消息功能已禁用，点击跳转到设置页面中开启。',
    en: 'Retained message is disabled, click to enable on settings page.',
  },
  msgExpiryIntervalDesc: {
    en: 'Message retention time. 0 means message will never be expired',
    zh: '消息保留时间。0 代表永久保留',
  },
  msgClearIntervalDesc: {
    en: `Periodic interval for cleaning up expired messages. Never clear if the value is 0.`,
    zh: '消息清理间隔。0 代表不进行清理',
  },
  maxPayloadSizeDesc: {
    en: 'Maximum retained message size',
    zh: '保留消息的最大长度',
  },
  typeDesc: {
    en: 'Backend type',
    zh: '后端类型',
  },
  storageTypeDesc: {
    en: 'Specifies whether the messages are stored in RAM or persisted on disc',
    zh: '选择消息是存放在磁盘还是内存中',
  },
  maxRetainedMessagesDesc: {
    en: 'Maximum number of retained messages. 0 means no limit',
    zh: '消息保留的数量上限。0 表示无限',
  },
  batchReadNumberDesc: {
    en: 'Size of the batch when reading messages from storage. 0 means no limit',
    zh: '从存储后端批量加载时的每批数量上限，0 代表一次性读取',
  },
  batchDeliverNumberDesc: {
    en: 'The number of retained messages can be delivered per batch',
    zh: '批量派发时每批的数量。0 代表一次性全部派发',
  },
  sysMsgIntervalDesc: {
    en: `Time interval of publishing \`$SYS\` messages.`,
    zh: `发送 \`$SYS\` 主题的间隔时间。`,
  },
  sysHeartbeatIntervalDesc: {
    en: `Time interval for publishing following heartbeat messages:
- \`$SYS/brokers/<node>/uptime\`
- \`$SYS/brokers/<node>/datetime\`
`,
    zh: `发送心跳系统消息的间隔时间，它包括：
- \`$SYS/brokers/<node>/uptime\`
- \`$SYS/brokers/<node>/datetime\`
`,
  },
  sysEventClientConnectedDesc: {
    en: 'Enable to publish client connected event messages',
    zh: '是否开启客户端已连接事件消息。',
  },
  sysEventClientDisconnectedDesc: {
    en: 'Enable to publish client disconnected event messages.',
    zh: '是否开启客户端已断开连接事件消息。',
  },
  sysEventClientSubscribedDesc: {
    en: 'Enable to publish event message that client subscribed a topic successfully.',
    zh: '是否开启客户端已成功订阅主题事件消息。',
  },
  sysEventClientUnsubscribedDesc: {
    en: 'Enable to publish event message that client unsubscribed a topic successfully.',
    zh: '是否开启客户端已成功取消订阅主题事件消息。',
  },
  proxySubTip: {
    zh: '通过代理订阅为客户端订阅主题时，不会经过 AuthZ 检查权限。',
    en: 'The authorization will not check permission when clients subscribe to topics through Auto Subscribe.',
  },
}
