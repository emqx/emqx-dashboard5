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
    </div>
    <div class="block">
      <el-row :gutter="26">
        <template v-for="item in messageDataTypeFilter" :key="item.value">
          <el-col :span="8">
            <el-card class="polyline-card">
              <div class="card-title">
                <span>{{ item.text }}</span>
                <div class="icons-container">
                  <el-icon v-if="item.value === ChartType.Dropped" @click="openDropDetailDialog">
                    <data-analysis />
                  </el-icon>
                  <el-icon @click="showChartDetails(item)"><full-screen /></el-icon>
                </div>
              </div>
              <polyline-chart
                :chart-id="`${item.value}-polyline`"
                :y-title="[item.text]"
                :chart-data="metricLog[item.value]"
                :chart-colors="chartColorList[item.value]"
                :unit-text-key="dataUnitTextKey[item.value]"
              ></polyline-chart>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div>
    <div class="block">
      <el-row :gutter="26">
        <template v-for="item in connectionDataTypeFilter" :key="item.value">
          <el-col :span="8">
            <el-card class="polyline-card">
              <div class="card-title">
                <span>{{ item.text }}</span>
                <div class="icons-container">
                  <el-icon @click="showChartDetails(item)"><full-screen /></el-icon>
                </div>
              </div>
              <polyline-chart
                :chart-id="`${item.value}-polyline`"
                :y-title="[item.text]"
                :chart-data="metricLog[item.value]"
                :chart-colors="chartColorList[item.value]"
                :unit-text-key="dataUnitTextKey[item.value]"
                is-instantaneous-value
              ></polyline-chart>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </div>
    <el-dialog
      v-model="showFullScreen"
      width="95%"
      top="24px"
      destroy-on-close
      align-center
      @opened="openedFullScreen"
      class="full-screen-dialog"
    >
      <template #header="{ titleId, titleClass }">
        <div class="full-screen-header">
          <div :id="titleId" :class="titleClass">{{ selectedChartItem?.text }}</div>
          <info-tooltip place="right" :content="selectedChartTooltip" />
        </div>
      </template>
      <el-row class="full-screen-chart" v-if="selectedChartItem">
        <el-col :span="4">
          <el-select class="interval-select" v-model="timeRange">
            <el-option
              v-for="time in timeRangeOptions"
              :key="time.label"
              :label="time.label"
              :value="time.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="24">
          <polyline-chart
            ref="fullScreenChart"
            :chart-id="`${selectedChartItem.value}-polyline-full-screen`"
            :y-title="selectedChartItemYTitle"
            :chart-data="selectedChartItemChartData"
            :chart-colors="selectedChartItemColors"
            :unit-text-key="selectedChartItemUnitTextKey"
            height="65vh"
            show-full-screen
          ></polyline-chart>
        </el-col>
        <el-col :span="24">
          <el-table :data="generateDetailTableData(selectedChartItemChartData)">
            <el-table-column :label="t('Base.name')" v-if="selectedChartItemYTitle.length > 1">
              <template #default="{ $index }">
                {{ selectedChartItemYTitle[$index] }}
              </template>
            </el-table-column>
            <el-table-column prop="last" :label="t('Base.last')"></el-table-column>
            <el-table-column prop="max" :label="t('Base.max')"></el-table-column>
            <el-table-column prop="min" :label="t('Base.min')"></el-table-column>
            <el-table-column prop="avg" :label="t('Base.avg')"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
    <DroppedDetailDialog v-model="isDroppedDetailDialogOpen" :metrics="droppedDetailMetrics" />
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
import { loadChartData, loadMetrics as loadDroppedDetail } from '@/api/common'
import { ref, reactive, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChartType } from '@/types/enum'
import useI18nTl from '@/hooks/useI18nTl'
import useSyncPolling from '@/hooks/useSyncPolling'
import { FullScreen, DataAnalysis } from '@element-plus/icons-vue'
import { isNumber } from 'lodash'
import InfoTooltip from '@/components/InfoTooltip.vue'
import DroppedDetailDialog from './DroppedDetailDialog.vue'

const POLLING_INTERVAL = 60000

type ChartData = Array<{
  xData: Array<number>
  yData: Array<number>
}>

// Define an interface for the structure you expect
interface ChartContainerDOM {
  chart?: {
    resize: () => void
  }
}

const { t } = useI18n()
const { tl } = useI18nTl('Dashboard')

const timeRange = ref(3600)
const showFullScreen = ref(false)
const isLoading = ref(false)
const fullScreenChart = ref<ChartContainerDOM | null>(null)

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
const dataUnitTextKey: Record<string, string> = {
  [ChartType.Received]: 'Dashboard.messagesUnit',
  [ChartType.Sent]: 'Dashboard.messagesUnit',
  [ChartType.Dropped]: 'Dashboard.messagesUnit',
  [ChartType.Connections]: 'Dashboard.connectionsUnit',
  [ChartType.LiveConnections]: 'Dashboard.liveConnectionsUnit',
  [ChartType.Topics]: 'Dashboard.topicsUnit',
  [ChartType.Subscriptions]: 'Dashboard.subscriptionsUnit',
}
const metricLog: Record<string, ChartData> = reactive({
  [ChartType.Connections]: chartDataFill(1),
  [ChartType.LiveConnections]: chartDataFill(1),
  [ChartType.Topics]: chartDataFill(1),
  [ChartType.Subscriptions]: chartDataFill(1),
  [ChartType.Received]: chartDataFill(1),
  [ChartType.Sent]: chartDataFill(1),
  [ChartType.Dropped]: chartDataFill(1),
  [ChartType.SentBytes]: chartDataFill(1),
  [ChartType.ReceivedBytes]: chartDataFill(1),
})
const dataTypeList: Array<ChartType> = reactive([
  ChartType.Dropped,
  ChartType.Connections,
  ChartType.LiveConnections,
  ChartType.Topics,
  ChartType.Subscriptions,
  ChartType.Sent,
  ChartType.Received,
])

const selectedChartItem = ref<null | { text: string; value: string }>(null)

const selectedChartTooltip = ref('')

const isSelectedConnection = computed(() => {
  return selectedChartItem.value?.value === ChartType.Connections
})
const selectedChartItemYTitle = computed<Array<string>>(() => {
  const retText = selectedChartItem.value ? selectedChartItem.value.text : ''
  return isSelectedConnection.value ? [retText, t('Dashboard.liveConnections')] : [retText]
})
const selectedChartItemChartData = computed<ChartData>(() => {
  const ret = selectedChartItem.value ? metricLog[selectedChartItem.value.value] : []
  return isSelectedConnection.value ? [ret[0], metricLog[ChartType.LiveConnections][0]] : ret
})
const selectedChartItemUnitTextKey = computed(() => {
  const ret = dataUnitTextKey[selectedChartItem.value?.value ?? '']
  return isSelectedConnection.value ? [ret, dataUnitTextKey[ChartType.LiveConnections]] : ret
})
const selectedChartItemColors = computed(() => {
  const ret = [...chartColorList.value[selectedChartItem.value?.value ?? '']]
  if (isSelectedConnection.value) {
    ret.splice(1, 0, '#308FFF')
  }
  return ret
})

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
const getLineColors = (index: number) => {
  const totalColors = ['#3D7FF9', '#5ECEA6', '#757789', '#5551F4', '#F49845', '#66CFDA']
  // Swap the first and index positions
  const changedColorArr = [...totalColors.splice(0, 1, totalColors[index])]
  totalColors.splice(index, 1, changedColorArr[0])
  return totalColors
}
const chartColorList = computed<Record<string, string[]>>(() => {
  return {
    received: getLineColors(0),
    sent: getLineColors(1),
    dropped: getLineColors(2),
    connections: getLineColors(3),
    topics: getLineColors(4),
    subscriptions: getLineColors(5),
  }
})

const { syncPolling } = useSyncPolling()

const loadChartMetrics = async () => {
  try {
    isLoading.value = true
    const data = await loadChartData(timeRange.value)
    dataTypeList.forEach((typeName) => {
      metricLog[typeName] = chartDataFill(1)
    })
    data.forEach((data: Record<string, any>) => {
      dataTypeList.forEach((typeName) => {
        const currentData = metricLog[typeName][0]
        currentData.xData.push(data.time_stamp)
        currentData.yData.push(data[typeName])
      })
    })
    isLoading.value = false
    return Promise.resolve()
  } catch (error) {
    isLoading.value = false
    return Promise.reject()
  }
}

const showChartDetails = (chartItem: { text: string; value: string }) => {
  showFullScreen.value = true
  selectedChartItem.value = chartItem
  const chartTypeKey = [ChartType.Received, ChartType.Dropped, ChartType.Sent].includes(
    chartItem.value as ChartType,
  )
    ? 'Dashboard.chartMessages'
    : 'Dashboard.chartConnection'

  selectedChartTooltip.value = t(chartTypeKey, { type: chartItem.text })
}

const openedFullScreen = async () => {
  await nextTick()
  fullScreenChart.value?.chart?.resize()
}

const calculateStatistics = (data: Array<number | null>) => {
  const validData: Array<number> = data.filter(
    (item) => isNumber(item) && item !== -1,
  ) as Array<number>
  const validDataLength = validData.length
  const max = Math.max(...validData)
  const min = Math.min(...validData)
  const sum = validData.reduce((acc, val) => acc + val, 0)
  const avg = Math.round(sum / validDataLength)
  const last = data[data.length - 1]
  return { max, min, avg, last }
}

const generateDetailTableData = (data: ChartData) => {
  return data.map((item) => {
    return calculateStatistics(item.yData)
  })
}

const isDroppedDetailDialogOpen = ref(false)
const droppedDetailMetrics = ref({})
const openDropDetailDialog = () => {
  isDroppedDetailDialogOpen.value = true
}
const loadDropDetailMetrics = async () => {
  try {
    droppedDetailMetrics.value = await loadDroppedDetail()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}

const loadMetrics = async () => {
  try {
    await Promise.allSettled([loadChartMetrics(), loadDropDetailMetrics()])
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}

syncPolling(loadMetrics, POLLING_INTERVAL)
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
    .el-card__body {
      padding: 12px 8px 0;
    }
    .card-title {
      font-size: 16px;
      color: var(--color-title-primary);
      display: flex;
      margin: 0px 10px 8px;
      justify-content: space-between;
      .icons-container {
        visibility: hidden;
        color: var(--color-text-primary);
        .el-icon {
          cursor: pointer;
          margin-left: 8px;
          &:hover {
            color: var(--color-primary);
          }
        }
      }
    }
    &:hover {
      .icons-container {
        visibility: visible;
      }
    }
  }
  .polyline-card {
    height: 255px;
  }
}
.full-screen-dialog {
  .full-screen-header {
    display: flex;
    align-items: center;
  }
  .el-table {
    margin-top: 12px;
  }
}
</style>
