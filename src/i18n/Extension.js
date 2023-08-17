export default {
  retainer: {
    zh: '保留消息',
    en: 'Retainer',
    ja: '保持メッセージ',
  },
  sysTopics: {
    zh: '系统主题',
    en: 'System Topics',
    ja: 'システムトピック',
  },
  rewrite: {
    zh: '主题重写',
    en: 'Topic Rewrite',
    ja: 'トピックリライト',
  },
  subscribe: {
    zh: '代理订阅',
    en: 'Auto Subscribe',
    ja: '自動サブスクライブ',
  },
  postpone: {
    zh: '延迟发布',
    en: 'Delayed Publish',
    ja: '遅延パブリッシュ',
  },
  message: {
    zh: '事件消息',
    en: 'Event Message',
    ja: 'イベントメッセージ',
  },
  storage: {
    zh: '消息存储',
    en: 'Storage',
    ja: 'メッセージストレージ',
  },
  policy: {
    en: 'Policy',
    ja: '策略設定',
    zh: '策略设置',
  },
  flowControl: {
    en: 'Flow Control',
    ja: 'フロー制御',
    zh: '流控',
  },
  batchReadNumber: {
    zh: '批量加载数量',
    en: 'Batch Read Number',
    ja: 'バッチ読み込み数',
  },
  batchDeliverNumber: {
    zh: '批量发布数量',
    en: 'Batch Deliver Number',
    ja: 'バッチ配信数',
  },
  msgExpiryInterval: {
    en: 'Message Expiry Interval',
    ja: 'メッセージの有効期限間隔',
    zh: '消息过期间隔',
  },
  msgClearInterval: {
    en: 'Message Clear Interval',
    ja: 'メッセージのクリアインターバル',
    zh: '消息清理间隔',
  },
  deliverRate: {
    zh: '派发速率',
    en: 'Delivery Rate',
    ja: '配信レート',
  },
  deliverRateDesc: {
    zh: '派发保留消息的最大速率',
    en: 'The maximum rate of delivering retain messages',
    ja: '保持メッセージの最大配信レート',
  },
  storageMethod: {
    zh: '存储方式',
    en: 'Storage Method',
    ja: 'ストレージ方法',
  },
  storageType: {
    zh: '存储类型',
    en: 'Storage Type',
    ja: 'ストレージタイプ',
  },
  maxRetainedMessages: {
    zh: '最大保留消息数',
    en: 'Max Retained Messages',
    ja: '最大保持メッセージ数',
  },
  maxPayloadSize: {
    zh: '最大消息负载大小',
    en: 'Max Payload Size',
    ja: '最大ペイロードサイズ',
  },
  enable: {
    zh: '启用',
    en: 'Enable',
    ja: '有効にする',
  },
  enableDelayed: {
    zh: '启用延迟发布',
    en: 'Enable Delayed Publish',
    ja: '遅延パブリッシュを有効にする',
  },
  enableRetained: {
    zh: '启用保留消息',
    en: 'Enable Retained Messages',
    ja: '保持メッセージを有効にする',
  },
  enableDesc: {
    zh: '打开或关闭保留消息功能，停用后不会清除已保留消息',
    en: 'Enable retainer feature, disabling will not clear the saved retained messages',
    ja: '保持メッセージ機能のオン/オフ。無効化しても保存済みメッセージはクリアされない',
  },
  enableDelayedDesc: {
    zh: '启用延迟发布功能，停用将终止延迟列表',
    en: 'Enable the delayed publish and disable it to delete the delayed list',
    ja: '遅延パブリッシュ機能のオン/オフ。無効化すると遅延リストは削除される',
  },
  createDate: {
    zh: '发布时间',
    en: 'Created At',
    ja: '作成日時',
  },
  unlimited: {
    zh: '不限',
    en: 'Unlimited',
    ja: '無制限',
  },
  custom: {
    zh: '自定义',
    en: 'Custom',
    ja: 'カスタム',
  },
  sTopic: {
    zh: '原始主题',
    en: 'Original Topic',
    ja: '元のトピック',
  },
  dTopic: {
    zh: '目标主题',
    en: 'Destination Topic',
    ja: 'ターゲットトピック',
  },
  delayedTime: {
    zh: '延迟时间',
    en: 'Delay',
    ja: '遅延時間',
  },
  remainTime: {
    zh: '剩余时间',
    en: 'Remaining',
    ja: '残り時間',
  },
  publishTime: {
    zh: '发布时间',
    en: 'Publish Time',
    ja: 'パブリッシュ時間',
  },
  eventTitleDesc: {
    zh: '将设备生命周期事件通过事件主题以 MQTT 消息的形式发布',
    en: 'Publish client life cycle events through events topic',
    ja: 'クライアントのライフサイクルイベントをイベントトピック経由でMQTTメッセージとしてパブリッシュする',
  },
  configMsg: {
    zh: '配置需要启用的事件消息',
    en: 'Configure event messages that need to be enabled',
    ja: '有効にするイベントメッセージを設定する',
  },
  client_connected: {
    en: 'Clients have already connected',
    ja: 'クライアントが接続済み',
    zh: '客户端连接完成',
  },
  required: {
    zh: '请填写此项',
    en: 'Required',
    ja: '必須入力',
  },
  client_disconnected: {
    en: 'Clients have already disconnected',
    ja: 'クライアントが接続切断済み',
    zh: '客户端断开连接',
  },
  client_subscribed: {
    en: 'Clients have already subscribed',
    ja: 'クライアントがサブスクライブ済み',
    zh: '客户端完成订阅',
  },
  client_unsubscribed: {
    en: 'Clients have already unsubscribed',
    ja: 'クライアントがアンサブスクライブ済み',
    zh: '客户端取消订阅',
  },
  message_delivered: {
    en: 'Messages have already delivered',
    ja: 'メッセージが配信済み',
    zh: '消息已投递',
  },
  message_dropped: {
    en: 'Messages have already dropped',
    ja: 'メッセージがドロップ済み',
    zh: '消息已丢弃',
  },
  message_acked: {
    en: 'Messages have already acknowledged',
    ja: 'メッセージが確認済み',
    zh: '消息已确认',
  },
  action: {
    zh: '动作类型',
    en: 'Action',
    ja: 'アクションタイプ',
  },
  re: {
    zh: '正则表达式',
    en: 'Regex',
    ja: '正規表現',
  },
  dataManage: {
    zh: '数据管理',
    en: 'Manage Data',
    ja: 'データ管理',
  },
  maxDelayedMsg: {
    zh: '最大延迟消息数',
    en: 'Max Delayed Messages',
    ja: '最大遅延メッセージ数',
  },
  maxDelayedMsgDesc: {
    zh: '最大延迟消息数，超过此数量将不再接收新的延迟消息',
    en: 'Max delayed messages, no new delayed messages will be accepted when the number is exceeded',
    ja: '大遅延メッセージ数。これを超えると新規の遅延メッセージは受け付けられなくなる',
  },
  builtInDatabase: {
    zh: '内置数据库',
    en: 'Built-in Database',
    ja: '組み込みデータベース',
  },
  noExp: {
    en: 'Never Expire',
    ja: '期限切れなし',
    zh: '永不过期',
  },
  sec: {
    en: 'Second',
    ja: '秒',
    zh: '秒',
  },
  min: {
    en: 'Minute',
    ja: '分',
    zh: '分',
  },
  hour: {
    en: 'Hour',
    ja: '時間',
    zh: '小时',
  },
  disable: {
    en: 'Disabled',
    ja: '無効',
    zh: '禁用',
  },
  releaseInterval: {
    en: 'Quota Release Interval',
    ja: 'クォータ解放インターバル',
    zh: '单次发布周期',
  },
  openPayload: {
    en: 'Show Payload',
    ja: 'ペイロードを表示',
    zh: '查看 Payload',
  },
  view: {
    zh: '查看',
    en: 'View',
    ja: '表示',
  },
  needNumber: {
    en: 'It needs to be a number',
    ja: '数字を入力してください',
    zh: '请填写数字',
  },
  basicConfig: {
    zh: '基础配置',
    en: 'Basic Config',
    ja: '基本設定',
  },
  messagePublishInterval: {
    zh: '消息发布周期',
    en: 'Messages publish interval',
    ja: 'メッセージパブリッシュインターバル',
  },
  heartbeatInterval: {
    zh: '心跳周期',
    en: 'Heartbeat interval',
    ja: 'ハートビートインターバル',
  },
  clientEvent: {
    zh: '客户端事件',
    en: 'Client event',
    ja: 'クライアントイベント',
  },
  clientConnected: {
    zh: '客户端已连接提醒',
    en: 'Client connected notification',
    ja: 'クライアント接続通知',
  },
  clientDisconnected: {
    zh: '客户端断开连接提醒',
    en: 'Client disconnected notification ',
    ja: 'クライアント切断通知',
  },
  clientSubscribed: {
    zh: '客户端订阅提醒',
    en: 'Client subscribed notification ',
    ja: 'クライアントサブスクライブ通知',
  },
  clientUnsubscribed: {
    zh: '客户端取消订阅提醒',
    en: 'Client unsubscribed notification ',
    ja: 'クライアントアンサブスクライブ通知',
  },
  messages: {
    zh: '已保留消息',
    en: 'Retained Messages',
    ja: '保持メッセージ',
  },
  retainerDisabled: {
    zh: '保留消息功能已禁用，点击跳转到设置页面中开启。',
    en: 'Retained message is disabled, click to enable on settings page.',
    ja: '保持メッセージが無効です。設定ページで有効化してください。',
  },
  msgExpiryIntervalDesc: {
    en: 'Message retention time. 0 means message will never be expired',
    ja: 'メッセージの保持期間。0はメッセージが期限切れにならないことを意味する',
    zh: '消息保留时间。0 代表永久保留',
  },
  msgClearIntervalDesc: {
    en: `Periodic interval for cleaning up expired messages. Never clear if the value is 0.`,
    ja: '期限切れメッセージをクリーンアップする周期的なインターバル。値が0の場合はクリアしない',
    zh: '消息清理间隔。0 代表不进行清理',
  },
  maxPayloadSizeDesc: {
    en: 'Maximum retained message size',
    ja: '保持メッセージの最大サイズ',
    zh: '保留消息的最大长度',
  },
  typeDesc: {
    en: 'Backend type',
    ja: 'バックエンドのタイプ',
    zh: '后端类型',
  },
  storageTypeDesc: {
    en: 'Specifies whether the messages are stored in RAM or persisted on disc',
    ja: 'メッセージをRAMに格納するかディスクに保存するかを指定する',
    zh: '选择消息是存放在磁盘还是内存中',
  },
  maxRetainedMessagesDesc: {
    en: 'Maximum number of retained messages, 0 means no limit',
    ja: '保持メッセージの最大数。0は無制限を意味する',
    zh: '消息保留的数量上限，0 表示无限',
  },
  batchReadNumberDesc: {
    en: 'Size of the batch when reading messages from storage, 0 means reading all at once',
    ja: 'ストレージからメッセージを読み込むときのバッチサイズ。0は一度にすべて読み込むことを意味する',
    zh: '从存储后端批量加载时的每批数量上限，0 代表一次性读取',
  },
  batchDeliverNumberDesc: {
    en: 'The number of retained messages can be delivered per batch, 0 means delivering all at once.',
    ja: 'バッチごとに配信できる保持メッセージの数。0は一度にすべて配信することを意味する',
    zh: '批量派发时每批的数量，0 代表一次性全部派发',
  },
  sysMsgIntervalDesc: {
    en: `Time interval for publishing following system messages:
- \`$SYS/brokers\`
- \`$SYS/brokers/<node>/version\`
- \`$SYS/brokers/<node>/sysdescr\`
- \`$SYS/brokers/<node>/stats/<name>\`
- \`$SYS/brokers/<node>/metrics/<name>\`
`,
    zh: `发送以下系统主题的时间间隔:  
- \`$SYS/brokers\`
- \`$SYS/brokers/<node>/version\`
- \`$SYS/brokers/<node>/sysdescr\`
- \`$SYS/brokers/<node>/stats/<name>\`
- \`$SYS/brokers/<node>/metrics/<name>\`
`,
    ja: `以下のシステムメッセージをパブリッシュする時間間隔：  
- \`$SYS/brokers\`
- \`$SYS/brokers/<node>/version\`
- \`$SYS/brokers/<node>/sysdescr\`
- \`$SYS/brokers/<node>/stats/<name>\`
- \`$SYS/brokers/<node>/metrics/<name>\`
`,
  },
  sysHeartbeatIntervalDesc: {
    en: `Time interval for publishing following heartbeat messages:
- \`$SYS/brokers/<node>/uptime\`
- \`$SYS/brokers/<node>/datetime\`
`,
    zh: `发送心跳系统消息的间隔时间，它包括：
- \`$SYS/brokers/<node>/uptime\`
- \`$SYS/brokers/<node>/datetime\`
`,
ja: `以下のハートビートメッセージをパブリッシュする時間間隔：
- \`$SYS/brokers/<node>/uptime\`
- \`$SYS/brokers/<node>/datetime\`
`,
  },
  sysEventClientConnectedDesc: {
    en: 'Enable to publish client connected event messages',
    ja: 'クライアント接続イベントメッセージをパブリッシュするかどうかを有効にする',
    zh: '是否开启客户端已连接事件消息。',
  },
  sysEventClientDisconnectedDesc: {
    en: 'Enable to publish client disconnected event messages.',
    ja: 'クライアント切断イベントメッセージをパブリッシュするかどうかを有効にする。',
    zh: '是否开启客户端已断开连接事件消息。',
  },
  sysEventClientSubscribedDesc: {
    en: 'Enable to publish event message that client subscribed a topic successfully.',
    ja: 'クライアントがトピックをサブスクライブした際にイベントメッセージをパブリッシュするかどうかを有効にする。',
    zh: '是否开启客户端已成功订阅主题事件消息。',
  },
  sysEventClientUnsubscribedDesc: {
    en: 'Enable to publish event message that client unsubscribed a topic successfully.',
    ja: 'クライアントがトピックをアンサブスクライブした際にイベントメッセージをパブリッシュするかどうかを有効にする。',
    zh: '是否开启客户端已成功取消订阅主题事件消息。',
  },
  proxySubTip: {
    zh: '通过代理订阅为客户端订阅主题时，不会经过 AuthZ 检查权限。',
    en: 'The authorization will not check permission when clients subscribe to topics through Auto Subscribe.',
    ja: '自動サブスクライブを通じてクライアントがトピックをサブスクライブする際、認証による権限チェックは行われない。',
  },
}
