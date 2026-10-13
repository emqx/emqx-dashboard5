<template>
  <div class="nodes-graph" :class="{ 'has-unknown-nodes': unknownNodes.length }">
    <VueFlow
      ref="FlowInstance"
      id="nodes-graph"
      v-model="flowData"
      :delete-key-code="null"
      :nodes-draggable="false"
      :nodes-connectable="false"
      :zoom-on-scroll="false"
      :zoom-on-double-click="false"
      :zoom-on-pinch="false"
      :pan-on-drag="false"
      :min-zoom="FLOW_DEFAULT_ZOOM"
      :max-zoom="FLOW_DEFAULT_ZOOM"
      :default-viewport="{ zoom: FLOW_DEFAULT_ZOOM, x: 0, y: 0 }"
      :fit-view-on-init="true"
    >
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
    <div class="unknown-nodes" v-if="unknownNodes.length">
      <div class="unknown-nodes-title">{{ t('Dashboard.unknownRoleNodes') }}</div>
      <button
        v-for="node in unknownNodes"
        :key="node.node"
        type="button"
        class="unknown-node"
        :class="{ 'is-selected': modelValue === node.node }"
        @click="selectNode(node.node)"
      >
        <NodeStatusLabel :status="node.node_status" />
        <span>{{ node.node }}</span>
      </button>
    </div>
    <NodeListPopover
      v-if="isPopoverVisible"
      v-click-outside="closePopover"
      :nodes="nodes"
      @select="selectNode"
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
  FLOW_DEFAULT_ZOOM,
  MAX_DISPLAYED_REP_NODE,
} from '@/hooks/Overview/useNodesGraph'
import { NodeInfo } from '@/types/dashboard'
import { countNodeStatuses, groupNodesByRole } from '@/common/nodeStatus'
import NodeStatusLabel from '@/components/NodeStatusLabel.vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { ClickOutside as vClickOutside } from 'element-plus'
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

const { t } = useI18n()
const nodesByRole = computed(() => groupNodesByRole(props.nodes))
const unknownNodes = computed(() => nodesByRole.value.unknown)
const replicantNodesCountData = computed(() => countNodeStatuses(nodesByRole.value.replicant))
const showReplicantNodesCountPopover = computed(
  () => nodesByRole.value.replicant.length > MAX_DISPLAYED_REP_NODE,
)

const flowData: Ref<Array<FlowDataItem>> = ref([...backgroundNode.value])
useVueFlow('nodes-graph')

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
  &.has-unknown-nodes {
    display: flex;
    flex-direction: column;
    .vue-flow {
      flex: 1;
      min-height: 243px;
    }
  }
  .unknown-nodes {
    max-height: 120px;
    overflow: auto;
    padding: 8px;
    border-top: 1px solid var(--color-border-card);
  }
  .unknown-nodes-title {
    margin-bottom: 8px;
    color: var(--color-text-secondary);
  }
  .unknown-node {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 6px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--color-text-primary);
    font: inherit;
    text-align: left;
    overflow-wrap: anywhere;
    cursor: pointer;
    &.is-selected {
      border-color: var(--color-primary);
      border-radius: 4px;
    }
  }
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
    z-index: -1;
  }
  .vue-flow__edge-path,
  .vue-flow__connection-path {
    stroke: var(--color-text-placeholder);
    stroke-width: 1.5;
    opacity: 0.6;
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
