<template>
  <div class="flow flow-editor">
    <div class="nodes-panel">
      <div class="search-bar">
        <el-input placeholder="Search" :suffix-icon="Search" clearable v-model="searchText" />
      </div>
      <el-collapse
        v-if="nodeArr.length"
        class="node-type-list"
        :model-value="nodeArr.map(({ type }) => type)"
      >
        <el-collapse-item
          class="node-type-item"
          v-for="{ type, typeLabel, nodeList } in nodeArr"
          :key="type"
          :title="typeLabel"
          :name="type"
        >
          <ul class="node-list">
            <li
              v-for="node in nodeList"
              class="node-item"
              :key="node.name"
              :class="[getNodeClass(type), !getDraggable(node.specificType) ? 'is-disabled' : '']"
              :draggable="getDraggable(node.specificType)"
              @dragstart="onDragStart($event, { type, node })"
            >
              <img
                :src="getNodeIcon(node.specificType, !getDraggable(node.specificType))"
                width="20"
                alt="node-img"
                class="node-img"
                :class="getIconClass(node.specificType)"
                draggable="false"
              />
              <span draggable="false"> {{ node.name }}</span>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
      <p v-else class="tip empty-placeholder">{{ t('Base.noData') }}</p>
    </div>
    <div ref="FlowWrapper" class="flow-wrap" @drop="onDrop" @dragover="onDragOver">
      <FlowGuide v-show="!flowData.length" />
      <VueFlow
        :id="flowEditorId"
        class="editor"
        delete-key-code="Delete"
        :default-edge-options="{ type: 'custom' }"
        :style="{ height: $slots.test ? `calc(100% - ${testSlotHeight}px - 8px)` : '100%' }"
        v-show="flowData.length"
        ref="FlowerInstance"
        v-model="flowData"
        @node-click="handleClickNode"
        @nodes-change="updateEdges"
        @edges-change="checkEdges($event), handleFlowDataUpdated()"
        @edge-mouse-enter="handleMouseEnterEdge"
        @edge-mouse-leave="handleMouseLeaveEdge"
      >
        <!-- Why don't call handleFlowDataUpdated when node change but when node is deleted? -->
        <!-- Do not want to stop the test when the node is dragged and dropped before it is saved. -->
        <template #node-custom_input="data">
          <el-icon class="icon-del" @click.stop="delNode(data), handleFlowDataUpdated()">
            <CircleCloseFilled />
          </el-icon>
          <FlowNode :data="data" />
        </template>
        <template #node-custom_default="data">
          <el-icon class="icon-del" @click.stop="delNode(data)"><CircleCloseFilled /></el-icon>
          <FlowNode :data="data" />
        </template>
        <template #node-custom_output="data">
          <el-icon class="icon-del" @click.stop="delNode(data)"><CircleCloseFilled /></el-icon>
          <FlowNode :data="data" />
        </template>
        <template #edge-custom="props">
          <FlowEdge
            v-bind="props"
            @mouse-enter="handleMouseEnterEdgeLabel(props)"
            @mouse-leave="handleMouseLeaveEdge"
          />
        </template>
      </VueFlow>
      <Resizer
        v-if="$slots.test"
        v-model="testSlotHeight"
        :is-forward="false"
        :min="360"
        :max="700"
        @resize="keepZoomFitView"
      />
      <div
        class="test-content"
        v-if="$slots.test"
        :style="{ height: `${testSlotHeight}px` }"
        @vue:mounted="handleOpenTest"
        @vue:before-unmount="handleCloseTest"
      >
        <slot name="test"></slot>
      </div>
    </div>
  </div>
  <NodeDrawer
    v-model="isDrawerVisible"
    :nodes="getNodes"
    :node="currentNode"
    @save="saveDataToNode($event), handleFlowDataUpdated()"
    @saveAsNew="saveAsNewNode"
    @close="resetDrawerData"
    @cancel="handleCancelEditing"
  />
</template>

<script setup lang="ts">
import Resizer from '@/components/Resizer.vue'
import useFlowEdge from '@/hooks/Flow/useFlowEdge'
import useFlowEditor, { MsgKey, NodeItem } from '@/hooks/Flow/useFlowEditor'
import useFlowEditorDataHandler from '@/hooks/Flow/useFlowEditorDataHandler'
import useFlowNode, { FlowNodeType, NodeType, ProcessingType } from '@/hooks/Flow/useFlowNode'
import { useRuleUtils } from '@/hooks/Rule/rule/useRule'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import useI18nTl from '@/hooks/useI18nTl'
import { RuleEvent } from '@/types/rule'
import { CircleCloseFilled, Search } from '@element-plus/icons-vue'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import {
  Edge,
  EdgeAddChange,
  EdgeChange,
  EdgeMouseEvent,
  FitViewParams,
  Node,
  NodeMouseEvent,
  NodeProps,
  VueFlow,
  useVueFlow,
} from '@vue-flow/core'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual, pick } from 'lodash'
import type { PropType, Ref } from 'vue'
import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  nextTick,
  provide,
  ref,
  watch,
} from 'vue'
import FlowEdge from './FlowEdge.vue'
import FlowGuide from './FlowGuide.vue'
import FlowNode from './FlowNode.vue'
import NodeDrawer from './NodeDrawer.vue'

interface Pos {
  x: number
  y: number
}

const props = defineProps({
  data: {
    type: Array as PropType<Array<Node | Edge>>,
  },
})
const emit = defineEmits<{
  (e: 'update', data: { nodes: Array<Node>; edges: Array<Edge> }): void
}>()

const { t } = useI18nTl('Flow')

const searchText = ref('')

const FlowWrapper = ref()
const FlowerInstance = ref()

const flowEditorId = createRandomString()
const {
  addNodes,
  onConnect,
  addEdges,
  findNode,
  removeNodes,
  removeEdges,
  setEdges,
  setNodes,
  getNodes,
  getEdges,
} = useVueFlow(flowEditorId)

const {
  nodeArr: rawNodeArr,
  flowData,
  nodeTypeOnlyByOne,
  createFlowNodeDataFromEvent,
  countNeededEdges,
} = useFlowEditor(FlowerInstance, FlowWrapper)
const nodeArr = computed(() => {
  const reg = new RegExp(`${searchText.value}`, `i`)
  return rawNodeArr
    .map((item) => {
      const nodeList = item.nodeList.filter((node) => reg.test(node.name))
      return { ...item, nodeList }
    })
    .filter(({ nodeList }) => nodeList.length)
})

const {
  nodeWidth,
  nodeHeight,
  isBridgeType,
  getNodeClass,
  getNodeInfo,
  getNodeIcon,
  getIconClass,
} = useFlowNode()

/**
 * Position offset relative to the upper left corner of the node
 */
let startPositionOffset = { x: 0, y: 0 }
const countPositionOffset = (event: DragEvent) => {
  const ele: HTMLElement = event.target as HTMLElement
  if (!ele) {
    return
  }
  const { top, left } = ele.getBoundingClientRect()
  const { clientX, clientY } = event
  startPositionOffset = {
    x: clientX - left,
    y: clientY - top,
  }
}
const onDragStart = (event: DragEvent, nodeData: { node: NodeItem; type: NodeType }) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData(MsgKey.Type, nodeData.type.toString())
    event.dataTransfer.setData(MsgKey.Name, nodeData.node.name)
    event.dataTransfer.setData(MsgKey.SpecificType, nodeData.node.specificType)
    event.dataTransfer.effectAllowed = 'move'
    countPositionOffset(event)
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const updateEdges = () => {
  const neededEdges = countNeededEdges(getNodes.value)
  setEdges(neededEdges)
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const newNode = createFlowNodeDataFromEvent(event, startPositionOffset)
  if (newNode) {
    addNodes([newNode])
    openNodeDrawer(newNode)
  }
}

const getDraggable = (type: string) => {
  if (!nodeTypeOnlyByOne.includes(type)) {
    return true
  }
  return !getNodes.value.some(({ data }) => data.specificType === type)
}

const isDrawerVisible = ref(false)
const currentNode: Ref<undefined | Node> = ref(undefined)
let currentNodeID = ''
const openNodeDrawer = (node: Node<any, any, string>) => {
  currentNode.value = node
  currentNodeID = node.id
  isDrawerVisible.value = true
}

const handleClickNode = (event: NodeMouseEvent) => {
  const { node } = event
  openNodeDrawer(node)
}

const { checkConnection } = useFlowEdge()
const checkEdges = async (events: Array<EdgeChange>) => {
  const e = events[0]
  if (!e || e.type !== 'add') {
    return
  }
  const { item } = e as EdgeAddChange
  try {
    await checkConnection(item)
  } catch (error: any) {
    removeEdges([item])
    ElMessage.warning(error)
  }
}

const setEdgeStatus = (edge: Edge, isHover: boolean) => {
  if (!edge.data) {
    edge.data = {}
  }
  edge.data.isHover = isHover
}

const handleMouseEnterEdge = ({ edge }: EdgeMouseEvent) => {
  if (!edge) {
    return
  }
  getEdges.value.forEach((edge) => setEdgeStatus(edge, false))
  setEdgeStatus(edge, true)
}
const handleMouseEnterEdgeLabel = async (edge: any) => {
  if (!edge) {
    return
  }
  getEdges.value.forEach((edge) => setEdgeStatus(edge, false))
  await nextTick()
  setEdgeStatus(edge, true)
}
const handleMouseLeaveEdge = async () => {
  getEdges.value.forEach((edge) => setEdgeStatus(edge, false))
}

const delNode = ({ id }: NodeProps<any, any, string>) => removeNodes([id])

const resetDrawerData = () => {
  isDrawerVisible.value = false
  currentNode.value = undefined
  currentNodeID = ''
}

const saveDataToNode = (data: Record<string, any>) => {
  const node = findNode(currentNodeID)
  if (node) {
    // TODO: check isCreated and isChanged before calling update API
    node.data.isChanged = !isEqual(node.data.formData, data)
    node.data.formData = data
    if (isBridgeType(node.data.specificType)) {
      node.data.isCreated = !!data.id
    }
    node.data.desc = getNodeInfo(node)
  }
  resetDrawerData()
}

function isNodeOverlap(rect1Center: Pos, rect2Center: Pos): boolean {
  const rect1Left = rect1Center.x - nodeWidth / 2
  const rect1Right = rect1Center.x + nodeWidth / 2
  const rect1Top = rect1Center.y + nodeHeight / 2
  const rect1Bottom = rect1Center.y - nodeHeight / 2

  const rect2Left = rect2Center.x - nodeWidth / 2
  const rect2Right = rect2Center.x + nodeWidth / 2
  const rect2Top = rect2Center.y + nodeHeight / 2
  const rect2Bottom = rect2Center.y - nodeHeight / 2

  if (
    rect1Left > rect2Right ||
    rect1Right < rect2Left ||
    rect1Bottom > rect2Top ||
    rect1Top < rect2Bottom
  ) {
    return false
  }

  return true
}

function checkOverlapInArr(posArr: Array<Pos>, pos: Pos): boolean {
  for (const posItem of posArr) {
    if (isNodeOverlap(posItem, pos)) {
      return true
    }
  }
  return false
}

const confirmNewNodePosition = (oldNodePos: Pos, flowNodeType: string) => {
  const nowNodesPositionArr = getNodes.value.reduce(
    (arr: Array<{ x: number; y: number }>, { type, position }) => {
      if (type === flowNodeType) {
        arr.push(position)
      }
      return arr
    },
    [],
  )
  let index = 1
  const pos = { x: oldNodePos.x, y: oldNodePos.y + index * (nodeHeight + 30) }
  while (checkOverlapInArr(nowNodesPositionArr, pos)) {
    index += 1
    pos.y = oldNodePos.y + index * (nodeHeight + 30)
  }
  return pos
}

const saveAsNewNode = (data: Record<string, any>) => {
  const node = findNode(currentNodeID)
  if (node) {
    const newNode = cloneDeep(node)
    newNode.id = createRandomString()
    newNode.position = confirmNewNodePosition(node.position, node.type)
    newNode.data = { ...newNode.data, formData: data, isCreated: false }
    newNode.data.desc = getNodeInfo(newNode)
    addNodes([newNode])
  }
  resetDrawerData()
}

const handleCancelEditing = () => {
  const node = findNode(currentNodeID)
  if (!node) {
    return
  }
  if (!node.data.formData || isEmptyObj(node.data.formData)) {
    removeNodes([currentNodeID])
  }
}

const validate = () => {
  // TODO:
}

const nodeNeededKeys = ['id', 'data', 'type']
const edgeNeededKeys = ['source', 'sourceNode', 'target', 'targetNode']
const getFlowData = () => {
  const nodes = getNodes.value.map((item) => pick(item, nodeNeededKeys) as Node)
  const edges = getEdges.value.map((item) => pick(item, edgeNeededKeys) as Edge)
  return { nodes, edges }
}

onConnect((params) => addEdges(params))

// For the configuration of action can select placeholder
const eventList = ref<Array<RuleEvent>>([])
provide('eventList', eventList)
const { getEventList } = useRuleEvents()
;(async () => (eventList.value = await getEventList()))()

const { getFromDataFromNodes, getFieldsExpressionsFromNode } = useFlowEditorDataHandler()
const { transSQLFormDataToSQL } = useRuleUtils()
const sql = computed(() => {
  const inputNodeArr: Array<any> = []
  const fieldNodeArr: Array<any> = []
  getNodes.value.forEach((item) => {
    if (!item.data.formData) {
      return
    }
    if (item.type === FlowNodeType.Input) {
      inputNodeArr.push(pick(item, nodeNeededKeys))
    } else if (
      item.type === FlowNodeType.Default &&
      item.data.specificType === ProcessingType.Function
    ) {
      fieldNodeArr.push(pick(item, nodeNeededKeys))
    }
  })
  const fromArr = getFromDataFromNodes(inputNodeArr)
  const fieldsExpressions = getFieldsExpressionsFromNode(fieldNodeArr)
  return transSQLFormDataToSQL(fieldsExpressions, fromArr, '')
})
provide('sql', sql)

const fitView = async (params?: FitViewParams) => {
  await waitAMoment()
  FlowerInstance.value?.fitView(params)
}
const keepZoomFitView = () => {
  const currentZoom = FlowerInstance.value?.viewport.zoom
  fitView({ maxZoom: currentZoom })
}

const handleOpenTest = keepZoomFitView
const handleCloseTest = keepZoomFitView

const handleFlowDataUpdated = () => {
  const data = getFlowData()
  emit('update', data)
}

watch(
  () => props.data,
  async (nVal) => {
    if (nVal && nVal.length) {
      flowData.value = nVal
      await nextTick()
      fitView()
    }
  },
)

const testSlotHeight = ref(450)

defineExpose({ validate, getFlowData, getNodes, setNodes })
</script>

<style lang="scss">
@use 'sass:math';

.flow-editor {
  display: flex;
  align-items: flex-start;
  height: 100%;
  user-select: none;

  ul {
    padding: 0;
    list-style: none;
    margin-top: 0;
  }

  $panel-width: 264px;
  .nodes-panel {
    height: 100%;
    flex-basis: $panel-width;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 16px 12px;
    border-right: 1px solid var(--color-border-primary);
    overflow-y: scroll;
    background-color: var(--color-bg-main);
    .node-item {
      display: flex;
      align-items: center;
      cursor: grab;
      border-color: var(--color-border-card);
      transform: translate(0, 0);
      &.is-disabled::before {
        border-left-color: var(--color-text-placeholder);
        cursor: default;
      }
    }
    .node-img {
      margin-right: 10px;
    }
  }

  .editor {
    $icon-size: 16px;
    $icon-padding-left: 16px;
    $icon-padding-right: 4px;
    $total-size: $icon-size + $icon-padding-left + $icon-padding-right;
    .icon-del {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      transform: translate($icon-padding-left, -$icon-padding-left);
      width: $total-size;
      height: $total-size;
      padding: $icon-padding-right $icon-padding-right $icon-padding-left $icon-padding-left;
      border-radius: 0 0 0 40px;
      color: var(--el-color-danger);
      svg {
        width: $icon-size;
        cursor: pointer;
      }
      &:hover {
        filter: contrast(130%);
      }
    }
    .vue-flow__node:hover {
      border: 1px solid #00b173;
      box-shadow: 0px 4px 6px 0px #00b17329;
      .icon-del {
        display: block;
      }
    }
  }

  .vue-flow__handle {
    // In order to expand the draggable area invisible
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: block;
      width: 24px;
      height: 24px;
    }

    $handle-size: 14px;
    &:hover {
      width: $handle-size;
      height: $handle-size;
      --vf-handle: #00b173;
      &.vue-flow__handle-left {
        left: math.div(-$handle-size, 2);
      }
      &.vue-flow__handle-right {
        right: math.div(-$handle-size, 2);
      }
      .icon-add {
        display: block;
      }
    }
  }

  .empty-placeholder {
    padding: 64px 0;
    text-align: center;
  }

  .node-type-list {
    padding: 8px;
  }

  .el-collapse {
    border-top: none;
    border-bottom: none;
  }

  .el-collapse-item__header,
  .el-collapse-item__content,
  .el-collapse-item__wrap {
    background-color: transparent;
  }

  .el-collapse-item__wrap {
    border-bottom: none;
  }

  .el-collapse-item__content {
    padding-bottom: 8px;
  }

  .el-collapse-item__header {
    font-weight: 600;
  }

  .flow-wrap {
    height: 100%;
    flex-grow: 1;
    width: calc(100% - #{$panel-width});
  }

  .vue-flow {
    height: auto;
    &.flow-guide {
      height: 100%;
    }
  }

  .vue-flow,
  .test-content {
    flex-grow: 1;
  }
  .test-content {
    padding: 0 16px 16px;
  }
}
</style>
