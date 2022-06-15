import getDocLinks from '@/common/docLinks.ts'

const enDocLinkMap = getDocLinks('en')
const zhDocLinkMap = getDocLinks('zh')

export default {
  networkGraph: {
    en: 'Cluster',
    zh: '集群拓扑',
  },
  shareSubscription: {
    zh: '共享订阅',
    en: 'Shared Subscriptions',
  },
  subscription: {
    zh: '订阅',
    en: 'Subscriptions',
  },
  retained: {
    zh: '保留消息',
    en: 'Retained',
  },
  connectionsTips: {
    zh: '活跃连接数',
    en: 'Active Connections',
  },
  view: {
    zh: '查看',
    en: 'View',
  },
  viewMore: {
    zh: '查看详情',
    en: 'View More',
  },
  systemTime: {
    zh: '系统时间',
    en: 'System Time',
  },
  uptime: {
    zh: '运行时长',
    en: 'Uptime',
  },
  currentConnection: {
    zh: '连接数',
    en: 'Connections',
  },
  nodeStatus: {
    zh: '状态',
    en: 'Status',
  },
  running: {
    zh: '运行中',
    en: 'Running',
  },
  stopped: {
    zh: '已停止',
    en: 'Stopped',
  },
  erlangVMMemory: {
    zh: 'VM 内存',
    en: 'VM Memory',
  },
  memory: {
    zh: '内存',
    en: 'Memory',
  },
  maxFds: {
    zh: '最大文件句柄',
    en: 'Max FDs',
  },
  process: {
    zh: '进程',
    en: 'Processes',
  },
  load: {
    zh: '负载',
    en: 'Load',
  },
  monitor: {
    zh: '监控',
    en: 'Monitor',
  },
  nodeName: {
    zh: '节点名称',
    en: 'Node Name',
  },
  nodeList: {
    zh: '节点列表',
    en: 'Nodes',
  },
  nodeData: {
    zh: '节点信息',
    en: 'Node Data',
  },
  nodeStatis: {
    zh: '节点统计',
    en: 'Node Statistics',
  },
  currentNodeInfo: {
    zh: '节点信息',
    en: 'Node info',
  },
  basicInfo: {
    zh: '基础信息',
    en: 'Basic Info',
  },
  metric: {
    zh: '指标',
    en: 'Metric',
  },
  configuration: {
    zh: '配置信息',
    en: 'Configuration',
  },
  version: {
    zh: '版本信息',
    en: 'Version',
  },
  basic: {
    zh: '基础信息',
    en: 'Basic',
  },
  listener: {
    zh: '监听器',
    en: 'Listener',
  },
  ListeningPorts: {
    zh: '当前监听端口列表',
    en: 'Listening address and ports',
  },
  listenerProtocol: {
    zh: '监听协议',
    en: 'Protocol',
  },
  listenerAddress: {
    zh: '监听地址',
    en: 'Address',
  },
  connectCurrentAndMax: {
    zh: '连接 (当前/最大)',
    en: 'Connect (Current/Max)',
  },
  current: {
    zh: '当前',
    en: 'Current',
  },
  maximum: {
    zh: '最大',
    en: 'Maximum',
  },
  dataList: {
    zh: '数据列表',
    en: 'Data List',
  },
  packetStatisticsOfNodes: {
    zh: '集群或单个节点的报文信息，消息统计与流量收发统计',
    en: 'Packet statistics of cluster or node, Message I/O Statistics',
  },
  mqttPackets: {
    zh: '报文',
    en: 'Packets',
  },
  messageNumber: {
    zh: '消息数量',
    en: 'Messages',
  },
  traffic: {
    zh: '流量收发（字节）',
    en: 'Bytes',
  },
  client: {
    zh: '客户端',
    en: 'Client',
  },
  session: {
    zh: '会话',
    en: 'Sessions',
  },
  mainConfiguration: {
    zh: '节点主要配置',
    en: 'Main Configuration',
  },
  status: {
    zh: '状态',
    en: 'Status',
  },
  node: {
    zh: '{n} 节点',
    en: '{n} Node | {n} Nodes',
  },
  nodesNun: {
    zh: '节点数',
    en: 'Nodes',
  },
  numberOfNodesInCluster: {
    zh: '集群中节点数',
    en: 'Nodes',
  },
  strip: {
    zh: '{n} 条',
    en: '0 message | {n} message | {n} messages',
  },
  byte: {
    zh: ' 字节',
    en: ' byte',
  },
  second: {
    zh: '秒',
    en: 's',
  },
  messageOut: {
    zh: '消息发出',
    en: 'Outgoing Messages',
  },
  currentMessageOutRate: {
    zh: '消息流出速率：',
    en: 'Outgoing Rate:',
  },
  messageIn: {
    zh: '消息流入',
    en: 'Incoming Messages',
  },
  currentMessageInRate: {
    zh: '消息流入速率：',
    en: 'Incoming Rate:',
  },
  subscriptionNumber: {
    zh: '订阅数',
    en: 'Subscriptions',
  },
  topicNumber: {
    zh: '集群订阅关系数',
    en: 'Topics',
  },
  connection: {
    zh: '连接',
    en: 'Connections',
  },
  connectionNumber: {
    zh: '连接数',
    en: 'Connections',
  },
  maxConnections: {
    zh: '连接数峰值',
    en: 'Max Connections',
  },
  noData: {
    zh: '暂无数据',
    en: 'No data',
  },
  customer: {
    zh: '签发对象',
    en: 'Customer',
  },
  numberOfConnectionLines: {
    zh: 'License 使用情况',
    en: 'License usage',
  },
  issuanceOfEmail: {
    zh: '签发邮箱',
    en: 'email',
  },
  issuedAt: {
    zh: '签发时间',
    en: 'Issued At',
  },
  expireAt: {
    zh: '到期时间',
    en: 'Expire At',
  },
  beforeTheCertificateExpires: {
    zh: '证书到期前 EMQ 将通过邮件通知签发邮箱，请留意信息接收以免错过续期时间对业务造成影响。',
    en: 'EMQ will email notification before the license expires. Please pay attention to the contact email inbox.',
  },
  forTrialEdition: {
    zh: '当前 License 为试用版',
    en: 'The license is for trial',
  },
  license: {
    zh: 'License 信息',
    en: 'License',
  },
  trialEdition: {
    zh: '试用版',
    en: 'For Trial',
  },
  messageDrop: {
    zh: '消息丢弃',
    en: 'Dropped Messages',
  },
  delivery: {
    zh: '消息分发',
    en: 'Delivery',
  },
  auth: {
    zh: '认证与权限',
    en: 'Access',
  },
  topics: {
    zh: '主题数',
    en: 'Topics',
  },
  Subscription: {
    zh: '订阅数',
    en: 'Subscriptions',
  },
  message: {
    zh: '消息',
    en: 'Messages',
  },
  messaging: {
    zh: '消息传输',
    en: 'Messaging',
  },
  rate: {
    zh: '速率',
    en: 'Rate',
  },
  notPromptAgain: {
    zh: '不再提示',
    en: 'Stop showing this',
  },
  licenseExpiryTip: {
    zh: `
    您的试用 License 已过期，请<a target="_blank"  href="${zhDocLinkMap.applyLicense}">更新 License</a>或联系销售人员更新 License。
    `,
    en: `
    Your license has expired. Please <a target="_blank"  href="${enDocLinkMap.applyLicense}">apply</a> for a new license or contact EMQ customer services.
    `,
  },
  licenseEvaluationTip: {
    zh: `
    当前正在使用评估 License，限制为10个连接。请<a target="_blank"  href="${zhDocLinkMap.applyLicense}">升级 License</a> 。<br/>
    如已购买 License，请使用 <code>emqx ctl license update</code> 命令进行升级`,
    en: `
    You are using a 10-connection evaluation license. Please<a target="_blank"  href="${enDocLinkMap.applyLicense}"> upgrade license </a>.<br/>
    If you have already received a license, please update with command <code>emqx ctl license update</code>`,
  },
  konw: {
    zh: '知道了',
    en: 'Acknowledge',
  },
  expired: {
    zh: '过期',
    en: 'Expired',
  },
  noSubscribers: {
    zh: '无订阅者',
    en: 'No Subscribers',
  },
  receivedMsg: {
    zh: '消息接收',
    en: 'Received',
  },
  sentMsg: {
    zh: '消息发送',
    en: 'Sent',
  },
  droppedMsg: {
    zh: '消息丢弃',
    en: 'Dropped',
  },
  integration: {
    zh: '数据指标集成',
    en: 'Metrics Integration',
  },
  integrationDesc: {
    zh: '集成指标数据外部的监控与告警管理',
    en: 'Integrated monitoring and alerting toolkit',
  },
  promDesc: {
    zh: '使用 Prometheus 采集指标数据',
    en: 'Integrated with Prometheus',
  },
  statsdDesc: {
    zh: '使用 StatsD 采集指标数据',
    en: 'Integration with StatsD',
  },
  role: {
    zh: '角色',
    en: 'Role',
  },
  logPath: {
    zh: '日志路径',
    en: 'Log Path',
  },
  sysPath: {
    zh: '系统路径',
    en: 'System Path',
  },
  explore: {
    zh: '探索数据',
    en: 'Explore Data',
  },
  lastHour: {
    zh: '过去 1 小时',
    en: 'Last hour',
  },
  last6Hours: {
    zh: '过去 6 小时',
    en: 'Last 6 hours',
  },
  last12Hours: {
    zh: '过去 12 时',
    en: 'Last 12 hours',
  },
  lastDay: {
    zh: '过去 1 天',
    en: 'Last day',
  },
  last3Days: {
    zh: '过去 3 天',
    en: 'Last 3 days',
  },
  last7Days: {
    zh: '过去 7 天',
    en: 'Last 7 days',
  },
  connack: {
    zh: '确认连接请求',
    en: 'Connack',
  },
  connected: {
    zh: '已连接数',
    en: 'Connected',
  },
  connect: {
    zh: '连接数',
    en: 'Connect',
  },
  unsubscribe: {
    zh: '取消订阅数',
    en: 'Unsubscribe',
  },
  disconnected: {
    zh: '断开连接数',
    en: 'Disconnected',
  },
  subscribe: {
    zh: '订阅数',
    en: 'Subscribe',
  },
  created: {
    zh: '已创建',
    en: 'Created',
  },
  discarded: {
    zh: '已丢弃',
    en: 'Discarded',
  },
  resumed: {
    zh: '已恢复',
    en: 'Resumed',
  },
  takenover: {
    zh: '已接管',
    en: 'Takenover',
  },
  terminated: {
    zh: '已终止',
    en: 'Terminated',
  },
  auth_anonymous: {
    zh: '匿名访问数',
    en: 'Anonymous',
  },
  authenticate: {
    zh: '认证数',
    en: 'Authenticate',
  },
  allow: {
    zh: '授权允许数',
    en: 'Authorization Allow',
  },
  cache_hit: {
    zh: '授权缓存命中数',
    en: 'Authorization Cache Hit',
  },
  deny: {
    zh: '授权拒绝数',
    en: 'Authorization Deny',
  },
  matched_allow: {
    zh: '授权匹配允许数',
    en: 'Authorization Matched Allow',
  },
  matched_deny: {
    zh: '授权匹配拒绝数',
    en: 'Authorization Matched Deny',
  },
  nomatch: {
    zh: '授权匹配未命中数',
    en: 'Authorization No Match',
  },
  authorize: {
    zh: '授权数',
    en: 'Authorize',
  },
  received: {
    zh: '已接收',
    en: 'Received',
  },
  sent: {
    zh: '已发送',
    en: 'Sent',
  },
  acked: {
    zh: '已应答',
    en: 'Acked',
  },
  delayed: {
    zh: '已延迟',
    en: 'Delayed',
  },
  delivered: {
    zh: '已分发',
    en: 'Delivered',
  },
  dropped: {
    zh: '已丢弃',
    en: 'Dropped',
  },
  dropped_await_pubrel_timeout: {
    zh: '已丢弃等待 pubrel 超时',
    en: 'Dropped Await Pubrel Timeout',
  },
  dropped_no_subscribers: {
    zh: '已丢弃无订阅者',
    en: 'Dropped No Subscribers',
  },
  forward: {
    zh: '已转发',
    en: 'Forward',
  },
  publish: {
    zh: '发布',
    en: 'Publish',
  },
  qos0_received: {
    zh: 'QoS 0 已接收',
    en: 'QoS 0 Received',
  },
  qos1_received: {
    zh: 'QoS 1 已接收',
    en: 'QoS 1 Received',
  },
  qos2_received: {
    zh: 'QoS 2 已接收',
    en: 'QoS 2 Received',
  },
  qos0_sent: {
    zh: 'QoS 0 已发送',
    en: 'QoS 0 Sent',
  },
  qos1_sent: {
    zh: 'QoS 1 已发送',
    en: 'QoS 1 Sent',
  },
  qos2_sent: {
    zh: 'QoS 2 已发送',
    en: 'QoS 2 Sent',
  },
  dropped_expired: {
    zh: '已丢弃过期消息数',
    en: 'Dropped Expired Messages',
  },
  dropped_no_local: {
    zh: '已丢弃非本地消息数',
    en: 'Dropped No Local Messages',
  },
  dropped_qos0_msg: {
    zh: '已丢弃 QoS 0 消息',
    en: 'Dropped QoS 0 Messages',
  },
  dropped_queue_full: {
    zh: '已丢弃（队列已满）',
    en: 'Dropped Messages (Queue Full)',
  },
  dropped_too_large: {
    zh: '已丢弃过大消息数',
    en: 'Dropped Too Large Messages',
  },
  auth_received: {
    zh: '接收的认证报文',
    en: 'Auth Received',
  },
  auth_sent: {
    zh: '发送的认证报文',
    en: 'Auth Sent',
  },
  connack_auth_error: {
    zh: '应答认证错误报文',
    en: 'Connack Auth Error',
  },
  connack_error: {
    zh: '应答错误报文',
    en: 'Connack Error',
  },
  connack_sent: {
    zh: '发送应答报文',
    en: 'Connack Sent',
  },
  connect_received: {
    zh: '接收已连接报文',
    en: 'Connect Received',
  },
  disconnect_received: {
    zh: '接收已断开报文',
    en: 'Disconnect Received',
  },
  disconnect_sent: {
    zh: '发送已断开报文',
    en: 'Disconnect Sent',
  },
  pingreq_received: {
    zh: '接收已请求心跳报文',
    en: 'Ping Request Received',
  },
  pingresp_sent: {
    zh: '发送已回复心跳报文',
    en: 'Ping Response Sent',
  },
  puback_inuse: {
    zh: '已使用的 Puback',
    en: 'Puback Inuse',
  },
  puback_missed: {
    zh: '未使用的 Puback',
    en: 'Puback Missed',
  },
  puback_received: {
    zh: '接收的 Puback',
    en: 'Puback Received',
  },
  puback_sent: {
    zh: '发送的 Puback',
    en: 'Puback Sent',
  },
  pubcomp_inuse: {
    zh: '已使用的 Pubcomp',
    en: 'Pubcomp Inuse',
  },
  pubcomp_missed: {
    zh: '未使用的 Pubcomp',
    en: 'Pubcomp Missed',
  },
  pubcomp_received: {
    zh: '接收的 Pubcomp',
    en: 'Pubcomp Received',
  },
  pubcomp_sent: {
    zh: '发送的 Pubcomp',
    en: 'Pubcomp Sent',
  },
  publish_auth_error: {
    zh: '发布权限错误报文',
    en: 'Publish Auth Error',
  },
  publish_dropped: {
    zh: '发布已丢弃报文',
    en: 'Publish Dropped',
  },
  publish_error: {
    zh: '发布错误报文',
    en: 'Publish Error',
  },
  publish_inuse: {
    zh: '已使用的发布报文',
    en: 'Publish Inuse',
  },
  publish_received: {
    zh: '接收的发布报文',
    en: 'Publish Received',
  },
  publish_sent: {
    zh: '发送的发布报文',
    en: 'Publish Sent',
  },
  pubrec_inuse: {
    zh: '已使用的 Pubrec 报文',
    en: 'Pubrec Inuse',
  },
  pubrec_missed: {
    zh: '未使用的 Pubrec 报文',
    en: 'Pubrec Missed',
  },
  pubrec_received: {
    zh: '接收的 Pubrec 报文',
    en: 'Pubrec Received',
  },
  pubrec_sent: {
    zh: '发送的 Pubrec 报文',
    en: 'Pubrec Sent',
  },
  pubrel_missed: {
    zh: '未使用的 Pubrel 报文',
    en: 'Pubrel Missed',
  },
  pubrel_received: {
    zh: '接收的 Pubrel 报文',
    en: 'Pubrel Received',
  },
  pubrel_sent: {
    zh: '发送的 Pubrel 报文',
    en: 'Pubrel Sent',
  },
  suback_sent: {
    zh: '发送的 Suback 报文',
    en: 'Suback Sent',
  },
  subscribe_auth_error: {
    zh: '订阅权限错误报文',
    en: 'Subscribe Auth Error',
  },
  subscribe_error: {
    zh: '订阅错误报文',
    en: 'Subscribe Error',
  },
  subscribe_received: {
    zh: '接收的订阅报文',
    en: 'Subscribe Received',
  },
  unsuback_sent: {
    zh: '发送的 Unsuback 报文',
    en: 'Unsuback Sent',
  },
  unsubscribe_error: {
    zh: '取消订阅错误报文',
    en: 'Unsubscribe Error',
  },
  unsubscribe_received: {
    zh: '接收的取消订阅报文',
    en: 'Unsubscribe Received',
  },
}
