<template>
  <div ref="chartEl" class="simple-line"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SimpleLine",
});
</script>

<script lang="ts" setup>
import { defineProps, ref, reactive, watch, onMounted, Ref } from "vue";
import { useStore } from "vuex";
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/grid";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/markLine";
import "echarts/lib/component/markPoint";

const store = useStore();

const props = defineProps({
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
});

const chartEl = ref();
const chart: Ref<any> = ref(null);
const option: any = reactive({
  color: [props.color],
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
});

watch(
  () => props.value,
  () => {
    setSeriesConfig();
  }
);

watch(
  () => store.state.leftBarCollapse,
  () => {
    setTimeout(setSeriesConfig, 500);
  }
);

const setSeriesConfig = () => {
  const { color, type } = props;
  let Dom = chartEl.value;
  if (!Dom) return;
  echarts.dispose(Dom);
  chart.value = echarts.init(Dom);
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
  ];
  chart.value?.setOption(option);
};

onMounted(setSeriesConfig);
</script>
