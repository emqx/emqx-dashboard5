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
}
