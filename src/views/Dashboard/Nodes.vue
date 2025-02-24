<template>
  <div class="nodes app-wrapper">
    <div class="section-header">
      <div></div>
      <RefreshButton @click="loadAllNodes" />
    </div>
    <el-table :data="nodes" v-loading.lock="nodesLockTable" class="nodes-table">
      <el-table-column prop="node" :label="tl('name')" min-width="160">
        <template #default="{ row }">
          <router-link class="node-name" :to="`nodes/${row.node}`">{{ row.node }}</router-link>
        </template>
      </el-table-column>
      <el-table-column :label="tl('nodeStatus')" width="120">
        <template #default="{ row }">
          <span
            :class="[
              caseInsensitiveCompare(row.node_status, 'running') ? 'running-status' : 'stop-status',
            ]"
          >
            {{ caseInsensitiveCompare(row.node_status, 'running') ? tl('running') : tl('stopped') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="uptime" :label="tl('uptime')" min-width="160">
        <template #default="{ row }">
          {{ transMsNumToSimpleStr(row.uptime) }}
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="tl('version')" width="90"> </el-table-column>
      <el-table-column prop="connections" :label="t('Clients.connect')" min-width="120" />
      <el-table-column :label="`Erlang ${tl('process')}`" min-width="160">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.process_used}/${row.process_available}`"
          >
            <el-progress
              :stroke-width="20"
              :percentage="calcPercentage(row.process_used, row.process_available)"
              :format="() => row.process_used"
            >
            </el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="hasMemory" :label="tl('memory')" prop="memory_used" min-width="160">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.memory_used}/${row.memory_total}`"
          >
            <el-progress
              :stroke-width="20"
              :percentage="calcPercentage(row.memory_used, row.memory_total)"
              :format="() => row.memory_used"
            >
            </el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="tl('osCpuLoad')" min-width="120">
        <template #default="{ row }">
          <el-tooltip class="box-item" effect="dark" content="load1/load5/load15" placement="top"
            >{{ row.load1 }}/{{ row.load5 }}/{{ row.load15 }}
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Nodes',
})
</script>

<script setup lang="ts">
const { t, tl } = useI18nTl('Dashboard')

const { transMsNumToSimpleStr } = useDurationStr()

const { nodes, lockTable: nodesLockTable, hasMemory, loadData: loadAllNodes } = useClusterNodes()
</script>

<style lang="scss">
.nodes {
  .el-progress {
    width: 100%;
  }
}
</style>
