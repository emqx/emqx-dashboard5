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
import { MetricType } from '@/hooks/useMetrics'
import { lowerCase } from 'lodash'
import { defineProps } from 'vue'

const props = defineProps({
  bridgeId: {
    type: String,
  },
})

const { tl } = useI18nTl('RuleEngine')
const typeMetricsMap = {
  [MetricType.Green]: { title: tl('success'), contains: ['success', 'matched', 'received'] },
  [MetricType.Blue]: { title: 'Processing', contains: ['queuing'] },
  [MetricType.Red]: { title: tl('sqlFailed'), contains: ['failed', 'inflight', 'late_reply'] },
  [MetricType.Gray]: {
    title: tl('dropped'),
    contains: [
      'dropped',
      'dropped.expired',
      'dropped.other',
      'dropped.queue_full',
      'dropped.resource_not_found',
      'dropped.resource_stopped',
    ],
  },
}
const textMap = {
  matched: { label: tl('matched'), desc: tl('bridgeMatchedDesc') },
  success: { label: tl('sentSuccessfully'), desc: tl('sentSuccessfullyDesc') },
  failed: { label: tl('sentFailed'), desc: tl('sentFailedDesc') },
  inflight: { label: tl('sentInflight'), desc: tl('sentInflightDesc') },
  late_reply: { label: tl('lateReply'), desc: tl('lateReplyDesc') },
  dropped: { label: tl('dropped'), desc: tl('droppedDesc') },
  queuing: { label: tl('queuing'), desc: tl('queuingDesc') },
  retried: { label: tl('retried'), desc: tl('retriedDesc') },
  rate: { label: tl('rateNow'), desc: tl('rateBarDesc') },
  rate_max: { label: tl('rateMax') },
  rate_last5m: { label: tl('rateLast5M') },
}

const rateData = {
  unitKey: 'RuleEngine.rateUnit',
  current: 'rate',
  right1: 'rate_last5m',
  right2: 'rate_max',
}

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
