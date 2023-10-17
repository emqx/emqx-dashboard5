<template>
  <div class="monitoring-integration app-wrapper">
    <el-card class="app-card" v-loading="isDataLoading">
      <div class="schema-form">
        <el-form
          class="configuration-form"
          label-position="right"
          require-asterisk-position="left"
          :label-width="store.state.lang === 'zh' ? 176 : 190"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="12">
              <el-form-item class="radio-form-item">
                <template #label>
                  <FormItemLabel
                    :label="tl('monitoringPlatform')"
                    :desc="tl('monitoringPlatformFormItemLabel')"
                  />
                </template>
                <el-radio-group class="platform-radio-group" v-model="selectedPlatform">
                  <el-row :gutter="28">
                    <el-col v-for="item in platformOpts" :key="item.label" :span="12">
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
                      :label="tl('enablePushgateway')"
                      :desc="tl('enablePushgatewayDesc')"
                    />
                  </template>
                  <el-switch v-model="prometheusFormData.enable" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-transition>
              <el-row v-show="prometheusFormData.enable">
                <el-col :span="21" class="custom-col">
                  <el-form-item>
                    <template #label>
                      <FormItemLabel :label="tl('interval')" :desc="tl('dataReportingInterval')" />
                    </template>
                    <TimeInputWithUnitSelectVue v-model="prometheusFormData.interval" />
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
                    <el-input v-model="prometheusFormData.push_gateway_server" />
                  </el-form-item>
                </el-col>
                <el-col :span="21" class="custom-col">
                  <el-form-item>
                    <template #label>
                      <FormItemLabel :label="tl('jobName')" :desc="tl('jobNameDesc')" desc-marked />
                    </template>
                    <el-input v-model="prometheusFormData.job_name" />
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
                    <KeyAndValueEditor v-model="prometheusFormData.headers" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-transition>
          </template>
          <!-- OpenTelemetry -->
          <template v-if="selectedPlatform === 'OpenTelemetry'">
            <el-row>
              <el-col :span="21" class="custom-col">
                <el-form-item :label="tl('enableOpentelemetry')">
                  <el-switch v-model="opentelemetryFormData.enable" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-transition>
              <el-row v-show="opentelemetryFormData.enable">
                <el-col :span="21" class="custom-col">
                  <el-form-item :label="tl('endpoint')">
                    <el-input v-model="opentelemetryFormData.exporter.endpoint" />
                  </el-form-item>
                </el-col>
                <el-col :span="21" class="custom-col">
                  <el-form-item :label="tl('exportInterval')">
                    <TimeInputWithUnitSelectVue v-model="opentelemetryFormData.exporter.interval" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-transition>
          </template>
          <el-col class="btn-col" :span="24" :style="store.getters.configPageBtnStyle">
            <el-button type="primary" :loading="isSubmitting" @click="submit">
              {{ $t('Base.saveChanges') }}
            </el-button>
            <el-button v-if="selectedPlatform === 'Prometheus'" @click="showPromSetup = true">
              {{ $t('Base.help') }}
            </el-button>
          </el-col>
        </el-form>
      </div>
    </el-card>
    <HelpDrawer v-model="showPromSetup" />
  </div>
</template>

<script setup lang="ts">
import { getPrometheus, setPrometheus, getOpenTelemetry, setOpenTelemetry } from '@/api/common'
import promImg from '@/assets/img/prom.png'
import opentelemetryImg from '@/assets/img/opentelemetry.png'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import TimeInputWithUnitSelectVue from '@/components/TimeInputWithUnitSelect.vue'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { Prometheus, OpenTelemetry } from '@/types/dashboard'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'
import { Ref, computed, ref } from 'vue'
import { useStore } from 'vuex'
import HelpDrawer from './components/HelpDrawer.vue'

const PROMETHEUS = 'Prometheus'
const OPENTELEMETRY = 'OpenTelemetry'

const { tl, t } = useI18nTl('MonitoringIntegration')
const store = useStore()

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
]

const selectedPlatform = ref(platformOpts[0].value)
const showPromSetup = ref(false)
const prometheusFormData: Ref<Prometheus> = ref({
  enable: false,
  interval: '15s',
  push_gateway_server: '',
  job_name: '',
  headers: {},
})
const opentelemetryFormData: Ref<OpenTelemetry> = ref({
  enable: false,
  exporter: {
    endpoint: '',
    interval: '10s',
  },
})

const isDataLoading = ref(false)

let rawData: any = undefined
const nowRecordData = computed(() => ({
  prometheus: prometheusFormData.value,
  openTelemetry: opentelemetryFormData.value,
}))
const checkDataIsChanged = () => !isEqual(nowRecordData.value, rawData)
useDataNotSaveConfirm(checkDataIsChanged)
const updateRawDataForCompare = () => {
  rawData = cloneDeep(nowRecordData.value)
}

const loadIntegration = async function () {
  isDataLoading.value = true
  prometheusFormData.value = await getPrometheus()
  updateRawDataForCompare()
  isDataLoading.value = false
}
const isSubmitting = ref(false)

const updatePrometheus = async function () {
  try {
    isSubmitting.value = true
    await setPrometheus(prometheusFormData.value)
    updateRawDataForCompare()
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    loadIntegration()
  } finally {
    isSubmitting.value = false
  }
}

const loadOpentelemetry = async function () {
  opentelemetryFormData.value = await getOpenTelemetry()
}

const updateOpentelemetry = async function () {
  try {
    isSubmitting.value = true
    await setOpenTelemetry(opentelemetryFormData.value)
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    loadOpentelemetry()
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

loadIntegration()
loadOpentelemetry()
</script>

<style lang="scss">
.monitoring-integration {
  .radio-form-item {
    width: 100%;
  }
  .platform-radio-group {
    margin-top: 8px;
    width: 100%;
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
}
</style>
