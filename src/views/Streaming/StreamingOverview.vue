<template>
  <div class="streaming-overview app-wrapper with-padding-top" v-loading="isLoading">
    <el-card>
      <div class="metric-item" v-for="item in metricList" :key="item">
        <div class="metric-item-hd">
          <i class="metric-item-icon" />
          <span class="metric-item-title">{{ tl(`metricTitleDic.${item}`) }}</span>
        </div>
        <div class="metric-item-bd">
          <label class="metric-item-value">{{ metricsData[item] }}</label>
          <span class="metric-item-unit" v-if="/rate/i.test(item)">
            {{ t('Dashboard.strip', { n: metricsData[item] }) }}/{{ t('Dashboard.second') }}
          </span>
        </div>
      </div>
    </el-card>
    <div>
      <h2>Endpoint</h2>
      <el-table :data="endpoints">
        <el-table-column :label="tl('securityProtocol')" prop="security_protocol" min-width="140" />
        <el-table-column :label="tl('networkType')" prop="network_type" min-width="120" />
        <el-table-column :label="t('Base.address')" prop="address" min-width="200">
          <template #default="{ row }">
            <TextEasyCopy>{{ row.address }}</TextEasyCopy>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getEndpoints, getStreamingMetrics } from '@/api/streaming'
import TextEasyCopy from '@/components/TextEasyCopy.vue'
import { useLocale } from '@emqx/shared-ui-utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

interface Endpoint {
  security_protocol: string
  address: string
  network_type: string
}

interface MetricsData {
  partition_count: number
  total_messages_out_rate: number
  total_messages_in_rate: number
  group_count: number
  stream_count: number
}

const { state } = useStore()
const { t: sharedT } = useLocale(state.lang)
const tl = (key: string) => sharedT(`streaming.${key}`)

const { t } = useI18n()

const isLoading = ref(false)

const metricsData = ref<MetricsData>({
  partition_count: 0,
  total_messages_out_rate: 0,
  total_messages_in_rate: 0,
  group_count: 0,
  stream_count: 0,
})

const metricList: Array<keyof MetricsData> = [
  'stream_count',
  'partition_count',
  'group_count',
  'total_messages_in_rate',
  'total_messages_out_rate',
]

const getMetrics = async () => {
  try {
    metricsData.value = await getStreamingMetrics()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}

const endpoints = ref<Array<Endpoint>>([])

const getGroups = async () => {
  try {
    endpoints.value = await getEndpoints()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
getGroups()
;(async () => {
  try {
    isLoading.value = true
    await Promise.allSettled([getMetrics(), getGroups()])
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
})()
</script>

<style lang="scss">
.streaming-overview {
  padding-bottom: 32px;
}
</style>
