<template>
  <OverviewMetrics
    :totals="{
      egress: 'matched',
    }"
    :title="lowerCase(tl('action'))"
    :request-metrics="getBridgeMetrics"
    :request-reset="resetMetrics"
    :type-metrics-maps="getTypeMetricsMap()"
    :text-map="textMap"
    :rate-metrics="rateData"
    :show-rate="!isSource"
    :node-status-desc="tl('nodeStatusBridgeDesc')"
    @node-change="handleNodeChanged"
    @metrics-change="handleMetricsLoaded"
  >
    <template #custom-block="{ data }" v-if="!isSource">
      <div class="metric-block">
        <div class="block-hd">
          <p class="block-title">
            {{ tl('buffer') }}
          </p>
        </div>
        <el-row :class="['block-bd', { 'flow-node-row': isFlowNode }]" :gutter="24">
          <el-col :span="isFlowNode ? 24 : 6">
            <el-card class="metric-bar">
              <div class="metric-bar-hd">
                <p class="metric-name">{{ tl('queuedMessages') }}</p>
                <div class="num-container">
                  <p class="metric-num">
                    <span class="num">
                      {{ formatNumber(queuedMsgCount) }}
                    </span>
                  </p>
                  <span
                    v-if="queuedMsgCountDiff"
                    class="num-diff"
                    :class="{
                      'is-red': queuedMsgCountDiff < 0,
                      'need-plus': queuedMsgCountDiff > 0,
                    }"
                  >
                    {{ formatNumber(queuedMsgCountDiff) }}
                  </span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="isFlowNode ? 24 : 12">
            <el-card class="metric-bar">
              <div class="metric-bar-hd">
                <p class="metric-name">{{ tl('queueUsage') }}</p>
                <p class="metric-num">
                  <span class="num">
                    {{ getSizeNumPart(getSizeStr(data.queuing_bytes)) }}
                  </span>
                  <span class="unit">
                    {{ getSizeUnitPart(getSizeStr(data.queuing_bytes)) }}
                  </span>
                </p>
              </div>
              <div class="metric-bar-bd">
                <!-- Bar Chart -->
                <div class="bar-container" ref="QueueBytesChartEle"></div>
                <p class="bar-desc tip">{{ tl('queueUsageDesc') }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </template>
    <template #table="{ data }">
      <el-table :data="nodeStatusTableData(data)">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column :label="t('Base.status')" :width="230">
          <template #default="{ row }">
            <span class="text-status" :class="getStatusClass(row.status)">
              {{ getLabelByStatusValue(row.status) }}
            </span>
            <TableButton
              type="primary"
              v-if="row.status === ConnectionStatus.Disconnected"
              @click="reconnect(row)"
              :loading="nodeConnectingStatusMap[row.node]"
            >
              {{ tl('reconnect') }}
            </TableButton>
          </template>
        </el-table-column>
        <el-table-column :label="tl('matched')">
          <template #default="{ row }">{{ getEgressData(row.metrics?.matched) }}</template>
        </el-table-column>
        <el-table-column v-if="isSource" prop="metrics.received" :label="tl('received')" />
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
            <p>{{ t('Base.rateLast5M') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
          <template #default="{ row }">{{ getEgressData(row.metrics?.rate_last5m) }}</template>
        </el-table-column>
        <el-table-column :label="t('Base.rateMax')">
          <template #header>
            <p>{{ t('Base.rateMax') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
          <template #default="{ row }">{{ getEgressData(row.metrics?.rate_max) }}</template>
        </el-table-column>
      </el-table>
    </template>
  </OverviewMetrics>
</template>

<script setup lang="ts">
import { formatNumber } from '@/common/tools'
import OverviewMetrics from '@/components/Metrics/OverviewMetrics.vue'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useHandleSourceItem from '@/hooks/Rule/action/useHandleSourceItem'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import useI18nTl from '@/hooks/useI18nTl'
import { useActionQueueMetrics, useBridgeMetrics } from '@/hooks/useMetrics'
import { MetricsData, NodeMetrics } from '@/types/common'
import { ConnectionStatus } from '@/types/enum'
import { BridgeItem, NodeStatus } from '@/types/rule'

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
  },
  isSource: {
    type: Boolean,
  },
})
const emit = defineEmits(['reconnect'])

const isFlowNode = inject('isFlowNode', false)

const { t, tl } = useI18nTl('RuleEngine')

const { reconnectActionForNode, getActionMetrics, resetActionMetrics } = useHandleActionItem()
const { reconnectSourceForNode, getSourceMetrics, resetSourceMetrics } = useHandleSourceItem()
const selectFunction = (sourceFunc: any, actionFunc: any) => (id: string, node?: string) =>
  props.isSource ? sourceFunc(id, node) : actionFunc(id, node)
const reconnectForNode = selectFunction(reconnectSourceForNode, reconnectActionForNode)
const getMetrics = selectFunction(getSourceMetrics, getActionMetrics)
const requestResetMetrics = selectFunction(resetSourceMetrics, resetActionMetrics)

const getBridgeMetrics = async () => {
  try {
    if (!props.bridgeId) {
      return
    }
    return getMetrics(props.bridgeId)
  } catch (error) {
    //
  }
}

const resetMetrics = () => {
  if (!props.bridgeId) {
    return
  }
  return requestResetMetrics(props.bridgeId)
}

const { getStatusLabel: getLabelByStatusValue, getStatusClass } = useCommonConnectionStatus()
const nodeStatus: ComputedRef<Array<NodeStatus>> = computed(() => {
  const nodeStatusData = props.bridgeMsg?.node_status
  return Array.isArray(nodeStatusData) ? nodeStatusData : []
})
const nodeStatusTableData = ({ node_metrics }: MetricsData) => {
  return node_metrics.map(({ node, metrics }) => {
    const status =
      nodeStatus.value.find((item) => item.node === node)?.status || ConnectionStatus.Disconnected
    return {
      node,
      metrics,
      status,
    }
  })
}

const { ingressTypeMetricsMap, egressTypeMetricsMap, textMap, rateData } = useBridgeMetrics()

const getTypeMetricsMap = () => {
  const ingressData = {
    name: 'ingress',
    data: ingressTypeMetricsMap,
  }
  const egressData = {
    name: 'egress',
    data: egressTypeMetricsMap,
  }
  if (props.isSource) {
    return [ingressData]
  }
  return [egressData]
}

const getEgressData = (data: number) => (props.isSource ? '-' : data)

const nodeConnectingStatusMap: Ref<Record<string, boolean>> = ref({})
type NodeStatusData = { node: string; status: ConnectionStatus }
const setNodeConnectingStatusMap = () => {
  nodeConnectingStatusMap.value = props.bridgeMsg.node_status?.reduce(
    (obj: Record<string, ConnectionStatus>, nodeStatusItem: NodeStatusData) => {
      return { ...obj, [nodeStatusItem.node]: false }
    },
    {},
  )
}
const reconnect = async ({ node }: NodeMetrics) => {
  try {
    nodeConnectingStatusMap.value[node] = true
    await reconnectForNode(node, props.bridgeMsg.id)
    emit('reconnect')
  } catch (error) {
    //
  } finally {
    nodeConnectingStatusMap.value[node] = false
  }
}
watch(() => props.bridgeMsg, setNodeConnectingStatusMap)

const {
  getSizeStr,
  getSizeNumPart,
  getSizeUnitPart,
  QueueBytesChartEle,
  updateQueueBytesData,
  initQueueBytesData,
} = useActionQueueMetrics()

const selectedNode = ref('')
const isSelectedCluster = ref(false)
const handleNodeChanged = (node: string, selectedCluster: boolean) => {
  selectedNode.value = node
  isSelectedCluster.value = selectedCluster
  initQueueBytesData()
}

const queuedMsgCount = ref(0)
/**
 * The difference between the current and previous queued message count
 */
const queuedMsgCountDiff = ref(0)
const handleMetricsLoaded = (metrics: MetricsData) => {
  const timestamp = Date.now()
  const targetMetrics = isSelectedCluster.value
    ? metrics.metrics
    : metrics.node_metrics.find((item) => item.node === selectedNode.value)?.metrics || {}
  const value = targetMetrics.queuing_bytes
  updateQueueBytesData(value, timestamp)

  const msgCount = targetMetrics.queuing || 0
  queuedMsgCountDiff.value = msgCount - queuedMsgCount.value
  queuedMsgCount.value = msgCount
}
</script>
