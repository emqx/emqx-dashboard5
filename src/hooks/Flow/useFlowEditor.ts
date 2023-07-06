import { createRandomString } from '@/common/tools'
import { Edge, Node, Position, VueFlow } from '@vue-flow/core'
import { Ref, ref } from 'vue'

export type FlowData = Array<Node | Edge>

export const enum NodeType {
  Source,
  Processing,
  Sink,
}

const SOURCE_SUFFIX = '_source'
const SINK_SUFFIX = '_sink'

export const SourceType = {
  Message: 'message',
  Event: 'event',
  MQTTBroker: `MQTTBroker_${SOURCE_SUFFIX}`,
}

export const enum ProcessingType {
  Function = 'function',
  Filter = 'filter',
}

export const SinkType = {
  HTTP: 'http',
  MQTTBroker: `MQTTBroker_${SINK_SUFFIX}`,
  Console: 'console',
  RePub: 'republish',
}

export const enum FlowNodeType {
  Input = 'input',
  Default = 'default',
  Output = 'output',
}

export const enum MsgKey {
  // This type of node is an input or output or normal
  Type = 'type',
  Name = 'name',
  // What specific node does this type refer to, is it a Message or an Event, etc
  SpecificType = 'specificType',
}

export interface NodeItem {
  name: string
  specificType: string
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
        { name: 'Message', specificType: SourceType.Message },
        { name: 'Event', specificType: SourceType.Event },
        { name: 'MQTT Broker', specificType: SourceType.MQTTBroker },
        { name: 'Kafka', specificType: SourceType.MQTTBroker },
      ],
    },
    {
      type: NodeType.Processing,
      typeLabel: 'Processing',
      nodeList: [
        { name: 'Function', specificType: ProcessingType.Function },
        { name: 'Filter', specificType: ProcessingType.Filter },
      ],
    },
    {
      type: NodeType.Sink,
      typeLabel: 'Sink',
      nodeList: [
        { name: 'HTTP Server', specificType: SinkType.HTTP },
        { name: 'MQTT Broker', specificType: SinkType.MQTTBroker },
        { name: 'Console Output', specificType: SinkType.Console },
        { name: 'Republish', specificType: SinkType.RePub },
      ],
    },
  ]

  const flowData: Ref<FlowData> = ref([])

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
    const specificType = event.dataTransfer?.getData(MsgKey.SpecificType)

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
      data: { specificType },
    }
  }

  return {
    nodeArr,
    flowData,
    createFlowNodeDataFromEvent,
  }
}
