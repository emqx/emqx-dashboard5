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
  licenseTypeInviteForbidden: {
    zh: '社区版 License 不支持邀请节点',
    en: 'Community license does not support inviting nodes',
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
  clusterNodes: {
    zh: '集群节点',
    en: 'Cluster Nodes',
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
  coreNodes: {
    zh: '核心节点',
    en: 'Core Nodes',
  },
  replicantNodes: {
    zh: '副本节点',
    en: 'Replicant Nodes',
  },
  replicantNodeTooltip: {
    zh: '副本节点可以直接停止和删除，无需从集群中显式移除。',
    en: 'Replicant nodes can be directly stopped and deleted without explicitly removing them from the cluster.',
  },
  namespace: {
    zh: '命名空间',
    en: 'Namespace',
  },
  maxSessions: {
    zh: '最大会话数',
    en: 'Max Sessions',
  },
  deleteNamespaceTip: {
    zh: '确定删除命名空间？',
    en: 'Are you sure you want to delete this namespace？',
  },
  deleteNamespaceConfirmFirst: {
    zh: '此操作无法撤销',
    en: 'This action cannot be undone.',
  },
  deleteNamespaceConfirmSecond: {
    zh: '这将永久删除 {target} 命名空间',
    en: 'This will permanently delete the {target} namespace.',
  },
  tenant: {
    zh: '租户',
    en: 'Tenant',
  },
  client: {
    zh: '客户端',
    en: 'Client',
  },
  targetLimiter: {
    zh: '{target}速率限制',
    en: '{target} Limiter',
  },
  enableTargetLimiter: {
    zh: '启用{target}速率限制',
    en: 'Enable {target} Limiter',
  },
  targetMaxPubRate: {
    zh: '{target}最大发布速率',
    en: '{target} Max Publish Rate',
  },
  currentTenant: {
    zh: '当前租户',
    en: 'Current Tenant',
  },
  noConfigured: {
    zh: '未配置',
    en: 'No Config',
  },
  cannotOperateNotExplicitCreatedNamespace: {
    zh: '无法操作非显式创建的命名空间',
    en: 'Cannot operate namespaces that are not explicitly created',
  },
  managedNamespacesOnly: {
    zh: '仅显示受管理的命名空间',
    en: 'Managed Namespaces Only',
  },
  kickOutAllClients: {
    zh: '踢除该命名空间下所有客户端',
    en: 'Kick Out All Clients in This Namespace',
  },
  kickOutAllClientsConfirm: {
    zh: '确定踢除该命名空间下所有 {n} 个客户端？',
    en: 'Are you sure you want to kick out all {n} clients in this namespace?',
  },
  batchKickOut: {
    zh: '批量踢除',
    en: 'Batch Kick Out',
  },
  tenantLimiterDesc: {
    zh: `租户速率限制器的令牌在命名空间内的所有客户端之间共享。<br/>
当为命名空间配置租户速率限制器时，它将与现有的 MQTT 速率限制器组合生效。<br/>
即 MQTT 速率限制器和命名空间租户速率限制器会同时对客户端施加限制。`,
    en: `Tenant rate limiters have tokens that are shared between all clients in the namespace.<br/>
If this kind is configured for a namespace, it composes with any existing MQTT rate limiters.<br/>
That is: both MQTT limiters and namespace tenant rate limiters apply to the clients at the same time.`,
  },
  clientLimiterDesc: {
    zh: `客户端速率限制器的令牌在命名空间内对每个客户端独占。<br />
当为命名空间配置此类型的限流器时，它将替代现有的监听器速率限制器。<br /> 
即当启用此配置时，监听器限流器将被忽略。<br />`,
    en: `Client rate limiters have tokens that are exclusive to each client in the namespace.<br />
If this kind is configured for a namespace, it replaces with any existing listener rate limiters.<br />
That is: listener rate limiters are ignored when this configuration is enabled.<br />
If clients connect to a namespace before it is made explicitly managed, they will not pick up certain configurations made later to the namespace, such as rate limiters.<br />
These clients must be manually kicked out if one wants them to abide to the new rate limiters.`,
  },
}
