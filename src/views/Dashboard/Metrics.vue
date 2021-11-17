<template>
  <div class="metrics app-wrapper">
    <div class="section-header">
      <div>
        <span>{{ translate("integration") }}</span>
        <div class="section-desc">{{ translate("integrationDesc") }}</div>
      </div>
    </div>
    <el-row v-loading="integrationLoading">
      <div class="int-item">
        <div>
          <img srcset="@/assets/img/prom@2x.png 2x" />
        </div>
        <div>
          <div class="part-header">Prometheus</div>
          <div class="part-desc">{{ translate("promDesc") }}</div>
          <div>
            <el-form :disabled="prometheusLoading">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-input
                    size="small"
                    placeholder="Push gateway Server"
                    v-model="integrationData.prometheus.push_gateway_server"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  <el-input
                    size="small"
                    placeholder="Push Interval"
                    v-model="integrationData.prometheus.interval[0]"
                  >
                    <template #append>
                      <el-select
                        v-model="integrationData.prometheus.interval[1]"
                      >
                        <el-option
                          :label="translate('second')"
                          value="s"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="3">
                  <el-checkbox
                    border
                    size="small"
                    v-model="integrationData.prometheus.enable"
                  >
                    {{ $t("General.enabled") }}
                  </el-checkbox>
                </el-col>
                <el-col :span="3">
                  <el-button
                    size="small"
                    type="primary"
                    :loading="prometheusLoading"
                    @click="updatePrometheus()"
                    >{{ $t("Base.update") }}</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div class="int-item">
        <div>
          <img srcset="@/assets/img/statsd@2x.png 2x" />
        </div>
        <div>
          <div class="part-header">StatsD</div>
          <div class="part-desc">{{ translate("statsdDesc") }}</div>
          <div>
            <el-form :disabled="statsdLoading">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-input
                    size="small"
                    placeholder="server"
                    v-model="integrationData.statsd.server"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  <el-input
                    size="small"
                    placeholder="Flush Interval"
                    v-model="integrationData.statsd.flush_time_interval[0]"
                  >
                    <template #append>
                      <el-select
                        v-model="integrationData.statsd.flush_time_interval[1]"
                      >
                        <el-option
                          :label="translate('second')"
                          value="s"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="3">
                  <el-checkbox
                    border
                    size="small"
                    v-model="integrationData.statsd.enable"
                  >
                    {{ $t("General.enabled") }}
                  </el-checkbox>
                </el-col>
                <el-col :span="3">
                  <el-button
                    size="small"
                    type="primary"
                    :loading="statsdLoading"
                    @click="updateStatsd()"
                    >{{ $t("Base.update") }}</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </el-row>
    <div class="section-header">
      <div>
        <span>{{ translate("dataList") }}</span>
        <div class="section-desc">
          {{ translate("packetStatisticsOfNodes") }}
        </div>
      </div>
      <div class="section-addition">
        <emq-select
          v-model:value="currentNode"
          :field="{ options: metrics }"
          :field-name="{ label: 'node', value: 'node' }"
          @change="changeNode"
        ></emq-select>
      </div>
    </div>
    <el-row :gutter="20">
      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'client')"
        v-loading.lock="lockTable"
      >
        <el-table-column
          prop="m"
          :label="translate('client')"
        ></el-table-column>
        <el-table-column prop="v" sortable></el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'delivery')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" label="Delivery"></el-table-column>
        <el-table-column prop="v" sortable></el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'session')"
        v-loading.lock="lockTable"
      >
        <el-table-column
          prop="m"
          :label="translate('session')"
        ></el-table-column>
        <el-table-column prop="v" sortable></el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'packets')"
        v-loading.lock="lockTable"
      >
        <el-table-column
          prop="m"
          :label="translate('mqttPackages')"
        ></el-table-column>
        <el-table-column prop="v" sortable></el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'messages')"
        v-loading.lock="lockTable"
      >
        <el-table-column
          prop="m"
          :label="translate('messageNumber')"
        ></el-table-column>
        <el-table-column prop="v" sortable></el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'bytes')"
        v-loading.lock="lockTable"
      >
        <el-table-column
          prop="m"
          :label="translate('traffic')"
        ></el-table-column>
        <el-table-column prop="v" sortable></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Metrics",
});
</script>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  loadMetrics,
  getStatsd,
  getPrometheus,
  setStatsd,
  setPrometheus,
} from "@/api/common";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

interface MetricItem {
  [propName: string]: string | number;
}

interface IntegrationData {
  [propName: string]: boolean | string | Array<string>;
}

const { t } = useI18n();

let metrics: Array<MetricItem> = reactive([]);
let metricsObj: Record<string, MetricItem> = reactive({});
let currentNode = ref("");
let lockTable = ref(true);
let integrationLoading = ref(false);
let prometheusLoading = ref(false);
let statsdLoading = ref(false);
let integrationData: Record<string, IntegrationData> = reactive({
  statsd: {
    enable: false,
    flush_time_interval: "10s",
    sample_time_interval: "10s",
    server: "127.0.0.1:8125",
  },
  prometheus: {
    enable: false,
    interval: "15s",
    push_gateway_server: "http://127.0.0.1:9091",
  },
});

const translate = function (key: string, collection = "Dashboard") {
  return t(collection + "." + key);
};

const metricsData = async () => {
  let metricsArr: Array<MetricItem> = await loadMetrics().catch(() => {});
  lockTable.value = false;
  metricsArr.forEach((v) => {
    metrics.push(v);
  });

  if (metrics.length) {
    currentNode.value = metrics[0].node as string;
    metrics.forEach((v) => {
      metricsObj[v.node] = v;
    });
  }
};

const loadIntegration = async function () {
  integrationLoading.value = true;
  let [statsRes, prometheusRes] = (await Promise.allSettled([
    getStatsd(),
    getPrometheus(),
  ]).catch(() => {})) as Array<{ status: string; value: IntegrationData }>;
  if (statsRes?.status == "fulfilled") {
    integrationData.statsd = transformIntegrationData(statsRes.value);
    prometheusLoading.value = false;
  } else {
    //nothint
  }

  if (prometheusRes?.status == "fulfilled") {
    integrationData.prometheus = transformIntegrationData(prometheusRes.value);
    statsdLoading.value = false;
  } else {
    //nothing
  }

  integrationLoading.value = false;
};

const transformIntegrationData = (data: IntegrationData) => {
  Object.keys(data).forEach((prop) => {
    let matching: any;
    switch (prop) {
      case "flush_time_interval":
      case "interval":
        matching =
          (typeof data[prop] === "string" &&
            (data[prop] as string).match(/(\d+)(\w)/)) ||
          (data[prop] instanceof Array &&
            (data[prop] as Array<string>).unshift(
              (data[prop] as Array<string>).join("")
            ) &&
            data[prop]);
        data[prop] = [matching[1], matching[2]];
        break;
      default:
    }
  });
  return data;
};

const updatePrometheus = async function () {
  prometheusLoading.value = true;
  let pendingData: IntegrationData = Object.assign(
    {},
    integrationData.prometheus
  );
  Object.keys(pendingData).forEach((v) => {
    if (v === "interval" && pendingData[v] instanceof Array) {
      pendingData[v] = (pendingData[v] as Array<string>).join("");
    }
  });
  let res = await setPrometheus(pendingData).catch(() => {});
  if (res) {
    prometheusLoading.value = false;
    ElMessage({
      type: "success",
      message: t("Base.updateSuccess"),
    });
  } else {
    ElMessage({
      type: "error",
      message: t("Base.opErr"),
    });
    loadIntegration();
  }
};

const updateStatsd = async function () {
  statsdLoading.value = true;
  let pendingData: IntegrationData = Object.assign({}, integrationData.statsd);

  Object.keys(pendingData).forEach((v) => {
    if (v === "flush_time_interval" && pendingData[v] instanceof Array) {
      pendingData[v] = (pendingData[v] as Array<string>).join("");
    }
  });
  let res = await setStatsd(pendingData).catch(() => {});
  if (res) {
    statsdLoading.value = false;
    ElMessage({
      type: "success",
      message: t("Base.updateSuccess"),
    });
  } else {
    ElMessage({
      type: "error",
      message: t("Base.opErr"),
    });
    loadIntegration();
  }
};

function filterMetrics(data: MetricItem, key: string) {
  let keys: Array<{ m: string; v: number }> = [];
  Object.keys(data || []).forEach((v) => {
    if (v.startsWith(key)) {
      keys.push({ m: v.split(".").slice(1).join("."), v: data[v] as number });
    }
  });
  return keys;
}

const changeNode = (n: string) => {
  currentNode.value = n;
};

onMounted(() => {
  metricsData();
  loadIntegration();
});
</script>
<style lang="scss" scoped>
.el-row {
  margin: 40px 0;
}

.el-col {
  overflow: hidden;
}

.el-table:not(:first-child) {
  margin-top: 40px;
}

.int-item {
  display: flex;
  flex-grow: 1;

  & > :first-child {
    padding: 10px;
  }

  & > :last-child {
    flex-grow: 1;
    padding: 10px;
  }

  & .part-desc {
    padding: 5px 0;
  }
}

.el-input-group--append ::v-deep .el-input-group__append {
  width: 90px;
}
</style>
