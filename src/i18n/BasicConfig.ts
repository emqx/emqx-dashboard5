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
  session: {
    zh: '会话',
    en: 'Session',
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
  tcpOptsNodelay: {
    zh: '是否关闭延迟发送',
    en: 'No Delay',
  },
  tcpOptsActiveN: {
    zh: 'Active N',
    en: 'Active N',
  },
  tcpOptsKeepalive: {
    zh: 'TCP Keepalive',
    en: 'TCP Keepalive',
  },
  tcpOptsDelaySend: {
    zh: '延迟发送',
    en: 'Delay Send',
  },
  tcpOptsSndbuf: {
    zh: 'TCP 发送缓冲区',
    en: 'TCP Send Buffer',
  },
  tcpOptsRecbuf: {
    zh: 'TCP 接收缓冲区',
    en: 'TCP Receive Buffer',
  },
  tcpOptsBuffer: {
    zh: 'TCP 连接缓冲区大小',
    en: 'TCP Connection Buffer Size',
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
    zh: '这将永久删除 {target} 命名空间及其下的所有资源（认证、授权、规则等），并断开该命名空间下的客户端连接',
    en: 'This will permanently delete the {target} namespace and all resources under it (authentication, authorization, rules, etc.), and disconnect all client connections under this namespace.',
  },
  deleteMultipleNamespaceConfirmSecond: {
    zh: '这将永久删除所选择的 {n} 个命名空间及其下的所有资源（认证、授权、规则等），并断开其下的客户端连接',
    en: 'This will permanently delete the selected {n} namespaces and all resources under them (authentication, authorization, rules, etc.), and disconnect all client connections under them.',
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
    zh: '仅查看显式创建的命名空间',
    en: 'View Explicitly Created Namespace Only',
  },
  kickOutAllClients: {
    zh: '踢除该命名空间下所有客户端',
    en: 'Kick Out All Clients in This Namespace',
  },
  batchKickOut: {
    zh: '批量踢除',
    en: 'Batch Kick Out',
  },
  batchDelete: {
    zh: '批量删除',
    en: 'Batch Delete',
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
  defaultMaxSessions: {
    zh: '默认最大会话数',
    en: 'Default Max Number of Sessions',
  },
  defaultMaxSessionsDesc: {
    zh: '每个命名空间允许的默认活动会话数。如果达到限制，新客户端的访问将被拒绝。在线配置更改不会影响正在运行的会话。',
    en: 'The default number of live sessions allowed for each namespace. Access will be denied for new clients if limit is reached. Online config changes do not affect running sessions.',
  },
  allowOnlyManagedNamespaces: {
    zh: '仅允许显式创建的命名空间',
    en: 'Allow Only Explicitly Created Namespaces',
  },
  allowOnlyManagedNamespacesDesc: {
    zh: '如果启用，属于非显式创建的命名空间的客户端将被拒绝连接。无法解析其命名空间的客户端也将被拒绝连接。',
    en: "If enabled, clients that belong to a non-explicitly created namespace will be denied connection. Clients that can't have their namespace resolved will also be denied connection.",
  },
  deniedNamespaceNames: {
    zh: '禁止使用的命名空间名称',
    en: 'Denied Namespace Names',
  },
  deniedNamespaceNamesDesc: {
    zh: `不能用作命名空间标识符的名称。该限制适用于 Dashboard 用户角色、API 密钥、多租户管理 API 和客户端 \`client_attrs.tns\`。<br />
默认值为 \`global\`、\`undefined\`、\`null\` 和 \`none\`。清空列表可禁用此限制。`,
    en: `Namespace names that cannot be used by Dashboard user roles, API keys, the multi-tenancy management API, or client \`client_attrs.tns\`.<br />
The defaults are \`global\`, \`undefined\`, \`null\`, and \`none\`. Clear the list to disable this restriction.`,
  },
  enableMessageQueue: {
    zh: '启用队列',
    en: 'Enable Queues',
  },
  enableMessageQueueDesc: {
    zh: '存在队列时无法禁用此功能，请先删除所有队列。',
    en: 'This feature cannot be disabled while queues exist. Delete all queues first.',
  },
  maxQueueCount: {
    zh: '最大队列数',
    en: 'Max Queue Count',
  },
  gcInterval: {
    zh: '垃圾回收间隔',
    en: 'GC Interval',
  },
  regularQueueRetentionPeriod: {
    zh: '常规队列保留周期',
    en: 'Regular Queue Retention Period',
  },
  enableAutoCreateMQ: {
    zh: '启用自动创建队列',
    en: 'Enable Auto Create Queue',
  },
  lastValueQueue: {
    zh: '最后值语义队列',
    en: 'Last Value Semantics Queue',
  },
  regularQueue: {
    zh: '常规队列',
    en: 'Regular Queue',
  },
  autoCreateMQType: {
    zh: '自动创建队列类型',
    en: 'Auto Create Queue Type',
  },
  shared_subs: {
    zh: '共享订阅',
    en: 'Shared Subscriptions',
  },
  findQueueRetryInterval: {
    zh: '查找队列重试间隔',
    en: 'Find Queue Retry Interval',
  },
  findQueueRetryIntervalDesc: {
    zh: '当订阅队列主题时，如果未找到队列，订阅者重新查找队列的重试间隔时间',
    en: 'The interval at which subscribers will retry to find a queue if the queue is not found when subscribing to a queue topic',
  },
  enableMessageStream: {
    zh: '启用流',
    en: 'Enable Streams',
  },
  enableMessageStreamDesc: {
    zh: '存在流时无法禁用此功能，请先删除所有流。',
    en: 'This feature cannot be disabled while streams exist. Delete all streams first.',
  },
  maxStreamCount: {
    zh: '最大流数',
    en: 'Max Stream Count',
  },
  regularStreamRetentionPeriod: {
    zh: '常规流保留周期',
    en: 'Regular Stream Retention Period',
  },
  enableAutoCreateMS: {
    zh: '启用自动创建流',
    en: 'Enable Auto Create Streams',
  },
  autoCreateMSType: {
    zh: '自动创建流类型',
    en: 'Auto Create Stream Type',
  },
  lastValueStream: {
    zh: '最后值流',
    en: 'Last Value Stream',
  },
  regularStream: {
    zh: '常规流',
    en: 'Regular Stream',
  },
  queueMaxShardMessageBytes: {
    zh: '每个分片的最大字节数',
    en: 'Max Shard Message Bytes',
  },
  queueMaxShardMessageBytesDesc: {
    zh: `队列中每个分片的最大字节数。分片数量在持久存储设置中为所有队列配置。注意，此限制不考虑 replication_factor。因此，队列实际占用的物理存储空间为 \`n_shards * replication_factor * max_shard_message_bytes\`。`,
    en: `The maximum number of bytes in a shard for the Queue. The number of shards is configured for all Queue in the Durable Storage settings. Note that this limit is not aware of the replication factor.
So the total physical storage space for the Queue is \`n_shards * replication_factor * max_shard_message_bytes\`.`,
  },
  queueMaxShardMessageCount: {
    zh: '每个分片的最大消息数量',
    en: 'Max Shard Message Count',
  },
  queueMaxShardMessageCountDesc: {
    zh: `队列中每个分片的最大消息数量。分片数量在持久化存储设置中为所有队列配置。队列的总消息数量限制为 \`n_shards * max_shard_message_count\`。`,
    en: `The maximum number of messages in a shard for the Queue. The number of shards is configured for all Queue in the Durable Storage settings.
The total count limit for the Queue is \`n_shards * max_shard_message_count\`.`,
  },
  namespaceExpression: {
    zh: '命名空间表达式',
    en: 'Namespace Expression',
  },
  defaultTCPListenerMountpoint: {
    zh: '默认 TCP 监听器挂载点',
    en: 'Default TCP Listener Mountpoint',
  },
  namespaceRelatedConfig: {
    zh: '命名空间相关配置',
    en: 'Namespace Related Configurations',
  },
  takeNamespaceFrom: {
    zh: '命名空间来源',
    en: 'Take Namespace From',
  },
  namespaceResolutionTiming: {
    zh: '命名空间解析时机',
    en: 'When to Resolve Namespace',
  },
  namespaceResolutionTimingDesc: {
    zh: '选择在认证前还是认证后解析命名空间。',
    en: 'Choose whether to resolve the namespace before or after authentication.',
  },
  beforeAuthentication: {
    zh: '认证前',
    en: 'Before Authentication',
  },
  afterAuthentication: {
    zh: '认证后',
    en: 'After Authentication',
  },
  takeNamespaceFromBeforeAuthDesc: {
    zh: `使用 Variform 表达式在认证前提取 MQTT 客户端的命名空间。<br />
示例：\`username\` 使用用户名作为命名空间，或 \`nth(1, tokens(username, '.'))\` 使用用户名中 \`.\` 之前的部分作为命名空间。<br />
更多表达式语法请参考 EMQX 文档。`,
    en: `Extract the MQTT client namespace before authentication using a Variform expression.<br />
Example: \`username\` to use username as namespace, or \`nth(1, tokens(username, '.'))\` to use the prefix before \`.\` in username as namespace.<br />
See EMQX documentation for expression syntax.`,
  },
  postAuthTnsExpression: {
    zh: '认证后命名空间来源',
    en: 'Post-authentication Namespace Source',
  },
  postAuthTnsExpressionDesc: {
    zh: `在认证链完成后计算该表达式，并将结果作为命名空间来源。<br />
当前可使用的变量有 \`username\`、\`clientid\` 以及 \`client_attrs.*\`。其中 \`client_attrs.*\` 包含认证前初始化的属性，以及认证结果返回后合并进来的属性。<br />
示例：\`client_attrs.tag\`；带回退的示例：\`coalesce(client_attrs.tag, username)\`。`,
    en: `Evaluate this expression after the authentication chain completes and use the rendered value as the namespace source.<br />
The variables currently available are \`username\`, \`clientid\`, and \`client_attrs.*\`. The \`client_attrs.*\` values include both pre-auth initialized attributes and attributes merged in from the authentication result.<br />
Example: \`client_attrs.tag\`; with fallback: \`coalesce(client_attrs.tag, username)\`.`,
  },
  clientIdIsolation: {
    zh: '客户端 ID 隔离',
    en: 'Client ID Isolation',
  },
  clientIdIsolationDesc: {
    zh: `使用 Variform 表达式覆盖客户端 ID。<br />
示例：\`concat([client_attrs.tns, '-', clientid])\` 添加命名空间作为前缀。<br />
这允许不同命名空间中的客户端使用相同的客户端 ID 连接而不会引起冲突。<br />
更多表达式语法请参考 EMQX 文档。`,
    en: `Override the Client ID using a Variform expression.<br />
Example: \`concat([client_attrs.tns, '-', clientid])\` adds the namespace as a prefix.<br />
This allows clients in different namespaces to connect using the same Client ID without conflict.<br />
See EMQX documentation for expression syntax.`,
  },
  certBundleInUseTitle: {
    zh: '证书包正在使用中',
    en: 'Bundle In Use',
  },
  certBundleInUseDesc: {
    zh: '以下配置正在使用该证书包，请先移除引用后再删除',
    en: 'The following configurations are currently using this bundle. Remove the references before deleting it.',
  },
  certBundleFileInUseDesc: {
    zh: '以下配置正在使用该证书包，请先移除引用后再删除证书文件',
    en: 'The following configurations are currently using this bundle. Remove the references before deleting the certificate file.',
  },
  viewPage: {
    zh: '前往页面',
    en: 'Go to Page',
  },
  refModuleGateway: {
    zh: 'Gateway',
    en: 'Gateway',
  },
  refModuleExhook: {
    zh: 'ExHook',
    en: 'ExHook',
  },
  refModuleConnector: {
    zh: '连接器',
    en: 'Connector',
  },
  refModuleClusterLinking: {
    zh: '集群连接',
    en: 'Cluster Linking',
  },
  refModuleSchemaRegistry: {
    zh: 'Schema 注册中心',
    en: 'Schema Registry',
  },
  refModuleListener: {
    zh: '监听器',
    en: 'Listener',
  },
  refModuleSSO: {
    zh: 'SSO',
    en: 'SSO',
  },
  refModuleAuthorization: {
    zh: '授权',
    en: 'Authorization',
  },
  refModuleAuthentication: {
    zh: '认证',
    en: 'Authentication',
  },
  refModuleFileTransfer: {
    zh: '文件传输',
    en: 'File Transfer',
  },
  refItemCount: {
    zh: '{count} 个',
    en: '{count}',
  },
  ruleEngineSecurity: {
    zh: '规则引擎安全',
    en: 'Rule Engine Security',
  },
  ssrfPolicy: {
    zh: 'SSRF 策略',
    en: 'SSRF Policy',
  },
  ruleEngineSsrfPolicyTip: {
    zh: `EMQX 命名空间管理员通常被视为可信方，但你仍然可以启用下面的 SSRF 策略，在配置更新时校验规则引擎的出站目标。<br />
这能降低 SSRF 风险，但不能防止校验通过后的恶意 DNS 变更；仍需结合防火墙、\`iptables\`、\`nftables\` 等出口控制，并参考 EMQX 文档了解更多细节。<br />
该策略适用于出站连接器。评估顺序为：先精确匹配拒绝的主机名，再检查允许的 CIDR 范围，最后检查拒绝的 CIDR 范围。`,
    en: `EMQX namespace administrators are intended to be trusted parties. Nonetheless, you can enable the SSRF policy below to validate outbound rule-engine targets at configuration-update time.<br />
This reduces SSRF risk, but does not protect against malicious DNS changes after validation. Use firewall, \`iptables\`, or \`nftables\` egress controls and refer to the EMQX documentation for more details.<br />
This policy applies to outbound connectors. Evaluation order is: exact Denied Hostnames first, then Allowed CIDR Ranges, then Denied CIDR Ranges.`,
  },
  enableSsrfProtection: {
    zh: '启用 SSRF 保护',
    en: 'Enable SSRF Protection',
  },
  enableSsrfProtectionDesc: {
    zh: `启用后，将 \`rule_engine.ssrf\` 下的策略应用到出站连接器目标。<br />
仅在配置更新时检查，运行时 DNS 重新解析不会被阻止。<br />
请使用网络层出口控制来应对校验后的 DNS 变化。`,
    en: `When enabled, apply the policy under \`rule_engine.ssrf\` to outbound connector targets.<br />
Checks run only at config-update time, and runtime DNS re-resolution is not blocked.<br />
Use network-layer egress controls to enforce protection against post-validation DNS changes.`,
  },
  allowedCIDRRanges: {
    zh: '允许的 CIDR 范围',
    en: 'Allowed CIDR Ranges',
  },
  allowedCIDRRangesDesc: {
    zh: `在拒绝的 CIDR 范围之前优先放行的 CIDR 范围列表。<br />
可用于给受信任的内网目标开白名单，而无需全局关闭 SSRF 保护。<br />
默认值为空。`,
    en: `List of CIDR ranges explicitly allowed before Denied CIDR Ranges are checked.<br />
Use this to carve out approved internal targets without disabling SSRF protection globally.<br />
The default is empty.`,
  },
  deniedCIDRRanges: {
    zh: '拒绝的 CIDR 范围',
    en: 'Denied CIDR Ranges',
  },
  deniedCIDRRangesDesc: {
    zh: `被视为私网或其他不安全出站目标的 CIDR 范围列表。<br />
默认值覆盖 loopback、link-local（含云 IMDS）、RFC1918、ULA、未指定地址、多播地址，以及已知云 metadata IP。<br />
如需显式放行例外地址，请使用允许的 CIDR 范围。`,
    en: `List of CIDR ranges considered private or otherwise unsafe as outbound targets.<br />
The defaults cover loopback, link-local (including cloud IMDS), RFC1918, ULA, unspecified, multicast ranges, and known cloud metadata IPs.<br />
Use Allowed CIDR Ranges for explicit exceptions when needed.`,
  },
  deniedHostnames: {
    zh: '拒绝的主机名',
    en: 'Denied Hostnames',
  },
  deniedHostnamesDesc: {
    zh: `按精确匹配（不区分大小写）拒绝的主机名列表。<br />
默认值覆盖几个云 metadata 主机名：metadata.tencentyun.com、metadata.google.internal、metadata.azure.internal。`,
    en: `List of hostnames denied by exact match, case-insensitively.<br />
The defaults cover cloud metadata hostnames: metadata.tencentyun.com, metadata.google.internal, and metadata.azure.internal.`,
  },
}
