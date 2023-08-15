export default {
  monitoringPlatform: {
    zh: '监控平台',
    en: 'Monitoring platform',
    ja: 'モニタリングプラットフォーム',
  },
  monitoringPlatformFormItemLabel: {
    zh: '选择一个监控平台，配置完成后点击“帮助”按钮查看如何配置监控平台。',
    en: 'Select a monitoring platform, click the Help button after configuration to see how to configure the monitoring platform.',
    ja: 'モニタリングプラットフォームを選択し、設定後に「ヘルプ」ボタンをクリックして、モニタリングプラットフォームの設定方法を確認してください。',
  },
  enablePushgateway: {
    zh: '启用 Pushgateway',
    en: 'Enable Pushgateway',
    ja: 'Pushgatewayを有効にする',
  },
  enablePushgatewayDesc: {
    zh: '启用后，EMQX 将会将监控数据推送到 Pushgateway，然后由 Prometheus 从 Pushgateway 中拉取数据。',
    en: 'After enabling, EMQX will push the monitoring metrics data to the Pushgateway, and then Prometheus will pull the data from the Pushgateway.',
    ja: '有効化すると、EMQXはモニタリングメトリクスデータをPushgatewayにプッシュし、PrometheusがPushgatewayからデータをプルします。',
  },
  interval: {
    zh: '采集间隔',
    en: 'Interval',
    ja: '収集間隔',
  },
  jobName: {
    zh: 'Job 名称',
    en: 'Job Name',
    ja: 'ジョブ名',
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
    ja: `Pushgatewayにプッシュされるジョブ名。使用可能な変数は以下の通り:<br/>
- \${'{'}name{'}'}：EMQXノードの名前。<br/>
- \${'{'}host{'}'}：EMQXノードのホスト名。<br/>
例えば、EMQXノード名が<code>emqx@127.0.0.1</code>の場合、<code>name</code>変数は<code>emqx</code>、<code>host</code>変数は<code>127.0.0.1</code>となる。<br/> デフォルト値は:<code>\${'{'}name{'}'}/instance/\${'{'}name{'}'}~\${'{'}host{'}'}</code>`,
  },
  headersDesc: {
    zh: `推送到 Pushgateway 的 HTTP Headers 列表。<br/>
例如，<code> {'{'} Authorization = "some-authz-tokens"{'}'}</code>`,
    en: `A list of HTTP Headers when pushing to Pushgateway.<br/>
For example, <code> {'{'} Authorization = "some-authz-tokens"{'}'}</code>`,
    ja: `Pushgatewayへのプッシュ時のHTTPヘッダーのリスト。<br/>
    例えば、<code> {'{'} Authorization = "some-authz-tokens"{'}'}</code>`,
  },
  dataReportingInterval: {
    zh: '监控数据指标上报到监控服务的时间间隔。',
    en: 'The time interval at which monitoring data metrics are reported to the monitoring service.',
    ja: 'モニタリングデータメトリクスがモニタリングサービスに報告される時間間隔。',
  },
  pushgatewayServer: {
    zh: 'Pushgateway 服务',
    en: 'Pushgateway Server',
    ja: 'Pushgatewayサーバー',
  },
  pushgatewayDesc: {
    zh: '通常情况下不需要使用。启用后，将会在每个节点上启动 Pushgateway，用于收集 Prometheus Push 模式的监控数据。',
    en: 'Usually not needed. When enabled, Pushgateway will be started on each node to collect Prometheus Push mode monitoring data.',
    ja: '通常は必要ありません。有効にすると、Prometheus Pushモードのモニタリングデータを収集するために、各ノード上でPushgatewayが起動します。',
  },
  learn: {
    zh: '了解',
    en: 'Learn ',
    ja: '学習',
  },
  usePushgateway: {
    zh: '使用 Pushgateway',
    en: 'Use Pushgateway',
    ja: 'Pushgatewayの使用',
  },
  whenToUsePushgateway: {
    zh: '何时使用 Pushgateway',
    en: 'When to use Pushgateway',
    ja: 'Pushgatewayの使用シナリオ',
  },
  promSetupHelp: {
    zh: 'Prometheus 与 Grafana 配置帮助',
    en: 'Prometheus and Grafana setup help',
    ja: 'PrometheusとGrafanaの設定ヘルプ',
  },
  promSetupHelpDesc: {
    zh: 'EMQX 支持将数据集成到 Prometheus 服务中来监控数据，可以使用 Grafana 来可视化监控数据。通常使用默认方法即可完成配置，也可选择使用 Pushgateway。',
    en: 'EMQX supports integrating data into the Prometheus service to monitor data, and you can use Grafana to visualize monitoring data. Usually the default method can be used to complete the configuration, or you can choose to use Pushgateway.',
    ja: 'EMQXは、データをPrometheusサービスに統合してデータをモニタリングし、Grafanaを使用してモニタリングデータを可視化することをサポートしています。通常、デフォルトの方法で設定を完了できますが、Pushgatewayを使用することも選択できます。',
  },
  pushgatewayInstall: {
    zh: '安装 Pushgateway 或 Node Exporter 服务',
    en: 'Install the Pushgateway or Node Exporter service',
    ja: 'PushgatewayまたはNode Exporterのインストール',
  },
  promStepOne: {
    zh: '可以使用 Docker 来安装和启动 Pushgateway 服务，例如使用以下命令：',
    en: 'You can use Docker to install and start the Pushgateway service, for example, use the following command:',
    ja: '次のコマンドなどを使用して、DockerでPushgatewayサービスをインストールおよび起動できます:',
  },
  nodeExporterDesc: {
    zh: '对于监控物理机或虚拟机的系统信息可使用 Node Exporter, 点击查看 ',
    en: 'For monitoring system information of physical machines or VM, you can use Node Exporter, click to view ',
    ja: '物理マシンまたはVMのシステム情報をモニタリングするには、Node Exporterを使用できます。詳細はこちらをクリックしてください。',
  },
  installNodeExporter: {
    zh: '安装和运行 Node Exporter。',
    en: 'Installing and running the Node Exporter.',
    ja: 'Node Exporterのインストールと実行。',
  },
  promConfig: {
    zh: '配置 Prometheus',
    en: 'Configure Prometheus',
    ja: 'Prometheusの設定',
  },
  promConfigDesc: {
    zh: '生成 Prometheus 配置文件，包括 EMQX 服务地址，以及 EMQX 提供监控数据 API 的 Path。',
    en: 'Generate a Prometheus configuration file, including the EMQX service address, and the Path of the EMQX monitoring metrics data API.',
    ja: 'EMQXのサービスアドレスとEMQXのモニタリングメトリクスデータAPIのパスを持つPrometheus設定ファイルを生成します。',
  },
  promStepTwo: {
    zh: '在 Prometheus 的配置文件中添加 Pushgateway 服务的地址，Node Exporter 和 Prometheus 的地址在有需要的情况下再添加。',
    en: 'Add the address of the Pushgateway service to the Prometheus configuration file, and add the address of Node Exporter and Prometheus if necessary.',
    ja: 'Prometheusの設定ファイルにPushgatewayサービスのアドレスを追加し、必要に応じてNode ExporterとPrometheusのアドレスを追加します。',
  },
  promRun: {
    zh: '再使用生成的配置文件来启动 Prometheus，例如使用以下命令：',
    en: 'Then use the generated configuration file to start Prometheus, for example, use the following command:',
    ja: '生成した設定ファイルを使い、以下のコマンドでPrometheusを起動してください。',
  },
  grafConfig: {
    zh: '配置 Grafana',
    en: 'Configure Grafana',
    ja: 'Grafanaの設定',
  },
  promStepThree: {
    zh: '在 Grafana 中添加 Prometheus 作为数据源，然后添加配置或导入一个 Dashboard 来可视化监控数据，例如可使用以下启动命令：',
    en: 'Add Prometheus as a data source in Grafana, then add a configuration or import a Dashboard to visualize the monitoring data, for example, you can use the following startup command:',
    ja: 'GrafanaにPrometheusをデータソースとして追加した後、モニタリングデータを視覚化するための設定を追加するか、ダッシュボードをインポートします。以下の起動コマンドを例にしてください：',
  },
  clickDownloadTemplateDesc: {
    zh: '点击下方按钮下载默认的 Grafana Dashboard 模版。',
    en: 'Click the button below to download the default Grafana Dashboard template.',
    ja: '以下のボタンをクリックして、デフォルトのGrafanaダッシュボードテンプレートをダウンロードします。',
  },
  clickDonwnloadTemplate: {
    zh: '下载 Grafana 模版',
    en: 'Download Grafana Template',
    ja: 'Grafanaテンプレートのダウンロード',
  },
  genPromConfig: {
    zh: '生成配置文件',
    en: 'Generate Configuration File',
    ja: '設定ファイルの生成',
  },
  pushgatewayRequired: {
    zh: '请配置 Pushgateway 地址',
    en: 'Please configure the Pushgateway address',
    ja: 'Pushgatewayのアドレスを設定してください',
  },
  emqxRequired: {
    zh: '请配置 EMQX 地址',
    en: 'Please configure the EMQX address',
    ja: 'EMQXのアドレスを設定してください',
  },
  metricsPathRequired: {
    zh: '请配置 metrics API path',
    en: 'Please configure the metrics API path',
    ja: 'メトリクスAPIのアドレスを設定してください',
  },
}
