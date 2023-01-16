export default {
  createBridge: {
    zh: '创建数据桥接',
    en: 'Create Data Bridge',
  },
  editBridge: {
    zh: '编辑数据桥接',
    en: 'Edit Data Bridge',
  },
  updateBridgeTip: {
    zh: '更新桥接会导致重新启动，缓存中未发送和重启过程中新收到的消息会丢失，是否确认更新？',
    en: 'Updating bridge configuration will cause the bridge to restart. The buffered messages, and newly received messages during the restart will not be bridged. Continue?',
  },
  create: {
    zh: '创建',
    en: 'Create',
  },
  backDataBridge: {
    zh: '返回 Data Bridge 列表',
    en: 'Back To Data Bridge List',
  },
  bridgeType: {
    zh: 'Data Bridge 类型',
    en: 'Type of Data Bridge',
  },
  dataBridge: {
    zh: '数据桥接',
    en: 'Data bridge',
  },
  useDataBridge: {
    zh: '使用数据桥接转发',
    en: 'Forwarding with Data Bridge',
  },
  chooseBridgeType: {
    zh: '选择 Data Bridge 类型',
    en: 'Choose The Type of Data Bridge',
  },
  direction: {
    zh: '方向',
    en: 'Direction',
  },
  SuccessNum: {
    zh: '成功数',
    en: 'Success',
  },
  ErrNum: {
    zh: '失败数',
    en: 'Failed',
  },
  noMatch: {
    zh: '不匹配',
    en: 'No match',
  },
  rateNow: {
    zh: '当前速率',
    en: 'Rate',
  },
  status: {
    zh: '资源状态',
    en: 'Resource Status',
  },
  configuration: {
    zh: '配置信息',
    en: 'Configuration',
  },
  bridgeDescHTTP: {
    zh: '发送数据到 Webhook',
    en: 'Send data to Webhook',
  },
  bridgeDescMQTT: {
    zh: '使用 MQTT 桥接数据',
    en: 'Using MQTT to bridge data',
  },
  baseInfo: {
    zh: '基本信息',
    en: 'Basic',
  },
  mappingInfo: {
    zh: '映射配置',
    en: 'Mappings',
  },
  mappingDesc: {
    zh: '配置 Topic 映射，实现本地-远程 Broker 数据移动',
    en: 'Configure topic mapping for local-remote broker data exchange',
  },
  reqSetting: {
    zh: '请求参数',
    en: 'Request Settings',
  },
  method: {
    zh: '请求方法',
    en: 'Method',
  },
  connType: {
    zh: '连接类型',
    en: 'Connection Type',
  },
  bridgeNum: {
    zh: 'Data Bridge 数量',
    en: 'Total Data Bridge',
  },
  connName: {
    zh: '连接名称',
    en: 'Connector Name',
  },
  connParams: {
    zh: '连接参数',
    en: 'Connection',
  },
  brokerAddress: {
    zh: 'MQTT 服务地址',
    en: 'MQTT Broker',
  },
  mqttVer: {
    zh: 'MQTT 协议版本',
    en: 'MQTT Version',
  },
  connMode: {
    zh: '连接模式',
    en: 'Mode',
  },
  cleanStart: {
    zh: '清除会话',
    en: 'Clean start',
  },
  bridgeMode: {
    zh: '桥接模式',
    en: 'Bridge Mode',
  },
  connSetting: {
    zh: '连接配置',
    en: 'Connection Settings',
  },
  httpPipeline: {
    zh: 'HTTP 管道',
    en: 'HTTP Pipelining',
  },
  connTimeout: {
    zh: '连接超时',
    en: 'Connect Timeout',
  },
  reqTimeout: {
    zh: '请求超时',
    en: 'Request Timeout',
  },
  errRetry: {
    zh: '错误重试次数',
    en: 'Error Retries',
  },
  mqttConn: {
    zh: 'MQTT 服务',
    en: 'MQTT Server',
  },
  newConn: {
    zh: '创建连接',
    en: 'New Connector',
  },
  editConn: {
    zh: '编辑连接',
    en: 'Edit Connector',
  },
  selectPlease: {
    zh: '请选择',
    en: 'Select One Please',
  },
  name: {
    zh: '名称',
    en: 'Name',
  },
  createRule: {
    zh: '创建规则',
    en: 'Create Rule',
  },
  mode_cluster_shareload: {
    zh: '节点独立连接',
    en: 'Cluster Shareload',
  },
  mode_cluster_singleton: {
    zh: '集群共享模式',
    en: 'Cluster Singleton',
  },
  listTable: {
    zh: '列表展示',
    en: 'List',
  },
  topology: {
    zh: '拓扑图',
    en: ' Topology',
  },
  createdAt: {
    zh: '创建时间',
    en: 'Created At',
  },
  note: {
    zh: '备注',
    en: 'Note',
  },
  filterData: {
    zh: '筛选数据',
    en: 'Filter Data',
  },
  action: {
    zh: '动作',
    en: 'Action',
  },
  actions: {
    zh: '动作',
    en: 'Actions',
  },
  actionDesc: {
    zh: '将处理结果输出到数据桥接或内置函数中。',
    en: 'Output the processing result to a data bridge or built-in function.',
  },
  addAction: {
    zh: '添加动作',
    en: 'Add Action',
  },
  consoleOutput: {
    zh: '控制台输出',
    en: 'Console Output',
  },
  outputResult: {
    zh: '输出结果',
    en: 'Output Result',
  },
  outputResultDesc: {
    zh: '运行测试后，根据测试数据输出规则 SQL 的处理结果。',
    en: 'After executing the test, output the result of processing the rule SQL using the test data.',
  },
  testData: {
    zh: '输入测试数据',
    en: 'Input Test Data',
  },
  testDataDesc: {
    zh: '输入并模拟运行时的使用数据，点击运行测试按钮后开始规则的 SQL 测试，结果将在输出结果中展示。',
    en: 'Enter the data needed to run, and then click the Run Test button to test the rule SQL. The result will be shown in the Output Result.',
  },
  testPassed: {
    zh: '测试通过',
    en: 'Test Passed',
  },
  resetData: {
    zh: '重置数据',
    en: 'Reset data',
  },
  rule: {
    zh: '规则',
    en: 'rule',
  },
  resetMetricsConfirm: {
    zh: '是否确认重置该{target}统计数据？',
    en: 'Are you sure you want to reset this {target} statistic?',
  },
  resetSuccessfully: {
    zh: '重置成功',
    en: 'Reset successfully',
  },
  formatJSON: {
    zh: 'JSON 格式化',
    en: 'Format JSON',
  },
  republish: {
    zh: '消息重发布',
    en: ' Republish',
  },
  paramSetting: {
    zh: '参数设置',
    en: 'Parameter',
  },
  selectOrInput: {
    zh: '请选择或直接输入',
    en: 'Select or input directly',
  },
  editAction: {
    zh: '编辑动作',
    en: 'Edit The Action',
  },
  testsql: {
    zh: '运行测试',
    en: 'Run Test',
  },
  sqlMode: {
    zh: 'SQL 模式',
    en: 'SQL Mode',
  },
  sqlEditor: {
    zh: 'SQL 编辑器',
    en: 'SQL Editor',
  },
  backToBridggeList: {
    zh: '返回 Bridge 列表',
    en: 'Back To Bridge List',
  },
  messages: {
    zh: '消息',
    en: 'Messages',
  },
  changeSqlMethod: {
    zh: '切换 SQL 编辑',
    en: 'Switch SQL Edit',
  },
  changeFormMethod: {
    zh: '切换表单编辑',
    en: 'Switch Form Edit',
  },
  dataSource: {
    zh: '数据来源',
    en: 'Data Source',
  },
  dataSourceDesc: {
    zh: '选择一个消息事件或数据桥接作为测试数据源，确保它与规则的 SQL 保持一致。',
    en: `Select a message event or data bridge as the data source for testing, ensuring that it is consistent with the rule's SQL.`,
  },
  addDataSource: {
    zh: '添加数据来源',
    en: 'Add data source',
  },
  select: {
    zh: '数据转换',
    en: 'Select',
  },
  where: {
    zh: '条件',
    en: 'Where',
  },
  type: {
    zh: '类型',
    en: 'Type',
  },
  sqlPassed: {
    zh: '通过',
    en: 'Passed',
  },
  sqlPassedDesc: {
    zh: '成功执行并输出结果',
    en: 'Executes successfully and outputs the result',
  },
  matched: {
    zh: '命中',
    en: 'Matched',
  },
  sqlMatchedDesc: {
    zh: '规则启用后的执行次数',
    en: 'The number of executions after the rule is enabled',
  },
  bridgeMatchedDesc: {
    zh: 'Bridge 被匹配到（被请求）的次数',
    en: 'Count of this bridge is matched and queried',
  },
  sqlFailed: {
    zh: '失败',
    en: 'Failed',
  },
  sqlFailedDesc: {
    zh: '因语法或函数调用失败导致执行失败',
    en: 'Execution failed due to syntax or function call failure',
  },
  sqlNoResult: {
    zh: '无结果',
    en: 'No Result',
  },
  sqlNoResultDesc: {
    zh: '成功执行但没有输出结果',
    en: 'Executes Successfully But No Output Results',
  },
  rateLast5M: {
    zh: '最近 5 分钟速率',
    en: 'Rate in the Last 5 Minutes',
  },
  sent: {
    zh: '已发送',
    en: 'Sent',
  },
  sentDesc: {
    zh: '已经发送出去的消息个数',
    en: 'Count of messages that are sent by this bridge',
  },
  dropped: {
    zh: '已丢弃',
    en: 'Dropped',
  },
  droppedDesc: {
    zh: '被丢弃的消息个数',
    en: 'Count of messages dropped',
  },
  retried: {
    zh: '已重试',
    en: 'Retried',
  },
  retriedDesc: {
    zh: '从队列或者飞行窗口里重试的次数',
    en: 'Times of retried from the queue or the inflight window',
  },
  queuing: {
    zh: '已缓存',
    en: 'Queuing',
  },
  queuingDesc: {
    zh: '当前被缓存到磁盘队列的消息个数',
    en: 'Count of messages that are currently queuing',
  },
  sentSuccessfully: {
    zh: '发送成功',
    en: 'Sent Successfully',
  },
  sentSuccessfullyDesc: {
    zh: '已经发送成功的消息个数',
    en: 'Count of messages that sent successfully',
  },
  sentFailed: {
    zh: '发送失败',
    en: 'Sent Failed',
  },
  sentFailedDesc: {
    zh: '发送失败的消息个数',
    en: 'Count of messages that sent failed',
  },
  sentInflight: {
    zh: '已发送未确认',
    en: 'Sent Inflight',
  },
  sentInflightDesc: {
    zh: '已异步地发送但没有收到 ACK 的消息个数',
    en: 'Count of messages that were sent asynchronously but ACKs are not received',
  },
  received: {
    zh: '已接收',
    en: 'Received',
  },
  receivedDesc: {
    zh: '从远程系统收到的消息个数',
    en: 'Count of messages that is received from the remote system',
  },
  rateMax: {
    zh: '最大速率',
    en: 'Maximum Rate',
  },
  activated: {
    zh: '已启用',
    en: 'Activated',
  },
  deactivated: {
    zh: '未启用',
    en: 'Deactivated',
  },
  input: {
    zh: '输入',
    en: 'Input',
  },
  source: {
    zh: '输入',
    en: 'Source',
  },
  success: {
    zh: '成功',
    en: 'Success',
  },
  connected: {
    zh: '已连接',
    en: 'Connected',
  },
  disconnected: {
    zh: '已断开',
    en: 'Disconnected',
  },
  connecting: {
    zh: '连接中',
    en: 'Connecting',
  },
  SQL: {
    zh: 'SQL 语句',
    en: 'SQL',
  },
  ruleSQLDesc: {
    zh: '使用 SQL 语句实时提取、过滤、丰富和转换设备与业务系统之间的数据。',
    en: 'Use SQL to extract, filter, enrich, and transform data in real-time between devices and business systems.',
  },
  sqlEdit: {
    zh: '了解更多 SQL 语法，请参考 ',
    en: 'To learn more about SQL, see our ',
  },
  sqlSyntaxAndTem: {
    zh: 'SQL 语法与示列。',
    en: 'SQL syntax and templates.',
  },
  overview: {
    zh: '概览',
    en: 'Overview',
  },
  viewSQL: {
    zh: '查看当前数据源下的 SQL 例子',
    en: 'View SQL example under the current data source',
  },
  sqlExample: {
    zh: 'SQL 例子',
    en: 'SQL Example',
  },
  statistics: {
    zh: '统计',
    en: 'Statistics',
  },
  executionStatistics: {
    zh: '运行统计',
    en: 'Execution Statistics',
  },
  actionsStatistics: {
    zh: '动作统计',
    en: 'Actions Statistics',
  },
  nodeStatus: {
    zh: '节点状态',
    en: 'Node Status',
  },
  resetStatistics: {
    zh: '重置统计数据',
    en: 'Reset statistics',
  },
  lastResetTime: {
    zh: '上次重置时间',
    en: 'Last reset time',
  },
  nodeStatusBridgeDesc: {
    zh: '每个节点上 Data Bridge 状态和执行情况',
    en: 'Data Bridge status and execution on each node',
  },
  nodeStatusRuleDesc: {
    zh: '每个节点上规则状态和执行情况',
    en: 'Rules status and execution on each node',
  },
  reconnect: {
    zh: '重连',
    en: 'Reconnect',
  },
  remoteTopic: {
    zh: '远程主题',
    en: 'Remote Topic',
  },
  ingress: {
    zh: '入口配置',
    en: 'Ingress',
  },
  egress: {
    zh: '出口配置',
    en: 'Egress',
  },
  localBroker: {
    zh: '本地 MQTT 服务',
    en: 'Local MQTT Broker',
  },
  remoteBroker: {
    zh: '远程 MQTT 服务',
    en: 'Remote MQTT Broker',
  },
  ingressDesc: {
    zh: '支持从外部的远程 MQTT 服务桥接消息到本地服务，可用于规则的数据源。',
    en: 'Bridges messages from remote MQTT broker to local, can be used as data source for rule.',
  },
  ingressHelp: {
    zh: '开启后，远程服务将作为数据源，本地服务将作为数据目的地接收消息，当出口配置启用后，该配置可选。',
    en: "When enabled, remote broker will be the data source, local broker will be the data destination to received messages, it's optional when egress is enabled.",
  },
  egressDesc: {
    zh: '支持将本地服务消息桥接至外部的远程 MQTT 服务，可用于规则的动作中。',
    en: 'Bridges local messages to remote MQTT broker, can be used as action for rule.',
  },
  egressHelp: {
    zh: '开启后，远程服务将作为数据目的地接收本地服务的消息，当入口配置启用后，该配置可选。',
    en: 'When enabled, remote broker will be the data destination to received local messages, it’s optional when ingress is enabled.',
  },
  remoteTopicRequired: {
    zh: '请至少配置一个入口或出口配置中的远程服务主题',
    en: 'Please configure at least one remote topic in ingress or egress',
  },
  remoteTopicRepeated: {
    zh: '入口和出口配置的远程 MQTT 主题相同',
    en: 'The same remote MQTT topics are configured for ingress and egress',
  },
  bridgeUsage: {
    zh: '如何使用桥接',
    en: 'How to use Bridge',
  },
  localTopic: {
    zh: '本地主题',
    en: 'Local Topic',
  },
  username: {
    zh: '用户名',
    en: 'Username',
  },
  password: {
    zh: '密码',
    en: 'Password',
  },
  reconnectInterval: {
    zh: '重连间隔',
    en: 'Reconnect Interval',
  },
  retryInterval: {
    zh: '消息重发间隔',
    en: 'Message Resend Interval',
  },
  descForCreateConnector: {
    zh: '连接配置可以在 Data Bridge 中复用',
    en: 'Connector can be reused in data bridge',
  },
  tip: {
    zh: '提示：',
    en: 'Tip:',
  },
  clientIDDesc: {
    zh: '由于 MQTT 客户端 ID 不允许重复，如果填写了客户端 ID，使用节点独享连接模式时，EMQ X 会在客户端 ID 后添加随机字符串。',
    en: 'Since the MQTT client ID does not allow duplicates, EMQ X will add a random string after the client ID when using cluster singleton connection mode if the client ID is filled in.',
  },
  clientIDPlaceholder: {
    zh: '留空则自动生成',
    en: 'Empty will be automatically generated',
  },
  testTheConnection: {
    zh: '测试连接',
    en: 'Test',
  },
  test: {
    zh: '启用调试',
    en: 'Enable Test',
  },
  testTip: {
    zh: '启用调试后，可模拟数据源数据，并查看测试规则 SQL 的结果。',
    en: 'Test enabled, simulate data source and view the test rule SQL result.',
  },
  testDesc: {
    zh: '在创建规则之前，您可以使用测试数据来执行您刚才编辑的 SQL。这样可以帮助您确保结果符合预期，并且可以放心地创建并使用规则。',
    en: 'Before creating a rule, you can test rule SQL by using test data. This will help ensure that the results meet your expectations and allow you to confidently use the rule.',
  },
  connectionSuccessful: {
    zh: '连接成功',
    en: 'Connection is successful',
  },
  outBridgeLocalTopicPlaceholder: {
    zh: '需要转发的主题，不填则由 Rule 指定',
    en: 'The topic that needs to be forwarded, will be specified by Rule if empty',
  },
  inBridgeLocalTopicPlaceholder: {
    zh: '默认由 Rule 处理',
    en: 'It is handled by Rule by default',
  },
  remoteTopicPlaceholder: {
    zh: '桥接数据到远程 Broker 中',
    en: 'Bridges data to remote broker.',
  },
  payload: {
    zh: '消息模版',
    en: 'Payload',
  },
  payloadDesc: {
    zh: "支持使用 ${'{'}field{'}'} 语法读取数据。",
    en: "Supports reading data using ${'{'}field{'}'} syntax.",
  },
  payloadExample: {
    zh: "例如：${'{'}payload{'}'}, ${'{'}clientid{'}'}, ${'{'}topic{'}'}, ${'{'}username{'}'} 等。请根据使用数据桥接的业务需求来选择字段，置空则原样转发消息。",
    en: "For example: ${'{'}payload{'}'}, ${'{'}clientid{'}'}, ${'{'}topic{'}'} , ${'{'}username{'}'}, etc. Use fields according to the data bridges requirements of your business and forwards the message as it is if it is empty.",
  },
  ingressRemoteTopicDesc: {
    zh: '本地服务将订阅该远程服务的主题接收消息。',
    en: 'The local broker will subscribe to the remote broker topic to receive messages.',
  },
  egressRemoteTopicDesc: {
    zh: "本地服务将向该远程服务中的主题发布消息，支持使用 ${'{'}field{'}'} 语法，拼接使用动态主题。",
    en: "The local broker will publish messages to the remote broker topic, supports using ${'{'}field{'}'} syntax to use the dynamic topics.",
  },
  ingressLocalTopicDesc: {
    zh: '订阅该本地服务的主题，可以直接接收远程服务的消息而不用使用规则，如不填写则由规则指定。（可选）',
    en: 'Subscribe to the local broker topic to receive messages from the remote broker without using rules, if not it will be specified by the rule. (Optional)',
  },
  egressLocalTopicDesc: {
    zh: '向该本地服务的主题发布消息，可以直接向远程服务发送消息而不用使用规则，如不填写则由规则指定。（可选）',
    en: 'Publish messages to the local broker topic to send messages to the remote broker without using rules, if not it will be specified by the rule. (Optional)',
  },
  duplicate: {
    zh: '复制',
    en: 'Duplicate',
  },
  SQLTemplates: {
    zh: 'SQL 示例',
    en: 'SQL Examples',
  },
  commonSQLTemplates: {
    zh: '常用 SQL 示例',
    en: 'Common SQL Examples',
  },
  useSQL: {
    zh: '使用 SQL',
    en: 'Use this SQL',
  },
  usageScenarios: {
    zh: '应用场景',
    en: 'Usage scenarios',
  },
  exampleOfInput: {
    zh: '输入消息示例',
    en: 'Example of input message',
  },
  processedResults: {
    zh: '处理结果',
    en: 'Processed results',
  },
  customTopic: {
    zh: '自定义主题',
    en: 'Custom topic',
  },
  events: {
    zh: '事件',
    en: 'Events',
  },
  eventsDesc: {
    zh: '规则可以通过 MQTT 消息、事件或数据桥来触发。在 SQL 中，多个数据源可以使用逗号分隔。',
    en: 'Rules can be triggered by MQTT messages, events, or data bridges. In SQL, multiple data sources can be separated with commas.',
  },
  useEvent: {
    zh: '使用事件',
    en: 'Use event',
  },
  messagePublishDesc: {
    zh: '当消息发布到指定的一个或多个主题时触发规则，SQL 语句中可直接使用 MQTT 主题',
    en: 'Trigger rule when a message is published to one or more of the specified topics, and the MQTT topic can be used directly in the SQL',
  },
  messageDeliveredDesc: {
    zh: '当消息被放入底层 socket 时触发规则',
    en: 'Trigger the rule when a message is put into the underlying socket',
  },
  messageAckedDesc: {
    zh: '当消息发送到客户端，并收到客户端回复的 ACK 时触发规则，仅 QoS1，QoS2 会触发',
    en: `The rule is triggered when the message is sent to the client and an ack is received from the client. Only QoS1 and QoS2 messages will be triggered`,
  },
  messageDroppedDesc: {
    zh: '当一条消息无任何订阅者时触发规则',
    en: `Trigger rule when a message has no subscribers`,
  },
  deliveryDroppedDesc: {
    zh: '当订阅者的消息队列已满时触发规则',
    en: `Trigger rule when subscriber's message queue is full`,
  },
  clientConnectedDesc: {
    zh: '当终端连接成功时触发规则',
    en: `Trigger the rule when the terminal is connected successfully`,
  },
  clientDisconnectedDesc: {
    zh: '当终端连接断开时触发规则',
    en: `Trigger rule when terminal connection is lost`,
  },
  clientConnackDesc: {
    zh: '当服务端向客户端发送 CONNACK 报文时触发规则，reason_code 包含各种错误原因代码',
    en: `The rule event is triggered when the server sends a CONNACK packet to the client. reason_code contains the error reason code.`,
  },
  clientCheckAuthzCompleteDesc: {
    zh: '当客户端鉴权结束时触发规则',
    en: `The rule event is triggered when the client check acl complete.`,
  },
  sessionSubscribedDesc: {
    zh: '当终端订阅成功时触发规则',
    en: `Trigger the rule when the terminal subscribes successfully`,
  },
  sessionUnsubscribedDesc: {
    zh: '当取消终端订阅成功时触发规则',
    en: `Triggered when the terminal subscription is cancelled successfully`,
  },
  useBridge: {
    zh: '使用桥接',
    en: 'Use bridge',
  },
  bridgeForInputDesc: {
    zh: '当桥接从外部服务接收到消息时触发规则。',
    en: 'Triggered when a message is received from remote server.',
  },
  clientEvent: {
    zh: '客户端事件',
    en: 'Client event',
  },
  dataTypeSQLNoMatch: {
    zh: '数据源与当前输入的 SQL 不匹配',
    en: `Data source doesn't match the entered SQL`,
  },
  parametersPreview: {
    zh: '配置预览',
    en: 'Configuration Preview',
  },
  backBridgeList: {
    zh: '返回 Bridge 列表',
    en: 'Back To Bridge List',
  },
  backRuleEdit: {
    zh: '返回规则编辑',
    en: 'Back To Rule Editing',
  },
  backToRuleCreation: {
    zh: '返回规则创建',
    en: 'Back To Rule Creation',
  },
  readMore: {
    zh: '了解更多',
    en: 'Read More',
  },
  bridgeDataInDesc: {
    zh: '你想转发哪个主题的数据？',
    en: 'Which topic do you want to forward data on?',
  },
  bridgeDataOutDesc: {
    zh: '你想将数据转发到什么地方？',
    en: 'Where do you want to forward the data to?',
  },
  mqttSourceMappingDesc: {
    zh: '你想从哪个地方获取数据？',
    en: 'Where do you want to get the data from?',
  },
  mqttSourceTransDesc: {
    zh: '是否将数据转发至本地主题？',
    en: 'Would you like forward messages to a local topic?',
  },
  mqttSourceTransDescDetail: {
    zh: '不经规则处理直接将远程主题数据转发至本地主题中。',
    en: 'Directly forward Remote Topic messages to local topic without Rule processing.',
  },
  mqttSourceForwardLabel: {
    zh: '你想将数据转发至何处？',
    en: 'Where do you want to forward messages to?',
  },
  iotAndLocalTopic: {
    zh: '在规则内或独立使用',
    en: 'Use in Rules or Separate',
  },
  justIot: {
    zh: '仅在规则内使用',
    en: 'Just for Rules',
  },
  mqttSourceForwardLocalTopicDesc: {
    zh: '从远程主题获取数据，并将数据转发至本地主题或接入到规则内（MQTT 作为数据源）',
    en: 'Forward messages from the Remote Topic, and forward messages to Local Topic or Rules (MQTT Source)',
  },
  mqttSourceNotForwardLocalTopicDesc: {
    zh: '从远程主题获取数据后转发至规则内，不可单独使用（MQTT 作为数据源）',
    en: 'Forward messages from the Remote Topic to Rules, cannot be used separately (MQTT Source)',
  },
  mqttSinkForwardLocalTopicDesc: {
    zh: '从本地主题或规则内转发数据，独立使用时将不经过规则处理，直接转发原始数据到远程主题（MQTT 作为数据目标）',
    en: 'Forward messages from Local Topic or Rules, without Rules processing, directly forward the original data to Remote Topic (MQTT Sink)',
  },
  mqttSinkNotForwardLocalTopicDesc: {
    zh: '数据仅支持通过规则处理后转发到远程主题，不可单独使用（MQTT 作为数据目标）',
    en: 'Forward messages from the Rules, and forward messages to Remote Topic (MQTT Sink)',
  },
  bridgeSinkFromLabel: {
    zh: '你想从什么地方转发数据？',
    en: 'Where do you want to forward messages from?',
  },
  bridgeSinkForwardFromLocalTopicDesc: {
    zh: '从本地主题或规则中转发数据，独立使用时将不经过规则处理，直接转发原始数据',
    en: 'Forward messages from the Local Topic or Rules, without Rules processing, directly forward the original data',
  },
  bridgeSinkNotForwardFromLocalTopicDesc: {
    zh: '数据仅支持通过规则处理后转发，不可单独使用',
    en: 'Just forward messages from Rules, not separate',
  },
  headers: {
    zh: '请求头',
    en: 'Headers',
  },
  body: {
    zh: '请求体',
    en: 'Body',
  },
  forwardFromLocalTopic: {
    zh: '从本地主题转发',
    en: 'Forward from Local Topic',
  },
  httpBridgeURLFieldDesc: {
    zh: "支持使用 ${'{'}field{'}'} 语法提取数据拼接 URL",
    en: "Supports extracting data concatenated URLs using the ${'{'}field{'}'} syntax",
  },
  mqttSourceLocalTopicLabel: {
    zh: '要将消息发送到的本地主题',
    en: 'The local topic where you want to send messages to',
  },
  useSQLInput: {
    zh: '使用 SQL',
    en: 'Use SQL',
  },
  useBridgeCreateRule: {
    zh: '是否使用该数据桥接创建规则？',
    en: 'Would you like to create a Rule using this Data Bridge?',
  },
  console: {
    zh: '打印结果输出到控制台',
    en: 'Print the result to the Console',
  },
  total: {
    zh: '总数',
    en: 'Total',
  },
  actionTotalDesc: {
    zh: '规则调用操作的次数。 此值可能是“命中”的数倍，具体取决于规则的操作数',
    en: "How many times the actions are called by the rule. This value may several times of 'matched', depending on the number of the actions of the rule",
  },
  actionSuccessDesc: {
    zh: '规则成功调用操作的次数',
    en: 'The number of times the rule has successfully called the action',
  },
  actionFailedDesc: {
    zh: '规则调用操作失败的次数',
    en: 'The number of times the rule calling operation has failed',
  },
  outOfService: {
    zh: '服务中止',
    en: 'Out of Service',
  },
  actionOutOfServiceDesc: {
    zh: '由于操作停止服务而导致规则调用操作失败的次数。 例如，数据桥接被禁用或停止。',
    en: 'The number of times the rule calling action failed due to the action being out of service. For example, a bridge is disabled or stopped.',
  },
  unknown: {
    zh: '未知',
    en: 'Unknown',
  },
  actionUnknownDesc: {
    zh: '由于未知错误导致的 SQL 失败次数',
    en: 'Number of SQL failures due to an unknown error',
  },
  deleteBridgeSecondConfirm: {
    zh: '当前数据桥接正在被以下规则使用，若继续删除，将在规则内移除当前数据桥接',
    en: 'This data bridge is being used by the following rules, if it continues to be deleted, the data bridge will be removed within the rule',
  },
  rateUnit: {
    zh: 'message/sec | messages/sec',
    en: 'message/sec | messages/sec',
  },
  influxDBLabel: {
    zh: 'InfluxDB',
    en: 'InfluxDB',
  },
  mySQL: {
    zh: 'MySQL',
    en: 'MySQL',
  },
  influxDBVersion: {
    zh: 'InfluxDB 版本',
    en: 'Version of InfluxDB',
  },
  kafka: {
    zh: 'Kafka',
    en: 'Kafka',
  },
  kafkaDesc: {
    zh: '桥接数据到 Kafka',
    en: 'Bridge data to Kafka',
  },
  redis: {
    zh: 'Redis',
    en: 'Redis',
  },
  gcpPubSub: {
    zh: 'Google PubSub',
    en: 'Google PubSub',
  },
  mongoDB: {
    zh: 'MongoDB',
    en: 'MongoDB',
  },
  gcpPubSubDesc: {
    zh: '桥接数据到 Google PubSub',
    en: 'Bridge data to Goole PubSub',
  },
  egressDataBaseDesc: {
    zh: '将数据保存到 {name}',
    en: 'Save data to {name}',
  },
  serverHost: {
    zh: '服务器地址',
    en: 'Server Host',
  },
  serverHostDesc: {
    en: 'The IPv4 or IPv6 address or the hostname to connect to.</br>A host entry has the following form: `Host[:Port]`.</br>The InfluxDB default port 8086 is used if `[:Port]` is not specified.</br>',
    zh: '将要连接的 IPv4 或 IPv6 地址，或者主机名。</br>主机名具有以下形式：`Host[:Port]`。</br>如果未指定 `[:Port]`，则使用 InfluxDB 默认端口 8086。</br>',
  },
  database: {
    en: 'Database',
    zh: '数据库',
  },
  databaseDesc: {
    en: 'InfluxDB database.',
    zh: 'InfluxDB 数据库。',
  },
  precision: {
    en: 'Time Precision',
    zh: '时间精度',
  },
  precisionDesc: {
    en: 'InfluxDB time precision.',
    zh: 'InfluxDB 时间精度。',
  },
  dataDefinition: {
    zh: '定义解析数据',
    en: 'Define Data Parsing',
  },
  dataDefinitionDesc: {
    zh: '指定数据格式与内容，使其能被解析并写入到 InfluxDB 中，支持使用占位符。',
    en: 'Specify the format and content of the data so that it can be parsed and written to InfluxDB, placeholder supported.',
  },
  dataFormat: {
    zh: '数据格式',
    en: 'Data Format',
  },
  writeSyntax: {
    en: 'Write Syntax',
    zh: '写语句',
  },
  writeSyntaxDesc: {
    en: 'Conf of InfluxDB line protocol to write data points. It is a text-based format that provides the measurement, tag set, field set, and timestamp of a data point, and placeholder supported.</br>See also [InfluxDB 2.3 Line Protocol](https://docs.influxdata.com/influxdb/v2.3/reference/syntax/line-protocol/) and</br>[InfluxDB 1.8 Line Protocol](https://docs.influxdata.com/influxdb/v1.8/write_protocols/line_protocol_tutorial/) </br>TLDR:</br>```</br><measurement>[,<tag_key>=<tag_value>[,<tag_key>=<tag_value>]] <field_key>=<field_value>[,<field_key>=<field_value>] [<timestamp>]</br>```</br>',
    zh: '使用 InfluxDB API Line Protocol 写入 InfluxDB 的数据，支持占位符</br>参考 [InfluxDB 2.3 Line Protocol](https://docs.influxdata.com/influxdb/v2.3/reference/syntax/line-protocol/) 及</br>[InfluxDB 1.8 Line Protocol](https://docs.influxdata.com/influxdb/v1.8/write_protocols/line_protocol_tutorial/) </br>TLDR: </br>```</br><measurement>[,<tag_key>=<tag_value>[,<tag_key>=<tag_value>]] <field_key>=<field_value>[,<field_key>=<field_value>] [<timestamp>]</br>```</br>',
  },
  float: {
    zh: '浮点型',
    en: 'Float',
  },
  integer: {
    zh: '整型',
    en: 'Integer',
  },
  uInteger: {
    zh: '无符号整型',
    en: 'UInteger',
  },
  string: {
    zh: '字符串',
    en: 'String',
  },
  boolean: {
    zh: '布尔型',
    en: 'Boolean',
  },
  placeholder: {
    zh: '占位符',
    en: 'Placeholder',
  },
  healthCheckInterval: {
    en: 'Health Check Interval',
    zh: '健康检查间隔',
  },
  healthCheckIntervalDesc: {
    en: 'Health check interval, in milliseconds.',
    zh: '健康检查间隔，单位毫秒。',
  },
  autoRestartInterval: {
    en: 'Auto Restart Interval',
    zh: '自动重连间隔',
  },
  autoRestartIntervalDesc: {
    en: 'The auto restart interval after the resource is disconnected, in milliseconds.',
    zh: '资源断开以后，自动重连的时间间隔，单位毫秒。',
  },
  token: {
    en: 'Token',
    zh: 'Token',
  },
  tokenDesc: {
    en: 'InfluxDB token.',
    zh: 'InfluxDB token。',
  },
  usernameDesc: {
    en: 'InfluxDB username.',
    zh: 'InfluxDB 用户名。',
  },
  passwordDesc: {
    en: 'InfluxDB password.',
    zh: 'InfluxDB 密码。',
  },
  org: {
    en: 'Organization',
    zh: '组织',
  },
  orgDesc: {
    en: 'Organization name of InfluxDB.',
    zh: 'InfluxDB 组织名称。',
  },
  bucket: {
    en: 'Bucket',
    zh: 'Bucket',
  },
  bucketDesc: {
    en: 'InfluxDB bucket name.',
    zh: 'InfluxDB bucket 名称。',
  },
  authType: {
    zh: '认证方式',
    en: 'Auth Type',
  },
  basicAuth: {
    zh: '基础认证',
    en: 'Basic auth',
  },
  queryMode: {
    en: 'Query mode',
    zh: '请求模式',
  },
  queryModeDesc: {
    en: "Query mode. Optional 'sync/async', default 'sync'.",
    zh: "请求模式。可选 '同步/异步'，默认为'同步'模式。",
  },
  asyncInflightWindow: {
    zh: '异步请求飞行队列窗口',
    en: 'Async inflight window',
  },
  asyncInflightWindowDesc: {
    zh: '异步请求飞行队列窗口大小。',
    en: 'Async query inflight window.',
  },
  enableQueue: {
    en: 'Enable disk buffer queue',
    zh: '启用磁盘缓存队列',
  },
  enableQueueDesc: {
    en: `Enable disk buffer queue (only applicable for egress bridges).
When Enalbed, messages will be buffered on disk when the bridge connection is down.
When disabled the messages are buffered in RAM only.`,
    zh: '启用磁盘缓存队列（仅对 egress 方向桥接有用）。',
  },
  maxQueueBytes: {
    en: 'Queue max bytes',
    zh: '队列最大长度',
  },
  maxQueueBytesDesc: {
    en: 'Maximum queue storage.',
    zh: '消息队列的最大长度。',
  },
  enableBatch: {
    en: 'Enable batch',
    zh: '启用批量模式',
  },
  enableBatchDesc: {
    en: 'Batch mode enabled.',
    zh: '启用批量模式。',
  },
  batchSize: {
    en: 'Batch size',
    zh: '批量请求大小',
  },
  batchSizeDesc: {
    en: 'Maximum batch count.',
    zh: '批量请求大小。',
  },
  batchTime: {
    en: 'Batch time',
    zh: '批量等待间隔',
  },
  batchTimeDesc: {
    en: 'Maximum batch waiting interval.',
    zh: '最大批量请求等待时间。',
  },
  bootstrapHosts: {
    en: 'Bootstrap Hosts',
    zh: '主机列表',
  },
  bootstrapHostsDesc: {
    en: 'A comma separated list of Kafka <code>host[:port]</code> endpoints to bootstrap the client. Default port number is 9092.',
    zh: '用逗号分隔的 <code>host[:port]</code> 主机列表。默认端口号为 9092。',
  },
  workerPoolSize: {
    en: 'Buffer Pool Size',
    zh: '缓存池大小',
  },
  workerPoolSizeDesc: {
    en: `The number of buffer workers. Only applicable for egress type bridges. For bridges only have ingress direction data flow, it can be set to 0 otherwise must be greater than 0.`,
    zh: '缓存队列 worker 数量。仅对 egress 类型的桥接有意义。当桥接仅有 ingress 方向时，可设置为 0，否则必须大于 0）。',
  },
  minMetadataRefreshInterval: {
    en: 'Min Metadata Refresh Interval',
    zh: '元数据刷新最小间隔',
  },
  minMetadataRefreshIntervalDesc: {
    en: 'Minimum time interval the client has to wait before refreshing Kafka broker and topic metadata. Setting too small value may add extra load on Kafka.',
    zh: '刷新 Kafka broker 和 Kafka 主题元数据段最短时间间隔。设置太小可能会增加 Kafka 压力。',
  },
  metadataRequestTimeout: {
    en: 'Metadata Request Timeout',
    zh: '元数据请求超时',
  },
  metadataRequestTimeoutDesc: {
    en: 'Maximum wait time when fetching metadata from Kafka.',
    zh: '刷新元数据时最大等待时长。',
  },
  connectTimeoutDesc: {
    en: 'Maximum wait time for TCP connection establishment (including authentication time if enabled).',
    zh: '建立 TCP 连接时的最大等待时长（若启用认证，这个等待时长也包含完成认证所需时间）。',
  },
  kerberosPrincipal: {
    en: 'Kerberos Principal',
    zh: 'Kerberos Principal',
  },
  kerberosPrincipalDesc: {
    en: `SASL GSSAPI authentication Kerberos principal. For example <code>client_name{'@'}MY.KERBEROS.REALM.MYDOMAIN.COM</code>, NOTE: The realm in use has to be configured in /etc/krb5.conf in EMQX nodes.`,
    zh: `SASL GSSAPI 认证方法的 Kerberos principal，例如 <code>client_name{'@'}MY.KERBEROS.REALM.MYDOMAIN.COM</code>注意：这里使用的 realm 需要配置在 EMQX 服务器的 /etc/krb5.conf 中`,
  },
  kerberosKeytabFile: {
    en: 'Kerberos keytab file',
    zh: 'Kerberos keytab 文件',
  },
  filePathPlease: {
    zh: '请填写文件路径',
    en: 'Fill in the file path',
  },
  kerberosKeytabFileDesc: {
    en: 'SASL GSSAPI authentication Kerberos keytab file path. NOTE: This file has to be placed in EMQX nodes, and the EMQX service runner user requires read permission.',
    zh: 'SASL GSSAPI 认证方法的 Kerberos keytab 文件。注意：该文件需要上传到 EMQX 服务器中，且运行 EMQX 服务的系统账户需要有读取权限。',
  },
  mechanism: {
    en: 'Mechanism',
    zh: '认证方法',
  },
  mechanismDesc: {
    en: 'SASL authentication mechanism.',
    zh: 'SASL 认证方法名称。',
  },
  sndbuf: {
    en: 'Socket Send Buffer Size',
    zh: 'Socket 发送缓存大小',
  },
  sndbufDesc: {
    en: 'Fine tune the socket send buffer. The default value is tuned for high throughput.',
    zh: 'TCP socket 的发送缓存调优。默认值是针对高吞吐量的一个推荐值。',
  },
  recbuf: {
    en: 'Socket Receive Buffer Size',
    zh: 'Socket 收包缓存大小',
  },
  recbufDesc: {
    en: 'Fine tune the socket receive buffer. The default value is tuned for high throughput.',
    zh: 'TCP socket 的收包缓存调优。默认值是针对高吞吐量的一个推荐值。',
  },
  nodelay: {
    en: 'No Delay',
    zh: '是否延迟发送',
  },
  nodelayDesc: {
    en: "When set to 'true', TCP buffer sent as soon as possible. Otherwise, the OS kernel may buffer small TCP packets for a while (40 ms by default).",
    zh: "设置 ‘true' 让系统内核立即发送。否则当需要发送当内容很少时，可能会有一定延迟（默认 40 毫秒）。",
  },
  producer: {
    en: 'MQTT to Kafka',
    zh: 'MQTT 到 Kafka',
  },
  producerDesc: {
    en: 'Local MQTT data source and Kafka bridge configs.',
    zh: '本地 MQTT 数据源和 Kafka 桥接的配置。',
  },
  kafkaProducerTopic: {
    en: 'Source MQTT Topic',
    zh: '源 MQTT 主题',
  },
  kafkaProducerTopicDesc: {
    en: 'MQTT topic or topic as data source (bridge input).',
    zh: '指定 MQTT 主题作为桥接的数据源',
  },
  kafkaMessageKey: {
    zh: '消息的 Key',
    en: 'Message Key',
  },
  kafkaMessageKeyDesc: {
    zh: '生成 Kafka 消息 Key 的模版。如果模版生成后为空值，则会使用 Kafka 的 <code>NULL</code ，而非空字符串。',
    en: "Template to render Kafka message key. If the template is rendered into a NULL value (i.e. there is no such data field in Rule Engine context) then Kafka's <code>NULL</code> (but not empty string) is used.",
  },
  kafkaMessageValue: {
    zh: '消息的 Value',
    en: 'Message Value',
  },
  kafkaMessageValueDesc: {
    zh: '生成 Kafka 消息 Value 的模版。如果模版生成后为空值，则会使用 Kafka 的 <code>NULL</code ，而非空字符串。',
    en: "Template to render Kafka message value. If the template is rendered into a NULL value (i.e. there is no such data field in Rule Engine context) then Kafka's <code>NULL</code> (but not empty string) is used.",
  },
  kafkaMessageTimestamp: {
    zh: '消息的时间戳',
    en: 'Message Timestamp',
  },
  kafkaMessageTimestampDesc: {
    zh: "生成 Kafka 消息时间戳的模版。该时间必需是一个整型数值（可以是字符串格式）例如 <code>1661326462115</code> 或 <code>'1661326462115'</code>。当所需的输入字段不存在，或不是一个整型时，则会使用当前系统时间。",
    en: "Which timestamp to use. The timestamp is expected to be a millisecond precision Unix epoch which can be in string format, e.g. <code>1661326462115</code> or <code>'1661326462115'</code>. When the desired data field for this template is not found, or if the found data is not a valid integer, the current system timestamp will be used.",
  },
  maxBatchBytes: {
    en: 'Max Batch Bytes',
    zh: '最大批量字节数',
  },
  maxBatchBytesDesc: {
    en: "Maximum bytes to collect in a Kafka message batch. Most of the Kafka brokers default to a limit of 1 MB batch size. EMQX's default value is less than 1 MB in order to compensate Kafka message encoding overheads (especially when each individual message is very small). When a single message is over the limit, it is still sent (as a single element batch).",
    zh: '最大消息批量字节数。大多数 Kafka 环境的默认最低值是 1 MB，EMQX 的默认值比 1 MB 更小是因为需要补偿 Kafka 消息编码索需要的额外字节（尤其是当每条消息都很小的情况下）。当单个消息的大小超过该限制时，它仍然会被发送，（相当于该批量中只有单个消息）。',
  },
  compression: {
    en: 'Compression',
    zh: '压缩',
  },
  partitionStrategy: {
    en: 'Partition Strategy',
    zh: '分区选择策略',
  },
  partitionStrategyDesc: {
    en: 'Partition strategy is to tell the producer how to dispatch messages to Kafka partitions.<br/><br/><code>random</code>: Randomly pick a partition for each message<br/><code>key_dispatch</code>: Hash Kafka message key to a partition number<br/>',
    zh: '设置消息发布时应该如何选择 Kafka 分区。<br/><br/><code>random</code>: 为每个消息随机选择一个分区。<br/><code>key_dispatch</code>: Hash Kafka message key to a partition number<br/>',
  },
  requiredAcks: {
    en: 'Required Acks',
    zh: 'Kafka 确认数量',
  },
  requiredAcksDesc: {
    en: "Required acknowledgements for Kafka partition leader to wait for its followers before it sends back the acknowledgement to EMQX Kafka producer<br/><br/><code>all_isr</code>: Require all in-sync replicas to acknowledge.<br/><code>leader_only</code>: Require only the partition-leader's acknowledgement.<br/><code>none</code>: No need for Kafka to acknowledge at all.<br/>",
    zh: '设置 Kafka leader 在返回给 EMQX 确认之前需要等待多少个 follower 的确认。<br/><br/><code>all_isr</code>: 需要所有的在线复制者都确认。<br/><code>leader_only</code>: 仅需要分区 leader 确认。<br/><code>none</code>: 无需 Kafka 回复任何确认。<br/>',
  },
  partitionCountRefreshInterval: {
    en: 'Partition Count Refresh Interval',
    zh: '分区数量刷新间隔',
  },
  partitionCountRefreshIntervalDesc: {
    en: 'The time interval for Kafka producer to discover increased number of partitions.<br/>After the number of partitions is increased in Kafka, EMQX will start taking the <br/>discovered partitions into account when dispatching messages per <code>partition_strategy</code>.',
    zh: '配置 Kafka 刷新分区数量的时间间隔。<br/>EMQX 发现 Kafka 分区数量增加后，会开始按 <code>partition_strategy<code> 配置，把消息发送到新的分区中。',
  },
  maxInflight: {
    en: 'Max Inflight',
    zh: '飞行窗口',
  },
  maxInflightDesc: {
    en: 'Maximum number of batches allowed for Kafka producer (per-partition) to send before receiving acknowledgement from Kafka. Greater value typically means better throughput. However, there can be a risk of message reordering when this value is greater than 1.',
    zh: '设置 Kafka 生产者（每个分区一个）在收到 Kafka 的确认前最多发送多少个请求（批量）。调大这个值通常可以增加吞吐量，但是，当该值设置大于 1 是存在消息乱序的风险。',
  },
  bufferMode: {
    en: 'Buffer Mode',
    zh: '缓存模式',
  },
  bufferModeDesc: {
    en: 'Message buffer mode.</br></br><code>memory</code>: Buffer all messages in memory. The messages will be lost in case of EMQX node restart</br><code>disc</code>: Buffer all messages on disk. The messages on disk are able to survive EMQX node restart.</br><code>hybrid</code>: Buffer message in memory first, when up to certain limit (see <code>segment_bytes</code> config for more information), then start offloading messages to disk, Like <code>memory</code> mode, the messages will be lost in case of EMQX node restart.',
    zh: '消息缓存模式。</br><code>memory</code>: 所有的消息都缓存在内存里。如果 EMQX 服务重启，缓存的消息会丢失。</br><code>disc</code>: 缓存到磁盘上。EMQX 重启后会继续发送重启前未发送完成的消息。</br><code>hybrid</code>: 先将消息缓存在内存中，当内存中的消息堆积超过一定限制（配置项 <code>segment_bytes</code> 描述了该限制）后，后续的消息会缓存到磁盘上。与 <code>memory</code> 模式一样，如果 EMQX 服务重启，缓存的消息会丢失。',
  },
  perPartitionLimit: {
    en: 'Per-partition Buffer Limit',
    zh: 'Kafka 分区缓存上限',
  },
  perPartitionLimitDesc: {
    en: 'Number of bytes allowed to buffer for each Kafka partition. When this limit is exceeded, old messages will be dropped in a trade for credits for new messages to be buffered.',
    zh: '为每个 Kafka 分区设置的最大缓存字节数。当超过这个上限之后，老的消息会被丢弃，为新的消息腾出空间。',
  },
  segmentBytes: {
    en: 'Segment File Bytes',
    zh: '缓存文件大小',
  },
  segmentBytesDesc: {
    en: 'Applicable when buffer mode is set to <code>disk</code> or <code>hybrid</code>.</br>This value is to specify the size of each on-disk buffer file.',
    zh: '当缓存模式是 <code>disk</code> 或 <code>hybrid</code> 时适用。该配置用于指定缓存到磁盘上的文件的大小。',
  },
  memoryOverloadProtection: {
    en: 'Memory Overload Protection',
    zh: '内存过载保护',
  },
  memoryOverloadProtectionDesc: {
    en: 'Applicable when buffer mode is set to <code>memory</code> or <code>hybrid</code>.</br>EMQX will drop old cached messages under high memory pressure. The high memory threshold is defined in config <code>sysmon.os.sysmem_high_watermark</code>.',
    zh: '缓存模式是 <code>memory</code> 或 <code>hybrid</code> 时适用。当系统处于高内存压力时，从队列中丢弃旧的消息以减缓内存增长。内存压力值由配置项 <code>sysmon.os.sysmem_high_watermark</code> 决定。',
  },
  saveAsCopy: {
    zh: '保存为副本',
    en: 'Save as copy',
  },
  confirmReset: {
    zh: '是否确认重置输入的测试数据？',
    en: 'Are you sure to reset the test data?',
  },
  accountJSONError: {
    zh: '请上传格式有效的 GCP 服务账户凭证',
    en: 'Please upload your GCP Service Account Credentials in a valid format',
  },
  kafkaSniDesc: {
    zh: `TLS Server Name Indication (SNI)。可以设置为 "auto" 来自动使用连接主机名为 SNI，设置为 "none" 来禁用 SNI（与该字段留白效果一样），或者设置一个主机名，例如 "my.kafka.host" 来使用静态的 SNI。`,
    en: `The TLS Server Name Indication (SNI). We can set it to "auto" to use connecting hostname as SNI, set to none to disable SNI (same as leaving it blank), or set to an FQDN such as "my.kafka.host" to use a static SNI for all SSL connections.`,
  },
}
