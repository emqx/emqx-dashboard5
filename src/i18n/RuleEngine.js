export default {
  createAction: {
    zh: '创建动作',
    en: 'Create Action',
  },
  createConnector: {
    zh: '创建连接器',
    en: 'Create Connector',
  },
  updateConnectorTip: {
    zh: '更新配置会导致连接中断，进而可能导致关联动作消息丢失。',
    en: 'Updating the configuration can cause a connection interruption, which may result in the loss of associated action messages.',
  },
  updateActionTip: {
    zh: '更新配置会导致动作重启，动作中缓冲的消息和新接收的消息将被丢弃。',
    en: 'Updating configuration will cause the Action to restart. The buffered messages, and newly received messages during the restart will be lost.',
  },
  updateSourceTip: {
    zh: '更新配置会导致 Source 重启。',
    en: 'Updating configuration will cause the Source to restart.',
  },
  create: {
    zh: '创建',
    en: 'Create',
  },
  actionType: {
    zh: '动作类型',
    en: 'Type of Action',
  },
  connectorType: {
    zh: '连接器类型',
    en: 'Type of Connector',
  },
  connectorName: {
    zh: '连接器名称',
    en: 'Connector Name',
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
  connectionStatus: {
    zh: '连接状态',
    en: 'Connection Status',
  },
  statusReason: {
    zh: '状态原因',
    en: 'Status Reason',
  },
  associativeDataBridge: {
    zh: '关联数据桥接',
    en: 'Associative Data Bridge',
  },
  configuration: {
    zh: '配置信息',
    en: 'Configuration',
  },
  HTTPServer: {
    zh: 'HTTP 服务',
    en: 'HTTP Server',
  },
  bridgeDescHTTP: {
    zh: '发送数据到 HTTP 服务',
    en: 'Send data to HTTP Server',
  },
  bridgeDescMQTT: {
    zh: '使用 MQTT 桥接数据',
    en: 'Using MQTT to bridge data',
  },
  trigger: {
    zh: '触发器',
    en: 'Trigger',
  },
  topicFilter: {
    zh: '主题过滤',
    en: 'Topic Filter',
  },
  addTopic: {
    zh: '添加主题',
    en: 'Add Topic',
  },
  repeatedTopic: {
    zh: '重复的主题',
    en: 'Repeated topics',
  },
  mqttBroker: {
    zh: 'MQTT 服务',
    en: 'MQTT Broker',
  },
  mqttVer: {
    zh: 'MQTT 协议版本',
    en: 'MQTT Version',
  },
  name: {
    zh: '名称',
    en: 'Name',
  },
  createRule: {
    zh: '创建规则',
    en: 'Create Rule',
  },
  note: {
    zh: '备注',
    en: 'Note',
  },
  action: {
    zh: '动作',
    en: 'Action',
  },
  actions: {
    zh: '动作',
    en: 'Actions',
  },
  actionsEmptyTip: {
    zh: '请在规则或者 Flow 设计器中添加动作',
    en: 'Please add actions in rules or flow designer',
  },
  sourceEmptyTip: {
    zh: '请在规则或者 Flow 设计器中添加数据源',
    en: 'Please add data source in rules or flow designer',
  },
  actionAvailable: {
    zh: '可用',
    en: 'Available',
  },
  actionUnavailable: {
    zh: '不可用',
    en: 'Unavailable',
  },
  actionDisabled: {
    zh: '已禁用',
    en: 'Disabled',
  },
  actionsCount: {
    zh: '动作数量',
    en: 'Action Count',
  },
  actionDesc: {
    zh: '将处理结果输出到动作和外部数据系统中。',
    en: 'Output processing results to an action and external data system.',
  },
  addAction: {
    zh: '添加动作',
    en: 'Add Action',
  },
  consoleOutput: {
    zh: '控制台输出',
    en: 'Console Output',
  },
  confPreview: {
    zh: '配置预览',
    en: 'Configuration Preview',
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
  handleWebhookAssociatedTip: {
    zh: '该{target}被用于 Webhook，无法进行{operation}，请通过{page}管理',
    en: 'The {target} is used for Webhook and cannot be {operation}. Please manage it through the {page}',
  },
  moreOperation: {
    zh: '更多操作',
    en: 'More Operations',
  },
  or: {
    zh: '或',
    en: 'or',
  },
  page: {
    zh: '页面',
    en: 'page',
  },
  resetMetricsConfirm: {
    zh: '是否确认重置该{target}统计数据？',
    en: 'Are you sure you want to reset this {target} statistic?',
  },
  resetSuccessfully: {
    zh: '重置成功',
    en: 'Reset successfully',
  },
  republish: {
    zh: '消息重发布',
    en: ' Republish',
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
  sqlEditor: {
    zh: 'SQL 编辑器',
    en: 'SQL Editor',
  },
  message: {
    zh: '消息',
    en: 'Message',
  },
  messages: {
    zh: '消息',
    en: 'Messages',
  },
  dataSource: {
    zh: '数据来源',
    en: 'Data Source',
  },
  dataSourceDesc: {
    zh: '选择一个事件或 Source 作为测试数据源，确保它与规则中指定的来源保持一致。',
    en: "Select a message event or source as the data source for testing, ensuring that it is consistent with the rule's SQL.",
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
  dataProcessing: {
    zh: '数据处理',
    en: 'Data Processing',
  },
  matched: {
    zh: '命中',
    en: 'Matched',
  },
  ruleMatched: {
    zh: '规则命中总数',
    en: 'Rule Matched',
  },
  sqlMatchedDesc: {
    zh: '规则启用后的执行次数',
    en: 'The number of executions after the rule is enabled',
  },
  bridgeMatchedDesc: {
    zh: '动作执行的次数',
    en: 'Counts of actions executed',
  },
  sqlNoResult: {
    zh: '无结果',
    en: 'No Result',
  },
  sqlNoResultDesc: {
    zh: '成功执行但没有输出结果',
    en: 'Executes Successfully But No Output Results',
  },
  sent: {
    zh: '已发送',
    en: 'Sent',
  },
  sentDesc: {
    zh: '已发出的消息数',
    en: 'Count of messages sent',
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
    zh: '已经缓冲但等待发送到外部数据系统的消息数',
    en: 'Number of messages buffered but awaiting to be sent to the external data system',
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
    zh: '正在发送到外部数据系统并等待响应的消息数',
    en: 'Number of messages being sent to the external data system and awaiting response',
  },
  lateReply: {
    zh: '超期回复',
    en: 'Late Reply',
  },
  lateReplyDesc: {
    zh: '请求过期后收到回复',
    en: 'Reply Received After Request Expired',
  },
  received: {
    zh: '已接收',
    en: 'Received',
  },
  receivedDesc: {
    zh: '从远程系统收到的消息个数',
    en: 'Count of messages that is received from the remote system',
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
  createSource: {
    zh: '创建 Source',
    en: 'Create Source',
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
  sqlExample: {
    zh: 'SQL 例子',
    en: 'SQL Example',
  },
  statistics: {
    zh: '统计',
    en: 'Statistics',
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
    zh: '每个节点上动作的状态和执行情况',
    en: 'Actions status and execution on each node',
  },
  nodeStatusRuleDesc: {
    zh: '每个节点上规则状态和执行情况',
    en: 'Rules status and execution on each node',
  },
  reconnect: {
    zh: '重连',
    en: 'Reconnect',
  },
  ingress: {
    zh: '入口配置',
    en: 'Ingress',
  },
  egress: {
    zh: '出口配置',
    en: 'Egress',
  },
  egressPoolSizeDesc: {
    zh: `用于出口配置的 MQTT 客户端连接池大小。<br/>
    连接池中每个 MQTT 客户端都将被分配一个唯一的 \`clientid\` 以确保避免重复或冲突，格式为 \`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:egress:\${'{'}node{'}'}:\${'{'}n{'}'}\`，其中 \`n\` 是连接池中客户端的编号。`,
    en: `The size of the MQTT client connection pool for egress. <br/>
    Each client in the MQTT connection pool is allocated a unique client ID to prevent duplication or conflicts. The client ID follows the format: \`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:egress:\${'{'}node{'}'}:\${'{'}n{'}'}\`, where \`n\` represents the client's number in the connection pool.`,
  },
  ingressPoolSizeDesc: {
    zh: `用于入口配置的 MQTT 客户端连接池大小。<br/>
    仅当远程主题（\`remote.topic\`） 使用了共享订阅（例如 \`$share/my-group/topic1\`）时才会启用连接池。
    连接池中每个 MQTT 客户端都将被分配一个唯一的 \`clientid\` 以确保避免重复或冲突，格式为 \`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:ingress:\${'{'}node{'}'}:\${'{'}n{'}'}\`，其中 \`n\` 是连接池中客户端的编号。`,
    en: `The size of the MQTT client connection pool for ingress. <br/>
    The connection pool is enabled only when \`remote.topic\` is using shared subscriptions (e.g., \`$share/my-group/topic1\`). <br/>
    Each client in the MQTT connection pool is allocated a unique client ID to prevent duplication or conflicts. The client ID follows the format: \`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:ingress:\${'{'}node{'}'}:\${'{'}n{'}'}\`, where \`n\` represents the client's number in the connection pool.`,
  },
  username: {
    zh: '用户名',
    en: 'Username',
  },
  password: {
    zh: '密码',
    en: 'Password',
  },
  retryInterval: {
    zh: '消息重发间隔',
    en: 'Message Retry Interval',
  },
  retryIntervalDesc: {
    en: 'Retry interval for QoS1/QoS2 messages if no ACK is received.',
    zh: '在未收到 ACK 的情况下，QoS1/QoS2 消息的重试间隔。',
  },
  tip: {
    zh: '提示：',
    en: 'Tip:',
  },
  changePwdTip: {
    zh: '目前为加密密码，修改请重新输入',
    en: 'The password is currently encrypted, to change it please re-enter',
  },
  pwdWarningWhenCoping: {
    zh: '当前配置中的密码字段已加密，保存副本请重新输入。',
    en: 'The password field in the current configuration is encrypted. Please re-enter when saving a copy.',
  },
  testTheConnection: {
    zh: '测试连接',
    en: 'Test Connectivity',
  },
  testConnectivity: {
    zh: '测试',
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
  payload: {
    zh: '消息模版',
    en: 'Payload',
  },
  payloadDesc: {
    zh: "支持使用 ${'{'}field{'}'} 语法读取数据。",
    en: "Supports reading data using ${'{'}field{'}'} syntax.",
  },
  payloadExample: {
    zh: "例如：${'{'}payload{'}'}, ${'{'}clientid{'}'}, ${'{'}topic{'}'}, ${'{'}username{'}'} 等。请根据使用动作的业务需求来选择字段，置空则原样转发消息。",
    en: "For example: ${'{'}payload{'}'}, ${'{'}clientid{'}'}, ${'{'}topic{'}'} , ${'{'}username{'}'}, etc. Use fields according to the action requirements of your business and forwards the message as it is if it is empty.",
  },
  pubProp: {
    zh: 'MQTT 5.0 消息属性',
    en: 'MQTT 5.0 Message Properties',
  },
  payloadFormatIndicator: {
    zh: '有效载荷指示器',
    en: 'Payload Format Indicator',
  },
  messageExpiryInterval: {
    zh: '消息过期时间',
    en: 'Message Expiry Interval',
  },
  contentType: {
    zh: '内容类型',
    en: 'Content Type',
  },
  responseTopic: {
    zh: '响应主题',
    en: 'Response Topic',
  },
  correlationData: {
    zh: '对比数据',
    en: 'Correlation Data',
  },
  userProperties: {
    zh: '用户属性',
    en: 'User Properties',
  },
  mqttProperties: {
    zh: 'MQTT 属性',
    en: 'MQTT Properties',
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
  event: {
    zh: '事件',
    en: 'Event',
  },
  events: {
    zh: '事件',
    en: 'Events',
  },
  dataInput: {
    zh: '数据输入',
    en: 'Data Inputs',
  },
  dataInputDesc: {
    zh: '规则可以通过消息，客户端事件以及 Source 触发。',
    en: 'Rules can be triggered by message, event, and source.',
  },
  addInput: {
    zh: '添加输入',
    en: 'Add Input',
  },
  editInput: {
    zh: '编辑输入',
    en: 'Edit Input',
  },
  inputType: {
    zh: '输入类型',
    en: 'Input Type',
  },
  actionOutputs: {
    zh: '动作输出',
    en: 'Action Outputs',
  },
  allMsgsAndEvents: {
    zh: '所有消息和事件',
    en: 'All Message and Events',
  },
  eventsDesc: {
    zh: '规则可以通过 MQTT 消息、事件或 Source 触发，规则 SQL 中支持通过逗号分隔指定多个触发来源。',
    en: 'Rules can be triggered by MQTT messages, events, or Sources. In SQL, multiple trigger sources can be separated with commas.',
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
  useAction: {
    zh: '使用动作',
    en: 'Use action',
  },
  bridgeForInputDesc: {
    zh: '从外部服务器收到信息时触发。',
    en: 'Triggered when a message is received from external server.',
  },
  clientEvent: {
    zh: '客户端事件',
    en: 'Client event',
  },
  dataTypeSQLNoMatch: {
    zh: '数据源与当前输入的 SQL 不匹配',
    en: `Data source doesn't match the entered SQL`,
  },
  backBridgeList: {
    zh: '返回 Bridge 列表',
    en: 'Back To Bridge List',
  },
  backConnectorList: {
    zh: '返回连接器列表',
    en: 'Back To Connector List',
  },
  headers: {
    zh: '请求头',
    en: 'Headers',
  },
  body: {
    zh: '请求体',
    en: 'Body',
  },
  httpBridgeURLFieldDesc: {
    zh: "支持使用 ${'{'}field{'}'} 语法提取数据拼接 URL",
    en: "Supports extracting data concatenated URLs using the ${'{'}field{'}'} syntax",
  },
  useConnectorCreateRule: {
    zh: '是否使用该连接器创建规则？',
    en: 'Would you like to create a rule using this connector?',
  },
  useActionCreateRule: {
    zh: '是否使用该动作创建规则',
    en: 'Would you like to create a rule using this action?',
  },
  useSourceCreateRule: {
    zh: '是否使用该 Source 创建规则',
    en: 'Would you like to create a rule using this source?',
  },
  confirmDirectionWhenCreatingRule: {
    zh: '请问您想将 {name} 连接器用于哪种操作？',
    en: 'What operation do you want to use the connector {name} for?',
  },
  canNotViewConnectorTip: {
    zh: '暂不支持通过 Dashboard 管理此连接器',
    en: 'This connector cannot be managed through the dashboard at the moment',
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
  unknown: {
    zh: '未知',
    en: 'Unknown',
  },
  actionUnknownDesc: {
    zh: '由于未知错误导致的规则调用失败次数',
    en: 'The number of times the rule calling action failed due to an unknown error',
  },
  deleteSourceConnectorTip: {
    zh: '请先移除使用该连接器的下列 sources，然后再删除该连接器。',
    en: 'Please remove the following sources that use this connector before deleting the connector.',
  },
  deleteActionConnectorTip: {
    zh: '请先移除使用该连接器的下列动作{ext}，然后再删除该连接器。',
    en: 'Please remove the following actions {ext} that use this connector before deleting the connector.',
  },
  deleteEgressActionSecondConfirm: {
    zh: '删除该动作会影响下方规则的数据流。如果该动作已被添加到规则的动作中，则会立即删除。是否确认继续？',
    en: 'Deleting this action will affect the data flow for the rules listed below. If the action has been added to the actions of any rules, it will be removed immediately, continue?',
  },
  deleteIngressActionSecondConfirm: {
    zh: '下方规则使用了此 Source，是否确认继续？',
    en: 'The rule below uses this source. Are you sure you want to continue?',
  },
  deleteFakeConnectorConfirm: {
    zh: '该连接器被动作使用，继续操作将删除其相关动作。是否确认继续？',
    en: 'This connector is used by action, and continuing the operation will remove its associated action, continue?',
  },
  rateUnit: {
    zh: '条/秒 | 条/秒',
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
  pgSql: {
    zh: 'PostgreSQL',
    en: 'PostgreSQL',
  },
  timescaleDB: {
    zh: 'TimescaleDB',
    en: 'TimescaleDB',
  },
  matrixDB: {
    zh: 'MatrixDB',
    en: 'MatrixDB',
  },
  TDengine: {
    zh: 'TDengine',
    en: 'TDengine',
  },
  clickHouse: {
    zh: 'ClickHouse',
    en: 'ClickHouse',
  },
  dynamoDB: {
    zh: 'DynamoDB',
    en: 'DynamoDB',
  },
  cassandra: {
    zh: 'Cassandra',
    en: 'Cassandra',
  },
  rocketMQ: {
    zh: 'RocketMQ',
    en: 'RocketMQ',
  },
  microsoftSqlServer: {
    zh: 'Microsoft SQL Server',
    en: 'Microsoft SQL Server',
  },
  iotDB: {
    zh: 'Apache IoTDB',
    en: 'Apache IoTDB',
  },
  openTSDB: {
    zh: 'OpenTSDB',
    en: 'OpenTSDB',
  },
  oracleDatabase: {
    zh: 'Oracle Database',
    en: 'Oracle Database',
  },
  rabbitMQ: {
    zh: 'RabbitMQ',
    en: 'RabbitMQ',
  },
  pulsar: {
    zh: 'Pulsar',
    en: 'Pulsar',
  },
  hStream: {
    zh: 'HStreamDB',
    en: 'HStreamDB',
  },
  azureEventHubs: {
    zh: 'Azure Event Hubs',
    en: 'Azure Event Hubs',
  },
  amazonKinesis: {
    zh: 'Amazon Kinesis',
    en: 'Amazon Kinesis',
  },
  greptimeDB: {
    zh: 'GreptimeDB',
    en: 'GreptimeDB',
  },
  sysKeeperProxy: {
    zh: 'SysKeeper 接收器',
    en: 'SysKeeper Proxy',
  },
  sysKeeperProxyDesc: {
    zh: 'SysKeeper 接收器用于创建监听器并接收转发器的连接，消息将按照转发配置发布到 EMQX 本地主题，请配套转发器使用。',
    en: 'The SysKeeper Proxy is used to create a listener and receive connections from the Forwarder. The messages will be published to the local topics of EMQX according to the forwarding configuration. Please use it together with the Forwarder.',
  },
  sysKeeperForwarder: {
    zh: 'SysKeeper 转发器',
    en: 'SysKeeper Forwarder',
  },
  egressDataBaseDesc: {
    zh: '将数据保存到 {name}',
    en: 'Save data to {name}',
  },
  bridgeDataToDesc: {
    zh: '桥接数据到 {name}',
    en: 'Bridge data to {name}',
  },
  database: {
    en: 'Database',
    zh: '数据库',
  },
  databaseDesc: {
    en: 'InfluxDB database.',
    zh: 'InfluxDB 数据库。',
  },
  dataDefinition: {
    zh: '定义解析数据，',
    en: 'Define Data Parsing,',
  },
  dataDefinitionDesc: {
    zh: '指定数据格式与内容，使其能被解析并写入到 InfluxDB 中，支持使用占位符。',
    en: 'specify the format and content of the data so that it can be parsed and written to InfluxDB, placeholder supported.',
  },
  timestampDesc: {
    zh: `数据的 UNIX 时间戳。如果此字段为空或使用 \`\${'{'}timestamp{'}'}\` 模板，则 EMQX 使用其主机机器的系统时间（UTC）。请注意，此情况下的最大精度将被限制为毫秒，即使在“精度”字段中指定了更高的精度。</br>
如果使用任何其他时间戳，则其精度必须与“精度”字段中选择的值完全匹配。</br>
建议使用模板语法，例如 \`\${'{'}timestamp{'}'}\` 或 \`\${'{'}payload.timestamp{'}'}\`，为每条消息写入 InfluxDB 数据记录。`,
    en: `The UNIX timestamp for the data. EMQX uses its host machine’s system time (UTC) if this field is left empty or \`\${'{'}timestamp{'}'}\` template is used explicitly. Note that the maximum precision in this case will be limited to milliseconds, even if a higher precision is specified in the 'precision' field.</br>
If any other timestamp is used, its precision must exactly match the value chosen in the 'precision' field.</br>
It's recommended to use a template syntax, e.g., \`\${'{'}timestamp{'}'}\` or \`\${'{'}payload.timestamp{'}'}\`, to write an InfluxDB data record for each message.`,
  },
  fieldValueDesc: {
    zh: `键值对都支持占位符。数字默认写成浮点数，可以添加一个类型后缀来指定一个类型（例如：\`\${'{'}payload.int_key{'}'}i\`），详情可查看 <a href="https://docs.influxdata.com/influxdb/v1.8/write_protocols/line_protocol_tutorial/#data-types" target="_blank">InfluxDB line protocol tutorial</a>`,
    en: `Both key and value support placeholders. Numbers are written as floats by default, but you can add a type suffix to specify a type (e.g. \`\${'{'}payload.int_key{'}'}i\`). Learn more in the <a href="https://docs.influxdata.com/influxdb/v1.8/write_protocols/line_protocol_tutorial/#data-types" target="_blank">InfluxDB line protocol tutorial</a>`,
  },
  dataFormat: {
    zh: '数据格式',
    en: 'Data Format',
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
  specifiedTypeTip: {
    zh: '当前显式指定数据类型为 {type}',
    en: 'The currently explicitly specified data type is {type}',
  },
  healthCheckInterval: {
    en: 'Health Check Interval',
    zh: '健康检查间隔',
  },
  autoRestartInterval: {
    en: 'Auto Restart Interval',
    zh: '自动重连间隔',
  },
  token: {
    en: 'Token',
    zh: 'Token',
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
  bucket: {
    en: 'Bucket',
    zh: 'Bucket',
  },
  authType: {
    zh: '认证方式',
    en: 'Auth Type',
  },
  basicAuth: {
    zh: '基础认证',
    en: 'Basic auth',
  },
  rateBarDesc: {
    zh: '近一分钟内消息发出速度趋势',
    en: 'Trend of message sending speed in the past minute',
  },
  connectionPoolSize: {
    zh: '连接池大小',
    en: 'Connection Pool Size',
  },
  kafkaProducerTopic: {
    zh: 'Kafka 主题名称',
    en: 'Kafka Topic Name',
  },
  kerberosPrincipal: {
    en: 'Kerberos Principal',
    zh: 'Kerberos Principal',
  },
  role: {
    en: 'Bridge Role',
    zh: '桥接角色',
  },
  roleDesc: {
    en: 'Kafka client role, producer sends local MQTT messages to remote Kafka broker, consumer receives remote Kafka messages to local MQTT broker.',
    zh: 'Kafka 客户端角色，生产者将本地 MQTT 消息发送到远程的 Kafka 服务上，消费者则是接入远程的 Kafka 消息到本地 MQTT 服务中。',
  },
  healthCheckIntervalDesc: {
    en: 'Health check interval.',
    zh: '健康检查间隔。',
  },
  kerberosKeytabFile: {
    en: 'Kerberos keytab file',
    zh: 'Kerberos keytab 文件',
  },
  kerberosPrincipalDesc: {
    en: `SASL GSSAPI authentication Kerberos principal. For example <code>client_name{'@'}MY.KERBEROS.REALM.MYDOMAIN.COM</code>, NOTE: The realm in use has to be configured in /etc/krb5.conf in EMQX nodes.`,
    zh: `SASL GSSAPI 认证方法的 Kerberos principal，例如 <code>client_name{'@'}MY.KERBEROS.REALM.MYDOMAIN.COM</code>注意：这里使用的 realm 需要配置在 EMQX 服务器的 /etc/krb5.conf 中`,
  },
  autoRestartIntervalDesc: {
    en: 'The auto restart interval after the resource is disconnected. ',
    zh: '资源断开以后，自动重连的时间间隔。',
  },
  autoRestartIntervalValueDesc: {
    zh: '如果时间间隔设置过短，可导致服务离线时反复进行连接测试以致给系统带来较大负载。',
    en: 'If the auto restart time interval is set too small, it might cause the connection test to be repeated when the service is offline, which will bring a lot load to the system.',
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
  producer: {
    en: 'Producer',
    zh: '生产者',
  },
  consumer: {
    en: 'Consumer',
    zh: '消费者',
  },
  saveAsCopy: {
    zh: '保存为副本',
    en: 'Save as copy',
  },
  confirmReset: {
    zh: '是否确认重置输入的测试数据？',
    en: 'Are you sure to reset the test data?',
  },
  async: {
    zh: '异步',
    en: 'Async',
  },
  sync: {
    zh: '同步',
    en: 'Sync',
  },
  accountJSONError: {
    zh: '请上传格式有效的 GCP 服务账户凭证',
    en: 'Please upload your GCP Service Account Credentials in a valid format',
  },
  kafkaSniDesc: {
    zh: `服务器名称指示 (SNI) 用于 TLS 握手设置。<br/>- <code>auto</code>：允许客户端自动确定适当的SNI。<br/>- <code>disable</code>：如果希望阻止客户端发送SNI。<br/>- 其他字符串值将按原样发送。`,
    en: `Server Name Indication (SNI) setting for TLS handshake.<br/>- <code>auto</code>: Allow the client to automatically determine the appropriate SNI.<br/>- <code>disable</code>: If you wish to prevent the client from sending the SNI.<br/>- Other string values will be sent as-is.`,
  },
  redisCommandError: {
    zh: '不正确的 Redis 命令',
    en: 'Incorrect Redis command',
  },
  schemaNameTip: {
    zh: '名称将用于编解码函数中，示例：<br /><code>SELECT  schema_encode("<name>", payload)</code>',
    en: 'The name will be used in the encoding and decoding functions, for example: <br /><code>SELECT  schema_encode("<name>", payload)</code>',
  },
  advancedSettings: {
    zh: '高级设置',
    en: 'Advanced Settings',
  },
  typeSearch: {
    zh: '输入关键词搜索...',
    en: 'Type to search...',
  },
  topicMappingRequired: {
    zh: '请添加至少一个主题映射关系',
    en: 'Please add at least one topic mapping',
  },
  processing: {
    zh: '处理中',
    en: 'Processing',
  },
  droppedExpired: {
    zh: '过期',
    en: 'Expired',
  },
  droppedExpiredDesc: {
    zh: '在排队等待发送之前，消息的有效期（TTL）已经到期',
    en: 'The message time-to-live (TTL) was reached during queuing before it got a chance to be sent',
  },
  droppedQueueFull: {
    zh: '队列已满',
    en: 'Queue full',
  },
  droppedQueueFullDesc: {
    zh: '达到了最大队列大小，为防止内存溢出而丢弃消息',
    en: 'The maximum queue size was reached and the message was dropped to prevent memory overflow',
  },
  droppedResourceStopped: {
    zh: '资源已停止',
    en: 'Resource stopped',
  },
  droppedResourceStoppedDesc: {
    zh: '尝试向已停止的动作发送消息',
    en: 'Trying to send messages to stopped actions',
  },
  droppedResourceNotFound: {
    zh: '未找到资源',
    en: 'Resource not found',
  },
  droppedResourceNotFoundDesc: {
    zh: '尝试向不存在的动作发送消息。这种情况非常罕见，通常是删除动作时存在竞态条件导致的',
    en: 'Trying to send messages to a non-existent action. It occurs rarely and usually due to race conditions during the removal of a action',
  },
  droppedOther: {
    zh: '其他丢弃',
    en: 'Other dropped',
  },
  droppedOtherDesc: {
    zh: '由于其他未知原因而丢弃的消息',
    en: 'Messages dropped due to other unknown reasons',
  },
  passed: {
    zh: '通过',
    en: 'Passed',
  },
  passedDesc: {
    zh: '成功执行规则并生成输出结果的次数',
    en: 'Number of successful rule executions and output results',
  },
  failedNoResult: {
    zh: '未通过',
    en: 'No Result',
  },
  failedNoResultDesc: {
    zh: '成功执行规则，但由于过滤条件不满足而没有生成输出结果的次数',
    en: 'Number of successful rule executions but no outputs due to unmet filtering conditions',
  },
  failedException: {
    zh: '执行失败',
    en: 'Failed',
  },
  failedExceptionDesc: {
    zh: '由于SQL语法错误或函数调用错误导致的执行失败次数',
    en: 'Number of failed executions due to SQL syntax errors or function call errors',
  },
  ruleExecutionRate: {
    zh: '规则执行速度',
    en: 'Rule execution rate',
  },
  actionsTotal: {
    zh: '动作执行总数',
    en: 'Actions Total',
  },
  actionsTotalDesc: {
    zh: '所有动作调用总次数',
    en: 'Total number of action calls',
  },
  actionsSuccess: {
    zh: '成功',
    en: 'Success',
  },
  actionsSuccessDesc: {
    zh: '动作成功调用次数',
    en: 'Number of successful action calls',
  },
  actionsFailed: {
    zh: '失败',
    en: 'Failed',
  },
  actionsFailedDesc: {
    zh: '动作执调用失败次数',
    en: 'Number of failed action calls',
  },
  actionsFailedOutOfService: {
    zh: '服务停止',
    en: 'Out of service',
  },
  actionsFailedOutOfServiceDesc: {
    zh: '因动作停止引起的错误',
    en: 'Errors due to action stopping',
  },
  actionsFailedUnknown: {
    zh: '未知',
    en: 'Unknown',
  },
  actionsFailedUnknownDesc: {
    zh: '未知的错误',
    en: 'Unknown errors',
  },
  ruleRateBarDesc: {
    zh: '过去一分钟内规则匹配速度的趋势',
    en: 'Trend of rule matching speed in the last minute',
  },
  errorKeyValuePair: {
    zh: '错误的键值对输入',
    en: 'Wrong key-value pair input',
  },
  generateJSONSchema: {
    zh: '生成 JSON Schema',
    en: 'Generate JSON Schema',
  },
  generateFromJSON: {
    zh: '从 JSON 生成',
    en: 'Generate from JSON',
  },
  invalidJSONSchema: {
    zh: '无效的 JSON Schema',
    en: 'Invalid JSON Schema',
  },
  generateJSONSchemaTip: {
    zh: '输入 JSON 以生成 JSON Schema',
    en: 'Enter JSON to generate JSON Schema',
  },
  JSONSchemaVersionTip: {
    zh: `当前支持 JSON Schema \`draft-03\`、\`draft-04\` 和 \`draft-06\` 版本。`,
    en: `JSON Schema versions \`draft-03\`, \`draft-04\`, and \`draft-06\` are supported.`,
  },
}
