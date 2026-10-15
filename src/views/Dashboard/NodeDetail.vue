<template>
  <div class="node-detail app-wrapper">
    <div class="block-header">
      <detail-header :item="{ name: `${tl('node')} ${nodeName}`, path: '/dashboard/nodes' }" />
      <div class="actions">
        <RefreshButton @click="loadData" />
      </div>
    </div>
    <el-row :gutter="26">
      <el-col :span="12">
        <el-card class="node-info top-border" v-loading="nodeLoading">
          <el-descriptions :title="tl('currentNodeInfo')" border :column="1" size="large">
            <el-descriptions-item :label="tl('nodeName')">{{ node.node }}</el-descriptions-item>
            <el-descriptions-item :label="tl('status')">
              <el-tag
                v-if="node.node_status"
                size="small"
                :type="
                  node.node_status === NodeStatus.Unreachable
                    ? 'warning'
                    : node.node_status === NodeStatus.Stopped
                      ? 'danger'
                      : undefined
                "
              >
                <NodeStatusLabel :status="node.node_status" />
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="tl('uptime')">
              {{ node.uptime === undefined ? '--' : transMsNumToSimpleStr(node.uptime) }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('version')">
              <a
                v-if="node.version"
                :href="releaseNoteLink(node.version)"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ node.version }}
              </a>
              <span v-else>--</span>
            </el-descriptions-item>
            <el-descriptions-item :label="tl('role')">{{
              node.role ?? $t('RuleEngine.unknown')
            }}</el-descriptions-item>
            <el-descriptions-item :label="tl('securityProfile')">
              {{ formatNodeStartupSetting(node.security_profile) }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('featurePreset')">
              {{ formatNodeStartupSetting(node.feature_preset) }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('maxFds')">{{
              node.max_fds ?? '--'
            }}</el-descriptions-item>
            <el-descriptions-item :label="tl('osCpuLoad')">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="load1/load5/load15"
                placement="top"
              >
                {{ node.load1 ?? '--' }}/{{ node.load5 ?? '--' }}/{{ node.load15 ?? '--' }}
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item v-if="hasNodeMemory(node)" :label="tl('memory')">
              <el-tooltip
                v-if="node.memory_used !== undefined && node.memory_total !== undefined"
                placement="top"
                effect="dark"
                :content="`${node.memory_used}/${node.memory_total}`"
              >
                <el-progress
                  :stroke-width="20"
                  :percentage="calcPercentage(node.memory_used, node.memory_total)"
                  :format="() => String(node.memory_used ?? '--')"
                >
                </el-progress>
              </el-tooltip>
              <span v-else>--</span>
            </el-descriptions-item>
            <el-descriptions-item :label="`Erlang ${tl('process')}`">
              <el-tooltip
                v-if="node.process_used !== undefined && node.process_available !== undefined"
                placement="top"
                effect="dark"
                :content="`${node.process_used}/${node.process_available}`"
              >
                <el-progress
                  :stroke-width="20"
                  :percentage="calcPercentage(node.process_used, node.process_available)"
                  :format="() => String(node.process_used ?? '--')"
                >
                </el-progress>
              </el-tooltip>
              <span v-else>--</span>
            </el-descriptions-item>
            <el-descriptions-item :label="tl('logPath')">{{
              node.log_path ?? '--'
            }}</el-descriptions-item>
            <el-descriptions-item :label="tl('sysPath')">{{
              node.sys_path ?? '--'
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="node-stats top-border" v-loading="statsLoading">
          <span class="stats-tip">({{ $t('Base.current') }} / {{ $t('Base.highWatermark') }})</span>
          <el-descriptions :title="tl('nodeStatis')" border :column="1" size="large">
            <el-descriptions-item :label="tl('currentConnection')">
              {{ stats['connections.count'] ?? '--' }}/{{ stats['connections.max'] ?? '--' }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <FormItemLabel
                  :label="tl('disconnectedSessions')"
                  :desc="tl('disconnectedSessionsDesc')"
                />
              </template>
              {{ stats['disconnected_sessions.count'] ?? '--' }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('topics')">
              {{ stats['topics.count'] ?? '--' }}/{{ stats['topics.max'] ?? '--' }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('retained')">
              {{ stats['retained.count'] ?? '--' }}/{{ stats['retained.max'] ?? '--' }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('session')">
              {{ stats['sessions.count'] ?? '--' }}/{{ stats['sessions.max'] ?? '--' }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('subscription')">
              {{ stats['subscriptions.count'] ?? '--' }}/{{ stats['subscriptions.max'] ?? '--' }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('shareSubscription')">
              {{ stats['subscriptions.shared.count'] ?? '--' }}/{{
                stats['subscriptions.shared.max'] ?? '--'
              }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'NodeDetail',
})
</script>

<script setup lang="ts">
import { loadNodeDetail, loadNodeStats } from '@/api/common'
import { NodeStatus } from '@/types/enum'
import type { NodeInfo } from '@/types/dashboard'
import { hasNodeMemory } from '@/common/nodeStatus'
import NodeStatusLabel from '@/components/NodeStatusLabel.vue'

const nodeLoading = ref(true)
const statsLoading = ref(true)

const node = ref<Partial<NodeInfo>>({})
const stats = ref<Record<string, any>>({})

const route = useRoute()
const nodeName = computed(() => {
  const { nodeName } = route.params
  return nodeName as string
})

const { tl } = useI18nTl('Dashboard')

const { locale } = useI18n()

const { transMsNumToSimpleStr } = useDurationStr()
const { formatNodeStartupSetting } = useNodeStartupSettings()

const releaseNoteLink = (version: string) => {
  const lang = locale.value === 'zh' ? 'zh' : 'en'
  return ` https://www.emqx.com/${lang}/changelogs/enterprise/${version}`
}

const loadNode = async () => {
  nodeLoading.value = true
  stats.value = {}
  try {
    const res = (await loadNodeDetail(nodeName.value)) ?? {}
    node.value = res
  } catch (error) {
    node.value = {}
  } finally {
    nodeLoading.value = false
  }
}

const loadStats = async () => {
  stats.value = {}
  if (node.value.node_status !== NodeStatus.Running) {
    statsLoading.value = false
    return
  }
  statsLoading.value = true
  try {
    const res = (await loadNodeStats(nodeName.value)) ?? {}
    stats.value = res
  } catch (error) {
    // do nothing
  } finally {
    statsLoading.value = false
  }
}

const loadData = async () => {
  await loadNode()
  await loadStats()
}

loadData()
</script>

<style lang="scss">
.node-detail {
  .detail-header {
    margin-top: 4px;
    margin-bottom: 0;
  }
  .block-header {
    margin-bottom: 20px;
  }
  .el-card {
    &.node-info {
      &.top-border {
        &:before {
          background: linear-gradient(135deg, #00b173 0%, #009580 100%);
        }
      }
    }
    &.node-stats {
      .stats-tip {
        position: absolute;
        right: 25px;
      }
      &.top-border {
        &:before {
          background: linear-gradient(33deg, #9a66ff 0%, #3651ec 100%);
        }
      }
    }
  }
}
</style>
