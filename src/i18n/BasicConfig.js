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
  listenerZoneDesc: {
    zh: '监听器所属的配置组，一个 Zone 定义了一组配置项 (比如最大连接数等)，Listener 可以通过该配置项指定使用某个 Zone，以使用该 Zone 下的所有配置。多个 Listener 可以共享同一个 Zone',
    en: 'The configuration group to which the listener belongs. A Zone defines a set of configuration items (such as the maximum number of connections), and a Listener can specify a Zone to use all the configurations in the Zone. Multiple Listeners can share the same Zone.',
  },
  mqttPath: {
    zh: 'WebSocket 连接的路径，例如 /mqtt，作用是指定 WebSocket 连接的路径，以便在服务器上找到正确的 WebSocket 端点。<br/>在路径末尾添加 `/[...]` 将使 EMQX 接受任何子路径。<br/>例如，指定 `mqtt/[...]` 将允许客户端连接到 `mqtt/org1` 或 `mqtt/group2` 等路径。<br/>注意：未匹配的路径将导致客户端在 HTTP 层立即被拒绝，这意味着在 MQTT 层无法追踪它。',
    en: 'The path of the WebSocket connection, such as /mqtt, is used to specify the path of the WebSocket connection so that the correct WebSocket endpoint can be found on the server. <br/>Append `/[...]` to the end of the path to make EMQX accept any subpath.<br/>For example, specifying `mqtt/[...]` would allow clients to connect at paths like `mqtt/org1` or `mqtt/group2`, etc.<br/>NOTE: An unmatched path will cause the client to be rejected immediately at the HTTP layer,    meaning it will not be traceable at the MQTT layer.',
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
  clusterType: {
    zh: '集群方式',
    en: 'Cluster Type',
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
    en: 'Console Log',
  },
  file: {
    zh: '文件日志',
    en: 'File Log',
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
}
