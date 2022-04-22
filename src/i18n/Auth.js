export default {
  mechanism: {
    zh: '认证方式',
    en: 'Mechanism',
  },
  dataSource: {
    zh: '数据源',
    en: 'Backend',
  },
  status: {
    zh: '状态',
    en: 'Status',
  },
  backAuthnList: {
    zh: '返回认证列表',
    en: 'Back to Authentication List',
  },
  backAuthzList: {
    zh: '返回权限控制列表',
    en: 'Back to Authorization List',
  },
  createAuth: {
    zh: '创建认证',
    en: 'Create Authentication',
  },
  createAuthz: {
    zh: '创建权限控制',
    en: 'Create Authorization',
  },
  config: {
    zh: '配置参数',
    en: 'Configuration',
  },
  selectMechanism: {
    zh: '选择认证方式',
    en: 'Select Mechanism',
  },
  scram: {
    zh: '增强认证',
    en: 'Scram',
  },
  passwordBasedDesc: {
    zh: '使用客户端用户名、Client ID 与密码进行认证',
    en: 'Authenticate using client username, client id, and password',
  },
  jwtDesc: {
    zh: '客户端携带 JWT 进行认证',
    en: 'Authentication using client JWT',
  },
  scramDesc: {
    zh: 'MQTT 5.0 增强认证',
    en: 'MQTT 5 Enhanced Authentication',
  },
  selectDataSource: {
    zh: '选择数据源',
    en: 'Select Backend',
  },
  dataSourceDesc: {
    zh: '选择存储认证数据的数据库或提供认证数据功能的 HTTP 服务器',
    en: 'Select the database where the authentication data is stored or the HTTP server that provides the authentication data function',
  },
  database: {
    zh: '数据库',
    en: 'Database',
  },
  jwtDataSourceDesc: {
    zh: 'JWT 认证无需选择数据源，请继续下一步配置',
    en: 'JWT authentication does not need to select a backend, please continue to the next step of the configuration',
  },
  connect: {
    zh: '连接',
    en: 'Connect',
  },
  TLSCerts: {
    zh: 'TLS 证书信息',
    en: 'TLS Certification',
  },
  connectConfig: {
    zh: '连接配置',
    en: 'Connection Configuration',
  },
  reconnect: {
    zh: '自动重连',
    en: 'Reconnect',
  },
  authnConfig: {
    zh: '认证配置',
    en: 'Authentication configuration',
  },
  authzConfig: {
    zh: '权限配置',
    en: 'Authorization configuration',
  },
  userConfig: {
    zh: '用户管理',
    en: 'User Management',
  },
  testSuccess: {
    zh: '测试通过，您的配置可以正常使用',
    en: 'Test success, your configuration works fine',
  },
  testFaild: {
    zh: '测试失败',
    en: 'Test failed',
  },
  sqlHelpContent: {
    zh: '使用默认的 ACL SQL 请在数据库中创建如下表结构：',
    en: ' To use the default SQL. Please create this table in the database:',
  },
  setting: {
    zh: '设置',
    en: 'Setting',
  },
  moveUp: {
    zh: '上移',
    en: 'Move up',
  },
  moveDown: {
    zh: '下移',
    en: 'Move down',
  },
  authzSetting: {
    zh: '权限控制设置',
    en: 'Authorization Setting',
  },
  enableCache: {
    zh: '启用缓存',
    en: 'Enable Cache',
  },
  clearCache: {
    zh: '清除缓存',
    en: 'Clear cache',
  },
  clearCacheDesc: {
    zh: '清除当前所有授权结果缓存。',
    en: 'Clears all current authorization result caches.',
  },
  clearCacheConfirm: {
    zh: '是否确认清除缓存',
    en: 'Confirm clear cache?',
  },
  clearedSuccessfully: {
    zh: '清除成功',
    en: 'Cleared successfully',
  },
  maxSize: {
    zh: '单客户端缓存条数',
    en: 'Max number of cache per client',
  },
  ttl: {
    zh: '缓存 TTL',
    en: 'TTL',
  },
  basicSettings: {
    zh: '基础设置',
    en: 'Basic Settings',
  },
  authzCache: {
    zh: 'Authorization 缓存',
    en: 'Authorization Cache',
  },
  setDefault: {
    zh: '设置默认',
    en: 'Set default',
  },
  passwordHash: {
    zh: '密码加密方式',
    en: 'Password Hash',
  },
  saltPosition: {
    zh: '加盐方式',
    en: 'Salt Position',
  },
  queryTimeout: {
    zh: '查询超时',
    en: 'Query Timeout',
  },
  userIdType: {
    zh: '账号类型',
    en: 'UserID Type',
  },
  server: {
    zh: '服务',
    en: 'Server',
  },
  servers: {
    zh: '服务列表',
    en: 'Servers',
  },
  enableTLS: {
    zh: '启用 TLS',
    en: 'Enable TLS',
  },
  tlsVerify: {
    zh: '验证服务器证书',
    en: 'TLS Verify',
  },
  mongoType: {
    zh: '部署模式',
    en: 'MongoDB Mode',
  },
  redisType: {
    zh: '部署模式',
    en: 'Redis Mode',
  },
  single: {
    zh: '单节点',
    en: 'Single',
  },
  connectTimeout: {
    zh: '连接超时',
    en: 'Connect Timeout',
  },
  requestTimeout: {
    zh: '请求超时',
    en: 'Request Timeout',
  },
  selector: {
    zh: '查询 Selector',
    en: 'Selector',
  },
  exampleDataStructures: {
    zh: '示例数据结构和查询',
    en: 'Example data structures and selector',
  },
  exampleDataCmd: {
    zh: '示例数据结构和命令',
    en: 'Example data structures and command',
  },
  cmd: {
    zh: '命令',
    en: 'CMD',
  },
  passwordHashField: {
    zh: 'Password Hash 字段名',
    en: 'Password Hash Field',
  },
  saltField: {
    zh: 'Salt 字段名',
    en: 'Salt Field',
  },
  superuserField: {
    zh: 'is_superuser 字段名',
    en: 'is_superuser Field',
  },
  sentinel: {
    zh: 'Sentinel 名字',
    en: 'Sentinel Name',
  },
  method: {
    zh: '请求方式',
    en: 'Method',
  },
  enablePipelining: {
    zh: '启用 Pipelining',
    en: 'Enable Pipelining',
  },
  isSuperuser: {
    zh: '是否为超级用户',
    en: 'is superuser',
  },
  validMethod: {
    zh: '验证方式',
    en: 'JWT or JWKS',
  },
  algorithm: {
    zh: '加密方式',
    en: 'Algorithm',
  },
  refreshInterval: {
    zh: 'JWKS 刷新间隔',
    en: 'JWKS Refresh Interval',
  },
  builtInDatabaseDesc: {
    zh: 'Built-in database 权限控制无需配置参数，请点击创建按钮完成操作',
    en: 'Built-in database authorization does not require configuration parameters, please click the Create button to complete the operation',
  },
  permissionCount: {
    zh: '权限条数',
    en: 'Number of permissions',
  },
  pleaseEnterClientID: {
    zh: '请输入 Client ID',
    en: 'Client ID is required',
  },
  pleaseEnterUsername: {
    zh: '请输入 Username',
    en: 'Username is required',
  },
  pleaseSelectPermission: {
    zh: '请选择 permission',
    en: 'Please select permission',
  },
  pleaseSelectAction: {
    zh: '请选择 Action',
    en: 'Please select action',
  },
  pleaseEnterTopic: {
    zh: '请输入 Topic',
    en: 'Please enter topic',
  },
  iterationCount: {
    zh: '迭代次数',
    en: 'Iteration Count',
  },
  dkLength: {
    zh: '密钥长度',
    en: 'Derived key length',
  },
  payloadTooLargeTip: {
    zh: 'payload 大小超过 1MB 内容无法查看',
    en: 'The payload size exceeds 1MB, and the content cannot be viewed',
  },
  readMode: {
    zh: '读模式',
    en: 'Read Mode',
  },
  writeMode: {
    zh: '写模式',
    en: 'Write Mode',
  },
  topicTips: {
    zh: '主题字符串，支持 ${0} 和 ${1} 占位符，在执行权限检查时会被替换为对应客户端的 Username 或 Client ID',
    en: "Topic supports ${0} and ${1} placeholders, which will be replaced with the corresponding client's Username or Client ID when performing permission checks.",
  },
  jwtBase64Tips: {
    zh: '接收一个 Base64 编码后的字符串',
    en: 'Receive a Base64-encoded string',
  },
  nodeStatusDesc: {
    zh: '每个节点上{target}状态和执行情况',
    en: '{target} status and execution on each node',
  },
  noDatabasePlaceholder: {
    zh: '无可用的数据库供此类型网关选择',
    en: 'There are no databases available for this type of gateway to choose from',
  },
  pseudorandomFunction: {
    zh: '伪随机函数',
    en: 'Pseudorandom function',
  },
}
