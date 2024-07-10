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
          children: [
            {
              name: 'action',
              data: actionTypeMetricsMap,
            },
          ],
        },
      ]"
      :text-map="textMap"
      :rate-metrics="rateData"
      show-rate
      :node-status-desc="tl('nodeStatusRuleDesc')"
    >
      <template #table="{ data }">
        <el-table :data="data.node_metrics">
          <el-table-column prop="node" :label="tl('name')" />
          <el-table-column prop="metrics.matched">
            <template #header>
              <span>{{ tl('ruleMatched') }}</span>
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
              <InfoTooltip :content="tl('failedExceptionDesc')" />
            </template>
          </el-table-column>
          <el-table-column prop="metrics['failed.no_result']">
            <template #header>
              <span>{{ tl('failedNoResult') }}</span>
              <InfoTooltip :content="tl('failedNoResultDesc')" />
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
import { queryRuleMetrics, resetRuleMetrics } from '@/api/ruleengine'
import InfoTooltip from '@/components/InfoTooltip.vue'
import OverviewMetrics from '@/components/Metrics/OverviewMetrics.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { useRuleMetrics } from '@/hooks/useMetrics'
import { lowerCase } from 'lodash'
import { defineProps } from 'vue'

const props = defineProps({
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
</script>
