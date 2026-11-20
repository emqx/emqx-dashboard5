<template>
  <div class="graph-wrapper">
    <div v-if="nodes.length" class="graph-entity">
      <div class="nodes-graph-container">
        <span class="node-count">
          <img src="@/assets/img/node.svg" width="12" height="12" alt="node" />
          <span class="cluster-name">
            <CommonOverflowTooltip :content="clusterName" />
          </span>
          <span v-if="clusterName">&nbsp;-&nbsp;</span>
          {{ $t('Dashboard.node', { n: nodes.length }) }}
        </span>
        <NodesGraph v-model="currentNodeName" :nodes="nodes" />
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
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">{{ tl('nodeName') }}</div>
                <div class="info-value">{{ currentInfo.node['node'] }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">{{ tl('nodeRole') }}</div>
                <div class="info-value">{{ currentInfo.node['role'] }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">{{ tl('uptime') }}</div>
                <div class="info-value">{{ transMsNumToSimpleStr(currentInfo.node.uptime) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">{{ tl('version') }}</div>
                <div class="info-value">
                  <a :href="releaseNoteLink" target="_blank" rel="noopener noreferrer">
                    {{ currentInfo.node['version'] }} ({{ $t('Base.enterpriseEdition') }})
                  </a>
                </div>
              </div>
              <div v-if="currentInfo.stats" class="info-item">
                <div class="info-label">{{ tl('currentConnection') }}</div>
                <div class="info-value">{{ currentInfo.stats['connections.count'] }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">{{ tl('maxFds') }}</div>
                <div class="info-value">{{ currentInfo.node['max_fds'] }}</div>
              </div>
              <div v-if="currentInfo.stats" class="info-item">
                <div class="info-label">{{ tl('Subscription') }}</div>
                <div class="info-value">{{ currentInfo.stats['subscriptions.count'] }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">{{ tl('osCpuLoad') }}</div>
                <div class="info-value">
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
                </div>
              </div>
              <div v-if="currentInfo.stats" class="info-item">
                <div class="info-label">{{ tl('topics') }}</div>
                <div class="info-value">{{ currentInfo.stats['topics.count'] }}</div>
              </div>
              <div v-if="![0, '0'].includes(currentInfo?.node?.['memory_total'])" class="info-item">
                <div class="info-label">{{ tl('memory') }}</div>
                <div class="info-value">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="`${currentInfo?.node?.['memory_used']}/${currentInfo?.node?.['memory_total']}`"
                    placement="top"
                  >
                    <el-progress
                      :stroke-width="8"
                      :format="() => ''"
                      :percentage="calcMemoryPercentage"
                    >
                    </el-progress>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <p v-if="statsForbidden" class="tip mt-4">{{ tl('nodeStatsPermissionDenied') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else v-loading.lock="nodesStatus === 'idle'" class="nodes-placeholder">
      <el-empty v-if="nodesStatus === 'forbidden'" :description="tl('nodesPermissionDenied')" />
      <el-empty v-else-if="nodesStatus === 'loaded'" :description="tl('noNodes')" />
      <el-empty v-else-if="nodesStatus === 'failed'" :description="$t('Base.requestFailed')" />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'NodesGraph',
})
</script>

<script setup lang="ts">
import { loadStats } from '@/api/common'
import { isUnauthorizedRoleError } from '@/common/http'
import type { NodeStatisticalData } from '@/types/dashboard'
import { Right } from '@element-plus/icons-vue'
import NodesGraph from './NodesGraph.vue'

const { locale } = useI18n()

const POLLING_INTERVAL = 2000

const {
  nodes,
  nodesStatus,
  loadData: getNodes,
  clusterName,
} = useClusterNodes({
  loadByDefault: false,
  hideProgress: true,
  timeout: 25000,
  handleUnauthorizedRole: true,
})
const stats = ref<NodeStatisticalData[]>([])
const statsForbidden = ref(false)
const currentNodeName = ref('')

watch(nodes, (updatedNodes) => {
  if (!updatedNodes.some(({ node }) => node === currentNodeName.value)) {
    currentNodeName.value = updatedNodes[0]?.node ?? ''
  }
})

const currentInfo = computed(() => {
  const node = nodes.value.find(({ node }) => node === currentNodeName.value)
  if (!node) {
    return undefined
  }
  return { node, stats: stats.value.find(({ node }) => node === currentNodeName.value) }
})

const { transMsNumToSimpleStr } = useDurationStr()
const { needPolling, syncPolling } = useSyncPolling()

const getStats = async () => {
  try {
    stats.value = await loadStats(true)
  } catch (error) {
    stats.value = []
    statsForbidden.value = isUnauthorizedRoleError(error)
  }
}

const { tl } = useI18nTl('Dashboard')

const calcMemoryPercentage = computed(() => {
  const node = currentInfo.value?.node
  return node ? calcPercentage(node.memory_used, node.memory_total) : 0
})

const versionReg = /(?<version>\d\.\d+\.\d+)/
const getVersion = (version?: string) => {
  if (!version) {
    return ''
  }
  const matchRes = version.match(versionReg)
  return matchRes && matchRes.groups?.version ? matchRes.groups?.version : ''
}

const getReleaseNoteLinkByVersion = (version: string) => {
  const lang = locale.value === 'zh' ? 'zh' : 'en'
  return ` https://www.emqx.com/${lang}/changelogs/enterprise/${version}`
}

const releaseNoteLink = computed(() =>
  getReleaseNoteLinkByVersion(getVersion(currentInfo.value?.node.version)),
)

const loadData = async () => {
  await Promise.all([getNodes(), statsForbidden.value ? undefined : getStats()])
  if (nodesStatus.value === 'forbidden') {
    needPolling.value = false
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
  border-radius: var(--border-radius-card);
}

.graph-entity {
  display: flex;
  gap: 16px;
  width: 100%;
}

.nodes-placeholder {
  display: grid;
  place-items: center;
  min-height: 450px;
}

.nodes-graph-container {
  flex: 0 0 calc(50% - 8px);
  padding: 20px;
  position: relative;
  background: var(--color-bg-split);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-card);
  min-height: 450px;

  .node-count {
    position: absolute;
    top: 16px;
    left: 16px;
    border-radius: 6px;
    padding: 8px 12px;
    color: var(--color-text-primary);
    background: var(--color-bg-content);
    border: 1px solid var(--color-border-card);
    display: flex;
    align-items: center;
    font-size: 13px;
    z-index: 1;

    img {
      margin-right: 6px;
    }

    .cluster-name {
      max-width: 100px;
      font-weight: 500;
    }
  }
}

.node-detail {
  flex: 0 0 calc(50% - 8px);
  padding: 0;
  background: var(--color-bg-content);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-card);

  .node-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    border-bottom: 1px solid var(--color-border-card);

    .nodes-link {
      font-size: 14px;
      color: var(--color-primary);
      text-decoration: none;
      display: flex;
      align-items: center;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }

      .el-icon {
        margin-left: 4px;
      }
    }
  }

  .node-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-title-primary);
  }

  .node-card-body {
    padding: 28px 32px;

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px 32px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .info-label {
        font-size: 13px;
        color: var(--color-text-secondary);
        line-height: 18px;
      }

      .info-value {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-title-primary);
        line-height: 20px;

        a {
          color: var(--color-primary);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        .el-progress {
          width: 100%;
          max-width: 180px;
        }
      }
    }
  }
}
</style>
