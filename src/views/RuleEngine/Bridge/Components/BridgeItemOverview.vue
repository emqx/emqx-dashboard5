<template>
  <div class="resource-item-overview">
    <div class="overview-sub-block">
      <div class="card-hd">
        <h2 class="block-title">{{ tl('executionStatistics') }}</h2>
        <el-tooltip effect="dark" :content="tl('resetStatistics')" placement="top-start">
          <el-icon @click="resetStatistics"><CircleClose /></el-icon>
        </el-tooltip>
      </div>
      <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
      <el-row class="rule-statistic" :gutter="28">
        <el-col :span="6">
          <el-card class="success-bg">
            <p class="statistic-label">{{ tl('SuccessNum') }}</p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.success) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="failed-bg">
            <p class="statistic-label">{{ tl('ErrNum') }}</p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.failed) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="rate-bg">
            <p class="statistic-label">{{ tl('speedNow') }}</p>
            <p class="statistic-num">
              <span>{{ formatNumber(bridgeMsg?.metrics?.rate) }}</span>
              <span class="unit">msg/s</span>
            </p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="overview-sub-block">
      <div class="card-hd">
        <h6 class="block-title">{{ tl('nodeStatus') }}</h6>
      </div>
      <p class="card-sub-desc">{{ tl('nodeStatusBridgeDesc') }}</p>
      <el-table :data="nodeStatusTableData">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column prop="metrics.success" :label="tl('SuccessNum')" />
        <el-table-column prop="metrics.failed" :label="tl('ErrNum')" />
        <el-table-column prop="metrics.rate" :label="tl('speedNow')" />
        <el-table-column :label="tl('status')">
          <template #default="{ row }">
            <span class="text-status" :class="getStatusClass(row.status)">
              {{ getLabelByStatusValue(row.status) }}
            </span>
            <el-button
              size="small"
              type="primary"
              v-if="row.status === ConnectionStatus.Disconnected"
              @click="reconnect(row)"
              :loading="nodeConnectingStatusMap[row.node]"
            >
              {{ tl('reconnect') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { CircleClose } from '@element-plus/icons-vue'
import { ConnectionStatus } from '@/types/enum'
import { BridgeItem, NodeMetrics, NodeStatus } from '@/types/rule'
import { formatNumber } from '@/common/tools'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
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
const { getStatusLabel: getLabelByStatusValue, getStatusClass } = useCommonConnectionStatus()

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
      nodeStatus.value.find((item) => item.node === node)?.status || ConnectionStatus.Disconnected
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
  nodeConnectingStatusMap.value = props.bridgeMsg.node_status?.reduce((obj, nodeStatusItem) => {
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
