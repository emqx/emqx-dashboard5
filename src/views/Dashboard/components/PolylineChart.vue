<template>
  <div :id="chartId" :style="{ height: height, width: '100%' }"></div>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'

export default defineComponent({
  name: 'PolylineChart',
})
</script>

<script setup lang="ts">
import type { PropType, Ref } from 'vue'
import { computed, defineExpose, defineProps, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/legend'
import useEchartResize from '@/hooks/useEchartResize'
import useI18nTl from '@/hooks/useI18nTl'
import { isUndefined } from 'lodash'
import dayjs from 'dayjs'
import { useStore } from 'vuex'

const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  yTitle: {
    type: Array as PropType<Array<string>>,
    default: () => [''],
  },
  chartColors: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  chartData: {
    type: Array as PropType<Array<{ xData: Array<number>; yData: Array<number> }>>,
    default: () => [{ xData: [], yData: [] }],
  },
  height: {
    type: String,
    default: '190px',
  },
  isInstantaneousValue: {
    type: Boolean,
  },
  unitTextKey: {
    type: [String, Array] as PropType<string | Array<string>>,
  },
  showFullScreen: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()
const theme = computed(() => {
  return store.state.theme
})

const axisColor = { colorAxisLine: '#757575', colorAxisLabel: '#757575' }

const seriesConfig: Ref<Array<any>> = ref([])
const chart: Ref<undefined | any> = shallowRef(undefined)
const { addListener } = useEchartResize()

defineExpose({ chart })

watch(
  () => props.chartData,
  () => {
    drawChart()
  },
)

onMounted(() => {
  drawChart()
})

const NO_DATA_VALUE = -1
let noYAxisDataMap: Record<string, Array<number>> = {}

const storeNoDataXAxis = (yData: Array<number>, xData: Array<number>, title: string) => {
  yData.forEach((item, index) => {
    if (item === NO_DATA_VALUE) {
      if (!noYAxisDataMap[title]) {
        noYAxisDataMap[title] = []
      }
      noYAxisDataMap[title].push(xData[index])
    }
  })
}

const handleYAxisData = (arr: Array<number>) =>
  arr.map((item) => (item === NO_DATA_VALUE ? 0 : item))

const setSeriesConfig = () => {
  seriesConfig.value = []
  noYAxisDataMap = {}
  for (let i = 0; i < props.yTitle.length; i += 1) {
    const areaColor = i % 6 === 0 && i !== 0 ? props.chartColors[6] : props.chartColors[i % 6]
    storeNoDataXAxis(props.chartData[i].yData, props.chartData[i].xData, props.yTitle[i])
    seriesConfig.value.push({
      name: props.yTitle[i],
      type: 'line',
      smooth: true,
      symbolSize: 5,
      showSymbol: false,
      data: handleYAxisData(props.chartData[i].yData),
      step: false,
      lineStyle: {
        width: 2,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: areaColor,
          },
          {
            offset: 1,
            color: `${areaColor}00`,
          },
        ]),
        opacity: 0.2,
      },
    })
  }
}

const _formatTime = (time: string, format = 'YYYY/MM/DD HH:mm') => {
  return dayjs(parseInt(time)).format(format)
}

const createTooltipDataItem = (title: string, color: string, val?: number) => {
  const item = document.createElement('div')
  item.className = 'tooltip-data-item'
  item.innerHTML = `
  <div>
    <i class="badge" style="background-color:${color}"></i>
    <span>${title}</span>
  </div>
  ${!isUndefined(val) ? `<p class="num">${val}</p>` : ''}`
  return item
}

const createTooltip = (xAxis: string, content: Array<HTMLElement>) => {
  const container = document.createElement('div')
  container.innerHTML = `
  <div class="polyline-chart-tooltip">
    <p class="x-value">${_formatTime(xAxis, 'MM/DD HH:mm:ss')}</p>
    <div class="tooltip-body">
      ${content.map((item) => item.outerHTML).join('')}
    </div>
  </div>
  `
  return container
}

const { t } = useI18nTl('Dashboard')
const getInterval = (index: number) => {
  const xData: Array<number> = props.chartData?.[0]?.xData || []
  if (index === 0 && !isUndefined(xData[0]) && !isUndefined(xData[1])) {
    return xData[1] - xData[0]
  }
  if (!isUndefined(xData[index]) && !isUndefined(xData[index - 1])) {
    return xData[index] - xData[index - 1]
  }
  return undefined
}
const drawChart = () => {
  setSeriesConfig()
  const Dom = document.getElementById(props.chartId)

  if (!chart.value) {
    chart.value = echarts.init(Dom, theme.value === 'dark' ? 'dark' : 'light')
    addListener(chart.value)
  }
  const option = {
    backgroundColor: 'transparent',
    color: props.chartColors,
    grid: {
      top: '5%',
      right: 30,
      bottom: '3%',
      left: 24,
      containLabel: true,
    },
    legend: props.yTitle.length > 1 ? { top: 4 } : undefined,
    toolbox: {
      feature: {
        saveAsImage: {
          show: props.showFullScreen,
          title: '',
          name: 'emqx-dashboard',
          emphasis: {
            iconStyle: {
              borderColor: '#5e4eff',
            },
          },
        },
        dataZoom: {
          show: props.showFullScreen,
          yAxisIndex: false,
          title: '',
          emphasis: {
            iconStyle: {
              borderColor: '#5e4eff',
            },
          },
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: {
        type: 'cross',
        label: {
          show: props.showFullScreen,
          formatter(params: { value: string | number; axisDimension: string }) {
            const { value, axisDimension } = params
            if (axisDimension === 'x') {
              return `${_formatTime(value as string, 'MM/DD')} ${_formatTime(
                value as string,
                'HH:mm',
              )}`.trim()
            } else if (axisDimension === 'y') {
              return `${Math.round(value as number)}`.trim()
            }
            return ''
          },
        },
      },
      formatter: (params: Array<any>) => {
        if (!params[0]) {
          return ''
        }
        const dataItemArr = params.reduce(
          (arr, { axisValue, color, seriesName, value, dataIndex }, index) => {
            let valueShowInTooltip = value
            const isNoData = noYAxisDataMap[seriesName]?.includes(axisValue)
            if (isNoData) {
              valueShowInTooltip = 'NaN'
            }
            if (!props.unitTextKey) {
              arr.push(createTooltipDataItem(seriesName, color, valueShowInTooltip))
            } else {
              let title = ''
              const interval = getInterval(dataIndex)
              const unitTextKey: string = Array.isArray(props.unitTextKey)
                ? props.unitTextKey[index]
                : props.unitTextKey
              if (!props.isInstantaneousValue && interval) {
                title = t(unitTextKey, { interval: interval / 1000, n: value })
              } else {
                title = isNoData ? t(unitTextKey, { n: 0 }) : t(unitTextKey, { n: value })
              }
              arr.push(createTooltipDataItem(title, color))
            }
            return arr
          },
          [],
        )
        return createTooltip(params[0].axisValue, dataItemArr)
      },
    },
    dataZoom: props.showFullScreen ? [{ type: 'inside' }, { type: 'slider' }] : undefined,
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.chartData[0].xData,
      axisLine: {
        lineStyle: {
          color: axisColor.colorAxisLine,
        },
      },
      axisLabel: {
        hideOverlap: true,
        showMinLabel: true,
        color: axisColor.colorAxisLabel,
        formatter(value: string) {
          return `${_formatTime(value, 'MM/DD')} ${_formatTime(value, 'HH:mm')}`
        },
      },
      splitLine: {
        show: props.showFullScreen,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: axisColor.colorAxisLine,
        },
      },
      splitLine: {
        show: props.showFullScreen,
      },
      axisLabel: {
        color: axisColor.colorAxisLabel,
      },
      minInterval: 1,
    },
    series: seriesConfig.value,
  }
  chart.value?.setOption(option)
}
</script>

<style lang="scss">
.polyline-chart-tooltip {
  min-width: 120px;
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
  .x-value {
    margin-bottom: 4px;
  }
  .tooltip-data-item {
    display: flex;
    justify-content: space-between;
    .badge {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: #bbb;
    }
    .num {
      padding-left: 12px;
      font-weight: 500;
    }
  }
}
</style>
