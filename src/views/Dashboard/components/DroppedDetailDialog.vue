<template>
  <el-dialog v-model="showDialog" width="700px" top="52px" class="dropped-detail-dialog">
    <div class="info-bar space-between">
      <div>
        <label>{{ tl('totalDroppedMessages') }}</label>
        <span>{{ metrics[MetricKey.MessagesDropped] }}</span>
      </div>
      <div>
        <span>{{ tl('bar') }}</span>
        <el-switch
          v-model="chartType"
          :inactive-value="ChartType.Bar"
          :active-value="ChartType.Pie"
          @change="drawChart"
        />
        <span>{{ tl('pie') }}</span>
      </div>
    </div>
    <div class="chart-wrapper" v-if="chartType === ChartType.Bar">
      <div class="chart" ref="BarChartEle" :id="createRandomString()"></div>
    </div>
    <div class="chart-wrapper" v-else>
      <div class="chart" ref="PieChartEle" :id="createRandomString()"></div>
    </div>
    <div class="dropped-desc">
      <div class="dropped-desc-hd">{{ tl('dropReasonsTitle') }}</div>
      <el-table :data="messageDroppedDesc">
        <el-table-column prop="name" :label="t('Clients.reason')" />
        <el-table-column prop="desc" :label="tl('description')" />
        <el-table-column prop="impact" :label="tl('potentialImpact')" />
      </el-table>
    </div>
    <template #footer>
      <el-button>{{ tl('viewDetailAnalysis') }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { createRandomString } from '@/common/tools'
import { MetricKey, useDroppedCharts, useMessageDroppedDetails } from '@/hooks/useDroppedDetail'
import useI18nTl from '@/hooks/useI18nTl'
import { ElDialog } from 'element-plus'
import { computed, defineEmits, defineProps, nextTick, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  metrics: Record<string, number>
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('Dashboard')

const { filterMetrics, initChart, getBarChartOptions, getPieChartOptions } = useDroppedCharts()
const { metricKeyArr, itemStyle, messageDroppedDesc } = useMessageDroppedDetails()

const requiredMetrics = computed(() => filterMetrics(props.metrics, metricKeyArr))

const enum ChartType {
  Bar = 'bar',
  Pie = 'pie',
}
const chartType = ref(ChartType.Bar)

const BarChartEle = ref()
const getBarOptions = () => getBarChartOptions(requiredMetrics.value, itemStyle)
const drawBarChart = () => {
  initChart(BarChartEle.value).setOption(getBarOptions())
}

const PieChartEle = ref()
const getPieOptions = () => getPieChartOptions(requiredMetrics.value, itemStyle)
const drawPieChart = () => {
  initChart(PieChartEle.value).setOption(getPieOptions())
}

const drawChart = async () => {
  await nextTick()
  if (chartType.value === ChartType.Bar) {
    drawBarChart()
  } else {
    drawPieChart()
  }
}

watch(showDialog, (val) => {
  if (val) {
    drawChart()
  } else {
    chartType.value = ChartType.Bar
  }
})
</script>

<style lang="scss">
.dropped-detail-dialog {
  .chart-wrapper {
    height: 300px;
  }
  .chart {
    height: 100%;
  }
}
</style>
