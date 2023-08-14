export default {
  name: {
    zh: '名称',
    en: 'Name',
    ja: '名称',
  },
  status: {
    zh: '状态',
    en: 'Status',
    ja: 'ステータス',
  },
  connection: {
    zh: '连接',
    en: 'Connections',
    ja: '接続',
  },
  listeners: {
    zh: '监听器',
    en: 'Listeners',
    ja: 'リスナー',
  },
  running: {
    zh: 'Enabled',
    en: 'Enabled',
    ja: '有効',
  },
  stopped: {
    zh: 'Disabled',
    en: 'Disabled',
    ja: '無効',
  },
  auth: {
    en: 'Authentication',
    ja: '認証',
    zh: '接入认证',
  },
  clients: {
    zh: '客户端',
    en: 'Clients',
    ja: 'クライアント',
  },
  more: {
    zh: '更多',
    en: 'More',
    ja: '詳細',
  },
  enable: {
    zh: '启用',
    en: 'Enable',
    ja: '有効化',
  },
  disable: {
    zh: '停用',
    en: 'Disable',
    ja: '無効化',
  },
  addListener: {
    zh: '添加监听器',
    en: 'Add Listener',
    ja: 'リスナーの追加',
  },
  editListener: {
    zh: '编辑监听器',
    en: 'Edit Listener',
    ja: 'リスナーの編集',
  },
  disableListenerTip: {
    zh: '在禁用监听器后，监听器中的所有连接将被关闭，是否继续？',
    en: 'All connections in the listener will be closed after disabling the listener. Continue?',
    ja: 'リスナーを無効にすると、そのリスナーのすべての接続が切断されます。続行しますか?',
  },
  addAuth: {
    en: 'Create Authentication',
    ja: '認証の作成',
    zh: '添加认证',
  },
  clientid: {
    zh: '客户端ID',
    en: 'Client ID',
    ja: 'クライアントID',
  },
  username: {
    zh: '用户名',
    en: 'Username',
    ja: 'ユーザー名',
  },
  maxKeepalive: {
    zh: '最大心跳时间',
    en: 'Max Keepalive Time',
    ja: '最大キープアライブ時間',
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
  initial: {
    zh: '初始化',
    en: 'Initialize ',
    ja: '初期化',
  },
  basicConfig: {
    zh: '基础参数',
    en: 'Basic Configuration',
    ja: '基本設定',
  },
  maxHeader: {
    zh: '最大 Header 数',
    en: 'Max Header',
    ja: '最大ヘッダー数',
  },
  maxHeaderLen: {
    zh: '单个 Header 最大长度',
    en: 'Max Each Header Length',
    ja: '各ヘッダーの最大長',
  },
  maxBodyLen: {
    zh: '最大 Body 长度',
    en: 'Max Body Length',
    ja: '本文の最大長',
  },
  idleTime: {
    zh: '空闲超时时间',
    en: 'Idle Timeout',
    ja: 'アイドルタイムアウト',
  },
  useLog: {
    zh: '启用统计',
    en: 'Enable Statistics',
    ja: '統計の有効化',
  },
  mountPoint: {
    zh: '挂载点',
    en: 'MountPoint',
    ja: 'マウントポイント',
  },
  lType: {
    zh: '类型',
    en: 'Type',
    ja: 'タイプ',
  },
  lAddress: {
    zh: '监听地址',
    en: 'Bind',
    ja: 'バインドアドレス',
  },
  lMaxConn: {
    zh: '最大连接数',
    en: 'Max Connections',
    ja: '最大接続数',
  },
  clientAuth: {
    zh: '配置客户端接入认证',
    en: 'Client authentication',
    ja: 'クライアント認証',
  },
  clientAuthDesc: {
    zh: '您可以在启用网关之后，进入详情页面进行配置。配置并启用客户端认证后未通过认证的客户端无法连接到集群中。',
    en: 'You can configure authentication after enable the gateway.When client authentication is enabled, clients that fail to pass authentication cannot connect to the cluster.',
    ja: 'ゲートウェイを有効にした後、詳細ページから認証を設定できます。クライアント認証を設定して有効にすると、認証に失敗したクライアントはクラスタに接続できなくなります。',
  },
  predefinedTopic: {
    zh: '预设 Topic 列表',
    en: 'Predefined Topic List',
    ja: '事前定義トピックリスト',
  },
  broadcast: {
    zh: '开启广播',
    en: 'Enable Broadcast',
    ja: 'ブロードキャストの有効化',
  },
  qos3: {
    zh: '启用 QoS3',
    en: 'Enable QoS3',
    ja: 'QoS3の有効化',
  },
  connectionRequire: {
    zh: '连接模式',
    en: 'Connection Required',
    ja: '接続モード',
  },
  heartbeat: {
    zh: '心跳间隔',
    en: 'Heartbeat',
    ja: 'ハートビート間隔',
  },
  notifyType: {
    zh: '通知类型',
    en: 'Notification Message Type',
    ja: '通知メッセージタイプ',
  },
  subQos: {
    zh: '订阅 QoS',
    en: 'Subscribe QoS',
    ja: 'サブスクライブQoS',
  },
  pubQos: {
    zh: '发布 QoS',
    en: 'Publish QoS',
    ja: 'パブリッシュQoS',
  },
  resDirectory: {
    en: 'Resource Definition Files Directory',
    ja: 'リソース定義ファイルディレクトリ',
    zh: '资源定义文件目录',
  },
  qmodewindow: {
    zh: 'QMode Time Window',
    en: 'QMode Time Window',
    ja: 'QModeタイムウィンドウ',
  },
  minLifetime: {
    en: 'Minimum Lifetime',
    ja: '最小ライフタイム',
    zh: '最小心跳时间',
  },
  maxLifetime: {
    en: 'Maximum Lifetime',
    ja: '最大ライフタイム',
    zh: '最大心跳时间',
  },
  aObserve: {
    zh: 'Auto Observe',
    en: 'Auto Observe',
    ja: '自動観測',
  },
  updateStrategy: {
    zh: 'Update Message Strategy',
    en: 'Update Message Strategy',
    ja: 'アップデートメッセージ戦略',
  },
  trCommand: {
    zh: '下行命令',
    en: 'Command',
    ja: 'コマンド',
  },
  trResponse: {
    zh: '应答消息',
    en: 'Response',
    ja: 'レスポンス',
  },
  trNotify: {
    zh: '通知消息',
    en: 'Notify',
    ja: '通知',
  },
  trRegister: {
    zh: '注册事件',
    en: 'Register',
    ja: '登録',
  },
  trUpdate: {
    zh: '更新事件',
    en: 'Update',
    ja: '更新',
  },
  maxConnRate: {
    zh: '最大连接速率',
    en: 'Max Connection Rate',
    ja: '最大接続レート',
  },
  maxConn: {
    zh: '最大连接数',
    en: 'Max Connections',
    ja: '最大接続数',
  },
  sendTimeout: {
    zh: '发送超时时间',
    en: 'Send Timeout',
    ja: '送信タイムアウト',
  },
  sendTimeoutClose: {
    zh: '关闭发送超时连接',
    en: 'Send Timeout Close',
    ja: '送信タイムアウトで接続を閉じる',
  },
  sslversion: {
    zh: 'SSL 版本',
    en: 'SSL Versions',
    ja: 'SSLバージョン',
  },
  dtlsversion: {
    zh: 'DTLS 版本',
    en: 'DTLS Versions',
    ja: 'DTLSバージョン',
  },
  sendBuf: {
    zh: '发送缓冲区大小',
    en: 'Send Buffer',
    ja: '送信バッファサイズ',
  },
  recBuf: {
    zh: '接收缓冲区大小',
    en: 'Receive Buffer',
    ja: '受信バッファサイズ',
  },
  endpointName: {
    zh: 'EndPoint Name',
    en: 'EndPoint Name',
    ja: 'エンドポイント名',
  },
  ipaddress: {
    zh: 'IP 地址',
    en: 'IP Address',
    ja: 'IPアドレス',
  },
  connectedAt: {
    //no doubt
    zh: '注册时间',
    en: 'Registered At',
    ja: '登録時刻',
  },
  lifetime: {
    zh: 'LifeTime',
    en: 'LifeTime',
    ja: 'ライフタイム',
  },
  alreadyLoad: {
    zh: '此网关已经初始化',
    en: 'This gateway is already loaded',
    ja: 'このゲートウェイはすでに初期化されています',
  },
  grpcListener: {
    zh: 'gRPC 监听',
    en: 'gRPC ConnectionAdapter',
    ja: 'gRPCリスナー',
  },
  grpcConnection: {
    zh: 'gRPC 连接',
    en: 'gRPC ConnectionHandler',
    ja: 'gRPC接続',
  },
  noAuthTips: {
    zh: '如需对接入的客户端进行身份认证，请先添加认证，配置并启用客户端认证后未通过认证的客户端将无法连接到集群中。',
    en: 'To authenticate the client, please add authentication first. After configuring and enabling client authentication, clients that fail to pass authentication will not be able to connect to the cluster.',
    ja: 'クライアントを認証するには、まず認証を追加してください。クライアント認証を設定して有効にした後、認証に失敗したクライアントはクラスタに接続できません。',
  },
  missinggRPCTLSFile: {
    zh: '缺少 gRPC 监听的 Cert 或 Key 内容',
    en: 'Missing Cert or Key content for gRPC ConnectionAdapter',
    ja: 'gRPCリスナーのCertまたはKeyの内容がありません',
  },
  setup: {
    zh: '配置',
    en: 'Setup',
    ja: '設定',
  },
  updateListenerTip: {
    zh: '更新监听器会导致已有连接断开，继续？',
    en: 'Updating the listener will cause existing connections to be disconnected. Continue?',
    ja: 'リスナーを更新すると、既存の接続が切断されます。続行しますか?',
  },
  settings: {
    zh: '设置',
    en: 'Settings',
    ja: '設定',
  },
  disableGatewayTip: {
    zh: '禁用网关将导致通过此网关接入的连接全部断开，继续？',
    en: 'Disabling the gateway will cause all connections accessed through this gateway to be disconnected. Continue?',
    ja: 'ゲートウェイを無効にすると、そのゲートウェイ経由で接続している全接続が切断されます。続行しますか?',
  },
  failIfNoPeerCert: {
    zh: '没有证书则 SSL 失败',
    en: 'SSL Fail If No Peer Cert',
    ja: 'ピア証明書がない場合はSSLに失敗',
  },
  SSLdepth: {
    zh: 'CA 证书深度',
    en: 'CACert Depth',
    ja: 'CA証明書の深度',
  },
  SSLPassword: {
    zh: '密钥文件密码',
    en: 'Key File Passphrase',
    ja: 'キーファイルパスフレーズ',
  },
  enableOcspStapling: {
    zh: '启用 OCSP Stapling',
    en: 'Enable OCSP Stapling',
    ja: 'OCSPステープリングを有効化',
  },
  responderUrl: {
    zh: 'OCSP 服务器地址',
    en: 'OCSP Responder URL',
    ja: 'OCSPレスポンダURL',
  },
  issuerPem: {
    zh: 'OCSP 签发者证书',
    en: 'OCSP Issuer Certificate',
    ja: 'OCSP発行者証明書',
  },
  refreshInterval: {
    zh: 'OCSP 刷新间隔',
    en: 'OCSP Refresh Interval',
    ja: 'OCSP更新間隔',
  },
  refreshHttpTimeout: {
    zh: 'OCSP 刷新 HTTP 超时时间',
    en: 'OCSP Refresh HTTP Timeout',
    ja: 'OCSP更新HTTPタイムアウト',
  },
  enableCrlCheck: {
    en: 'Enable CRL Check',
    ja: 'CRLチェックを有効化',
    zh: '启用 CRL 检查',
  },
  showLimiter: {
    zh: '速率配置（可选）',
    en: 'Limiter (Optional)',
    ja: 'レート制限(オプション)',
  },
}
