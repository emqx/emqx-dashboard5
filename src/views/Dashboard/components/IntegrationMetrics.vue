<template>
  <el-button type="primary" style="margin-left: 16px" @click="showDrawer = true">
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
      <el-row v-loading="integrationLoading">
        <div class="int-item">
          <div>
            <img srcset="@/assets/img/prom.png 2x" />
          </div>
          <div>
            <div class="part-header">Prometheus</div>
            <div class="part-desc">{{ tl('promDesc') }}</div>
            <div>
              <el-form :disabled="prometheusLoading" @keyup.enter="updatePrometheus()">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-input
                      placeholder="Push gateway Server"
                      v-model="integrationData.prometheus.push_gateway_server"
                    />
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      placeholder="Push Interval"
                      v-model="integrationData.prometheus.interval[0]"
                    >
                      <template #append>
                        <el-select v-model="integrationData.prometheus.interval[1]">
                          <el-option :label="tl('second')" value="s" />
                        </el-select>
                      </template>
                    </el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox border v-model="integrationData.prometheus.enable">
                      {{ $t('General.enabled') }}
                    </el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-button
                      type="primary"
                      :loading="prometheusLoading"
                      @click="updatePrometheus()"
                      >{{ $t('Base.update') }}</el-button
                    >
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
        <div class="int-item">
          <div>
            <img srcset="@/assets/img/statsd.png 2x" />
          </div>
          <div>
            <div class="part-header">StatsD</div>
            <div class="part-desc">{{ tl('statsdDesc') }}</div>
            <div>
              <el-form :disabled="statsdLoading" @keyup.enter="updateStatsd()">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-input placeholder="server" v-model="integrationData.statsd.server" />
                  </el-col>
                  <el-col :span="8">
                    <el-input
                      placeholder="Flush Interval"
                      v-model="integrationData.statsd.flush_time_interval[0]"
                    >
                      <template #append>
                        <el-select v-model="integrationData.statsd.flush_time_interval[1]">
                          <el-option :label="tl('second')" value="s" />
                        </el-select>
                      </template>
                    </el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-checkbox border v-model="integrationData.statsd.enable">
                      {{ $t('General.enabled') }}
                    </el-checkbox>
                  </el-col>
                  <el-col :span="3">
                    <el-button type="primary" :loading="statsdLoading" @click="updateStatsd()">{{
                      $t('Base.update')
                    }}</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
      </el-row>
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
  let [statsRes, prometheusRes] = (await Promise.allSettled([
    getStatsd(),
    getPrometheus(),
  ])) as Array<{ status: string; value: StatsD | Prometheus }>
  if (statsRes?.status == 'fulfilled') {
    integrationData.statsd = transformIntegrationData(statsRes.value)
    prometheusLoading.value = false
  }
  if (prometheusRes?.status == 'fulfilled') {
    integrationData.prometheus = transformIntegrationData(prometheusRes.value)
    statsdLoading.value = false
  }
  integrationLoading.value = false
}

const transformIntegrationData = (data: any) => {
  Object.keys(data).forEach((prop) => {
    let matching: any
    switch (prop) {
      case 'flush_time_interval':
      case 'interval':
        matching =
          (typeof data[prop] === 'string' && (data[prop] as string).match(/(\d+)(\w)/)) ||
          (data[prop] instanceof Array &&
            (data[prop] as Array<string>).unshift((data[prop] as Array<string>).join('')) &&
            data[prop])
        data[prop] = [matching[1], matching[2]]
        break
      default:
    }
  })
  return data
}

const updatePrometheus = async function () {
  prometheusLoading.value = true
  let pendingData: Prometheus = Object.assign({}, integrationData.prometheus)
  Object.keys(pendingData).forEach((v) => {
    if (v === 'interval' && pendingData[v] instanceof Array) {
      pendingData[v] = (pendingData[v] as Array<string>).join('')
    }
  })
  let res = await setPrometheus(pendingData as Prometheus).catch(() => {})
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

  Object.keys(pendingData).forEach((v) => {
    if (v === 'flush_time_interval' && pendingData[v] instanceof Array) {
      pendingData[v] = (pendingData[v] as [string, string]).join('')
    }
  })
  let res = await setStatsd(pendingData as StatsD)
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
  .el-row {
    margin: 40px 0;
  }
  .el-col {
    overflow: hidden;
  }
  .int-item {
    display: flex;
    flex-grow: 1;
    & > :first-child {
      padding: 10px;
    }
    & > :last-child {
      flex-grow: 1;
      padding: 10px;
    }
    & .part-desc {
      padding: 5px 0;
    }
  }
  .el-input-group--append :deep(.el-input-group__append) {
    width: 90px;
  }
}
</style>
