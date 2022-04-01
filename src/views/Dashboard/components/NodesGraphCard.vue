<template>
  <div class="graph-wrapper">
    <div class="graph-title">{{ $t('Dashboard.networkGraph') }}</div>
    <div class="graph-entity" ref="graph" v-loading.lock="infoLoading">
      <div class="nodes-graph-container">
        <NodesGraph :data="nodesGraphData" @change="selectNode" />
      </div>
      <!-- <div id="graph-entity"></div> -->
      <div class="node-detail">
        <div class="node-info" v-if="currentInfo">
          <div class="node-title">{{ currentInfo.node['node'] }}</div>
          <div>
            <el-row>
              <el-col :span="10">{{ tl('uptime') }}:</el-col>
              <el-col :span="14">{{ getDuration(currentInfo.node.uptime) }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">{{ tl('currentConnection') }}:</el-col>
              <el-col :span="14">{{ currentInfo.stats['connections.count'] }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">{{ tl('topics') }}:</el-col>
              <el-col :span="14">{{ currentInfo.stats['topics.count'] }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">{{ tl('Subscription') }}:</el-col>
              <el-col :span="14">{{ currentInfo.stats['subscriptions.count'] }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">Max Fds:</el-col>
              <el-col :span="14">{{ currentInfo.node['max_fds'] }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="10">CPU Load:</el-col>
              <el-col :span="14">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="load1/load5/load15"
                  placement="top-start"
                >
                  <span>
                    {{
                      currentInfo.node['load1'] +
                      '/' +
                      currentInfo.node['load5'] +
                      '/' +
                      currentInfo.node['load15']
                    }}
                  </span>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">{{ tl('erlangVMMemory') }}:</el-col>
              <el-col :span="14">
                <div class="progress-wrap">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="`${currentInfo?.node?.['memory_used']}\\${currentInfo?.node?.['memory_total']}`"
                    placement="top-start"
                  >
                    <el-progress
                      :stroke-width="14"
                      :format="() => {}"
                      :percentage="calcMemoryPercentage"
                      :color="getProgressColor(calcPercentage)"
                    ></el-progress>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NodesGraph',
})
</script>

<script setup lang="ts">
import { ref, onMounted, computed, Ref } from 'vue'
import { loadNodes, loadStats } from '@/api/common'
import { getDuration, calcPercentage, getProgressColor } from '@/common/utils'
import { NodeMsg, NodeStatisticalData } from '@/types/dashboard'
import { useI18n } from 'vue-i18n'
import NodesGraph from './NodesGraph.vue'

type CurrentInfo = { node: NodeMsg; stats: NodeStatisticalData }

const { t } = useI18n()

let nodes: Ref<Array<NodeMsg>> = ref([])
let stats: Ref<Array<NodeStatisticalData>> = ref([])
let graph: Ref<undefined | HTMLElement> = ref(undefined)
let currentInfo: Ref<CurrentInfo> = ref({ node: {}, stats: {} } as CurrentInfo)
let infoLoading: Ref<boolean> = ref(true)

const nodesGraphData = computed(() => ({
  nodes: nodes.value,
  stats: stats.value,
}))

let getNodes = async () => {
  let res: Array<NodeMsg> = await loadNodes().catch(() => [])
  if (res) {
    nodes.value = res
  } else {
    return Promise.reject()
  }
}

let getStats = async () => {
  let res = await loadStats().catch(() => {})
  if (res) {
    stats.value = res
  } else {
    return Promise.reject()
  }
}

const selectNode = (nodeName: string) => {
  const node = nodes.value.find(({ node }) => node === nodeName) || {}
  const statsItem = stats.value.find(({ node }) => node === nodeName) || {}
  currentInfo.value = { node, stats: statsItem } as CurrentInfo
}

const tl = function (key: string, collection = 'Dashboard') {
  return t(collection + '.' + key)
}

let calcMemoryPercentage = computed(() => {
  return calcPercentage(
    currentInfo.value.node['memory_used'],
    currentInfo.value.node['memory_total'],
  )
})

const selectFirstNode = () => {
  const nodeName = nodes.value[0].node
  selectNode(nodeName)
}

onMounted(async () => {
  try {
    await Promise.all([getNodes(), getStats()])
    selectFirstNode()
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.graph-title {
  padding: 10px 20px;
  font-size: 18px;
  font-weight: 700;
}
.graph-wrapper {
  display: flex;
  flex-direction: column;
}
.graph-entity {
  display: flex;
  flex-grow: 1;
  justify-content: space-evenly;
}

.nodes-graph-container {
  flex-grow: 1;
  height: 268px;
  padding: 20px 0 20px 20px;
}

.node-detail {
  width: 50%;
  display: flex;
  flex-direction: column;
  color: #1d1d1d;

  .node-title {
    font-size: 14px;
    margin-bottom: 20px;
    font-weight: 700;
    margin-left: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .node-info {
    margin: 20px;
    flex-grow: 1;
    padding: 10px;
    background: linear-gradient(33deg, #f8fdfd 0%, #f8faff 46%, #fbfaff 100%);
    overflow: hidden;
  }
  .el-row {
    line-height: 1.8;
    .el-col:first-child {
      color: #8d96a2;
      word-break: break-all;
      padding-right: 5px;
    }
  }

  .progress-wrap {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .el-progress {
    line-height: 1.8;
    flex-grow: 1;
  }
}
</style>
