<template>
  <div class="flow-view">
    <VueFlow class="editor" ref="FlowerInstance" v-model="flowData" @node-click="handleClickNode">
      <template #node-custom_input="data"><FlowNode :data="data" /></template>
      <template #node-custom_default="data"><FlowNode :data="data" /></template>
      <template #node-custom_output="data"><FlowNode :data="data" /></template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import useFlowView from '@/hooks/Flow/useFlowView'
import { VueFlow } from '@vue-flow/core'
import { defineEmits, onMounted, ref } from 'vue'
import FlowNode from './FlowNode.vue'

const emit = defineEmits(['loaded'])

const FlowerInstance = ref()

const { flowData, getFlowData } = useFlowView()

const handleClickNode = () => {
  // TODO:
}

onMounted(async () => {
  try {
    await getFlowData()
    if (flowData.value.length > 0) {
      FlowerInstance.value?.fitView()
    }
  } catch (error) {
    //
  } finally {
    emit('loaded', flowData.value.length)
  }
})
</script>

<style lang="scss"></style>
