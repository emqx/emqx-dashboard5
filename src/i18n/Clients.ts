export default {
  addASubscription: {
    zh: '添加订阅',
    en: 'New Subscription',
  },
  pleaseEnter: {
    zh: '请输入',
    en: 'Please enter',
  },
  connect: {
    zh: '连接',
    en: 'Connections',
  },
  clients: {
    zh: '客户端',
    en: 'Clients',
  },
  currentConnection: {
    zh: '当前在线连接客户端',
    en: 'Current Clients',
  },
  reset: {
    zh: '重置',
    en: 'Reset',
  },
  detailed: {
    zh: '详细',
    en: 'Detailed',
  },
  clientId: {
    zh: '客户端 ID',
    en: 'Client ID',
  },
  clientIdReg: {
    zh: '客户端 ID 表达式',
    en: 'Client ID Pattern',
  },
  clientid: {
    zh: '客户端 ID',
    en: 'Client ID',
  },
  $all: {
    zh: '全部用户',
    en: 'All users',
  },
  username: {
    zh: '用户名',
    en: 'Username',
  },
  usernameReg: {
    zh: '用户名表达式',
    en: 'Username Pattern',
  },
  ipAddress: {
    zh: 'IP 地址',
    en: 'IP Address',
  },
  ipAddressRange: {
    zh: 'IP 地址范围',
    en: 'IP Address Range',
  },
  port: {
    zh: '端口',
    en: 'Port',
  },
  keepalive: {
    zh: '心跳',
    en: 'Keepalive',
  },
  expiryInterval: {
    zh: '会话过期间隔',
    en: 'Session Expiry Interval',
  },
  createdAt: {
    zh: '会话创建时间',
    en: 'Created At',
  },
  accessNode: {
    zh: '接入节点',
    en: 'Access Node',
  },
  protocol: {
    zh: '接入协议',
    en: 'Protocol',
  },
  protocolVersion: {
    zh: '协议版本',
    en: 'Protocol Version',
  },
  protoType: {
    zh: '协议',
    en: 'Protocol',
  },
  clearSession: {
    zh: '清除会话',
    en: 'Clear Session',
  },
  SSL: {
    zh: '连接加密',
    en: 'SSL',
  },
  connectedAt: {
    zh: '连接时间',
    en: 'Connected At',
  },
  disconnectedAt: {
    zh: '断开连接时间',
    en: 'Disconnected At',
  },
  connectedStatus: {
    zh: '状态',
    en: 'Status',
  },
  connected: {
    zh: '已连接',
    en: 'Connected',
  },
  disconnected: {
    zh: '未连接',
    en: 'Disconnected',
  },
  disconnect: {
    zh: '断开连接',
    en: 'Disconnect',
  },
  cleanStart: {
    zh: 'Clean Start/清除会话',
    en: 'Clean Start/Clean Session',
  },
  cleanSession: {
    zh: '清除会话',
    en: 'Clean Session',
  },
  willDisconnectTheConnection: {
    zh: '此操作将踢除该客户端连接，是否继续？',
    en: 'This operation will kick off the client, continue?',
  },
  willKickSelectedConnections: {
    zh: '此操作将踢除选中的客户端连接，已选中 {n} 个客户端，是否继续？',
    en: 'This operation will kick off the selected clients, {n} clients have been selected, continue?',
  },
  kickedOutSuc: {
    zh: '踢除成功',
    en: 'Kicked out successfully',
  },
  willCleanSession: {
    zh: '确认清除会话？',
    en: 'Confirm Clean Session?',
  },
  successfulDisconnection: {
    zh: '断开成功',
    en: 'Successfully disconnect',
  },
  successfulCleanSession: {
    zh: '成功清除会话',
    en: 'Session cleared successfully',
  },
  clientDetails: {
    zh: '客户端详情',
    en: 'Client',
  },
  subscriptions: {
    zh: '订阅数',
    en: 'Subscriptions',
  },
  subscriptionList: {
    zh: '订阅列表',
    en: 'Subscriptions',
  },
  connectionInfo: {
    zh: '连接信息',
    en: 'Connection Info',
  },
  sessionInfo: {
    zh: '会话信息',
    en: 'Session Info',
  },
  isBridge: {
    zh: '桥接标识',
    en: 'Bridge',
  },
  sslCert: {
    zh: 'SSL 证书',
    en: 'SSL',
  },
  subscription: {
    zh: '订阅数量',
    en: 'Subscriptions',
  },
  inflight: {
    zh: '飞行窗口',
    en: 'Inflight',
  },
  mqueue: {
    zh: '消息队列',
    en: 'Message Queue',
  },
  heapSize: {
    zh: '进程堆栈',
    en: 'Heap Size',
  },
  reductions: {
    zh: 'Erlang Reduction',
    en: 'Erlang Reduction',
  },
  reductionsDesc: {
    zh: '该客户端 Erlang 进程在执行过程中消耗的 CPU 时间计数。当消耗了足够多的 CPU 时间后，调度器会将该进程挂起，切换到其他进程执行，以确保所有进程都能公平地使用 CPU 资源。',
    en: "The client Erlang process's CPU time consumption count during execution. When a sufficient amount of CPU time has been consumed, the scheduler will suspend the process and switch to other processes to ensure that all processes have fair access to CPU resources.",
  },
  mailbox: {
    zh: '进程邮箱中的消息数量',
    en: 'Mailbox',
  },
  currentSubscription: {
    zh: '当前订阅',
    en: 'Subscriptions',
  },
  node: {
    zh: '节点',
    en: 'Node',
  },
  unsubscribe: {
    zh: '取消订阅',
    en: 'Unsubscribe',
  },
  unsubscribeTitle: {
    zh: '此操作将取消订阅该主题',
    en: 'This action will cancel subscription to the topic',
  },
  recvCnt: {
    zh: '接收的 TCP 报文数量',
    en: 'TCP Packets Received',
  },
  recvSocketCnt: {
    zh: '接收的 Socket 报文数量',
    en: 'Socket Packets Received',
  },
  recvMsg: {
    zh: '消息发布总数',
    en: 'Published Messages',
  },
  recvOct: {
    zh: '接收字节数',
    en: 'Bytes Received',
  },
  recvPkt: {
    zh: '接收的{proto}报文数量',
    en: '{proto}Packets Received',
  },
  sendCnt: {
    zh: '发送的 TCP 报文数量',
    en: 'TCP Packets Sent',
  },
  sendSocketCnt: {
    zh: '发送的 Socket 报文数量',
    en: 'Socket Packets Sent',
  },
  sendMsg: {
    zh: '消息接收总数',
    en: 'Messages Received',
  },
  sendOct: {
    zh: '发送字节数',
    en: 'Bytes Sent',
  },
  sendPkt: {
    zh: '发送的{proto}报文数量',
    en: '{proto}Packets Sent',
  },
  sendLwPkt: {
    zh: '发送的报文数量',
    en: 'Messages Sent',
  },
  recvMsgQos0: {
    zh: 'QoS 0 消息发布',
    en: 'QoS 0 Messages Published',
  },
  recvMsgQos1: {
    zh: 'QoS 1 消息发布',
    en: 'QoS 1 Messages Published',
  },
  recvMsgQos2: {
    zh: 'QoS 2 消息发布',
    en: 'QoS 2 Messages Published',
  },
  recvMsgDropped: {
    zh: '消息发布丢弃数',
    en: 'Dropped Published Messages',
  },
  recvMsgDroppedAwaitPubrelTimeout: {
    zh: '消息发布丢弃数（过期）',
    en: 'Dropped Published Messages (Expired)',
  },
  sendMsgQos0: {
    zh: 'QoS 0 消息接收',
    en: 'QoS 0 Messages Received',
  },
  sendMsgQos1: {
    zh: 'QoS 1 消息接收',
    en: 'QoS 1 Messages Received',
  },
  sendMsgQos2: {
    zh: 'QoS 2 消息接收',
    en: 'QoS 2 Messages Received',
  },
  sendMsgDropped: {
    zh: '消息接收丢弃数',
    en: 'Dropped Incoming Messages',
  },
  sendMsgDroppedExpired: {
    zh: '消息接收丢弃数（过期）',
    en: 'Dropped Incoming Messages (Expired)',
  },
  sendMsgDroppedQueueFull: {
    zh: '消息接收丢弃数（队列已满）',
    en: 'Dropped Incoming Messages (Queue Full)',
  },
  sendMsgDroppedTooLarge: {
    zh: '消息接收丢弃数（消息过大）',
    en: 'Dropped Incoming Messages (Oversize)',
  },
  kickOut: {
    zh: '踢除',
    en: 'Kick Out',
  },
  awaitingRel: {
    zh: 'QoS 2 报文接收队列',
    en: 'QoS 2 Message Receive Queue',
  },
  collapse: {
    zh: '折叠',
    en: 'Collapse',
  },
  expand: {
    zh: '展开',
    en: 'Expand',
  },
  clientDetailErr: {
    zh: '客户端详情获取出错',
    en: "There are some errors occurred in retrieving the client's detail",
  },
  endpointName: {
    zh: 'Endpoint',
    en: 'Endpoint',
  },
  lifetime: {
    zh: '注册时间',
    en: 'LifeTime',
  },
  clientDoesNotExist: {
    zh: '该客户端不存在',
    en: 'The client does not exist',
  },
  gte: {
    zh: '在此之后',
    en: 'After',
  },
  lte: {
    zh: '在此之前',
    en: 'Before',
  },
  bytes: {
    zh: '流量收发（字节）',
    en: 'Bytes',
  },
  packets: {
    zh: '报文',
    en: 'Packets',
  },
  messages: {
    zh: '消息数量',
    en: 'Messages',
  },
  wildcardSupported: {
    zh: '支持使用主题通配符',
    en: 'Topic Wildcards is available',
  },
  wildcard: {
    zh: '通配符',
    en: 'Wildcard',
  },
  topicFilterDesc: {
    zh: '例如，输入 test/#，将过滤得到 topic 是 test/1、test/2 等的订阅',
    en: 'e.g. typing test/# will filter for subscriptions where the topic is test/1, test/2, etc.',
  },
  noLocal: {
    zh: '禁止本地转发',
    en: 'No Local',
  },
  retainAsPublished: {
    zh: '发布时状态保留',
    en: 'Retain as Published',
  },
  retainHandling: {
    zh: '保留消息处理',
    en: 'Retain Handling',
  },
  topic: {
    zh: '主题',
    en: 'Topic',
  },
  qos: {
    zh: 'QoS',
    en: 'QoS',
  },
  payload: {
    zh: 'Payload',
    en: 'Payload',
  },
  from_clientid: {
    zh: '来自于客户端 ID',
    en: 'From Client ID',
  },
  from_username: {
    zh: '来自于用户名',
    en: 'From Username',
  },
  reason: {
    zh: '原因',
    en: 'Reason',
  },
  peername: {
    zh: 'Peername',
    en: 'Peername',
  },
  action: {
    zh: '动作',
    en: 'Action',
  },
  result: {
    zh: '结果',
    en: 'Result',
  },
  reason_code: {
    zh: '原因码',
    en: 'Reason Code',
  },
  neverExpire: {
    zh: '永不过期',
    en: 'Never Expire',
  },
  viewMsg: {
    zh: '查看消息',
    en: 'View Message',
  },
  msgId: {
    zh: '消息 ID',
    en: 'Message ID',
  },
  inflightMsgList: {
    zh: '飞行窗口消息列表',
    en: 'Inflight Messages',
  },
  msgQueueMsgList: {
    zh: '消息队列消息列表',
    en: 'Message Queue Messages',
  },
  priority: {
    zh: '优先级',
    en: 'Priority',
  },
  listener: {
    zh: '监听器',
    en: 'Listener',
  },
  clientAttrs: {
    zh: '客户端属性',
    en: 'Client Attributes',
  },
  mqueueDesc: {
    zh: '消息队列用于存储因飞行窗口限制而无法发送的消息，以及在客户端离线时临时存储消息。队列有长度限制，如果达到限制，QoS 0 以及最旧的消息将被丢弃。',
    en: 'Message queue used to store messages that cannot be sent due to the limit of inflight window, and to temporarily store messages when a client is offline. The message queue has a length limit, and if it is reached, the oldest messages will be dropped.',
  },
  inflightDesc: {
    zh: 'EMQX 允许多个未确认的 QoS 1 和 QoS 2 报文同时存在于网路链路上。这些已发送但未确认的报文将被存放在 Inflight Window 中直至完成确认。',
    en: 'EMQX allows multiple unacknowledged QoS 1 and QoS 2 packets to exist on the network link at the same time. These sent but unconfirmed packets will be stored in the Inflight Window until acknowledgment is complete.',
  },
  cannotViewMsg: {
    zh: '当开启持久会话时，将无法查看消息列表',
    en: 'Message list is unavailable when persistent session is enabled',
  },
  validation: {
    zh: 'Schema 校验名称',
    en: 'Schema Validation Name',
  },
  exactQuery: {
    zh: '精准查询',
    en: 'Exact Query',
  },
  fuzzySearch: {
    zh: '模糊搜索',
    en: 'Fuzzy Search',
  },
  enableFuzzySearch: {
    zh: '启用模糊搜索',
    en: 'Enable Fuzzy Search',
  },
  pageJumpTip: {
    zh: '该页暂无数据，已自动跳转至第一页。',
    en: 'No data available on this page. Redirected to the first page.',
  },
}
