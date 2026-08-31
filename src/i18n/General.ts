export default {
  expireAt: {
    zh: '到期时间',
    en: 'Expire At',
  },
  isEnabled: {
    zh: '是否启用',
    en: 'Is Enabled',
  },
  enabled: {
    zh: '启用',
    en: 'Enabled',
  },
  secret: {
    zh: '密钥',
    en: 'Secret',
  },
  disabled: {
    zh: '不启用',
    en: 'Disabled',
  },
  pleaseEnter: {
    zh: '请输入',
    en: 'Please enter',
  },
  neverExpire: {
    zh: '永不过期',
    en: 'Never expire',
  },
  confirm: {
    zh: '确认信息',
    en: 'Confirm',
  },
  no: {
    zh: '不',
    en: 'NO',
  },
  user: {
    zh: '用户',
    en: 'User',
  },
  username: {
    zh: '用户名',
    en: 'Username',
  },
  editorUser: {
    zh: '编辑用户',
    en: 'Edit',
  },
  creatingUser: {
    zh: '创建用户',
    en: 'Create',
  },
  userScopes: {
    zh: '权限范围',
    en: 'Scopes',
  },
  userScopesPlaceholder: {
    zh: '未选择时，不授予任何权限范围',
    en: 'When empty, grant no scopes',
  },
  useRoleDefaultScopes: {
    zh: '使用角色默认权限',
    en: 'Use Role Default Scopes',
  },
  scopeMode: {
    zh: '权限模式',
    en: 'Permission Mode',
  },
  scopeModeDesc: {
    zh: `选择全局用户的权限配置方式：

- **角色默认权限**：自动使用当前角色的默认权限；以后角色默认权限发生变化时，新权限会自动生效。
- **管理权限范围**：从系统设置、用户管理、API 密钥管理和 SSO 管理中按需选择。
- **自定义受限权限**：从连接、消息发布、数据集成、监控和 MFA 管理等非管理权限范围中按需选择。未选择任何权限时，用户不能访问受权限范围保护的接口。

具体可选择的权限仍受用户角色限制。各角色和所属范围的默认权限如下。`,
    en: `Choose how permissions are assigned to the global user:

- **Role Default Scopes**: Automatically use the current role's defaults. Future changes to the role defaults take effect automatically.
- **Privilege Scopes**: Select System, User Management, API Key Management, and SSO Management scopes as needed. 
- **Custom Restricted Permissions**: Select non-privilege scopes such as Connections, Publish, Data Integration, Monitoring, and MFA Management. When no scope is selected, the user cannot access scope-protected APIs.

Available scopes are still restricted by the user's role. The default scopes for each role and scope are listed below.`,
  },
  scopeModePrivilege: {
    zh: '管理权限范围',
    en: 'Privilege Scopes',
  },
  scopeModeCustom: {
    zh: '自定义受限权限',
    en: 'Custom Restricted Permissions',
  },
  mixedGlobalScopesDesc: {
    zh: '当前权限同时包含管理权限范围和自定义受限权限，全局用户不能使用这种组合。请选择“管理权限范围”“自定义受限权限”或“角色默认权限”后再保存。',
    en: 'The current selection combines privilege and restricted scopes, which is not allowed for global users. Select Privilege Scopes, Custom Restricted Permissions, or Role Default Scopes before saving.',
  },
  mixedGlobalScopesError: {
    zh: '全局用户不能同时选择管理权限范围和自定义受限权限，请重新选择权限模式。',
    en: 'Global users cannot combine privilege and restricted scopes. Select a permission mode again.',
  },
  incompatibleScopesRemoved: {
    zh: '已移除当前角色或所属范围不支持的权限：{scopes}',
    en: 'Removed scopes that are not supported by the current role or Namespace: {scopes}',
  },
  roleDefaultScopes: {
    zh: '角色默认权限',
    en: 'Role Default Scopes',
  },
  noUserScopes: {
    zh: '无权限范围',
    en: 'No Scopes',
  },
  roleDefaultScopesFormDesc: {
    zh: '开启后，命名空间用户会自动获得当前角色的默认权限，以后默认权限发生变化时也会自动生效。关闭后，可以从该角色在命名空间内允许持有的所有权限范围中直接选择。',
    en: "When enabled, the namespace user automatically receives its role's default permissions, including future changes to those defaults. When disabled, select directly from all scopes that the role may hold within a Namespace.",
  },
  userScopesColumnDesc: {
    zh: '权限范围用于限定用户可以访问的功能类别。显示“角色默认权限”表示用户会自动继承当前角色的默认设置；显示具体权限标签表示用户使用显式配置。',
    en: 'Scopes limit which feature areas a user can access. “Role Default Scopes” means the user automatically inherits the defaults of its current role; individual scope tags indicate an explicit configuration.',
  },
  roleDefaultScopesByRoleDesc: {
    zh: `**各角色的默认权限**

- **全局管理员**：连接、消息发布、数据集成、访问控制、网关、监控、集群管理、系统设置、审计日志、License、用户管理、MFA 管理、SSO 管理、API 密钥管理
- **全局查看者**：连接、消息发布、数据集成、访问控制、网关、监控、集群管理、系统设置、审计日志、License
- **命名空间管理员**：连接、监控、数据集成、访问控制、系统设置、集群管理、License、用户管理、API 密钥管理
- **命名空间查看者**：连接、消息发布、数据集成、访问控制、网关、监控、集群管理、系统设置、审计日志、License`,
    en: `**Default permissions by role**

- **Global Administrator**: Connections, Publish, Data Integration, Access Control, Gateways, Monitoring, Cluster, System, Audit Log, License, User Management, MFA Management, SSO Management, and API Key Management
- **Global Viewer**: Connections, Publish, Data Integration, Access Control, Gateways, Monitoring, Cluster, System, Audit Log, and License
- **Namespace Administrator**: Connections, Monitoring, Data Integration, Access Control, System, Cluster, License, User Management, and API Key Management
- **Namespace Viewer**: Connections, Publish, Data Integration, Access Control, Gateways, Monitoring, Cluster, System, Audit Log, and License`,
  },
  roleDefaultScopesRestrictionDesc: {
    zh: '上述权限范围决定用户可访问的功能类别；具体可执行的操作和可查看的数据，仍受角色和命名空间限制。',
    en: "These permissions determine which feature areas the user can access. The allowed operations and visible data are still restricted by the user's role and Namespace.",
  },
  userScopesAdminOnlyTip: {
    zh: '仅管理员可持有此权限范围',
    en: 'Only administrators may hold this scope',
  },
  source: {
    zh: '来源',
    en: 'Source',
  },
  local: {
    zh: '本地',
    en: 'Local',
  },
  admin: {
    zh: '管理员',
    en: 'Administrator',
  },
  adminDesc: {
    zh: '拥有对 EMQX 所有功能和资源的完全管理访问权限，包括客户端管理、系统配置、API 密钥以及用户管理。',
    en: 'Has full access to manage all features and resources of EMQX, including client management, system configuration, API key and user management.',
  },
  viewer: {
    zh: '查看者',
    en: 'Viewer',
  },
  viewerDesc: {
    zh: '可以访问 EMQX 的所有数据和配置信息，但无权进行创建、修改和删除操作。',
    en: 'Can access all data and configuration of EMQX, but has no rights to create, modify or delete.',
  },
  password: {
    zh: '密码',
    en: 'Password',
  },
  newPassword: {
    zh: '新密码',
    en: 'New password',
  },
  confirmPassword: {
    zh: '确认新密码',
    en: 'Confirm password',
  },
  changePassword: {
    zh: '修改密码',
    en: 'Change Password',
  },
  confirmNotMatch: {
    zh: '两次输入密码不一致',
    en: "Two inputs don't match!",
  },
  noSameNewPwd: {
    zh: '新密码不能与旧密码相同',
    en: 'The new and old passwords cannot be the same',
  },
  enterOneUserName: {
    zh: '请输入用户名',
    en: 'Please enter username',
  },
  usernameFormatError: {
    zh: '用户名仅支持字母、数字和下划线',
    en: 'Only letters, numbers, and underscores are allowed',
  },
  pleaseEnterPassword: {
    zh: '请输入密码',
    en: 'Password is required',
  },
  pleaseEnterNewPassword: {
    zh: '请输入新密码',
    en: 'Please enter new password',
  },
  pleaseEnterAConfirmationPassword: {
    zh: '请输入确认密码',
    en: 'Please enter confirm password.',
  },
  createUserSuccess: {
    zh: '创建用户成功',
    en: 'Create User Successfully',
  },
  changePassSuccess: {
    zh: '修改密码成功',
    en: 'Changing Password Successfully',
  },
  passwordRequirement1: {
    zh: '密码长度必须为 8～64 个字符',
    en: 'The password must be 8 to 64 characters in length',
  },
  passwordRequirement2: {
    zh: '至少包含字母、数字、符号中的两种',
    en: 'Should be a combination of letters, numbers, or symbols',
  },
  semicolon: {
    zh: '；',
    en: '; ',
  },
  confirmDeleteUser: {
    zh: '确认删除该用户?',
    en: 'Confirm to delete the user?',
  },
  confirmReset: {
    zh: '确认重置?',
    en: 'Confirm to reset',
  },
  determineToDeleteTheBannedClient: {
    zh: '确认解除该黑名单？',
    en: 'Confirm to unban this banned client?',
  },
  createBannedClientSuccess: {
    zh: '禁用该客户端成功',
    en: 'Successfully banned this client.',
  },
  who: {
    zh: '禁用值',
    en: 'Value',
  },
  as: {
    zh: '禁用属性',
    en: 'Property',
  },
  reason: {
    zh: '原因',
    en: 'Reason',
  },
  banObject: {
    zh: '禁用对象',
    en: 'Banned Object',
  },
  until: {
    zh: '到期时间',
    en: 'Expire At',
  },
  enterWho: {
    zh: '请输入禁用值',
    en: 'Please enter Banned value',
  },
  day: {
    zh: '天',
    en: 'day|days',
  },
  hour: {
    zh: '小时',
    en: 'hour|hours',
  },
  min: {
    zh: '分钟',
    en: 'minute|minutes',
  },
  sec: {
    zh: '秒',
    en: 'second|seconds',
  },
  ms: {
    zh: '毫秒',
    en: 'millisecond|milliseconds',
  },
  us: {
    zh: '微秒',
    en: 'microsecond|microseconds',
  },
  ns: {
    zh: '纳秒',
    en: 'nanosecond|nanoseconds',
  },
  timeEarlierError: {
    zh: '所选时间不能早于当前时间',
    en: 'The selected time cannot be earlier than the current time',
  },
  flappingByClientId: {
    zh: '按客户端 ID 检测',
    en: 'Detect by Client ID',
  },
  flappingByClientIdDesc: {
    zh: '按客户端 ID 检测连接抖动，并临时封禁达到检测阈值的客户端 ID。',
    en: 'Detect flapping by client ID and temporarily ban offending client IDs.',
  },
  flappingByUsername: {
    zh: '按用户名检测',
    en: 'Detect by Username',
  },
  flappingByUsernameDesc: {
    zh: '按用户名检测连接抖动，并临时封禁达到检测阈值的用户名。',
    en: 'Detect flapping by username and temporarily ban offending usernames.',
  },
  flappingByPeerhost: {
    zh: '按源 IP 地址检测',
    en: 'Detect by Source IP Address',
  },
  flappingByPeerhostDesc: {
    zh: '按源 IP 地址检测连接抖动，并临时封禁达到检测阈值的源 IP 地址。',
    en: 'Detect flapping by source IP address and temporarily ban offending addresses.',
  },
  clearAll: {
    zh: '清除全部',
    en: 'Clear All',
  },
  clearAllBannedConfirm: {
    zh: '是否确定要清除全部黑名单？',
    en: 'Confirm to clear all banned clients?',
  },
  ssoEnabled: {
    zh: '已启用',
    en: 'Enabled',
  },
  ssoDisabled: {
    zh: '未启用',
    en: 'Disabled',
  },
  SSOEnable: {
    zh: '启用 {backend} SSO',
    en: 'Enable {backend} SSO',
  },
  forceMFA: {
    zh: '强制启用 MFA',
    en: 'Force MFA',
  },
  forceMFADesc: {
    zh: '开启后，通过该 SSO 后端登录的用户需要设置或验证 MFA。若管理员曾为某个用户停用 MFA，该用户不会受此配置影响；需重新为该用户启用 MFA 后才会生效。',
    en: 'When enabled, users signing in through this SSO backend must set up or verify MFA. If MFA was previously disabled for a user by an administrator, this setting will not apply to that user until MFA is re-enabled for them.',
  },
  baseDN: {
    zh: '基本 DN',
    en: 'Base DN',
  },
  LDAPFilter: {
    zh: '用户查询条件',
    en: 'User Lookup Filter',
  },
  LDAPFilterDesc: {
    zh: "LDAP 中匹配用户的过滤器,默认为 `(& (objectClass=person) (uid={'$'}{'{'}username{'}'}))`。<br />对于Active Directory,默认应设置为 `(&(objectClass=user)(sAMAccountName={'$'}{'{'}username{'}'}))`，详见 [LDAP 过滤器](https://ldap.com/ldap-filters/)。",
    en: "The filter for matching users in LDAP is by default `(&(objectClass=person)(uid={'$'}{'{'}username{'}'}))`.<br />For Active Directory, it should be set to `(&(objectClass=user)(sAMAccountName={'$'}{'{'}username{'}'}))` by default. Please refer to [LDAP Filters](https://ldap.com/ldap-filters/) for more details.",
  },
  dashboardAddr: {
    zh: 'Dashboard 地址',
    en: 'Dashboard Address',
  },
  dashboardAddrDesc: {
    zh: '确保用户能够访问 Dashboard 的实际访问地址。',
    en: 'Ensure users can access the actual URL of the Dashboard.',
  },
  idpMetadataUrl: {
    zh: 'SAML 元数据 URL',
    en: 'SAML Metadata URL',
  },
  idpSignsAssertions: {
    zh: 'IdP 签名断言（Assertion）',
    en: 'Signed Assertions from IDP',
  },
  idpSignsAssertionsDesc: {
    zh: '是否要求 IdP 对 SAML 断言进行签名。对于安全性考虑，生产环境中至少需要启用 IdP 签名断言（Assertion）或 IdP 签名响应（Envelope） 中的一个。',
    en: 'Whether to require IdP to sign SAML Assertions (inner signature). For security, at least one of Signed Assertions from IdP or Signed Response Envelopes from IdP should be enabled in production.',
  },
  idpSignsEnvelopes: {
    zh: 'IdP 签名响应（Envelope）',
    en: 'Signed Response Envelopes from IdP',
  },
  idpSignsEnvelopesDesc: {
    zh: '是否要求 IdP 对 SAML 响应（Envelope）进行签名。对于安全性考虑，生产环境中至少需要启用 IdP 签名断言（Assertion）或 IdP 签名响应（Envelope） 中的一个。',
    en: 'Whether to require IdP to sign SAML Response envelopes (outer signature). For security, at least one of Signed Assertions from IdP or Signed Response Envelopes from IdP should be enabled in production.',
  },
  spSignRequest: {
    zh: 'SP 请求签名',
    en: 'SP Request Signing',
  },
  spSignRequestDesc: {
    zh: '对 Dashboard 和身份提供商(IdP)之间的请求消息进行签名以提高安全性。',
    en: 'Signing the request messages between the Dashboard and the Identity Provider (IdP) to improve security.',
  },
  spPublicKey: {
    zh: 'SP 公钥',
    en: 'SP Public Key',
  },
  spPrivateKey: {
    zh: 'SP 私钥',
    en: 'SP Private Key',
  },
  infoIdPDesc: {
    zh: '配置服务提供商(IdP)所需信息',
    en: 'Information required to configure the identity provider (IdP)',
  },
  ssoUrl: {
    zh: '单点登录地址',
    en: 'SSO Address',
  },
  metaDataUrl: {
    zh: '元数据地址',
    en: 'Metadata Address',
  },
  issuer: {
    zh: '签发者 URL',
    en: 'Issuer URL',
  },
  scopes: {
    zh: 'Scopes',
    en: 'Scopes',
  },
  scopesDesc: {
    zh: "指定请求的 OAuth 2.0 scope 列表，`openid` 为必填项。若要在用户名变量中使用 `{'$'}{'{'}name{'}'}`、`{'$'}{'{'}given_name{'}'}`、`{'$'}{'{'}family_name{'}'}` 等 profile 字段，需额外添加 `profile`。",
    en: "Specify the list of OAuth 2.0 scopes to request. `openid` is required. To use profile claims such as `{'$'}{'{'}name{'}'}`, `{'$'}{'{'}given_name{'}'}`, or `{'$'}{'{'}family_name{'}'}` in the username variable, also add `profile`.",
  },
  nameVar: {
    zh: '用户名变量',
    en: 'Username Variable',
  },
  nameVarDesc: {
    zh: "用于将 OIDC 用户信息字段映射为 Dashboard 用户名的模板。使用 {'$'}{'{'}字段名{'}'} 语法引用数据源中的字段（如 `{'$'}{'{'}sub{'}'}`、`{'$'}{'{'}email{'}'}`、`{'$'}{'{'}name{'}'}`），也可以组合多个字段，例如 `{'$'}{'{'}name{'}'}-{'$'}{'{'}sub{'}'}`。默认值为 `{'$'}{'{'}sub{'}'}`。<br />注意：`{'$'}{'{'}name{'}'}`、`{'$'}{'{'}given_name{'}'}`、`{'$'}{'{'}family_name{'}'}` 等字段属于 `profile` scope，使用时需在 Scopes 中添加 `profile`。",
    en: "A template that maps OIDC user information fields to the Dashboard username. Use {'$'}{'{'}field{'}'} syntax to reference fields from the data source (e.g., `{'$'}{'{'}sub{'}'}`, `{'$'}{'{'}email{'}'}`, `{'$'}{'{'}name{'}'}`). Multiple fields can be combined, for example `{'$'}{'{'}name{'}'}-{'$'}{'{'}sub{'}'}`. Defaults to `{'$'}{'{'}sub{'}'}`.<br />Note: Fields such as `{'$'}{'{'}name{'}'}`, `{'$'}{'{'}given_name{'}'}`, and `{'$'}{'{'}family_name{'}'}` belong to the `profile` scope. Make sure to add `profile` to Scopes when using them.",
  },
  nameVarSource: {
    zh: '用户名变量来源',
    en: 'Username Variable Source',
  },
  nameVarSourceDesc: {
    zh: '指定从哪个来源提取用户信息以构建 Dashboard 用户名<br />用户信息端点：使用 `/userinfo` 端点的响应<br />ID Token：使用访问令牌中的声明',
    en: 'Specify from which source to extract information to construct the Dashboard username<br />User Info Endpoint: Utilizes the response from the `/userinfo` endpoint<br />ID Token: Utilizes the claims contained in the access token',
  },
  nameVarSourceUserinfo: {
    zh: '用户信息端点',
    en: 'User Info Endpoint',
  },
  nameVarSourceIdToken: {
    zh: 'ID Token',
    en: 'ID Token',
  },
  roleSource: {
    zh: '角色来源',
    en: 'Role Source',
  },
  roleSourceDesc: {
    zh: '指定从哪个来源提取信息以构建 Dashboard 用户角色<br />用户信息端点：使用 `/userinfo` 端点的响应<br />ID Token：使用访问令牌中的声明',
    en: 'Specify from which source to extract information to construct the Dashboard user role<br />User Info Endpoint: Utilizes the response from the `/userinfo` endpoint<br />ID Token: Utilizes the claims contained in the access token',
  },
  roleExpr: {
    zh: '角色表达式',
    en: 'Role Expression',
  },
  roleExprDesc: {
    zh: '用于构建 Dashboard 用户角色的 jq 表达式，必须返回一个有效角色字符串：`viewer` 或 `administrator`。若未设置，将创建 `viewer` 用户，或保留已有用户的角色。',
    en: 'A jq expression to construct the Dashboard user role. Must return exactly one of: `viewer` or `administrator`. If not set, will create a `viewer` user or retain the existing role.',
  },
  namespaceSource: {
    zh: '命名空间来源',
    en: 'Namespace Source',
  },
  namespaceSourceDesc: {
    zh: '指定从哪个来源提取信息以构建 Dashboard 用户命名空间<br />用户信息端点：使用 `/userinfo` 端点的响应<br />ID Token：使用访问令牌中的声明',
    en: 'Specify from which source to extract information to construct the Dashboard user namespace<br />User Info Endpoint: Utilizes the response from the `/userinfo` endpoint<br />ID Token: Utilizes the claims contained in the access token',
  },
  namespaceExpr: {
    zh: '命名空间表达式',
    en: 'Namespace Expression',
  },
  namespaceExprDesc: {
    zh: '用于构建 Dashboard 用户命名空间的 jq 表达式，必须返回一个已有命名空间名称字符串，或 null（表示全局命名空间）。若未设置，将在全局命名空间下创建用户，或保留已有用户的命名空间。',
    en: 'A jq expression to construct the Dashboard user namespace. Must return a string with an existing namespace name, or null for the global namespace. If not set, will create a user in the global namespace or retain the existing namespace.',
  },
  sessionExpiry: {
    zh: '会话过期',
    en: 'Session Expiry',
  },
  requirePkce: {
    zh: '开启 PKCE',
    en: 'Enable PKCE',
  },
  signInRedirectUri: {
    zh: '登录重定向地址',
    en: 'Sign-in Redirect URI',
  },
  preferredAuthMethods: {
    zh: '首选认证方法',
    en: 'Preferred Authentication Methods',
  },
  provider: {
    zh: '提供商',
    en: 'Provider',
  },
  generic: {
    zh: '通用',
    en: 'Generic',
  },
  fallbackMethods: {
    zh: '备用方法',
    en: 'Fallback Methods',
  },
  JWK: {
    zh: 'JSON Web 密钥',
    en: 'JSON Web Key (JWK)',
  },
  publisher: {
    zh: '消息发布者',
    en: 'Publisher',
  },
  sourceType: {
    zh: '操作方式',
    en: 'Source Type',
  },
  auditLogDesc: {
    zh: '审计日志功能可以记录对 EMQX 集群的关键操作，以满足企业在合规性和数据安全方面的需求。',
    en: 'The audit log feature records critical operations on the EMQX cluster to meet enterprise requirements for compliance and data security.',
  },
  httpFilterParamsDesc: {
    zh: 'Dashboard/REST API 筛选条件',
    en: 'Dashboard/REST API Filter',
  },
  timeRangeError: {
    zh: '起始时间不得晚于结束时间',
    en: 'Start time cannot be later than end time',
  },
  opSource: {
    zh: '操作者',
    en: 'Operator',
  },
  operationResult: {
    zh: '操作结果',
    en: 'Operation Result',
  },
  opName: {
    zh: '操作名称',
    en: 'Operation Name',
  },
  opTime: {
    zh: '操作时间',
    en: 'Operation Time',
  },
  info: {
    zh: '信息',
    en: 'Info',
  },
  console: {
    zh: '控制台',
    en: 'Erlang Console',
  },
  event: {
    zh: '事件',
    en: 'Event',
  },
  filename: {
    zh: '文件名称',
    en: 'File Name',
  },
  createdAt: {
    zh: '创建时间',
    en: 'Created At',
  },
  fileSize: {
    zh: '文件大小',
    en: 'File Size',
  },
  restore: {
    zh: '恢复',
    en: 'Restore',
  },
  upload: {
    zh: '上传',
    en: 'Upload',
  },
  createBackupSuccess: {
    zh: '成功创建当前备份',
    en: 'Successfully created current backup',
  },
  uploadSuccess: {
    zh: '上传成功',
    en: 'Upload successfully',
  },
  confirmRestore: {
    zh: '确认使用当前备份恢复?',
    en: 'Confirm to restore with current backup?',
  },
  confirmNamespaceRestore: {
    zh: '确认使用当前备份恢复命名空间 {namespace}？',
    en: 'Restore namespace {namespace} from this backup?',
  },
  allowSecurityProfileMismatch: {
    zh: '允许安全配置文件不匹配',
    en: 'Allow Security Profile Mismatch',
  },
  securityProfileMismatchWarning: {
    zh: '将 legacy 或旧版备份恢复到 hardened 节点后，监听器可访问性、客户端认证、Dashboard 登录以及认证或授权故障的处理方式可能发生变化。请仅在审查并接受这些风险后启用此选项。',
    en: 'Restoring a legacy or older backup to a hardened node may change listener accessibility, client authentication, Dashboard login, and authentication or authorization failure handling. Enable this option only after reviewing and accepting these risks.',
  },
  restoreSuccess: {
    zh: '恢复成功',
    en: 'Restore successfully',
  },
  namespaceRestoreSuccess: {
    zh: '备份已成功恢复至命名空间 {namespace}。',
    en: 'Backup restored to namespace {namespace} successfully.',
  },
  namespaceUploadSuccess: {
    zh: '备份已成功上传至命名空间 {namespace}。',
    en: 'Backup uploaded to namespace {namespace} successfully.',
  },
  namespaceBackupOperationTip: {
    zh: '当前正在管理命名空间 {namespace} 的备份。上传、下载、删除和恢复操作将作用于此命名空间。',
    en: 'You are managing backups for namespace {namespace}. Upload, download, delete, and restore operations apply to this namespace.',
  },
  clearAllRetainedConfirm: {
    zh: '是否确定要清除全部保留消息？',
    en: 'Confirm to clear all retained messages?',
  },
  pleaseUploadFile: {
    zh: '请先上传文件',
    en: 'Please upload file first',
  },
  enableForceShutdown: {
    zh: '启用强制关闭',
    en: 'Enable Force Shutdown',
  },
  enableForceShutdownDesc: {
    zh: '启用 <code>force_shutdown</code>（强制关闭）功能，当进程堆内存或邮箱大小超过设定值时强制关闭进程',
    en: 'Enable <code>force_shutdown</code> feature. Process will be forcibly shutdown when heap memory or mailbox size exceeds the set value',
  },
  maxHeapSize: {
    zh: '最大堆内存',
    en: 'Max Heap Size',
  },
  maxHeapSizeDesc: {
    zh: "进程的最大堆内存大小。如果启用了强制关闭功能，超过此限制的进程将自动退出或被强制终止。进程消息队列（邮箱）中的消息也是堆的一部分。进程关闭可分为以下两种情况：\n- 进程在运行时主动检查当前堆大小，发现超出限制后主动退出\n- 底层调度系统在为进程执行垃圾回收后检查当前堆大小，发现超出限制后强制终止进程\n\n注意：上述两种情况产生的错误日志会有所不同。前者生成的日志类似于 <code>...errorContext: connection_shutdown, reason: {'#'}{'{'}max => 2097152, reason => proc_heap_too_large, value => 2787348{'}'}..</code>，后者生成的日志类似于 <code>...Context: maximum heap size reached...</code>。",
    en: "The maximum heap size of the process. If the force_shutdown is enabled, processes that exceed this limit will automatically exit or be forcibly killed. Messages in the process message queue (mailbox) are also part of the heap. The shutdown of a process can be divided into the following two situations:\n- The process actively checks the current heap size during its own operation, and actively exits after finding that it exceeds the limit.\n- The underlying scheduling system checks the current heap size after performing garbage collection for the process, and forcibly kills the process after finding that it exceeds the limit.\n\nNote: The Error logs generated by the above two will be different. The log generated by the former is similar to <code>...errorContext: connection_shutdown, reason: {'#'}{'{'}max => 2097152, reason => proc_heap_too_large, value => 2787348{'}'}..</code>, and the log generated by the latter is similar to <code>...Context: maximum heap size reached...</code>.",
  },
  maxMailboxSize: {
    zh: '最大邮箱大小',
    en: 'Max Mailbox Size',
  },
  maxMailboxSizeDesc: {
    zh: 'EMQX 为每个客户端连接创建至少一个轻量级进程。每个进程都有自己的消息队列（邮箱）来保存来自其他进程（如 MQTT 消息）的消息，以便进程可以随时从消息队列（邮箱）中读取消息。如果系统繁忙或进程因繁忙的套接字而挂起，消息队列可能会积累大量消息。为避免过度使用内存，当进程的消息队列长度超过此值时，EMQX 将强制关闭该进程。',
    en: 'EMQX creates at least one lightweight process for each client connection. Each process has its own message queue (aka mailbox) to hold messages from other processes (e.g. MQTT messages) so that the process can read messages from the message queue (mailbox) at any time. If the system is busy or the process hangs due to a busy socket (see <code>high_watermark</code>), the message queue can accumulate many messages. To avoid excessive memory usage, EMQX will force a process to shut down when the length of its message queue exceeds <code>max_mailbox_size</code>.',
  },
  version: {
    zh: '版本号',
    en: 'Version',
  },
  availableVersions: {
    zh: '适用版本',
    en: 'Available Versions',
  },
  buildDate: {
    zh: '构建日期',
    en: 'Build Date',
  },
  upgradePackageUpload: {
    zh: '升级包上传',
    en: 'Upgrade Package Upload',
  },
  currentVersion: {
    zh: '当前版本',
    en: 'Current Version',
  },
  upgradeRecords: {
    zh: '升级记录',
    en: 'Upgrade Records',
  },
  packageTip: {
    zh: '请上传 EMQ 支持人员提供的 .tar.gz 格式的升级包',
    en: 'Please upload the .tar.gz upgrade package provided by EMQ support',
  },
  selectUpgradePackage: {
    zh: '选择升级包',
    en: 'Select Upgrade Package',
  },
  upgradePackageInfo: {
    zh: '升级包信息',
    en: 'Upgrade Package Information',
  },
  startUpgrade: {
    zh: '开始升级',
    en: 'Start Upgrade',
  },
  uploadPackageTip: {
    zh: '暂无升级包，请先上传。',
    en: 'No upgrade package available, please upload first.',
  },
  packageRequired: {
    zh: '请先上传升级包',
    en: 'Please upload upgrade package first',
  },
  deleteAndReUpload: {
    zh: '删除并重新上传',
    en: 'Delete and Re-upload',
  },
  confirmDeleteAndReUpload: {
    zh: '确认删除并重新上传？',
    en: 'Confirm to delete and re-upload?',
  },
  startedAt: {
    zh: '开始时间',
    en: 'Started At',
  },
  finishedAt: {
    zh: '结束时间',
    en: 'Finished At',
  },
  fromVsn: {
    zh: '升级前版本',
    en: 'From Version',
  },
  targetVsn: {
    zh: '升级后版本',
    en: 'Target Version',
  },
  upgradeOpts: {
    zh: '升级选项',
    en: 'Upgrade Options',
  },
  idle: {
    zh: '空闲',
    en: 'Idle',
  },
  upgrading: {
    zh: '升级中',
    en: 'Upgrading',
  },
  finished: {
    zh: '已完成',
    en: 'Finished',
  },
  packageConfirm: {
    zh: '确认升级包信息：',
    en: 'Confirm the upgrade package information:',
  },
  packageCheckCode: {
    zh: '文件校验码',
    en: 'Package Check Code',
  },
  updateLog: {
    zh: '更新日志',
    en: 'Update Log',
  },
  upgradeWarning: {
    zh: `1. 请务必使用 EMQ 支持人员提供的升级包，并在其指导下进行升级。 
2. 升级前，请备份重要数据。
3. 在升级过程中，请勿进行其他操作。`,
    en: `1. Be sure to use the upgrade package provided by EMQ support and upgrade under their guidance. 
2. Backup important data before upgrading. 
3. Do not perform other operations during the upgrade process.`,
  },
  upgradeConfirm: {
    zh: '我已确认以上信息',
    en: 'I have confirmed the above information',
  },
  selectPackageRequired: {
    zh: '请选择升级包',
    en: 'Please select upgrade package',
  },
  confirmUpgradeRequired: {
    zh: '请确认信息并勾选已确认',
    en: 'Please confirm the information and check the confirmation box',
  },
  interval: {
    en: 'Interval',
    zh: '时间间隔',
  },
  tokenLength: {
    en: 'Token Length',
    zh: '令牌长度',
  },
  mfaSettings: {
    en: 'MFA Settings',
    zh: 'MFA 设置',
  },
  currentMFA: {
    en: 'Current MFA',
    zh: '当前 MFA',
  },
  totpLabel: {
    en: 'TOTP (Authenticator App)',
    zh: 'TOTP (认证器应用)',
  },
  resetTOTPSecret: {
    en: 'Reset TOTP Secret Key',
    zh: '重置 TOTP 密钥',
  },
  confirmResetTOTPSecret: {
    en: 'After resetting, the previous TOTP secret key will be invalid, and the user will set up a new TOTP secret key in the next login. Confirm to reset?',
    zh: '重置后，之前的 TOTP 密钥将失效，用户将在下次登录时，设置新的 TOTP 密钥，确认重置？',
  },
  disableMFA: {
    en: 'Disable MFA',
    zh: '停用 MFA',
  },
  confirmDisableMFA: {
    en: 'Disabling MFA may affect account security, confirm to disable?',
    zh: '禁用 MFA 可能影响账户安全，确认禁用？',
  },
  disableMFAForbiddenBySSO: {
    en: 'MFA cannot be disabled because force MFA is enabled in the current SSO configuration.',
    zh: '当前无法停用 MFA，因为当前类型单点登录配置启用了强制 MFA。',
  },
  enableMFA: {
    en: 'Enable MFA',
    zh: '启用 MFA',
  },
  enableMAFTip: {
    en: 'After enabling, the user will set up TOTP secret key in the next login.',
    zh: '启用后，用户将在下次登录时，设置 TOTP 密钥。',
  },
  currentEnableUserMFATip: {
    en: 'After enabling, the user will be logged out immediately and set up TOTP secret key in the next login.',
    zh: '启用后，将立即退出登录，进行 TOTP 设置。',
  },
  ssoMFASettingsTip: {
    en: 'For SSO users, Dashboard currently supports disabling MFA only. Re-enabling MFA depends on the SSO login flow and backend force_mfa policy.',
    zh: '对于 SSO 用户，Dashboard 当前仅支持禁用 MFA。重新启用 MFA 依赖 SSO 登录流程和后端的 force_mfa 策略。',
  },
  mfa: {
    en: 'Multi-Factor Authentication',
    zh: '多因素认证',
  },
  twoFASecretSetupTip: {
    en: 'Please scan the QR code or enter the {key} in the app to complete the setup.',
    zh: '请扫描二维码或输入{key}在应用中完成设置。',
  },
  setupKey: {
    en: 'setup key',
    zh: '设置密钥',
  },
  authenticationCode: {
    en: 'Authentication Code',
    zh: '认证码',
  },
  verifyCode: {
    en: 'Verify the code from the app',
    zh: '验证应用中的认证码',
  },
  enterCode: {
    en: 'Enter the authentication code',
    zh: '输入认证码',
  },
  authenticationCodeError: {
    en: 'Please enter a valid authentication code',
    zh: '请输入格式正确的认证码',
  },
  confirmSetupKey: {
    en: 'Please confirm that the setup key has been saved in the app',
    zh: '请确认已将密钥保存在应用中',
  },
  userInfoError: {
    en: 'Username or password or authentication code error',
    zh: '用户名或密码或认证码错误',
  },
  loginLockedMsg: {
    en: 'Your account has been locked due to multiple failed login attempts. Please get in touch with the administrator for assistance or try again later.',
    zh: '账户因多次登录失败而被锁定。请与管理员联系以获取帮助，或稍后重试。',
  },
}
