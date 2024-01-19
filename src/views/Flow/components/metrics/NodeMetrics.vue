<template>
  <div class="node-metrics">
    <BridgeItemOverview
      v-if="!infoLoading"
      :bridge-id="id"
      :bridge-msg="bridgeInfo"
      :is-source="node?.type === FlowNodeType.Input"
      @reconnect="loadBridgeInfo"
    />
  </div>
</template>

<script setup lang="ts">
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import { FlowNodeType } from '@/hooks/Flow/useFlowNode'
import { useBridgeDataHandler } from '@/hooks/Rule/useDataHandler'
import BridgeItemOverview from '@/views/RuleEngine/Bridge/Components/BridgeItemOverview.vue'
import { Ref, computed, ref, defineProps, onMounted, provide } from 'vue'
import { BridgeItem } from '@/types/rule'
import { Node } from '@vue-flow/core'

const props = defineProps<{
  node?: Node
}>()

const id = computed(() => {
  return props?.node?.data?.formData.id
})
const bridgeInfo: Ref<BridgeItem> = ref({} as BridgeItem)
const infoLoading = ref(false)

const { handleBridgeDataAfterLoaded } = useBridgeDataHandler()
const { getDetail } = useHandleActionItem()

const loadBridgeInfo = async () => {
  infoLoading.value = true
  try {
    const data = await getDetail(id.value)
    bridgeInfo.value = handleBridgeDataAfterLoaded(data)
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
