<template>
  <div class="nodes app-wrapper">
    <h2>{{ tl('nodeList') }}</h2>
    <el-table :data="nodes" v-loading.lock="nodesLockTable">
      <el-table-column prop="node" :label="tl('nodeName')">
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
      <el-table-column min-width="100" prop="uptime" :label="tl('uptime')">
        <template #default="{ row }">
          {{ getDuration(row.uptime) }}
        </template>
      </el-table-column>
      <el-table-column width="120" prop="version" :label="tl('version')"> </el-table-column>
      <el-table-column :label="`Erlang ${tl('process')}`">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.process_used}/${row.process_available}`"
          >
            <el-progress
              :text-inside="true"
              :stroke-width="24"
              :percentage="calcPercentage(row.process_used, row.process_available)"
              :format="() => ''"
            >
              <span>{{ row.process_used }}</span>
            </el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="tl('memory')">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            effect="dark"
            :content="`${row.memory_used}/${row.memory_total}`"
          >
            <el-progress
              :text-inside="true"
              :stroke-width="24"
              :percentage="calcPercentage(row.memory_used, row.memory_total)"
              :format="() => ''"
            >
              <span>{{ row.memory_used }}</span>
            </el-progress>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="`CPU ${tl('load')}`">
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Nodes',
})
</script>

<script setup lang="ts">
import { loadNodes } from '@/api/common'
import { getDuration, calcPercentage } from '@/common/utils'
import { ref, onMounted, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NodeMsg } from '@/types/dashboard'

const { t } = useI18n()

let nodes: Ref<Array<NodeMsg>> = ref([])
let nodesLockTable: Ref<boolean> = ref(true)

const tl = function (key: string, collection = 'Dashboard') {
  return t(collection + '.' + key)
}
const loadAllNodes = async () => {
  nodes.value = (await loadNodes()) ?? []
  nodesLockTable.value = false
}
const caseInsensitiveCompare = (w: undefined | string, k: string): boolean | void => {
  return !!String.prototype.match.call(w, new RegExp(k, 'i'))
}

onMounted(() => {
  loadAllNodes()
})
</script>

<style lang="scss">
.nodes {
  .el-progress {
    width: 100%;
  }
}
</style>
