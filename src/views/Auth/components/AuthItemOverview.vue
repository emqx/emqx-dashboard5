<template>
  <div class="resource-item-overview">
    <el-card class="app-card detail-sub-card">
      <div class="card-hd">
        <h6 class="block-title">{{ tl('executionStatistics') }}</h6>
        <!-- <el-tooltip effect="dark" :content="tl('resetStatistics')" placement="top-start">
          <el-icon @click="resetStatistics"><refresh-left /></el-icon>
        </el-tooltip> -->
      </div>
      <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
      <el-row class="rule-statistic">
        <el-col :span="6">
          <p class="statistic-label">{{ tl('success') }}</p>
          <p class="statistic-num">{{ formatNumber(metrics?.metrics?.success) }}</p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">{{ tl('failure') }}</p>
          <p class="statistic-num">{{ formatNumber(metrics?.metrics?.failed) }}</p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">{{ tl('speedNow') }}</p>
          <p class="statistic-num">
            <span>{{ formatNumber(metrics?.metrics?.rate) }}</span>
            <span class="unit">msg/s</span>
          </p>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="app-card detail-sub-card">
      <div class="card-hd">
        <h6 class="block-title">{{ tl('nodeStatus') }}</h6>
      </div>
      <p class="card-sub-desc">{{ nodeStatusDesc }}</p>
      <el-table :data="nodeStatusTableData">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column prop="metrics.success" :label="tl('success')" />
        <el-table-column prop="metrics.failed" :label="tl('failure')" />
        <el-table-column prop="metrics.rate" :label="`${tl('speedNow')}(msg/s)`" />
        <el-table-column :label="tl('status')">
          <template #default="{ row }">
            <span class="text-status" :class="getStatusClass(row.status)">
              {{ getLabelByStatusValue(row.status) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthItemOverview',
})
</script>

<script setup lang="ts">
import { defineProps, PropType, computed, ref, Ref, watch } from 'vue'
import { ConnectionStatus } from '@/types/enum'
import { formatNumber } from '@/common/tools'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import { Metrics } from '@/types/auth'
import useI18nTl from '@/hooks/useI18nTl'
import { upperFirst } from 'lodash'

const props = defineProps({
  metrics: {
    type: Object as PropType<Metrics>,
  },
  type: {
    type: String as PropType<'authn' | 'authz'>,
  },
})

const { getStatusLabel: getLabelByStatusValue, getStatusClass } = useCommonConnectionStatus()

const nodeConnectingStatusMap: Ref<Record<string, boolean>> = ref({})

const nodeStatus = computed(() => {
  const nodeStatusData = props.metrics?.node_status
  return Array.isArray(nodeStatusData) ? nodeStatusData : []
})

const nodeMetrics = computed(() => {
  const nodeMetricsData = props.metrics?.node_metrics
  return Array.isArray(nodeMetricsData) ? nodeMetricsData : []
})

const nodeStatusTableData = computed(() => {
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

const { t, tl } = useI18nTl('RuleEngine')

const nodeStatusDesc = computed(() => {
  return t('Auth.nodeStatusDesc', {
    target: upperFirst(
      props.type === 'authz' ? t('components.authorization') : t('components.authentication'),
    ),
  })
})

const setNodeConnectingStatusMap = () => {
  nodeConnectingStatusMap.value = props.metrics.node_status.reduce((obj, nodeStatusItem) => {
    return {
      ...obj,
      [nodeStatusItem.node]: false,
    }
  }, {})
}

watch(() => props.metrics, setNodeConnectingStatusMap)
</script>

<style lang="scss" scoped>
@import '~@/style/rule.scss';
</style>
