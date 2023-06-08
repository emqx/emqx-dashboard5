<template>
  <div class="nodes-graph">
    <VueFlow ref="FlowInstance" id="nodes-graph" v-model="flowData">
      <template #node-background>
        <BackgroundCircle @click-ring="showPopover" />
      </template>
      <template #node-core="data">
        <CoreNode
          :height="coreNodeHeight"
          :is-selected="modelValue === data.id"
          :status="data.data.node_status"
          :nodes-num="nodes.length"
          @select="selectNode(data.id)"
        />
      </template>
      <template #node-replicant="data">
        <RepNode
          :is-selected="modelValue === data.id"
          :status="data.data.node_status"
          @select="selectNode(data.id)"
        />
      </template>
    </VueFlow>
    <NodeListPopover :nodes="nodes" v-click-outside="closePopover" v-if="isPopoverVisible" />
  </div>
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
  BACKGROUND_CIRCLE_OUTER_RADIUS,
} from '@/hooks/Overview/useNodesGraph'
import { NodeMsg } from '@/types/dashboard'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import {
  ComputedRef,
  PropType,
  Ref,
  computed,
  defineEmits,
  defineProps,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'
import BackgroundCircle from './BackgroundCircle.vue'
import CoreNode from './CoreNode.vue'
import RepNode from './RepNode.vue'
import NodeListPopover from './NodeListPopover.vue'
import { ClickOutside as vClickOutside } from 'element-plus'

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
  flowEleWidth,
  backgroundCirclePosition,
  coreNodeHeight,
  countCoreNodeHeight,
  generateFlowData,
} = useNodesGraph(props)

// The reason for setting it as a node instead of a background
// is that the background cannot be interactive
const backgroundNode: ComputedRef<Array<FlowDataItem>> = computed(() =>
  showBackgroundCircle.value
    ? [
        {
          type: 'background',
          id: 'background-circle',
          position: backgroundCirclePosition.value,
          selectable: false,
          zIndex: -3,
        },
      ]
    : [],
)

const flowData: Ref<Array<FlowDataItem>> = ref([...backgroundNode.value])

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
    flowData.value = [...backgroundNode.value, ...generateFlowData(props.nodes)]
    countCoreNodeHeight()
  },
)

onMounted(async () => {
  // wait to count ele size
  await nextTick()
  flowData.value = [...backgroundNode.value, ...generateFlowData(props.nodes)]
})

const selectNode = (id: string) => {
  emit('update:modelValue', id)
}

const popoverLeft = `${flowEleWidth.value / 2 + BACKGROUND_CIRCLE_OUTER_RADIUS + 16}px`
const isPopoverVisible = ref(false)
const showPopover = () => {
  isPopoverVisible.value = true
}
const closePopover = () => {
  isPopoverVisible.value = false
}
</script>

<style lang="scss">
.nodes-graph {
  position: relative;
  height: 100%;
  border: 1px solid red;
  .node-core,
  .node-replicant {
    cursor: default;
    line-height: 0;
    circle,
    g {
      cursor: pointer;
    }
  }
  .node-replicant {
    line-height: 0;
    // background-color: red;
  }
  .vue-flow__edge {
    cursor: default;
    pointer-events: none;
  }
  .vue-flow__edge-path,
  .vue-flow__connection-path {
    stroke: #7fd7b8;
  }
  .node-list-popover {
    position: absolute;
    z-index: 5;
    top: 5px;
    left: v-bind(popoverLeft);
  }
}
</style>
