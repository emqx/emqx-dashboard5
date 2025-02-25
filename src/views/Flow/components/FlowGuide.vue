<template>
  <VueFlow
    class="flow-guide"
    ref="FlowInstance"
    v-model="guideFlowData"
    :id="createRandomString()"
    :deleteKeyCode="null"
    :nodes-draggable="false"
    :nodes-connectable="false"
    :zoom-on-scroll="false"
    :zoom-on-double-click="false"
    :zoom-on-pinch="false"
    :pan-on-drag="false"
    :min-zoom="1"
    :max-zoom="1"
    @vue:mounted="fitView"
  >
    <template #node-guide="data">
      <FlowGuideNode :data="data" />
    </template>
  </VueFlow>
</template>

<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import FlowGuideNode from './FlowGuideNode.vue'

const flowId = createRandomString()

const FlowInstance = ref()

useVueFlow(flowId)

const { guideFlowData } = useFlowGuideNodes()

const fitView = async () => {
  await waitAMoment(4)
  FlowInstance.value.fitView()
}
</script>

<style lang="scss">
.flow-guide {
  position: relative;
  .vue-flow__node {
    cursor: default;
  }
}
</style>
