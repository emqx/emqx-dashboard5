<template>
  <div class="graph-wrapper">
    <div class="graph-entity" ref="graph" v-loading.lock="infoLoading">
      <div class="nodes-graph-container">
        <span class="node-count">
          <img src="@/assets/img/node.png" width="12" height="12" alt="node" />
          {{ $t('Dashboard.node', { n: nodes.length }) }}
        </span>
        <NodesGraph :data="nodesGraphData" @change="selectNode" v-if="!infoLoading" />
      </div>
      <div class="node-detail">
        <div class="node-info" v-if="currentInfo">
          <div class="node-title">{{ tl('nodeData') }}</div>
          <div>
            <el-row :gutter="26">
              <el-col :span="14">
                <div class="node-item">
                  <label class="node-item-label">{{ tl('nodeName') }}: </label>
                  <span class="node-item-content">{{ currentInfo.node['node'] }}</span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('uptime') }}: </label>
                  <span class="node-item-content">{{ getDuration(currentInfo.node.uptime) }}</span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('currentConnection') }}: </label>
                  <span class="node-item-content">{{
                    currentInfo.stats['connections.count']
                  }}</span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('Subscription') }}: </label>
                  <span class="node-item-content">{{
                    currentInfo.stats['subscriptions.count']
                  }}</span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('topics') }}: </label>
                  <span class="node-item-content">{{ currentInfo.stats['topics.count'] }}</span>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="node-item">
                  <label class="node-item-label">{{ tl('nodeRole') }}: </label>
                  <span class="node-item-content">{{ currentInfo.node['role'] }}</span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('maxFds') }}: </label>
                  <span class="node-item-content">{{ currentInfo.node['max_fds'] }}</span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">CPU Load: </label>
                  <span class="node-item-content">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="load1/load5/load15"
                      placement="top"
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
                  </span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('version') }}: </label>
                  <span class="node-item-content">
                    <a :href="releaseNoteLink" target="_blank">
                      {{ currentInfo.node['version'] }}
                    </a>
                  </span>
                </div>
                <div
                  v-if="![0, '0'].includes(currentInfo?.node?.['memory_total'])"
                  class="node-item"
                >
                  <span class="node-item-label">{{ tl('memory') }}: </span>
                  <span class="node-item-content">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="`${currentInfo?.node?.['memory_used']}/${currentInfo?.node?.['memory_total']}`"
                      placement="top"
                    >
                      <el-progress
                        :stroke-width="14"
                        :format="() => ''"
                        :percentage="calcMemoryPercentage"
                        :color="getProgressColor(calcPercentage)"
                      >
                      </el-progress>
                    </el-tooltip>
                  </span>
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
import { ref, onMounted, computed, Ref, onUnmounted } from 'vue'
import { loadNodes, loadStats } from '@/api/common'
import { getDuration, calcPercentage, getProgressColor } from '@/common/utils'
import { NodeMsg, NodeStatisticalData } from '@/types/dashboard'
import { useI18n } from 'vue-i18n'
import NodesGraph from './NodesGraph.vue'

type CurrentInfo = { node: NodeMsg; stats: NodeStatisticalData }

const { t, locale } = useI18n()

let nodes: Ref<Array<NodeMsg>> = ref([])
let stats: Ref<Array<NodeStatisticalData>> = ref([])
let graph: Ref<undefined | HTMLElement> = ref(undefined)
let currentInfo: Ref<CurrentInfo> = ref({ node: {}, stats: {} } as CurrentInfo)
let infoLoading: Ref<boolean> = ref(true)
let timerData: undefined | number = undefined
const interval = ref(2000)

const nodesGraphData = computed(() => ({
  nodes: nodes.value,
  stats: stats.value,
}))

let getNodes = async () => {
  let res: Array<NodeMsg> = await loadNodes(true).catch(() => [])
  if (res) {
    nodes.value = res
  } else {
    return Promise.reject()
  }
}

let getStats = async () => {
  let res = await loadStats().catch(() => [])
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

const versionReg = /(?<version>\d\.\d+\.\d+)/
const getVersion = (version: string) => {
  if (!version) {
    return ''
  }
  const matchRes = version.match(versionReg)
  return matchRes && matchRes.groups?.version ? matchRes.groups?.version : ''
}

const getReleaseNoteLinkByVersion = (version: string) => {
  const lang = locale.value === 'zh' ? 'zh' : 'en'
  return ` https://www.emqx.com/${lang}/changelogs/broker/${version}`
}

const releaseNoteLink = computed(() =>
  getReleaseNoteLinkByVersion(getVersion(currentInfo.value?.node?.version)),
)

const selectFirstNode = () => {
  const nodeName = nodes.value[0].node
  selectNode(nodeName)
}

const loadData = async () => {
  try {
    await Promise.all([getNodes(), getStats()])
    selectFirstNode()
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const setInterval = () => {
  clearInterval(timerData)
  timerData = window.setInterval(() => {
    loadData()
  }, interval.value)
}

setInterval()

onUnmounted(() => {
  clearInterval(timerData)
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
  padding: 16px 0 4px;
  position: relative;
  .node-count {
    position: absolute;
    top: 14px;
    left: 12px;
    border-radius: 8px;
    padding: 6px 12px;
    color: var(--color-text-primary);
    background-color: var(--color-hover);
    display: flex;
    align-items: center;
    img {
      margin-right: 6px;
    }
  }
}

.node-detail {
  width: 66.66%;
  background: var(--color-bg-split);
  padding: 26px 26px 8px;
  .node-title {
    font-size: 16px;
    margin-bottom: 20px;
    color: var(--color-title-primary);
  }
  .node-item {
    margin: 18px 0;
    display: flex;
    .node-item-label {
      color: var(--color-text-secondary);
      margin-right: 12px;
    }
    .node-item-content {
      display: flex;
      align-items: center;
    }
    .el-progress {
      width: 90px;
    }
    .progress-wrap {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
