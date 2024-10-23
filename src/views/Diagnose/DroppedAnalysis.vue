<template>
  <div class="dropped-analysis app-wrapper">
    <el-radio-group v-model="activeTab" @change="handleTabChanged">
      <el-radio-button :value="TabName.Message" :label="tl('messagesDroppedAtDelivery')" />
      <el-radio-button :value="TabName.Delivery" :label="tl('messagesDroppedAtReception')" />
    </el-radio-group>
    <div class="dropped-desc">
      {{ tl(isSelectedMessage ? 'messageDroppedDesc' : 'deliveryDroppedDesc') }}
    </div>
    <div class="block-charts">
      <div class="charts-hd space-between">
        <div class="block-title">
          <label>{{ tl('totalDroppedMessages') }}: </label>
          <span>{{ totalNum }}</span>
        </div>
        <el-select
          class="node-select"
          v-model="currentNode"
          :placeholder="$t('Clients.node')"
          @change="refreshCharts"
        >
          <el-option :label="$t('BasicConfig.cluster')" :value="CLUSTER_VALUE" />
          <el-option v-for="node in nodeOpts" :key="node" :label="node" :value="node" />
        </el-select>
      </div>
      <el-card class="charts-card" :key="activeTab">
        <div class="chart" :class="{ 'is-higher': !isSelectedMessage }" ref="BarChartEle"></div>
        <div class="chart" :class="{ 'is-higher': !isSelectedMessage }" ref="PieChartEle"></div>
      </el-card>
    </div>
    <div>
      <div class="charts-hd block-title">{{ tl('detailedMetrics') }}</div>
      <el-table :data="tableData">
        <el-table-column prop="name" :label="t('Clients.reason')" :min-width="120" />
        <el-table-column prop="value" sortable :label="t('components.value')" :min-width="80" />
        <el-table-column prop="key" :label="t('components.field')" :min-width="160" />
        <el-table-column prop="impact" :label="tl('causeAnalysis')" :min-width="240">
          <template #default="{ row }">
            <MarkdownContent :content="row.impact" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadMetrics, loadNodes } from '@/api/common'
import MarkdownContent from '@/components/MarkdownContent.vue'
import {
  MetricKey,
  useDeliveryDroppedDetails,
  useDroppedCharts,
  useMessageDroppedDetails,
} from '@/hooks/useDroppedDetail'
import useI18nTl from '@/hooks/useI18nTl'
import { get } from 'lodash'
import { computed, ref } from 'vue'

const enum TabName {
  Message,
  Delivery,
}
const activeTab = ref(TabName.Message)
const isSelectedMessage = computed(() => activeTab.value === TabName.Message)

const { t, tl } = useI18nTl('Dashboard')

const CLUSTER_VALUE = 'cluster'
const nodeOpts = ref<Array<string>>([])
const currentNode = ref<string>(CLUSTER_VALUE)
;(async () => {
  try {
    const nodes = await loadNodes()
    nodeOpts.value = nodes.map(({ node }) => node)
  } catch (error) {
    //
  }
})()

const metrics = ref<Record<string, number>>({})
const totalKey = computed(() =>
  isSelectedMessage.value ? MetricKey.MessagesDropped : MetricKey.DeliveryDropped,
)
const totalNum = computed(() => metrics.value[totalKey.value])

const {
  metricsKeyReg: messageDroppedMetricsKeyReg,
  itemStyle: messageDroppedMetricItemStyle,
  messageDroppedDesc,
} = useMessageDroppedDetails(totalNum)
const {
  metricsKeyReg: deliveryDroppedMetricsKeyReg,
  itemStyle: deliveryDroppedMetricItemStyle,
  deliveryDroppedDesc,
} = useDeliveryDroppedDetails(totalNum)

const { filterMetrics, initChart, getBarChartOptions, getPieChartOptions } = useDroppedCharts()

const requiredMetrics = computed(() =>
  filterMetrics(
    metrics.value,
    isSelectedMessage.value ? messageDroppedMetricsKeyReg : deliveryDroppedMetricsKeyReg,
  ),
)
const chartItemStyle = computed(() =>
  isSelectedMessage.value
    ? messageDroppedMetricItemStyle.value
    : deliveryDroppedMetricItemStyle.value,
)

const BarChartEle = ref()
const getBarOptions = () => getBarChartOptions(requiredMetrics.value, chartItemStyle.value)
let barChart: any = undefined
const drawBarChart = () => {
  if (!barChart) {
    barChart = initChart(BarChartEle.value)
  }
  barChart.setOption(getBarOptions())
}

const PieChartEle = ref()
const getPieOptions = () => getPieChartOptions(requiredMetrics.value, chartItemStyle.value)
let pieChart: any = undefined
const drawPieChart = () => {
  if (!pieChart) {
    pieChart = initChart(PieChartEle.value)
  }
  pieChart.setOption(getPieOptions())
}

const isLoading = ref(false)
const queryMetrics = async () => {
  try {
    isLoading.value = true
    const node = currentNode.value === CLUSTER_VALUE ? undefined : currentNode.value
    const data = await loadMetrics(node)
    if (Array.isArray(data) && data.length === 1) {
      metrics.value = data[0]
    } else if (!Array.isArray(data)) {
      metrics.value = data
    }
    isLoading.value = false
    return Promise.resolve()
  } catch (error) {
    isLoading.value = false
    return Promise.reject()
  }
}

const disposeCharts = () => {
  barChart?.dispose?.()
  barChart = undefined
  pieChart?.dispose?.()
  pieChart = undefined
}

const refreshCharts = async () => {
  try {
    await queryMetrics()
    drawBarChart()
    drawPieChart()
  } catch (error) {
    //
  }
}
refreshCharts()

const handleTabChanged = async () => {
  disposeCharts()
  refreshCharts()
}

interface TableItem {
  key: string
  name: string
  desc?: string
  impact: string
  value: number
}
const tableData = computed(() => {
  const arr = isSelectedMessage.value ? messageDroppedDesc : deliveryDroppedDesc
  return arr.reduce((arr: Array<TableItem>, item) => {
    const value = get(metrics.value, item.key)
    arr.push({ value, ...item })
    return arr
  }, [])
})
</script>

<style lang="scss">
.dropped-analysis {
  padding-top: 28px;
  padding-bottom: 24px;
  .el-radio-button {
    margin-bottom: 8px;
  }
  .dropped-desc {
    line-height: 24px;
    margin: 12px 0;
  }
  .block-charts {
    margin-bottom: 28px;
  }
  .charts-hd {
    align-items: center;
    margin-bottom: 12px;
    line-height: 32px;
  }
  .node-select {
    width: 200px;
  }
  .charts-card {
    .el-card__body {
      display: flex;
      justify-content: space-between;
    }
  }
  .chart {
    height: 300px;
    width: 50%;
    &.is-higher {
      height: 500px;
    }
  }
}
</style>
