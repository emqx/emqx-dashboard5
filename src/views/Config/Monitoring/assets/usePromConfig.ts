import { reactive, Ref, ref, watch } from 'vue'

const usePromConfig = (): {
  promYamlConfigs: {
    promHost: string
    pushgatewayHost: string
    nodeExporterHost: string
  }
  promConfigContent: Ref<string>
} => {
  const promYamlConfigs = reactive({
    promHost: '',
    pushgatewayHost: '',
    nodeExporterHost: '',
  })
  watch(promYamlConfigs, (val) => {
    promConfigContent.value = getPromConfigContent(val)
  })
  const getPromConfigContent = (configs: {
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
      - targets: ['${configs.promHost}']
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
  const promConfigContent = ref(getPromConfigContent(promYamlConfigs))
  return {
    promYamlConfigs,
    promConfigContent,
  }
}

export default usePromConfig
