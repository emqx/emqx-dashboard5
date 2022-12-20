<template>
  <div class="resource-item-overview">
    <div class="overview-header">
      <p class="block-title">{{ tl('statistics') }}</p>
      <div>
        <el-button type="primary" @click="handleRefresh">
          {{ $t('Base.refresh') }}
        </el-button>
        <el-button type="primary" plain @click="resetStatistics">
          {{ tl('resetStatistics') }}
        </el-button>
      </div>
    </div>
    <div class="overview-sub-block">
      <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
      <TargetDetailMetrics class="rule-statistic" :metrics="statisticsData" />
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

        <el-table-column prop="metrics.matched" :label="tl('matched')" />
        <el-table-column prop="metrics.dropped" :label="tl('dropped')" />

        <el-table-column prop="metrics.rate">
          <template #header>
            <p>{{ t('Base.rate') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
        </el-table-column>
        <el-table-column prop="metrics.rate_last5m">
          <template #header>
            <p>{{ tl('rateLast5M') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
        </el-table-column>
        <el-table-column prop="metrics.rate_max" :label="tl('rateMax')">
          <template #header>
            <p>{{ tl('rateMax') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
        </el-table-column>

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
import { BridgeType, ConnectionStatus } from '@/types/enum'
import { BridgeItem, NodeMetrics, NodeStatus } from '@/types/rule'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import { reconnectBridgeForNode, resetBridgeMetrics } from '@/api/ruleengine'
import { ElMessage, ElMessageBox } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'
import TargetDetailMetrics from '@/components/TargetDetailMetrics.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'

const props = defineProps({
  bridgeMsg: {
    type: Object as PropType<BridgeItem>,
    required: true,
  },
})

const emit = defineEmits(['reset', 'reconnect', 'refresh'])
const { getStatusLabel: getLabelByStatusValue, getStatusClass } = useCommonConnectionStatus()

const nodeConnectingStatusMap: Ref<Record<string, boolean>> = ref({})

const showReceived = computed(() => {
  const isMQTT = props.bridgeMsg.type === BridgeType.MQTT
  const withIngress = 'ingress' in props.bridgeMsg && props.bridgeMsg.ingress
  return isMQTT && withIngress
})

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

const { tl, t } = useI18nTl('RuleEngine')

const statisticsData = computed(() => {
  const ret = [
    {
      label: tl('matched'),
      desc: tl('bridgeMatchedDesc'),
      value: props.bridgeMsg?.metrics?.matched,
      className: 'matched-bg',
    },
    {
      label: tl('sentSuccessfully'),
      desc: tl('sentSuccessfullyDesc'),
      value: props.bridgeMsg?.metrics?.success,
      className: 'last-five-rate-bg',
    },
    {
      label: tl('sentFailed'),
      desc: tl('sentFailedDesc'),
      value: props.bridgeMsg?.metrics?.failed,
      className: 'failed-bg',
    },
    {
      label: tl('sentInflight'),
      desc: tl('sentInflightDesc'),
      value: props.bridgeMsg?.metrics?.inflight,
      className: 'no-result-bg',
    },

    {
      label: tl('dropped'),
      desc: tl('droppedDesc'),
      value: props.bridgeMsg?.metrics?.dropped,
      className: 'failed-bg',
    },
    {
      label: tl('queuing'),
      desc: tl('queuingDesc'),
      value: props.bridgeMsg?.metrics?.queuing,
      className: 'max-rate-bg',
    },
    {
      label: tl('retried'),
      desc: tl('retriedDesc'),
      value: props.bridgeMsg?.metrics?.retried,
      className: 'success-bg',
    },
    {
      label: tl('rateNow'),
      value: props.bridgeMsg?.metrics?.rate,
      unit: t('RuleEngine.rateUnit', props.bridgeMsg?.metrics?.rate),
      className: 'rate-bg',
    },
  ]
  if (showReceived.value) {
    ret.splice(4, 0, {
      label: tl('received'),
      desc: tl('receivedDesc'),
      value: props.bridgeMsg?.metrics?.received,
      className: 'max-rate-bg',
    })
  }
  return ret
})

const handleRefresh = () => {
  emit('refresh')
}

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

watch(() => props.bridgeMsg, setNodeConnectingStatusMap)
</script>
