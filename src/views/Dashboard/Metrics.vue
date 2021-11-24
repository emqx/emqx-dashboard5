<template>
  <div class="metrics app-wrapper">
    <div class="section-header">
      <div>
        <span>{{ tl("integration") }}</span>
        <div class="section-desc">
          {{ tl("integrationDesc") }}
        </div>
      </div>
    </div>
    <el-row v-loading="integrationLoading">
      <div class="int-item">
        <div>
          <img srcset="@/assets/img/prom@2x.png 2x" />
        </div>
        <div>
          <div class="part-header">Prometheus</div>
          <div class="part-desc">{{ tl("promDesc") }}</div>
          <div>
            <el-form
              :disabled="prometheusLoading"
              @keyup.enter="updatePrometheus()"
            >
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
                        <el-option :label="tl('second')" value="s"></el-option>
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
          <div class="part-desc">{{ tl("statsdDesc") }}</div>
          <div>
            <el-form :disabled="statsdLoading" @keyup.enter="updateStatsd()">
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
                        <el-option :label="tl('second')" value="s"></el-option>
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
        <span>{{ tl("dataList") }}</span>
        <div class="section-desc">{{ tl("packetStatisticsOfNodes") }}</div>
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
        <el-table-column prop="m" :label="tl('client')"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'delivery')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" label="Delivery"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'session')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" :label="tl('session')"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'packets')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" :label="tl('mqttPackages')">
        </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'messages')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" :label="tl('messageNumber')">
        </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="filterMetrics(metricsObj[currentNode], 'bytes')"
        v-loading.lock="lockTable"
      >
        <el-table-column prop="m" :label="tl('traffic')"> </el-table-column>
        <el-table-column prop="v" sortable> </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import {
  loadMetrics,
  getStatsd,
  getPrometheus,
  setStatsd,
  setPrometheus,
} from "@/api/common";
export default defineComponent({
  name: "Metrics",

  setup() {
    let metrics = reactive([]);
    let metricsObj = reactive({});
    let currentNode = ref("");
    let currentNodeIndex = ref(0);
    let lockTable = ref(true);
    let integrationLoading = ref(false);
    let prometheusLoading = ref(false);
    let statsdLoading = ref(false);
    let integrationData = reactive({
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

    const translate = function (key, collection = "Dashboard") {
      return this.$t(collection + "." + key);
    };

    const metricsData = async () => {
      let metricsArr = await loadMetrics().catch(() => {});
      lockTable.value = false;
      metricsArr.forEach((v) => {
        metrics.push(v);
      });
      if (metrics.length) {
        currentNode.value = metrics[0].node;
        metrics.forEach((v) => {
          metricsObj[v.node] = v;
        });
      }
    };

    const loadIntegration = async function () {
      integrationLoading.value = true;
      let [statsRes, prometheusRes] = await Promise.allSettled([
        getStatsd(),
        getPrometheus(),
      ]).catch(() => {});

      if (statsRes?.status == "fulfilled") {
        integrationData.statsd = transformIntegrationData(statsRes.value);
        prometheusLoading.value = false;
      } else {
        //nothint
      }

      if (prometheusRes?.status == "fulfilled") {
        integrationData.prometheus = transformIntegrationData(
          prometheusRes.value
        );
        statsdLoading.value = false;
      } else {
        //nothing
      }

      integrationLoading.value = false;
    };

    const transformIntegrationData = (data) => {
      Object.keys(data).forEach((prop) => {
        let matching;
        switch (prop) {
          case "flush_time_interval":
          case "interval":
            matching =
              (typeof data[prop] === "string" &&
                data[prop].match(/(\d+)(\w)/)) ||
              (data[prop] instanceof Array &&
                data[prop].unshift(data[prop].join("")) &&
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
      let pendingData = Object.assign({}, integrationData.prometheus);
      Object.keys(pendingData).forEach((v) => {
        if (v === "interval" && pendingData[v] instanceof Array) {
          pendingData[v] = pendingData[v].join("");
        }
      });
      let res = await setPrometheus(pendingData).catch(() => {});
      if (res) {
        prometheusLoading.value = false;
        this.$message({
          type: "success",
          message: this.$t("Base.updateSuccess"),
        });
      } else {
        this.$message({
          type: "error",
          message: this.$t("Base.opErr"),
        });
        loadIntegration();
      }
    };

    const updateStatsd = async function () {
      statsdLoading.value = true;
      let pendingData = Object.assign({}, integrationData.statsd);
      Object.keys(pendingData).forEach((v) => {
        if (v === "flush_time_interval" && pendingData[v] instanceof Array) {
          pendingData[v] = pendingData[v].join("");
        }
      });
      let res = await setStatsd(pendingData).catch(() => {});
      if (res) {
        statsdLoading.value = false;
        this.$message({
          type: "success",
          message: this.$t("Base.updateSuccess"),
        });
      } else {
        this.$message({
          type: "error",
          message: this.$t("Base.opErr"),
        });
        loadIntegration();
      }
    };

    function filterMetrics(data, key) {
      let keys = [];
      Object.keys(data || []).forEach((v) => {
        if (v.startsWith(key)) {
          keys.push({ m: v.split(".").slice(1).join("."), v: data[v] });
        }
      });
      return keys;
    }

    const changeNode = (n) => {
      this.currentNode = n;
    };

    onMounted(() => {
      metricsData();
      loadIntegration();
    });

    return {
      tl: translate,
      metrics,
      metricsObj,
      currentNode,
      lockTable,
      changeNode,
      currentNodeIndex,
      filterMetrics,
      integrationData,
      integrationLoading,
      prometheusLoading,
      statsdLoading,
      updatePrometheus,
      updateStatsd,
    };
  },
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
