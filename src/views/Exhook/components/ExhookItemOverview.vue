<template>
  <div class="resource-item-overview exhook-item-overview">
    <OverviewMetrics
      :request-metrics="getHooksMetricsData"
      :type-metrics-maps="[
        {
          name: 'exhook',
          data: exHooksTypeMetricsMap,
        },
      ]"
      :text-map="textMap"
      :rate-metrics="rateData"
      show-rate
      :node-status-desc="tl('nodeStatusDesc')"
    >
      <template #table="{ data }">
        <el-table :data="nodeStatusTableData(data)">
          <el-table-column :label="tl('name')" prop="node" />
          <el-table-column :label="t('Base.success')" prop="metrics.succeed" />
          <el-table-column :label="t('Base.failed')" prop="metrics.failed" />
          <el-table-column :label="t('Base.rateNow')" prop="metrics.rate" />
          <el-table-column :label="t('Base.rateMax')" prop="metrics.max_rate" />
          <el-table-column :label="t('Base.status')">
            <template #default="{ row }">
              <span class="text-status" :class="statusTextClass(row.status)">
                {{ statusText(row.status) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </OverviewMetrics>
  </div>
</template>

<script setup lang="ts">
import { MetricsData } from '@/types/common'
import { Exhook } from '@/types/systemModule'
import { queryExhookDetail } from '@/api/exhook'
import { isEmptyObj } from '@emqx/shared-ui-utils'

const props = defineProps({
  exhook: {
    type: Object as PropType<Exhook>,
  },
  exhookName: {
    type: String,
  },
})

const { textMap, exHooksTypeMetricsMap, rateData } = useExHooksMetrics()

const { tl, t } = useI18nTl('Exhook')

const nodeStatusTableData = (data: MetricsData) => {
  if (!data) {
    return []
  }
  const { node_metrics } = data
  if (isEmptyObj(node_metrics)) {
    return []
  }
  const nodeStatus = props.exhook?.node_status || []
  return node_metrics.map(({ node, metrics }) => {
    const status = nodeStatus.find((item) => item.node === node)?.status || 'disabled'
    return {
      node,
      metrics,
      status,
    }
  })
}

const { statusText, statusTextClass } = useExhookItemStatus()

const getHooksMetricsData = () => {
  try {
    if (!props.exhookName) {
      return
    }
    return queryExhookDetail(props.exhookName)
  } catch (error) {
    //
  }
}
</script>
