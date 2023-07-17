export default {
  name: {
    zh: '名称',
    en: 'Name',
  },
  numberOfHooks: {
    zh: '钩子数量',
    en: 'Number of hooks',
  },
  success: {
    zh: '成功',
    en: 'Success',
  },
  failure: {
    zh: '失败',
    en: 'Failure',
  },
  rate: {
    zh: '速度',
    en: 'Rate',
  },
  second: {
    zh: '秒',
    en: 'Second',
  },
  status: {
    zh: '状态',
    en: 'Status',
  },
  addExhook: {
    zh: '添加 ExHook',
    en: 'Add ExHook',
  },
  hooks: {
    zh: '已注册钩子',
    en: 'Hooks',
  },
  urlDesc: {
    zh: '回调服务器地址。需要配置为以 `http` 或 `https` 开头的 gRPC 服务器的 URL 地址。例如：`http://127.0.0.1:8080`。该 gRPC 服务器必须实现了 `exhook.proto` 中定义的 `HookProvider` 服务。',
    en: 'Server address. This needs to be configured as the URL address of a gRPC server starting with `http` or `https`. For example: `http://127.0.0.1:8080`. The gRPC server must implement the `HookProvider` service defined in `exhook.proto`.',
  },
  poolSizeDesc: {
    zh: 'gRPC 客户端进程池大小。',
    en: 'Process pool size for gRPC client. ',
  },
  requestTimeOutDesc: {
    zh: '请求超时时间。请求超时后，视为本次请求失败。',
    en: 'Request timeout. After the request timeout, the request is treated failure',
  },
  failedAction: {
    zh: '失败动作',
    en: 'Failed Action',
  },
  failedActionDesc: {
    zh: '请求失败后的备用动作，目前仅对 ` client.authenticate` 和 `client.authorize` 钩子有效。可选值为 `ignore` ：忽略本次权限检查；`deny`：返回权限检查失败。',
    en: 'Alternate action after request failure, currently only available for ` client.authenticate` and ` client.authorize` hooks. The available values are `ignore`: ignore this permission check; `deny`: return a permission check failure.',
  },
  autoReconnect: {
    zh: '自动重连',
    en: 'Auto Reconnect',
  },
  autoReconnectDesc: {
    zh: '是否开启自动重连。当加载 ExHook 回调服务器失败后，是否进行重试。',
    en: 'If or not enable auto reconnect. If enabled, retry when loading ExHook callback server fails.',
  },
  autoReconnectInterval: {
    zh: '自动重连周期',
    en: 'Auto Reconnect Interval',
  },
  overview: {
    zh: '概览',
    en: 'Overview',
  },
  registeredHooks: {
    zh: '已注册钩子',
    en: 'Registered hooks',
  },
  metricsData: {
    zh: '指标数据',
    en: 'Metrics Data',
  },
  currentRate: {
    zh: '当前速率',
    en: 'Current Rate',
  },
  params: {
    zh: '参数',
    en: 'Params',
  },
  connected: {
    zh: '已连接',
    en: 'Connected',
  },
  connecting: {
    zh: '连接中',
    en: 'Connecting',
  },
  stopped: {
    zh: '已停止',
    en: 'Stopped',
  },
  error: {
    zh: '发生错误',
    en: 'Error',
  },
  disabled: {
    zh: '禁用',
    en: 'Disabled',
  },
  rateUnit: {
    zh: '次/秒',
    en: 'time/sec',
  },
  nodeMetricsData: {
    zh: '节点指标',
    en: 'Node Metrics',
  },
  nodeStatusDesc: {
    zh: '每个节点上钩子执行指标数据',
    en: 'Hook execution metrics data on each node',
  },
}
