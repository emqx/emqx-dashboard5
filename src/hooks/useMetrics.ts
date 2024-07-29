import { accAdd } from '@/common/tools'
import useEchartResize from '@/hooks/useEchartResize'
import { Metrics } from '@/types/common'
import { BarSeriesOption, ECharts, EChartsOption, PieSeriesOption } from 'echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import * as echarts from 'echarts/lib/echarts'
import moment from 'moment'
import useI18nTl from './useI18nTl'

export const enum MetricType {
  Green,
  Blue,
  Red,
  Gray,
}

export type TypeMapData = Array<{ type: MetricType; title: string; contains: Array<string> }>

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

// Chart Hooks
const useChart = (): {
  initChart: (chartId: string) => ECharts
} => {
  const { addListener } = useEchartResize()
  const initChart = (chartId: string) => {
    const el = document.getElementById(chartId)
    if (!el) {
      return
    }
    const chartInstance = echarts.init(el, null, {
      renderer: 'canvas',
      useDirtyRect: false,
    })
    addListener(chartInstance as ECharts)
    return chartInstance
  }

  return {
    initChart,
  }
}

// Pie Chart
export const usePieChart = (): {
  updatePieData: (chartId: string, data: Array<PieDataItem>) => void
} => {
  const { initChart } = useChart()
  const chartInstances = new Map<string, ECharts>()

  const getChartOpts = (chartData: PieConfData): EChartsOption => ({
    tooltip: {
      trigger: 'item',
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

  const updatePieData = (chartId: string, data: Array<PieDataItem>) => {
    let currChartInstance = chartInstances.get(chartId)
    if (!currChartInstance) {
      currChartInstance = initChart(chartId)
      chartInstances.set(chartId, currChartInstance)
    }
    currChartInstance?.setOption(getChartOpts(getDataForChart(data)))
  }
  return {
    updatePieData,
  }
}

// Rate Chart
const NEWEST_GREEN = '#4af746'
export const useRateChart = (): {
  updateBarData: (chartID: string, xData: Array<string>, yData: Array<number>) => void
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

  const { initChart } = useChart()
  const updateBarData = (chartId: string, xData: Array<string>, yData: Array<number>) => {
    if (!chartInstance) {
      chartInstance = initChart(chartId)
    }
    chartInstance?.setOption(getChartOpts(xData, yData))
  }

  return {
    updateBarData,
  }
}

type RateData = {
  x: Array<string>
  y: Array<number>
}
export interface TypeMetricDataItem {
  type: MetricType
  title: string
  count?: number
  detail: Array<{
    value: number
    desc?: string
    label: string
  }>
}
type TextMap = Record<string, { label: string; desc?: string }>
export const useChartDataUtils = (): {
  generatePieData: (metrics: Metrics, typeMapData: TypeMapData) => Array<PieDataItem>
  createEmptyRateData: (length: number) => RateData
  addRateDataItem: (rate: number, rateData: RateData, dataLen: number) => RateData
  generateMetricTypeData: (
    metrics: Metrics,
    typeMapData: TypeMapData,
    textMap: TextMap,
  ) => Array<TypeMetricDataItem>
  generateEmptyMetricTypeData: (typeMapData: TypeMapData) => Array<TypeMetricDataItem>
} => {
  /* TYPE */
  const getMetricItemLabel = (key: string, textMap: TextMap) => textMap[key]?.label || key
  const getMetricItemDesc = (key: string, textMap: TextMap) => textMap[key]?.desc || ''
  const generateMetricTypeData = (metrics: Metrics, typeMapData: TypeMapData, textMap: TextMap) => {
    return typeMapData.reduce((arr: Array<TypeMetricDataItem>, { type: key, ...value }) => {
      if (!value) {
        return arr
      }
      const { title, contains: values } = value
      let typeCount = 0
      const typeList = values.reduce((ret, key) => {
        const item = {
          value: metrics[key],
          label: getMetricItemLabel(key, textMap),
          desc: getMetricItemDesc(key, textMap),
        }
        typeCount = accAdd(typeCount, metrics[key])
        ret.push(item)
        return ret
      }, [] as Array<{ value: number; label: string; desc?: string }>)
      arr.push({ title, count: typeCount, detail: typeList, type: Number(key) as MetricType })
      return arr
    }, [] as Array<TypeMetricDataItem>)
  }
  const generateEmptyMetricTypeData = (typeMapData: TypeMapData): Array<TypeMetricDataItem> => {
    return typeMapData.reduce((arr: Array<TypeMetricDataItem>, { type: key, ...value }) => {
      if (!value) {
        return arr
      }
      const { title } = value
      arr.push({
        title,
        count: undefined,
        detail: [],
        type: Number(key) as MetricType,
      })
      return arr
    }, [] as Array<TypeMetricDataItem>)
  }

  /* PIE */
  const generatePieData = (metrics: Metrics, typeMapData: TypeMapData): Array<PieDataItem> => {
    return typeMapData.reduce((arr: Array<PieDataItem>, { type: key, ...dataItem }) => {
      if (!dataItem) {
        return arr
      }
      const { title, contains: values } = dataItem
      const value = values.reduce((sum, item) => accAdd(sum, metrics[item] || 0), 0)
      return [...arr, { type: Number(key) as MetricType, name: title, value }]
    }, [] as Array<PieDataItem>)
  }
  /* RATE */
  const createEmptyArray = (length: number) => new Array(length).fill(undefined)
  const createEmptyRateData = (length: number) => ({
    x: createEmptyArray(length),
    y: createEmptyArray(length),
  })
  const getNow = () => moment().format('HH:mm:ss')
  const addRateDataItem = (rate: number, rateData: RateData, dataLen: number) => {
    rateData.x.push(getNow())
    rateData.y.push(rate)
    if (rateData.x.length >= dataLen) {
      rateData.x.shift()
      rateData.y.shift()
    }
    return rateData
  }
  return {
    generatePieData,
    createEmptyRateData,
    addRateDataItem,
    generateMetricTypeData,
    generateEmptyMetricTypeData,
  }
}

interface Rate {
  unitKey: string
  current: string
  right1: string
  right2: string
}
export const useBridgeMetrics = (): {
  egressTypeMetricsMap: TypeMapData
  ingressTypeMetricsMap: TypeMapData
  textMap: Record<string, { label: string; desc?: string }>
  rateData: Rate
} => {
  const { t, tl } = useI18nTl('RuleEngine')
  const egressTypeMetricsMap = [
    { type: MetricType.Green, title: tl('success'), contains: ['success'] },
    { type: MetricType.Blue, title: tl('processing'), contains: ['queuing', 'inflight'] },
    { type: MetricType.Red, title: t('Base.failed'), contains: ['failed'] },
    {
      type: MetricType.Gray,
      title: tl('dropped'),
      contains: [
        'dropped.expired',
        'dropped.queue_full',
        'dropped.resource_not_found',
        'dropped.resource_stopped',
        'dropped.other',
      ],
    },
  ]
  const ingressTypeMetricsMap = [
    { type: MetricType.Green, title: tl('received'), contains: ['received'] },
  ]
  const textMap = {
    matched: { label: tl('matched'), desc: tl('bridgeMatchedDesc') },
    inflight: { label: tl('sentInflight'), desc: tl('sentInflightDesc') },
    dropped: { label: tl('dropped'), desc: tl('droppedDesc') },
    'dropped.expired': { label: tl('droppedExpired'), desc: tl('droppedExpiredDesc') },
    'dropped.queue_full': { label: tl('droppedQueueFull'), desc: tl('droppedQueueFullDesc') },
    'dropped.resource_stopped': {
      label: tl('droppedResourceStopped'),
      desc: tl('droppedResourceStoppedDesc'),
    },
    'dropped.resource_not_found': {
      label: tl('droppedResourceNotFound'),
      desc: tl('droppedResourceNotFoundDesc'),
    },
    'dropped.other': {
      label: tl('droppedOther'),
      desc: tl('droppedOtherDesc'),
    },
    queuing: { label: tl('queuing'), desc: tl('queuingDesc') },
    retried: { label: tl('retried'), desc: tl('retriedDesc') },
    received: { label: tl('received'), desc: tl('receivedDesc') },
    rate: { label: t('Base.rateNow'), desc: tl('rateBarDesc') },
    rate_max: { label: t('Base.rateMax') },
    rate_last5m: { label: t('Base.rateLast5M') },
  }

  const rateData = {
    unitKey: 'RuleEngine.rateUnit',
    current: 'rate',
    right1: 'rate_last5m',
    right2: 'rate_max',
  }
  return {
    egressTypeMetricsMap,
    ingressTypeMetricsMap,
    textMap,
    rateData,
  }
}

export const useAuthMetrics = (): {
  authnTypeMetricsMap: TypeMapData
  authzTypeMetricsMap: TypeMapData
  authnTextMap: Record<string, { label: string; desc?: string }>
  authzTextMap: Record<string, { label: string; desc?: string }>
  rateData: Rate
} => {
  const { t, tl } = useI18nTl('Auth')
  const authnTypeMetricsMap = [
    { type: MetricType.Green, title: t('Base.allow'), contains: ['success'] },
    { type: MetricType.Red, title: t('Base.deny'), contains: ['failed'] },
    { type: MetricType.Gray, title: t('Base.nomatch'), contains: ['nomatch'] },
  ]
  const authzTypeMetricsMap = [
    { type: MetricType.Green, title: t('Base.allow'), contains: ['allow'] },
    { type: MetricType.Red, title: t('Base.deny'), contains: ['deny'] },
    { type: MetricType.Gray, title: t('Base.nomatch'), contains: ['nomatch'] },
  ]
  const authnTextMap = {
    total: { label: t('Base.total'), desc: tl('authnTotalDesc') },
    success: { label: t('Base.allow'), desc: tl('authnSuccessDesc') },
    failed: { label: t('Base.deny'), desc: tl('authnFailedDesc') },
    nomatch: { label: t('Base.nomatch'), desc: tl('authnNomatchDesc') },
    rate: { label: t('Base.rateNow'), desc: tl('authnRateBarDesc') },
    rate_max: { label: t('Base.rateMax') },
    rate_last5m: { label: t('Base.rateLast5M') },
  }
  const authzTextMap = {
    total: { label: t('Base.total'), desc: tl('authzTotalDesc') },
    allow: { label: t('Base.allow'), desc: tl('authzSuccessDesc') },
    deny: { label: t('Base.deny'), desc: tl('authzFailedDesc') },
    nomatch: { label: t('Base.nomatch'), desc: tl('authzNomatchDesc') },
    rate: { label: t('Base.rateNow'), desc: tl('authzRateBarDesc') },
    rate_max: { label: t('Base.rateMax') },
    rate_last5m: { label: t('Base.rateLast5M') },
  }

  const rateData = {
    unitKey: 'Auth.rateUnit',
    current: 'rate',
    right1: 'rate_last5m',
    right2: 'rate_max',
  }
  return {
    authnTypeMetricsMap,
    authzTypeMetricsMap,
    authnTextMap,
    authzTextMap,
    rateData,
  }
}

export const useRuleMetrics = (): {
  ruleTypeMetricsMap: TypeMapData
  actionTypeMetricsMap: TypeMapData
  textMap: Record<string, { label: string; desc?: string }>
  rateData: Rate
} => {
  const { t, tl } = useI18nTl('RuleEngine')
  const ruleTypeMetricsMap = [
    { type: MetricType.Green, title: tl('passed'), contains: ['passed'] },
    { type: MetricType.Gray, title: tl('failedNoResult'), contains: ['failed.no_result'] },
    { type: MetricType.Red, title: t('Base.failed'), contains: ['failed.exception'] },
  ]
  const actionTypeMetricsMap = [
    { type: MetricType.Green, title: tl('actionsSuccess'), contains: ['actions.success'] },
    { type: MetricType.Red, title: tl('actionsFailed'), contains: ['actions.failed'] },
  ]
  const textMap = {
    matched: { label: tl('ruleMatched'), desc: tl('bridgeMatchedDesc') },
    passed: { label: tl('passed'), desc: tl('passedDesc') },
    'actions.total': { label: tl('actionsTotal'), desc: tl('actionsTotalDesc') },
    'failed.exception': { label: tl('failedException'), desc: tl('failedExceptionDesc') },
    'failed.no_result': { label: tl('failedNoResult'), desc: tl('failedNoResultDesc') },
    'actions.success': { label: tl('actionsSuccess'), desc: tl('actionsSuccessDesc') },
    'matched.rate': { label: t('Base.rateNow'), desc: tl('ruleRateBarDesc') },
    'matched.rate.last5m': { label: t('Base.rateLast5M') },
    'matched.rate.max': { label: t('Base.rateMax') },
  }

  const rateData = {
    unitKey: 'RuleEngine.rateUnit',
    current: 'matched.rate',
    right1: 'matched.rate.last5m',
    right2: 'matched.rate.max',
  }
  return {
    ruleTypeMetricsMap,
    actionTypeMetricsMap,
    textMap,
    rateData,
  }
}

export const useExHooksMetrics = (): {
  exHooksTypeMetricsMap: TypeMapData
  textMap: Record<string, { label: string; desc?: string }>
  rateData: Rate
} => {
  const { t, tl } = useI18nTl('Exhook')
  const exHooksTypeMetricsMap = [
    { type: MetricType.Green, title: t('Base.success'), contains: ['succeed'] },
    { type: MetricType.Red, title: t('Base.failed'), contains: ['failed'] },
  ]
  const textMap = {
    rate: { label: t('Base.rateNow'), desc: tl('rateBarDesc') },
    max_rate: { label: t('Base.rateMax') },
  }

  const rateData = {
    unitKey: 'Exhook.rateUnit',
    current: 'rate',
    right1: '',
    right2: 'max_rate',
  }
  return {
    exHooksTypeMetricsMap,
    textMap,
    rateData,
  }
}
