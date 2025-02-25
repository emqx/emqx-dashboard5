<template>
  <div class="resource-item-overview">
    <OverviewMetrics
      :totals="{ validation: 'matched' }"
      :request-metrics="getMetrics"
      :request-reset="resetMetrics"
      :type-metrics-maps="[{ name: 'validation', data: schemaValidationMetricsMap }]"
      :text-map="validationMetricsTextMap"
      :rate-metrics="rateData"
      show-rate
      :node-status-desc="t('RuleEngine.validationNodesMetricsDesc')"
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
import { MetricsData } from '@/types/common'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import { getValidationMetrics, resetValidationMetrics } from '@/api/schemaValidation'

const props = defineProps({
  validationName: {
    type: String,
  },
})

const { schemaValidationMetricsMap, validationMetricsTextMap, rateData } =
  useSchemaValidationMetrics()

const { tl, t } = useI18nTl('Base')

const nodeStatusTableData = (data: MetricsData) => {
  if (!data) {
    return []
  }
  return isEmptyObj(data.node_metrics) ? [] : data.node_metrics
}

const getMetrics = () => {
  if (!props.validationName) {
    return
  }
  return getValidationMetrics(props.validationName)
}

const resetMetrics = () => {
  if (!props.validationName) {
    return
  }
  return resetValidationMetrics(props.validationName)
}
</script>
