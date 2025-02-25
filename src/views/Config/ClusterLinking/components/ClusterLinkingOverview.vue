<template>
  <div class="resource-item-overview">
    <OverviewMetrics
      :totals="{ forwarding: 'forwarding.matched' }"
      :request-metrics="getMetrics"
      :request-reset="resetMetrics"
      :type-metrics-maps="[
        {
          name: 'forwarding',
          data: linkingMetricsMap,
          children: [
            {
              name: 'other',
              data: linkingOtherMetricsMap,
            },
          ],
        },
      ]"
      :text-map="linkingMetricsTextMap"
      :rate-metrics="rateData"
      show-rate
      :node-status-desc="t('BasicConfig.linkingNodesMetricsDesc')"
      :children-title="t('BasicConfig.others')"
    >
      <template #table="{ data }">
        <el-table :data="nodeStatusTableData(data)">
          <el-table-column :label="tl('name')" prop="node" />
          <el-table-column :label="t('BasicConfig.routes')" prop="metrics.router.routes" />
          <el-table-column :label="t('BasicConfig.matched')" prop="metrics.forwarding.matched" />
          <el-table-column :label="t('RuleEngine.success')" prop="metrics.forwarding.success" />
          <el-table-column :label="t('Base.failed')" prop="metrics.forwarding.failed" />
          <el-table-column :label="t('BasicConfig.dropped')" prop="metrics.forwarding.dropped" />
          <el-table-column :label="t('BasicConfig.retried')" prop="metrics.forwarding.retried" />
          <el-table-column :label="t('Base.rate')" prop="metrics.forwarding.rate" />
        </el-table>
      </template>
    </OverviewMetrics>
  </div>
</template>

<script setup lang="ts">
import { getClusterLinkingMetrics, resetClusterLinkingMetrics } from '@/api/cluster'
import OverviewMetrics from '@/components/Metrics/OverviewMetrics.vue'

import { MetricsData } from '@/types/common'
import { isEmptyObj } from '@emqx/shared-ui-utils'

const props = defineProps({
  linkingName: {
    type: String,
  },
})

const { linkingMetricsMap, linkingOtherMetricsMap, linkingMetricsTextMap, rateData } =
  useClusterLinkingMetrics()

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

const resetMetrics = () => {
  if (!props.linkingName) {
    return
  }
  return resetClusterLinkingMetrics(props.linkingName)
}
</script>
