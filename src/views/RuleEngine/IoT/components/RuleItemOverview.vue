<template>
  <div class="resource-item-overview">
    <div class="overview-header">
      <h2 class="block-title">{{ tl('executionStatistics') }}</h2>
      <div>
        <el-button type="primary" @click="getRuleMetricsData">
          {{ $t('Base.refresh') }}
        </el-button>
        <el-button type="primary" plain @click="resetStatistics">
          {{ tl('resetStatistics') }}
        </el-button>
      </div>
    </div>
    <div class="overview-sub-block">
      <!-- <p class="card-sub-desc">{{ tl('lastResetTime') }}: TODO:</p> -->
      <TargetDetailMetrics class="rule-statistic" :metrics="runningStatistics" />
    </div>
    <div class="overview-sub-block">
      <div class="card-hd">
        <h2 class="block-title">{{ tl('actionsStatistics') }}</h2>
      </div>
      <TargetDetailMetrics class="rule-statistic" :metrics="actionStatistics" />
    </div>
    <div class="overview-sub-block">
      <div class="card-hd">
        <h3 class="block-title">{{ tl('nodeStatus') }}</h3>
      </div>
      <p class="card-sub-desc">{{ tl('nodeStatusRuleDesc') }}</p>
      <el-table :data="nodeMetrics" class="shadow-none">
        <el-table-column prop="node" :label="tl('name')" />
        <el-table-column prop="metrics.matched">
          <template #header>
            <span>{{ tl('matched') }}</span>
            <InfoTooltip :content="tl('sqlMatchedDesc')" />
          </template>
        </el-table-column>
        <el-table-column prop="metrics.passed">
          <template #header>
            <span>{{ tl('sqlPassed') }}</span>
            <InfoTooltip :content="tl('sqlPassedDesc')" />
          </template>
        </el-table-column>

        <el-table-column prop="metrics['failed.exception']">
          <template #header>
            <span>{{ tl('sqlFailed') }}</span>
            <InfoTooltip :content="tl('sqlFailedDesc')" />
          </template>
        </el-table-column>
        <el-table-column prop="metrics['failed.no_result']">
          <template #header>
            <span>{{ tl('sqlNoResult') }}</span>
            <InfoTooltip :content="tl('sqlNoResultDesc')" />
          </template>
        </el-table-column>
        <el-table-column prop="metrics['matched.rate']">
          <template #header>
            <p>{{ tl('executionSpeed') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
        </el-table-column>

        <el-table-column prop="metrics['matched.rate.last5m']">
          <template #header>
            <p>{{ tl('rateLast5M') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
        </el-table-column>
        <el-table-column prop="metrics['matched.rate.max']">
          <template #header>
            <p>{{ tl('rateMax') }}</p>
            <p>({{ t('RuleEngine.rateUnit', 0) }})</p>
          </template>
        </el-table-column>
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
import { defineProps, PropType, computed, onMounted, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RuleItem, RuleMetrics } from '@/types/rule'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { queryRuleMetrics, resetRuleMetrics } from '@/api/ruleengine'
import { ElMessage, ElMessageBox } from 'element-plus'
import TargetDetailMetrics from '@/components/TargetDetailMetrics.vue'

const props = defineProps({
  ruleMsg: {
    type: Object as PropType<RuleItem>,
  },
  ruleId: {
    type: String,
    required: true,
  },
})

const ruleMetrics: Ref<RuleMetrics> = ref({
  id: '',
  metrics: {},
  node_metrics: [],
})

const runningStatistics = computed(() => [
  {
    label: tl('matched'),
    desc: tl('sqlMatchedDesc'),
    value: ruleMetrics.value.metrics['matched'],
    className: 'success-bg',
  },
  {
    label: tl('sqlPassed'),
    desc: tl('sqlPassedDesc'),
    value: ruleMetrics.value.metrics['passed'],
    className: 'matched-bg',
  },
  {
    label: tl('sqlFailed'),
    desc: tl('sqlFailedDesc'),
    value: ruleMetrics.value.metrics['failed.exception'],
    className: 'failed-bg',
  },
  {
    label: tl('sqlNoResult'),
    desc: tl('sqlNoResultDesc'),
    value: ruleMetrics.value.metrics['failed.no_result'],
    className: 'no-result-bg',
  },
  {
    label: tl('executionSpeed'),
    value: ruleMetrics.value.metrics['matched.rate'],
    className: 'rate-bg',
    unit: t('RuleEngine.rateUnit', 0),
  },
  {
    label: tl('rateLast5M'),
    value: ruleMetrics.value.metrics['matched.rate.last5m'],
    className: 'last-five-rate-bg',
    unit: t('RuleEngine.rateUnit', 0),
  },
  {
    label: tl('rateMax'),
    value: ruleMetrics.value.metrics['matched.rate.max'],
    className: 'max-rate-bg',
    unit: t('RuleEngine.rateUnit', 0),
  },
])

const actionStatistics = computed(() => [
  {
    label: tl('success'),
    desc: tl('actionSuccessDesc'),
    value: ruleMetrics.value.metrics['actions.success'],
    className: 'success-bg',
  },
  {
    label: tl('ErrNum'),
    desc: tl('actionFailedDesc'),
    value: ruleMetrics.value.metrics['actions.failed'],
    className: 'failed-bg',
  },
  {
    label: tl('total'),
    desc: tl('actionTotalDesc'),
    value: ruleMetrics.value.metrics['actions.total'],
    className: 'rate-bg',
  },
  {
    label: tl('outOfService'),
    desc: tl('actionOutOfServiceDesc'),
    value: ruleMetrics.value.metrics['actions.failed.out_of_service'],
    className: 'failed-bg',
  },
  {
    label: tl('unknown'),
    desc: tl('actionUnknownDesc'),
    value: ruleMetrics.value.metrics['actions.failed.unknown'],
    className: 'max-rate-bg',
  },
])

const nodeMetrics = computed(() => {
  const nodeMetricsData = ruleMetrics.value.node_metrics
  return Array.isArray(nodeMetricsData) ? nodeMetricsData : []
})

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const getRuleMetricsData = async () => {
  try {
    if (!props.ruleId) {
      return
    }
    ruleMetrics.value = await queryRuleMetrics(props.ruleId)
  } catch (error) {
    //
  }
}

const resetStatistics = async () => {
  if (!props.ruleId) {
    return
  }
  try {
    await ElMessageBox.confirm(t('RuleEngine.resetMetricsConfirm', { target: tl('rule') }))
    await resetRuleMetrics(props.ruleId)
    ElMessage.success(tl('resetSuccessfully'))
    getRuleMetricsData()
  } catch (error) {
    //
  }
}

onMounted(getRuleMetricsData)
</script>
