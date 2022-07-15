<template>
  <div class="resource-item-overview">
    <h2>{{ tl('executionStatistics') }}</h2>
    <el-row :gutter="28">
      <el-col :span="6">
        <el-card class="success-bg">
          <p class="statistic-label">{{ tl('SuccessNum') }}</p>
          <p class="statistic-num">
            {{ formatNumber(isAuthn ? metrics?.metrics?.success : metrics?.metrics?.allow) }}
          </p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="failed-bg">
          <p class="statistic-label">{{ tl('ErrNum') }}</p>
          <p class="statistic-num">
            {{ formatNumber(isAuthn ? metrics?.metrics?.failed : metrics?.metrics?.deny) }}
          </p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="matched-bg">
          <p class="statistic-label">{{ tl('noMatch') }}</p>
          <p class="statistic-num">
            {{ formatNumber(metrics?.metrics?.nomatch) }}
          </p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="rate-bg">
          <p class="statistic-label">{{ tl('speedNow') }}<span class="unit">(tps)</span></p>
          <p class="statistic-num">
            <span>{{ formatNumber(metrics?.metrics?.rate) }}</span>
          </p>
        </el-card>
      </el-col>
    </el-row>
    <h2>{{ tl('nodeStatus') }}</h2>
    <p class="card-sub-desc">{{ nodeStatusDesc }}</p>
    <el-table :data="nodeStatusTableData">
      <el-table-column prop="node" :label="tl('name')" />
      <el-table-column :label="$t('Auth.status')">
        <template #default="{ row }">
          <span class="text-status" :class="getStatusClass(row.status)">
            {{ getLabelByStatusValue(row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :prop="isAuthn ? 'metrics.success' : 'metrics.allow'"
        :label="tl('success')"
      />
      <el-table-column :prop="isAuthn ? 'metrics.failed' : 'metrics.deny'" :label="tl('ErrNum')" />
      <el-table-column prop="metrics.rate" :label="`${tl('speedNow')}(tps)`" />
    </el-table>
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

const isAuthn = computed(() => props.type === 'authn')

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
      isAuthn.value ? t('components.authentication') : t('components.authorization'),
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
