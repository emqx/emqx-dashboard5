<template>
  <div class="polyline-cards">
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
import { defineComponent } from 'vue'
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

type ChartData = Array<{
  xData: Array<string>
  yData: Array<number>
}>

const { t } = useI18n()

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
  [ChartType.Routes]: t('Dashboard.topics'),
  [ChartType.Subscriptions]: t('Dashboard.Subscription'),
})
const metricLog: Record<string, ChartData> = reactive({
  [ChartType.Connections]: chartDataFill(32),
  [ChartType.Routes]: chartDataFill(32),
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
  ChartType.Routes,
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
    routes: getLineColors(4),
    subscriptions: getLineColors(5),
  }
})

const _formatTime = (time: number) => {
  return Moment(time).format('HH:mm')
}

const loadMetricsLogData = async () => {
  const data = await loadChartData()
  dataTypeList.forEach((typeName) => {
    metricLog[typeName] = chartDataFill(1)
  })
  data.forEach((data) => {
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
  loadMetricsLogData()
  timerMetrics.value = window.setInterval(loadMetricsLogData, 60000)
})

onUnmounted(clearTimer)
</script>

<style lang="scss">
.polyline-cards {
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
