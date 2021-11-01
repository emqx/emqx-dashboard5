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

<script>
import PolylineChart from "./PolylineChart";
import Moment from "moment";
import { loadMetricsLog } from "@/api/common";

export default {
  name: "PolylineCards",

  components: {
    PolylineChart,
  },

  data() {
    return {
      dataTypeMap: {
        dropped: this.$t("Dashboard.messageDrop"),
        connection: this.$t("Dashboard.connection"),
        route: this.$t("Dashboard.topics"),
        subscriptions: this.$t("Dashboard.Subscription"),
        sent: this.$t("Dashboard.messageOut"),
        received: this.$t("Dashboard.messageIn"),
      },
      metricTitles: [],
      metricLog: {
        dropped: this.chartDataFill(32),
        connection: this.chartDataFill(32),
        route: this.chartDataFill(32),
        subscriptions: this.chartDataFill(32),
        sent: this.chartDataFill(32),
        received: this.chartDataFill(32),
      },
      dataTypeList: [
        "dropped",
        "connection",
        "route",
        "subscriptions",
        "sent",
        "received",
      ],
      timerMetrics: null,
    };
  },

  computed: {
    dataTypeFilter() {
      return Object.entries(this.dataTypeMap).map(([value, text]) => ({
        text,
        value,
      }));
    },
    chartColorList() {
      const getLineColors = (index) => {
        const totalColors = [
          "#22BB7A",
          "#4065E0",
          "#EEC90D",
          "#07E3E4",
          "#6ECAFA",
          "#AF79FF",
        ];
        // Swap the first and index positions
        const changedColorArr = [
          ...totalColors.splice(0, 1, totalColors[index]),
        ];
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
    },
  },

  created() {
    this.loadMetricsLogData();
    this.timerMetrics = setInterval(this.loadMetricsLogData, 60000);
  },

  beforeUnmount() {
    this.clearTimer();
  },

  methods: {
    chartDataFill(length) {
      return Array.from({ length }, () => ({ xData: [], yData: [] }));
    },
    _formatTime(time) {
      return Moment(time).format("HH:mm");
    },
    loadMetricsLogData() {
      let maxLen = 200;
      this.dataTypeList.forEach(async (typeName) => {
        const data = await loadMetricsLog(typeName).catch(() => {});
        this.metricLog[typeName] = this.chartDataFill(1);
        const currentData = this.metricLog[typeName][0];

        if (data) {
          data.forEach((item, key) => {
            if (key > maxLen) return;
            currentData.xData.push(this._formatTime(item.timestamp));
            currentData.yData.push(item.count);
          });
        }
      });
    },
    clearTimer() {
      this.timerMetrics && clearInterval(this.timerMetrics);
    },
  },
};
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
