<template>
  <div class="flow-editor">
    <div class="nodes-panel">
      <p>TODO:</p>
      <div class="search-bar">
        <el-input
          placeholder="Search"
          prefix-icon="el-icon-search"
          clearable
          v-model="searchText"
        />
      </div>
      <el-collapse class="node-type-list" :model-value="nodeArr.map(({ type }) => type)">
        <el-collapse-item
          class="node-type-item"
          v-for="{ type, typeLabel, nodeList } in nodeArr"
          :key="type"
          :title="typeLabel"
          :name="type"
        >
          <ul class="node-list" v-for="node in nodeList" :key="node.name">
            <li class="node-item" draggable="true" @dragstart="onDragStart($event, { type, node })">
              {{ node.name }}
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div ref="FlowWrapper" class="flow-wrap" @drop="onDrop">
      <VueFlow
        ref="FlowerInstance"
        v-model="flowData"
        @dragover="onDragOver"
        @node-click="nodeClickNode"
      />
    </div>
  </div>
  <NodeDrawer v-model="isDrawerVisible" :type="currentNodeType" />
</template>

<script setup lang="ts">
import useFlowEditor, { MsgKey, NodeItem, NodeType } from '@/hooks/Flow/useFlowEditor'
import { NodeMouseEvent, VueFlow, useVueFlow } from '@vue-flow/core'
import { ref } from 'vue'
import NodeDrawer from './NodeDrawer.vue'

const searchText = ref('')

const FlowWrapper = ref()
const FlowerInstance = ref()

const { addNodes, onConnect, addEdges } = useVueFlow()

const { nodeArr, flowData, createFlowNodeDataFromEvent } = useFlowEditor(
  FlowerInstance,
  FlowWrapper,
)

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
  }
}

const isDrawerVisible = ref(false)
const currentNodeType = ref('')
const nodeClickNode = (node: NodeMouseEvent) => {
  isDrawerVisible.value = true
  currentNodeType.value = node.node.data.specificType
}

onConnect((params) => addEdges(params))
</script>

<style lang="scss">
.flow-editor {
  display: flex;
  align-items: flex-start;
  height: 100%;
  ul {
    padding: 0;
    list-style: none;
  }
  .nodes-panel {
    height: 100%;
    flex-basis: 264px;
    flex-grow: 0;
    padding: 16px 12px;
    border-right: 1px solid var(--color-border-primary);
    overflow-y: scroll;
  }
  .flow-wrap {
    height: 100%;
    flex-grow: 1;
  }
  .node-type-list {
    padding: 8px;
  }
  .node-item {
    padding: 9px 16px;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 22px;
    border-radius: 8px;
    background: #dbecff;
    cursor: grab;
  }
  .vue-flow {
    height: 100%;
  }
}
</style>
