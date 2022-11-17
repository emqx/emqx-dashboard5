import { reactive, Ref, ref, watch } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'

const usePromConfig = (): {
  promConfigWithPg: {
    promHost: string
    pushgatewayHost: string
    nodeExporterHost: string
  }
  promConfigDefault: {
    emqxHost: string
    metricsPath: string
    nodeExporterHost: string
  }
  promPgContent: Ref<string>
  promDefaultContent: Ref<string>
  rulesWithPg: Record<string, any>
  rulesDefault: Record<string, any>
} => {
  const { tl } = useI18nTl('MonitoringIntegration')
  const promConfigWithPg = reactive({
    promHost: '',
    pushgatewayHost: '',
    nodeExporterHost: '',
  })
  const rulesWithPg = {
    pushgatewayHost: [
      {
        required: true,
        message: tl('pushgatewayRequired'),
      },
    ],
  }
  const rulesDefault = {
    emqxHost: [
      {
        required: true,
        message: tl('emqxRequired'),
      },
    ],
    metricsPath: [
      {
        required: true,
        message: tl('metricsPathRequired'),
      },
    ],
  }
  const promConfigDefault = reactive({
    emqxHost: '127.0.0.1:18083',
    metricsPath: '/api/v5/prometheus/stats',
    nodeExporterHost: '',
  })
  watch(promConfigWithPg, (val) => {
    promPgContent.value = getPromConfigWithPushgateway(val)
  })
  watch(promConfigDefault, (val) => {
    promDefaultContent.value = getPromConfigDefault(val)
  })
  const getPromConfigDefault = (configs: {
    emqxHost: string
    metricsPath: string
    nodeExporterHost: string
  }) => `# prometheus.yaml
global:
  scrape_interval:     10s # The default scrape interval is every 10 seconds.
  evaluation_interval: 10s # The default evaluation interval is every 10 seconds.
  # On this machine, every time series will be exported by default.
  external_labels:
    monitor: 'emqx-monitor'
# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first.rules"
  # - "second.rules"
  - "/etc/prometheus/rules/*.rules"
# Data pull configuration
scrape_configs:
  # EMQX monitoring
  - job_name: 'emqx'
    metrics_path: ${configs.metricsPath}
    scrape_interval: 5s
    honor_labels: true
    static_configs:
      # EMQX IP address and port
      - targets: [${configs.emqxHost}]
  - job_name: 'node-exporter'
    scrape_interval: 5s
    static_configs:
      # node-exporter IP address and port
      - targets: ['${configs.nodeExporterHost || '127.0.0.1:9100'}']
        labels:
          instance: dashboard-local
`
  const getPromConfigWithPushgateway = (configs: {
    promHost: string
    pushgatewayHost: string
    nodeExporterHost: string
  }) => `# prometheus.yaml
global:
  scrape_interval:     10s # The default scrape interval is every 10 seconds.
  evaluation_interval: 10s # The default evaluation interval is every 10 seconds.
  # On this machine, every time series will be exported by default.
  external_labels:
    monitor: 'emqx-monitor'
# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first.rules"
  # - "second.rules"
  - "/etc/prometheus/rules/*.rules"
# Data pull configuration
scrape_configs:
  # Meaning that in this configuration, each time series will automatically add this {job_name: "prometheus"} label.
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      # Prometheus IP address and port
      - targets: ['${configs.promHost || '127.0.0.1:9090'}']
  # Server physical machine monitoring
  - job_name: 'node-exporter'
    scrape_interval: 5s
    static_configs:
      # node-exporter IP address and port
      - targets: ['${configs.nodeExporterHost || '127.0.0.1:9100'}']
        labels:
          instance: dashboard-local
  # EMQX Pushgateway monitoring
  - job_name: 'pushgateway'
    scrape_interval: 5s
    honor_labels: true
    static_configs:
      # Pushgateway IP address and port
      - targets: ['${configs.pushgatewayHost}']
`
  const promPgContent = ref(getPromConfigWithPushgateway(promConfigWithPg))
  const promDefaultContent = ref(getPromConfigDefault(promConfigDefault))
  return {
    promConfigWithPg,
    promPgContent,
    rulesWithPg,
    promConfigDefault,
    promDefaultContent,
    rulesDefault,
  }
}

export default usePromConfig
