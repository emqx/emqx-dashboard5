export default {
  mechanism: {
    zh: '认证方式',
    en: 'Mechanism',
  },
  dataSource: {
    zh: '数据源',
    en: 'Backend',
  },
  mechanismAndBackend: {
    zh: '数据源及认证方式',
    en: 'Mechanism and Backend',
  },
  status: {
    zh: '数据源状态',
    en: 'Status',
  },
  createAuth: {
    zh: '创建认证',
    en: 'Create Authentication',
  },
  createAuthz: {
    zh: '创建授权',
    en: 'Create Authorization',
  },
  config: {
    zh: '配置参数',
    en: 'Configuration',
  },
  scram: {
    zh: '增强认证',
    en: 'SCRAM',
  },
  passwordBasedDesc: {
    zh: '使用客户端用户名、Client ID 与密码进行认证',
    en: 'Authenticate using client username, client id, and password',
  },
  jwtDesc: {
    zh: '客户端携带 JWT 进行认证',
    en: 'Authentication using client JWT',
  },
  secret_base64_encoded: {
    zh: 'Secret 使用 Base64 编码',
    en: 'Secret Base64 Encoded',
  },
  enhancedAuthDesc: {
    zh: 'MQTT 5.0 增强认证',
    en: 'MQTT 5 Enhanced Authentication',
  },
  dataSourceDesc: {
    zh: '选择存储认证数据的数据库或提供认证数据功能的 HTTP 服务器',
    en: 'Select the database where the authentication data is stored or the HTTP server that provides the authentication data function',
  },
  dataSourceAuthzDesc: {
    zh: '选择存储权限数据的数据库或提供认证数据功能的 HTTP 服务器',
    en: 'Select the database where the authorization data is stored or the HTTP server that provides the authorization data function',
  },
  dataSourceEnhancedGSSAPIAuthDesc: {
    zh: '选择 GSSAPI 认证数据源（例如 Kerberos）',
    en: 'Select the GSSAPI authentication data source (e.g., Kerberos)',
  },
  database: {
    zh: '数据库',
    en: 'Database',
  },
  noBackendDataSourceDesc: {
    zh: '{ mechanism } 认证无需选择数据源，请继续下一步配置',
    en: '{ mechanism } authentication does not require a backend, continue to the next step',
  },
  reconnect: {
    zh: '自动重连',
    en: 'Reconnect',
  },
  userConfig: {
    zh: '用户管理',
    en: 'User Management',
  },
  users: {
    zh: '用户管理',
    en: 'Users',
  },
  data: {
    zh: '数据管理',
    en: 'Data',
  },
  testSuccess: {
    zh: '测试通过，您的配置可以正常使用',
    en: 'Test success, your configuration works fine',
  },
  testFailed: {
    zh: '测试失败',
    en: 'Test failed',
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
    zh: '授权设置',
    en: 'Authorization Settings',
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
    zh: '缓存最大数量',
    en: 'Maximum number of cached items',
  },
  ttl: {
    zh: '缓存过期时间',
    en: 'Time to live for the cached data',
  },
  setDefault: {
    zh: '设置默认',
    en: 'Set default',
  },
  setDefaultConfirm: {
    zh: '确定要将当前输入重置为默认值吗？',
    en: 'Are you sure you want to reset the current input to default value?',
  },
  passwordHash: {
    zh: '密码加密方式',
    en: 'Password Hash',
  },
  maxRules: {
    zh: '最大规则数',
    en: 'Max Rules',
  },
  maxRulesDesc: {
    zh: '每个客户端/用户的最大规则数。请注意，随着规则数量的增加，性能可能会降低。',
    en: 'Maximum number of rules per client/user. Note that performance may decrease as number of rules increases.',
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
    zh: '服务器地址',
    en: 'Server',
  },
  servers: {
    zh: '服务器列表',
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
  mongoAuthSource: {
    zh: '认证源',
    en: 'Auth Source',
  },
  authzMongoLimit: {
    zh: '记录条数限制',
    en: 'Record Limit',
  },
  authzMongoSkip: {
    zh: '跳过记录数',
    en: 'Skip',
  },
  srvRecord: {
    zh: 'SRV 记录',
    en: 'SRV Record',
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
  filter: {
    zh: '查询 Filter',
    en: 'Filter',
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
  httpPipelining: {
    zh: 'HTTP 管道',
    en: 'HTTP Pipelining',
  },
  isSuperuser: {
    zh: '是否为超级用户',
    en: 'Is superuser',
  },
  isSuperuserDesc: {
    zh: '当设置为超级用户后，该用户将跳过后续所有的权限检查。',
    en: 'When set to superuser, this user will skip all subsequent permission.',
  },
  algorithm: {
    zh: '加密方式',
    en: 'Algorithm',
  },
  refreshInterval: {
    zh: 'JWKS 刷新间隔',
    en: 'JWKS Refresh Interval',
  },
  builtInDatabase: {
    zh: '内置数据库',
    en: 'Built-in Database',
  },
  HTTPServer: {
    zh: 'HTTP 服务',
    en: 'HTTP Server',
  },
  file: {
    zh: '文件',
    en: 'File',
  },
  permissionCount: {
    zh: '权限条数',
    en: 'Number of permissions',
  },
  pleaseEnterClientID: {
    zh: '请输入客户端 ID',
    en: 'Client ID is required',
  },
  pleaseEnterUsername: {
    zh: '请输入用户名',
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
    zh: '每个节点上{target}的资源状况和执行效率',
    en: `Resource condition and execution efficiency of {target} on each node`,
  },
  noDatabasePlaceholder: {
    zh: '无可用的数据库供此类型网关选择',
    en: 'There are no databases available for this type of gateway to choose from',
  },
  pseudorandomFunction: {
    zh: '伪随机函数',
    en: 'Pseudorandom function',
  },
  from: {
    zh: 'JWT 来自于',
    en: 'JWT From',
  },
  noMatch: {
    zh: '未匹配时执行',
    en: 'No Match Action',
  },
  denyAction: {
    zh: '拒绝时执行',
    en: 'Deny Action',
  },
  disableAuthnTip: {
    zh: '停用该认证器后，将影响客户端的安全连接，是否继续？',
    en: 'Disabling this authenticator will affect the security connection of the client, continue?',
  },
  disableAuthzTip: {
    zh: '停用该授权后，将影响客户端发布/订阅时的权限操作，是否继续？',
    en: 'Disabling this authorization will affect the operation of permissions when the client publishes/subscribes. Continue?',
  },
  delAuthnConfirm: {
    zh: '删除该认证器后，可能导致非法客户端连接至当前服务器，{additionalTip}是否确认删除？',
    en: 'Deleting this authenticator may result in unauthorized clients connecting to the EMQX server, {additionalTip}continue? ',
  },
  delAuthzConfirm: {
    zh: '删除该授权后，可能影响客户端发布和订阅操作的权限控制，{additionalTip}是否确认删除？',
    en: 'Deleting this authorization may affect the permission control of client publish and subscribe operations, {additionalTip}continue?',
  },
  deleteBuiltInTip: {
    zh: '且已添加的数据将被删除，',
    en: 'and the added data will be deleted, ',
  },
  allUsers: {
    zh: '所有用户',
    en: 'All Users',
  },
  permission: {
    zh: '权限',
    en: 'Permission',
  },
  permissions: {
    zh: '权限管理',
    en: 'Permissions',
  },
  action: {
    zh: '操作',
    en: 'Action',
  },
  updateBuiltInTip: {
    zh: '更新密码加密方式或加盐方式将导致已添加的认证数据不可用，是否确认更新？',
    en: 'Updating the Password Hash or Salt Position will cause the added authentication data to be unavailable. Confirm to update?',
  },
  authn: {
    zh: '认证',
    en: 'authentication',
  },
  authz: {
    zh: '授权',
    en: 'authorization',
  },
  publish: {
    zh: '发布时',
    en: 'Publish',
  },
  subscribe: {
    zh: '订阅时',
    en: 'Subscribe',
  },
  all: {
    zh: '发布和订阅时',
    en: 'Publish & Subscribe',
  },
  jsonFormatError: {
    zh: '请输入正确的 JSON',
    en: 'Please enter the correct JSON',
  },
  httpHeaderDesc: {
    zh: 'HTTP 请求头列表（不包含 `content-type`）',
    en: 'List of HTTP headers (without `content-type`).',
  },
  httpBodyTip: {
    zh: '配置中指定的 Body 必须被格式化为 JSON 对象。方法为 POST 的 HTTP 请求中的 Body 的最终表现形式取决于 `content-type` 头被设置为 `application/json` 还是 `application/x-www-form-urlencoded`。',
    en: 'Please note that the body specified in the configuration must be formatted as a JSON object. The final representation of the HTTP POST body depends on the `content-type` header being set to either `application/json` or `application/x-www-form-urlencoded`.',
  },
  replicaSetName: {
    zh: 'Replica Set 名称',
    en: 'Replica Set Name',
  },
  collection: {
    zh: '集合',
    en: 'Collection',
  },
  priorityRangeError: {
    zh: '优先级数字必须在 1 到 255 之间。',
    en: 'Priority number must be a number between 1 and 255.',
  },
  query_timeout: {
    zh: '查询超时',
    en: 'Query Timeout',
  },
  base_dn: {
    zh: '基本 DN',
    en: 'Base DN',
  },
  pwdMethod: {
    zh: '密码认证方式',
    en: 'Password Authentication Method',
  },
  bind_password: {
    zh: '绑定密码',
    en: 'Bind Password',
  },
  bind_password_desc: {
    zh: '用于绑定密码的模板',
    en: 'The template for password to bind.',
  },
  password_attribute: {
    zh: '密码属性名',
    en: 'Password Hash Attribute',
  },
  password_attribute_desc: {
    zh: '存储客户端密码的 LDAP 属性名称',
    en: 'The LDAP attribute that stores the password hash for clients.',
  },
  is_superuser_attribute: {
    zh: '超级用户属性名',
    en: 'Is Superuser Attribute',
  },
  is_superuser_attribute_desc: {
    zh: '存储客户端超级用户角色的 LDAP 属性名称',
    en: "The LDAP attribute that indicates a client's superuser role.",
  },
  methodHashLabel: {
    zh: '本地密码比对',
    en: 'Local Password Comparison',
  },
  methodHashDesc: {
    zh: 'EMQX 查询 LDAP 以获取客户端的密码，然后在本地进行比对。',
    en: "EMQX queries LDAP to retrieve the client's password and then compares it locally.",
  },
  methodBindLabel: {
    zh: 'LDAP绑定验证',
    en: 'LDAP Bind Authentication',
  },
  methodBindDesc: {
    zh: 'EMQX 直接使用 LDAP 绑定验证用户名和密码。',
    en: 'EMQX directly uses LDAP binding to authenticate the username and password.',
  },
  authnTotalDesc: {
    zh: '认证器被触发执行的总次数',
    en: 'Total number of authenticator triggers',
  },
  authnSuccessDesc: {
    zh: '认证成功允许连接的次数',
    en: 'Number of successful authentications allowed for connection',
  },
  authnFailedDesc: {
    zh: '认证失败拒绝连接次数，通常是密码错误导致',
    en: 'Number of failed authentications resulting in connection denied, typically due to password errors',
  },
  authnNomatchDesc: {
    zh: '未找到客户端认证数据的次数。如果认证器执行失败也会增加此计数',
    en: 'Number of times client authentication data is not found. If the authenticator execution fails, the count will also increase',
  },
  authzTotalDesc: {
    zh: '授权器被触发执行的总次数',
    en: 'Total number of authorizer triggers',
  },
  authzSuccessDesc: {
    zh: '授权成功的次数',
    en: 'Number of successful authorizations',
  },
  authzFailedDesc: {
    zh: '授权失败的次数',
    en: 'Number of authorization failures',
  },
  authzNomatchDesc: {
    zh: '未找到客户端权限数据的次数。如果授权器执行失败也会增加此计数',
    en: 'Number of times client authorization data is not found. If the authorizer execution fails, the count will also increase',
  },
  rateUnit: {
    zh: '次/秒 | 次/秒',
    en: 'time/sec | times/sec',
  },
  authnRateBarDesc: {
    zh: '近一分钟内认证次数趋势',
    en: 'Trend of authentication counts in the past minute',
  },
  authzRateBarDesc: {
    zh: '近一分钟内授权次数趋势',
    en: 'Trend of authorization counts in the past minute',
  },
  excludedTopics: {
    zh: '排除主题',
    en: 'Excluded Topics',
  },
  excludedTopicsDesc: {
    zh: '指定列表内的主题不会生成授权缓存。',
    en: 'The topics specified in the list will not generate an authorization cache.',
  },
  importUsers: {
    zh: '导入用户',
    en: 'Import Users',
  },
  selectImportMethod: {
    zh: '选择导入方式',
    en: 'Select import method',
  },
  plaintextPassword: {
    zh: '明文密码',
    en: 'Plaintext',
  },
  encryptedPassword: {
    zh: '加密密码',
    en: 'Encrypted',
  },
  downloadImportTemplate: {
    zh: '下载导入模板',
    en: 'Download import template',
  },
  downloadUserImportTemplate: {
    zh: '为保证顺利导入，请您下载用户导入模板。',
    en: 'To ensure successful import, please download the user import template.',
  },
  uploadFile: {
    zh: '上传文件',
    en: 'Upload file',
  },
  clickToSelectFile: {
    zh: '点击选择文件',
    en: 'Click to select file',
  },
  downloadTemplate: {
    zh: '下载模板',
    en: 'Download template',
  },
  selectFileFirst: {
    zh: '请先选择文件',
    en: 'Please select a file first',
  },
  disconnect_after_expire: {
    zh: '过期后断开连接',
    en: 'Disconnect After Expiration',
  },
  ignored: {
    zh: '忽略',
    en: 'Ignored',
  },
  ignoredDesc: {
    zh: '被忽略的授权请求计数。当授权源尝试对请求进行授权但遇到不适用的情况或出现错误导致结果无法确定时，此计数器会增加。',
    en: 'Count of authorization requests ignored. This counter increments when an authorization source attempts to authorize a request but encounters scenarios where the authorizer is not applicable or encounters an error, resulting in an undecidable outcome.',
  },
  importCompleted: {
    zh: '导入完成',
    en: 'Import completed',
  },
  successRecords: {
    zh: '成功 {success} 条',
    en: 'Success {success} records',
  },
  overrideRecords: {
    zh: '覆盖 {override} 条',
    en: 'Override {override} records',
  },
  failedRecords: {
    zh: '失败 {failed} 条',
    en: 'Failed {failed} records',
  },
  skippedRecords: {
    zh: '跳过 {skipped} 条',
    en: 'Skipped {skipped} records',
  },
  totalRecords: {
    zh: '总计 {total} 条',
    en: 'Total {total} records',
  },
  allImportSuc: {
    zh: '成功导入 {total} 条数据',
    en: 'Successfully imported {total} records',
  },
  principal: {
    zh: '主体',
    en: 'Principal',
  },
  principalDesc: {
    zh: "服务器的 Kerberos 主体。例如 `mqtt/cluster1.my.net{'@'}MY.REALM.COM`。\n注意：使用的 realm 必须在 EMQX 节点的 `/etc/krb5.conf` 中配置。\n注意：主体必须存在于默认的 keytab 文件中。系统默认的 keytab 文件通常是 `/etc/krb5.keytab`，也可以通过环境变量 `KRB5_KTNAME` 或 `/etc/krb5.conf` 中的 `default_keytab_name` 设置。",
    en: "Kerberos principal for server. For example, `mqtt/cluster1.my.net{'@'}MY.REALM.COM`.\nNOTE: The realm in use has to be configured in `/etc/krb5.conf` in EMQX nodes.\nNOTE: The principal must be found in the default keytab file. System default keytab file is usually `/etc/krb5.keytab`, or can be set with environment variable `KRB5_KTNAME` or `default_keytab_name` in `/etc/krb5.conf`.",
  },
  cinfoAuthDesc: {
    zh: '使用 Client Information 进行认证',
    en: 'Use Client Information for authentication',
  },
  checks: {
    zh: '检查列表',
    en: 'Checks',
  },
  isMatch: {
    zh: '匹配条件',
    en: 'Match Conditions',
  },
  isMatchDesc: {
    zh: `Variform 表达式用于评估客户端信息。多个表达式请分行输入，每行一个表达式。支持的变量：\n
- <code>username</code>: 用户名\n
- <code>password</code>: 客户端密码\n
- <code>clientid</code>: 客户端 ID\n
- <code>client_attrs.*</code>: 客户端属性\n
- <code>peerhost</code>: 客户端 IP\n
- <code>cert_subject</code>: TLS 证书主题\n
- <code>cert_common_name</code>: TLS 证书通用名称\n
- <code>zone</code>: 接受客户端连接的监听器所关联的 zone\n
所有表达式返回 "true" 时，认证器返回相关结果；否则跳过当前检查。\n\n
简单示例（每行一个表达式）：\n
<code>regex_match(username, '^admin')</code>\n
<code>str_eq(client_attrs.group, 'premium')</code>\n\n
更多函数和高级用法请参考完整文档。`,
    en: `Variform expressions to evaluate client information. For multiple expressions, enter each expression on a new line. Supported variables:\n
- <code>username</code>: client username\n
- <code>password</code>: the password of the client\n
- <code>clientid</code>: client ID\n
- <code>client_attrs.*</code>: client attributes\n
- <code>peerhost</code>: client IP\n
- <code>cert_subject</code>: TLS certificate subject\n
- <code>cert_common_name</code>: TLS certificate common name\n
- <code>zone</code>: the config zone associated with the listener from which the client is accepted\n
If all expressions return "true", the authenticator returns the associated result; otherwise, the current check is skipped.\n\n
Simple examples (one expression per line):\n
<code>regex_match(username, '^admin')</code>\n
<code>str_eq(client_attrs.group, 'premium')</code>\n\n
For more functions and advanced usage, please refer to the full documentation.`,
  },
  result: {
    zh: '匹配结果',
    en: 'Result',
  },
  resultDesc: {
    zh: '如果匹配条件为真，则返回此结果。\n支持的结果：\n- <code>ignore</code>: 将认证延迟到链中的下一个认证器。\n- <code>allow</code>: 允许客户端连接。\n- <code>deny</code>: 拒绝客户端连接。',
    en: 'The result to return if the match condition is true.\nSupported results:\n- <code>ignore</code>: defer the authentication to the next authenticator in the chain.\n- <code>allow</code>: allow the client to connect.\n- <code>deny</code>: deny the client to connect.',
  },
}
