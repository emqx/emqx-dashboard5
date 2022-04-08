<template>
  <div class="nodes app-wrapper">
    <h2>{{ tl('nodeList') }}</h2>
    <el-table :data="nodes" v-loading.lock="nodesLockTable">
      <el-table-column prop="node" :label="tl('nodeName')"> </el-table-column>
      <el-table-column :label="tl('nodeStatus')">
        <template #default="{ row }">
          <el-badge
            is-dot
            :type="caseInsensitiveCompare(row.node_status, 'running') ? 'primary' : 'danger'"
          ></el-badge>
          <span
            >{{
              caseInsensitiveCompare(row.node_status, 'running')
                ? $t('Dashboard.running')
                : $t('Dashboard.stopped')
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="tl('version')"> </el-table-column>
      <el-table-column prop="uptime" :label="tl('uptime')">
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
              :percentage="calcPercentage(row.process_used, row.process_available)"
              :format="() => ''"
            ></el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="`CPU ${tl('load')}`">
        <template #default="{ row }"> {{ row.load1 }}/{{ row.load5 }}/{{ row.load15 }} </template>
      </el-table-column>
      <el-table-column :label="tl('memory')">
        <template #default="{ row }"> {{ row.memory_used }}/{{ row.memory_total }} </template>
      </el-table-column>
      <el-table-column :label="tl('maxFds')" prop="max_fds"></el-table-column>
    </el-table>

    <h2>{{ tl('nodeStatis') }}</h2>
    <el-table :data="stats" v-loading.lock="statsLockTable">
      <el-table-column prop="node" :label="tl('nodeName')"> </el-table-column>
      <el-table-column :label="tl('currentConnection')">
        <template #default="{ row }">
          {{ row['connections.count'] }}/{{ row['connections.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('topics')">
        <template #default="{ row }"> {{ row['topics.count'] }}/{{ row['topics.max'] }} </template>
      </el-table-column>
      <el-table-column :label="tl('retained')">
        <template #default="{ row }">
          {{ row['retained.count'] }}/{{ row['retained.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('session')">
        <template #default="{ row }">
          {{ row['sessions.count'] }}/{{ row['sessions.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('subscription')">
        <template #default="{ row }">
          {{ row['subscriptions.count'] }} / {{ row['subscriptions.max'] }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('shareSubscription')">
        <template #default="{ row }">
          {{ row['subscriptions.shared.count'] }}/{{ row['subscriptions.shared.max'] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Nodes',
})
</script>

<script setup lang="ts">
import { loadNodes, loadStats } from '@/api/common'
import { getDuration, calcPercentage } from '@/common/utils'
import { ref, onMounted, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NodeMsg, NodeStatisticalData } from '@/types/dashboard'

const { t } = useI18n()

let nodes: Ref<Array<NodeMsg>> = ref([])
let stats: Ref<Array<NodeStatisticalData>> = ref([])
let nodesLockTable: Ref<boolean> = ref(true)
let statsLockTable: Ref<boolean> = ref(true)

const tl = function (key: string, collection = 'Dashboard') {
  return t(collection + '.' + key)
}
const allNodes = async () => {
  nodes.value = (await loadNodes().catch(() => {})) ?? []
  nodesLockTable.value = false
}
const allStats = async () => {
  stats.value = (await loadStats().catch(() => {})) ?? []
  statsLockTable.value = false
}
const caseInsensitiveCompare = (w: undefined | string, k: string): boolean | void => {
  return !!String.prototype.match.call(w, new RegExp(k, 'i'))
}

onMounted(() => {
  allNodes()
  allStats()
})
</script>

<style lang="scss" scoped></style>
