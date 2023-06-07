<template>
  <VueFlow class="nodes-graph" ref="FlowInstance" id="nodes-graph" v-model="flowData">
    <Background patternColor="transparent">
      <BackgroundCircle
        v-if="showBackgroundCircle"
        :x="backgroundCirclePosition.x"
        :y="backgroundCirclePosition.y"
        :radius="BACKGROUND_CIRCLE_RADIUS"
        :inner-radius="BACKGROUND_CIRCLE_INNER_RADIUS"
        :outer-radius="BACKGROUND_CIRCLE_OUTER_RADIUS"
      />
    </Background>
    <template #node-core="data">
      <CoreNode
        :height="coreNodeHeight"
        :is-selected="modelValue === data.id"
        :status="data.data.node_status"
        :nodes-num="nodes.length"
        @mouseenter="hoverToNode(data.id)"
      />
    </template>
    <template #node-replicant="data">
      <RepNode
        :is-selected="modelValue === data.id"
        :status="data.data.node_status"
        @mouseenter="hoverToNode(data.id)"
      />
    </template>
  </VueFlow>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NodesGraph',
  inheritAttrs: false,
})
</script>

<script setup lang="ts">
import useNodesGraph, {
  FlowDataItem,
  BACKGROUND_CIRCLE_RADIUS,
  BACKGROUND_CIRCLE_INNER_RADIUS,
  BACKGROUND_CIRCLE_OUTER_RADIUS,
} from '@/hooks/Overview/useNodesGraph'
import { NodeMsg } from '@/types/dashboard'
import BackgroundCircle from './BackgroundCircle.vue'
import { Background } from '@vue-flow/background'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { PropType, Ref, defineEmits, defineProps, nextTick, onMounted, ref, watch } from 'vue'
import CoreNode from './CoreNode.vue'
import RepNode from './RepNode.vue'

const props = defineProps({
  /**
   * current active node id
   */
  modelValue: {
    type: String,
  },
  nodes: {
    type: Object as PropType<Array<NodeMsg>>,
    required: true,
  },
})

const {
  FlowInstance,
  showBackgroundCircle,
  backgroundCirclePosition,
  coreNodeHeight,
  countCoreNodeHeight,
  generateFlowData,
} = useNodesGraph(props)

const flowData: Ref<Array<FlowDataItem>> = ref([])

const emit = defineEmits(['update:modelValue'])

useVueFlow({
  nodesDraggable: false,
  nodesConnectable: false,
  zoomOnScroll: false,
  zoomOnDoubleClick: false,
  zoomOnPinch: false,
  panOnDrag: false,
  minZoom: 1,
  maxZoom: 1,
  id: 'nodes-graph',
})

watch(
  () => props.nodes,
  async () => {
    flowData.value = generateFlowData(props.nodes)
    countCoreNodeHeight()
  },
)

onMounted(async () => {
  // wait to count ele size
  await nextTick()
  flowData.value = generateFlowData(props.nodes)
})

const hoverToNode = (id: string) => {
  emit('update:modelValue', id)
}
</script>

<style lang="scss">
.nodes-graph {
  height: 100%;
  .node-core {
    cursor: pointer;
  }
  .vue-flow__edge {
    cursor: default;
    pointer-events: none;
  }
  .vue-flow__edge-path,
  .vue-flow__connection-path {
    stroke: #7fd7b8;
  }
}
</style>
