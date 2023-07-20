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
                :src="getNodeIcon(node.specificType)"
                width="20"
                alt="node-img"
                class="node-img"
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
        v-show="flowData.length"
        ref="FlowerInstance"
        v-model="flowData"
        @node-click="handleClickNode"
      >
        <template #node-custom_input="data"><FlowNode :data="data" /></template>
        <template #node-custom_default="data"><FlowNode :data="data" /></template>
        <template #node-custom_output="data"><FlowNode :data="data" /></template>
      </VueFlow>
    </div>
  </div>
  <NodeDrawer
    v-model="isDrawerVisible"
    :nodes="getNodes"
    :type="currentNodeType"
    :form-data="currentNodeFormData"
    :generate-bridge-name="createBridgeName"
    @save="saveDataToNode"
    @close="resetDrawerData"
    @cancel="handleCancelEditing"
  />
</template>

<script setup lang="ts">
import { createRandomString, isEmptyObj } from '@/common/tools'
import useFlowEditor, { MsgKey, NodeItem } from '@/hooks/Flow/useFlowEditor'
import useFlowNode, { NodeType } from '@/hooks/Flow/useFlowNode'
import useI18nTl from '@/hooks/useI18nTl'
import { Search } from '@element-plus/icons-vue'
import { Node, NodeMouseEvent, VueFlow, useVueFlow } from '@vue-flow/core'
import { pick } from 'lodash'
import { Ref, computed, defineExpose, defineProps, ref } from 'vue'
import FlowGuide from './FlowGuide.vue'
import FlowNode from './FlowNode.vue'
import NodeDrawer from './NodeDrawer.vue'

const props = defineProps({
  flowName: {
    type: String,
    default: '',
  },
})

const { t } = useI18nTl('Flow')

const initFlowName: string = (() => props.flowName)()
const createBridgeName = () => `${initFlowName}_data_bridge_${createRandomString(3)}`

const searchText = ref('')

const FlowWrapper = ref()
const FlowerInstance = ref()

const flowEditorId = createRandomString()
const { addNodes, onConnect, addEdges, findNode, removeNodes, getNodes, getEdges } = useVueFlow({
  id: flowEditorId,
  deleteKeyCode: 'Delete',
})

const {
  nodeArr: rawNodeArr,
  flowData,
  nodeTypeOnlyByOne,
  createFlowNodeDataFromEvent,
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

const { getNodeClass, getNodeInfo, getNodeIcon } = useFlowNode()

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
const currentNodeType = ref('')
const currentNodeFormData: Ref<undefined | Record<string, any>> = ref(undefined)
let currentNodeID = ''
const openNodeDrawer = (node: Node<any, any, string>) => {
  isDrawerVisible.value = true
  currentNodeType.value = node.data.specificType
  currentNodeFormData.value = node.data.formData
  currentNodeID = node.id
}

const handleClickNode = (event: NodeMouseEvent) => {
  const { node } = event
  openNodeDrawer(node)
}

const resetDrawerData = () => {
  isDrawerVisible.value = false
  currentNodeType.value = ''
  currentNodeID = ''
}

const saveDataToNode = (data: Record<string, any>) => {
  const node = findNode(currentNodeID)
  if (node) {
    node.data.formData = data
    node.data.desc = getNodeInfo(node)
  }
  resetDrawerData()
}

const handleCancelEditing = () => {
  const node = findNode(currentNodeID)
  if (!node) {
    return
  }
  if (!node.data.formData || isEmptyObj(node.data.formData)) {
    removeNodes([node])
  }
}

const validate = () => {
  // TODO:
}

const nodeNeededKeys = ['id', 'data', 'type']
const edgeNeededKeys = ['source', 'target']
const getFlowData = () => {
  const nodes = getNodes.value.map((item) => pick(item, nodeNeededKeys))
  const edges = getEdges.value.map((item) => pick(item, edgeNeededKeys))
  return { nodes, edges }
}

onConnect((params) => addEdges(params))

defineExpose({ validate, getFlowData })
</script>

<style lang="scss">
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

  .nodes-panel {
    height: 100%;
    flex-basis: 264px;
    flex-grow: 0;
    padding: 16px 12px;
    border-right: 1px solid var(--color-border-primary);
    overflow-y: scroll;
    background-color: #f6f7fa;
    .node-item {
      display: flex;
      align-items: center;
      cursor: grab;
      border-top-color: #e2e6f0;
      border-right-color: #e2e6f0;
      border-bottom-color: #e2e6f0;
      transform: translate(0, 0);
      &.is-disabled {
        opacity: 0.6;
        filter: grayscale(1);
        cursor: default;
      }
    }
    .node-img {
      margin-right: 10px;
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
  }

  .vue-flow {
    height: 100%;
  }
}
</style>
