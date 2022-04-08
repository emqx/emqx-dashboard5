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
import { defineProps, ref, watch, onMounted, PropType, Ref } from 'vue'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  yTitle: {
    type: Array,
    default: () => [''],
  },
  chartColors: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  axisColor: {
    type: Object,
    default: () => ({
      colorAxisLine: '#757575',
      colorAxisLabel: '#757575',
    }),
  },
  chartData: {
    type: Array as PropType<Array<{ xData: Array<string>; yData: Array<number> }>>,
    default: () => [
      {
        xData: [],
        yData: [],
      },
    ],
  },
  height: {
    type: String,
    default: '190px',
  },
  gridRight: {
    type: String,
    default: '5%',
  },
  gridLeft: {
    type: String,
    default: '2%',
  },
  legendBottom: {
    type: String,
    default: '0px',
  },
})

const seriesConfig: Ref<Array<any>> = ref([])
const chart: Ref<undefined | any> = shallowRef(undefined)

watch(
  () => props.chartData,
  () => {
    drawChart()
  },
)

onMounted(() => {
  drawChart()
})

const setSeriesConfig = () => {
  seriesConfig.value = []
  for (let i = 0; i < props.yTitle.length; i += 1) {
    seriesConfig.value.push({
      name: props.yTitle[i],
      type: 'line',
      smooth: true,
      symbolSize: 5,
      showSymbol: false,
      data: props.chartData[i].yData,
      step: false,
      lineStyle: {
        width: 2,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: i % 6 === 0 && i !== 0 ? props.chartColors[6] : props.chartColors[i % 6],
          },
          {
            offset: 1,
            color: '#fff',
          },
        ]),
        opacity: 0.2,
      },
    })
  }
}

const drawChart = () => {
  setSeriesConfig()
  let Dom = document.getElementById(props.chartId)

  if (!chart.value) {
    chart.value = echarts.init(Dom)
  }
  const option = {
    color: props.chartColors,
    grid: {
      left: props.gridLeft,
      right: props.gridRight,
      top: '5%',
      bottom: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.chartData[0].xData,
      axisLine: {
        lineStyle: {
          color: props.axisColor.colorAxisLine,
        },
      },
      axisLabel: {
        showMinLabel: false,
        color: props.axisColor.colorAxisLabel,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: props.axisColor.colorAxisLine,
        },
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: props.axisColor.colorAxisLabel,
      },
      minInterval: 1,
    },
    series: seriesConfig.value,
  }
  chart.value?.setOption(option)
}
</script>
