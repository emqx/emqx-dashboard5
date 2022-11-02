<template>
  <div class="resource-item-overview">
    <div class="overview-header">
      <h6 class="block-title">{{ tl('executionStatistics') }}</h6>
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
      <el-row class="rule-statistic" :gutter="28">
        <!-- first row -->
        <el-col :span="6">
          <el-card class="matched-bg">
            <p class="statistic-label">
              <span>{{ tl('matched') }}</span>
              <InfoTooltip :content="tl('bridgeMatchedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.matched) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="last-five-rate-bg">
            <p class="statistic-label">
              <span>{{ tl('sentSuccessfully') }}</span>
              <InfoTooltip :content="tl('sentSuccessfullyDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.success) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="failed-bg">
            <p class="statistic-label">
              <span>{{ tl('sentFailed') }}</span>
              <InfoTooltip :content="tl('sentFailedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.failed) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="no-result-bg">
            <p class="statistic-label">
              <span>{{ tl('sentInflight') }}</span>
              <InfoTooltip :content="tl('sentInflightDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.inflight) }}</p>
          </el-card>
        </el-col>
        <!-- second row -->

        <el-col :span="6" v-if="showReceived">
          <el-card class="max-rate-bg">
            <p class="statistic-label">
              <span>{{ tl('received') }}</span>
              <InfoTooltip :content="tl('receivedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.received) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="failed-bg">
            <p class="statistic-label">
              <span>{{ tl('dropped') }}</span>
              <InfoTooltip :content="tl('droppedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.dropped) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="max-rate-bg">
            <p class="statistic-label">
              <span>{{ tl('queuing') }}</span>
              <InfoTooltip :content="tl('queuingDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.queuing) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="success-bg">
            <p class="statistic-label">
              <span>{{ tl('retried') }}</span>
              <InfoTooltip :content="tl('retriedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(bridgeMsg?.metrics?.retried) }}</p>
          </el-card>
        </el-col>
        <!-- third row -->
        <el-col :span="6">
          <el-card class="rate-bg">
            <p class="statistic-label">{{ tl('speedNow') }}</p>
            <p class="statistic-num">
              <span>{{ formatNumber(bridgeMsg?.metrics?.rate) }}</span>
              <span class="unit">{{ t('RuleEngine.rateUnit', bridgeMsg?.metrics?.rate) }}</span>
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

        <el-table-column prop="metrics.matched" :label="tl('matched')" />
        <el-table-column prop="metrics.dropped" :label="tl('dropped')" />

        <el-table-column prop="metrics.rate">
          <template #header>
            <p>{{ tl('executionSpeed') }}</p>
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
import { formatNumber } from '@/common/tools'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import { reconnectBridgeForNode, resetBridgeMetrics } from '@/api/ruleengine'
import { ElMessage, ElMessageBox } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'
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
