<template>
  <div class="graph-wrapper">
    <div class="graph-entity" ref="graph" v-loading.lock="infoLoading">
      <div class="nodes-graph-container">
        <span class="node-count">
          <img src="@/assets/img/node.png" width="12" height="12" alt="node" />
          {{ $t('Dashboard.node', { n: nodes.length }) }}
        </span>
        <NodesGraph v-model="currentNodeName" :nodes="nodes" v-if="!infoLoading" />
      </div>
      <div class="node-detail">
        <div class="node-info" v-if="currentInfo">
          <div class="node-card-header">
            <div class="node-title">{{ tl('nodeData') }}</div>
            <router-link class="nodes-link" :to="{ name: 'nodes' }">
              {{ tl('viewNodes') }}<el-icon><Right /></el-icon>
            </router-link>
          </div>
          <div class="node-card-body">
            <el-row :gutter="26">
              <el-col :span="14">
                <div class="node-item">
                  <label class="node-item-label">{{ tl('nodeName') }}: </label>
                  <span class="node-item-content">{{ currentInfo.node['node'] }}</span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('uptime') }}: </label>
                  <span class="node-item-content">
                    {{ transMsNumToSimpleStr(currentInfo.node.uptime) }}
                  </span>
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
                  <label class="node-item-label">{{ tl('version') }}: </label>
                  <span class="node-item-content">
                    <a :href="releaseNoteLink" target="_blank">
                      {{ currentInfo.node['version'] }} ({{ $t(edition.title) }})
                    </a>
                  </span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('maxFds') }}: </label>
                  <span class="node-item-content">{{ currentInfo.node['max_fds'] }}</span>
                </div>
                <div class="node-item">
                  <label class="node-item-label">{{ tl('osCpuLoad') }}: </label>
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
import useI18nTl from '@/hooks/useI18nTl'

export default defineComponent({
  name: 'NodesGraph',
})
</script>

<script setup lang="ts">
import { loadStats } from '@/api/common'
import { IS_ENTERPRISE } from '@/common/constants'
import { calcPercentage } from '@/common/tools'
import useDurationStr from '@/hooks/useDurationStr'
import useSyncPolling from '@/hooks/useSyncPolling'
import useClusterNodes from '@/hooks/useClusterNodes'
import { NodeInfo, NodeStatisticalData } from '@/types/dashboard'
import { Right } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import NodesGraph from './NodesGraph.vue'
import useEditionConfigs from '@/hooks/useEditionConfigs'

type CurrentInfo = { node: NodeInfo; stats: NodeStatisticalData }

const { edition } = useEditionConfigs()

const { locale } = useI18n()

const POLLING_INTERVAL = 2000

// const { nodes, loadData: getNodes } = useClusterNodes(false, true, 25000)
const { nodes, loadData: getNodes } = useClusterNodes({
  loadByDefault: false,
  hideProgress: true,
  timeout: 25000,
})
/**
 * first time get node data, select the first node
 */
let isInitialized = false
const stats: Ref<Array<NodeStatisticalData>> = ref([])
const graph: Ref<undefined | HTMLElement> = ref(undefined)
const currentNodeName = ref('')
const infoLoading: Ref<boolean> = ref(true)

const currentInfo = computed(() => {
  if (!currentNodeName.value || nodes.value.length === 0 || stats.value.length === 0) {
    return { node: {}, stats: {} } as CurrentInfo
  }
  return getNodeInfoByName(currentNodeName.value)
})

const { transMsNumToSimpleStr } = useDurationStr()
const { syncPolling } = useSyncPolling()

const getStats = async () => {
  try {
    stats.value = await loadStats()
  } catch (error) {
    return Promise.reject(error)
  }
}

const getNodeInfoByName = (nodeName: string) => {
  const node = nodes.value.find(({ node }) => node === nodeName) || {}
  const statsItem = stats.value.find(({ node }) => node === nodeName) || {}
  return { node, stats: statsItem } as CurrentInfo
}

const { tl } = useI18nTl('Dashboard')

const calcMemoryPercentage = computed(() => {
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
  const type = IS_ENTERPRISE ? 'enterprise' : 'broker'
  return ` https://www.emqx.com/${lang}/changelogs/${type}/${version}`
}

const releaseNoteLink = computed(() =>
  getReleaseNoteLinkByVersion(getVersion(currentInfo.value?.node?.version)),
)

const loadData = async () => {
  try {
    await Promise.all([getNodes(), getStats()])
    if (!isInitialized) {
      currentNodeName.value = nodes.value[0].node
      isInitialized = true
    }
    infoLoading.value = false
    return Promise.resolve()
  } catch (error) {
    infoLoading.value = false
    return Promise.reject()
  }
}

syncPolling(loadData, POLLING_INTERVAL)
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
  background: var(--color-bg-split);
  border-radius: 8px;
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
  width: 55%;
  padding: 26px 26px 8px;
  .node-card-header {
    display: flex;
    justify-content: space-between;
    .nodes-link {
      .el-icon {
        margin-left: 6px;
        position: relative;
        top: 2px;
      }
    }
  }
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
      display: block;
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
