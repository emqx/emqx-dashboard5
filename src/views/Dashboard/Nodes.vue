<template>
  <div class="nodes app-wrapper">
    <div class="section-header">{{ tl("nodeData") }}</div>
    <el-table :data="nodes" v-loading.lock="nodesLockTable">
      <el-table-column prop="node" :label="tl('nodeName')" sortable>
      </el-table-column>
      <el-table-column :label="tl('nodeStatus')" sortable>
        <template #default="{ row }">
          <el-badge
            is-dot
            :type="
              caseInsensitiveCompare(row.node_status, 'running')
                ? 'primary'
                : 'danger'
            "
          ></el-badge>
          <span
            >{{
              caseInsensitiveCompare(row.node_status, "running")
                ? $t("Dashboard.running")
                : $t("Dashboard.stopped")
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="tl('version')" sortable>
      </el-table-column>
      <el-table-column prop="uptime" :label="tl('uptime')" sortable>
        <template #default="{ row }">
          {{ getDuration(row.uptime) }}
        </template>
      </el-table-column>
      <el-table-column :label="`Erlang ${tl('process')}`">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.process_used}/${row.process_available}`"
          >
            <el-progress
              :stroke-width="16"
              :percentage="
                calcPercentage(row.process_used, row.process_available)
              "
              :format="() => {}"
            ></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="`CPU ${tl('load')}`" sortable>
        <template #default="{ row }">
          {{ row.load1 }}/{{ row.load5 }}/{{ row.load15 }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('memory')" sortable>
        <template #default="{ row }">
          {{ row.memory_used }}/{{ row.memory_total }}
        </template>
      </el-table-column>
      <el-table-column
        :label="tl('maxFds')"
        prop="max_fds"
        sortable
      ></el-table-column>
    </el-table>

    <div class="section-header">{{ tl("nodeStatis") }}</div>
    <el-table :data="stats" v-loading.lock="statsLockTable">
      <el-table-column prop="node" :label="tl('nodeName')" sortable>
      </el-table-column>
      <el-table-column :label="tl('currentConnection')" sortable>
        <template #default="{ row }">
          {{ row["connections.count"] }}/{{ row["connections.max"] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('topics')" sortable>
        <template #default="{ row }">
          {{ row["topics.count"] }}/{{ row["topics.max"] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('retained')" sortable>
        <template #default="{ row }">
          {{ row["retained.count"] }}/{{ row["retained.max"] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('session')" sortable>
        <template #default="{ row }">
          {{ row["sessions.count"] }}/{{ row["sessions.max"] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('subscription')" sortable>
        <template #default="{ row }">
          {{ row["subscriptions.count"] }}/{{ row["subscriptions.max"] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('shareSubscription')" sortable>
        <template #default="{ row }">
          {{ row["subscriptions.shared.count"] }}/{{
            row["subscriptions.shared.max"]
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Nodes",
});
</script>

<script setup lang="ts">
import { loadNodes, loadStats } from "@/api/common";
import { getDuration, calcPercentage } from "@/common/utils";
import { ref, onMounted, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { NodeMsg, NodeStatisticalData } from "@/types/dashboard";

const { t } = useI18n();

let nodes: Ref<Array<NodeMsg>> = ref([]);
let stats: Ref<Array<NodeStatisticalData>> = ref([]);
let nodesLockTable = ref(true);
let statsLockTable = ref(true);

const tl = function (key: string, collection = "Dashboard") {
  return t(collection + "." + key);
};
const allNodes = async () => {
  nodes.value = (await loadNodes().catch(() => {})) ?? [];
  nodesLockTable.value = false;
};
const allStats = async () => {
  stats.value = (await loadStats().catch(() => {})) ?? [];
  statsLockTable.value = false;
};
const caseInsensitiveCompare = (
  w: undefined | string,
  k: string
): boolean | void => {
  return !!String.prototype.match.call(w, new RegExp(k, "i"));
};

onMounted(() => {
  allNodes();
  allStats();
});
</script>

<style lang="scss" scoped></style>
