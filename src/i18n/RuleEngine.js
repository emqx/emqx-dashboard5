export default {
  createBridge: {
    zh: '创建数据桥接',
    en: 'Create Data Bridge',
    ja: 'データブリッジ作成',
  },
  updateBridgeTip: {
    zh: '更新桥接配置将会导致桥接重启，重启期间缓冲区内的消息和新收到的消息将不会被桥接，是否继续？',
    en: 'Updating bridge configuration will cause the bridge to restart. The buffered messages, and newly received messages during the restart will not be bridged, continue?',
    ja: 'ブリッジ設定の更新により、ブリッジが再起動します。再起動中、バッファ内のメッセージと新しく受信したメッセージはブリッジされません。続行しますか?',
  },
  create: {
    zh: '创建',
    en: 'Create',
    ja: '作成',
  },
  bridgeType: {
    zh: '数据桥接类型',
    en: 'Type of Data Bridge',
    ja: 'データブリッジタイプ',
  },
  dataBridge: {
    zh: '数据桥接',
    en: 'Data bridge',
    ja: 'データブリッジ',
  },
  useDataBridge: {
    zh: '使用数据桥接转发',
    en: 'Forwarding with Data Bridge',
    ja: 'データブリッジで転送',
  },
  direction: {
    zh: '方向',
    en: 'Direction',
    ja: '方向',
  },
  SuccessNum: {
    zh: '成功数',
    en: 'Success',
    ja: '成功数',
  },
  ErrNum: {
    zh: '失败数',
    en: 'Failed',
    ja: '失敗数',
  },
  noMatch: {
    zh: '不匹配',
    en: 'No match',
    ja: '不一致',
  },
  rateNow: {
    zh: '当前速率',
    en: 'Rate',
    ja: '現在のレート',
  },
  status: {
    zh: '资源状态',
    en: 'Resource Status',
    ja: 'リソースの状態',
  },
  configuration: {
    zh: '配置信息',
    en: 'Configuration',
    ja: '設定',
  },
  HTTPServer: {
    zh: 'HTTP 服务',
    en: 'HTTP Server',
    ja: 'HTTPサーバ',
  },
  bridgeDescHTTP: {
    zh: '发送数据到 HTTP 服务',
    en: 'Send data to HTTP Server',
    ja: 'HTTPサーバにデータを送信',
  },
  bridgeDescMQTT: {
    zh: '使用 MQTT 桥接数据',
    en: 'Using MQTT to bridge data',
    ja: 'MQTTでデータブリッジ',
  },
  method: {
    zh: '请求方法',
    en: 'Method',
    ja: 'メソッド',
  },
  trigger: {
    zh: '触发器',
    en: 'Trigger',
    ja: 'トリガー',    
  },
  topicFilter: {
    zh: '主题过滤',
    en: 'Topic Filter',
    ja: 'トピックフィルタ',
  },
  addTopic: {
    zh: '添加主题',
    en: 'Add Topic',
    ja: 'トピック追加',
  },
  repeatedTopic: {
    zh: '重复的主题',
    en: 'Repeated topics',
    ja: '重複トピック',
  },
  connParams: {
    zh: '连接参数',
    en: 'Connection',
    ja: '接続パラメータ',
  },
  brokerAddress: {
    zh: 'MQTT 服务地址',
    en: 'MQTT Broker',
    ja: 'MQTTブローカアドレス',
  },
  mqttBroker: {
    zh: 'MQTT 服务',
    en: 'MQTT Broker',
    ja: 'MQTTブローカ',
  },
  mqttVer: {
    zh: 'MQTT 协议版本',
    en: 'MQTT Version',
    ja: 'MQTTバージョン',
  },

  cleanStart: {
    zh: '清除会话',
    en: 'Clean start',
    ja: 'セッションクリア',
  },
  cleanStartDesc: {
    zh: '当重新连接到远程服务，该 MQTT 服务作为入口桥接时，是否启动一个干净的会话。',
    en: 'Whether to start a clean session when reconnecting a remote broker for ingress bridge.',
    ja: 'リモートブローカーに再接続する際、イングレスブリッジとしてクリーンセッションを開始するかどうか。',
  },
  bridgeMode: {
    zh: '桥接模式',
    en: 'Bridge Mode',
    ja: 'ブリッジモード',
  },
  bridgeModeDesc: {
    zh: '该设置仅适用于 MQTT 协议版本低于 5.0 的情况，且远程 MQTT 服务必须支持该功能。开启后，远端服务器将识别当前连接为一个桥接，消息回环检测更高效，收到的保留消息标志位会透传给本地。',
    en: 'This setting is only for MQTT protocol version older than 5.0, and the remote MQTT broker MUST support this feature. After being enabled, the remote broker will recognize the current connection as a bridge, that loop detection will be more effective and that retained messages will be propagated correctly.',
    ja: 'この設定は、MQTTプロトコルバージョンが5.0未満の場合にのみ適用されます。リモートMQTTブローカーはこの機能をサポートしている必要があります。有効にすると、リモートブローカーは現在の接続をブリッジとして認識し、ループ検出がより効果的になり、保持されたメッセージが正しく伝達されます。',
  },
  httpPipeline: {
    zh: 'HTTP 管道',
    en: 'HTTP Pipelining',
    ja: 'HTTPパイプライン',
  },
  connTimeout: {
    zh: '连接超时',
    en: 'Connect Timeout',
    ja: '接続タイムアウト',
  },
  reqTimeout: {
    zh: 'HTTP 请求超时',
    en: 'HTTP Request Timeout',
    ja: 'HTTPリクエストタイムアウト',
  },
  name: {
    zh: '名称',
    en: 'Name',
    ja: '名称',
  },
  createRule: {
    zh: '创建规则',
    en: 'Create Rule',
    ja: 'ルールを作成',
  },
  topology: {
    zh: '拓扑图',
    en: 'Topology',
    ja: 'トポロジ',
  },
  bridgeNotExistTip: {
    zh: '该数据桥接不存在，请检查并更新规则的 SQL 语句',
    en: 'The data bridge does not exist, please check and update the SQL of the rule',
    ja: 'このデータブリッジは存在しません。ルールのSQLステートメントを確認して更新してください。',
  },
  createdAt: {
    zh: '创建时间',
    en: 'Created At',
    ja: '作成日時',
  },
  note: {
    zh: '备注',
    en: 'Note',
    ja: '備考',
  },
  action: {
    zh: '动作',
    en: 'Action',
    ja: 'アクション',
  },
  actions: {
    zh: '动作',
    en: 'Actions',
    ja: 'アクション',
  },
  actionDesc: {
    zh: '将处理结果输出到数据桥接或内置函数中。',
    en: 'Output the processing result to a data bridge or built-in function.',
    ja: '処理結果をデータブリッジまたは組み込み関数に出力します。',
  },
  addAction: {
    zh: '添加动作',
    en: 'Add Action',
    ja: 'アクションを追加',
  },
  consoleOutput: {
    zh: '控制台输出',
    en: 'Console Output',
    ja: 'コンソール出力',
  },
  outputResult: {
    zh: '输出结果',
    en: 'Output Result',
    ja: '結果を出力',
  },
  outputResultDesc: {
    zh: '运行测试后，根据测试数据输出规则 SQL 的处理结果。',
    en: 'After executing the test, output the result of processing the rule SQL using the test data.',
    ja: 'テストの実行後、テストデータを使用してルールSQLの処理結果を出力します。',
  },
  testData: {
    zh: '输入测试数据',
    en: 'Input Test Data',
    ja: 'テストデータの入力',
  },
  testDataDesc: {
    zh: '输入并模拟运行时的使用数据，点击运行测试按钮后开始规则的 SQL 测试，结果将在输出结果中展示。',
    en: 'Enter the data needed to run, and then click the Run Test button to test the rule SQL. The result will be shown in the Output Result.',
    ja: '実行に必要なデータを入力し、[テストの実行]ボタンをクリックするとルールSQLのテストが開始されます。結果は[結果の出力]に表示されます。',
  },
  testPassed: {
    zh: '测试通过',
    en: 'Test Passed',
    ja: 'テストに合格',
  },
  resetData: {
    zh: '重置数据',
    en: 'Reset data',
    ja: 'データをリセット',
  },
  rule: {
    zh: '规则',
    en: 'rule',
    ja: 'ルール',
  },
  createWebhook: {
    zh: '创建 WebHook',
    en: 'Create WebHook',
    ja: 'WebHookを作成',
  },
  resetMetricsConfirm: {
    zh: '是否确认重置该{target}统计数据？',
    en: 'Are you sure you want to reset this {target} statistic?',
    ja: 'この{target}の統計をリセットしてもよろしいですか?',
  },
  resetSuccessfully: {
    zh: '重置成功',
    en: 'Reset successfully',
    ja: 'リセット成功',
  },
  republish: {
    zh: '消息重发布',
    en: 'Republish',
    ja: 'メッセージの再配信',
  },
  selectOrInput: {
    zh: '请选择或直接输入',
    en: 'Select or input directly',
    ja: '選択または直接入力',
  },
  editAction: {
    zh: '编辑动作',
    en: 'Edit The Action',
    ja: 'アクションを編集',
  },
  testsql: {
    zh: '运行测试',
    en: 'Run Test',
    ja: 'テストの実行',
  },
  sqlMode: {
    zh: 'SQL 模式',
    en: 'SQL Mode',
    ja: 'SQLモード',
  },
  sqlEditor: {
    zh: 'SQL 编辑器',
    en: 'SQL Editor',
    ja: 'SQLエディター',
  },
  message: {
    zh: '消息',
    en: 'Message',
    ja: 'メッセージ',
  },
  messages: {
    zh: '消息',
    en: 'Messages',
    ja: 'メッセージ',
  },
  changeSqlMethod: {
    zh: '切换 SQL 编辑',
    en: 'Switch SQL Edit',
    ja: 'SQL編集の切り替え',
  },
  changeFormMethod: {
    zh: '切换表单编辑',
    en: 'Switch Form Edit',
    ja: 'フォーム編集の切り替え',
  },
  dataSource: {
    zh: '数据来源',
    en: 'Data Source',
    ja: 'データソース',
  },
  dataSourceDesc: {
    zh: '选择一个消息事件或数据桥接作为测试数据源，确保它与规则的 SQL 保持一致。',
    en: `Select a message event or data bridge as the data source for testing, ensuring that it is consistent with the rule's SQL.`,
    ja: 'メッセージイベントまたはデータブリッジをデータソースとして選択し、ルールのSQLと一致することを確認してください。',
  },
  addDataSource: {
    zh: '添加数据来源',
    en: 'Add data source',
    ja: 'データソースを追加',
  },
  select: {
    zh: '数据转换',
    en: 'Select',
    ja: '選択',
  },
  where: {
    zh: '条件',
    en: 'Where',
    ja: '条件',
  },
  type: {
    zh: '类型',
    en: 'Type',
    ja: 'タイプ',
  },
  function: {
    zh: '数据处理',
    en: 'Function',
    ja: '関数',
  },
  sqlPassed: {
    zh: '通过',
    en: 'Passed',
    ja: 'パス',
  },
  sqlPassedDesc: {
    zh: '成功执行并输出结果',
    en: 'Executes successfully and outputs the result',
    ja: '正常に実行され結果が出力されました',
  },
  matched: {
    zh: '命中',
    en: 'Matched',
    ja: '一致',
  },
  sqlMatchedDesc: {
    zh: '规则启用后的执行次数',
    en: 'The number of executions after the rule is enabled',
    ja: 'ルールが有効になった後の実行回数',
  },
  bridgeMatchedDesc: {
    zh: 'Bridge 被匹配到（被请求）的次数',
    en: 'Count of this bridge is matched and queried',
    ja: 'このブリッジが照合・問い合わせされた回数',
  },
  sqlFailed: {
    zh: '失败',
    en: 'Failed',
    ja: '失敗',
  },
  sqlFailedDesc: {
    zh: '因语法或函数调用失败导致执行失败',
    en: 'Execution failed due to syntax or function call failure',
    ja: '構文エラーや関数呼び出しの失敗により実行に失敗しました',
  },
  sqlNoResult: {
    zh: '无结果',
    en: 'No Result',
    ja: '結果なし',
  },
  sqlNoResultDesc: {
    zh: '成功执行但没有输出结果',
    en: 'Executes Successfully But No Output Results',
    ja: '正常に実行されましたが、結果が出力されませんでした',
  },
  rateLast5M: {
    zh: '最近 5 分钟速率',
    en: 'Rate in Last 5 Min',
    ja: '過去5分間のレート',
  },
  sent: {
    zh: '已发送',
    en: 'Sent',
    ja: '送信済み',
  },
  sentDesc: {
    zh: '已经发送出去的消息个数',
    en: 'Count of messages that are sent by this bridge',
    ja: 'このブリッジによって送信されたメッセージ数',
  },
  dropped: {
    zh: '已丢弃',
    en: 'Dropped',
    ja: 'ドロップ',
  },
  droppedDesc: {
    zh: '被丢弃的消息个数',
    en: 'Count of messages dropped',
    ja: 'ドロップされたメッセージ数',
  },
  retried: {
    zh: '已重试',
    en: 'Retried',
    ja: '再試行',
  },
  retriedDesc: {
    zh: '从队列或者飞行窗口里重试的次数',
    en: 'Times of retried from the queue or the inflight window',
    ja: 'キューやフライトウィンドウから再試行された回数',
  },
  queuing: {
    zh: '已缓存',
    en: 'Queued',
    ja: 'キューイング',
  },
  queuingDesc: {
    zh: '当前被缓存到磁盘队列的消息个数',
    en: 'Count of messages that are currently queuing',
    ja: '現在キューイングされているメッセージ数',
  },
  sentSuccessfully: {
    zh: '发送成功',
    en: 'Sent Successfully',
    ja: '送信成功',
  },
  sentSuccessfullyDesc: {
    zh: '已经发送成功的消息个数',
    en: 'Count of messages that sent successfully',
    ja: '正常に送信されたメッセージ数',
  },
  sentFailed: {
    zh: '发送失败',
    en: 'Sent Failed',
    ja: '送信失敗',
  },
  sentFailedDesc: {
    zh: '发送失败的消息个数',
    en: 'Count of messages that sent failed',
    ja: '送信失敗したメッセージ数',
  },
  sentInflight: {
    zh: '已发送未确认',
    en: 'Sent Inflight',
    ja: '未確認送信済み',
  },
  sentInflightDesc: {
    zh: '已异步地发送但没有收到 ACK 的消息个数',
    en: 'Count of messages that were sent asynchronously but ACKs are not received',
    ja: '非同期に送信されましたが、ACKが受信されていないメッセージ数',
  },
  lateReply: {
    zh: '超期回复',
    en: 'Late Reply',
    ja: '遅延応答',
  },
  lateReplyDesc: {
    zh: '请求过期后收到回复',
    en: 'Reply Received After Request Expired',
    ja: 'リクエストの期限切れ後に応答を受信',
  },
  received: {
    zh: '已接收',
    en: 'Received',
    ja: '受信済み',
  },
  receivedDesc: {
    zh: '从远程系统收到的消息个数',
    en: 'Count of messages that is received from the remote system',
    ja: 'リモートシステムから受信したメッセージ数',
  },
  rateMax: {
    zh: '最大速率',
    en: 'Maximum Rate',
    ja: '最大速度',
  },
  activated: {
    zh: '已启用',
    en: 'Activated',
    ja: '有効',
  },
  deactivated: {
    zh: '未启用',
    en: 'Deactivated',
    ja: '無効',
  },
  input: {
    zh: '输入',
    en: 'Input',
    ja: '入力',
  },
  source: {
    zh: '输入',
    en: 'Source',
    ja: 'ソース',
  },
  success: {
    zh: '成功',
    en: 'Success',
    ja: '成功',
  },
  connected: {
    zh: '已连接',
    en: 'Connected',
    ja: '接続済み',
  },
  disconnected: {
    zh: '已断开',
    en: 'Disconnected',
    ja: '接続解除済み',
  },
  connecting: {
    zh: '连接中',
    en: 'Connecting',
    ja: '接続中',
  },
  SQL: {
    zh: 'SQL 语句',
    en: 'SQL',
    ja: 'SQL',
  },
  ruleSQLDesc: {
    zh: '使用 SQL 语句实时提取、过滤、丰富和转换设备与业务系统之间的数据。',
    en: 'Use SQL to extract, filter, enrich, and transform data in real-time between devices and business systems.',
    ja: 'SQLを使用して、デバイスとビジネスシステム間のデータをリアルタイムに抽出、フィルタリング、エンリッチ、変換します。',
  },
  sqlEdit: {
    zh: '了解更多 SQL 语法，请参考 ',
    en: 'To learn more about SQL, see our ',
    ja: 'SQLの詳細はこちらをご確認ください：',
  },
  sqlSyntaxAndTem: {
    zh: 'SQL 语法与示列。',
    en: 'SQL syntax and templates.',
    ja: 'SQL構文とテンプレート。',
  },
  overview: {
    zh: '概览',
    en: 'Overview',
    ja: '概要',
  },
  viewSQL: {
    zh: '查看当前数据源下的 SQL 例子',
    en: 'View SQL example under the current data source',
    ja: '現在のデータソースのSQL例を表示',
  },
  sqlExample: {
    zh: 'SQL 例子',
    en: 'SQL Example',
    ja: 'SQL例',
  },
  statistics: {
    zh: '统计',
    en: 'Statistics',
    ja: '統計',
  },
  executionStatistics: {
    zh: '运行统计',
    en: 'Execution Statistics',
    ja: '実行統計',
  },
  actionsStatistics: {
    zh: '动作统计',
    en: 'Actions Statistics',
    ja: 'アクション統計',
  },
  egressStatistics: {
    zh: '流出统计',
    en: 'Egress Statistics',
    ja: 'アウトグレス統計',
  },
  ingressStatistics: {
    zh: '流入统计',
    en: 'Ingress Statistics',
    ja: 'イングレス統計',
  },
  nodeStatus: {
    zh: '节点状态',
    en: 'Node Status',
    ja: 'ノードステータス',
  },
  resetStatistics: {
    zh: '重置统计数据',
    en: 'Reset statistics',
    ja: '統計のリセット',
  },
  lastResetTime: {
    zh: '上次重置时间',
    en: 'Last reset time',
    ja: '前回のリセット時刻',
  },
  nodeStatusBridgeDesc: {
    zh: '每个节点上数据桥接状态和执行情况',
    en: 'Data Bridge status and execution on each node',
    ja: '各ノードのデータブリッジのステータスと実行状況',
  },
  nodeStatusRuleDesc: {
    zh: '每个节点上规则状态和执行情况',
    en: 'Rules status and execution on each node',
    ja: '各ノードのルールのステータスと実行状況',
  },
  reconnect: {
    zh: '重连',
    en: 'Reconnect',
    ja: '再接続',
  },
  remoteTopic: {
    zh: '远程主题',
    en: 'Remote Topic',
    ja: 'リモートトピック',
  },
  ingress: {
    zh: '入口配置',
    en: 'Ingress',
    ja: 'イングレス設定',
  },
  egress: {
    zh: '出口配置',
    en: 'Egress',
    ja: 'エグレス設定',
  },
  localBroker: {
    zh: '本地 MQTT 服务',
    en: 'Local MQTT Broker',
    ja: 'ローカルMQTTブローカー',
  },
  remoteBroker: {
    zh: '远程 MQTT 服务',
    en: 'Remote MQTT Broker',
    ja: 'リモートMQTTブローカー',
  },
  ingressDesc: {
    zh: '支持从外部的远程 MQTT 服务桥接消息到本地服务，可用于规则的数据源。',
    en: 'Bridges messages from remote MQTT broker to local, can be used as data source for rule.',
    ja: 'リモートMQTTブローカーからローカルへのメッセージブリッジをサポートします。ルールのデータソースとして使用できます。',
  },
  ingressHelp: {
    zh: '开启后，远程服务将作为数据源，本地服务将作为数据目的地接收消息，当出口配置启用后，该配置可选。',
    en: "When enabled, remote broker will be the data source, local broker will be the data destination to received messages, it's optional when egress is enabled.",
    ja: '有効にすると、リモートブローカーがデータソースとなり、ローカルブローカーがデータの送信先となってメッセージを受信します。エグレスが有効な場合はオプションとなります。',
  },
  egressDesc: {
    zh: '支持将本地服务消息桥接至外部的远程 MQTT 服务，可用于规则的动作中。',
    en: 'Bridges local messages to remote MQTT broker, can be used as action for rule.',
    ja: 'ローカルのメッセージをリモートMQTTブローカーにブリッジします。ルールのアクションとして使用できます。',
  },
  egressHelp: {
    zh: '开启后，远程服务将作为数据目的地接收本地服务的消息，当入口配置启用后，该配置可选。',
    en: 'When enabled, remote broker will be the data destination to received local messages, it’s optional when ingress is enabled.',
    ja: '有効にすると、リモートブローカーがデータの送信先となってローカルのメッセージを受信します。イングレスが有効な場合はオプションとなります。',
  },
  remoteTopicRequired: {
    zh: '请至少配置一个入口或出口配置中的远程服务主题',
    en: 'Please configure at least one remote topic in ingress or egress',
    ja: 'イングレスまたはエグレスの設定にリモートトピックを少なくとも1つ設定してください',
  },
  remoteTopicRepeated: {
    zh: '入口和出口配置的远程 MQTT 主题相同',
    en: 'The same remote MQTT topics are configured for ingress and egress',
    ja: 'イングレスとエグレスのリモートMQTTトピックが同じです',
  },
  clientPoolsize: {
    zh: '连接池大小',
    en: 'Connection Pool Size',
    ja: '接続プールサイズ',
  },
  egressPoolSizeDesc: {
    zh: `用于出口配置的 MQTT 客户端连接池大小。<br/>
    连接池中每个 MQTT 客户端都将被分配一个唯一的 \`clientid\` 以确保避免重复或冲突，格式为 \`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:egress:\${'{'}node{'}'}:\${'{'}n{'}'}\`，其中 \`n\` 是连接池中客户端的编号。`,
    en: `The size of the MQTT client connection pool for egress. <br/>
    Each client in the MQTT connection pool is allocated a unique client ID to prevent duplication or conflicts. The client ID follows the format: \`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:egress:\${'{'}node{'}'}:\${'{'}n{'}'}\`, where \`n\` represents the client's number in the connection pool.`,
    ja: `エグレス用のMQTTクライアント接続プールのサイズ。<br/>MQTT接続プール内の各クライアントには、重複や競合を避けるためにユニークなクライアントIDが割り当てられます。クライアントIDのフォーマットは、\`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:egress:\${'{'}node{'}'}:\${'{'}n{'}'}\`です。\`n\`は接続プール内のクライアント番号を表します。`,
  },
  ingressPoolSizeDesc: {
    zh: `用于入口配置的 MQTT 客户端连接池大小。<br/>
    仅当远程主题（\`remote.topic\`） 使用了共享订阅（例如 \`$share/my-group/topic1\`）时才会启用连接池。
    连接池中每个 MQTT 客户端都将被分配一个唯一的 \`clientid\` 以确保避免重复或冲突，格式为 \`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:ingress:\${'{'}node{'}'}:\${'{'}n{'}'}\`，其中 \`n\` 是连接池中客户端的编号。`,
    en: `The size of the MQTT client connection pool for ingress. <br/>
    The connection pool is enabled only when \`remote.topic\` is using shared subscriptions (e.g., \`$share/my-group/topic1\`). <br/>
    Each client in the MQTT connection pool is allocated a unique client ID to prevent duplication or conflicts. The client ID follows the format: \`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:ingress:\${'{'}node{'}'}:\${'{'}n{'}'}\`, where \`n\` represents the client's number in the connection pool.`,
    ja: `イングレス用のMQTTクライアント接続プールのサイズ。<br/>\`remote.topic\`が共有サブスクリプションを使用している場合にのみ(例:\`$share/my-group/topic1\`)、接続プールが有効になります。<br/> MQTT接続プール内の各クライアントには、重複や競合を避けるためにユニークなクライアントIDが割り当てられます。 クライアントIDのフォーマットは、\`\${'{'}clientid_prefix{'}'}:\${'{'}bridge_name{'}'}:ingress:\${'{'}node{'}'}:\${'{'}n{'}'}\`です。\`n\`は接続プール内のクライアント番号を表します。`,
  },
  bridgeUsage: {
    zh: '如何使用桥接',
    en: 'How to use Bridge',
    ja: 'ブリッジの使い方',
  },
  localTopic: {
    zh: '本地主题',
    en: 'Local Topic',
    ja: 'ローカルトピック',
  },
  username: {
    zh: '用户名',
    en: 'Username',
    ja: 'ユーザー名',
  },
  password: {
    zh: '密码',
    en: 'Password',
    ja: 'パスワード',
  },
  retryInterval: {
    zh: '消息重发间隔',
    en: 'Message Retry Interval',
    ja: 'メッセージ再送信間隔',
  },
  retryIntervalDesc: {
    en: 'Delay for the MQTT bridge to retry sending the QoS1/QoS2 messages in case of ACK not received.',
    ja: 'QoS1/QoS2メッセージのACKが受信されない場合のMQTTブリッジによる再送信の遅延時間。',
    zh: 'MQTT 桥接在未收到 ACK 的情况下，延迟重发 QoS1/QoS2 消息的时间间隔。',
  },
  tip: {
    zh: '提示：',
    en: 'Tip:',
    ja: 'ヒント：',
  },
  changePwdTip: {
    zh: '目前为加密密码，修改请重新输入',
    en: 'The password is currently encrypted, to change it please re-enter',
    ja: '現在のパスワードは暗号化されています。変更するには再入力が必要です。',
  },
  pwdWarningWhenCoping: {
    zh: '目前为加密密码，另存为副本需重新输入',
    en: 'The password is currently encrypted. If you save this data bridge as a copy, you need to enter it again',
    ja: '現在のパスワードは暗号化されています。このデータブリッジをコピーして保存する場合は、再入力が必要です。',
  },
  testTheConnection: {
    zh: '测试连接',
    en: 'Test Connectivity',
    ja: '接続のテスト',
  },
  testConnectivity: {
    zh: '测试',
    en: 'Test',
    ja: 'テスト',
  },
  test: {
    zh: '启用调试',
    en: 'Enable Test',
    ja: 'テストを有効化',
  },
  testTip: {
    zh: '启用调试后，可模拟数据源数据，并查看测试规则 SQL 的结果。',
    en: 'Test enabled, simulate data source and view the test rule SQL result.',
    ja: 'テストが有効な場合、データソースをシミュレートし、テストルールSQLの結果を表示できます。',
  },
  testDesc: {
    zh: '在创建规则之前，您可以使用测试数据来执行您刚才编辑的 SQL。这样可以帮助您确保结果符合预期，并且可以放心地创建并使用规则。',
    en: 'Before creating a rule, you can test rule SQL by using test data. This will help ensure that the results meet your expectations and allow you to confidently use the rule.',
    ja: 'ルールを作成する前に、テストデータを使用してルールのSQLを実行できます。これにより、結果が期待通りであることを確認し、ルールを確信を持って使用できるようになります。',
  },
  connectionSuccessful: {
    zh: '连接成功',
    en: 'Connection is successful',
    ja: '接続に成功しました',
  },
  payload: {
    zh: '消息模版',
    en: 'Payload',
    ja: 'ペイロード',
  },
  payloadDesc: {
    zh: "支持使用 ${'{'}field{'}'} 语法读取数据。",
    en: "Supports reading data using ${'{'}field{'}'} syntax.",
    ja: "${'{'}field{'}'}構文を使用したデータの読み込みをサポートしています。",
  },
  payloadExample: {
    zh: "例如：${'{'}payload{'}'}, ${'{'}clientid{'}'}, ${'{'}topic{'}'}, ${'{'}username{'}'} 等。请根据使用数据桥接的业务需求来选择字段，置空则原样转发消息。",
    en: "For example: ${'{'}payload{'}'}, ${'{'}clientid{'}'}, ${'{'}topic{'}'} , ${'{'}username{'}'}, etc. Use fields according to the data bridges requirements of your business and forwards the message as it is if it is empty.",
    ja: "例:${'{'}payload{'}'}、${'{'}clientid{'}'}、${'{'}topic{'}'}、${'{'}username{'}'} など。ビジネスのデータブリッジの要件に応じてフィールドを使用し、空の場合はそのままメッセージを転送します。",
  },
  ingressRemoteTopicDesc: {
    zh: '本地服务将订阅该主题以从远程 MQTT 服务接收消息。当 EMQX 配置为集群或启用了 ingress 连接池时，必须使用共享订阅来避免消息重复。',
    en: 'The local broker will subscribe to topic to receive messages from remote broker .When EMQX is running in a cluster or with an enabled ingress connection pool, it is mandatory to use shared subscriptions to avoid message duplication.',
    ja: 'ローカルブローカーはこのトピックをサブスクライブして、リモートブローカーからメッセージを受信します。EMQXがクラスターで実行されているか、イングレス接続プールが有効になっている場合、メッセージの重複を避けるために共有サブスクリプションを使用する必要があります。',
  },
  egressRemoteTopicDesc: {
    zh: '本地服务将向该主题发布消息到远程 MQTT 服务。支持使用 ${field} 语法提取变量动态拼接主题。',
    en: 'The local broker will publish messages to the topic to the remote broker, supports using ${field} syntax to use the dynamic topics.',
    ja: 'ローカルブローカーはこのトピックにメッセージをパブリッシュして、リモートブローカーに送信します。${field}構文を使用して動的トピックを作成できます。',
  },
  ingressLocalTopicDesc: {
    zh: '订阅该本地服务的主题，可以直接接收远程服务的消息而不用使用规则，如不填写则由规则指定。（可选）',
    en: 'Subscribe to the local broker topic to receive messages from the remote broker without using rules, if not it will be specified by the rule. (Optional)',
    ja: 'ルールを使用せずにリモートブローカーからのメッセージを直接受信するために、ローカルブローカーのトピックをサブスクライブします。指定がない場合はルールによって指定されます。(オプション)',
  },
  egressLocalTopicDesc: {
    zh: '向该本地服务的主题发布消息，可以直接向远程服务发送消息而不用使用规则，如不填写则由规则指定。（可选）',
    en: 'Publish messages to the local broker topic to send messages to the remote broker without using rules, if not it will be specified by the rule. (Optional)',
    ja: 'ルールを使用せずにリモートブローカーにメッセージを直接送信するために、ローカルブローカーのトピックにメッセージをパブリッシュします。指定がない場合はルールによって指定されます。(オプション)',
  },
  duplicate: {
    zh: '复制',
    en: 'Duplicate',
    ja: '複製',
  },
  SQLTemplates: {
    zh: 'SQL 示例',
    en: 'SQL Examples',
    ja: 'SQLサンプル',
  },
  commonSQLTemplates: {
    zh: '常用 SQL 示例',
    en: 'Common SQL Examples',
    ja: '一般的なSQLサンプル',
  },
  useSQL: {
    zh: '使用 SQL',
    en: 'Use this SQL',
    ja: 'このSQLを使用',
  },
  usageScenarios: {
    zh: '应用场景',
    en: 'Usage scenarios',
    ja: '使用シナリオ',
  },
  exampleOfInput: {
    zh: '输入消息示例',
    en: 'Example of input message',
    ja: '入力メッセージの例',
  },
  processedResults: {
    zh: '处理结果',
    en: 'Processed results',
    ja: '処理結果',
  },
  customTopic: {
    zh: '自定义主题',
    en: 'Custom topic',
    ja: 'カスタムトピック',
  },
  event: {
    zh: '事件',
    en: 'Event',
    ja: 'イベント',
  },
  events: {
    zh: '事件',
    en: 'Events',
    ja: 'イベント',
  },
  allMsgsAndEvents: {
    zh: '所有消息和事件',
    en: 'All Message and Events',
    ja: 'すべてのメッセージとイベント',
  },
  eventsDesc: {
    zh: '规则可以通过 MQTT 消息、事件或数据桥来触发。在 SQL 中，多个数据源可以使用逗号分隔。',
    en: 'Rules can be triggered by MQTT messages, events, or data bridges. In SQL, multiple data sources can be separated with commas.',
    ja: 'ルールは、MQTTメッセージ、イベント、データブリッジによってトリガーできます。SQLでは、複数のデータソースをコンマで区切ることができます。',
  },
  useEvent: {
    zh: '使用事件',
    en: 'Use event',
    ja: 'イベントを使用',
  },
  messagePublishDesc: {
    zh: '当消息发布到指定的一个或多个主题时触发规则，SQL 语句中可直接使用 MQTT 主题',
    en: 'Trigger rule when a message is published to one or more of the specified topics, and the MQTT topic can be used directly in the SQL',
    ja: '1つまたは複数の指定トピックにメッセージがパブリッシュされるとルールがトリガーされます。MQTTトピックはSQL内で直接使用できます。',
  },
  messageDeliveredDesc: {
    zh: '当消息被放入底层 socket 时触发规则',
    en: 'Trigger the rule when a message is put into the underlying socket',
    ja: 'メッセージが基礎となるソケットに置かれたときにルールがトリガーされます',
  },
  messageAckedDesc: {
    zh: '当消息发送到客户端，并收到客户端回复的 ACK 时触发规则，仅 QoS1，QoS2 会触发',
    en: `The rule is triggered when the message is sent to the client and an ack is received from the client. Only QoS1 and QoS2 messages will be triggered`,
    ja: 'メッセージがクライアントに送信され、クライアントからACKが受信されたときにルールがトリガーされます。QoS1とQoS2のメッセージのみがトリガーされます。',
  },
  messageDroppedDesc: {
    zh: '当一条消息无任何订阅者时触发规则',
    en: `Trigger rule when a message has no subscribers`,
    ja: 'メッセージにサブスクライバーがいないときにルールがトリガーされます',
  },
  deliveryDroppedDesc: {
    zh: '当订阅者的消息队列已满时触发规则',
    en: `Trigger rule when subscriber's message queue is full`,
    ja: 'サブスクライバーのメッセージキューがいっぱいのときにルールがトリガーされます',
  },
  clientConnectedDesc: {
    zh: '当终端连接成功时触发规则',
    en: `Trigger the rule when the terminal is connected successfully`,
    ja: '端末の接続が成功したときにルールがトリガーされます',
  },
  clientDisconnectedDesc: {
    zh: '当终端连接断开时触发规则',
    en: `Trigger rule when terminal connection is lost`,
    ja: '端末の接続が失われたときにルールがトリガーされます',
  },
  clientConnackDesc: {
    zh: '当服务端向客户端发送 CONNACK 报文时触发规则，reason_code 包含各种错误原因代码',
    en: `The rule event is triggered when the server sends a CONNACK packet to the client. reason_code contains the error reason code.`,
    ja: 'サーバーがクライアントにCONNACKパケットを送信したときにルールイベントがトリガーされます。reason_codeにはさまざまなエラー理由コードが含まれています。',
  },
  clientCheckAuthzCompleteDesc: {
    zh: '当客户端鉴权结束时触发规则',
    en: `The rule event is triggered when the client check acl complete.`,
    ja: 'クライアントのACLチェックが完了したときにルールイベントがトリガーされます。',
  },
  sessionSubscribedDesc: {
    zh: '当终端订阅成功时触发规则',
    en: `Trigger the rule when the terminal subscribes successfully`,
    ja: '端末のサブスクリプションが成功したときにルールがトリガーされます',
  },
  sessionUnsubscribedDesc: {
    zh: '当取消终端订阅成功时触发规则',
    en: `Triggered when the terminal subscription is cancelled successfully`,
    ja: '端末のサブスクリプションのキャンセルが成功したときにルールがトリガーされます',
  },
  useBridge: {
    zh: '使用桥接',
    en: 'Use bridge',
    ja: 'ブリッジを使用',
  },
  bridgeForInputDesc: {
    zh: '当桥接从外部服务接收到消息时触发规则。',
    en: 'Triggered when a message is received from remote server.',
    ja: 'リモートサーバーからメッセージを受信したときにルールがトリガーされます。',
  },
  clientEvent: {
    zh: '客户端事件',
    en: 'Client event',
    ja: 'クライアントイベント',
  },
  dataTypeSQLNoMatch: {
    zh: '数据源与当前输入的 SQL 不匹配',
    en: `Data source doesn't match the entered SQL`,
    ja: 'データソースが入力されたSQLと一致しません',
  },
  backBridgeList: {
    zh: '返回 Bridge 列表',
    en: 'Back To Bridge List',
    ja: 'ブリッジリストに戻る',
  },
  headers: {
    zh: '请求头',
    en: 'Headers',
    ja: 'ヘッダー',
  },
  body: {
    zh: '请求体',
    en: 'Body',
    ja: '本文',
  },
  httpBridgeURLFieldDesc: {
    zh: "支持使用 ${'{'}field{'}'} 语法提取数据拼接 URL",
    en: "Supports extracting data concatenated URLs using the ${'{'}field{'}'} syntax",
    ja: "${'{'}field{'}'}構文を使用してデータを抽出し、URLを連結できます",
  },
  useBridgeCreateRule: {
    zh: '是否使用该数据桥接创建规则？',
    en: 'Would you like to create a Rule using this Data Bridge?',
    ja: 'このデータブリッジを使用してルールを作成しますか?',
  },
  console: {
    zh: '打印结果输出到控制台',
    en: 'Print the result to the Console',
    ja: '結果をコンソールに出力する',
  },
  total: {
    zh: '总数',
    en: 'Total',
    ja: '合計',
  },
  actionTotalDesc: {
    zh: '规则调用操作的次数。 此值可能是“命中”的数倍，具体取决于规则的操作数',
    en: "How many times the actions are called by the rule. This value may several times of 'matched', depending on the number of the actions of the rule",
    ja: 'ルールによってアクションが呼び出された回数です。この値は、ルールのアクションの数に応じて、「一致」の数倍になる場合があります。',
  },
  actionSuccessDesc: {
    zh: '规则成功调用操作的次数',
    en: 'The number of times the rule has successfully called the action',
    ja: 'ルールがアクションを正常に呼び出した回数',
  },
  actionFailedDesc: {
    zh: '规则调用操作失败的次数',
    en: 'The number of times the rule calling operation has failed',
    ja: 'ルールのアクション呼び出しが失敗した回数',
  },
  outOfService: {
    zh: '服务中止',
    en: 'Out of Service',
    ja: 'サービス停止',
  },
  actionOutOfServiceDesc: {
    zh: '由于操作停止服务而导致规则调用操作失败的次数。 例如，数据桥接被禁用或停止。',
    en: 'The number of times the rule calling action failed due to the action being out of service. For example, a bridge is disabled or stopped.',
    ja: 'アクションがサービス停止中のために、ルールのアクション呼び出しが失敗した回数です。例えば、ブリッジが無効または停止された場合等。',
  },
  unknown: {
    zh: '未知',
    en: 'Unknown',
    ja: '不明',
  },
  actionUnknownDesc: {
    zh: '由于未知错误导致的规则调用失败次数',
    en: 'The number of times the rule calling action failed due to an unknown error',
    ja: '不明なエラーにより、ルールのアクション呼び出しが失敗した回数',
  },
  deleteBridgeSecondConfirm: {
    zh: '删除该桥接会影响下方规则的数据流。如果该桥接已被添加到规则的动作中，则会立即删除。是否确认继续？',
    en: 'Deleting this bridge will affect the data flow for the rules listed below. If the bridge has been added to the actions of any rules, it will be removed immediately, continue?',
    ja: 'このブリッジを削除すると、以下のルールのデータフローに影響します。ブリッジがいずれかのルールのアクションに追加されている場合、すぐに削除されます。続行しますか?',
  },
  rateUnit: {
    zh: 'message/sec | messages/sec',
    en: 'message/sec | messages/sec',
    ja: 'message/sec | messages/sec',
  },
  saveAsCopy: {
    zh: '保存为副本',
    en: 'Save as copy',
    ja: 'コピーとして保存',
  },
  poolType: {
    zh: '连接池类型',
    en: 'Pool Type',
    ja: 'プールタイプ',
  },
  connectionPoolSize: {
    zh: '连接池大小',
    en: 'Connection Pool Size',
    ja: '接続プールサイズ',
  },
  autoRestartIntervalValueDesc: {
    zh: '如果时间间隔设置过短，可导致服务离线时反复进行连接测试以致给系统带来较大负载。',
    en: 'If the auto restart time interval is set too small, it might cause the connection test to be repeated when the service is offline, which will bring a lot load to the system.',
    ja: '自動再起動の間隔が短すぎると、サービスがオフラインの間、接続テストが繰り返し実行され、システムに大きな負荷がかかる可能性があります。',
  },
  confirmReset: {
    zh: '是否确认重置输入的测试数据？',
    en: 'Are you sure to reset the test data?',
    ja: 'テストデータをリセットしてよろしいですか?',
  },
  async: {
    zh: '异步',
    en: 'Async',
    ja: '非同期',
  },
  sync: {
    zh: '同步',
    en: 'Sync',
    ja: '同期',
  },
  advancedSettings: {
    zh: '高级设置',
    en: 'Advanced Settings',
    ja: '詳細設定',
  },
}
