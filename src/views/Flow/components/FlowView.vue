<template>
  <div class="flow-view">
    <VueFlow class="editor" ref="FlowerInstance" v-model="flowData" @node-click="handleClickNode">
      <template #node-custom_input="data"><FlowNode :data="data" /></template>
      <template #node-custom_default="data"><FlowNode :data="data" /></template>
      <template #node-custom_output="data"><FlowNode :data="data" /></template>
    </VueFlow>
  </div>
  <NodeDrawer
    v-model="showDrawer"
    readonly
    :type="currentNode?.data?.specificType"
    :form-data="currentNode?.data?.formData"
    @edit="editCurrentNode"
  />
</template>

<script setup lang="ts">
import useFlowView from '@/hooks/Flow/useFlowView'
import { Node, NodeMouseEvent, VueFlow } from '@vue-flow/core'
import { Ref, defineEmits, onMounted, ref } from 'vue'
import FlowNode from './FlowNode.vue'
import NodeDrawer from './NodeDrawer.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const emit = defineEmits(['loaded'])

const FlowerInstance = ref()

const { flowData, getFlowData } = useFlowView()

const showDrawer = ref(false)
const currentNode: Ref<undefined | Node> = ref(undefined)
const handleClickNode = ({ node }: NodeMouseEvent) => {
  if (!node) {
    return
  }
  showDrawer.value = true
  currentNode.value = node
}

const editCurrentNode = () => {
  if (!currentNode.value) {
    return
  }
  const {
    data: { rulesUsed },
  } = currentNode.value
  if (rulesUsed.length === 1) {
    router.push({ name: 'flow-detail', params: { id: rulesUsed[0] } })
  } else {
    // TODO:
  }
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

<style lang="scss">
.flow-view {
  .vue-flow__node.is-disabled {
    filter: grayscale(1);
    opacity: 0.7;
  }
}
</style>
