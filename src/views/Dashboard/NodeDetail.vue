<template>
  <div class="node-detail app-wrapper">
    <div class="block-header">
      <detail-header :item="{ name: `${tl('node')} ${nodeName}`, path: '/dashboard/nodes' }" />
      <div class="actions">
        <el-button type="primary" :icon="Refresh" @click="loadData">
          {{ $t('Base.refresh') }}
        </el-button>
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
                :type="node.node_status === 'Running' ? '' : 'danger'"
              >
                <span :class="[node.node_status === 'Running' ? 'running-status' : 'stop-status']"
                  >{{ node.node_status === 'Running' ? tl('running') : tl('stopped') }}
                </span>
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item :label="tl('uptime')">{{
              getDuration(node.uptime)
            }}</el-descriptions-item>
            <el-descriptions-item :label="tl('version')">{{ node.version }}</el-descriptions-item>
            <el-descriptions-item :label="tl('role')">{{ node.role }}</el-descriptions-item>
            <el-descriptions-item :label="tl('maxFds')">{{ node.max_fds }}</el-descriptions-item>
            <el-descriptions-item :label="`CPU ${tl('load')}`">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="load1/load5/load15"
                placement="top"
              >
                {{ node.load1 }}/{{ node.load5 }}/{{ node.load15 }}
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item :label="tl('memory')">
              <el-tooltip
                placement="top"
                effect="dark"
                :content="`${node.memory_used}/${node.memory_total}`"
              >
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="calcPercentage(node.memory_used, node.memory_total)"
                  :format="() => ''"
                >
                  <span>{{ node.memory_used }}</span>
                </el-progress>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item :label="`Erlang ${tl('process')}`">
              <el-tooltip
                placement="top"
                effect="dark"
                :content="`${node.process_used}/${node.process_available}`"
              >
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="calcPercentage(node.process_used, node.process_available)"
                  :format="() => ''"
                >
                  <span>{{ node.process_used }}</span>
                </el-progress>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item :label="tl('logPath')">{{ node.log_path }}</el-descriptions-item>
            <el-descriptions-item :label="tl('sysPath')">{{ node.sys_path }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="node-stats top-border" v-loading="statsLoading">
          <span class="stats-tip">{{ `(${$t('Base.current')}/${$t('Base.max')})` }}</span>
          <el-descriptions :title="tl('nodeStatis')" border :column="1" size="large">
            <el-descriptions-item :label="tl('currentConnection')">
              {{ stats['connections.count'] }}/{{ stats['connections.max'] }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('topics')">
              {{ stats['connections.count'] }}/{{ stats['connections.max'] }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('retained')">
              {{ stats['retained.count'] }}/{{ stats['retained.max'] }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('session')">
              {{ stats['sessions.count'] }}/{{ stats['sessions.max'] }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('subscription')">
              {{ stats['subscriptions.count'] }}/{{ stats['subscriptions.max'] }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('shareSubscription')">
              {{ stats['subscriptions.shared.count'] }}/{{ stats['subscriptions.shared.max'] }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'NodeDetail',
})
</script>

<script setup lang="ts">
import { loadNodeDetail, loadNodeStats } from '@/api/common'
import { getDuration, calcPercentage } from '@/common/utils'
import DetailHeader from '@/components/DetailHeader.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import useI18nTl from '@/hooks/useI18nTl'
import { Refresh } from '@element-plus/icons-vue'

const nodeLoading = ref(true)
const statsLoading = ref(true)

const node = ref<Record<string, any>>({})
const stats = ref<Record<string, any>>({})

const route = useRoute()
const nodeName = computed(() => {
  const { nodeName } = route.params
  return nodeName as string
})

const { tl } = useI18nTl('Dashboard')

const loadNode = async () => {
  nodeLoading.value = true
  try {
    const res = (await loadNodeDetail(nodeName.value)) ?? {}
    node.value = res
  } catch (error) {
    // do nothing
  } finally {
    nodeLoading.value = false
  }
}

const loadStats = async () => {
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

const loadData = () => {
  loadNode()
  loadStats()
}

loadData()
</script>

<style lang="scss">
.node-detail {
  .el-card {
    .stop-status::before,
    .running-status::before {
      left: -6px;
      top: -2px;
    }
    .stop-status::after,
    .running-status::after {
      left: 0px;
      top: 4px;
    }
    .running-status,
    .stop-status {
      padding-left: 12px;
    }
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
