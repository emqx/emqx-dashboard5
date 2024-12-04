<template>
  <div class="monitoring-integration app-wrapper">
    <el-card class="app-card allow-overflow" v-loading="isDataLoading">
      <div class="schema-form">
        <el-form
          ref="FormCom"
          class="configuration-form"
          label-position="right"
          require-asterisk-position="left"
          :rules="rules"
          :model="opentelemetryFormData"
          :label-width="store.state.lang === 'zh' ? 176 : 232"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="12">
              <el-form-item class="radio-form-item">
                <template #label>
                  <FormItemLabel
                    :label="tl('monitoringPlatform')"
                    :desc="tl('monitoringPlatformFormItemLabel')"
                  />
                </template>
                <el-radio-group class="platform-radio-group" v-model="selectedPlatform">
                  <el-row :gutter="28">
                    <el-col
                      v-for="item in platformOpts"
                      :key="item.label"
                      :span="12"
                      class="col-radio"
                    >
                      <el-radio class="platform-radio" :label="item.label" border>
                        <img class="img-platform" height="52" :src="item.img" :alt="item.label" />
                        <span class="platform-name"> {{ item.label }} </span>
                      </el-radio>
                    </el-col>
                  </el-row>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- Prometheus -->
          <template v-if="selectedPlatform === 'Prometheus'">
            <el-row>
              <el-col :span="21" class="custom-col">
                <el-form-item>
                  <template #label>
                    <FormItemLabel
                      :label="tl('enableBasicAuth')"
                      :desc="tl('enableBasicAuthDesc')"
                    />
                  </template>
                  <el-switch v-model="prometheusFormData.enable_basic_auth" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="21" class="custom-col">
                <el-form-item>
                  <template #label>
                    <FormItemLabel
                      :label="tl('enablePushgateway')"
                      :desc="tl('enablePushgatewayDesc')"
                    />
                  </template>
                  <el-switch v-model="prometheusFormData.push_gateway.enable" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-transition>
              <el-row v-show="prometheusFormData.push_gateway.enable">
                <el-col :span="21" class="custom-col">
                  <el-form-item>
                    <template #label>
                      <FormItemLabel :label="tl('interval')" :desc="tl('dataReportingInterval')" />
                    </template>
                    <TimeInputWithUnitSelect v-model="prometheusFormData.push_gateway.interval" />
                  </el-form-item>
                </el-col>
                <el-col :span="21" class="custom-col">
                  <el-form-item>
                    <template #label>
                      <span>{{ tl('pushgatewayServer') }}</span>
                      <InfoTooltip>
                        <template #content>
                          {{ tl('pushgatewayDesc') }} <span>{{ tl('learn') }}</span>
                          <a
                            href="https://prometheus.io/docs/practices/pushing/#when-to-use-the-pushgateway"
                            target="_blank"
                            rel="noopener"
                          >
                            {{ tl('whenToUsePushgateway') }}
                          </a>
                        </template>
                      </InfoTooltip>
                    </template>
                    <el-input v-model="prometheusFormData.push_gateway.url" />
                  </el-form-item>
                </el-col>
                <el-col :span="21" class="custom-col">
                  <el-form-item>
                    <template #label>
                      <FormItemLabel :label="tl('jobName')" :desc="tl('jobNameDesc')" desc-marked />
                    </template>
                    <el-input v-model="prometheusFormData.push_gateway.job_name" />
                  </el-form-item>
                </el-col>
                <el-col :span="21" class="custom-col">
                  <el-form-item>
                    <template #label>
                      <FormItemLabel
                        :label="t('RuleEngine.headers')"
                        :desc="tl('headersDesc')"
                        desc-marked
                      />
                    </template>
                    <KeyAndValueEditor v-model="prometheusFormData.push_gateway.headers" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-transition>
          </template>
          <!-- OpenTelemetry -->
          <template v-if="selectedPlatform === 'OpenTelemetry'">
            <el-row>
              <el-col :span="21" class="custom-col">
                <el-form-item :label="tl('featureSelection')">
                  <el-checkbox
                    v-if="opentelemetryFormData.metrics"
                    v-model="opentelemetryFormData.metrics.enable"
                    :label="tl('metricsEnable')"
                    size="large"
                    border
                  />
                  <el-checkbox
                    v-if="opentelemetryFormData.traces"
                    v-model="opentelemetryFormData.traces.enable"
                    :label="tl('tracesEnable')"
                    size="large"
                    border
                  />
                  <el-checkbox
                    v-if="opentelemetryFormData.logs"
                    v-model="opentelemetryFormData.logs.enable"
                    :label="tl('logsEnable')"
                    size="large"
                    border
                  />
                </el-form-item>
              </el-col>
              <!-- Exporter -->
              <el-col v-if="opentelemetryFormData.exporter" :span="21" class="custom-col">
                <el-form-item :label="tl('endpoint')">
                  <el-input v-model="opentelemetryFormData.exporter.endpoint" />
                </el-form-item>
              </el-col>
              <!-- Exporter SSL Options -->
              <el-col v-if="opentelemetryFormData.exporter" :span="21" class="custom-col">
                <!-- Setting the key is to refresh the certificate content to the certificate path after updating the configuration. -->
                <CommonTLSConfig
                  :key="isDataLoading.toString()"
                  v-model="opentelemetryFormData.exporter.ssl_options"
                  :show-sni="false"
                  is-edit
                />
              </el-col>
              <!-- Metrics -->
              <el-col :span="21" v-if="opentelemetryFormData.metrics?.enable">
                <el-form-item :label="`${tl('metricsEnable')}${tl('exportInterval')}`">
                  <TimeInputWithUnitSelect v-model="opentelemetryFormData.metrics.interval" />
                </el-form-item>
              </el-col>
              <!-- Traces -->
              <template v-if="opentelemetryFormData.traces?.enable">
                <el-col :span="21" v-if="opentelemetryFormData.traces.filter">
                  <el-form-item>
                    <template #label>
                      <FormItemLabel
                        :label="tl('traceMode')"
                        :desc="tl('traceModeDesc')"
                        desc-marked
                      />
                    </template>
                    <el-select v-model="opentelemetryFormData.traces.filter.trace_mode">
                      <el-option
                        v-for="mode in openTelemetryTracesModes"
                        :key="mode.value"
                        :label="mode.label"
                        :value="mode.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="21"
                  v-if="
                    opentelemetryFormData.traces?.filter?.trace_mode ===
                    OpenTelemetryTraceModes.Legacy
                  "
                >
                  <el-form-item>
                    <template #label>
                      <FormItemLabel
                        :label="tl('tracesFilterTracesAll')"
                        :desc="tl('tracesFilterTracesAllDesc')"
                      />
                    </template>
                    <el-switch
                      v-if="opentelemetryFormData.traces?.filter"
                      v-model="opentelemetryFormData.traces.filter.trace_all"
                    />
                  </el-form-item>
                </el-col>
                <template
                  v-if="
                    opentelemetryFormData.traces?.filter?.trace_mode ===
                      OpenTelemetryTraceModes.E2E &&
                    opentelemetryFormData.traces.filter.e2e_tracing_options
                  "
                >
                  <el-col :span="21">
                    <el-form-item prop="traces.filter.e2e_tracing_options.cluster_identifier">
                      <template #label>
                        <FormItemLabel
                          :label="tl('clusterIdentifier')"
                          :desc="tl('clusterIdentifierDesc')"
                          desc-marked
                        />
                      </template>
                      <el-input
                        v-model="
                          opentelemetryFormData.traces.filter.e2e_tracing_options.cluster_identifier
                        "
                      />
                    </el-form-item>
                  </el-col>
                </template>
                <el-col :span="21">
                  <el-form-item :label="`${tl('tracesEnable')}${tl('exportInterval')}`">
                    <TimeInputWithUnitSelect
                      v-model="opentelemetryFormData.traces.scheduled_delay"
                    />
                  </el-form-item>
                </el-col>
              </template>
              <!-- Logs -->
              <template v-if="opentelemetryFormData.logs?.enable">
                <el-col :span="21">
                  <el-form-item :label="tl('logsLevel')">
                    <el-select v-model="opentelemetryFormData.logs.level">
                      <el-option
                        v-for="level in openTelemetryLogLevels"
                        :key="level"
                        :label="level"
                        :value="level"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="21">
                  <el-form-item :label="`${tl('logsEnable')}${tl('exportInterval')}`">
                    <TimeInputWithUnitSelect v-model="opentelemetryFormData.logs.scheduled_delay" />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </template>
          <!-- DATADOG -->
          <el-form-item v-if="selectedPlatform === DATADOG">
            <i18n-t keypath="MonitoringIntegration.dataDogTip" tag="p" class="tip">
              <template #docUse>
                <a :href="docMap.documentation" target="_blank">{{ tl('thisDoc') }}</a>
              </template>
              <template #docIntegration>
                <a :href="docMap.datadogIntegration" target="_blank">
                  {{ tl('datadogIntegration') }}
                </a>
              </template>
            </i18n-t>
          </el-form-item>
          <el-col class="btn-col" :span="24">
            <el-button
              type="primary"
              :disabled="selectedPlatform === DATADOG || !$hasPermission('put')"
              :loading="isSubmitting"
              @click="submit"
            >
              {{ $t('Base.saveChanges') }}
            </el-button>
            <el-button v-if="selectedPlatform === 'Prometheus'" @click="showPromSetup = true">
              {{ $t('Base.help') }}
            </el-button>
            <el-button
              class="button-advanced"
              v-if="
                selectedPlatform === OPENTELEMETRY &&
                opentelemetryFormData.traces?.filter?.trace_mode === OpenTelemetryTraceModes.E2E &&
                opentelemetryFormData.traces.filter.e2e_tracing_options
              "
              @click="openAdvancedSettings"
            >
              {{ tl('traceAdvancedConfig') }}
            </el-button>
          </el-col>
        </el-form>
      </div>
    </el-card>
    <HelpDrawer v-model="showPromSetup" />
    <OpenTelemetrySampleDrawer
      ref="OpenTelemetrySampleDrawerCom"
      v-model="isOpenTelemetrySampleDrawerShow"
      :configs="opentelemetryFormData"
      @update="handleOpenTelemetryConfigUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { getOpenTelemetry, getPrometheus, setOpenTelemetry, setPrometheus } from '@/api/common'
import dataDogImg from '@/assets/img/datadog.png'
import opentelemetryImg from '@/assets/img/opentelemetry.png'
import promImg from '@/assets/img/prom.png'
import { checkNOmitFromObj } from '@/common/tools'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useConfFooterStyle from '@/hooks/useConfFooterStyle'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { OpenTelemetry, Prometheus } from '@/types/dashboard'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual, set } from 'lodash'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import HelpDrawer from './components/HelpDrawer.vue'
import OpenTelemetrySampleDrawer from './components/OpenTelemetrySampleDrawer.vue'
import useFormRules from '@/hooks/useFormRules'

const PROMETHEUS = 'Prometheus'
const OPENTELEMETRY = 'OpenTelemetry'
const DATADOG = 'Datadog'

const { tl, t } = useI18nTl('MonitoringIntegration')
const store = useStore()
const { createSSLForm } = useSSL()

const { docMap } = useDocLink()

const platformOpts = [
  {
    label: PROMETHEUS,
    value: PROMETHEUS,
    img: promImg,
  },
  {
    label: OPENTELEMETRY,
    value: OPENTELEMETRY,
    img: opentelemetryImg,
  },
  {
    label: DATADOG,
    value: DATADOG,
    img: dataDogImg,
  },
]

const selectedPlatform = ref(platformOpts[0].value)
const showPromSetup = ref(false)
const prometheusFormData: Ref<Prometheus> = ref({
  collectors: {
    mnesia: 'disabled',
    vm_dist: 'disabled',
    vm_memory: 'disabled',
    vm_msacc: 'disabled',
    vm_statistics: 'disabled',
    vm_system_info: 'disabled',
  },
  enable_basic_auth: false,
  push_gateway: {
    headers: {
      Authorization: '',
    },
    interval: '15s',
    job_name: '',
    url: '',
    enable: false,
  },
})
const opentelemetryFormData = ref<OpenTelemetry>({
  metrics: {
    enable: false,
    interval: '10s',
  },
  logs: {
    level: 'warning',
    enable: false,
    scheduled_delay: '1s',
  },
  traces: {
    enable: false,
    filter: {
      trace_all: false,
      trace_mode: 'legacy',
      e2e_tracing_options: {
        cluster_identifier: '',
      },
    },
    scheduled_delay: '5s',
  },
  exporter: {
    endpoint: 'http://localhost:4317',
    ssl_options: createSSLForm(),
  },
})

const openTelemetryLogLevels = [
  'debug',
  'info',
  'notice',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency',
  'all',
]

const enum OpenTelemetryTraceModes {
  Legacy = 'legacy',
  E2E = 'e2e',
}
const openTelemetryTracesModes = [
  { label: 'Legacy', value: OpenTelemetryTraceModes.Legacy },
  { label: tl('e2e'), value: OpenTelemetryTraceModes.E2E },
]

const isOpenTelemetrySampleDrawerShow = ref(false)
const openAdvancedSettings = () => (isOpenTelemetrySampleDrawerShow.value = true)
const handleOpenTelemetryConfigUpdated = (config: OpenTelemetry) => {
  const e2eConfig = config.traces?.filter?.e2e_tracing_options
  if (e2eConfig) {
    set(opentelemetryFormData.value, 'traces.filter.e2e_tracing_options', e2eConfig)
  }
}

const isDataLoading = ref(false)

let rawData: any = undefined
const nowRecordData = computed(() => ({
  prometheus: prometheusFormData.value,
  openTelemetry: opentelemetryFormData.value,
}))
const OpenTelemetrySampleDrawerCom = ref()
const checkDataIsChanged = () => {
  const pageChanged = !isEqual(nowRecordData.value, rawData)
  let openTelemetrySampleChanged = false
  if (isOpenTelemetrySampleDrawerShow.value) {
    openTelemetrySampleChanged = OpenTelemetrySampleDrawerCom.value.isDataChanged()
  }
  return pageChanged || openTelemetrySampleChanged
}
useDataNotSaveConfirm(checkDataIsChanged)
const updateRawDataForCompare = () => {
  rawData = cloneDeep(nowRecordData.value)
}

const loadIntegration = async function () {
  try {
    isDataLoading.value = true
    prometheusFormData.value = await getPrometheus()
  } catch (error) {
    //
  } finally {
    isDataLoading.value = false
  }
}
const isSubmitting = ref(false)

const updatePrometheus = async function () {
  try {
    isSubmitting.value = true
    await setPrometheus(prometheusFormData.value)
    updateRawDataForCompare()
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    //
  } finally {
    loadIntegration()
    isSubmitting.value = false
  }
}

const loadOpentelemetry = async function () {
  try {
    isDataLoading.value = true
    opentelemetryFormData.value = await getOpenTelemetry()
  } catch (error) {
    //
  } finally {
    isDataLoading.value = false
  }
}

const FormCom = ref()
const { createRequiredRule } = useFormRules()
const rules = {
  'traces.filter.e2e_tracing_options.cluster_identifier': createRequiredRule(
    tl('clusterIdentifier'),
  ),
}
const updateOpentelemetry = async function () {
  try {
    await FormCom.value.validate()
  } catch (error) {
    return
  }
  try {
    isSubmitting.value = true
    await setOpenTelemetry(checkNOmitFromObj(opentelemetryFormData.value))
    updateRawDataForCompare()
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    //
  } finally {
    loadOpentelemetry()
    isSubmitting.value = false
  }
}

const submit = async () => {
  if (selectedPlatform.value === 'Prometheus') {
    await updatePrometheus()
  } else if (selectedPlatform.value === 'OpenTelemetry') {
    await updateOpentelemetry()
  }
}

const { addObserverToFooter } = useConfFooterStyle()
;(async () => {
  await Promise.allSettled([loadIntegration(), loadOpentelemetry()])
  updateRawDataForCompare()
  addObserverToFooter()
})()
</script>

<style lang="scss">
.monitoring-integration {
  .radio-form-item {
    width: 100%;
  }
  .platform-radio-group {
    margin-top: 8px;
    width: 100%;
    .col-radio:nth-child(3) {
      margin-top: 20px;
    }
    .el-row {
      width: 100%;
    }
  }
  .platform-radio {
    width: 100%;
    height: auto;
    &.el-radio.is-bordered {
      padding: 12px;
    }
    .el-radio__label {
      display: flex;
      align-items: center;
      padding: 0px;
    }
    .img-platform {
      margin-right: 8px;
      border-radius: 8px;
    }
    .platform-name {
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      padding-left: 8px;
    }
  }
  .key-and-value-editor {
    width: 55%;
  }
  .ft {
    padding: 12px 12px + 12px + 4px;
  }
  .el-table .el-table__cell {
    .el-form-item {
      margin: 0;
      padding: 0;
    }
    .el-select {
      width: 100%;
    }
  }
  .button-advanced {
    margin-left: 8px;
  }
}
</style>
