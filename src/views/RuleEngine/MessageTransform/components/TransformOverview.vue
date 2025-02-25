<template>
  <div class="resource-item-overview">
    <OverviewMetrics
      :totals="{ transform: 'matched' }"
      :request-metrics="getMetrics"
      :request-reset="resetMetrics"
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
import {
  getMessageTransformMetrics,
  resetMessageTransformMetrics,
} from '@/api/messageTransformation'
import { MetricsData } from '@/types/common'
import { isEmptyObj } from '@emqx/shared-ui-utils'

const props = defineProps({
  transformName: {
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
  if (!props.transformName) {
    return
  }
  return getMessageTransformMetrics(props.transformName)
}

const resetMetrics = () => {
  if (!props.transformName) {
    return
  }
  return resetMessageTransformMetrics(props.transformName)
}
</script>
