<template>
  <el-dialog v-model="showDialog" width="700px" top="52px" class="dropped-detail-dialog">
    <div class="bar-chart-wrapper">
      <div class="chart" ref="BarChartEle" :id="createRandomString()"></div>
    </div>
    <div class="pie-chart-wrapper">
      <div class="chart" ref="PieChartEle" :id="createRandomString()"></div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { createRandomString } from '@/common/tools'
import { ElDialog } from 'element-plus'
import { computed, defineEmits, defineProps, nextTick, ref, watch } from 'vue'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/legend'
import { useStore } from 'vuex'
import { pick } from 'lodash'

const enum MetricKey {
  AwaitPubrelTimeout = 'messages.dropped.await_pubrel_timeout',
  NoSubscribers = 'messages.dropped.no_subscribers',
}
const metricKeyArr = [MetricKey.AwaitPubrelTimeout, MetricKey.NoSubscribers]

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

const store = useStore()
const chartTheme = computed(() => (store.state.theme === 'dark' ? 'dark' : 'light'))

const typeName = new Map<string, string>([
  [MetricKey.AwaitPubrelTimeout, 'Await Pubrel Timeout'],
  [MetricKey.NoSubscribers, 'No Subscribers'],
])
const requiredMetrics = computed(() => {
  return Object.entries(pick(props.metrics, metricKeyArr)).reduce(
    (arr: Array<{ value: number; label: string }>, [key, value], index) => {
      arr.push({ value, label: typeName.get(key) ?? key })
      return arr
    },
    [],
  )
})

const nameColor = new Map<string, string>([
  [typeName.get(MetricKey.AwaitPubrelTimeout) ?? '', '#ffd78e'],
  [typeName.get(MetricKey.NoSubscribers) ?? '', '#bac1cd'],
])
const itemStyle = {
  color: function ({ name }: any) {
    return nameColor.get(name)
  },
}

const BarChartEle = ref()
const getBarOptions = () => {
  /**
   * [string, number] -> [metricKey, metricValue]
   */
  const dataArr: Array<{ value: number; label: string }> = requiredMetrics.value.sort(
    (pre, next) => pre.value - next.value,
  )
  return {
    grid: {
      left: 80,
    },
    tooltip: {
      trigger: 'item',
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: dataArr.map(({ label }) => label),
      axisLabel: {
        width: 70,
        overflow: 'break',
      },
    },
    series: [
      {
        type: 'bar',
        data: dataArr.map(({ value }) => value),
        itemStyle,
      },
    ],
  }
}
const drawBarChart = () => {
  const chart = echarts.init(BarChartEle.value, chartTheme.value)
  chart.setOption(getBarOptions())
}

const PieChartEle = ref()
const getPieOptions = () => {
  const data = requiredMetrics.value.map(({ label, value }) => ({
    value,
    name: label,
  }))
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data,
        itemStyle,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
}
const drawPieChart = () => {
  const chart = echarts.init(PieChartEle.value, chartTheme.value)
  chart.setOption(getPieOptions())
}

const drawChart = () => {
  drawBarChart()
  drawPieChart()
}

watch(showDialog, async (val) => {
  if (val) {
    await nextTick()
    drawChart()
  }
})
</script>

<style lang="scss">
.dropped-detail-dialog {
  .bar-chart-wrapper {
    height: 300px;
  }
  .pie-chart-wrapper {
    height: 300px;
  }
  .chart {
    height: 100%;
  }
}
</style>
