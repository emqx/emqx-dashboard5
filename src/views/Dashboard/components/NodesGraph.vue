<template>
  <div class="nodes-graph">
    <VueFlow ref="FlowInstance" id="nodes-graph" v-model="flowData">
      <template #node-background>
        <BackgroundCircle @show-popover="showPopover" />
      </template>
      <template #node-core="data">
        <CoreNode
          :height="coreNodeHeight"
          :nodes-num="nodes.length"
          :status="data.data.node_status"
          :is-selected="modelValue === data.id"
          @select="selectNode(data.id)"
        />
      </template>
      <template #node-replicant="data">
        <RepNode
          :status="data.data.node_status"
          :is-selected="modelValue === data.id"
          @select="selectNode(data.id)"
        />
      </template>
    </VueFlow>
    <NodeListPopover
      v-if="isPopoverVisible"
      v-click-outside="closePopover"
      :nodes="nodes"
      :class="{ 'is-more-down': showReplicantNodesCountPopover }"
    />
    <NodesCountCard
      v-if="showReplicantNodesCountPopover"
      class="nodes-count-popover"
      :class="{ 'is-active': isCountCardActivated }"
      :nodes-count-data="replicantNodesCountData"
      v-click-outside="onClickCountCardOutside"
      @click="clickCountCard"
    />
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
  BACKGROUND_CIRCLE_INNER_RADIUS,
  BACKGROUND_CIRCLE_OUTER_RADIUS,
  FlowDataItem,
} from '@/hooks/Overview/useNodesGraph'
import { NodeInfo } from '@/types/dashboard'
import { NodeStatus } from '@/types/enum'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { ClickOutside as vClickOutside } from 'element-plus'
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
import NodeListPopover from './NodeListPopover.vue'
import NodesCountCard from './NodesCountCard.vue'
import RepNode from './RepNode.vue'

const props = defineProps({
  /**
   * current active node id
   */
  modelValue: {
    type: String,
  },
  nodes: {
    type: Object as PropType<Array<NodeInfo>>,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

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
          zIndex: -1,
        },
      ]
    : [],
)

const replicantNodesCountData = computed(() => {
  return props.nodes.reduce(
    (countMap, { node_status, role }) => {
      if (role !== 'core') {
        countMap[node_status]++
      }
      return countMap
    },
    { [NodeStatus.Running]: 0, [NodeStatus.Stopped]: 0 },
  )
})
const showReplicantNodesCountPopover = computed(() => {
  return (
    replicantNodesCountData.value[NodeStatus.Running] +
      replicantNodesCountData.value[NodeStatus.Stopped] >
    20
  )
})

const flowData: Ref<Array<FlowDataItem>> = ref([...backgroundNode.value])
useVueFlow({
  deleteKeyCode: null,
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
    countCoreNodeHeight()
    flowData.value = [...backgroundNode.value, ...generateFlowData(props.nodes)]
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

const countPopoverLeft = `${flowEleWidth.value / 2 + BACKGROUND_CIRCLE_INNER_RADIUS}px`
const isCountCardActivated = ref(false)
const clickCountCard = () => {
  isCountCardActivated.value = true
  showPopover()
}
const onClickCountCardOutside = () => {
  isCountCardActivated.value = false
}
</script>

<style lang="scss">
.nodes-graph {
  position: relative;
  height: 100%;
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
    &.is-more-down {
      left: v-bind(countPopoverLeft);
      top: 50%;
      transform: translateY(40px);
    }
  }
  .nodes-count-popover {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: v-bind(countPopoverLeft);
    z-index: 200;
  }
}
</style>
