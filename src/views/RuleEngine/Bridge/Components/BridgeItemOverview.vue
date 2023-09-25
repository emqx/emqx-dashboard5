<template>
  <div class="resource-item-overview">
    <div class="overview-sub-block" v-if="showEgressStats">
      <div class="overview-header">
        <p class="block-title">{{ tl('egressStatistics') }}</p>
        <div v-if="!(showIngressStats && !showEgressStats)">
          <el-tooltip :content="$t('Base.refresh')" placement="top">
            <el-button class="icon-button" type="primary" :icon="Refresh" @click="handleRefresh">
            </el-button>
          </el-tooltip>
          <el-tooltip :content="tl('resetStatistics')" placement="top">
            <el-button class="icon-button" :icon="Close" @click="resetStatistics"> </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="overview-sub-block">
        <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
        <TargetDetailMetrics class="rule-statistic" :metrics="egressStatisticsData" />
      </div>
    </div>
    <div class="overview-sub-block" v-if="showIngressStats">
      <div class="overview-header">
        <p class="block-title">{{ tl('ingressStatistics') }}</p>
        <div v-if="showIngressStats && !showEgressStats">
          <el-tooltip :content="$t('Base.refresh')" placement="top">
            <el-button class="icon-button" type="primary" :icon="Refresh" @click="handleRefresh">
            </el-button>
          </el-tooltip>
          <el-tooltip :content="tl('resetStatistics')" placement="top">
            <el-button class="icon-button" :icon="Close" @click="resetStatistics"> </el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="overview-sub-block">
        <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
        <TargetDetailMetrics class="rule-statistic" :metrics="ingressStatisticsData" />
      </div>
    </div>

    <div class="overview-sub-block">
      <div class="overview-header">
        <p class="vertical-align-center">
          {{ tl('nodeStatus') }}
          <InfoTooltip :content="tl('nodeStatusBridgeDesc')" />
        </p>
      </div>
      <el-table :data="nodeStatusTableData">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column :label="tl('status')" :width="230">
          <template #default="{ row }">
            <span class="text-status" :class="getStatusClass(row.status)">
              {{ getLabelByStatusValue(row.status) }}
            </span>
            <el-button
              size="small"
              type="primary"
              :disabled="!$hasPermission('post')"
              v-if="row.status === ConnectionStatus.Disconnected"
              @click="reconnect(row)"
              :loading="nodeConnectingStatusMap[row.node]"
            >
              {{ tl('reconnect') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="tl('matched')">
          <template #default="{ row }">{{ getEgressData(row.metrics?.matched) }}</template>
        </el-table-column>
        <el-table-column v-if="showIngressStats" prop="metrics.received" :label="tl('received')" />
        <el-table-column :label="tl('dropped')">
          <template #default="{ row }">{{ getEgressData(row.metrics?.dropped) }}</template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <p>{{ t('Base.rate') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
          <template #default="{ row }">{{ getEgressData(row.metrics?.rate) }}</template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <p>{{ tl('rateLast5M') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
          <template #default="{ row }">{{ getEgressData(row.metrics?.rate_last5m) }}</template>
        </el-table-column>
        <el-table-column :label="tl('rateMax')">
          <template #header>
            <p>{{ tl('rateMax') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
          <template #default="{ row }">{{ getEgressData(row.metrics?.rate_max) }}</template>
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
import { computed, ComputedRef, defineEmits, defineProps, PropType, ref, Ref, watch } from 'vue'
import { queryBridgeMetrics, reconnectBridgeForNode, resetBridgeMetrics } from '@/api/ruleengine'
import InfoTooltip from '@/components/InfoTooltip.vue'
import TargetDetailMetrics from '@/components/TargetDetailMetrics.vue'
import { useBridgeDirection } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, ConnectionStatus } from '@/types/enum'
import { BridgeItem, BridgeMetricsData, NodeMetrics, NodeStatus } from '@/types/rule'
import { Close, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { lowerCase } from 'lodash'

const props = defineProps({
  /**
   * get node status
   */
  bridgeMsg: {
    type: Object as PropType<BridgeItem>,
    required: true,
  },
  bridgeId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['reconnect'])
const bridgeMetrics: Ref<BridgeMetricsData> = ref({ metrics: {}, node_metrics: [] })
const { getStatusLabel: getLabelByStatusValue, getStatusClass } = useCommonConnectionStatus()

const nodeConnectingStatusMap: Ref<Record<string, boolean>> = ref({})

const { judgeBridgeDirection } = useBridgeDirection()

const bridgeDirection = computed(() => judgeBridgeDirection(props.bridgeMsg))

const showEgressStats = computed(() => {
  return bridgeDirection.value !== BridgeDirection.Ingress
})

const showIngressStats = computed(() => {
  return bridgeDirection.value !== BridgeDirection.Egress
})

const nodeStatus: ComputedRef<Array<NodeStatus>> = computed(() => {
  const nodeStatusData = props.bridgeMsg?.node_status
  return Array.isArray(nodeStatusData) ? nodeStatusData : []
})

const nodeMetrics: ComputedRef<Array<NodeMetrics>> = computed(() => {
  const nodeMetricsData = bridgeMetrics.value.node_metrics
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

const { tl, t } = useI18nTl('RuleEngine')

const egressStatisticsData = computed(() => [
  {
    label: tl('matched'),
    desc: tl('bridgeMatchedDesc'),
    value: bridgeMetrics.value.metrics.matched,
    className: 'matched-bg',
  },
  {
    label: tl('sentSuccessfully'),
    desc: tl('sentSuccessfullyDesc'),
    value: bridgeMetrics.value.metrics.success,
    className: 'last-five-rate-bg',
  },
  {
    label: tl('sentFailed'),
    desc: tl('sentFailedDesc'),
    value: bridgeMetrics.value.metrics.failed,
    className: 'failed-bg',
  },
  {
    label: tl('sentInflight'),
    desc: tl('sentInflightDesc'),
    value: bridgeMetrics.value.metrics.inflight,
    className: 'no-result-bg',
  },
  {
    label: tl('lateReply'),
    desc: tl('lateReplyDesc'),
    value: bridgeMetrics.value.metrics.late_reply,
    className: 'no-result-bg',
  },

  {
    label: tl('dropped'),
    desc: tl('droppedDesc'),
    value: bridgeMetrics.value.metrics.dropped,
    className: 'failed-bg',
  },
  {
    label: tl('queuing'),
    desc: tl('queuingDesc'),
    value: bridgeMetrics.value.metrics.queuing,
    className: 'max-rate-bg',
  },
  {
    label: tl('retried'),
    desc: tl('retriedDesc'),
    value: bridgeMetrics.value.metrics.retried,
    className: 'success-bg',
  },
  {
    label: tl('rateNow'),
    value: bridgeMetrics.value.metrics.rate,
    unit: t('RuleEngine.rateUnit', bridgeMetrics.value.metrics.rate),
    className: 'rate-bg',
  },
])

const ingressStatisticsData = computed(() => [
  {
    label: tl('received'),
    desc: tl('receivedDesc'),
    value: bridgeMetrics.value.metrics.received,
    className: 'max-rate-bg',
  },
])

const getBridgeMetrics = async () => {
  try {
    if (!props.bridgeId) {
      return
    }
    bridgeMetrics.value = await queryBridgeMetrics(props.bridgeId)
  } catch (error) {
    //
  }
}

const handleRefresh = () => {
  getBridgeMetrics()
}

const resetStatistics = async () => {
  if (!props.bridgeId) {
    return
  }
  await ElMessageBox.confirm(
    t('RuleEngine.resetMetricsConfirm', { target: lowerCase(tl('dataBridge')) }),
  )
  await resetBridgeMetrics(props.bridgeId)
  ElMessage.success(tl('resetSuccessfully'))
  getBridgeMetrics()
}

const setNodeConnectingStatusMap = () => {
  nodeConnectingStatusMap.value = props.bridgeMsg.node_status?.reduce(
    (
      obj: Record<string, ConnectionStatus>,
      nodeStatusItem: {
        node: string
        status: ConnectionStatus
      },
    ) => {
      return {
        ...obj,
        [nodeStatusItem.node]: false,
      }
    },
    {},
  )
}

const reconnect = async ({ node }: NodeMetrics) => {
  try {
    nodeConnectingStatusMap.value[node] = true
    await reconnectBridgeForNode(node, props.bridgeMsg.id)
    emit('reconnect')
  } catch (error) {
    //
  } finally {
    nodeConnectingStatusMap.value[node] = false
  }
}

const getEgressData = (data: number) => (showEgressStats.value ? data : '-')

watch(() => props.bridgeMsg, setNodeConnectingStatusMap)

getBridgeMetrics()
</script>
