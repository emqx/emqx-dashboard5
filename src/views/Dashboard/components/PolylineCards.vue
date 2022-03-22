<template>
  <div class="polyline-cards">
    <el-row>
      <template v-for="item in dataTypeFilter" :key="item.value">
        <el-col :span="8">
          <el-card shadow="never" class="polyline-card">
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

const dataTypeMap = reactive({
  [ChartType.Connections]: t('Dashboard.currentConnection'),
  [ChartType.Routes]: t('Dashboard.topics'),
  [ChartType.Subscriptions]: t('Dashboard.Subscription'),
  [ChartType.Received]: t('Dashboard.messageIn'),
  [ChartType.Sent]: t('Dashboard.messageOut'),
  [ChartType.Dropped]: t('Dashboard.messageDrop'),
})
const metricLog: Record<ChartType, ChartData> = reactive({
  [ChartType.Connections]: chartDataFill(32),
  [ChartType.Routes]: chartDataFill(32),
  [ChartType.Subscriptions]: chartDataFill(32),
  [ChartType.Sent]: chartDataFill(32),
  [ChartType.Dropped]: chartDataFill(32),
  [ChartType.Received]: chartDataFill(32),
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

const dataTypeFilter = computed(() => {
  return Object.entries(dataTypeMap).map(([value, text]) => ({
    text,
    value,
  }))
})
const chartColorList = computed(() => {
  const getLineColors = (index: number) => {
    const totalColors = ['#22BB7A', '#4065E0', '#EEC90D', '#07E3E4', '#6ECAFA', '#AF79FF']
    // Swap the first and index positions
    const changedColorArr = [...totalColors.splice(0, 1, totalColors[index])]
    totalColors.splice(index, 1, changedColorArr[0])
    return totalColors
  }
  return {
    dropped: getLineColors(0),
    connections: getLineColors(1),
    routes: getLineColors(2),
    subscriptions: getLineColors(3),
    sent: getLineColors(4),
    received: getLineColors(5),
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
    margin: 10px;

    .card-title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
      margin: 2px 0 10px 6px;
    }
  }

  .polyline-card {
    height: 255px;
  }
}
</style>
