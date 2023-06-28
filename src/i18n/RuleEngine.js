export default {
  createBridge: {
    zh: '创建数据桥接',
    en: 'Create Data Bridge',
  },
  updateBridgeTip: {
    zh: '更新桥接配置将会导致桥接重启，重启期间缓冲区内的消息和新收到的消息将不会被桥接，是否继续？',
    en: 'Updating bridge configuration will cause the bridge to restart. The buffered messages, and newly received messages during the restart will not be bridged, continue?',
  },
  create: {
    zh: '创建',
    en: 'Create',
  },
  bridgeType: {
    zh: '数据桥接类型',
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
  method: {
    zh: '请求方法',
    en: 'Method',
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
  connParams: {
    zh: '连接参数',
    en: 'Connection',
  },
  brokerAddress: {
    zh: 'MQTT 服务地址',
    en: 'MQTT Broker',
  },
  mqttBroker: {
    zh: 'MQTT 服务',
    en: 'MQTT Broker',
  },
  mqttVer: {
    zh: 'MQTT 协议版本',
    en: 'MQTT Version',
  },

  cleanStart: {
    zh: '清除会话',
    en: 'Clean start',
  },
  cleanStartDesc: {
    zh: '当重新连接到远程服务，该 MQTT 服务作为入口桥接时，是否启动一个干净的会话。',
    en: 'Whether to start a clean session when reconnecting a remote broker for ingress bridge.',
  },
  bridgeMode: {
    zh: '桥接模式',
    en: 'Bridge Mode',
  },
  bridgeModeDesc: {
    zh: '该设置仅适用于 MQTT 协议版本低于 5.0 的情况，且远程 MQTT 服务必须支持该功能。开启后，远端服务器将识别当前连接为一个桥接，消息回环检测更高效，收到的保留消息标志位会透传给本地。',
    en: 'This setting is only for MQTT protocol version older than 5.0, and the remote MQTT broker MUST support this feature. After being enabled, the remote broker will recognize the current connection as a bridge, that loop detection will be more effective and that retained messages will be propagated correctly.',
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
    zh: 'HTTP 请求超时',
    en: 'HTTP Request Timeout',
  },
  name: {
    zh: '名称',
    en: 'Name',
  },
  createRule: {
    zh: '创建规则',
    en: 'Create Rule',
  },
  topology: {
    zh: '拓扑图',
    en: ' Topology',
  },
  bridgeNotExistTip: {
    zh: '该数据桥接不存在，请检查并更新规则的 SQL 语句',
    en: 'The data bridge does not exist, please check and update the SQL of the rule',
  },
  createdAt: {
    zh: '创建时间',
    en: 'Created At',
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
  createWebhook: {
    zh: '创建 Webhook',
    en: 'Create Webhook',
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
  sqlMode: {
    zh: 'SQL 模式',
    en: 'SQL Mode',
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
  function: {
    zh: '数据处理',
    en: 'Function',
  },
  filter: {
    zh: '数据过滤',
    en: 'Filter',
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
    en: 'Rate in Last 5 Min',
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
    en: 'Queued',
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
  egressStatistics: {
    zh: '流出统计',
    en: 'Egress Statistics',
  },
  ingressStatistics: {
    zh: '流入统计',
    en: 'Ingress Statistics',
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
    zh: '每个节点上数据桥接状态和执行情况',
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
  clientPoolsize: {
    zh: '连接池大小',
    en: 'Connection Pool Size',
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
  retryInterval: {
    zh: '消息重发间隔',
    en: 'Message Retry Interval',
  },
  retryIntervalDesc: {
    en: 'Delay for the MQTT bridge to retry sending the QoS1/QoS2 messages in case of ACK not received.',
    zh: 'MQTT 桥接在未收到 ACK 的情况下，延迟重发 QoS1/QoS2 消息的时间间隔。',
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
    zh: '目前为加密密码，另存为副本需重新输入',
    en: 'The password is currently encrypted. If you save this data bridge as a copy, you need to enter it again',
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
    zh: "例如：${'{'}payload{'}'}, ${'{'}clientid{'}'}, ${'{'}topic{'}'}, ${'{'}username{'}'} 等。请根据使用数据桥接的业务需求来选择字段，置空则原样转发消息。",
    en: "For example: ${'{'}payload{'}'}, ${'{'}clientid{'}'}, ${'{'}topic{'}'} , ${'{'}username{'}'}, etc. Use fields according to the data bridges requirements of your business and forwards the message as it is if it is empty.",
  },
  ingressRemoteTopicDesc: {
    zh: '本地服务将订阅该主题以从远程 MQTT 服务接收消息。当 EMQX 配置为集群或启用了 ingress 连接池时，必须使用共享订阅来避免消息重复。',
    en: 'The local broker will subscribe to topic to receive messages from remote broker .When EMQX is running in a cluster or with an enabled ingress connection pool, it is mandatory to use shared subscriptions to avoid message duplication.',
  },
  egressRemoteTopicDesc: {
    zh: '本地服务将向该主题发布消息到远程 MQTT 服务。支持使用 ${field} 语法提取变量动态拼接主题。',
    en: 'The local broker will publish messages to the topic to the remote broker, supports using ${field} syntax to use the dynamic topics.',
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
  event: {
    zh: '事件',
    en: 'Event',
  },
  events: {
    zh: '事件',
    en: 'Events',
  },
  allMsgsAndEvents: {
    zh: '所有消息和事件',
    en: 'All Message and Events',
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
  backBridgeList: {
    zh: '返回 Bridge 列表',
    en: 'Back To Bridge List',
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
    zh: '由于未知错误导致的规则调用失败次数',
    en: 'The number of times the rule calling action failed due to an unknown error',
  },
  deleteBridgeSecondConfirm: {
    zh: '删除该桥接会影响下方规则的数据流。如果该桥接已被添加到规则的动作中，则会立即删除。是否确认继续？',
    en: 'Deleting this bridge will affect the data flow for the rules listed below. If the bridge has been added to the actions of any rules, it will be removed immediately, continue?',
  },
  rateUnit: {
    zh: 'message/sec | messages/sec',
    en: 'message/sec | messages/sec',
  },
  saveAsCopy: {
    zh: '保存为副本',
    en: 'Save as copy',
  },
  poolType: {
    zh: '连接池类型',
    en: 'Pool Type',
  },
  connectionPoolSize: {
    zh: '连接池大小',
    en: 'Connection Pool Size',
  },
  autoRestartIntervalValueDesc: {
    zh: '如果时间间隔设置过短，可导致服务离线时反复进行连接测试以致给系统带来较大负载。',
    en: 'If the auto restart time interval is set too small, it might cause the connection test to be repeated when the service is offline, which will bring a lot load to the system.',
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
  advancedSettings: {
    zh: '高级设置',
    en: 'Advanced Settings',
  },
}
