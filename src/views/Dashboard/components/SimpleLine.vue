<template>
  <div ref="chart" class="simple-line"></div>
</template>

<script>
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/grid";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/markLine";
import "echarts/lib/component/markPoint";

import resizeChart from "@/mixins/resizeChart";

export default {
  name: "SimpleLine",

  mixins: [resizeChart],

  props: {
    value: {
      type: Object,
      default: () => ({ x: [], y: [] }),
      required: false,
    },
    color: {
      type: String,
      default: "#975fe4",
    },
    type: {
      type: String,
      default: "line",
    },
  },

  data() {
    return {
      chart: null,
      option: {
        color: [this.color],
        grid: {
          x: 0, // 默认是80px
          y: 0, // 默认是60px
          x2: 0, // 默认80px
          y2: 0, // 默认60px
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
          data: this.value.x,
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
          type: "value",
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
      },
    };
  },

  watch: {
    value: {
      deep: true,
      handler: "setSeriesConfig",
    },
    "$store.state.leftBarCollapse": function () {
      setTimeout(this.setSeriesConfig, 500);
    },
  },
  mounted() {
    this.setSeriesConfig();
  },
  methods: {
    setSeriesConfig() {
      const { color } = this;
      const { type } = this;
      let Dom = this.$refs.chart;
      if (!Dom) return;
      echarts.dispose(Dom);
      this.chart = echarts.init(Dom);
      this.option.series = [
        {
          data: this.value.y,
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
      ];
      this.chart.setOption(this.option);
    },
  },
};
</script>
