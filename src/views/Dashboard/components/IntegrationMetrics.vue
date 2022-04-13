<template>
  <el-button type="primary" :icon="TrendCharts" class="intergration-btn" @click="showDrawer = true">
    {{ tl('explore') }}
  </el-button>
  <el-drawer
    custom-class="intergration-metrics-drawer"
    v-model="showDrawer"
    direction="rtl"
    size="80%"
  >
    <template #title>
      <div>
        <h2>{{ tl('integration') }}</h2>
        <p class="tip">{{ tl('integrationDesc') }}</p>
      </div>
    </template>
    <template #default>
      <div v-loading="integrationLoading">
        <div class="int-item">
          <div class="item-header">
            <img srcset="@/assets/img/prom.png 2x" width="64" height="64" />
            <div>
              <div class="part-header">Prometheus</div>
              <div class="part-desc">{{ tl('promDesc') }}</div>
            </div>
          </div>
          <div class="item-form">
            <el-form :disabled="prometheusLoading" @keyup.enter="updatePrometheus()">
              <div class="item-form-content">
                <div class="col">
                  <el-checkbox border v-model="integrationData.prometheus.enable">
                    {{ $t('General.enabled') }}
                  </el-checkbox>
                </div>
                <div class="col">
                  <el-input
                    class="server-input"
                    placeholder="Push gateway Server"
                    v-model="integrationData.prometheus.push_gateway_server"
                  />
                </div>
                <div class="col">
                  <time-input-with-unit-select
                    placeholder="Push Interval"
                    v-model="integrationData.prometheus.interval"
                  >
                  </time-input-with-unit-select>
                </div>
                <div class="col">
                  <el-button
                    type="primary"
                    :loading="prometheusLoading"
                    @click="updatePrometheus()"
                    >{{ $t('Base.update') }}</el-button
                  >
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div class="int-item">
          <div class="item-header">
            <img srcset="@/assets/img/statsd.png 2x" width="64" height="64" />
            <div>
              <div class="part-header">StatsD</div>
              <div class="part-desc">{{ tl('statsdDesc') }}</div>
            </div>
          </div>
          <div class="item-form">
            <el-form :disabled="statsdLoading" @keyup.enter="updateStatsd()">
              <div class="item-form-content">
                <div class="col">
                  <el-checkbox border v-model="integrationData.statsd.enable">
                    {{ $t('General.enabled') }}
                  </el-checkbox>
                </div>
                <div class="col">
                  <el-input
                    class="server-input"
                    placeholder="server"
                    v-model="integrationData.statsd.server"
                  />
                </div>
                <div class="col">
                  <time-input-with-unit-select
                    placeholder="Flush Interval"
                    v-model="integrationData.statsd.flush_time_interval"
                  >
                  </time-input-with-unit-select>
                </div>
                <div class="col">
                  <el-button type="primary" :loading="statsdLoading" @click="updateStatsd()">{{
                    $t('Base.update')
                  }}</el-button>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts">
import { ref, reactive, onMounted, defineComponent } from 'vue'
export default defineComponent({
  name: 'IntegrationMetrics',
})
</script>

<script lang="ts" setup>
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage } from 'element-plus'
import { Prometheus, StatsD } from '@/types/dashboard'
import { getStatsd, getPrometheus, setStatsd, setPrometheus } from '@/api/common'
import { useI18n } from 'vue-i18n'
import { TrendCharts } from '@element-plus/icons-vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'

const { tl } = useI18nTl('Dashboard')
const { t } = useI18n()
const showDrawer = ref(false)
let integrationLoading = ref(false)
let prometheusLoading = ref(false)
let statsdLoading = ref(false)
let integrationData: { statsd: StatsD; prometheus: Prometheus } = reactive({
  statsd: {
    enable: false,
    flush_time_interval: '10s',
    sample_time_interval: '10s',
    server: '127.0.0.1:8125',
  },
  prometheus: {
    enable: false,
    interval: '15s',
    push_gateway_server: 'http://127.0.0.1:9091',
  },
})

const loadIntegration = async function () {
  integrationLoading.value = true
  let [statsRes, prometheusRes] = await Promise.allSettled([getStatsd(), getPrometheus()])
  if (statsRes?.status == 'fulfilled') {
    integrationData.statsd = statsRes.value
    prometheusLoading.value = false
  }
  if (prometheusRes?.status == 'fulfilled') {
    integrationData.prometheus = prometheusRes.value
    statsdLoading.value = false
  }
  integrationLoading.value = false
}

const updatePrometheus = async function () {
  prometheusLoading.value = true
  let pendingData: Prometheus = Object.assign({}, integrationData.prometheus)
  let res = await setPrometheus(pendingData as Prometheus).catch(() => {
    prometheusLoading.value = false
  })
  if (res) {
    prometheusLoading.value = false
    ElMessage({
      type: 'success',
      message: t('Base.updateSuccess'),
    })
  } else {
    ElMessage({
      type: 'error',
      message: t('Base.opErr'),
    })
    loadIntegration()
  }
}

const updateStatsd = async function () {
  statsdLoading.value = true
  let pendingData: StatsD = Object.assign({}, integrationData.statsd)
  let res = await setStatsd(pendingData as StatsD).catch(() => {
    statsdLoading.value = false
  })
  if (res) {
    statsdLoading.value = false
    ElMessage({
      type: 'success',
      message: t('Base.updateSuccess'),
    })
  } else {
    ElMessage({
      type: 'error',
      message: t('Base.opErr'),
    })
    loadIntegration()
  }
}
onMounted(() => {
  loadIntegration()
})
</script>

<style lang="scss">
.intergration-metrics-drawer {
  .int-item {
    margin-bottom: 48px;
    .item-header {
      display: flex;
      align-items: center;
      img {
        margin-right: 20px;
      }
      .part-header {
        margin-bottom: 12px;
      }
    }
    .item-form {
      margin-top: 24px;
      .item-form-content {
        display: flex;
      }
      .col {
        margin-right: 24px;
        .server-input,
        .time-input-with-unit-select {
          width: 285px;
        }
      }
    }
  }
}
</style>
