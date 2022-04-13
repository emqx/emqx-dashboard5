<template>
  <div class="resource-item-overview">
    <el-card class="app-card detail-sub-card">
      <div class="card-hd">
        <h6 class="block-title">{{ tl('executionStatistics') }}</h6>
        <el-tooltip effect="dark" :content="tl('resetStatistics')" placement="top-start">
          <el-icon @click="resetStatistics"><refresh-left /></el-icon>
        </el-tooltip>
      </div>
      <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
      <el-row class="rule-statistic">
        <el-col :span="6">
          <p class="statistic-label">
            <span>{{ tl('sqlMatched') }}</span>
            <InfoTooltip :content="tl('sqlMatchedDesc')" />
          </p>
          <p class="statistic-num">{{ formatNumber(ruleMetrics['sql.matched']) }}</p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">
            <span>{{ tl('sqlPassed') }}</span>
            <InfoTooltip :content="tl('sqlPassedDesc')" />
          </p>
          <p class="statistic-num">{{ formatNumber(ruleMetrics['sql.passed']) }}</p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">
            <span>{{ tl('sqlFailed') }}</span>
            <InfoTooltip :content="tl('sqlFailedDesc')" />
          </p>
          <p class="statistic-num">{{ formatNumber(ruleMetrics['sql.failed.exception']) }}</p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">
            <span>{{ tl('sqlNoResult') }}</span>
            <InfoTooltip :content="tl('sqlNoResultDesc')" />
          </p>
          <p class="statistic-num">{{ formatNumber(ruleMetrics['sql.failed.no_result']) }}</p>
        </el-col>

        <el-col :span="6">
          <p class="statistic-label">{{ tl('executionSpeed') }}</p>
          <p class="statistic-num">
            {{ formatNumber(ruleMetrics['sql.matched.rate']) }}
            <span class="unit">msg/s</span>
          </p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">{{ tl('rateLast5M') }}</p>
          <p class="statistic-num">
            {{ formatNumber(ruleMetrics['sql.matched.rate.last5m']) }}
            <span class="unit">msg/s</span>
          </p>
        </el-col>
        <el-col :span="6">
          <p class="statistic-label">{{ tl('rateMax') }}</p>
          <p class="statistic-num">
            {{ formatNumber(ruleMetrics['sql.matched.rate.max']) }}
            <span class="unit">msg/s</span>
          </p>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="app-card detail-sub-card">
      <div class="card-hd">
        <h6 class="block-title">{{ tl('executionStatistics') }}</h6>
      </div>
      <p class="card-sub-desc">{{ tl('nodeStatusDesc') }}</p>
      <el-table :data="nodeStatusTableData">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column>
          <template #header>
            <span>{{ tl('sqlMatched') }}</span>
            <InfoTooltip :content="tl('sqlMatchedDesc')" />
          </template>
          <template #default="{ row }">
            {{ row.metrics['sql.matched'] }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span>{{ tl('sqlPassed') }}</span>
            <InfoTooltip :content="tl('sqlPassedDesc')" />
          </template>
          <template #default="{ row }">
            {{ row.metrics['sql.passed'] }}
          </template>
        </el-table-column>

        <el-table-column>
          <template #header>
            <span>{{ tl('sqlFailed') }}</span>
            <InfoTooltip :content="tl('sqlFailedDesc')" />
          </template>
          <template #default="{ row }">
            {{ row.metrics['sql.failed.exception'] }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span>{{ tl('sqlNoResult') }}</span>
            <InfoTooltip :content="tl('sqlNoResultDesc')" />
          </template>
          <template #default="{ row }">
            {{ row.metrics['sql.failed.no_result'] }}
          </template>
        </el-table-column>
        <el-table-column :label="`${tl('executionSpeed')}(mgs/s)`">
          <template #default="{ row }">
            {{ row.metrics['sql.matched.rate'] }}
          </template>
        </el-table-column>

        <el-table-column :label="`${tl('rateLast5M')}(mgs/s)`">
          <template #default="{ row }">
            {{ row.metrics['sql.matched.rate.last5m'] }}
          </template>
        </el-table-column>
        <el-table-column :label="`${tl('rateMax')}(mgs/s)`">
          <template #default="{ row }">
            {{ row.metrics['sql.matched.rate.max'] }}
          </template>
        </el-table-column>
        <!-- <el-table-column :label="tl('status')">
          <template #default="{ row }">
            <span class="text-status" :class="row.enable ? 'success' : 'danger'">
              {{ row.enable ? tl('enable', 'Base') : tl('disable', 'Base') }}
            </span>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleItemOverview',
})
</script>

<script setup lang="ts">
import { defineProps, PropType, defineEmits, computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { RefreshLeft } from '@element-plus/icons-vue'
import { RuleItem, NodeMetrics, NodeStatus, Metrics } from '@/types/rule'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { formatNumber } from '@/common/tools'
import { resetRuleMetrics } from '@/api/ruleengine'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  ruleMsg: {
    type: Object as PropType<RuleItem>,
    required: true,
  },
})

const emit = defineEmits(['reset', 'reconnect'])

const ruleMetrics: ComputedRef<Metrics> = computed(() => {
  const { metrics } = props.ruleMsg
  return metrics || {}
})

const nodeStatus: ComputedRef<Array<NodeStatus>> = computed(() => {
  return []
  // const nodeStatusData = props.ruleMsg?.node_status
  // return Array.isArray(nodeStatusData) ? nodeStatusData : []
})

const nodeMetrics: ComputedRef<Array<NodeMetrics>> = computed(() => {
  const nodeMetricsData = props.ruleMsg?.node_metrics
  return Array.isArray(nodeMetricsData) ? nodeMetricsData : []
})

const nodeStatusTableData: ComputedRef<Array<NodeMetrics & { enable: boolean }>> = computed(() => {
  return nodeMetrics.value.map(({ node, metrics }) => {
    const enable = nodeStatus.value.find((item) => item.node === node)?.status || false
    return {
      node,
      metrics,
      enable,
    } as NodeMetrics & { enable: boolean }
  })
})

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const resetStatistics = async () => {
  if (!props.ruleMsg.id) {
    return
  }
  await ElMessageBox.confirm(t('RuleEngine.resetMetricsConfirm', { target: tl('rule') }))
  await resetRuleMetrics(props.ruleMsg.id)
  ElMessage.success(tl('resetSuccessfully'))
  emit('reset')
}
</script>
