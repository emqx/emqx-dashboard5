<template>
  <div class="flow" v-loading="isLoading">
    <template v-if="flowData.length">
      <div class="flow-view-hd space-between vertical-align-center">
        <el-radio-group v-model="showBy">
          <el-radio-button :label="ShowByOpt.Flow">Flow</el-radio-button>
          <el-radio-button :label="ShowByOpt.List" disabled>{{ tl('list') }}</el-radio-button>
        </el-radio-group>
        <el-button @click="goCreate" type="primary">{{ tl('createFlow') }}</el-button>
      </div>
      <VueFlow class="editor" ref="FlowerInstance" v-model="flowData" @node-click="handleClickNode">
        <template #node-custom_input="data"><FlowNode :data="data" /></template>
        <template #node-custom_default="data"><FlowNode :data="data" /></template>
        <template #node-custom_output="data"><FlowNode :data="data" /></template>
      </VueFlow>
    </template>
    <div v-else class="flow-placeholder-container">
      <img
        class="img-placeholder"
        width="520"
        src="@/assets/img/flow_placeholder.png"
        alt="empty_placeholder"
      />
      <el-button @click="goCreate" type="primary">{{ tl('createFlow') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useFlowView from '@/hooks/Flow/useFlowView'
import useI18nTl from '@/hooks/useI18nTl'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FlowNode from './components/FlowNode.vue'

const FlowerInstance = ref()

const router = useRouter()
const { tl } = useI18nTl('Flow')

const enum ShowByOpt {
  Flow,
  List,
}
const showBy = ref(ShowByOpt.Flow)

const { isLoading, flowData, getFlowData } = useFlowView()

useVueFlow({
  deleteKeyCode: null,
  nodesConnectable: false,
  maxZoom: 1,
})

const goCreate = () => router.push({ name: 'flow-create' })

const handleClickNode = () => {
  /*  */
}

onMounted(async () => {
  await getFlowData()
  if (flowData.value.length > 0) {
    FlowerInstance.value?.fitView()
  }
})
</script>

<style lang="scss">
.flow {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-primary);

  $hd-height: 56px;
  .flow-view-hd {
    height: $hd-height;
    padding: 0 24px;
    border-bottom: 1px solid var(--color-border-primary);
  }
  .vue-flow {
    height: calc(100% - #{$hd-height});
  }
  .flow-placeholder-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-bottom: 180px;
    align-items: center;
    justify-content: center;
  }
  .img-placeholder {
    margin-bottom: 48px;
  }
}
</style>
