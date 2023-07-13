<template>
  <div class="flow">
    <router-link :to="{ name: 'flow-create' }">CREATE FLOW</router-link>
    <VueFlow ref="FlowerInstance" v-model="flowData" @node-click="handleClickNode" />
  </div>
</template>

<script setup lang="ts">
import useFlowView from '@/hooks/Flow/useFlowView'
import { VueFlow } from '@vue-flow/core'

const handleClickNode = () => {}
const { flowData, getFlowData } = useFlowView()

getFlowData()
</script>

<style lang="scss">
.flow {
  width: 100%;
  height: 800px;
  .vue-flow {
    height: 100%;
  }
}
</style>
