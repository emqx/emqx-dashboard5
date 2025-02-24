<template>
  <div class="resource-item-overview">
    <OverviewMetrics
      :totals="{
        authn: 'total',
        authz: 'total',
      }"
      :request-metrics="getAuthMetrics"
      :type-metrics-maps="getMetricsTypes()"
      :text-map="isAuthn ? authnTextMap : authzTextMap"
      :rate-metrics="rateData"
      show-rate
      :node-status-desc="
        $t('Auth.nodeStatusDesc', { target: isAuthn ? $t('Auth.authn') : $t('Auth.authz') })
      "
    >
      <template #table="{ data }">
        <el-table :data="nodeStatusTableData(data)">
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
          <el-table-column prop="metrics.rate" :label="`${$t('Base.rateNow')} (QPS)`" />
        </el-table>
      </template>
    </OverviewMetrics>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'AuthItemOverview',
})
</script>

<script setup lang="ts">
import { queryAuthnItemMetrics, queryAuthzItemMetrics } from '@/api/auth'
import { Metrics } from '@/types/auth'
import { MetricsData } from '@/types/common'
import { ConnectionStatus } from '@/types/enum'

const props = defineProps({
  metrics: {
    type: Object as PropType<Metrics>,
    required: true,
  },
  type: {
    type: String as PropType<'authn' | 'authz'>,
  },
  refreshLoading: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()

const isAuthn = computed(() => props.type === 'authn')

const { authnTextMap, authzTextMap, authnTypeMetricsMap, authzTypeMetricsMap, rateData } =
  useAuthMetrics()

const getAuthMetrics = async () => {
  try {
    // Authn Qurey
    if (isAuthn.value) {
      const authId = route.params.id as string
      if (!authId) {
        return
      }
      return queryAuthnItemMetrics(authId)
    }
    // Authz Query
    const authzType = route.params.type as string
    if (!authzType) {
      return
    }
    return queryAuthzItemMetrics(authzType)
  } catch (error) {
    // ignore error
  }
}

const { getStatusLabel: getLabelByStatusValue, getStatusClass } = useCommonConnectionStatus()

const nodeConnectingStatusMap: Ref<Record<string, boolean>> = ref({})

const nodeStatus = computed(() => {
  const nodeStatusData = props.metrics?.node_status
  return Array.isArray(nodeStatusData) ? nodeStatusData : []
})

const nodeStatusTableData = ({ node_metrics }: MetricsData) => {
  return node_metrics.map(({ node, metrics }) => {
    const status =
      nodeStatus.value.find((item) => item.node === node)?.status || ConnectionStatus.Disconnected
    return {
      node,
      metrics,
      status,
    }
  })
}

const { tl } = useI18nTl('RuleEngine')

const setNodeConnectingStatusMap = () => {
  nodeConnectingStatusMap.value = props.metrics.node_status.reduce((obj, nodeStatusItem) => {
    return {
      ...obj,
      [nodeStatusItem.node]: false,
    }
  }, {})
}

watch(() => props.metrics, setNodeConnectingStatusMap)

const getMetricsTypes = () =>
  isAuthn.value
    ? [
        {
          name: 'authn',
          data: authnTypeMetricsMap,
        },
      ]
    : [
        {
          name: 'authz',
          data: authzTypeMetricsMap,
        },
      ]
</script>

<style lang="scss" scoped>
@use '@/style/rule.scss';
</style>
