export default {
  mqtt: {
    zh: 'MQTT',
    en: 'MQTT',
  },
  cluster: {
    zh: '集群',
    en: 'Cluster',
  },
  log: {
    zh: '日志',
    en: 'Log',
  },
  dashboard: {
    zh: '仪表盘',
    en: 'Dashboard',
  },
  global: {
    zh: '全局',
    en: 'Global',
  },
  default: {
    zh: '默认',
    en: 'Default',
  },
  mqttPath: {
    zh: "WebSocket 连接 URL 中的路径，应以 `/` 开头，并支持子路径。默认情况下，WebSocket 客户端连接的完整 URL 为 `ws://{'{'}ip{'}'}:{'{'}port{'}'}/mqtt`。<br/>支持在路径末尾添加 `/[...]` 表示任意子路径。例如，当设置为 `/mqtt/[...]` 时，可以接受 `/mqtt/org1`、`/mqtt/org1/app1` 等连接。<br/>注意，如果客户端连接的路径与配置不匹配，则连接将在 HTTP 层被拒绝。",
    en: "The path in the WebSocket connection URL, which should start with `/` and supports subpaths. By default, the full URL of a WebSocket client connection is `ws://{'{'}ip{'}'}:{'{'}port{'}'}/mqtt`.<br/>It is supported to add `/[...] ` at the end of the path to make EMOX accept any subpath. For example, specifying `/mqtt/[...]` would allow clients to connect at paths like `mqtt/org1` or `mqtt/org1/app1`, etc.<br/><br/>NOTE: An unmatched path will cause the client to be rejected immediately at the HTTP  laver.",
  },
  readOnlyTip: {
    zh: '此配置项不支持热配置，请到配置文件内修改并重启服务',
    en: 'This configuration does not support online-reload. Please update the config file and restart EMQX.',
  },
  telemetry: {
    zh: '遥测数据',
    en: 'Telemetry',
  },
  telemetryTip: {
    zh: '遥测收集有关 EMQX 使用情况的信息，与我们共享这些指标可以帮助我们更好地了解您如何使用我们的产品，并可以持续地帮助我们改进产品',
    en: 'Telemetry collects information about EMQX usage. Sharing these metrics helps us to better understand how EMQX is used, so we can continuously improve it.',
  },
  enableTelemetry: {
    zh: '启动遥测',
    en: 'Enable telemetry',
  },
  rate: {
    zh: '速率限制',
    en: 'Rate Limit',
  },
  limiter: {
    zh: '速率限制器',
    en: 'Limiter',
  },
  invaiteNode: {
    zh: '邀请节点',
    en: 'Invite nodes',
  },
  inviteNodeDesc: {
    zh: "当集群节点的服务发现方法 ('cluster.discovery_strategy') 是 'manual' 的时候，可手动邀请节点加入集群",
    en: "When 'cluster.service_discovery' is configured with 'manual', you may invite another node to join the cluster.",
  },
  removeNodeConfirm: {
    zh: '是否移除该节点？',
    en: 'This will remove the current node Continue?',
  },
  invite: {
    zh: '邀请',
    en: 'Invite',
  },
  inviteSuccess: {
    zh: '邀请成功',
    en: 'Invite Successfully',
  },
  currentNode: {
    zh: '当前节点',
    en: 'Current Node',
  },
  nodeRequired: {
    zh: '请输入节点名称',
    en: 'Node name is required',
  },
  basic: {
    zh: '基础',
    en: 'Basic',
  },
  confirmDeleteListenerType: {
    zh: '请输入监听器的名称来确认删除',
    en: 'Please type the listener name to confirm.',
  },
  acceptors: {
    zh: '接收器',
    en: 'Acceptors',
  },
  proxyProtocol: {
    zh: '代理协议',
    en: 'Proxy Protocol',
  },
  proxyProtocolTimeout: {
    zh: '代理协议超时',
    en: 'Proxy Protocol Timeout',
  },
  /* Tab Name */
  vm: {
    zh: 'Erlang 虚拟机',
    en: 'Erlang VM',
  },
  os: {
    zh: '操作系统',
    en: 'Operating System',
  },
  console: {
    zh: '控制台日志',
    en: 'Console Logs',
  },
  file: {
    zh: '文件日志',
    en: 'File Logs',
  },
  throttling: {
    zh: '日志限流',
    en: 'Throttling',
  },
  audit: {
    zh: '审计日志',
    en: 'Audit Logs',
  },
  connection: {
    zh: '连接速率',
    en: 'Connection',
  },
  rateMatchError: {
    zh: '请输入格式正确的速率配置',
    en: 'Please enter a properly formatted rate configuration',
  },
  updateListenerTip: {
    zh: '注意：如果更改非 QUIC 类型的监听器端口，将会断开所有已存在的连接，是否继续？',
    en: 'Note: If the port of listeners (except QUIC type) is changed, all existing connections will be disconnected. Continue?',
  },
  duplicatedAttrError: {
    zh: '存在相同的属性',
    en: 'Duplicated Attribute',
  },
  fileStorage: {
    zh: '文件存储',
    en: 'File Storage',
  },
  localStorage: {
    zh: '本地存储',
    en: 'Local Storage',
  },
  s3Storage: {
    zh: 'S3 存储',
    en: 'S3 Storage',
  },
  clusterName: {
    zh: '集群名称',
    en: 'Cluster Name',
  },
  clusterNameDesc: {
    zh: '连接的（远程）集群的名称，必须与远程集群配置中的 `cluster.name` 完全一致，同时**不能**与本地的 `cluster.name` 相同。所有配置的集群名称必须唯一。',
    en: 'Linked (remote) cluster name. Must be exactly equal to the value of `cluster.name` configured at the remote cluster. Must **not** be equal to the local `cluster.name`. All configured cluster link names must be unique.',
  },
  serverAddressDesc: {
    zh: '远程 EMQX 服务的 MQTT 主机和端口。',
    en: 'MQTT host and port of the remote EMQX broker.',
  },
  clientIdPrefix: {
    zh: '客户端 ID 前缀',
    en: 'Client ID Prefix',
  },
  clientIdPrefixDesc: {
    zh: '如果省略，则默认使用本地的 `cluster.name`。EMQX 会在连接集群时维护多个连接，并自动在基础客户端 ID 后添加不同的后缀。',
    en: 'If omitted, local `cluster.name` is used. EMQX maintains several connections between linked clusters, so distinct suffixes are automatically appended to the base client ID.',
  },
  disabledDeleteTopicTopic: {
    zh: '请先禁用再删除主题',
    en: 'Please disable the link before deleting',
  },
  linkingRateBarDesc: {
    zh: '近一分钟内消息转发次数趋势',
    en: 'Message forwarding times trend in the last minute',
  },
  linkingNodesMetricsDesc: {
    zh: '消息转发在各节点上的执行情况及效率',
    en: 'Execution status and efficiency of message forwarding on each node',
  },
  linkingTopicsDesc: {
    zh: '由连接的远程 EMQX 服务转发至本地代理的 MQTT 主题。仅当本地 EMQX 服务有匹配的订阅者时，消息才会被转发。<br />支持通配符。如果在连接的一侧设置空主题列表，可实现单向连接：空主题列表的一侧不会接收远程消息，但可以根据另一侧配置的主题，将相关消息转发给其连接方。',
    en: "MQTT topics to be forwarded by the linked remote EMQX broker to the local broker. Messages are only forwarded if the local EMQX broker has matching subscriber(s).<br />Wildcards are supported. Setting empty topics list on one side of the link can be used to establish unidirectional links: the side with the empty topics won't receive remote messages, but it can forward relevant messages to its linked counterpart (according to the topics configured on that side of the link).",
  },
  routes: {
    zh: '路由',
    en: 'Routes',
  },
  routesDesc: {
    zh: '从远程集群复制到本集群的路由数量',
    en: 'Number of replicated routes from remote cluster to this cluster',
  },
  matched: {
    zh: '匹配',
    en: 'Matched',
  },
  dropped: {
    zh: '丢弃',
    en: 'Dropped',
  },
  retried: {
    zh: '重试',
    en: 'Retried',
  },
  others: {
    zh: '其他',
    en: 'Others',
  },
}
