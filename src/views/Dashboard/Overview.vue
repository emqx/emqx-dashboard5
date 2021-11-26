<template>
  <div class="overview app-wrapper">
    <div class="basic-info">
      <el-row class="basic-graph">
        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t("Dashboard.currentMessageOutRate") }}
            </div>
            <div class="content">
              <span>{{ currentMetrics.sent }}</span>
              <span class="unit"
                >{{ $t("Dashboard.strip") }}/{{ $t("Dashboard.second") }}</span
              >

              <div class="flux-wrapper">
                <simple-line
                  :value="currentMetricsLogs.sent"
                  type="bar"
                  color="#34c388"
                ></simple-line>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t("Dashboard.currentMessageInRate") }}
            </div>

            <div class="content">
              <span>{{ currentMetrics.received }}</span>
              <span class="unit"
                >{{ $t("Dashboard.strip") }}/{{ $t("Dashboard.second") }}</span
              >

              <div class="flux-wrapper">
                <simple-line
                  v-model="currentMetricsLogs.received"
                  type="bar"
                ></simple-line>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t("Dashboard.subscriptionNumber") }}
            </div>

            <div class="content">
              <span>{{ currentMetrics.subscription }}</span>
              <div class="flux-wrapper">
                <simple-line
                  v-model="currentMetricsLogs.subscription"
                  color="#58afff"
                  type="bar"
                ></simple-line>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="never" class="app-card">
            <div class="app-card-title">
              {{ $t("Dashboard.connectionsTips") }}
            </div>

            <div class="content">
              <span>{{ _formatNumber(currentMetrics.connection) }}</span>
              <el-progress
                class="status-progress"
                :stroke-width="24"
                :percentage="licensePercentage"
                :format="() => ''"
                :color="getProgressColor(licensePercentage, '#2A78FFFF')"
              ></el-progress>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <nodes-graph class="nodes-graph"></nodes-graph>
    </div>
    <polyline-cards></polyline-cards>

    <div v-if="false" class="license-card">
      <div class="lisence-title">{{ $t("Dashboard.license") }}</div>

      <ul class="license-field">
        <li v-if="license.customer_type !== evaluation" class="item">
          <span class="key">{{ $t("Dashboard.customer") }}:</span>
          <span class="value">{{ license.customer }}</span>
        </li>

        <li class="item">
          <span class="key">
            {{ $t("Dashboard.numberOfConnectionLines") }}:
            {{ formatConnection }}
          </span>
          <div class="content">
            <el-progress
              :stroke-width="16"
              :format="() => ''"
              :percentage="licensePercentage"
              :color="getProgressColor(licensePercentage, '#00A890FF')"
            ></el-progress>
          </div>
        </li>
        <template v-if="license.customer_type !== evaluation">
          <li class="item">
            <span class="key">{{ $t("Dashboard.issuanceOfEmail") }}:</span>
            <span class="value">{{ license.email }}</span>
          </li>

          <li class="item">
            <span class="key">{{ $t("Dashboard.issuedAt") }}:</span>
            <span class="value broker">{{ license.issued_at }}</span>
          </li>

          <li class="item">
            <span class="key">{{ $t("Dashboard.expireAt") }}:</span>
            <span class="value broker">{{ license.expiry_at }}</span>
          </li>
        </template>
      </ul>

      <div class="license-card-footer">
        <div
          v-if="license.customer_type === evaluation"
          class="description"
          v-html="$t('Dashboard.licenseEvaluationTip')"
        ></div>
        <div
          v-else-if="license.expiry === true"
          class="description"
          v-html="$t('Dashboard.licenseExpiryTip')"
        ></div>
        <div v-else class="description">
          {{ $t("Dashboard.beforeTheCertificateExpires") }}
        </div>
        <div
          v-if="
            license.type === 'trial' &&
            license.customer_type !== evaluation &&
            license.expiry === false
          "
          class="oper"
        >
          <el-tag type="danger">{{ $t("Dashboard.trialEdition") }}</el-tag>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="licenseTipVisible"
      :close-on-click-modal="false"
      :title="$t('Base.warning')"
    >
      <div class="tip-content">
        <span
          v-if="!isLicenseExpiry"
          v-html="$t('Dashboard.licenseEvaluationTip')"
        ></span>
        <span v-else v-html="$t('Dashboard.licenseExpiryTip')"></span>
      </div>
      <div v-if="!isLicenseExpiry" class="tip-checkbox">
        <el-checkbox v-model="noprompt" @change="liceEvaTipShowChange">{{
          $t("Dashboard.notPromptAgain")
        }}</el-checkbox>
      </div>
      <template #footer>
        <div>
          <el-button
            type="primary"
            size="small"
            @click="licenseTipVisible = false"
            >{{ $t("Dashboard.konw") }}</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- <metrics-charts></metrics-charts> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Overview",
});
</script>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, Ref } from "vue";
import SimpleLine from "./components/SimpleLine";
import PolylineCards from "./components/PolylineCards";
import NodesGraph from "./components/NodesGraph.vue";
// import PercentageCards from './components/PercentageCards'
import Moment from "moment";
import { loadCurrentMetrics, loadLicenseInfo } from "@/api/common";
import { calcPercentage, getProgressColor } from "@/common/utils";

interface MetricData {
  x: Array<string>;
  y: Array<number>;
}

const evaluation: Ref<number> = ref(10);
const licenseTipVisible: Ref<boolean> = ref(false);
const isLicenseExpiry: Ref<boolean> = ref(false);
const noprompt: Ref<boolean> = ref(false);

let license: Record<string, number | boolean> = reactive({});
const currentMetricsLogs: Record<string, MetricData> = reactive({
  received: {
    x: Array(32).fill("N/A"),
    y: Array(32).fill(0),
  },
  sent: {
    x: Array(32).fill("N/A"),
    y: Array(32).fill(0),
  },
  subscription: {
    x: Array(32).fill("N/A"),
    y: Array(32).fill(0),
  },
});
const currentMetrics: Ref<Record<string, number>> = ref({
  node: 0, // 节点数
  received: 0, // 消息 in 速率
  sent: 0, // 消息 out 速率
  subscription: 0, // 订阅数
  connection: 0, // 连接数
});
let timerData: undefined | number = undefined;

const licensePercentage = computed(() => {
  const { connection } = currentMetrics.value;
  const { max_connections } = license;
  return calcPercentage(connection, max_connections);
});

const formatConnection = computed(() => {
  const { connection } = currentMetrics.value;
  const { max_connections } = license;
  return `${_formatNumber(connection)} / ${_formatNumber(
    max_connections as number
  )}`;
});

const liceEvaTipShowChange = (val: boolean) => {
  if (val) {
    localStorage.setItem("licenseTipVisible", String(false));
  }
};
const _formatNumber = (num: number) => {
  let number = String(parseInt(num.toString()));
  return number.replace(/(\d{1,3})(?=(\d{3})+($|\.))/g, "$1,");
};

const loadLicenseData = async () => {
  let res = await loadLicenseInfo().catch(() => {});
  if (!res) {
    return;
  }
  license = res;
  // evaluation 许可证
  if (
    license.customer_type === evaluation.value &&
    localStorage.getItem("licenseTipVisible") !== "false"
  ) {
    licenseTipVisible.value = true;
    isLicenseExpiry.value = false;
  }
  // 证书过期
  if (license.expiry === true) {
    licenseTipVisible.value = true;
    isLicenseExpiry.value = true;
  }
};
const loadData = async () => {
  const state = await loadCurrentMetrics().catch(() => {});
  if (!state) {
    return;
  }
  currentMetrics.value = state;
  setCurrentMetricsLogsRealtime(state);
};

const getNow = () => {
  return Moment().format("HH:mm:ss");
};
const setCurrentMetricsLogsRealtime = (state: Record<string, number> = {}) => {
  ["received", "sent", "subscription"].forEach((key) => {
    currentMetricsLogs[key] = currentMetricsLogs[key] || {
      x: [],
      y: [],
    };
    const currentValue = state[key] || 0;
    currentMetricsLogs[key].x.push(getNow());
    currentMetricsLogs[key].y.push(currentValue);
    if (currentMetricsLogs[key].x.length >= 16) {
      currentMetricsLogs[key].x.shift();
      currentMetricsLogs[key].y.shift();
    }
  });
};

loadData();
// loadLicenseData()
// clearInterval(this.timerData)
timerData = setInterval(() => {
  loadData();
}, 30 * 1000);

onUnmounted(() => {
  clearInterval(timerData);
});
</script>

<style lang="scss" scoped>
.basic-info {
  display: flex;
  .basic-graph,
  .nodes-graph {
    overflow: hidden;
    width: 50%;
    // display: inline-grid;
  }
  .nodes-graph {
    margin: 10px;
    border: 1px solid #ececef;
  }
}
.app-card {
  margin: 10px;

  .app-card-title {
    font-size: 14px;
    margin-bottom: 15px;
    color: rgba(0, 0, 0, 0.4);
  }

  .content {
    color: rgba(0, 0, 0, 0.85);
    min-height: 90px;
    font-size: 30px;
    position: relative;

    .unit {
      font-size: 14px;
      margin-left: 2px;
    }

    .flux-wrapper {
      width: 100%;
      box-sizing: border-box;

      .simple-line {
        box-sizing: border-box;
        height: 32px;
      }
    }

    .charts {
      margin-top: 6px;
    }
  }
}

.license-card {
  margin: 30px 10px 10px;

  .license-card-footer {
    display: flex;
    margin-top: 12px;

    .description {
      font-size: 12px;
      color: #b2b2b2;
      max-width: 50%;
    }

    .oper {
      width: 100px;
      text-align: center;
      font-size: 14px;
      .el-tag {
        display: block;
      }
    }
  }
}

.license-field {
  list-style-type: none;
  padding-left: 0;

  .item {
    font-size: 14px;
    color: #666;
    padding: 6px 0;

    .key {
      margin-right: 24px;
    }

    .value {
      color: #333;

      &.broker {
        margin-top: 6px;
      }
    }

    .content {
      margin-top: 15px;
    }
  }
}

.lisence-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 700;
}

.tip-checkbox {
  margin-top: 20px;
  .el-checkbox {
    color: #aaa;
  }
}
</style>
