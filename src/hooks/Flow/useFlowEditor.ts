import { createRandomString } from '@/common/tools'
import { Edge, Node, Position, VueFlow } from '@vue-flow/core'
import { Ref, ref } from 'vue'

export const enum NodeType {
  Source,
  Processing,
  Sink,
}

export const enum FlowNodeType {
  Input = 'input',
  Default = 'default',
  Output = 'output',
}

export const enum MsgKey {
  Type = 'type',
  Name = 'name',
}

export interface NodeItem {
  name: string
}

interface NodeTypeItem {
  type: NodeType
  typeLabel: string
  nodeList: Array<NodeItem>
}

interface Ret {
  nodeArr: Array<NodeTypeItem>
  flowData: Ref<Array<Node | Edge>>
  createFlowNodeDataFromEvent: (event: DragEvent) => Node | undefined
}

export default (FlowerInstance: Ref<typeof VueFlow>, FlowWrapper: Ref<HTMLDivElement>): Ret => {
  const nodeArr: Array<NodeTypeItem> = [
    {
      type: NodeType.Source,
      typeLabel: 'Source',
      nodeList: [
        { name: 'Message' },
        { name: 'Event' },
        { name: 'MQTT Broker' },
        { name: 'Kafka' },
      ],
    },
    {
      type: NodeType.Processing,
      typeLabel: 'Processing',
      nodeList: [{ name: 'Function' }, { name: 'Filter' }],
    },
    {
      type: NodeType.Sink,
      typeLabel: 'Sink',
      nodeList: [{ name: 'HTTP Server' }, { name: 'MQTT Broker' }],
    },
  ]

  const flowData: Ref<Array<Node | Edge>> = ref([])

  const nodeTypeMap: Record<NodeType, FlowNodeType> = {
    [NodeType.Source]: FlowNodeType.Input,
    [NodeType.Processing]: FlowNodeType.Default,
    [NodeType.Sink]: FlowNodeType.Output,
  }
  const getFlowNodeType = (type: NodeType) => nodeTypeMap[type] || FlowNodeType.Default

  const getFlowNodeHookPosition = (nodeType: FlowNodeType) => {
    if (nodeType === FlowNodeType.Input) {
      return { sourcePosition: Position.Right }
    }
    if (nodeType === FlowNodeType.Output) {
      return { targetPosition: Position.Left }
    }
    return { sourcePosition: Position.Right, targetPosition: Position.Left }
  }

  const createFlowNodeDataFromEvent = (event: DragEvent) => {
    const reactFlowBounds = FlowWrapper.value.getBoundingClientRect()
    const type: NodeType = (event.dataTransfer?.getData(MsgKey.Type) ||
      NodeType.Processing) as NodeType
    const name = event.dataTransfer?.getData(MsgKey.Name)

    // check if the dropped element is valid
    if (typeof type === 'undefined' || !type) {
      return
    }

    const position = FlowerInstance.value.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })
    const flowNodeType = getFlowNodeType(type)

    return {
      id: createRandomString(),
      type: flowNodeType,
      label: name,
      position,
      ...getFlowNodeHookPosition(flowNodeType),
    }
  }

  return {
    nodeArr,
    flowData,
    createFlowNodeDataFromEvent,
  }
}
