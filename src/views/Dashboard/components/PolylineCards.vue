<template>
  <div class="polyline-cards">
    <el-row>
      <template v-for="item in dataTypeFilter" :key="item.value">
        <el-col :span="8">
          <el-card shadow="never" class="polyline-card">
            <div class="card-title">{{ item.text }}</div>
            <polyline-chart
              :chart-id="`${item.value}-polyline`"
              :y-title="[item.text]"
              :chart-data="metricLog[item.value]"
              :chartColors="chartColorList[item.value]"
            ></polyline-chart>
          </el-card>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PolylineCards",
});
</script>

<script lang="ts" setup>
import PolylineChart from "./PolylineChart.vue";
import Moment from "moment";
import { loadMetricsLog } from "@/api/common";
import { ref, reactive, computed, onUnmounted, onMounted, Ref } from "vue";
import { useI18n } from "vue-i18n";

type ChartData = Array<{
  xData: Array<string>;
  yData: Array<number>;
}>;

const { t } = useI18n();

const chartDataFill = (length: number): ChartData => {
  return Array.from({ length }, () => ({ xData: [], yData: [] }));
};

const dataTypeMap = reactive({
  dropped: t("Dashboard.messageDrop"),
  connection: t("Dashboard.connection"),
  route: t("Dashboard.topics"),
  subscriptions: t("Dashboard.Subscription"),
  sent: t("Dashboard.messageOut"),
  received: t("Dashboard.messageIn"),
});
const metricLog: Record<string, ChartData> = reactive({
  dropped: chartDataFill(32),
  connection: chartDataFill(32),
  route: chartDataFill(32),
  subscriptions: chartDataFill(32),
  sent: chartDataFill(32),
  received: chartDataFill(32),
});
const dataTypeList = reactive([
  "dropped",
  "connection",
  "route",
  "subscriptions",
  "sent",
  "received",
]);
const timerMetrics: Ref<null | number> = ref(null);

const dataTypeFilter = computed(() => {
  return Object.entries(dataTypeMap).map(([value, text]) => ({
    text,
    value,
  }));
});
const chartColorList = computed(() => {
  const getLineColors = (index: number) => {
    const totalColors = [
      "#22BB7A",
      "#4065E0",
      "#EEC90D",
      "#07E3E4",
      "#6ECAFA",
      "#AF79FF",
    ];
    // Swap the first and index positions
    const changedColorArr = [...totalColors.splice(0, 1, totalColors[index])];
    totalColors.splice(index, 1, changedColorArr[0]);
    return totalColors;
  };
  return {
    dropped: getLineColors(0),
    connection: getLineColors(1),
    route: getLineColors(2),
    subscriptions: getLineColors(3),
    sent: getLineColors(4),
    received: getLineColors(5),
  };
});

const _formatTime = (time: number) => {
  return Moment(time).format("HH:mm");
};

const loadMetricsLogData = () => {
  let maxLen = 200;
  dataTypeList.forEach(async (typeName) => {
    let data = await loadMetricsLog(typeName).catch(() => {});
    metricLog[typeName] = chartDataFill(1);
    const currentData = metricLog[typeName][0];

    if (data) {
      if (data.length > maxLen) {
        data = data.slice(-maxLen);
      }
      data.forEach((item, key) => {
        if (key > maxLen) return;
        currentData.xData.push(_formatTime(item.timestamp));
        currentData.yData.push(item.count);
      });
    }
  });
};

const clearTimer = () => {
  timerMetrics.value && clearInterval(timerMetrics.value);
};

onMounted(() => {
  loadMetricsLogData();
  timerMetrics.value = window.setInterval(loadMetricsLogData, 60000);
});

onUnmounted(clearTimer);
</script>

<style lang="scss">
.polyline-cards {
  .big-card,
  .polyline-card {
    position: relative;
    margin: 10px;

    .card-title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
      margin: 2px 0 10px 6px;
    }
  }

  .polyline-card {
    height: 255px;
  }
}
</style>
