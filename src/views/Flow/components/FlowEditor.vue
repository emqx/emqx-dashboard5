<template>
  <div class="flow flow-editor">
    <div class="nodes-panel">
      <div class="search-bar">
        <el-input placeholder="Search" :suffix-icon="Search" clearable v-model="searchText" />
      </div>
      <el-collapse class="node-type-list" :model-value="nodeArr.map(({ type }) => type)">
        <el-collapse-item
          class="node-type-item"
          v-for="{ type, typeLabel, nodeList } in nodeArr"
          :key="type"
          :title="typeLabel"
          :name="type"
        >
          <ul class="node-list">
            <li
              class="node-item"
              :class="getNodeClass(type)"
              v-for="node in nodeList"
              :key="node.name"
              draggable="true"
              @dragstart="onDragStart($event, { type, node })"
            >
              <img
                :src="getNodeIcon(node.specificType)"
                width="20"
                alt="node-img"
                class="node-img"
              />
              <span> {{ node.name }}</span>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
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
    :type="currentNodeType"
    :form-data="currentNodeFormData"
    :generate-bridge-name="createBridgeName"
    @save="saveDataToNode"
    @close="resetDrawerData"
  />
</template>

<script setup lang="ts">
import { createRandomString } from '@/common/tools'
import useFlowEditor, { MsgKey, NodeItem } from '@/hooks/Flow/useFlowEditor'
import useFlowNode, { NodeType } from '@/hooks/Flow/useFlowNode'
import { Search } from '@element-plus/icons-vue'
import { Node, NodeMouseEvent, VueFlow, useVueFlow } from '@vue-flow/core'
import { pick } from 'lodash'
import { Ref, defineExpose, defineProps, ref } from 'vue'
import FlowGuide from './FlowGuide.vue'
import FlowNode from './FlowNode.vue'
import NodeDrawer from './NodeDrawer.vue'

const props = defineProps({
  flowName: {
    type: String,
    default: '',
  },
})
const initFlowName: string = (() => props.flowName)()
const createBridgeName = () => `${initFlowName}_data_bridge_${createRandomString(3)}`

const searchText = ref('')

const FlowWrapper = ref()
const FlowerInstance = ref()

const flowEditorId = createRandomString()
const { addNodes, onConnect, addEdges, findNode, getNodes, getEdges } = useVueFlow({
  id: flowEditorId,
})

const { nodeArr, flowData, createFlowNodeDataFromEvent } = useFlowEditor(
  FlowerInstance,
  FlowWrapper,
)
const { getNodeClass, getNodeInfo, getNodeIcon } = useFlowNode()

const onDragStart = (event: DragEvent, nodeData: { node: NodeItem; type: NodeType }) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData(MsgKey.Type, nodeData.type.toString())
    event.dataTransfer.setData(MsgKey.Name, nodeData.node.name)
    event.dataTransfer.setData(MsgKey.SpecificType, nodeData.node.specificType)
    event.dataTransfer.effectAllowed = 'move'
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
  const newNode = createFlowNodeDataFromEvent(event)
  if (newNode) {
    addNodes([newNode])
    openNodeDrawer(newNode)
  }
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
    }
    .node-img {
      margin-right: 10px;
    }
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
