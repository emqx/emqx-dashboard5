export default {
  ldapClientAttrs: {
    zh: '客户端属性映射',
    en: 'Client Attribute Mappings',
  },
  ldapClientAttrsDesc: {
    zh: '从用户 LDAP 条目读取属性，每条映射选择一个值并生成一个客户端属性；多个映射可同时生效。同名客户端属性由后续成功的映射覆盖。仅支持用户条目上的成员关系属性（如 `memberOf`），不解析嵌套组，也不查询组条目的 `member` 或 `uniqueMember`。',
    en: 'Read attributes from the user’s LDAP entry. Each mapping selects one value and sets one client attribute; several mappings can succeed. Later successful mappings overwrite the same client attribute. Membership must be on the user entry, such as `memberOf`. Nested groups and membership stored only on group entries (`member` or `uniqueMember`) are not resolved.',
  },
  ldapAddMapping: {
    zh: '添加映射',
    en: 'Add Mapping',
  },
  ldapDirectoryAttribute: {
    zh: 'LDAP 目录属性',
    en: 'Directory Attribute',
  },
  ldapDirectoryAttributeDesc: {
    zh: '例如 memberOf。属性名不区分大小写；以字母开头，可含字母、数字和连字符，或使用数字 OID。用户条目缺少该属性时，本映射不产生客户端属性。',
    en: 'For example, memberOf. Names are case-insensitive: a letter followed by letters, digits or hyphens, or a numeric OID. If the user entry has no such attribute, the mapping sets nothing.',
  },
  ldapClientAttributeName: {
    zh: '客户端属性名',
    en: 'Client Attribute Name',
  },
  ldapClientAttributeNameDesc: {
    zh: '以字母或数字开头，仅包含字母、数字、连字符和下划线。',
    en: 'Start with a letter or digit; use only letters, digits, hyphens and underscores.',
  },
  ldapInvalidDirectoryAttribute: {
    zh: '请输入合法的 LDAP 属性名或数字 OID。',
    en: 'Enter a valid LDAP attribute name or numeric OID.',
  },
  ldapInvalidClientAttributeName: {
    zh: '客户端属性名须以字母或数字开头，仅包含字母、数字、连字符和下划线。',
    en: 'Client attribute names must start with a letter or digit and contain only letters, digits, hyphens and underscores.',
  },
  ldapSelectPatterns: {
    zh: '匹配正则表达式',
    en: 'Select Patterns',
  },
  ldapSelectPatternsDesc: {
    zh: '输入正则后按回车添加标签，拖动标签可调整匹配顺序；逗号属于正则内容，不会拆分标签。至少配置一个 PCRE 正则，语法由服务器校验。按正则顺序尝试，每个正则按目录返回顺序检查属性值，选择首个匹配值。匹配区分大小写，前缀 `(?i)` 可忽略大小写。正则针对完整属性值（如组 DN）匹配；建议使用 `^CN=GROUP-X,`，避免误匹配 GROUP-X-ADMIN。空正则会匹配任意值。',
    en: 'Press Enter to add a pattern; drag tags to change matching order. Commas are part of the pattern and do not split tags. Configure at least one PCRE pattern; syntax is validated by the server. Patterns are tried in order, each against values in directory order; the first matching value is selected. Matching is case-sensitive; prefix with `(?i)` to ignore case. Patterns run against the full attribute value, such as a group DN. Use `^CN=GROUP-X,` to avoid matching GROUP-X-ADMIN. An empty pattern matches any value.',
  },
  ldapEmptyPatterns: {
    zh: '请至少添加一个匹配正则表达式。',
    en: 'Add at least one select pattern.',
  },
  ldapEmptyPattern: {
    zh: '空正则（匹配任意值）',
    en: 'Empty pattern (matches any value)',
  },
  ldapExtract: {
    zh: '提取方式',
    en: 'Extract',
  },
  ldapExtractDesc: {
    zh: '`value`（默认）：使用选中的完整值。`cn`：提取 DN 第一个 RDN 中的 CN；不是合法 DN 或该 RDN 没有 CN 时不产生属性。`literal`：匹配成功后使用配置的固定字符串。目录值保留原始大小写。',
    en: '`value` (default): use the complete selected value. `cn`: extract the CN from the first RDN of a DN; an invalid DN or a first RDN without CN produces no attribute. `literal`: use the configured string after a match. Directory values retain their original casing.',
  },
  ldapLiteral: {
    zh: '固定字符串',
    en: 'Literal Value',
  },
  ldapMissingLiteral: {
    zh: 'literal 提取方式必须配置非空的固定字符串。',
    en: 'Set a non-empty literal value for literal extraction.',
  },
  ldapRequireClientAttrs: {
    zh: '无映射结果时拒绝认证',
    en: 'Require Client Attributes',
  },
  ldapRequireClientAttrsDesc: {
    zh: '启用后，如果所有映射都未得到客户端属性，则拒绝认证；至少一条映射成功即可。禁用时，不会因无映射结果而拒绝认证。启用前请至少配置一条映射。',
    en: 'When enabled, at least one mapping must produce a client attribute or authentication is denied; not every mapping must succeed. When disabled, no attribute output does not cause authentication to fail. Configure at least one mapping before enabling.',
  },
  ldapRequireWithoutMappings: {
    zh: '启用“无映射结果时拒绝认证”时，请至少配置一条映射。',
    en: 'Configure at least one mapping when Require Client Attributes is enabled.',
  },
  passwordMode: {
    zh: '密码设置方式',
    en: 'Password Mode',
  },
  positiveIntegerRequired: {
    zh: '请输入大于 0 的整数',
    en: 'Enter an integer greater than 0',
  },
  generatedPasswordMode: {
    zh: '自动生成',
    en: 'Automatically Generated',
  },
  manualPasswordMode: {
    zh: '手动设置',
    en: 'Manually Supplied',
  },
  generatedPasswordModeDesc: {
    zh: '添加用户时由 EMQX 生成随机密码。修改密码请使用“重置密码”，客户端连接时仍需要提供密码。',
    en: 'EMQX generates a random password when a user is added. Use Reset Password to change it. Clients still need the password to connect.',
  },
  unsupportedBuiltinHash: {
    zh: '所选的密码加密算法不可用，请重新选择。',
    en: 'The selected password hash algorithm is unavailable. Choose a supported algorithm.',
  },
  keepPasswordPlaceholder: {
    zh: '留空表示保留原密码',
    en: 'Leave blank to keep the current password',
  },
  generatedPassword: {
    zh: '生成的密码',
    en: 'Generated Password',
  },
  generatedPasswordNotice: {
    zh: '请复制并保存此密码，用于配置客户端连接。关闭后无法再次查看；需要新密码时可重置密码。',
    en: 'Copy and save this password to configure your client. It cannot be viewed again after closing this dialog. Reset the password if you need a new one.',
  },
  generatedPasswordImportNotice: {
    zh: '导入将使用文件中的密码或密码哈希，不会自动生成密码。导入已存在的用户时，会覆盖其原有密码。',
    en: 'Import uses the passwords or password hashes in the file and does not generate passwords automatically. Importing an existing user overwrites their current password.',
  },
  generatedPasswordHashImportNotice: {
    zh: '当前模式使用 SHA-256 且不加盐，请确保文件中的密码哈希采用相同方式生成。',
    en: 'This mode uses SHA-256 without a salt. Ensure the password hashes in the file were generated using the same settings.',
  },
  userId: {
    zh: '用户 ID',
    en: 'User ID',
  },
  rotatePassword: {
    zh: '重置密码',
    en: 'Reset Password',
  },
  rotatePasswordConfirm: {
    zh: '确认重置用户 {user} 的密码？重置后将自动生成新密码，原密码立即失效。',
    en: 'Reset the password for user {user}? A new password will be generated automatically, and the current password will stop working immediately.',
  },
  rotatePasswordSuccess: {
    zh: '密码已重置',
    en: 'Password reset',
  },
  listenerAuthentication: {
    zh: '监听器认证',
    en: 'Listener Authentication',
  },
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
  nodeCacheSettings: {
    zh: '外部资源缓存设置',
    en: 'External Resource Cache Settings',
  },
  authnSettings: {
    zh: '认证设置',
    en: 'Authentication Settings',
  },
  enableNodeCache: {
    zh: '启用外部资源缓存',
    en: 'Enable External Resource Cache',
  },
  enableNodeCacheDesc: {
    zh: '启用外部资源缓存后，EMQX 将缓存外部资源（如 MySQL、MongoDB 等）的查询结果，以提高效率；对于本地数据源，如内置数据库或文件等不进行缓存。',
    en: 'After enabling external resource cache, EMQX will cache the query results of external resources (such as MySQL, MongoDB, etc.), to improve efficiency; for local data sources, such as built-in databases or file, are not cached.',
  },
  ignoreBackendFailures: {
    zh: '忽略认证数据源错误',
    en: 'Ignore Backend Failures',
  },
  perSecurityProfile: {
    zh: '跟随安全配置模式',
    en: 'Follow Security Profile',
  },
  ignoreBackendFailuresDesc: {
    zh: `决定认证数据源发生错误时的处理方式
- 跟随安全配置模式：legacy 模式忽略错误并继续下一个认证器，hardened 模式拒绝客户端连接
- 启用：在两种模式下均忽略错误，并继续认证链中的下一个认证器
- 停用：在两种模式下均拒绝客户端连接`,
    en: `Controls how authentication backend failures are handled
- Follow Security Profile: The legacy profile ignores failures and continues with the next authenticator; the hardened profile rejects the client connection
- Enabled: Ignore failures and continue with the next authenticator in both profiles
- Disabled: Reject the client connection in both profiles`,
  },
  ignoreAuthzBackendFailures: {
    zh: '忽略授权数据源错误',
    en: 'Ignore Authorization Backend Failures',
  },
  ignoreAuthzBackendFailuresDesc: {
    zh: `决定授权数据源发生错误时的处理方式
- 跟随安全配置模式：legacy 模式忽略错误并继续下一个授权数据源，hardened 模式拒绝当前操作
- 启用：在两种模式下均忽略错误，并继续尝试下一个授权数据源
- 停用：在两种模式下均拒绝当前操作`,
    en: `Controls how authorization backend failures are handled
- Follow Security Profile: The legacy profile ignores failures and continues with the next authorization source; the hardened profile denies the current action
- Enabled: Ignore failures and continue with the next authorization source in both profiles
- Disabled: Deny the current action in both profiles`,
  },
  ignoreAuthzRuleRenderFailures: {
    zh: '忽略授权规则渲染错误',
    en: 'Ignore Authorization Rule Render Failures',
  },
  ignoreAuthzRuleRenderFailuresDesc: {
    zh: `决定授权规则中的主题过滤器模板渲染失败时的处理方式，例如变量缺失，或替换值包含不允许的字符（\`+\`、\`#\`、\`/\`）。此配置独立于授权数据源错误配置。
- 跟随安全配置模式：legacy 模式跳过失败的过滤器，hardened 模式拒绝当前发布或订阅操作
- 启用：在两种模式下均跳过失败的过滤器，继续匹配其他过滤器或规则，并非直接放行
- 停用：在两种模式下均拒绝当前发布或订阅操作`,
    en: `Controls how topic-filter template render failures in authorization rules are handled, such as missing variables or substituted values containing disallowed characters (\`+\`, \`#\`, or \`/\`). This setting is independent of authorization backend failures.
- Follow Security Profile: The legacy profile skips the failing filter; the hardened profile denies the current publish or subscribe action
- Enabled: Skip the failing filter and continue matching other filters or rules in both profiles; this does not automatically allow the action
- Disabled: Deny the current publish or subscribe action in both profiles`,
  },
  nodeCacheMaxCount: {
    zh: '缓存最大数量',
    en: 'Maximum Number of Cached Items',
  },
  cleanupInterval: {
    zh: '清理间隔',
    en: 'Cleanup Interval',
  },
  maxMemory: {
    zh: '最大内存',
    en: 'Maximum Memory',
  },
  statUpdateInterval: {
    zh: '统计更新间隔',
    en: 'Statistics Update Interval',
  },
  cacheTTL: {
    zh: '缓存过期时间',
    en: 'Cache TTL',
  },
  nodeCacheStatus: {
    zh: '外部资源缓存状态',
    en: 'External Resource Cache Status',
  },
  authzSetting: {
    zh: '授权设置',
    en: 'Authorization Settings',
  },
  enableCache: {
    zh: '启用客户端缓存',
    en: 'Enable Client Cache',
  },
  clearCache: {
    zh: '清除客户端缓存',
    en: 'Clear Client Cache',
  },
  clearCacheDesc: {
    zh: '清除当前所有客户端缓存。',
    en: 'Clears all current client caches.',
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
  clientidOverrideField: {
    zh: 'Client ID 覆盖字段名',
    en: 'Client ID Override Field',
  },
  sentinel: {
    zh: 'Sentinel 名字',
    en: 'Sentinel Name',
  },
  sentinelUsername: {
    zh: 'Sentinel 用户名',
    en: 'Sentinel Username',
  },
  sentinelPassword: {
    zh: 'Sentinel 密码',
    en: 'Sentinel Password',
  },
  method: {
    zh: '请求方式',
    en: 'Method',
  },
  httpPipelining: {
    zh: 'HTTP 管道',
    en: 'HTTP Pipelining',
  },
  hostnameResolution: {
    zh: '主机名解析方式',
    en: 'Hostname Resolution',
  },
  hostnameResolutionDesc: {
    zh: '静态模式使用固定主机名和持久连接池；动态模式会在每次请求时解析主机名，并支持 URL 主机中的模板变量。',
    en: 'Static mode uses a fixed hostname and persistent connection pool. Dynamic mode resolves the hostname for each request and supports template variables in the URL host.',
  },
  hostnameResolutionStatic: {
    zh: '静态',
    en: 'Static',
  },
  hostnameResolutionDynamic: {
    zh: '动态',
    en: 'Dynamic',
  },
  allowedHosts: {
    zh: '允许的主机',
    en: 'Allowed Hosts',
  },
  allowedHostsDesc: {
    zh: 'URL 主机包含模板变量时必须配置。多个条目使用英文逗号分隔；每项可以是精确主机名（如 auth.example.com）或以 *. 开头的通配符模式（如 *.auth.example.com），不能包含端口、路径或空格。',
    en: 'Required when the URL host contains template variables. Separate multiple entries with commas. Each entry must be an exact hostname (such as auth.example.com) or a wildcard pattern starting with *. (such as *.auth.example.com); ports, paths, and spaces are not allowed.',
  },
  httpURLDesc: {
    zh: "动态解析模式下，主机部分可以包含模板变量，例如 https://${'{'}client_attrs.tns{'}'}.auth.example.com/auth。",
    en: "In dynamic resolution mode, the host may contain template variables, for example https://${'{'}client_attrs.tns{'}'}.auth.example.com/auth.",
  },
  templatedHostnameNotSupported: {
    zh: '当前认证方式不支持 URL 主机模板变量。',
    en: 'The current authentication mechanism does not support template variables in the URL host.',
  },
  templatedHostnameRequiresDynamic: {
    zh: 'URL 主机包含模板变量时，主机名解析方式必须选择动态。',
    en: 'Dynamic hostname resolution is required when the URL host contains template variables.',
  },
  templatedHostnameRequiresAllowedHosts: {
    zh: 'URL 主机包含模板变量时，必须至少配置一个允许的主机。',
    en: 'At least one allowed host is required when the URL host contains template variables.',
  },
  dynamicHostnameOAuth2Conflict: {
    zh: '动态主机名解析不能与 OAuth2 同时启用。',
    en: 'Dynamic hostname resolution cannot be used with OAuth2.',
  },
  invalidAllowedHost: {
    zh: '请输入有效的主机名或以 *. 开头的通配符模式，不能包含端口、路径或空格。',
    en: 'Enter a valid hostname or a wildcard pattern starting with *.; ports, paths, and spaces are not allowed.',
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
  addPermission: {
    zh: '添加权限',
    en: 'Add Permission',
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
  pattern: {
    zh: '表达式',
    en: 'Pattern',
  },
  permissionListenerDesc: {
    zh: "用于过滤应用规则的监听器，由监听器类型和名称组成，`{'{'}监听器类型{'}'}:{'{'}监听器名称{'}'}`。例如：`tcp:default`，`ws:default`",
    en: "Listener for filtering applied rules, composed of listener type and name, `{'{'}listener type{'}'}:{'{'}listener name{'}'}`. For example: `tcp:default`, `ws:default`",
  },
  permissionListenerRegexDesc: {
    zh: '用于过滤应用规则的监听器正则表达式。例如：`^tcp:.$`，`^ws:.$`',
    en: 'Listener regex for filtering applied rules. For example: `^tcp:.$`, `^ws:.$`',
  },
  permissionZoneDesc: {
    zh: '用于过滤应用规则的 Zone 名称。例如：`zone1`、`zone2`、`default`',
    en: 'Zone name for filtering applied rules. For example: `zone1`, `zone2`, `default`',
  },
  permissionZoneRegexDesc: {
    zh: '用于过滤应用规则的 Zone 正则表达式。例如：`zone[0-9]+`，`^zone-.*$`',
    en: 'Zone regex for filtering applied rules. For example: `zone[0-9]+`, `^zone-.*$`',
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
  on_missing_jwt: {
    zh: '缺少 JWT 时执行',
    en: 'On Missing JWT',
  },
  on_missing_jwt_desc: {
    zh: '当配置的 JWT 来源字段缺失时执行的操作。选择 deny 将立即拒绝认证；选择 ignore 将跳过此认证器并继续认证链。',
    en: 'Action to take when the configured JWT credential field is missing. Use deny to reject authentication immediately, or ignore to skip this authenticator and let the authentication chain continue. ',
  },
  noMatch: {
    zh: '未匹配时执行',
    en: 'No Match Action',
  },
  denyAction: {
    zh: '拒绝时执行',
    en: 'Deny Action',
  },
  includeMountpoint: {
    zh: '授权检查时包含挂载点',
    en: 'Mount Prefix for Authorization',
  },
  includeMountpointDesc: {
    zh: '启用后，目标主题和主题过滤器在匹配 ACL 规则或授权器之前，会被加上主题挂载点前缀。',
    en: `When enabled, the target topics and topic filters are prefixed by the topic mountpoint before being matched against ACL rules or by authorization backends.`,
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
  confirmOrderChange: {
    zh: '确认修改顺序？',
    en: 'Confirm changing the order?',
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
    zh: '更新密码设置方式或加密算法后，新建用户及后续修改的密码将使用新配置。已保存加密算法的用户保留原密码；升级遗留数据请先验证兼容性。是否继续？',
    en: 'New users and subsequent password changes will use the updated mode and hash settings. Users with stored hash metadata keep their current passwords. Verify compatibility for legacy data before proceeding. Continue?',
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
    zh: '存储客户端超级用户角色的 LDAP 属性名称。',
    en: "The LDAP attribute that indicates a client's superuser role.",
  },
  clientid_override_attribute: {
    zh: 'Client ID 覆盖属性',
    en: 'Client ID Override Attribute',
  },
  clientid_override_attribute_desc: {
    zh: '指定用于表示覆盖客户端 ID 的属性。',
    en: 'Indicates which attribute is used to represent a clientid override value.',
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
  publish_attribute: {
    zh: '发布属性',
    en: 'Publish Attribute',
  },
  publish_attributeDesc: {
    zh: '指定用于表示 `publish` 允许主题列表的属性。',
    en: 'Indicates which attribute is used to represent the allowed topics list of the `publish`.',
  },
  subscribe_attribute: {
    zh: '订阅属性',
    en: 'Subscribe Attribute',
  },
  subscribe_attributeDesc: {
    zh: '指定用于表示 `subscribe` 允许主题列表的属性。',
    en: 'Indicates which attribute is used to represent the allowed topics list of the `subscribe`.',
  },
  all_attribute: {
    zh: '全部属性',
    en: 'All Attribute',
  },
  all_attributeDesc: {
    zh: '指定用于表示 `publish` 和 `subscribe` 都允许的主题列表的属性。',
    en: 'Indicates which attribute is used to represent the both allowed topics list of  `publish` and `subscribe`.',
  },
  acl_rule_attribute: {
    zh: 'ACL 规则属性',
    en: 'ACL Rule Attribute',
  },
  acl_rule_attributeDesc: {
    zh: '指定用于表示 JSON 编码的 ACL 规则的属性。',
    en: 'Indicates which attribute is used to represent the JSON-encoded ACL rules.',
  },
  acl_ttl_attribute: {
    zh: 'ACL TTL 属性',
    en: 'ACL TTL Attribute',
  },
  acl_ttl_attributeDesc: {
    zh: '指定用于表示 ACL TTL 的属性。',
    en: 'Indicates which attribute is used to represent the ACL TTL.',
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
    zh: '次/秒',
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

  // Node Cache Metrics
  cacheCount: {
    zh: '缓存条目数',
    en: 'Cache Entries',
  },
  cacheMemory: {
    zh: '内存占用',
    en: 'Memory Usage',
  },
  cacheHits: {
    zh: '缓存命中',
    en: 'Cache Hits',
  },
  cacheInserts: {
    zh: '缓存插入',
    en: 'Cache Inserts',
  },
  cacheMisses: {
    zh: '缓存未命中',
    en: 'Cache Misses',
  },
  currentRate: {
    zh: '当前',
    en: 'current',
  },
  last5mRate: {
    zh: '5 分钟',
    en: '5 mins',
  },
  insertUnit: {
    zh: '条/秒',
    en: 'entry/sec | entries/sec',
  },
  bytes: {
    zh: '字节',
    en: 'bytes',
  },
  refresh: {
    zh: '刷新',
    en: 'Refresh',
  },
  resetNodeCacheStatus: {
    zh: '重置节点缓存状态',
    en: 'Reset Node Cache Status',
  },
  resetNodeCacheStatusConfirm: {
    zh: '确定要重置节点缓存状态吗？',
    en: 'Are you sure you want to reset the node cache status?',
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
    zh: `Variform 表达式用于求值客户端信息。多个表达式请分行输入，每行一个表达式。支持的变量：\n
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
  precondition: {
    zh: '调用条件',
    en: 'Precondition',
  },
  preconditionDesc: {
    zh: `一个可变形（Variform）的表达式，用于根据客户端信息中预绑定的变量进行求值。<br />
**表达式的求值结果必须为字符串值 \`'true'\`，此认证器才会被调用。**<br />
如果表达式求值为其他任何值，此认证器将被跳过。

支持的变量：
- \`username\`：客户端的用户名
- \`password\`：客户端的密码
- \`clientid\`：客户端的 Client ID
- \`client_attrs.*\`：客户端的自定义属性
- \`cert_common_name\`：客户端 TLS 证书中的 Common Name (CN) 字段
- \`cert_subject\`：客户端 TLS 证书中的 Subject 字段
- \`peersni\`：TLS 客户端发送的 SNI (Server Name Indication)
- \`listener\`：监听器 ID（例如 \`tcp:default\`）
- \`zone\`：关联的配置区域（Zone）

示例：
- 仅当客户端通过监听器 \`ssl:letsencryt\` 连接时调用：
  \`str_eq(listener, 'ssl:letsencryt')\`
- 如果用户名为空，则跳过：
  \`not(is_empty_val(username))\`
- 仅当密码存在且区域为 \`zone1\` 时调用：
  \`iif(is_empty_val(password), false, str_eq(zone, 'zone1'))\`

更多关于 Variform 表达式的信息，请参阅 EMQX 文档。
`,
    en: `A Variform expression to evaluate with a set of pre-bound variables derived from the client information.<br />
**The expression must evaluate to a string value of 'true' for this authenticator to be invoked.**<br />
If the expression evaluates to any other value, this authenticator will be skipped.

Supported variables:
- \`username\`: The username of the client
- \`password\`: The password of the client
- \`clientid\`: The client ID of the client
- \`client_attrs.*\`: The client attributes of the client
- \`cert_common_name\`: The common name (CN) from the client's TLS certificate
- \`cert_subject\`: The subject field from the client's TLS certificate
- \`peersni\`: The SNI (Server Name Indication) sent by TLS client
- \`listener\`: The listener ID (e.g. \`tcp:default\`)
- \`zone\`: The associated config zone.

Examples:
- Only invoke if the client is connected from listener \`ssl:letsencryt\`:
  \`str_eq(listener, 'ssl:letsencryt')\`
- Skip if username is empty:
  \`not(is_empty_val(username))\`
- Only invoke if password exists and zone is 'zone1':
  \`iif(is_empty_val(password), false, str_eq(zone, 'zone1'))\`

Find more information about Variform expressions in EMQX doc.`,
  },
  authzPreconditionDesc: {
    zh: `一个可变形（Variform）的表达式，用于在调用此授权数据源前，根据客户端和授权请求信息进行求值。<br />
如果表达式求值结果不为 \`true\`，则会跳过此授权数据源。

支持的客户端变量：
- \`username\`：客户端用户名
- \`clientid\`：客户端 ID
- \`client_attrs.*\`：客户端自定义属性
- \`cert_common_name\`：客户端 TLS 证书中的 Common Name (CN) 字段
- \`cert_subject\`：客户端 TLS 证书中的 Subject 字段
- \`peersni\`：TLS 客户端发送的 SNI (Server Name Indication)
- \`listener\`：监听器 ID（例如 \`tcp:default\`）
- \`zone\`：关联的配置区域（Zone）

支持的请求变量：
- \`action\`：授权动作，值为 \`publish\` 或 \`subscribe\`
- \`topic\`：正在授权的主题

示例：
- 仅发布授权时调用：
  \`str_eq(action, 'publish')\`
- 仅当主题匹配客户端范围的主题过滤器时调用：
  \`topic_match(topic, topic_join([clientid, '#']))\`
`,
    en: `A Variform expression to evaluate with client and request information before calling this authorization source.<br />
The source is skipped when the expression does not evaluate to \`true\`.

Supported client variables:
- \`username\`: The username of the client
- \`clientid\`: The client ID of the client
- \`client_attrs.*\`: The client attributes of the client
- \`cert_common_name\`: The common name (CN) from the client's TLS certificate
- \`cert_subject\`: The subject field from the client's TLS certificate
- \`peersni\`: The SNI (Server Name Indication) sent by TLS client
- \`listener\`: The listener ID (e.g. \`tcp:default\`)
- \`zone\`: The associated config zone.

Supported request variables:
- \`action\`: The authorization action, either \`publish\` or \`subscribe\`
- \`topic\`: The topic being authorized

Examples:
- Only invoke for publish authorization:
  \`str_eq(action, 'publish')\`
- Only invoke when the topic matches a client-scoped topic filter:
  \`topic_match(topic, topic_join([clientid, '#']))\`
`,
  },
  duplicatedPermission: {
    zh: '存在重复的权限配置',
    en: 'Duplicated permission configuration',
  },
  compatibilityMode: {
    zh: '兼容模式',
    en: 'Compatibility Mode',
  },
  compatibilityModeDesc: {
    zh: "Redis ACL 兼容模式。设置为 `v4` 可接受旧版 ACL 值 `1{'|'}2{'|'}3` 和占位符 `%u/%c`。\n\n- `disabled`（默认）：使用现代格式\n- `v4`：兼容 EMQX 4.x 格式\n  - ACL 值：`1`（订阅）、`2`（发布）、`3`（全部）\n  - 占位符：`%u` → `${'{'}username{'}'}`、`%c` → `${'{'}clientid{'}'}`",
    en: "Redis ACL compatibility mode. Set to `v4` to accept legacy ACL values `1{'|'}2{'|'}3` and placeholders `%u/%c`.\n\n- `disabled` (default): Use modern format\n- `v4`: Compatible with EMQX 4.x format\n  - ACL values: `1` (subscribe), `2` (publish), `3` (all)\n  - Placeholders: `%u` → `${'{'}username{'}'}`, `%c` → `${'{'}clientid{'}'}`",
  },
  compatibilityModeDisabled: {
    zh: '禁用（默认）',
    en: 'Disabled (Default)',
  },
}
