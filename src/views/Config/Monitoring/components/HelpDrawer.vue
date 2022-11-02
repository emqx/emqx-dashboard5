<template>
  <el-drawer
    :title="tl('promSetupHelp')"
    v-model="showDrawer"
    :lock-scroll="false"
    custom-class="prom-setup-drawer"
    size="50%"
  >
    <p class="description summary">{{ tl('promSetupHelpDesc') }}</p>
    <el-row>
      <el-col :span="2">
        <el-steps direction="vertical" space="30%">
          <el-step class="step-1" />
          <el-step class="step-2" />
          <el-step class="step-3" />
        </el-steps>
      </el-col>
      <el-col :span="22">
        <div class="step-contents">
          <div class="step-one step">
            <h3>{{ tl('pushgatewayInstall') }}</h3>
            <p class="description">{{ tl('promStepOne') }}</p>
            <CodeView
              code="docker run -d --name pushgateway -p 9091:9091 prom/pushgateway"
              lang="bash"
            />
            <p class="description">{{ tl('nodeExporterDesc') }}</p>
            <p href="https://prometheus.io/download/#node_exporter" target="_blank" rel="noopener">
              {{ tl('checkNodeExporter') }}
              <a
                href="https://prometheus.io/download/#node_exporter"
                target="_blank"
                rel="noopener"
                >{{ tl('nodeExporterVersion') }}</a
              >{{ tl('replaceVersion') }}
            </p>
            <CodeView
              lang="bash"
              code="wget https://github.com/prometheus/node_exporter/releases/download/v*/node_exporter-*.*-amd64.tar.gz
tar xvfz node_exporter-*.*-amd64.tar.gz"
            />
          </div>
          <div class="step-two step">
            <h3>{{ tl('promConfig') }}</h3>
            <p class="description">{{ tl('promStepTwo') }}</p>
            <el-row :gutter="20" class="prom-config-row">
              <el-col :span="14">
                <div class="monaco-container">
                  <Monaco id="prom-config" v-model="promConfigContent" lang="yaml" />
                </div>
              </el-col>
              <el-col :span="10">
                <el-form
                  ref="formConfig"
                  label-position="top"
                  hide-required-asterisk
                  :model="promYamlConfigs"
                  :rules="rules"
                >
                  <el-form-item label="Prometheus" prop="promHost">
                    <el-input v-model="promYamlConfigs.promHost" placeholder="127.0.0.1:9090" />
                  </el-form-item>
                  <el-form-item label="Pushgateway" prop="pushgatewayHost">
                    <el-input
                      v-model="promYamlConfigs.pushgatewayHost"
                      placeholder="127.0.0.1:9091"
                    />
                  </el-form-item>
                  <el-form-item label="Node Exporter" prop="nodeExporterHost">
                    <el-input
                      v-model="promYamlConfigs.nodeExporterHost"
                      placeholder="127.0.0.1:9100"
                    />
                  </el-form-item>
                  <el-button class="gen-button" type="primary" plain @click="genPromConfig">{{
                    tl('genPromConfig')
                  }}</el-button>
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
const { promYamlConfigs, promConfigContent } = usePromConfig()
const formConfig = ref()

const rules = {
  promHost: [
    {
      required: true,
      message: tl('promConfigRequired'),
    },
  ],
  pushgatewayHost: [
    {
      required: true,
      message: tl('pushgatewayRequired'),
    },
  ],
}

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

const genPromConfig = async () => {
  try {
    await formConfig.value.validate()
    downloadFile('prometheus.yaml', 'text/plain', promConfigContent.value)
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
}
</style>
