export default {
  monitoringPlatform: {
    zh: '监控平台',
    en: 'Monitoring platform',
  },
  monitoringPlatformFormItemLabel: {
    zh: '选择一个监控平台，并配置所需信息',
    en: 'Select a monitoring platform and set the required configuration',
  },
  interval: {
    zh: '采集间隔',
    en: 'Interval',
  },
  dataReportingInterval: {
    zh: '数据上报时间间隔',
    en: 'Data reporting interval',
  },
  prometheusEnableDesc: {
    zh: '开启或关闭 Prometheus 数据推送',
    en: 'Turn Prometheus data pushing on or off',
  },
  prometheusServerDesc: {
    zh: 'Pushgateway 服务器地址',
    en: 'URL of Pushgateway server',
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
  promSetupHelp: {
    zh: 'Prometheus 与 Grafana 配置帮助',
    en: 'Prometheus and Grafana setup help',
  },
  promSetupHelpDesc: {
    zh: 'EMQX 将使用 Prometheus 的 Pushgateway 服务来推送监控数据，您可以使用 Grafana 来可视化监控数据。',
    en: 'EMQ X will use the Prometheus Pushgateway service to push monitoring data, and you can use Grafana to visualize the monitoring data.',
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
    zh: '对于需要监控服务的物理机或虚拟机的用户，您可以使用 Node Exporter 来采集系统信息',
    en: 'For physical machines or virtual machines that need to monitor services, you can use Node Exporter to collect system information',
  },
  checkNodeExporter: {
    zh: '点击查看',
    en: 'Click to view the',
  },
  nodeExporterVersion: {
    zh: 'Node Exporter 可用版本',
    en: 'Node Exporter available versions',
  },
  replaceVersion: {
    zh: '并替换到下方命令中',
    en: 'and replace it in the command below',
  },
  promConfig: {
    zh: '配置 Prometheus',
    en: 'Configure Prometheus',
  },
  promStepTwo: {
    zh: '在 Prometheus 的配置文件中添加 Pushgateway 和 Prometheus 服务的地址，如需使用 Node Exporter，还需添加 Node Exporter 的地址。',
    en: 'Add the address of the Pushgateway and Prometheus services to the Prometheus configuration file. If you want to use Node Exporter, you also need to add the address of Node Exporter.',
  },
  promRun: {
    zh: '再使用生成的配置文件来启动 Prometheus，例如使用以下命令:',
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
    zh: '点击下方按钮下载默认的 Grafana Dashboard 模版',
    en: 'Click the button below to download the default Grafana Dashboard template',
  },
  clickDonwnloadTemplate: {
    zh: '下载 Grafana 模版',
    en: 'Download Grafana Template',
  },
  genPromConfig: {
    zh: '生成配置文件',
    en: 'Generate Configuration File',
  },
}
