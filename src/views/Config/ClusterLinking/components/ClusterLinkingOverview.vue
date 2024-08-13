<template>
  <div class="resource-item-overview">
    <OverviewMetrics
      :totals="{ transform: 'matched' }"
      :request-metrics="getMetrics"
      :type-metrics-maps="[{ name: 'transform', data: transformMetricsMap }]"
      :text-map="transformMetricsTextMap"
      :rate-metrics="rateData"
      show-rate
      :node-status-desc="t('RuleEngine.transformNodesMetricsDesc')"
    >
      <template #table="{ data }">
        <el-table :data="nodeStatusTableData(data)">
          <el-table-column :label="tl('name')" prop="node" />
          <el-table-column :label="t('Base.success')" prop="metrics.succeeded" />
          <el-table-column :label="t('Base.failed')" prop="metrics.failed" />
          <el-table-column :label="t('Base.rateNow')" prop="metrics.rate" />
        </el-table>
      </template>
    </OverviewMetrics>
  </div>
</template>

<script setup lang="ts">
import { getClusterLinkingMetrics } from '@/api/cluster'
import OverviewMetrics from '@/components/Metrics/OverviewMetrics.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { useMessageTransformMetrics } from '@/hooks/useMetrics'
import { MetricsData } from '@/types/common'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import { defineProps } from 'vue'

const props = defineProps({
  linkingName: {
    type: String,
  },
})

const { transformMetricsMap, transformMetricsTextMap, rateData } = useMessageTransformMetrics()

const { tl, t } = useI18nTl('Base')

const nodeStatusTableData = (data: MetricsData) => {
  if (!data) {
    return []
  }
  return isEmptyObj(data.node_metrics) ? [] : data.node_metrics
}

const getMetrics = () => {
  if (!props.linkingName) {
    return
  }
  return getClusterLinkingMetrics(props.linkingName)
}
</script>
