export default {
  mqtt: {
    zh: 'MQTT',
    en: 'MQTT',
  },
  cluster: {
    zh: '集群',
    en: 'Cluster',
  },
  log: {
    zh: '日志',
    en: 'Log',
  },
  dashboard: {
    zh: '仪表盘',
    en: 'Dashboard',
  },
  global: {
    zh: '全局',
    en: 'Global',
  },
  default: {
    zh: '默认',
    en: 'Default',
  },
  mqttPath: {
    zh: "WebSocket 连接 URL 中的路径，应以 `/` 开头，并支持子路径。默认情况下，WebSocket 客户端连接的完整 URL 为 `ws://{'{'}ip{'}'}:{'{'}port{'}'}/mqtt`。<br/>支持在路径末尾添加 `/[...]` 表示任意子路径。例如，当设置为 `/mqtt/[...]` 时，可以接受 `/mqtt/org1`、`/mqtt/org1/app1` 等连接。<br/>注意，如果客户端连接的路径与配置不匹配，则连接将在 HTTP 层被拒绝。",
    en: "The path in the WebSocket connection URL, which should start with `/` and supports subpaths. By default, the full URL of a WebSocket client connection is `ws://{'{'}ip{'}'}:{'{'}port{'}'}/mqtt`.<br/>It is supported to add `/[...] ` at the end of the path to make EMOX accept any subpath. For example, specifying `/mqtt/[...]` would allow clients to connect at paths like `mqtt/org1` or `mqtt/org1/app1`, etc.<br/><br/>NOTE: An unmatched path will cause the client to be rejected immediately at the HTTP  laver.",
  },
  readOnlyTip: {
    zh: '此配置项不支持热配置，请到配置文件内修改并重启服务',
    en: 'This configuration does not support online-reload. Please update the config file and restart EMQX.',
  },
  telemetry: {
    zh: '遥测数据',
    en: 'Telemetry',
  },
  telemetryTip: {
    zh: '遥测收集有关 EMQX 使用情况的信息，与我们共享这些指标可以帮助我们更好地了解您如何使用我们的产品，并可以持续地帮助我们改进产品',
    en: 'Telemetry collects information about EMQX usage. Sharing these metrics helps us to better understand how EMQX is used, so we can continuously improve it.',
  },
  enableTelemetry: {
    zh: '启动遥测',
    en: 'Enable telemetry',
  },
  rate: {
    zh: '速率限制',
    en: 'Rate Limit',
  },
  limiter: {
    zh: '速率限制器',
    en: 'Limiter',
  },
  invaiteNode: {
    zh: '邀请节点',
    en: 'Invite nodes',
  },
  inviteNodeDesc: {
    zh: "当集群节点的服务发现方法 ('cluster.discovery_strategy') 是 'manual' 的时候，可手动邀请节点加入集群",
    en: "When 'cluster.service_discovery' is configured with 'manual', you may invite another node to join the cluster.",
  },
  removeNodeConfirm: {
    zh: '是否移除该节点？',
    en: 'This will remove the current node Continue?',
  },
  invite: {
    zh: '邀请',
    en: 'Invite',
  },
  inviteSuccess: {
    zh: '邀请成功',
    en: 'Invite Successfully',
  },
  currentNode: {
    zh: '当前节点',
    en: 'Current Node',
  },
  nodeRequired: {
    zh: '请输入节点名称',
    en: 'Node name is required',
  },
  basic: {
    zh: '基础',
    en: 'Basic',
  },
  confirmDeleteListenerType: {
    zh: '请输入监听器的名称来确认删除',
    en: 'Please type the listener name to confirm.',
  },
  acceptors: {
    zh: '接收器',
    en: 'Acceptors',
  },
  proxyProtocol: {
    zh: '代理协议',
    en: 'Proxy Protocol',
  },
  proxyProtocolTimeout: {
    zh: '代理协议超时',
    en: 'Proxy Protocol Timeout',
  },
  /* Tab Name */
  vm: {
    zh: 'Erlang 虚拟机',
    en: 'Erlang VM',
  },
  os: {
    zh: '操作系统',
    en: 'Operating System',
  },
  console: {
    zh: '控制台日志',
    en: 'Console Logs',
  },
  file: {
    zh: '文件日志',
    en: 'File Logs',
  },
  throttling: {
    zh: '日志限流',
    en: 'Throttling',
  },
  connection: {
    zh: '连接速率',
    en: 'Connection',
  },
  rateMatchError: {
    zh: '请输入格式正确的速率配置',
    en: 'Please enter a properly formatted rate configuration',
  },
  updateListenerTip: {
    zh: '注意：如果更改非 QUIC 类型的监听器端口，将会断开所有已存在的连接，是否继续？',
    en: 'Note: If the port of listeners (except QUIC type) is changed, all existing connections will be disconnected. Continue?',
  },
  duplicatedAttrError: {
    zh: '存在相同的属性',
    en: 'Duplicated Attribute',
  },
}
