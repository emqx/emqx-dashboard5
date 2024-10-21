import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/tooltip'
import * as echarts from 'echarts/lib/echarts'
import { pick, startCase } from 'lodash'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

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
  const getTypeName = (metricKey: string) => {
    const lastKey = lastKeyReg.exec(metricKey)?.[0] ?? metricKey
    const textKey = `Dashboard.dropped_${lastKey}`
    return te(textKey) ? t(textKey) : startCase(lastKey)
  }

  const sortData = (data: ChartData): ChartData => {
    return data.sort((a, b) => b.value - a.value)
  }

  const filterMetrics = (totalMetrics: Record<string, number>, requiredKeys: Array<string>) => {
    const arr = Object.entries(pick(totalMetrics, requiredKeys)).reduce(
      (arr: Array<{ value: number; name: string }>, [key, value], index) => {
        arr.push({ value, name: getTypeName(key) })
        return arr
      },
      [],
    )
    return sortData(arr)
  }

  const getBarChartOptions = (data: ChartData, itemStyle: ItemStyle) => {
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
        data: data.map(({ name }) => name),
        axisLabel: {
          width: 70,
          overflow: 'break',
        },
      },
      series: [
        {
          type: 'bar',
          data: data.map(({ value }) => value),
          itemStyle,
        },
      ],
    }
  }

  const getPieChartOptions = (data: ChartData, itemStyle: ItemStyle) => {
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

  const store = useStore()
  const chartTheme = computed(() => (store.state.theme === 'dark' ? 'dark' : 'light'))
  const initChart = (ele: HTMLElement) => {
    return echarts.init(ele, chartTheme.value)
  }

  return {
    getTypeName,
    filterMetrics,
    initChart,
    getBarChartOptions,
    getPieChartOptions,
  }
}

export const enum MetricKey {
  MessagesDropped = 'messages.dropped',
  AwaitPubrelTimeout = 'messages.dropped.await_pubrel_timeout',
  NoSubscribers = 'messages.dropped.no_subscribers',
}
export const useMessageDroppedDetails = () => {
  const metricKeyArr = [MetricKey.AwaitPubrelTimeout, MetricKey.NoSubscribers]

  const defaultColor = '#bac1cd'

  const { getTypeName } = useDroppedCharts()
  const nameColor = new Map<string, string>([
    [getTypeName(MetricKey.AwaitPubrelTimeout) ?? '', '#ffd78e'],
    [getTypeName(MetricKey.NoSubscribers) ?? '', '#bac1cd'],
  ])

  const itemStyle: ItemStyle = {
    color: function ({ name }: any) {
      return nameColor.get(name) ?? defaultColor
    },
  }

  const messageDroppedDesc = [
    {
      name: getTypeName(MetricKey.AwaitPubrelTimeout),
      desc: 'TODO:TODO:TODO:TODO:',
      impact: 'TODO:TODO:TODO:TODO:',
    },
    {
      name: getTypeName(MetricKey.NoSubscribers),
      desc: 'TODO:TODO:TODO:TODO:',
      impact: 'TODO:TODO:TODO:TODO:',
    },
  ]

  return {
    metricKeyArr,
    itemStyle,
    messageDroppedDesc,
  }
}
