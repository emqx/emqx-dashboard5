<template>
  <div class="rule-item-overview">
    <el-card class="app-card detail-sub-card">
      <div class="card-hd">
        <h6 class="block-title">{{ tl('executionStatistics') }}</h6>
        <el-tooltip effect="dark" :content="tl('resetStatistics')" placement="top-start">
          <el-icon @click="resetStatistics"><refresh-left /></el-icon>
        </el-tooltip>
      </div>
      <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
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
    <el-card class="app-card detail-sub-card">
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
            <span class="text-status" :class="getStatusClass(row.status)">
              {{ getLabelByStatusValue(row.status) }}
            </span>
            <el-button
              size="small"
              type="primary"
              v-if="row.status === BridgeStatus.Disconnected"
              @click="reconnect(row)"
              :loading="nodeConnectingStatusMap[row.node]"
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
import { defineProps, PropType, defineEmits, computed, ComputedRef, ref, Ref, watch } from 'vue'
import { RefreshLeft } from '@element-plus/icons-vue'
import { BridgeStatus } from '@/types/enum'
import { BridgeItem, NodeMetrics, NodeStatus } from '@/types/rule'
import { formatNumber } from '@/common/tools'
import useBridgeItemStatus from '@/hooks/Rule/bridge/useBridgeItemStatus'
import { reconnectBridgeForNode, resetBridgeMetrics } from '@/api/ruleengine'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  bridgeMsg: {
    type: Object as PropType<BridgeItem>,
    required: true,
  },
})

const emit = defineEmits(['reset', 'reconnect'])
const { getStatusLabel: getLabelByStatusValue, getStatusClass } = useBridgeItemStatus()

const nodeConnectingStatusMap: Ref<Record<string, boolean>> = ref({})

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
  if (!props.bridgeMsg.id) {
    return
  }
  await ElMessageBox.confirm(t('RuleEngine.resetMetricsConfirm', { target: tl('rule') }))
  await resetBridgeMetrics(props.bridgeMsg.id)
  ElMessage.success(tl('resetSuccessfully'))
  emit('reset')
}

const setNodeConnectingStatusMap = () => {
  nodeConnectingStatusMap.value = props.bridgeMsg.node_status.reduce((obj, nodeStatusItem) => {
    return {
      ...obj,
      [nodeStatusItem.node]: false,
    }
  }, {})
}

const reconnect = async ({ node }: NodeMetrics) => {
  nodeConnectingStatusMap.value[node] = true
  await reconnectBridgeForNode(node, props.bridgeMsg.id)
  nodeConnectingStatusMap.value[node] = false
  emit('reconnect')
}

watch(() => props.bridgeMsg, setNodeConnectingStatusMap)
</script>

<style lang="scss" scoped>
@import '~@/style/rule.scss';
</style>
