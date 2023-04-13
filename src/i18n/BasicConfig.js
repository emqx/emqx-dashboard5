export default {
  mqtt: {
    zh: 'MQTT',
    en: 'MQTT',
  },
  cluster: {
    zh: '集群',
    en: 'Cluster',
  },
  zone: {
    zh: 'Zone',
    en: 'Zone',
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
    zh: 'WebSocket 连接的路径，例如 /mqtt，作用是指定 WebSocket 连接的路径，以便在服务器上找到正确的 WebSocket 端点',
    en: 'The path of the WebSocket connection, such as /mqtt, is used to specify the path of the WebSocket connection so that the correct WebSocket endpoint can be found on the server.',
  },
  confirmRemove: {
    zh: '此操作将移除 {name}，是否继续？',
    en: 'This will remove {name}, continue?',
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
  newBucket: {
    zh: '新建桶',
    en: 'New Bucket',
  },
  bucketName: {
    zh: '桶名称',
    en: 'Bucket Name',
  },
  duplicateBucket: {
    zh: '复制桶',
    en: 'Duplicate Bucket',
  },
  bucketNameRequired: {
    zh: '请输入桶名称',
    en: 'Bucket name is required',
  },
  bucketNameExist: {
    zh: '桶已存在',
    en: 'Bucket already exists',
  },
  dashboardHttpTip: {
    zh: '部分参数修改后，可能需要重新启动 EMQX Dashboard ！',
    en: 'Some parameters need to be restarted EMQX Dashboard to take effect!',
  },
  limierNameRegError: {
    zh: '请输入由字母和数字组成的名称',
    en: 'Please enter a name composed of letters and numbers',
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
  rateConfigDesc: {
    zh: '对于当前节点下的所有资源消耗速率设置',
    en: 'For all resource usage rate settings applicable to the current node in the cluster.',
  },
  connectionTitle: {
    zh: '连接',
    en: 'Connection',
  },
  clientRateConfigDesc: {
    zh: '对于当前节点下的单个连接的速率限制',
    en: 'Rate limit for an individual connection under the current node.',
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
  console_handler: {
    zh: '控制台日志',
    en: 'Console Log',
  },
  file_handlers: {
    zh: '文件日志',
    en: 'File Log',
  },
  bytes_in: {
    zh: '流入字节速率',
    en: 'Bytes In',
  },
  message_in: {
    zh: '消息速率',
    en: 'Message In',
  },
  connection: {
    zh: '连接速率',
    en: 'Connection',
  },
  message_routing: {
    zh: '消息路由速率',
    en: 'Message Routing',
  },
  internal: {
    zh: '内部功能',
    en: 'Internal',
  },
}
