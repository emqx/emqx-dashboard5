export default {
  monitoringPlatform: {
    zh: '监控平台',
    en: 'Monitoring platform',
  },
  monitoringPlatformFormItemLabel: {
    zh: '选择一个监控平台，配置完成后点击“帮助”按钮查看如何配置监控平台。',
    en: 'Select a monitoring platform, click the Help button after configuration to see how to configure the monitoring platform.',
  },
  interval: {
    zh: '采集间隔',
    en: 'Interval',
  },
  dataReportingInterval: {
    zh: '监控数据指标上报到监控服务的时间间隔。',
    en: 'The time interval at which monitoring data metrics are reported to the monitoring service.',
  },
  prometheusEnableDesc: {
    zh: '开启或关闭 Prometheus 数据推送。',
    en: 'Enable or disable Prometheus data push.',
  },
  statsDEnableDesc: {
    zh: '打开或关闭 StatsD 数据推送',
    en: 'Turn StatsD data pushing on or off',
  },
  statsDServerDesc: {
    zh: 'StatsD 服务器地址',
    en: 'URL of StatsD server',
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
}
