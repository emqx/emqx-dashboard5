<template>
  <FlowGuide ref="FlowInstance" :guide-flow-data="guideFlowData" @vue:mounted="fitView" />
</template>

<script setup lang="ts">
import { FlowGuide, useFlowGuideNodes } from '@emqx/shared-ui-components'
import { useVueFlow } from '@vue-flow/core'

const flowId = createRandomString()

const FlowInstance = ref()

useVueFlow(flowId)

const { allGuideFlowData: guideFlowData } = useFlowGuideNodes()

const fitView = async () => {
  await waitAMoment(4)
  FlowInstance.value.fitView()
}
</script>
