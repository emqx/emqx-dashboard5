import useEchartResize from '@/hooks/useEchartResize'
import { ECharts, EChartsOption, PieSeriesOption, BarSeriesOption } from 'echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import * as echarts from 'echarts/lib/echarts'
import { Ref, ref } from 'vue'
import useI18nTl from './useI18nTl'

export const enum MetricType {
  Green,
  Blue,
  Red,
  Gray,
}

const BLUE = '#469cf7'

export const TYPE_COLOR_MAP: Record<MetricType, string> = {
  [MetricType.Green]: '#7fd7b8',
  [MetricType.Blue]: BLUE,
  [MetricType.Red]: '#fdafa6',
  [MetricType.Gray]: '#bac1cd',
}

const COLOR_NONE = '#c2c8d1'

export interface PieDataItem {
  name: string
  value: number
  type: MetricType
}

type PieConfData = PieSeriesOption['data']
type BarConfData = BarSeriesOption['data']

const useChart = (): {
  ChartEle: Ref<any>
  initChart: () => ECharts
} => {
  const ChartEle = ref()

  const { addListener } = useEchartResize()
  const initChart = () => {
    const chartInstance = echarts.init(ChartEle.value, null, {
      renderer: 'canvas',
      useDirtyRect: false,
    })
    addListener(chartInstance as ECharts)
    return chartInstance
  }

  return {
    ChartEle,
    initChart,
  }
}

export const usePieChart = (): {
  ChartEle: Ref<any>
  updateRingData: (data: Array<PieDataItem>) => void
} => {
  const { ChartEle, initChart } = useChart()
  let chartInstance: undefined | ECharts = undefined

  const getChartOpts = (chartData: PieConfData): EChartsOption => ({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
      // doesn't perfectly work with our tricks, disable it
      selectedMode: false,
    },
    series: [
      {
        type: 'pie',
        top: '-100%',
        radius: ['65%', '94%'],
        center: ['50%', '100%'],
        // adjust the start angle
        startAngle: 180,
        label: { show: false },
        data: chartData,
      },
    ],
  })

  const getTransparentPart = (data: Array<PieDataItem>) => {
    return {
      // make an record to fill the bottom 50%
      value: data.reduce((acc, cur) => acc + cur.value, 0),
      // stop the chart from rendering this piece
      itemStyle: { color: 'none', decal: { symbol: 'none' } },
      label: { show: false },
    }
  }

  const getNoneDataItem = ({ name, value }: PieDataItem) => ({
    name,
    value,
    itemStyle: { color: COLOR_NONE },
  })

  const getPieDataItem = ({ name, value, type }: PieDataItem) => ({
    name,
    value,
    itemStyle: { color: TYPE_COLOR_MAP[type] },
  })

  const getDataForChart = (data: Array<PieDataItem>): PieConfData => {
    if (data.every(({ value }) => !value)) {
      const emptyItem = getTransparentPart(data)
      // for put all part in top
      return [...data.map(getNoneDataItem), ...data.map(() => emptyItem)]
    }
    return [...data.map(getPieDataItem), getTransparentPart(data)]
  }

  const updateRingData = (data: Array<PieDataItem>) => {
    if (!chartInstance) {
      chartInstance = initChart()
    }
    chartInstance?.setOption(getChartOpts(getDataForChart(data)))
  }
  return {
    ChartEle,
    updateRingData,
  }
}

const NEWEST_GREEN = '#4af746'
export const useRateChart = (): {
  ChartEle: Ref<any>
  updateBarData: (xData: Array<string>, yData: Array<number>) => void
} => {
  const { tl } = useI18nTl('Base')

  let chartInstance: undefined | ECharts = undefined

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

  const getChartOpts = (xData: Array<string>, yData: Array<number>): EChartsOption => {
    const yDataProcessed: BarConfData = [...yData]
    const lastItem = yData[yData.length - 1]
    yDataProcessed[yDataProcessed.length - 1] = {
      value: lastItem,
      itemStyle: { color: NEWEST_GREEN },
    }
    return {
      color: [BLUE],
      grid: { left: 0, top: 0, right: 0, bottom: 0 },
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: { type: 'none' },
        formatter: (params: any) => {
          if (!params[0]) {
            return ''
          }
          const { axisValue, value } = params[0]
          return createTooltip(axisValue, value)
        },
      },
      xAxis: {
        type: 'category',
        data: xData,
        triggerEvent: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
      },
      yAxis: {
        type: 'value',
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
      },
      series: [{ type: 'bar', data: yDataProcessed, label: { show: false }, barWidth: 5 }],
    }
  }

  const { ChartEle, initChart } = useChart()
  const updateBarData = (xData: Array<string>, yData: Array<number>) => {
    if (!chartInstance) {
      chartInstance = initChart()
    }
    chartInstance?.setOption(getChartOpts(xData, yData))
  }

  return {
    ChartEle,
    updateBarData,
  }
}

export default () => {}
