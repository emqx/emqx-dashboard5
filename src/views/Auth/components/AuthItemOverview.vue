<template>
  <div class="resource-item-overview">
    <div class="overview-sub-block">
      <div class="overview-header">
        <h2>{{ tl('executionStatistics') }}</h2>
        <el-button type="primary" :loading="refreshLoading" @click="handleRefresh">
          {{ $t('Base.refresh') }}
        </el-button>
      </div>
      <TargetDetailMetrics :metrics="metricsData" />
    </div>
    <div class="overview-sub-block">
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
        <el-table-column
          :prop="isAuthn ? 'metrics.failed' : 'metrics.deny'"
          :label="tl('ErrNum')"
        />
        <el-table-column prop="metrics.rate" :label="`${tl('speedNow')}(tps)`" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthItemOverview',
})
</script>

<script setup lang="ts">
import { defineProps, PropType, computed, ref, Ref, watch, defineEmits } from 'vue'
import { ConnectionStatus } from '@/types/enum'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import { Metrics } from '@/types/auth'
import useI18nTl from '@/hooks/useI18nTl'
import { upperFirst } from 'lodash'
import TargetDetailMetrics from '@/components/TargetDetailMetrics.vue'

const props = defineProps({
  metrics: {
    type: Object as PropType<Metrics>,
  },
  type: {
    type: String as PropType<'authn' | 'authz'>,
  },
  refreshLoading: {
    type: Boolean,
    defalut: false,
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

const metricsData = computed(() => [
  {
    label: tl('SuccessNum'),
    value: isAuthn.value ? props.metrics?.metrics?.success : props.metrics?.metrics?.allow,
    className: 'success-bg',
  },
  {
    label: tl('ErrNum'),
    value: isAuthn.value ? props.metrics?.metrics?.failed : props.metrics?.metrics?.deny,
    className: 'failed-bg',
  },
  {
    label: tl('noMatch'),
    value: props.metrics?.metrics?.nomatch,
    className: 'matched-bg',
  },
  {
    label: `${tl('speedNow')}(tps)`,
    value: props.metrics?.metrics?.rate,
    className: 'rate-bg',
  },
])

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
const emits = defineEmits(['refresh'])

const handleRefresh = () => {
  emits('refresh')
}

watch(() => props.metrics, setNodeConnectingStatusMap)
</script>

<style lang="scss" scoped>
@import '~@/style/rule.scss';
</style>
