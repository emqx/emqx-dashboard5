export default {
  confirmDelete: {
    zh: '确认删除应用?',
    en: 'Confirm delete?',
  },
  application: {
    zh: '应用',
    en: 'Application',
  },
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
  createApp: {
    zh: '创建应用',
    en: 'Create App',
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
    en: 'Users',
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
  clearAllRetainedConfirm: {
    zh: '是否确定要清除全部保留消息？',
    en: 'Confirm to clear all retained messages?',
  },
  enableSessionPersistence: {
    zh: '启用会话持久化',
    en: 'Enable Session Persistence',
  },
  enableSessionPersistenceDesc: {
    zh: '启用客户端会话的持久化存储。如果启用，配置为超过客户端连接生命周期的会话及其相关消息将被持久化存储并在代理服务器停机时保留。注意：此选项无法在 Dashboard 中开启，需要手动在配置文件中启用。',
    en: 'Use durable storage for client sessions persistence. If enabled, sessions configured to outlive client connections, along with their corresponding messages, will be durably stored and survive broker downtime. Note: This option cannot be enabled from the Dashboard, it needs to be manually enabled in the configuration file.',
  },
  batchSize: {
    zh: '批量大小',
    en: 'Batch Size',
  },
  batchSizeDesc: {
    zh: '此值影响持久会话的流控。持久会话批量查询持久消息存储。此值指定批量的大小。',
    en: 'This value affects the flow control for the persistent sessions. Persistent session queries the durable message storage in batches. This value specifies the size of the batch.',
  },
  idlePollInterval: {
    zh: '空闲轮询间隔',
    en: 'Idle Poll Interval',
  },
  idlePollIntervalDesc: {
    zh: '指定空闲状态下会话轮询消息存储的间隔。',
    en: 'Specifies the interval at which the session polls the message storage in idle state.',
  },
  lastAliveUpdateInterval: {
    zh: '最后活动更新间隔',
    en: 'Last Alive Update Interval',
  },
  lastAliveUpdateIntervalDesc: {
    zh: '更新会话最后活动状态的间隔。',
    en: 'The interval at which the last alive status of the session is updated.',
  },
  sessionGcInterval: {
    zh: '会话垃圾收集间隔',
    en: 'Session GC Interval',
  },
  sessionGcIntervalDesc: {
    zh: '执行持久会话的会话垃圾收集的间隔。',
    en: 'The interval at which session GC is executed for persistent sessions.',
  },
  sessionGcBatchSize: {
    zh: '会话垃圾收集批量大小',
    en: 'Session GC Batch Size',
  },
  sessionGcBatchSizeDesc: {
    zh: '每次迭代要收集的过期持久会话批次的大小。',
    en: 'The size of each batch of expired persistent sessions to be garbage collected per iteration.',
  },
  messageRetentionPeriod: {
    zh: '消息保留期',
    en: 'Message Retention Period',
  },
  messageRetentionPeriodDesc: {
    zh: '指定持久会话中消息的最长保留时间。',
    en: 'Specifies the maximum retention period for messages in persistent sessions.',
  },
}
