<template>
  <Metrics
    total="matched"
    :title="lowerCase(tl('dataBridge'))"
    :request-metrics="getBridgeMetrics"
    :request-reset="resetMetrics"
    :type-metrics-map="typeMetricsMap"
    :text-map="textMap"
    :rate-metrics="rateData"
  />
</template>

<script setup lang="ts">
import { queryBridgeMetrics, resetBridgeMetrics } from '@/api/ruleengine'
import Metrics from '@/components/Metrics/Metrics.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { useBridgeMetrics } from '@/hooks/useMetrics'
import { lowerCase } from 'lodash'
import { defineProps } from 'vue'

const props = defineProps({
  bridgeId: {
    type: String,
  },
})

const { tl } = useI18nTl('RuleEngine')

const { typeMetricsMap, textMap, rateData } = useBridgeMetrics()

const getBridgeMetrics = async () => {
  try {
    if (!props.bridgeId) {
      return
    }
    return queryBridgeMetrics(props.bridgeId)
  } catch (error) {
    //
  }
}

const resetMetrics = async () => {
  if (!props.bridgeId) {
    return
  }
  return resetBridgeMetrics(props.bridgeId)
}
</script>
