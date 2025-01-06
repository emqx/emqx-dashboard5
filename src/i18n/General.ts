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
    zh: '分',
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
  enableFlapping: {
    zh: '启用抖动检测',
    en: 'Enable Flapping Detection',
  },
  enableFlappingDesc: {
    zh: '启用连接抖动的检测功能',
    en: 'Enable connection flapping detection feature',
  },
  windowTime: {
    zh: '检测时间窗口',
    en: 'Detection Time Window',
  },
  windowTimeDesc: {
    zh: '进行连接抖动检测时的时间窗口长度',
    en: 'The length of time window for flapping detection',
  },
  maxCount: {
    zh: '最大断连次数',
    en: 'Max Disconnection Count',
  },
  maxCountDesc: {
    zh: '在一个检测时间窗口内，MQTT 连接客户端被允许的最大断连次数',
    en: 'Maximum allowed number of disconnections for an MQTT client within a specified detection time window.',
  },
  banTime: {
    zh: '封禁时长',
    en: 'Ban Duration',
  },
  banTimeDesc: {
    zh: '抖动的连接客户端 ID 将被封禁的时长',
    en: 'The duration for which the flapping Client ID will be banned',
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
  baseDN: {
    zh: '基本 DN',
    en: 'Base DN',
  },
  LDAPFilter: {
    zh: '用户查询条件',
    en: 'User Lookup Filter',
  },
  LDAPFilterDesc: {
    zh: "LDAP 中匹配用户的过滤器,默认为 `(& (objectClass=person) (uid=${'{'}username{'}'}))`。<br />对于Active Directory,默认应设置为 `(&(objectClass=user)(sAMAccountName=${'{'}username{'}'}))`，详见 [LDAP 过滤器](https://ldap.com/ldap-filters/)。",
    en: "The filter for matching users in LDAP is by default `(&(objectClass=person)(uid=${'{'}username{'}'}))`.<br />For Active Directory, it should be set to `(&(objectClass=user)(sAMAccountName=${'{'}username{'}'}))` by default. Please refer to [LDAP Filters](https://ldap.com/ldap-filters/) for more details.",
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
  nameVar: {
    zh: '名称变量',
    en: 'Name Variable',
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
  restoreSuccess: {
    zh: '恢复成功',
    en: 'Restore successfully',
  },
  clearAllRetainedConfirm: {
    zh: '是否确定要清除全部保留消息？',
    en: 'Confirm to clear all retained messages?',
  },
  pleaseUploadFile: {
    zh: '请先上传文件',
    en: 'Please upload file first',
  },
  enableDurableSessions: {
    zh: '启用会话持久化',
    en: 'Enable Durable Sessions',
  },
  enableDurableSessionsDesc: {
    zh: '暂不支持通过热配置修改，请在配置文件中设置 `durable_sessions.enable = true｜false` 以启用或禁用。启用后，客户端的会话数据将会被持久存储，即使服务器重启也能够进行恢复。',
    en: "Not supported by hot config, please set `durable_sessions.enable = true｜false` in config file to enable or disable. If enabled, the client's session data will be durable and can be restored even if the server is restarted.",
  },
  batchSize: {
    zh: '消息查询批大小',
    en: 'Message Query Batch Size',
  },
  batchSizeDesc: {
    zh: '持久会话以批量方式查询已保存的消息，这个值指定了批处理的大小。注意：较大的批次通常会提高系统的吞吐量和整体性能，但会增加每个客户端的内存使用量。',
    en: 'The persistent session queries stored messages in a batch; this value specifies the size of the batch. Note: larger batches generally improve the throughput and overall performance of the system, but increase RAM usage per client.',
  },
  idlePollInterval: {
    zh: '空闲轮询间隔',
    en: 'Idle Poll Interval',
  },
  idlePollIntervalDesc: {
    zh: '当客户端空闲时（飞行窗口为空），以这个时间间隔内轮询持久存储，以查询新消息并将其发送给客户端。',
    en: 'When the client is idle (the flight window is empty), it polls the durable storage at this interval to query for new messages and deliver them to the client.',
  },
  lastAliveUpdateInterval: {
    zh: '会话心跳间隔',
    en: 'Session Heartbeat Interval',
  },
  lastAliveUpdateIntervalDesc: {
    zh: '以设置的时间间隔，持续更新会话最后一次存活的时间戳。当会话非正常终止（例如，EMQX 节点以 kill -9 终止），会话垃圾回收器将根据会话最后存活时间计算过期时间，并销毁过期离线会话。',
    en: 'At the configured interval, continuously update the timestamp of the last session alive. When a session terminates abnormally (e.g., when an EMQX node is terminated with kill -9), the session garbage collector will calculate the expiration time based on the last session alive timestamp and destroy expired offline sessions.',
  },
  sessionGcInterval: {
    zh: '会话垃圾回收间隔',
    en: 'Session GC Interval',
  },
  sessionGcIntervalDesc: {
    zh: '会话垃圾回收的时间间隔。',
    en: 'The interval at which session garbage collection is executed for persistent sessions.',
  },
  sessionGcBatchSize: {
    zh: '会话垃圾回收批大小',
    en: 'Session GC Batch Size',
  },
  sessionGcBatchSizeDesc: {
    zh: '过期会话垃圾回收批处理大小。',
    en: 'The size of each batch of expired persistent sessions to be garbage collected per iteration.',
  },
  messageRetentionPeriod: {
    zh: '消息保留时长',
    en: 'Message Retention Period',
  },
  messageRetentionPeriodDesc: {
    zh: '持久会话中消息保留时长，超期的消息不会发送到订阅者。',
    en: 'The duration of message retention in a persistent session,  messages that expire are not delivered to subscribers.',
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
    zh: '进程的最大堆内存大小。如果启用了强制关闭功能，超过此限制的进程将自动退出或被强制终止。进程消息队列（邮箱）中的消息也是堆的一部分。进程关闭可分为以下两种情况：\n- 进程在运行时主动检查当前堆大小，发现超出限制后主动退出\n- 底层调度系统在为进程执行垃圾回收后检查当前堆大小，发现超出限制后强制终止进程\n\n注意：上述两种情况产生的错误日志会有所不同。前者生成的日志类似于 <code>...errorContext: connection_shutdown, reason: #{max => 2097152, reason => proc_heap_too_large, value => 2787348}..</code>，后者生成的日志类似于 <code>...Context: maximum heap size reached...</code>。',
    en: 'The maximum heap size of the process. If the force_shutdown is enabled, processes that exceed this limit will automatically exit or be forcibly killed. Messages in the process message queue (mailbox) are also part of the heap. The shutdown of a process can be divided into the following two situations:\n- The process actively checks the current heap size during its own operation, and actively exits after finding that it exceeds the limit.\n- The underlying scheduling system checks the current heap size after performing garbage collection for the process, and forcibly kills the process after finding that it exceeds the limit.\n\nNote: The Error logs generated by the above two will be different. The log generated by the former is similar to <code>...errorContext: connection_shutdown, reason: #{max => 2097152, reason => proc_heap_too_large, value => 2787348}..</code>, and the log generated by the latter is similar to <code>...Context: maximum heap size reached...</code>.',
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
}
