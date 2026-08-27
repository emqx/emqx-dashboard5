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
          :validate-on-rule-change="false"
          :label-width="store.state.lang === 'zh' ? 236 : 308"
        >
          <el-row>
            <el-col class="ps-1.5" :xs="24" :sm="24" :md="24" :lg="16" :xl="12">
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
                      <el-radio class="platform-radio" :value="item.label" border>
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
            <el-row>
              <el-col :span="21" class="custom-col">
                <el-form-item>
                  <template #label>
                    <FormItemLabel :label="tl('latencyBuckets')" :desc="tl('latencyBucketsDesc')" />
                  </template>
                  <el-input v-model="prometheusFormData.latency_buckets" />
                </el-form-item>
              </el-col>
              <el-col
                v-if="prometheusFormData.namespaced_metrics_limiter"
                :span="21"
                class="custom-col"
              >
                <el-form-item>
                  <template #label>
                    <FormItemLabel
                      :label="tl('namespaceRateLimit')"
                      :desc="tl('namespaceRateLimitDesc')"
                      desc-marked
                    />
                  </template>
                  <el-input v-model="prometheusFormData.namespaced_metrics_limiter.rate" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <!-- OpenTelemetry -->
          <template v-if="selectedPlatform === 'OpenTelemetry'">
            <el-row>
              <el-col :span="21" class="custom-col">
                <el-form-item :label="tl('openTelemetryType')">
                  <el-radio-group :model-value="opentelemetryType" @change="handleTypeChange">
                    <el-radio-button value="generic">{{ tl('generic') }}</el-radio-button>
                    <el-radio-button value="dynatrace">Dynatrace</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="21" class="custom-col">
                <el-form-item :label="tl('featureSelection')">
                  <el-checkbox
                    v-if="opentelemetryType === 'generic' && opentelemetryFormData.metrics"
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
              <template v-if="opentelemetryFormData.exporter">
                <el-col :span="21" class="custom-col">
                  <el-form-item
                    :label="tl('endpoint')"
                    :prop="opentelemetryType === 'dynatrace' ? 'exporter.endpoint' : undefined"
                  >
                    <el-input v-model="opentelemetryFormData.exporter.endpoint" />
                  </el-form-item>
                </el-col>
                <!-- Exporter -->
                <el-col :span="21" class="custom-col">
                  <el-form-item
                    :label="t('RuleEngine.headers')"
                    :prop="opentelemetryType === 'dynatrace' ? 'exporter.headers' : undefined"
                  >
                    <KeyAndValueEditor v-model="opentelemetryFormData.exporter.headers" />
                  </el-form-item>
                </el-col>
                <!-- Exporter SSL Options -->
                <el-col :span="21" class="custom-col col-ssl">
                  <!-- Setting the key is to refresh the certificate content to the certificate path after updating the configuration. -->
                  <CommonTLSConfig
                    :key="isDataLoading.toString()"
                    v-model="opentelemetryFormData.exporter.ssl_options"
                    is-edit
                    :show-sni="false"
                    :managed-cert-conf-columns="1"
                  />
                </el-col>
              </template>

              <!-- Dynatrace OAuth2 -->
              <el-col v-if="dynatraceAuth" :span="21" class="custom-col oauth2-card-col">
                <el-card class="oauth2-card" shadow="never">
                  <template #header>
                    <span
                      class="inline-block text-right pr-8"
                      :class="store.state.lang === 'zh' ? 'w-[236px]' : 'w-[308px]'"
                    >
                      {{ tl('oauth2Authentication') }}
                    </span>
                  </template>
                  <el-form-item :label="tl('tokenEndpoint')" prop="exporter.auth.token_endpoint">
                    <el-input v-model="dynatraceAuth.token_endpoint" />
                  </el-form-item>
                  <el-form-item :label="tl('clientID')" prop="exporter.auth.client_id">
                    <el-input v-model="dynatraceAuth.client_id" />
                  </el-form-item>
                  <el-form-item :label="tl('clientSecret')" prop="exporter.auth.client_secret">
                    <CustomInputPassword v-model="dynatraceAuth.client_secret" />
                  </el-form-item>
                  <el-form-item :label="tl('resource')" prop="exporter.auth.resource">
                    <el-input v-model="dynatraceAuth.resource" />
                  </el-form-item>
                  <el-form-item :label="tl('scope')">
                    <el-input v-model="dynatraceAuth.scope" />
                  </el-form-item>
                  <el-form-item :label="tl('timeout')">
                    <TimeInputWithUnitSelect v-model="dynatraceAuth.timeout" />
                  </el-form-item>
                  <div class="col-ssl">
                    <CommonTLSConfig
                      v-model="dynatraceAuth.ssl"
                      base-path="exporter.auth.ssl"
                      is-edit
                      :show-sni="false"
                      :managed-cert-conf-columns="1"
                    />
                  </div>
                </el-card>
              </el-col>

              <!-- Metrics -->
              <el-col
                v-if="opentelemetryType === 'generic' && opentelemetryFormData.metrics?.enable"
                :span="21"
              >
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
                <el-col :span="21">
                  <el-form-item>
                    <template #label>
                      <FormItemLabel :label="tl('maxQueueSize')" :desc="tl('maxQueueSizeDesc')" />
                    </template>
                    <CustomInputNumber
                      v-model="opentelemetryFormData.traces.max_queue_size"
                      :min="1"
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
      :configs="currentOpenTelemetryConfig"
      @update="handleOpenTelemetryConfigUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { getOpenTelemetry, getPrometheus, setOpenTelemetry, setPrometheus } from '@/api/common'
import dataDogImg from '@/assets/img/datadog.png'
import opentelemetryImg from '@/assets/img/opentelemetry.png'
import promImg from '@/assets/img/prom.png'
import {
  DynatraceOAuth2,
  DynatraceOpenTelemetry,
  GenericOpenTelemetry,
  OpenTelemetry,
  OpenTelemetryExporter,
  OpenTelemetryType,
  Prometheus,
} from '@/types/dashboard'
import HelpDrawer from './components/HelpDrawer.vue'
import OpenTelemetrySampleDrawer from './components/OpenTelemetrySampleDrawer.vue'

const PROMETHEUS = 'Prometheus'
const OPENTELEMETRY = 'OpenTelemetry'
const DATADOG = 'Datadog'

const { tl, t } = useI18nTl('MonitoringIntegration')
const store = useStore()
const { createSSLForm, handleSSLDataBeforeSubmit } = useSSL()

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
  latency_buckets: '10ms, 100ms, 1s, 5s, 30s',
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
type OpenTelemetryFormData = {
  type: OpenTelemetryType
  metrics: NonNullable<GenericOpenTelemetry['metrics']>
  logs: NonNullable<GenericOpenTelemetry['logs']>
  traces: NonNullable<GenericOpenTelemetry['traces']>
  exporter: OpenTelemetryExporter & { auth: DynatraceOAuth2 }
}

const createDynatraceAuth = (): DynatraceOAuth2 => ({
  kind: 'dynatrace_oauth2',
  enable: true,
  grant_type: 'client_credentials',
  token_endpoint: '',
  client_id: '',
  client_secret: '',
  resource: '',
  scope: '',
  timeout: '5s',
  ssl: createSSLForm(),
})

const createOpenTelemetryFormData = (): OpenTelemetryFormData => ({
  type: 'generic',
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
    headers: {},
    auth: createDynatraceAuth(),
  },
})

const normalizeOpenTelemetry = (
  config: OpenTelemetry,
  currentFormData: OpenTelemetryFormData,
): OpenTelemetryFormData => {
  const type: OpenTelemetryType = config.type === 'dynatrace' ? 'dynatrace' : 'generic'
  const incompatibleField = type === 'dynatrace' ? 'metrics' : 'exporter.auth'
  // Once the server config is loaded, do not merge stale values from the previously selected type.
  return merge(
    createOpenTelemetryFormData(),
    omit(currentFormData, incompatibleField),
    omit(config, incompatibleField),
    { type },
  )
}

const opentelemetryFormData = ref<OpenTelemetryFormData>(createOpenTelemetryFormData())
const opentelemetryType = computed<OpenTelemetryType>({
  get() {
    return opentelemetryFormData.value.type
  },
  set(value) {
    opentelemetryFormData.value.type = value
  },
})
const createCurrentOpenTelemetryConfig = (): OpenTelemetry => {
  const config = cloneDeep(opentelemetryFormData.value)
  if (config.exporter.ssl_options) {
    config.exporter.ssl_options = handleSSLDataBeforeSubmit(config.exporter.ssl_options)
  }
  if (config.exporter.auth.ssl) {
    config.exporter.auth.ssl = handleSSLDataBeforeSubmit(config.exporter.auth.ssl)
  }
  if (config.type === 'dynatrace') {
    return omit(config, 'metrics') as DynatraceOpenTelemetry
  }
  return omit(config, 'exporter.auth') as GenericOpenTelemetry
}
const currentOpenTelemetryConfig = computed(createCurrentOpenTelemetryConfig)
const dynatraceAuth = computed(() =>
  opentelemetryType.value === 'dynatrace' ? opentelemetryFormData.value.exporter.auth : undefined,
)

const handleTypeChange = async (value: string | number | boolean | undefined) => {
  if (value !== 'generic' && value !== 'dynatrace') {
    return
  }
  opentelemetryType.value = value
  await nextTick()
  FormCom.value?.clearValidate()
}

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
const openAdvancedSettings = async () => {
  try {
    await FormCom.value.validate()
    isOpenTelemetrySampleDrawerShow.value = true
  } catch (error) {
    // Keep the drawer closed until the current OpenTelemetry form is valid.
  }
}
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
  openTelemetry: currentOpenTelemetryConfig.value,
}))
const OpenTelemetrySampleDrawerCom = ref()
const checkDataIsChanged = () => {
  const pageChanged = rawData && !isEqual(nowRecordData.value, rawData)
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
    const config = await getOpenTelemetry()
    opentelemetryFormData.value = normalizeOpenTelemetry(config, opentelemetryFormData.value)
  } catch (error) {
    //
  } finally {
    isDataLoading.value = false
  }
}

const FormCom = ref()
const { createRequiredRule } = useFormRules()
const validateDynatraceHeaders = (
  _rule: unknown,
  headers: Record<string, string> | undefined,
  callback: (error?: Error) => void,
) => {
  const hasAuthorizationHeader = Object.keys(headers ?? {}).some(
    (key) => key.toLowerCase() === 'authorization',
  )
  callback(hasAuthorizationHeader ? new Error(tl('authorizationHeaderConflict')) : undefined)
}
const rules = {
  'traces.filter.e2e_tracing_options.cluster_identifier': createRequiredRule(
    tl('clusterIdentifier'),
  ),
  'exporter.endpoint': createRequiredRule(tl('endpoint')),
  'exporter.auth.token_endpoint': createRequiredRule(tl('tokenEndpoint')),
  'exporter.auth.client_id': createRequiredRule(tl('clientID')),
  'exporter.auth.client_secret': createRequiredRule(tl('clientSecret')),
  'exporter.auth.resource': createRequiredRule(tl('resource')),
  'exporter.headers': [{ validator: validateDynatraceHeaders }],
}
const updateOpentelemetry = async function () {
  try {
    await FormCom.value.validate()
  } catch (error) {
    return
  }
  try {
    isSubmitting.value = true
    const data = checkNOmitFromObj(createCurrentOpenTelemetryConfig()) as OpenTelemetry
    await setOpenTelemetry(data)
    await loadOpentelemetry()
    updateRawDataForCompare()
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    //
  } finally {
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
      border-radius: var(--border-radius-small);
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
  .oauth2-card-col {
    padding: 8px;
  }
  .oauth2-card {
    margin: 8px 0;
    border-color: var(--color-border-card);
    .el-card__header {
      color: var(--el-text-color-primary);
      font-size: 16px;
      font-weight: 500;
    }
    .el-card__body {
      padding: 12px 0 4px;
    }
  }
}
</style>
