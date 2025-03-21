export default {
  monitoringPlatform: {
    zh: '监控平台',
    en: 'Monitoring platform',
  },
  monitoringPlatformFormItemLabel: {
    en: `Select a monitoring platform, for Prometheus, click the "Help button" after configuration to see how to configure the monitoring platform.`,
    zh: '选择一个监控平台，对于 Prometheus，配置后点击 "帮助按钮" 查看如何配置监控平台。',
  },
  enablePushgateway: {
    zh: '启用 Pushgateway',
    en: 'Enable Pushgateway',
  },
  enablePushgatewayDesc: {
    zh: '启用后，EMQX 将会将监控数据推送到 Pushgateway，然后由 Prometheus 从 Pushgateway 中拉取数据。',
    en: 'After enabling, EMQX will push the monitoring metrics data to the Pushgateway, and then Prometheus will pull the data from the Pushgateway.',
  },
  interval: {
    zh: '采集间隔',
    en: 'Interval',
  },
  jobName: {
    zh: 'Job 名称',
    en: 'Job Name',
  },
  jobNameDesc: {
    zh: `推送到 Pushgateway 的 Job 名称。可用变量为：<br/>
- \${'{'}name{'}'}: EMQX 节点的名称。<br/>
- \${'{'}host{'}'}: EMQX 节点主机名。<br/>
例如，当 EMQX 节点名为 <code>emqx{'@'}127.0.0.1</code> 则 name 变量的值为 <code>emqx</code>，host 变量的值为 <code>127.0.0.1</code>。<br/>
默认值为: <code>\${'{'}name{'}'}/instance/\${'{'}name{'}'}~\${'{'}host{'}'}</code>`,
    en: `Job Name that is pushed to the Pushgateway. Available variables:<br/>
- \${'{'}name{'}'}: Name of EMQX node.<br/>
- \${'{'}host{'}'}: Host name of EMQX node.<br/>
For example, when the EMQX node name is <code>emqx{'@'}127.0.0.1</code> then the <code>name</code> variable takes value <code>emqx</code> and the <code>host</code> variable takes value <code>127.0.0.1</code>.<br/>
Default value is: <code>\${'{'}name{'}'}/instance/\${'{'}name{'}'}~\${'{'}host{'}'}</code>`,
  },
  headersDesc: {
    zh: `推送到 Pushgateway 的 HTTP Headers 列表。<br/>
例如，<code> {'{'} Authorization = "some-authz-tokens"{'}'}</code>`,
    en: `A list of HTTP Headers when pushing to Pushgateway.<br/>
For example, <code> {'{'} Authorization = "some-authz-tokens"{'}'}</code>`,
  },
  dataReportingInterval: {
    zh: '监控数据指标上报到监控服务的时间间隔。',
    en: 'The time interval at which monitoring data metrics are reported to the monitoring service.',
  },
  pushgatewayServer: {
    zh: 'Pushgateway 服务',
    en: 'Pushgateway Server',
  },
  pushgatewayDesc: {
    zh: '通常情况下不需要使用。启用后，将会在每个节点上启动 Pushgateway，用于收集 Prometheus Push 模式的监控数据。',
    en: 'Usually not needed. When enabled, Pushgateway will be started on each node to collect Prometheus Push mode monitoring data.',
  },
  learn: {
    zh: '了解',
    en: 'Learn ',
  },
  usePushgateway: {
    zh: '使用 Pushgateway',
    en: 'Use Pushgateway',
  },
  whenToUsePushgateway: {
    zh: '何时使用 Pushgateway',
    en: 'When to use Pushgateway',
  },
  promSetupHelp: {
    zh: 'Prometheus 与 Grafana 配置帮助',
    en: 'Prometheus and Grafana setup help',
  },
  promSetupHelpDesc: {
    zh: 'EMQX 支持将数据集成到 Prometheus 服务中来监控数据，可以使用 Grafana 来可视化监控数据。通常使用默认方法即可完成配置，也可选择使用 Pushgateway。',
    en: 'EMQX supports integrating data into the Prometheus service to monitor data, and you can use Grafana to visualize monitoring data. Usually the default method can be used to complete the configuration, or you can choose to use Pushgateway.',
  },
  pushgatewayInstall: {
    zh: '安装 Pushgateway 或 Node Exporter 服务',
    en: 'Install the Pushgateway or Node Exporter service',
  },
  promStepOne: {
    zh: '可以使用 Docker 来安装和启动 Pushgateway 服务，例如使用以下命令：',
    en: 'You can use Docker to install and start the Pushgateway service, for example, use the following command:',
  },
  nodeExporterDesc: {
    zh: '对于监控物理机或虚拟机的系统信息可使用 Node Exporter, 点击查看 ',
    en: 'For monitoring system information of physical machines or VM, you can use Node Exporter, click to view ',
  },
  installNodeExporter: {
    zh: '安装和运行 Node Exporter。',
    en: 'Installing and running the Node Exporter.',
  },
  promConfig: {
    zh: '配置 Prometheus',
    en: 'Configure Prometheus',
  },
  promConfigDesc: {
    zh: '生成 Prometheus 配置文件，包括 EMQX 服务地址，以及 EMQX 提供监控数据 API 的 Path。',
    en: 'Generate a Prometheus configuration file, including the EMQX service address, and the Path of the EMQX monitoring metrics data API.',
  },
  promStepTwo: {
    zh: '在 Prometheus 的配置文件中添加 Pushgateway 服务的地址，Node Exporter 和 Prometheus 的地址在有需要的情况下再添加。',
    en: 'Add the address of the Pushgateway service to the Prometheus configuration file, and add the address of Node Exporter and Prometheus if necessary.',
  },
  promRun: {
    zh: '再使用生成的配置文件来启动 Prometheus，例如使用以下命令：',
    en: 'Then use the generated configuration file to start Prometheus, for example, use the following command:',
  },
  grafConfig: {
    zh: '配置 Grafana',
    en: 'Configure Grafana',
  },
  promStepThree: {
    zh: '在 Grafana 中添加 Prometheus 作为数据源，然后添加配置或导入一个 Dashboard 来可视化监控数据，例如可使用以下启动命令：',
    en: 'Add Prometheus as a data source in Grafana, then add a configuration or import a Dashboard to visualize the monitoring data, for example, you can use the following startup command:',
  },
  clickDownloadTemplateDesc: {
    zh: '点击下方按钮下载默认的 Grafana Dashboard 模版。',
    en: 'Click the button below to download the default Grafana Dashboard template.',
  },
  clickDonwnloadTemplate: {
    zh: '下载 Grafana 模版',
    en: 'Download Grafana Template',
  },
  genPromConfig: {
    zh: '生成配置文件',
    en: 'Generate Configuration File',
  },
  pushgatewayRequired: {
    zh: '请配置 Pushgateway 地址',
    en: 'Please configure the Pushgateway address',
  },
  emqxRequired: {
    zh: '请配置 EMQX 地址',
    en: 'Please configure the EMQX address',
  },
  metricsPathRequired: {
    zh: '请配置 metrics API path',
    en: 'Please configure the metrics API path',
  },
  endpoint: {
    zh: '服务地址',
    en: 'Endpoint',
  },
  exportInterval: {
    zh: '导出间隔',
    // Must have a space at the beginning
    en: ' Export Interval',
  },
  enableBasicAuth: {
    zh: '启用基本认证',
    en: 'Enable Basic Auth',
  },
  enableBasicAuthDesc: {
    zh: '启用或禁用 Prometheus 抓取 API 的基本认证，不适用于 Pushgateway',
    en: 'Enable or disable basic authentication for Prometheus scrape API, not for Pushgateway',
  },
  featureSelection: {
    zh: '功能选择',
    en: 'Feature Selection',
  },
  metricsEnable: {
    zh: '指标',
    en: 'Metrics',
  },
  tracesEnable: {
    zh: '追踪',
    en: 'Traces',
  },
  tracesFilterTracesAll: {
    zh: '追踪全部消息',
    en: 'Traces All Messages',
  },
  tracesFilterTracesAllDesc: {
    zh: '当启用时，EMQX 将追踪所有发布的消息，如果无法从消息中提取追踪ID，则会生成一个新的追踪ID。当禁用时，只有在发布时带有追踪上下文（Trace context）的消息才会被追踪。',
    en: 'When enabled, the EMQX will trace all published messages. If a trace ID cannot be extracted from the message, a new trace ID will be generated. When disabled, only messages with trace context at the time of publishing will be traced.',
  },
  logsEnable: {
    zh: '日志',
    en: 'Logs',
  },
  logsLevel: {
    zh: '日志级别',
    en: 'Logs Level',
  },
  dataDogTip: {
    zh: '无需配置额外参数。',
    en: 'No extra configuration is required.',
  },
  thisDoc: {
    zh: '此文档',
    en: 'this doc',
  },
  datadogIntegration: {
    zh: 'Datadog - EMQX 集成',
    en: 'Datadog - EMQX Integration',
  },
  e2e: {
    zh: '端到端',
    en: 'End-to-End',
  },
  traceMode: {
    zh: '追踪模式',
    en: 'Trace Mode',
  },
  traceModeDesc: {
    zh: 'OpenTelemetry 追踪模式。<br/><br/>- `Legacy`: 遵循旧的追踪方法，仅追踪消息发布和传递。<br/><br/>  Span 名称将保持与旧版本兼容。<br/>- `E2E`: 端到端追踪模式。将追踪所有类型的客户端行为：<br/><br/>  连接/断开连接/订阅/取消订阅/消息发布/消息传递。<br/><br/>  更多控制选项和采样函数由 `e2e_tracing_options` 子配置项控制<br/>',
    en: 'OpenTelemetry tracing mode.<br/><br/>- `legacy`: follow the old tracing method, only trace message publishing and delivery.<br/><br/>  Span Name will remain compatible with the old version.<br/>- `e2e`: end-to-end tracing mode. All kinds of client behaviors will be traced:<br/><br/>  Connection/Disconnection/Subscription/Unsubscription/Message Publishing/Message delivery.<br/><br/>  More control options and sampling functions are controlled by the `e2e_tracing_options` sub-configuration item<br/>',
  },
  traceAdvancedConfig: {
    zh: '追踪高级配置',
    en: 'Trace Advanced Configuration',
  },
  closeTraceAdvancedConfig: {
    zh: '关闭追踪高级配置?',
    en: 'Close Trace Advanced Configuration?',
  },
  clusterIdentifier: {
    zh: '集群标识符',
    en: 'Cluster Identifier',
  },
  clusterIdentifierDesc: {
    zh: '添加到 Span 的 Attributes 中的属性值。属性键将是 `cluster.id`。通常，设置一个简单且易于识别的名称或使用集群名称来标识不同的 EMQX 集群。',
    en: "An attribute value added into Span's Attributes. The attribute key will be `cluster.id`. Typically, set a simple and easily recognizable name or use the cluster name to identify different EMQX clusters.",
  },
  alreadyExists: {
    zh: '已存在',
    en: 'Already Exists',
  },
  traceConf: {
    zh: '追踪配置',
    en: 'Trace Configuration',
  },
  whiteList: {
    zh: '白名单',
    en: 'White List',
  },
  traceConnect: {
    zh: '跟踪连接/断开',
    en: 'Trace Connect/Disconnect',
  },
  traceSubscription: {
    zh: '跟踪订阅/取消订阅',
    en: 'Trace Subscribe/Unsubscribe',
  },
  traceMessage: {
    zh: '跟踪消息',
    en: 'Trace Message',
  },
  traceSamplingRatio: {
    zh: '跟踪抽样频率',
    en: 'Trace Sampling Ratio',
  },
  traceSamplingRatioDesc: {
    zh: '追踪事件的采样比率。',
    en: 'Sampling ratio of trace events.',
  },
  notEnabledAllTraceTip: {
    zh: '无已启用的追踪事件',
    en: 'No trace events are enabled',
  },
  messageTraceDetailLevel: {
    zh: '消息追踪级别',
    en: 'Message Trace Level',
  },
  messageTraceLevelDesc: {
    zh: '消息发布过程中所有消息交换的跟踪级别。',
    en: 'Trace level for all message exchanges during the message publishing process.',
  },
  messageTraceLevel0Desc: {
    zh: '以下事件将被跟踪，包括：<br/>- `client.publish`<br/>- `client.authz`<br/>- `message.route`<br/>- `message.forward`<br/>- `message.handle_forward`<br/>- `broker.publish`',
    en: 'The following events will be traced:<br/>- `client.publish`<br/>- `client.authz`<br/>- `message.route`<br/>- `message.forward`<br/>- `message.handle_forward`<br/>- `broker.publish`',
  },
  messageTraceLevel1Desc: {
    zh: '在基本事件的基础上，还包括以下事件：<br/>- `broker.puback`<br/>- `client.puback`<br/>- `broker.pubrec`<br/>- `client.pubrec` <br/>即 QoS1 或 QoS2 消息交互中的第一个响应数据包。',
    en: 'In addition to basic events, the following events are also included:<br/>- `broker.puback`<br/>- `client.puback`<br/>- `broker.pubrec`<br/>- `client.pubrec` <br/>That is, the first response packet in the QoS1 or QoS2 message interaction.',
  },
  messageTraceLevel2Desc: {
    zh: '在一级跟踪的基础上，进一步包括以下事件： <br/>- `broker.pubrel`<br/>- `client.pubrel`<br/>- `broker.pubcomp`<br/>- `client.pubcomp` <br/>即所有 MQTT 报文交互的数据包。',
    en: 'In addition to level-1 tracing, the following events are further included:<br/>- `broker.pubrel`<br/>- `client.pubrel`<br/>- `broker.pubcomp`<br/>- `client.pubcomp` <br/>That is, all packet of MQTT message interaction.',
  },
  basicEvents: {
    zh: '基础事件',
    en: 'Basic Events',
  },
  addTargetToWhiteList: {
    zh: '添加{target}到白名单',
    en: 'Add {target} to White List',
  },
}
