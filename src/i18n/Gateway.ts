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
  msgQueueLen: {
    zh: '最大消息队列长度',
    en: 'Max Message Queue Length',
  },
  maxRetryTimes: {
    zh: '最大重试次数',
    en: 'Max Retry Times',
  },
  retryInterval: {
    zh: '重试间隔',
    en: 'Retry Interval',
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
  jt808AuthDesc: {
    zh: 'JT/T 808 通过设备注册中心进行认证，请在**基础参数** -> **注册 URL** 中进行配置。',
    en: 'JT/T 808 certification is conducted through the Device Registration Center. Please configure it in the **Basic Configuration** -> **Registry URL**.',
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
    zh: '连接模式是非标准协议的特性。启用连接模式时，需要管理连接资源的创建、认证和保活。选择为 false 则进入无连接模式，在此模式下，添加的认证器不会生效。',
    en: `Connection mode is a feature of non-standard protocols. When connection mode is enabled, it's essential to manage the creation, authentication, and aliveness of connection resources. When set to false, it enters connectionless mode, and the added authenticator won't take effect.`,
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
  maxLenOfFrame: {
    zh: '最大帧长度',
    en: 'Max Length of Frame',
  },
  allowAnonymous: {
    zh: '允许匿名',
    en: 'Allow Anonymous',
  },
  registry: {
    zh: '注册 URL',
    en: 'Registry URL',
  },
  registryDesc: {
    zh: 'JT/T 808 设备注册中心。如果 `allow_anonymous=false`，则必填。当网关收到 JT/T 808 注册报文后，会将注册消息以 HTTP 请求的方式发往该地址。',
    en: 'The JT/T 808 device registry central. It is necessary if `allow_anonymous=false`. When the gateway receives a JT/T 808 registration message, it will send the registration message to this address as an HTTP request.',
  },
  registryRequired: {
    zh: '请输入注册 URL',
    en: 'Registry URL is required',
  },
  authenticationUrl: {
    zh: '鉴权 URL',
    en: 'Authentication URL',
  },
  authenticationUrlDesc: {
    zh: 'JT/T 808 设备鉴权中心。如果 `allow_anonymous=false`，则必填。当网关收到 JT/T 808 鉴权报文后，会将鉴权消息以 HTTP 请求的方式发往该地址。',
    en: 'The JT/T 808 device authentication center. It is necessary if `allow_anonymous=false`. When the gateway receives a JT/T 808 authentication message, it will send the authentication message to this address as an HTTP request.',
  },
  authenticationRequired: {
    zh: '请输入认证 URL',
    en: 'Authentication URL is required',
  },
  upTopic: {
    zh: '上行主题',
    en: 'Up Topic',
  },
  dnTopic: {
    zh: '下行主题',
    en: 'Down Topic',
  },
  defaultHeartbeatInterval: {
    zh: '默认心跳间隔',
    en: 'Default Heartbeat Interval',
  },
  heartbeatCheckingTimesBackoff: {
    zh: '心跳定时器检查退避',
    en: 'Heartbeat Timer Check Backoff',
  },
  heartbeatCheckingTimesBackoffDesc: {
    zh: '设置心跳定时器用于检查客户端心跳时的，最大退避倍数；0 表示不退避；1 表示在原间隔上允许额外一个周期，即允许 1 个周期中无心跳产生。',
    en: 'Set the maximum backoff factor for the heartbeat timer to check the client heartbeat; 0 means no backoff; 1 means an additional cycle is allowed on the original interval, that is, no heartbeat is allowed to be generated in 1 cycle.',
  },
  upstream: {
    zh: '上行数据流',
    en: 'Upstream',
  },
  upstreamTopic: {
    zh: '主题',
    en: 'Topic',
  },
  topicOverrideMapping: {
    zh: '主题映射',
    en: 'Topic Override Mapping',
  },
  upstreamReplyTopic: {
    zh: '回复主题',
    en: 'Reply Topic',
  },
  upstreamErrorTopic: {
    zh: '错误主题',
    en: 'Error Topic',
  },
  dnstream: {
    zh: '下行数据流',
    en: 'Downstream',
  },
  dnstreamTopic: {
    zh: '主题',
    en: 'Topic',
  },
  dnstreamMaxMqueueLen: {
    zh: '最大消息队列长度',
    en: 'Max Message Queue Length',
  },
  messageFormatChecking: {
    zh: '消息格式检查',
    en: 'Message Format Checking',
  },
  jsonSchemaDir: {
    zh: 'JSON Schema 文件目录',
    en: 'JSON Schema Directory',
  },
  jsonSchemaIdPrefix: {
    zh: 'JSON Schema ID 前缀',
    en: 'JSON Schema ID Prefix',
  },
}
