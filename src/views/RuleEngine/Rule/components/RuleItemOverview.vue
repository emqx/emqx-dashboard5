<template>
  <div class="resource-item-overview">
    <OverviewMetrics
      :totals="{
        rule: 'matched',
        action: 'actions.total',
      }"
      :title="lowerCase(tl('rule'))"
      :request-metrics="getRuleMetricsData"
      :request-reset="resetMetrics"
      :type-metrics-maps="[
        {
          name: 'rule',
          data: ruleTypeMetricsMap,
        },
        {
          name: 'action',
          data: actionTypeMetricsMap,
        },
      ]"
      :text-map="textMap"
      :rate-metrics="rateData"
      show-rate
    >
      <template #table="{ data }">
        <el-table :data="data.node_metrics">
          <el-table-column prop="node" :label="tl('name')" />
          <el-table-column prop="metrics.matched">
            <template #header>
              <span>{{ tl('matched') }}</span>
              <InfoTooltip :content="tl('sqlMatchedDesc')" />
            </template>
          </el-table-column>
          <el-table-column prop="metrics.passed">
            <template #header>
              <span>{{ tl('passed') }}</span>
              <InfoTooltip :content="tl('passedDesc')" />
            </template>
          </el-table-column>

          <el-table-column prop="metrics['failed.exception']">
            <template #header>
              <span>{{ $t('Base.failed') }}</span>
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
              <p>{{ $t('Base.rate') }}</p>
              <p>({{ $t('RuleEngine.rateUnit', 0) }})</p>
            </template>
          </el-table-column>

          <el-table-column prop="metrics['matched.rate.last5m']">
            <template #header>
              <p>{{ $t('Base.rateLast5M') }}</p>
              <p>({{ $t('RuleEngine.rateUnit', 0) }})</p>
            </template>
          </el-table-column>
          <el-table-column prop="metrics['matched.rate.max']">
            <template #header>
              <p>{{ $t('Base.rateMax') }}</p>
              <p>({{ $t('RuleEngine.rateUnit', 0) }})</p>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </OverviewMetrics>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleItemOverview',
})
</script>

<script setup lang="ts">
import { defineProps, PropType, onMounted } from 'vue'
import { RuleItem } from '@/types/rule'
import InfoTooltip from '@/components/InfoTooltip.vue'
import { queryRuleMetrics, resetRuleMetrics } from '@/api/ruleengine'
import OverviewMetrics from '@/components/Metrics/OverviewMetrics.vue'
import { lowerCase } from 'lodash'
import { useRuleMetrics } from '@/hooks/useMetrics'
import useI18nTl from '@/hooks/useI18nTl'

const props = defineProps({
  ruleMsg: {
    type: Object as PropType<RuleItem>,
  },
  ruleId: {
    type: String,
    required: true,
  },
})

const { ruleTypeMetricsMap, actionTypeMetricsMap, textMap, rateData } = useRuleMetrics()

const { tl } = useI18nTl('RuleEngine')

const getRuleMetricsData = async () => {
  try {
    if (!props.ruleId) {
      return
    }
    return queryRuleMetrics(props.ruleId)
  } catch (error) {
    //
  }
}

const resetMetrics = () => {
  if (!props.ruleId) {
    return
  }
  return resetRuleMetrics(props.ruleId)
}

onMounted(getRuleMetricsData)
</script>
