<template>
  <div class="monitoring-integration app-wrapper">
    <el-card class="config-card" v-loading="isDataLoading">
      <el-form label-position="top" class="schema-form">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="tl('monitoringPlatform')" class="radio-form-item">
              <p class="item-desc">{{ tl('monitoringPlatformFormItemLabel') }}</p>
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
        <el-row v-if="selectedPlatform === PROMETHEUS">
          <el-col :span="16" class="custom-col">
            <el-form-item :label="t('Base.isEnabled')">
              <p class="item-desc">
                {{ t('MonitoringIntegration.enableDataDesc', { name: 'Prometheus' })
                }}{{ t('MonitoringIntegration.promToPushgateway') }}
              </p>
              <el-switch v-model="prometheusFormData.enable" />
            </el-form-item>
          </el-col>
          <el-collapse-transition>
            <el-col v-show="prometheusFormData.enable" :span="16" class="custom-col">
              <el-form-item :label="tl('interval')">
                <p class="item-desc">{{ tl('dataReportingInterval') }}</p>
                <TimeInputWithUnitSelectVue v-model="prometheusFormData.interval" />
              </el-form-item>
            </el-col>
          </el-collapse-transition>
          <el-collapse-transition>
            <el-col v-show="prometheusFormData.enable" :span="16" class="custom-col">
              <el-form-item :label="tl('pushgatewayServer')">
                <p class="item-desc">
                  {{ tl('pushgatewayDesc') }} <span>{{ tl('learn') }}</span>
                  <a
                    href="https://prometheus.io/docs/practices/pushing/#when-to-use-the-pushgateway"
                    target="_blank"
                    rel="noopener"
                    >{{ tl('whenToUsePushgateway') }}</a
                  >
                </p>
                <el-input v-model="prometheusFormData.push_gateway_server" />
              </el-form-item>
            </el-col>
          </el-collapse-transition>
        </el-row>
        <!-- StatsD -->
        <el-row v-else>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="t('Base.isEnabled')">
              <p class="item-desc">
                {{ t('MonitoringIntegration.enableDataDesc', { name: 'StatsD' }) }}
              </p>
              <el-switch v-model="statsDFormData.enable" />
            </el-form-item>
          </el-col>
          <el-collapse-transition>
            <el-col v-show="statsDFormData.enable" :span="16" class="custom-col">
              <el-form-item :label="t('Base.server')">
                <p class="item-desc">{{ tl('statsDServerDesc') }}</p>
                <el-input v-model="statsDFormData.server" />
              </el-form-item>
            </el-col>
          </el-collapse-transition>
          <el-collapse-transition>
            <el-col v-show="statsDFormData.enable" :span="16" class="custom-col">
              <el-form-item :label="tl('interval')">
                <p class="item-desc">{{ tl('dataReportingInterval') }}</p>
                <TimeInputWithUnitSelectVue v-model="statsDFormData.flush_time_interval" />
              </el-form-item>
            </el-col>
          </el-collapse-transition>
        </el-row>
        <div class="ft">
          <el-button type="primary" :loading="isSubmitting" @click="submit">
            {{ $t('Base.update') }}
          </el-button>
          <el-button
            v-if="selectedPlatform === 'Prometheus'"
            :loading="isSubmitting"
            @click="showPromSetup = true"
          >
            {{ $t('Base.help') }}
          </el-button>
        </div>
      </el-form>
    </el-card>
    <HelpDrawer v-model="showPromSetup" />
  </div>
</template>

<script setup lang="ts">
import { getPrometheus, getStatsD, setPrometheus, setStatsD } from '@/api/common'
import promImg from '@/assets/img/prom.png'
import statsDImg from '@/assets/img/statsd.png'
import TimeInputWithUnitSelectVue from '@/components/TimeInputWithUnitSelect.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { Prometheus, StatsD } from '@/types/dashboard'
import { ElMessage } from 'element-plus'
import { computed, ref, Ref } from 'vue'
import HelpDrawer from './components/HelpDrawer.vue'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { cloneDeep, isEqual } from 'lodash'

const PROMETHEUS = 'Prometheus'
const STATS_D = 'StatsD'

const { tl, t } = useI18nTl('MonitoringIntegration')

const platformOpts = [
  {
    label: PROMETHEUS,
    value: PROMETHEUS,
    img: promImg,
  },
  {
    label: STATS_D,
    value: STATS_D,
    img: statsDImg,
  },
]

const selectedPlatform = ref(platformOpts[0].value)
const showPromSetup = ref(false)
const prometheusFormData: Ref<Prometheus> = ref({
  enable: false,
  interval: '15s',
  push_gateway_server: '',
})
const statsDFormData: Ref<StatsD> = ref({
  enable: false,
  flush_time_interval: '10s',
  sample_time_interval: '10s',
  server: '',
})

const isDataLoading = ref(false)

let rawData: any = undefined
const nowRecordData = computed(() => ({
  prometheus: prometheusFormData.value,
  statsD: statsDFormData.value,
}))
const checkDataIsChanged = () => !isEqual(nowRecordData.value, rawData)
useDataNotSaveConfirm(checkDataIsChanged)
const updateRawDataForCompare = () => {
  rawData = cloneDeep({
    prometheus: prometheusFormData.value,
    statsD: statsDFormData.value,
  })
}

const loadIntegration = async function () {
  isDataLoading.value = true
  let [prometheusRes, statsRes] = await Promise.allSettled([getPrometheus(), getStatsD()])
  if (prometheusRes?.status == 'fulfilled') {
    prometheusFormData.value = prometheusRes.value
  }
  if (statsRes?.status == 'fulfilled') {
    statsDFormData.value = statsRes.value
  }
  updateRawDataForCompare()
  isDataLoading.value = false
}
const isSubmitting = ref(false)

const updatePrometheus = async function () {
  try {
    isSubmitting.value = true
    await setPrometheus(prometheusFormData.value)
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    loadIntegration()
  } finally {
    isSubmitting.value = false
  }
}

const updateStatsD = async function () {
  try {
    isSubmitting.value = true
    await setStatsD(statsDFormData.value)
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    loadIntegration()
  } finally {
    isSubmitting.value = false
  }
}

const submit = async () => {
  if (selectedPlatform.value === PROMETHEUS) {
    await updatePrometheus()
  } else {
    await updateStatsD()
  }
  updateRawDataForCompare()
}

loadIntegration()
</script>

<style lang="scss">
.monitoring-integration {
  .schema-form {
    padding-bottom: 20px;
  }
  .radio-form-item {
    width: 100%;
    padding: 0 12px;
  }
  .platform-radio-group {
    margin-top: 8px;
    width: 100%;
    .el-row {
      width: 80%;
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
  .ft {
    padding: 12px 12px + 12px + 4px;
  }
}
</style>
