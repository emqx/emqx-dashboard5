<template>
  <div :id="chartId" :style="{ height: height, width: '100%' }"></div>
</template>

<script>
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/grid";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";

import resizeChart from "@/mixins/resizeChart";

export default {
  name: "PolylineChart",

  mixins: [resizeChart],

  props: {
    chartId: {
      type: String,
      required: true,
    },
    yTitle: {
      type: Array,
      default: () => [""],
    },
    chartColors: {
      type: Array,
      default: () => [],
    },
    axisColor: {
      type: Object,
      default: () => ({
        colorAxisLine: "#757575",
        colorAxisLabel: "#757575",
      }),
    },
    chartData: {
      type: Array,
      default: () => [
        {
          xData: [],
          yData: [],
        },
      ],
    },
    height: {
      type: String,
      default: "190px",
    },
    // gridRight: {
    //   type: String,
    //   default: '5%',
    // },
    // gridLeft: {
    //   type: String,
    //   default: '2%',
    // },
    legendBottom: {
      type: String,
      default: "0px",
    },
  },

  data() {
    return {
      seriesConfig: [],
      chart: undefined,
    };
  },

  watch: {
    chartData: {
      deep: true,
      handler: "drawChart",
    },
  },

  mounted() {
    this.drawChart();
  },

  methods: {
    setSeriesConfig() {
      this.seriesConfig = [];
      for (let i = 0; i < this.yTitle.length; i += 1) {
        this.seriesConfig.push({
          name: this.yTitle[i],
          type: "line",
          smooth: true,
          symbolSize: 5,
          showSymbol: false,
          data: this.chartData[i].yData,
          step: false,
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color:
                  i % 6 === 0 && i !== 0
                    ? this.chartColors[6]
                    : this.chartColors[i % 6],
              },
              {
                offset: 1,
                color: "#fff",
              },
            ]),
            opacity: 0.2,
          },
        });
      }
    },
    drawChart() {
      this.setSeriesConfig();
      let Dom = document.getElementById(this.chartId);

      // echarts.dispose(Dom)
      this.chart = echarts.init(Dom);
      const option = {
        legend: {
          bottom: this.legendBottom,
          data: this.yTitle,
          icon: "circle",
          itemWidth: 6,
        },
        color: this.chartColors,
        tooltip: {
          trigger: "axis",
          confine: true,
        },
        grid: {
          left: this.gridLeft,
          right: this.gridRight,
          top: "3%",
          bottom: "12%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.chartData[0].xData,
          axisLine: {
            lineStyle: {
              color: this.axisColor.colorAxisLine,
            },
          },
          axisLabel: {
            showMinLabel: false,
            // textStyle: {
            color: this.axisColor.colorAxisLabel,
            // },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: this.axisColor.colorAxisLine,
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            // textStyle: {
            color: this.axisColor.colorAxisLabel,
            // },
          },
        },
        series: this.seriesConfig,
      };
      this.chart.setOption(option);
    },
    reDrawEchart() {
      // this.chart.dispose()
      echarts.dispose(this.chart);
      // this.chart = undefined
      this.drawChart();
    },
  },
};
</script>
