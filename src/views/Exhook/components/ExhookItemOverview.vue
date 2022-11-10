<template>
  <div class="resource-item-overview exhook-item-overview">
    <div class="overview-sub-block">
      <div class="overview-header">
        <h2 class="block-title">{{ tl('metricsData') }}</h2>
      </div>
      <TargetDetailMetrics class="rule-statistic" :metrics="metricsData" />
    </div>
    <div class="overview-sub-block">
      <div class="card-hd">
        <h3 class="block-title">{{ tl('nodeMetricsData') }}</h3>
      </div>
      <p class="card-sub-desc">{{ tl('nodeStatusDesc') }}</p>
      <el-table :data="nodeMetricsTableData" class="shadow-none">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column :label="tl('success')" prop="metrics.succeed" />
        <el-table-column :label="tl('failure')" prop="metrics.failed" />
        <el-table-column :label="tl('currentSpeed')" prop="metrics.rate" />
        <el-table-column :label="t('Base.status')">
          <template #default="{ row }">
            <span class="text-status" :class="statusTextClass(row.status)">
              {{ statusText(row.status) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import TargetDetailMetrics from '@/components/TargetDetailMetrics.vue'
import useExhookItemStatus from '@/hooks/Exhook/useExhookItemStatus'
import useI18nTl from '@/hooks/useI18nTl'
import { NodeMetrics } from '@/types/rule'
import { Exhook } from '@/types/systemModule'
import { computed, defineProps, PropType, ComputedRef } from 'vue'

const props = defineProps({
  exhook: {
    type: Object as PropType<Exhook>,
  },
})

const { tl, t } = useI18nTl('Exhook')

const metricsData = computed(() => [
  { label: tl('registeredHooks'), value: props.exhook?.hooks?.length, className: 'matched-bg' },
  { label: tl('success'), value: props.exhook?.metrics?.succeed, className: 'success-bg' },
  { label: tl('failure'), value: props.exhook?.metrics?.failed, className: 'failed-bg' },
  { label: tl('currentSpeed'), value: props.exhook?.metrics?.rate, className: 'rate-bg' },
])

const nodeMetrics: ComputedRef<Array<NodeMetrics>> = computed(() => {
  const nodeMetricsData = props.exhook?.node_metrics
  return Array.isArray(nodeMetricsData) ? nodeMetricsData : []
})

const nodeMetricsTableData: ComputedRef<Array<NodeMetrics & { status: string }>> = computed(() => {
  const nodeStatus = props.exhook?.node_status || []
  return nodeMetrics.value.map(({ node, metrics }) => {
    const status = nodeStatus.find((item) => item.node === node)?.status || 'disabled'
    return {
      node,
      metrics,
      status,
    }
  })
})

const { statusText, statusTextClass } = useExhookItemStatus()
</script>
