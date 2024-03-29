<template>
  <div class="node-metrics">
    <BridgeItemOverview
      v-if="!infoLoading"
      :bridge-id="id"
      :bridge-msg="bridgeInfo"
      :is-source="isSource"
      @reconnect="loadBridgeInfo"
    />
  </div>
</template>

<script setup lang="ts">
import { FlowNodeType } from '@/hooks/Flow/useFlowNode'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useHandleSourceItem from '@/hooks/Rule/action/useHandleSourceItem'
import { BridgeItem } from '@/types/rule'
import BridgeItemOverview from '@/views/RuleEngine/Bridge/Components/BridgeItemOverview.vue'
import { Node } from '@vue-flow/core'
import { Ref, computed, defineProps, onMounted, provide, ref } from 'vue'

const props = defineProps<{
  node?: Node
}>()

const id = computed(() => {
  return props?.node?.data?.formData.id
})
const bridgeInfo: Ref<BridgeItem> = ref({} as BridgeItem)
const infoLoading = ref(false)

const isSource = computed(() => props?.node?.type === FlowNodeType.Input)

const { getDetail: getActionDetail } = useHandleActionItem()
const { getSourceDetail } = useHandleSourceItem()

const loadBridgeInfo = async () => {
  infoLoading.value = true
  try {
    const request = isSource.value ? getSourceDetail : getActionDetail
    bridgeInfo.value = await request(id.value)
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

provide('isFlowNode', true)
onMounted(() => {
  loadBridgeInfo()
})
</script>

<style lang="scss"></style>
