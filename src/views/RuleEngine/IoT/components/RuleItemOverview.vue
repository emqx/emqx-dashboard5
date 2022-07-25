<template>
  <div class="resource-item-overview">
    <div class="overview-header">
      <h2 class="block-title">{{ tl('executionStatistics') }}</h2>
      <div>
        <el-button type="primary" plain @click="handleRefresh">
          {{ $t('Base.refresh') }}
        </el-button>
        <el-button type="primary" @click="resetStatistics">
          {{ tl('resetStatistics') }}
        </el-button>
      </div>
    </div>
    <div class="overview-sub-block">
      <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
      <el-row class="rule-statistic" :gutter="28">
        <el-col :span="6">
          <el-card class="success-bg">
            <p class="statistic-label">
              <span>{{ tl('sqlMatched') }}</span>
              <InfoTooltip :content="tl('sqlMatchedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(ruleMetrics['matched']) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="matched-bg">
            <p class="statistic-label">
              <span>{{ tl('sqlPassed') }}</span>
              <InfoTooltip :content="tl('sqlPassedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(ruleMetrics['passed']) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="failed-bg">
            <p class="statistic-label">
              <span>{{ tl('sqlFailed') }}</span>
              <InfoTooltip :content="tl('sqlFailedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(ruleMetrics['failed.exception']) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="no-result-bg">
            <p class="statistic-label">
              <span>{{ tl('sqlNoResult') }}</span>
              <InfoTooltip :content="tl('sqlNoResultDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(ruleMetrics['failed.no_result']) }}</p>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="rate-bg">
            <p class="statistic-label">{{ tl('executionSpeed') }}</p>
            <p class="statistic-num">
              {{ formatNumber(ruleMetrics['matched.rate']) }}
              <span class="unit">msg/s</span>
            </p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="last-five-rate-bg">
            <p class="statistic-label">{{ tl('rateLast5M') }}</p>
            <p class="statistic-num">
              {{ formatNumber(ruleMetrics['matched.rate.last5m']) }}
              <span class="unit">msg/s</span>
            </p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="max-rate-bg">
            <p class="statistic-label">{{ tl('rateMax') }}</p>
            <p class="statistic-num">
              {{ formatNumber(ruleMetrics['matched.rate.max']) }}
              <span class="unit">msg/s</span>
            </p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="overview-sub-block">
      <div class="card-hd">
        <h2 class="block-title">{{ tl('resultsStatistics') }}</h2>
      </div>
      <el-row class="rule-statistic" :gutter="28">
        <el-col :span="6">
          <el-card class="success-bg">
            <p class="statistic-label">
              <span>{{ tl('success') }}</span>
              <InfoTooltip :content="tl('actionSuccessDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(ruleMetrics['actions.success']) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="failed-bg">
            <p class="statistic-label">
              <span>{{ tl('ErrNum') }}</span>
              <InfoTooltip :content="tl('actionFailedDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(ruleMetrics['actions.failed']) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="rate-bg">
            <p class="statistic-label">
              <span>{{ tl('total') }}</span>
              <InfoTooltip :content="tl('actionTotalDesc')" />
            </p>
            <p class="statistic-num">{{ formatNumber(ruleMetrics['actions.total']) }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="failed-bg">
            <p class="statistic-label">
              <span>{{ tl('outOfService') }}</span>
              <InfoTooltip :content="tl('actionOutOfServiceDesc')" />
            </p>
            <p class="statistic-num">
              {{ formatNumber(ruleMetrics['actions.failed.out_of_service']) }}
            </p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="max-rate-bg">
            <p class="statistic-label">
              <span>{{ tl('unknown') }}</span>
              <InfoTooltip :content="tl('actionUnknownDesc')" />
            </p>
            <p class="statistic-num">
              {{ formatNumber(ruleMetrics['actions.failed.unknown']) }}
            </p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="overview-sub-block">
      <div class="card-hd">
        <h3 class="block-title">{{ tl('nodeStatus') }}</h3>
      </div>
      <p class="card-sub-desc">{{ tl('nodeStatusRuleDesc') }}</p>
      <el-table :data="nodeStatusTableData" class="shadow-none">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column>
          <template #header>
            <span>{{ tl('sqlMatched') }}</span>
            <InfoTooltip :content="tl('sqlMatchedDesc')" />
          </template>
          <template #default="{ row }">
            {{ row.metrics['matched'] }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span>{{ tl('sqlPassed') }}</span>
            <InfoTooltip :content="tl('sqlPassedDesc')" />
          </template>
          <template #default="{ row }">
            {{ row.metrics['passed'] }}
          </template>
        </el-table-column>

        <el-table-column>
          <template #header>
            <span>{{ tl('sqlFailed') }}</span>
            <InfoTooltip :content="tl('sqlFailedDesc')" />
          </template>
          <template #default="{ row }">
            {{ row.metrics['failed.exception'] }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <span>{{ tl('sqlNoResult') }}</span>
            <InfoTooltip :content="tl('sqlNoResultDesc')" />
          </template>
          <template #default="{ row }">
            {{ row.metrics['failed.no_result'] }}
          </template>
        </el-table-column>
        <el-table-column :label="`${tl('executionSpeed')}(mgs/s)`">
          <template #default="{ row }">
            {{ row.metrics['matched.rate'] }}
          </template>
        </el-table-column>

        <el-table-column :label="`${tl('rateLast5M')}(mgs/s)`">
          <template #default="{ row }">
            {{ row.metrics['matched.rate.last5m'] }}
          </template>
        </el-table-column>
        <el-table-column :label="`${tl('rateMax')}(mgs/s)`">
          <template #default="{ row }">
            {{ row.metrics['matched.rate.max'] }}
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
    </div>
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
import { CircleClose } from '@element-plus/icons-vue'
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

const emit = defineEmits(['reset', 'reconnect', 'refresh'])

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

const handleRefresh = () => {
  emit('refresh')
}

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
