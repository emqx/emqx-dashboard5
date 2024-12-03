export default {
  name: {
    zh: '名称',
    en: 'Name',
  },
  status: {
    zh: '状态',
    en: 'Status',
  },
  connection: {
    zh: '连接',
    en: 'Connections',
  },
  listeners: {
    zh: '监听器',
    en: 'Listeners',
  },
  running: {
    zh: 'Enabled',
    en: 'Enabled',
  },
  stopped: {
    zh: 'Disabled',
    en: 'Disabled',
  },
  auth: {
    en: 'Authentication',
    zh: '接入认证',
  },
  clients: {
    zh: '客户端',
    en: 'Clients',
  },
  more: {
    zh: '更多',
    en: 'More',
  },
  enable: {
    zh: '启用',
    en: 'Enable',
  },
  disable: {
    zh: '停用',
    en: 'Disable',
  },
  addListener: {
    zh: '添加监听器',
    en: 'Add Listener',
  },
  editListener: {
    zh: '编辑监听器',
    en: 'Edit Listener',
  },
  disableListenerTip: {
    zh: '在禁用监听器后，监听器中的所有连接将被关闭，是否继续？',
    en: 'All connections in the listener will be closed after disabling the listener. Continue?',
  },
  addAuth: {
    en: 'Create Authentication',
    zh: '添加认证',
  },
  clientid: {
    zh: '客户端ID',
    en: 'Client ID',
  },
  username: {
    zh: '用户名',
    en: 'Username',
  },
  maxKeepalive: {
    zh: '最大心跳时间',
    en: 'Max Keepalive Time',
  },
  min: {
    en: 'Minute',
    zh: '分',
  },
  hour: {
    en: 'Hour',
    zh: '小时',
  },
  initial: {
    zh: '初始化',
    en: 'Initialize ',
  },
  basicConfig: {
    zh: '基础参数',
    en: 'Basic Configuration',
  },
  maxHeader: {
    zh: '最大 Header 数',
    en: 'Max Header',
  },
  maxHeaderLen: {
    zh: '单个 Header 最大长度',
    en: 'Max Each Header Length',
  },
  maxBodyLen: {
    zh: '最大 Body 长度',
    en: 'Max Body Length',
  },
  idleTime: {
    zh: '空闲超时时间',
    en: 'Idle Timeout',
  },
  useLog: {
    zh: '启用统计',
    en: 'Enable Statistics',
  },
  mountPoint: {
    zh: '挂载点',
    en: 'MountPoint',
  },
  mountPointDesc: {
    zh: `为客户端在 \`SUBSCRIBE\` 和 \`UNSUBSCRIBE\` 请求、\`PUBLISH\` 消息以及 Will Message（如果在 \`CONNECT\` 数据包中提供）中使用的主题添加静态或模板前缀（例如 \`n1/\` 或 \`{'$'}{'{'}username{'}'}/\`）。<br />
从发布到相应订阅的消息的主题中将移除此前缀。

支持的占位符包括：
- \`{'$'}{'{'}username{'}'}\`
- \`{'$'}{'{'}clientid{'}'}\`
- \`{'$'}{'{'}zone{'}'}\`
- \`{'$'}{'{'}client_attrs.NAME{'}'}\`

例如，使用 \`mountpoint="{'$'}{'{'}username{'}'}/"\` 时，客户端 \`u1\` 将出现以下情况：
- 客户端 SUBSCRIBE \`sensors/#\` -> 在代理中内部转换为 \`u1/sensors/#\`。
- 代理 PUBLISH \`u1/sensors/data\` -> 发送给客户端时变为 \`sensors/data\`。

前缀的挂载/卸载应用于：
- \`CONNECT\` 中的 Will
- \`PUBLISH\`
- \`SUBSCRIBE\`
- \`UNSUBSCRIBE\`

注意：挂载发生在**授权/ACL检查之后**。`,
    en: `Adds a static or templated prefix (e.g., \`n1/\` or \`{'$'}{'{'}username{'}'}/\`) to topics used by clients in \`SUBSCRIBE\` and \`UNSUBSCRIBE\` requests, \`PUBLISH\` messages, and Will Message (if supplied in the \`CONNECT\` packet).<br />
Removes this prefix from topics of messages published to the respective subscriptions.

The supported placeholders are:
- \`{'$'}{'{'}username{'}'}\`
- \`{'$'}{'{'}clientid{'}'}\`
- \`{'$'}{'{'}zone{'}'}\`
- \`{'$'}{'{'}client_attrs.NAME{'}'}\`

For example, with \`mountpoint="{'$'}{'{'}username{'}'}/"\`, a client \`u1\` will have:
- Client SUBSCRIBE \`sensors/#\` -> \`u1/sensors/#\` internally in the broker.
- Broker PUBLISH \`u1/sensors/data\` -> \`sensors/data\` sent to the client.

The prefix mount/unmount is applied to:
- Will in \`CONNECT\`
- \`PUBLISH\`
- \`SUBSCRIBE\`
- \`UNSUBSCRIBE\`

Note: mounting occurs **after authorization/ACL checks**.`,
  },
  lType: {
    zh: '类型',
    en: 'Type',
  },
  lAddress: {
    zh: '监听地址',
    en: 'Bind',
  },
  lMaxConn: {
    zh: '最大连接数',
    en: 'Max Connections',
  },
  clientAuth: {
    zh: '配置客户端接入认证',
    en: 'Client authentication',
  },
  clientAuthDesc: {
    zh: '您可以在启用网关之后，进入详情页面进行配置。配置并启用客户端认证后未通过认证的客户端无法连接到集群中。',
    en: 'You can configure authentication after enable the gateway.When client authentication is enabled, clients that fail to pass authentication cannot connect to the cluster.',
  },
  predefinedTopic: {
    zh: '预设 Topic 列表',
    en: 'Predefined Topic List',
  },
  broadcast: {
    zh: '开启广播',
    en: 'Enable Broadcast',
  },
  qos3: {
    zh: '启用 QoS3',
    en: 'Enable QoS3',
  },
  connectionRequire: {
    zh: '连接模式',
    en: 'Connection Required',
  },
  connectionRequireDesc: {
    zh: '连接模式是非标准的特性。启用连接模式时，客户端**必须**管理连接资源的创建、认证和保活。选择为 false 则表示客户端对管理连接资源是可选的，支持不创建连接资源，直接进行消息发布和订阅。',
    en: `Connection Required is a non-standard feature. When Connection Required is enabled, the client **must** manage the creation, authentication, and keep-alive of connection resources. Selecting false means that the client is optional for managing connection resources and supports not creating connection resources directly for message publishing and subscription.`,
  },
  heartbeat: {
    zh: '心跳间隔',
    en: 'Heartbeat',
  },
  notifyType: {
    zh: '通知类型',
    en: 'Notification Message Type',
  },
  subQos: {
    zh: '订阅 QoS',
    en: 'Subscribe QoS',
  },
  pubQos: {
    zh: '发布 QoS',
    en: 'Publish QoS',
  },
  resDirectory: {
    en: 'Resource Definition Files Directory',
    zh: '资源定义文件目录',
  },
  qmodewindow: {
    zh: 'QMode Time Window',
    en: 'QMode Time Window',
  },
  minLifetime: {
    en: 'Minimum Lifetime',
    zh: '最小心跳时间',
  },
  maxLifetime: {
    en: 'Maximum Lifetime',
    zh: '最大心跳时间',
  },
  aObserve: {
    zh: 'Auto Observe',
    en: 'Auto Observe',
  },
  updateStrategy: {
    zh: 'Update Message Strategy',
    en: 'Update Message Strategy',
  },
  trCommand: {
    zh: '下行命令',
    en: 'Command',
  },
  trResponse: {
    zh: '应答消息',
    en: 'Response',
  },
  trNotify: {
    zh: '通知消息',
    en: 'Notify',
  },
  trRegister: {
    zh: '注册事件',
    en: 'Register',
  },
  trUpdate: {
    zh: '更新事件',
    en: 'Update',
  },
  maxConnRate: {
    zh: '最大连接速率（监听器）',
    en: 'Max Connection Rate (Listener)',
  },
  maxMsgPubRate: {
    zh: '最大消息发布速率（单客户端）',
    en: 'Max Message Publishing Rate (Per Client)',
  },
  maxMsgPubTraffic: {
    zh: '最大消息发布流量（单客户端）',
    en: 'Max Message Publishing Traffic (Per Client)',
  },
  maxConn: {
    zh: '最大连接数',
    en: 'Max Connections',
  },
  sendTimeout: {
    zh: '发送超时时间',
    en: 'Send Timeout',
  },
  sendTimeoutClose: {
    zh: '关闭发送超时连接',
    en: 'Send Timeout Close',
  },
  sslversion: {
    zh: 'SSL 版本',
    en: 'SSL Versions',
  },
  ciphers: {
    zh: '加密套件',
    en: 'Cipher Suites',
  },
  ciphersDesc: {
    zh: '此配置包含TLS密码套件列表，用逗号分隔。例如：<code>TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256</code>。密码套件的选择影响数据加密的安全性和性能。使用OpenSSL格式的名称。注意：部分密码套件只与特定TLS版本（`tlsv1.1`, `tlsv1.2`, `tlsv1.3`）兼容。不兼容的套件将被忽略。例如，如果<code>versions</code>只配置为<code>tlsv1.3</code>，其他版本的密码套件设置将无效。PSK密码套件不支持tlsv1.3；如果使用PSK，应禁用<code>tlsv1.3</code>。PSK套件示例： <code>RSA-PSK-AES256-GCM-SHA384,...</code>',
    en: 'This configuration contains a list of TLS cipher suites, separated by commas. Example: <code>TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256</code>. The choice of cipher suites affects data encryption security and performance. Use OpenSSL format for names. Note: Some suites are only compatible with specific TLS versions (`tlsv1.1`, `tlsv1.2`, `tlsv1.3`), and incompatible ones will be ignored. For instance, setting cipher suites for other versions has no effect if <code>versions</code> is configured only for <code>tlsv1.3</code>. PSK cipher suites do not support tlsv1.3; disable <code>tlsv1.3</code> if using PSK. PSK suite examples: <code>RSA-PSK-AES256-GCM-SHA384,...</code>',
  },
  dtlsversion: {
    zh: 'DTLS 版本',
    en: 'DTLS Versions',
  },
  sendBuf: {
    zh: '发送缓冲区大小',
    en: 'Send Buffer',
  },
  recBuf: {
    zh: '接收缓冲区大小',
    en: 'Receive Buffer',
  },
  endpointName: {
    zh: 'EndPoint Name',
    en: 'EndPoint Name',
  },
  ipaddress: {
    zh: 'IP 地址',
    en: 'IP Address',
  },
  connectedAt: {
    //no doubt
    zh: '注册时间',
    en: 'Registered At',
  },
  lifetime: {
    zh: 'LifeTime',
    en: 'LifeTime',
  },
  alreadyLoad: {
    zh: '此网关已经初始化',
    en: 'This gateway is already loaded',
  },
  grpcListener: {
    zh: 'gRPC 监听',
    en: 'gRPC ConnectionAdapter',
  },
  grpcConnection: {
    zh: 'gRPC 连接',
    en: 'gRPC ConnectionHandler',
  },
  noAuthTips: {
    zh: '如需对接入的客户端进行身份认证，请先添加认证，配置并启用客户端认证后未通过认证的客户端将无法连接到集群中。',
    en: 'To authenticate the client, please add authentication first. After configuring and enabling client authentication, clients that fail to pass authentication will not be able to connect to the cluster.',
  },
  missinggRPCTLSFile: {
    zh: '缺少 gRPC 监听的 Cert 或 Key 内容',
    en: 'Missing Cert or Key content for gRPC ConnectionAdapter',
  },
  setup: {
    zh: '配置',
    en: 'Setup',
  },
  updateGatewayListenerTip: {
    zh: '更新监听器会导致已有连接断开，继续？',
    en: 'Updating the listener will cause existing connections to be disconnected. Continue?',
  },
  settings: {
    zh: '设置',
    en: 'Settings',
  },
  disableGatewayTip: {
    zh: '禁用网关将导致通过此网关接入的连接全部断开，继续？',
    en: 'Disabling the gateway will cause all connections accessed through this gateway to be disconnected. Continue?',
  },
  failIfNoPeerCert: {
    zh: '强制验证对端证书',
    en: 'Force Verify Peer Certificate',
  },
  SSLdepth: {
    zh: 'CA 证书深度',
    en: 'CACert Depth',
  },
  SSLPassword: {
    zh: '密钥文件密码',
    en: 'Key File Passphrase',
  },
  enableOcspStapling: {
    zh: '启用 OCSP Stapling',
    en: 'Enable OCSP Stapling',
  },
  responderUrl: {
    zh: 'OCSP 服务器地址',
    en: 'OCSP Responder URL',
  },
  issuerPem: {
    zh: 'OCSP 签发者证书',
    en: 'OCSP Issuer Certificate',
  },
  refreshInterval: {
    zh: 'OCSP 刷新间隔',
    en: 'OCSP Refresh Interval',
  },
  refreshHttpTimeout: {
    zh: 'OCSP 刷新 HTTP 超时时间',
    en: 'OCSP Refresh HTTP Timeout',
  },
  enableCrlCheck: {
    en: 'Enable CRL Check',
    zh: '启用 CRL 检查',
  },
  showLimiter: {
    zh: '速率限制',
    en: 'Limiter',
  },
  showLimiterDesc: {
    zh: '速率限制为可选配置。默认空白值表示未开启限制。设置具体数值来启用限制，如需关闭已开启的限制，请将其值设为 `infinity`。',
    en: 'Rate limiting is optional. Default empty values indicate that limits are not enabled. Set specific numeric values to enable limits, or set to `infinity` to disable enabled limits.',
  },
  customConfig: {
    zh: '自定义配置',
    en: 'Custom Configuration',
  },
  customConfigDescription: {
    zh: '使用 Hocon 配置更多监听器参数。',
    en: 'Use hocon to configure more listener parameters.',
  },
  healthCheck: {
    zh: '健康检查',
    en: 'Health Check',
  },
  healthCheckDesc: {
    zh: '健康检查请求内容',
    en: 'Health Check Request Content',
  },
  healthCheckResponse: {
    zh: '健康检查响应',
    en: 'Health Check Response',
  },
  healthCheckResponseDesc: {
    zh: '健康检查响应内容',
    en: 'Health Check Response Content',
  },
  tcpKeepaliveDesc: {
    zh: "接受三个参数，格式为 'Idle,Interval,Probes'：<br />- Idle：空闲时长阈值（秒），超过该时长后开始发送 keepalive 探测包（Linux 默认值：7200）<br />- Interval：连续探测包之间的时间间隔（秒）（Linux 默认值：75）<br />- Probes：允许的最大连续未响应探测次数，超过此值将终止连接（Linux 默认值：9）<br />示例 `240,30,5` 表示连接空闲 240 秒后启动 keepalive 探测，每 30 秒发送一次探测包，连续 5 次探测未收到响应则终止连接<br />默认值：`none`（禁用 keepalive）<br />",
    en: "Accepts three parameters in the format 'Idle,Interval,Probes':<br />- Idle: The number of seconds a connection needs to be idle before the server begins to send out keep-alive probes (Linux default 7200).<br />- Interval: The number of seconds between TCP keep-alive probes (Linux default 75).<br />- Probes: The maximum number of TCP keep-alive probes to send before giving up and killing the connection if no response is obtained from the other end (Linux default 9).<br />For example `240,30,5` means: EMQX should start sending TCP keepalive probes after the connection is in idle for 240 seconds, and the probes are sent every 30 seconds until a response is received from the MQTT client, if it misses 5 consecutive responses, EMQX should close the connection.<br />Default: `none` (keepalive disabled)<br />",
  },
  nolinger: {
    zh: '连接关闭模式（nolinger）',
    en: 'nolinger',
  },
  nolingerDesc: {
    zh: '启用后，将设置 `SO_LINGER` 标志为 `(onoff=1, linger=0)`，TCP 连接通过发送 TCP-RST 包立即关闭，丢弃所有未发送的数据，跳过 TCP 正常关闭的状态流转（CLOSE_WAIT、FIN_WAIT、TIME_WAIT）',
    en: 'When enabled, `SO_LINGER` flag is set as `(onoff=1, linger=0)`, which means the TCP socket is to be closed immediately by sending a TCP-RST packet, discarding any unsent data and skipping the graceful close steps, including CLOSE_WAIT, FIN_WAIT, and TIME_WAIT.',
  },
}
