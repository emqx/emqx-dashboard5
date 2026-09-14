<template>
  <div class="flow-view">
    <VueFlow
      class="editor"
      ref="FlowerInstance"
      v-model="flowData"
      :max-zoom="1"
      :delete-key-code="null"
      :nodes-connectable="false"
      @node-click="handleClickNode"
    >
      <template #node-custom_input="data"><FlowNode :data="data" /></template>
      <template #node-custom_default="data"><FlowNode :data="data" /></template>
      <template #node-custom_output="data"><FlowNode :data="data" /></template>
    </VueFlow>
  </div>
  <NodeDrawer v-model="showDrawer" readonly :node="currentNode" @edit="editCurrentNode" />
  <FlowSelectDialog
    v-model="showFlowSelectDialog"
    :id-arr="currentNode?.data?.rulesUsed"
    :disabled-id-arr="disabledEditIdArr"
    @selected="goFlowDetail"
  />
</template>

<script setup lang="ts">
import type { NamespaceSelection } from '@/common/constants'
import { Node, NodeMouseEvent, VueFlow } from '@vue-flow/core'
import FlowNode from './FlowNode.vue'
import FlowSelectDialog from './FlowSelectDialog.vue'
import NodeDrawer from './NodeDrawer.vue'

const props = defineProps<{
  namespace?: NamespaceSelection
}>()

const router = useRouter()

const emit = defineEmits(['loaded', 'load'])

const FlowerInstance = ref()

const { flowData, getFlowData } = useFlowView()

const showDrawer = ref(false)
const currentNode: Ref<undefined | Node> = ref(undefined)
const handleClickNode = ({ node }: NodeMouseEvent) => {
  if (!node) {
    return
  }
  currentNode.value = node
  showDrawer.value = true
}

const { getNsParams } = useNsParams()
const goFlowDetail = (flowId: string) =>
  router.push({
    name: 'flow-detail',
    params: { id: flowId },
    query: getNsParams(currentNode.value?.data.namespace),
  })

const { judgeIsWebhookRuleId } = useWebhookUtils()
const disabledEditIdArr = computed(() => {
  if (!currentNode.value) {
    return []
  }
  return currentNode.value.data.rulesUsed.filter(judgeIsWebhookRuleId)
})

const showFlowSelectDialog = ref(false)
const editCurrentNode = () => {
  if (!currentNode.value) {
    return
  }
  const {
    data: { rulesUsed },
  } = currentNode.value
  if (rulesUsed.length === 1) {
    goFlowDetail(rulesUsed[0])
  } else {
    showFlowSelectDialog.value = true
  }
}

const displayFlow = async () => {
  try {
    emit('load')
    await getFlowData(props.namespace)
    if (flowData.value.length > 0) {
      await waitAMoment(4)
      FlowerInstance.value?.fitView()
    }
  } catch (error) {
    //
  } finally {
    emit('loaded', flowData.value.length)
  }
}

watch(() => props.namespace, displayFlow)

onMounted(displayFlow)
</script>
