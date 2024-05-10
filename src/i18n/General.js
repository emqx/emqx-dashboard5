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
  'banned-clients': {
    zh: '黑名单',
    en: 'Banned Clients',
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
  enableSessionPersistence: {
    zh: '启用会话持久化',
    en: 'Enable Session Persistence',
  },
  enableSessionPersistenceDesc: {
    zh: '暂不支持通过热配置修改，请在配置文件中设置 `session_persistence.enable = true｜false` 以启用或禁用。启用后，客户端的会话数据将会被持久存储，即使服务器重启也能够进行恢复。',
    en: "Not supported by hot config, please set `session_persistence.enable = true｜false` in config file to enable or disable. If enabled, the client's session data will be durable and can be restored even if the server is restarted.",
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
    en: 'Session heartbeat interval',
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
}
