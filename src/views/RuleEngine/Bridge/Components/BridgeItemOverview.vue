<template>
  <div class="rule-item-overview">
    <el-card shadow="never" class="app-card detail-sub-card">
      <div class="card-hd">
        <h6 class="block-title">{{ tl('executionStatistics') }}</h6>
        <el-tooltip effect="dark" :content="tl('resetStatistics')" placement="top-start">
          <el-icon @click="resetStatistics"><refresh-left /></el-icon>
        </el-tooltip>
      </div>
      <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p>
      <el-row class="rule-statistic">
        <el-col :span="6">
          <p class="statistic-label">{{ tl('success') }}</p>
          <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.success) }}</p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">{{ tl('failure') }}</p>
          <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.failed) }}</p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">{{ tl('speedNow') }}</p>
          <p class="statistic-num">
            <span>{{ formatNumber(bridgeMsg?.metrics?.rate) }}</span>
            <span class="unit">msg/s</span>
          </p>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="never" class="app-card detail-sub-card">
      <div class="card-hd">
        <h6 class="block-title">{{ tl('executionStatistics') }}</h6>
      </div>
      <p class="card-sub-desc">{{ tl('nodeStatusDesc') }}</p>
      <el-table :data="nodeStatusTableData">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column prop="metrics.success" :label="tl('success')" />
        <el-table-column prop="metrics.failed" :label="tl('failure')" />
        <el-table-column prop="metrics.rate" :label="tl('speedNow')" />
        <el-table-column :label="tl('status')">
          <template #default="{ row }">
            <span
              class="text-status"
              :class="row.status === BridgeStatus.Connected ? 'success' : 'danger'"
            >
              {{ getLabelByStatusValue(row.status) }}
            </span>
            <el-button
              size="mini"
              type="primary"
              v-if="row.status === BridgeStatus.Disconnected"
              @click="reconnect"
            >
              {{ tl('reconnect') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BridgeItemOverview',
})
</script>

<script setup lang="ts">
import { defineProps, PropType, defineEmits, computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { RefreshLeft } from '@element-plus/icons-vue'
import { BridgeStatus } from '@/types/enum'
import { BridgeItem, NodeMetrics, NodeStatus } from '@/types/rule'
import { formatNumber } from '@/common/tools'
import useBridgeItemStatus from '@/hooks/Rule/bridge/useBridgeItemStatus'

const props = defineProps({
  bridgeMsg: {
    type: Object as PropType<BridgeItem>,
    required: true,
  },
})

const emit = defineEmits(['reset', 'reconnect'])
const { getStatusLabel: getLabelByStatusValue } = useBridgeItemStatus()

const nodeStatus: ComputedRef<Array<NodeStatus>> = computed(() => {
  const nodeStatusData = props.bridgeMsg?.node_status
  return Array.isArray(nodeStatusData) ? nodeStatusData : []
})

const nodeMetrics: ComputedRef<Array<NodeMetrics>> = computed(() => {
  const nodeMetricsData = props.bridgeMsg?.node_metrics
  return Array.isArray(nodeMetricsData) ? nodeMetricsData : []
})

const nodeStatusTableData: ComputedRef<Array<NodeMetrics & NodeStatus>> = computed(() => {
  return nodeMetrics.value.map(({ node, metrics }) => {
    const status =
      nodeStatus.value.find((item) => item.node === node)?.status || BridgeStatus.Disconnected
    return {
      node,
      metrics,
      status,
    }
  })
})

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const resetStatistics = async () => {
  // TODO:
  emit('reset')
}

const reconnect = () => {
  // TODO:
  emit('reconnect')
}
</script>

<style lang="scss" scoped>
@import '~@/style/rule.scss';
</style>
