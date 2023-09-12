export default {
  name: {
    zh: '名称',
    en: 'Name',
    ja: '名称',
  },
  numberOfHooks: {
    zh: '钩子数量',
    en: 'Number of hooks',
    ja: 'フックの数',
  },
  success: {
    zh: '成功',
    en: 'Success',
    ja: '成功',
  },
  failure: {
    zh: '失败',
    en: 'Failure',
    ja: '失敗',
  },
  rate: {
    zh: '速度',
    en: 'Rate',
    ja: 'レート',
  },
  second: {
    zh: '秒',
    en: 'Second',
    ja: '秒',
  },
  status: {
    zh: '状态',
    en: 'Status',
    ja: 'ステータス',
  },
  addExhook: {
    zh: '添加 ExHook',
    en: 'Add ExHook',
    ja: 'ExHookの追加',
  },
  hooks: {
    zh: '已注册钩子',
    en: 'Hooks',
    ja: 'フック',
  },
  basicInfo: {
    zh: '基本信息',
    en: 'Basic Info',
    ja: '基本情報',
  },
  urlDesc: {
    zh: '回调服务器地址。需要配置为以 `http` 或 `https` 开头的 gRPC 服务器的 URL 地址。例如：`http://127.0.0.1:8080`。该 gRPC 服务器必须实现了 `exhook.proto` 中定义的 `HookProvider` 服务。',
    en: 'Server address. This needs to be configured as the URL address of a gRPC server starting with `http` or `https`. For example: `http://127.0.0.1:8080`. The gRPC server must implement the `HookProvider` service defined in `exhook.proto`.',
    ja: 'コールバックサーバーのアドレス。`http` または `https` で始まるgRPCサーバーのURLアドレスとして設定する必要があります。例:`http://127.0.0.1:8080\\`。gRPCサーバーは\\`exhook.proto\\`で定義されている\\`HookProvider\\`サービスを実装している必要があります。',
  },
  poolSizeDesc: {
    zh: 'gRPC 客户端进程池大小。',
    en: 'Process pool size for gRPC client. ',
    ja: 'gRPCクライアントのプロセスプールサイズ。',
  },
  requestTimeOutDesc: {
    zh: '请求超时时间。请求超时后，视为本次请求失败。',
    en: 'Request timeout. After the request timeout, the request is treated failure',
    ja: 'リクエストのタイムアウト時間。タイムアウト後はリクエストは失敗したとみなされます。',
  },
  failedAction: {
    zh: '失败动作',
    en: 'Failed Action',
    ja: '失敗時のアクション',
  },
  failedActionDesc: {
    zh: '请求失败后的备用动作，目前仅对 ` client.authenticate` 和 `client.authorize` 钩子有效。可选值为 `ignore` ：忽略本次权限检查；`deny`：返回权限检查失败。',
    en: 'Alternate action after request failure, currently only available for ` client.authenticate` and ` client.authorize` hooks. The available values are `ignore`: ignore this permission check; `deny`: return a permission check failure.',
    ja: 'リクエスト失敗時の代替アクションで、現在 `client.authenticate` と `client.authorize` フックでのみ利用可能。利用可能な値は `ignore`: この権限チェックを無視する; `deny`: 権限チェック失敗を返す。',
  },
  autoReconnect: {
    zh: '自动重连',
    en: 'Auto Reconnect',
    ja: '自動再接続',
  },
  autoReconnectDesc: {
    zh: '是否开启自动重连。当加载 ExHook 回调服务器失败后，是否进行重试。',
    en: 'If or not enable auto reconnect. If enabled, retry when loading ExHook callback server fails.',
    ja: '自動再接続を有効にするか。有効にした場合、ExHookコールバックサーバーのロードに失敗した際に再試行します。',
  },
  autoReconnectInterval: {
    zh: '自动重连周期',
    en: 'Auto Reconnect Interval',
    ja: '自動再接続の間隔',
  },
  overview: {
    zh: '概览',
    en: 'Overview',
    ja: '概要',
  },
  registeredHooks: {
    zh: '已注册钩子',
    en: 'Registered hooks',
    ja: '登録済フック',
  },
  metricsData: {
    zh: '指标数据',
    en: 'Metrics Data',
    ja: 'メトリクスデータ',
  },
  currentRate: {
    zh: '当前速率',
    en: 'Current Rate',
    ja: '現在のレート',
  },
  params: {
    zh: '参数',
    en: 'Params',
    ja: 'パラメータ',
  },
  connected: {
    zh: '已连接',
    en: 'Connected',
    ja: '接続済み',
  },
  connecting: {
    zh: '连接中',
    en: 'Connecting',
    ja: '接続中',
  },
  stopped: {
    zh: '已停止',
    en: 'Stopped',
    ja: '停止済み',
  },
  error: {
    zh: '发生错误',
    en: 'Error',
    ja: 'エラー発生',
  },
  disabled: {
    zh: '禁用',
    en: 'Disabled',
    ja: '無効',
  },
  rateUnit: {
    zh: '次/秒',
    en: 'time/sec',
    ja: '回/秒',
  },
  nodeMetricsData: {
    zh: '节点指标',
    en: 'Node Metrics',
    ja: 'ノードメトリクス',
  },
  nodeStatusDesc: {
    zh: '每个节点上钩子执行指标数据',
    en: 'Hook execution metrics data on each node',
    ja: '各ノード上のフック実行メトリクスデータ',
  },
}
