import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/tooltip'
import * as echarts from 'echarts/lib/echarts'

import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useI18nTl from './useI18nTl'

interface ChartDataItem {
  name: string
  value: number
}

type ChartData = Array<ChartDataItem>

type ItemStyle = {
  color: (params: { name: string } & unknown) => string
}

export const useDroppedCharts = () => {
  const { te, t } = useI18n()
  const lastKeyReg = /[^.]+$/
  const getLastKey = (metricKey: string) => lastKeyReg.exec(metricKey)?.[0] ?? metricKey
  const getTypeName = (metricKey: string) => {
    const lastKey = getLastKey(metricKey)
    const textKey = `Dashboard.dropped_${lastKey}`
    return te(textKey) ? t(textKey) : startCase(lastKey)
  }

  const sortData = (data: ChartData): ChartData => {
    return data.sort((a, b) => b.value - a.value)
  }

  const filterMetrics = (totalMetrics: Record<string, number>, reg: RegExp) => {
    const arr = Object.entries(pickBy(totalMetrics, (value, key) => reg.test(key))).reduce(
      (arr: Array<{ value: number; name: string }>, [key, value]) => {
        arr.push({ value, name: getTypeName(key) })
        return arr
      },
      [],
    )
    return sortData(arr)
  }

  const yAxisLabelWidth = 110
  const getBarChartOptions = (data: ChartData, itemStyle: ItemStyle) => {
    return {
      backgroundColor: 'transparent',
      animation: false,
      grid: {
        left: yAxisLabelWidth + 10,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'value',
        minInterval: 1,
      },
      yAxis: {
        type: 'category',
        data: data.map(({ name }) => name),
        axisLabel: {
          width: yAxisLabelWidth,
          overflow: 'break',
        },
      },
      series: [
        {
          name: 'Messages',
          type: 'bar',
          data: data.map(({ value }) => value),
          itemStyle,
        },
      ],
    }
  }

  const getPieChartOptions = (data: ChartData, itemStyle: ItemStyle) => {
    return {
      backgroundColor: 'transparent',
      animation: false,
      tooltip: {
        trigger: 'item',
        formatter: '{b} {d}%',
      },
      legend: {
        left: 'center',
        bottom: 0,
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data,
          itemStyle,
          label: {
            formatter: '{b} {d}%',
          },
        },
      ],
    }
  }

  const store = useStore()
  const chartTheme = computed(() => (store.state.theme === 'dark' ? 'dark' : 'light'))
  const initChart = (ele: HTMLElement) => {
    return echarts.init(ele, chartTheme.value)
  }

  return {
    getLastKey,
    getTypeName,
    filterMetrics,
    initChart,
    getBarChartOptions,
    getPieChartOptions,
  }
}

export enum MetricKey {
  MessagesDropped = 'messages.dropped',
  AwaitPubrelTimeout = 'messages.dropped.await_pubrel_timeout',
  NoSubscribers = 'messages.dropped.no_subscribers',
  QuotaExceeded = 'messages.dropped.quota_exceeded',
  ReceiveMaximum = 'messages.dropped.receive_maximum',

  DeliveryDropped = 'delivery.dropped',
  Qos0Msg = 'delivery.dropped.qos0_msg',
  Expired = 'delivery.dropped.expired',
  QueueFull = 'delivery.dropped.queue_full',
  NoLocal = 'delivery.dropped.no_local',
  TooLarge = 'delivery.dropped.too_large',
}

const COLOR_NONE = '#c2c8d1'

export const useMessageDroppedDetails = (totalMessageDropped: ComputedRef<number>) => {
  const metricsKeyReg = new RegExp(`^(${escapeRegExp(MetricKey.MessagesDropped)}\\.(.)+)`)

  const { getLastKey, getTypeName } = useDroppedCharts()
  const nameColor = new Map<string, string>([
    [getTypeName(MetricKey.AwaitPubrelTimeout) ?? '', '#fdafa6'],
    [getTypeName(MetricKey.NoSubscribers) ?? '', '#bac1cd'],
    [getTypeName(MetricKey.QuotaExceeded) ?? '', '#ffd78e'],
    [getTypeName(MetricKey.ReceiveMaximum) ?? '', '#7fd7b8'],
  ])

  const itemStyle = computed<ItemStyle>(() => ({
    color: function ({ name }: any) {
      return totalMessageDropped.value === 0 ? COLOR_NONE : (nameColor.get(name) ?? COLOR_NONE)
    },
  }))

  const { tl, te } = useI18nTl('Dashboard')

  const messageDroppedDesc = Object.values(MetricKey)
    .filter((value) => metricsKeyReg.test(value))
    .map((key) => {
      const lastKey = getLastKey(key)
      const descKey = `dropped_${lastKey}_desc`
      return {
        key,
        name: getTypeName(key),
        desc: te(descKey) ? tl(descKey) : '',
        impact: tl(`dropped_${lastKey}_impact`),
      }
    })

  return {
    metricsKeyReg,
    itemStyle,
    messageDroppedDesc,
  }
}

export const useDeliveryDroppedDetails = (totalDeliveryDropped: ComputedRef<number>) => {
  const metricsKeyReg = new RegExp(`^${escapeRegExp(MetricKey.DeliveryDropped)}\\.(.)+`)

  const { getLastKey, getTypeName } = useDroppedCharts()
  const nameColor = new Map<string, string>([
    [getTypeName(MetricKey.Qos0Msg) ?? '', '#469cf7'],
    [getTypeName(MetricKey.Expired) ?? '', '#ffd78e'],
    [getTypeName(MetricKey.QueueFull) ?? '', '#fdafa6'],
    [getTypeName(MetricKey.NoLocal) ?? '', '#c5a3e5'],
    [getTypeName(MetricKey.TooLarge) ?? '', '#7fd7b8'],
  ])

  const itemStyle = computed<ItemStyle>(() => ({
    color: function ({ name }: any) {
      return totalDeliveryDropped.value === 0 ? COLOR_NONE : (nameColor.get(name) ?? COLOR_NONE)
    },
  }))

  const { tl } = useI18nTl('Dashboard')
  const deliveryDroppedDesc = Object.values(MetricKey)
    .filter((value) => metricsKeyReg.test(value))
    .map((key) => {
      const lastKey = getLastKey(key)
      return {
        key,
        name: getTypeName(key),
        impact: tl(`dropped_${lastKey}_impact`),
      }
    })

  return {
    metricsKeyReg,
    itemStyle,
    deliveryDroppedDesc,
  }
}
