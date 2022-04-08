<template>
  <div ref="chartEl" class="simple-line"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SimpleLine',
})
</script>

<script lang="ts" setup>
import { defineProps, ref, watch, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts/lib/echarts'
import { ECharts, EChartsOption, LineSeriesOption } from 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'

const store = useStore()

const props = defineProps({
  value: {
    type: Object,
    default: () => ({ x: [], y: [] }),
    required: false,
  },
  color: {
    type: String,
    default: '#975fe4',
  },
  type: {
    type: String,
    default: 'line',
  },
})

const chartEl = ref()
let chartInstance: ECharts | null = null
const option: EChartsOption = reactive({
  color: [props.color],
  grid: {
    left: 0, // default 80px
    top: 0, // default 60px
    right: 0, // default 80px
    bottom: 0, // default 60px
  },
  tooltip: {
    trigger: 'axis',
    confine: true,
    axisPointer: {
      type: 'none',
    },
  },
  xAxis: {
    type: 'category',
    data: props.value.x,
    triggerEvent: true,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  series: [],
})

watch(
  () => JSON.stringify(props.value),
  () => {
    setSeriesConfig()
  },
)

watch(
  () => store.state.leftBarCollapse,
  () => {
    setTimeout(setSeriesConfig, 500)
  },
)

const setSeriesConfig = async () => {
  const { color, type } = props
  option.series = [
    {
      data: props.value.y,
      smooth: true,
      type,
      symbolSize: 0,
      lineStyle: {
        color,
      },
      label: {
        show: false,
      },
      areaStyle: {
        color,
        opacity: 1,
      },
    },
  ] as Array<LineSeriesOption>
  chartInstance?.setOption({ ...option })
}

const initChart = async () => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  let Dom = chartEl.value
  if (!Dom) return
  chartInstance = echarts.init(Dom)
}

onMounted(() => {
  initChart()
  setSeriesConfig()
})
</script>
