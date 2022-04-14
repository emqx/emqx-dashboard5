<template>
  <div class="polyline-cards">
    <div class="chart-option">
      <el-select class="interval-select" v-model="timeRange">
        <el-option
          v-for="time in timeRangeOptions"
          :key="time.label"
          :label="time.label"
          :value="time.value"
        ></el-option>
      </el-select>
      <integration-metrics></integration-metrics>
    </div>
    <div class="block">
      <h2>{{ $t('Dashboard.messageNumber') }}</h2>
      <el-row :gutter="26">
        <template v-for="item in messageDataTypeFilter" :key="item.value">
          <el-col :span="8">
            <el-card class="polyline-card">
              <div class="card-title">{{ item.text }}</div>
              <polyline-chart
                :chart-id="`${item.value}-polyline`"
                :y-title="[item.text]"
                :chart-data="metricLog[item.value]"
                :chartColors="chartColorList[item.value]"
              ></polyline-chart>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div>
    <div class="block">
      <h2>
        {{ $t('Dashboard.connection') }} / {{ $t('Dashboard.topics') }} /
        {{ $t('Dashboard.subscription') }}
      </h2>
      <el-row :gutter="26">
        <template v-for="item in connectionDataTypeFilter" :key="item.value">
          <el-col :span="8">
            <el-card class="polyline-card">
              <div class="card-title">{{ item.text }}</div>
              <polyline-chart
                :chart-id="`${item.value}-polyline`"
                :y-title="[item.text]"
                :chart-data="metricLog[item.value]"
                :chartColors="chartColorList[item.value]"
              ></polyline-chart>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
export default defineComponent({
  name: 'PolylineCards',
})
</script>

<script lang="ts" setup>
import PolylineChart from './PolylineChart.vue'
import Moment from 'moment'
import { loadChartData } from '@/api/common'
import { ref, reactive, computed, onUnmounted, onMounted, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChartType } from '@/types/enum'
import IntegrationMetrics from './IntegrationMetrics.vue'
import useI18nTl from '@/hooks/useI18nTl'

type ChartData = Array<{
  xData: Array<string>
  yData: Array<number>
}>

const { t } = useI18n()
const { tl } = useI18nTl('Dashboard')

const timeRange = ref(3600)

const timeRangeOptions = [
  { label: tl('lastHour'), value: 3600 },
  { label: tl('last6Hours'), value: 21600 },
  { label: tl('last12Hours'), value: 43200 },
  { label: tl('lastDay'), value: 86400 },
  { label: tl('last3Days'), value: 259200 },
  { label: tl('last7Days'), value: 604800 },
]

watch(timeRange, () => {
  loadChartMetrics()
})

const chartDataFill = (length: number): ChartData => {
  return Array.from({ length }, () => ({ xData: [], yData: [] }))
}

const messageDataTypeMap = reactive({
  [ChartType.Received]: t('Dashboard.messageIn'),
  [ChartType.Sent]: t('Dashboard.messageOut'),
  [ChartType.Dropped]: t('Dashboard.messageDrop'),
})
const connectionDataTypeMap = reactive({
  [ChartType.Connections]: t('Dashboard.currentConnection'),
  [ChartType.Topics]: t('Dashboard.topics'),
  [ChartType.Subscriptions]: t('Dashboard.Subscription'),
})
const metricLog: Record<string, ChartData> = reactive({
  [ChartType.Connections]: chartDataFill(32),
  [ChartType.Topics]: chartDataFill(32),
  [ChartType.Subscriptions]: chartDataFill(32),
  [ChartType.Received]: chartDataFill(32),
  [ChartType.Sent]: chartDataFill(32),
  [ChartType.Dropped]: chartDataFill(32),
  [ChartType.SentBytes]: chartDataFill(32),
  [ChartType.ReceivedBytes]: chartDataFill(32),
})
const dataTypeList: Array<ChartType> = reactive([
  ChartType.Dropped,
  ChartType.Connections,
  ChartType.Topics,
  ChartType.Subscriptions,
  ChartType.Sent,
  ChartType.Received,
])
const timerMetrics: Ref<null | number> = ref(null)

const messageDataTypeFilter = computed(() => {
  return Object.entries(messageDataTypeMap).map(([value, text]) => ({
    text,
    value,
  }))
})
const connectionDataTypeFilter = computed(() => {
  return Object.entries(connectionDataTypeMap).map(([value, text]) => ({
    text,
    value,
  }))
})
const chartColorList = computed<Record<string, string[]>>(() => {
  const getLineColors = (index: number) => {
    const totalColors = ['#3D7FF9', '#5D4EFF', '#757789', '#00A890', '#F49845', '#66CFDA']
    // Swap the first and index positions
    const changedColorArr = [...totalColors.splice(0, 1, totalColors[index])]
    totalColors.splice(index, 1, changedColorArr[0])
    return totalColors
  }
  return {
    received: getLineColors(0),
    sent: getLineColors(1),
    dropped: getLineColors(2),
    connections: getLineColors(3),
    topics: getLineColors(4),
    subscriptions: getLineColors(5),
  }
})

const _formatTime = (time: number) => {
  return Moment(time).format('HH:mm')
}

const loadChartMetrics = async () => {
  const data = await loadChartData(timeRange.value)
  dataTypeList.forEach((typeName) => {
    metricLog[typeName] = chartDataFill(1)
  })
  data.forEach((data: Record<string, any>) => {
    dataTypeList.forEach((typeName) => {
      const currentData = metricLog[typeName][0]
      currentData.xData.push(_formatTime(data.time_stamp))
      currentData.yData.push(data[typeName])
    })
  })
}

const clearTimer = () => {
  timerMetrics.value && clearInterval(timerMetrics.value)
}

onMounted(() => {
  loadChartMetrics()
  timerMetrics.value = window.setInterval(loadChartMetrics, 60000)
})

onUnmounted(clearTimer)
</script>

<style lang="scss">
.polyline-cards {
  .chart-option {
    margin-top: 36px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .interval-select {
      width: 260px;
    }
  }
  .big-card,
  .polyline-card {
    position: relative;
    .card-title {
      font-size: 16px;
      color: var(--color-title-primary);
      margin: 2px 0 10px 6px;
    }
  }
  .polyline-card {
    height: 255px;
  }
}
</style>
