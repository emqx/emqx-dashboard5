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
  basic: {
    zh: '基本信息',
    en: 'Basic Info',
  },
  auth: {
    en: 'Authentication',
    zh: '接入认证',
  },
  clients: {
    zh: '客户端',
    en: 'Clients',
  },
  setting: {
    zh: '设置',
    en: 'Setting',
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
    en: 'Add Listeners',
  },
  editListener: {
    zh: '编辑监听器',
    en: 'Edit Listener',
  },
  addAuth: {
    en: 'Create Auth',
    zh: '添加认证',
  },
  clientid: {
    zh: 'Client ID',
    en: 'Client ID',
  },
  username: {
    zh: 'Username',
    en: 'Username',
  },
  mountSetting: {
    zh: '挂载设置',
    en: 'Mount Settings',
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
    en: 'Basic Configration',
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
    zh: 'MountPoint',
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
  listenerSetting: {
    zh: '监听设置',
    en: 'Listener Settings',
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
  heartbeat: {
    zh: '心跳间隔',
    en: 'Heartbeat',
  },
  notifyType: {
    zh: 'Notification Message Type',
    en: 'Notification Message Type',
  },
  subQos: {
    zh: 'Subscribe QoS',
    en: 'Subscribe QoS',
  },
  pubQos: {
    zh: 'Publish QoS',
    en: 'Publish QoS',
  },
  resDirectory: {
    en: 'Resource Defination Files Directory',
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
    zh: '最大连接速率',
    en: 'Max Connection Rate',
  },
  maxConn: {
    zh: '最大连接数',
    en: 'Max Connections',
  },
  configSetting: {
    zh: '参数配置',
    en: 'Settings',
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
  dtlsversion: {
    zh: 'DTLS 版本',
    en: 'DTLS Versions',
  },
  sendBuf: {
    zh: '发送缓冲区大小',
    en: 'Send Buffer',
  },
  recBuf: {
    zh: '接受缓冲区大小',
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
  tlsConfig: {
    zh: 'TLS 配置',
    en: 'TLS Config',
  },
  enableTls: {
    zh: '启用 TLS',
    en: 'Enable TLS',
  },
  noAuthTips: {
    zh: '如需对接入的客户端进行身份认证，请先添加认证，配置并启用客户端认证后未通过认证的客户端将无法连接到集群中。',
    en: 'To authenticate the client, please add authentication first. After configuring and enabling client authentication, clients that fail to pass authentication will not be able to connect to the cluster.',
  },
  missinggRPCTLSFile: {
    zh: '缺少 gRPC 监听的 Cert 或 Key 内容',
    en: 'Missing Cert or Key content for gRPC ConnectionAdapter',
  },
}
