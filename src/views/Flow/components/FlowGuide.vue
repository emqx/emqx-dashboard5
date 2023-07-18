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
  >
    <template #node-guide="data">
      <FlowGuideNode :data="data" />
    </template>
  </VueFlow>
</template>

<script setup lang="ts">
import { createRandomString, waitAMoment } from '@/common/tools'
import useFlowGuideNodes from '@/hooks/Flow/useFlowGuideNodes'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { onMounted, ref } from 'vue'
import FlowGuideNode from './FlowGuideNode.vue'

const flowId = createRandomString()

const FlowInstance = ref()

useVueFlow({ id: flowId })

const { guideFlowData } = useFlowGuideNodes()

onMounted(async () => {
  FlowInstance.value.fitView()
  await waitAMoment(70)
})
</script>

<style lang="scss">
.flow-guide {
  .vue-flow__node {
    cursor: default;
  }
}
</style>
