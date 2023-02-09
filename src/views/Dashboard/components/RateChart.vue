<template>
  <div ref="chartEl" class="rate-chart"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RateChart',
})
</script>

<script lang="ts" setup>
import { defineProps, ref, watch, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import useI18nTl from '@/hooks/useI18nTl'
import * as echarts from 'echarts/lib/echarts'
import { ECharts, EChartsOption, LineSeriesOption } from 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import useEchartResize from '@/hooks/useEchartResize'

const store = useStore()
const { tl } = useI18nTl('Base')

const createTooltip = (xAxis: string, val: number | undefined) => {
  const container = document.createElement('div')
  container.className = 'rate-chart-tooltip'
  if (val === undefined) {
    container.innerHTML = `<p class="no-data">${tl('noData')}</p>`
  } else {
    container.innerHTML = `
    <p class="x-value">${xAxis}</p>
    <div class="tooltip-body">
      <i class="badge"></i>
      <p class="num">${val}</p>
    </div>`
  }
  return container
}

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
    formatter: (params: Array<any>) => {
      if (!params[0]) {
        return ''
      }
      const { axisValue, value } = params[0]
      return createTooltip(axisValue, value)
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

const { addListener, removeListener } = useEchartResize()
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
    },
  ] as Array<LineSeriesOption>
  chartInstance?.setOption({ ...option })
}

const initChart = async () => {
  if (chartInstance) {
    removeListener()
    chartInstance.dispose()
  }
  let Dom = chartEl.value
  if (!Dom) return
  chartInstance = echarts.init(Dom)
  addListener(chartInstance as ECharts)
}

onMounted(() => {
  initChart()
  setSeriesConfig()
})
</script>

<style lang="scss">
.rate-chart-tooltip {
  min-width: 40px;
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
  .no-data {
    color: #909090;
  }
  .x-value {
    margin-bottom: 4px;
  }
  .tooltip-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .badge {
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: #975fe4;
    }
    .num {
      padding-left: 12px;
      font-weight: 500;
    }
  }
}
</style>
