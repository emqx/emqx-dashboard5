<template>
  <el-drawer
    :title="tl('promSetupHelp')"
    v-model="showDrawer"
    :lock-scroll="false"
    custom-class="prom-setup-drawer"
    size="50%"
  >
    <p class="description summary">{{ tl('promSetupHelpDesc') }}</p>
    <el-tabs type="card" class="detail-tabs" v-model="activeTab">
      <!-- Default -->
      <el-tab-pane :label="$t('Base.default')" name="default">
        <div class="step-contents">
          <div class="step-one step">
            <h3>{{ tl('promConfig') }}</h3>
            <p class="description">{{ tl('promConfigDesc') }}</p>
            <div class="node-exporter">
              <p class="description">
                {{ tl('nodeExporterDesc') }}
                <a
                  href="https://prometheus.io/docs/guides/node-exporter/#monitoring-linux-host-metrics-with-the-node-exporter"
                  target="_blank"
                  rel="noopener"
                >
                  {{ tl('installNodeExporter') }}
                </a>
              </p>
            </div>
            <el-row :gutter="20" class="prom-config-row">
              <el-col :span="14">
                <div class="monaco-container">
                  <Monaco id="prom-config-default" v-model="promDefaultContent" lang="yaml" />
                </div>
              </el-col>
              <el-col :span="10">
                <el-form
                  ref="promDefaultForm"
                  label-position="top"
                  hide-required-asterisk
                  :model="promConfigDefault"
                  :rules="rulesDefault"
                >
                  <el-form-item label="EMQX" prop="emqxHost">
                    <el-input v-model="promConfigDefault.emqxHost" placeholder="127.0.0.1:9091" />
                  </el-form-item>
                  <el-form-item label="Metrics API Path" prop="metricsPath">
                    <el-input
                      v-model="promConfigDefault.metricsPath"
                      placeholder="127.0.0.1:9090"
                    />
                  </el-form-item>
                  <el-form-item label="Node Exporter" prop="nodeExporterHost">
                    <el-input
                      v-model="promConfigDefault.nodeExporterHost"
                      placeholder="127.0.0.1:9100"
                    />
                  </el-form-item>
                  <el-button
                    class="gen-button"
                    type="primary"
                    plain
                    @click="genPromConfig('default')"
                    >{{ tl('genPromConfig') }}</el-button
                  >
                </el-form>
              </el-col>
            </el-row>
            <p class="description">{{ tl('promRun') }}</p>
            <CodeView
              lang="bash"
              code="docker run -d --name prometheus -p 9090:9090 -v /path/to/prometheus.yaml:/etc/prometheus/prometheus.yaml prom/prometheus --config.file=/etc/prometheus/prometheus.yaml"
            />
          </div>
          <div class="step-three step">
            <h3>{{ tl('grafConfig') }}</h3>
            <p class="description">{{ tl('promStepThree') }}</p>
            <CodeView
              lang="bash"
              code="docker run -d --name grafana -p 3000:3000 grafana/grafana-oss"
            />
            <p class="description">{{ tl('clickDownloadTemplateDesc') }}</p>
            <el-button type="primary" plain @click="downloadGrafaTemplate">{{
              tl('clickDonwnloadTemplate')
            }}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- Use Pushgateway -->
      <el-tab-pane :label="tl('usePushgateway')" name="usePushgateway">
        <el-row>
          <el-col :span="22">
            <div class="step-contents">
              <div class="step-one step">
                <h3>{{ tl('pushgatewayInstall') }}</h3>
                <p class="description">{{ tl('promStepOne') }}</p>
                <CodeView
                  code="docker run -d --name pushgateway -p 9091:9091 prom/pushgateway"
                  lang="bash"
                />
                <div class="node-exporter">
                  <p class="description">
                    {{ tl('nodeExporterDesc') }}
                    <a
                      href="https://prometheus.io/docs/guides/node-exporter/#monitoring-linux-host-metrics-with-the-node-exporter"
                      target="_blank"
                      rel="noopener"
                    >
                      {{ tl('installNodeExporter') }}
                    </a>
                  </p>
                </div>
              </div>
              <div class="step-two step">
                <h3>{{ tl('promConfig') }}</h3>
                <p class="description">{{ tl('promStepTwo') }}</p>
                <el-row :gutter="20" class="prom-config-row">
                  <el-col :span="14">
                    <div class="monaco-container">
                      <Monaco id="prom-config-pushgateway" v-model="promPgContent" lang="yaml" />
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <el-form
                      ref="promWithPgForm"
                      label-position="top"
                      hide-required-asterisk
                      :model="promConfigWithPg"
                      :rules="rulesWithPg"
                    >
                      <el-form-item label="Pushgateway" prop="pushgatewayHost">
                        <el-input
                          v-model="promConfigWithPg.pushgatewayHost"
                          placeholder="127.0.0.1:9091"
                        />
                      </el-form-item>
                      <el-form-item label="Node Exporter" prop="nodeExporterHost">
                        <el-input
                          v-model="promConfigWithPg.nodeExporterHost"
                          placeholder="127.0.0.1:9100"
                        />
                      </el-form-item>
                      <el-form-item label="Prometheus" prop="promHost">
                        <el-input
                          v-model="promConfigWithPg.promHost"
                          placeholder="127.0.0.1:9090"
                        />
                      </el-form-item>
                      <el-button
                        class="gen-button"
                        type="primary"
                        plain
                        @click="genPromConfig('pushgateway')"
                        >{{ tl('genPromConfig') }}</el-button
                      >
                    </el-form>
                  </el-col>
                </el-row>
                <p class="description">{{ tl('promRun') }}</p>
                <CodeView
                  lang="bash"
                  code="docker run -d --name prometheus -p 9090:9090 -v /path/to/prometheus.yaml:/etc/prometheus/prometheus.yaml prom/prometheus --config.file=/etc/prometheus/prometheus.yaml"
                />
              </div>
              <div class="step-three step">
                <h3>{{ tl('grafConfig') }}</h3>
                <p class="description">{{ tl('promStepThree') }}</p>
                <CodeView
                  lang="bash"
                  code="docker run -d --name grafana -p 3000:3000 grafana/grafana-oss"
                />
                <p class="description">{{ tl('clickDownloadTemplateDesc') }}</p>
                <el-button type="primary" plain @click="downloadGrafaTemplate">{{
                  tl('clickDonwnloadTemplate')
                }}</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleOutputsDrawer',
})
</script>

<script setup lang="ts">
import { defineProps, computed, defineEmits, WritableComputedRef, ref } from 'vue'
import usePromConfig from '../assets/usePromConfig'
import useI18nTl from '@/hooks/useI18nTl'
import CodeView from '@/components/CodeView.vue'
import Monaco from '@/components/Monaco.vue'
import GrafanaTemplate from '../assets/emqx5_grafana_template.json'

const { tl } = useI18nTl('MonitoringIntegration')

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})
const {
  promConfigWithPg,
  promPgContent,
  promConfigDefault,
  promDefaultContent,
  rulesWithPg,
  rulesDefault,
} = usePromConfig()
const promWithPgForm = ref()
const promDefaultForm = ref()
const activeTab = ref('default')

const emit = defineEmits(['update:modelValue', 'submit', 'openAddBridge'])

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const downloadFile = (fileName: string, type: string, content: string) => {
  const blob = new Blob([content], { type })
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  downloadElement.download = fileName
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(href)
}

const genPromConfig = async (type: 'default' | 'pushgateway') => {
  try {
    if (type === 'default') {
      await promDefaultForm.value.validate()
      downloadFile('prometheus.yaml', 'text/plain', promDefaultContent.value)
    }
    if (type === 'pushgateway') {
      await promWithPgForm.value.validate()
      downloadFile('prometheus.yaml', 'text/plain', promPgContent.value)
    }
  } catch (error) {
    // ignore
  }
}
const downloadGrafaTemplate = () => {
  downloadFile(
    'emqx5_grafana_template.json',
    'application/json',
    JSON.stringify(GrafanaTemplate, null, 2),
  )
}
</script>

<style lang="scss">
html:lang(en) {
  .prom-setup-drawer {
    .step-1 {
      flex-basis: 386px !important;
    }
    .step-2 {
      flex-basis: 592px !important;
    }
  }
}
.prom-setup-drawer {
  p.description {
    margin-top: 0px;
    &.summary {
      margin-bottom: 32px;
    }
  }
  .step-1 {
    flex-basis: 29% !important;
  }
  .step-2 {
    flex-basis: 47% !important;
  }
  .step-3 {
    flex-basis: 0% !important;
  }
  .step-contents {
    h3 {
      margin-top: 2px;
    }
    .step {
      margin-bottom: 48px;
    }
    .prom-config {
      margin: 0px;
      .code-view {
        height: 300px;
      }
    }
    .gen-button {
      width: 100%;
      margin-top: 16px;
    }
  }
  .prom-config-row {
    margin-bottom: 24px;
  }
  .el-tabs.detail-tabs .el-tabs__header .el-tabs__item.is-active {
    border-bottom: 1px solid var(--color-bg-primary);
  }
}
</style>
