export default {
  mqtt: {
    zh: 'MQTT',
    en: 'MQTT',
    ja: 'MQTT',
  },
  cluster: {
    zh: '集群',
    en: 'Cluster',
    ja: 'クラスター',
  },
  log: {
    zh: '日志',
    en: 'Log',
    ja: 'ログ',
  },
  dashboard: {
    zh: '仪表盘',
    en: 'Dashboard',
    ja: 'ダッシュボード',
  },
  global: {
    zh: '全局',
    en: 'Global',
    ja: 'グローバル',
  },
  default: {
    zh: '默认',
    en: 'Default',
    ja: 'デフォルト',
  },
  listenerZoneDesc: {
    zh: '监听器所属的配置组，一个 Zone 定义了一组配置项 (比如最大连接数等)，Listener 可以通过该配置项指定使用某个 Zone，以使用该 Zone 下的所有配置。多个 Listener 可以共享同一个 Zone',
    en: 'The configuration group to which the listener belongs. A Zone defines a set of configuration items (such as the maximum number of connections), and a Listener can specify a Zone to use all the configurations in the Zone. Multiple Listeners can share the same Zone.',
    ja: 'リスナーが所属する設定グループ。Zoneは、設定アイテムのセット（最大接続数など）を定義し、リスナーはZoneを指定してそのZoneのすべての設定を使用できます。複数のリスナーは同じZoneを共有できます。',
  },
  mqttPath: {
    zh: 'WebSocket 连接的路径，例如 /mqtt，作用是指定 WebSocket 连接的路径，以便在服务器上找到正确的 WebSocket 端点',
    en: 'The path of the WebSocket connection, such as /mqtt, is used to specify the path of the WebSocket connection so that the correct WebSocket endpoint can be found on the server.',
    ja: 'WebSocket接続のパスです。例えば`/mqtt`です。これは、サーバー上で正しいWebSocketエンドポイントを見つけるために、WebSocket接続のパスを指定するために使用されます。',
  },
  confirmRemove: {
    zh: '此操作将移除 {name}，是否继续？',
    en: 'This will remove {name}, continue?',
    ja: '{name}を削除します。続行しますか?',
  },
  readOnlyTip: {
    zh: '此配置项不支持热配置，请到配置文件内修改并重启服务',
    en: 'This configuration does not support online-reload. Please update the config file and restart EMQX.',
    ja: 'この設定はホットリロードをサポートしていません。設定ファイルを更新してEMQXを再起動してください。',
  },
  telemetry: {
    zh: '遥测数据',
    en: 'Telemetry',
    ja: 'テレメトリー',
  },
  telemetryTip: {
    zh: '遥测收集有关 EMQX 使用情况的信息，与我们共享这些指标可以帮助我们更好地了解您如何使用我们的产品，并可以持续地帮助我们改进产品',
    en: 'Telemetry collects information about EMQX usage. Sharing these metrics helps us to better understand how EMQX is used, so we can continuously improve it.',
    ja: 'テレメトリはEMQXの使用情報を収集します。これらの指標を共有することで、EMQXの使用方法をよりよく理解し、継続的に改善することができます。',
  },
  enableTelemetry: {
    zh: '启动遥测',
    en: 'Enable telemetry',
    ja: 'テレメトリーを有効化',
  },
  rate: {
    zh: '速率限制',
    en: 'Rate Limit',
    ja: 'レート制限',
  },
  limiter: {
    zh: '速率限制器',
    en: 'Limiter',
    ja: 'レートリミッター',
  },
  invaiteNode: {
    zh: '邀请节点',
    en: 'Invite nodes',
    ja: 'ノードを招待',
  },
  inviteNodeDesc: {
    zh: "当集群节点的服务发现方法 ('cluster.discovery_strategy') 是 'manual' 的时候，可手动邀请节点加入集群",
    en: "When 'cluster.service_discovery' is configured with 'manual', you may invite another node to join the cluster.",
  },
  removeNodeConfirm: {
    zh: '是否移除该节点？',
    en: 'This will remove the current node Continue?',
    ja: '現在のノードを削除しますか？続けますか？',
  },
  invite: {
    zh: '邀请',
    en: 'Invite',
    ja: '招待',
  },
  inviteSuccess: {
    zh: '邀请成功',
    en: 'Invite Successfully',
    ja: '招待成功',
  },
  clusterType: {
    zh: '集群方式',
    en: 'Cluster Type',
    ja: 'クラスターの種類',
  },
  currentNode: {
    zh: '当前节点',
    en: 'Current Node',
    ja: '現在のノード',
  },
  nodeRequired: {
    zh: '请输入节点名称',
    en: 'Node name is required',
    ja: 'ノード名が必要です',
  },
  basic: {
    zh: '基础',
    en: 'Basic',
    ja: '基本',
  },
  newBucket: {
    zh: '新建桶',
    en: 'New Bucket',
    ja: '新しいバケット',
  },
  bucketName: {
    zh: '桶名称',
    en: 'Bucket Name',
    ja: 'バケット名',
  },
  duplicateBucket: {
    zh: '复制桶',
    en: 'Duplicate Bucket',
    ja: 'バケットの複製',
  },
  bucketNameRequired: {
    zh: '请输入桶名称',
    en: 'Bucket name is required',
    ja: 'バケット名が必要です',
  },
  bucketNameExist: {
    zh: '桶已存在',
    en: 'Bucket already exists',
    ja: 'バケットは既に存在します',
  },
  dashboardHttpTip: {
    zh: '部分参数修改后，可能需要重新启动 EMQX Dashboard ！',
    en: 'Some parameters need to be restarted EMQX Dashboard to take effect!',
    ja: '一部のパラメータは、EMQXダッシュボードを再起動して有効にする必要があります！',
  },
  limierNameRegError: {
    zh: '请输入由字母和数字组成的名称',
    en: 'Please enter a name composed of letters and numbers',
    ja: 'アルファベットと数字で構成される名前を入力してください',
  },
  confirmDeleteListenerType: {
    zh: '请输入监听器的名称来确认删除',
    en: 'Please type the listener name to confirm.',
    ja: '削除を確認するためにリスナー名を入力してください。',
  },
  acceptors: {
    zh: '接收器',
    en: 'Acceptors',
    ja: 'アクセプター',
  },
  proxyProtocol: {
    zh: '代理协议',
    en: 'Proxy Protocol',
    ja: 'プロキシプロトコル',
  },
  proxyProtocolTimeout: {
    zh: '代理协议超时',
    en: 'Proxy Protocol Timeout',
    ja: 'プロキシプロトコルタイムアウト',
  },
  connectionTitle: {
    zh: '连接',
    en: 'Connection',
    ja: '接続',
  },
  /* Tab Name */
  vm: {
    zh: 'Erlang 虚拟机',
    en: 'Erlang VM',
    ja: 'Erlang VM',
  },
  os: {
    zh: '操作系统',
    en: 'Operating System',
    ja: 'オペレーティングシステム',
  },
  console: {
    zh: '控制台日志',
    en: 'Console Log',
    ja: 'コンソールログ',
  },
  file: {
    zh: '文件日志',
    en: 'File Log',
    ja: 'ファイルログ',
  },
  connection: {
    zh: '连接速率',
    en: 'Connection',
    ja: '接続速度',
  },
  rateMatchError: {
    zh: '请输入格式正确的速率配置',
    en: 'Please enter a properly formatted rate configuration',
    ja: '正しくフォーマットされたレート設定を入力してください。',
  },
}
