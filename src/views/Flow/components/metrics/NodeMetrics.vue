<template>
  <div class="node-metrics" v-if="!infoLoading">
    <BridgeItemOverview
      v-if="node?.type && node?.type !== FlowNodeType.Default"
      :bridge-id="id"
      :bridge-msg="bridgeInfo"
      :is-source="isSource"
      @reconnect="loadBridgeInfo"
    />
    <RuleItemOverview
      v-if="node?.type && node?.data?.rulesUsed?.[0] && node?.type === FlowNodeType.Default"
      :rule-id="node.data.rulesUsed[0]"
    />
  </div>
</template>

<script setup lang="ts">
import { BridgeItem } from '@/types/rule'
import BridgeItemOverview from '@/views/RuleEngine/Bridge/Components/BridgeItemOverview.vue'
import RuleItemOverview from '@/views/RuleEngine/Rule/components/RuleItemOverview.vue'
import { Node } from '@vue-flow/core'

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
