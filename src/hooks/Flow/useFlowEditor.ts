import { createRandomString } from '@/common/tools'
import { Edge, Node, VueFlow } from '@vue-flow/core'
import { Ref, ref } from 'vue'
import useFlowNode, {
  FlowData,
  FlowNodeType,
  NodeType,
  ProcessingType,
  SinkType,
  SourceType,
} from './useFlowNode'
import { bridgeOrderIndex } from '@/hooks/Rule/bridge/useBridgeTypeValue'

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
  nodeTypeOnlyByOne: string[]
  createFlowNodeDataFromEvent: (
    event: DragEvent,
    positionOffset: { x: number; y: number },
  ) => Node | undefined
}

export default (FlowerInstance: Ref<typeof VueFlow>, FlowWrapper: Ref<HTMLDivElement>): Ret => {
  const { getNodeClass, getFlowNodeHookPosition, getTypeLabel, removeDirectionFromSpecificType } =
    useFlowNode()

  const generateNodeByType = (type: string): NodeItem => ({
    name: getTypeLabel(type),
    specificType: type,
  })

  const sinkOrderIndex = {
    [SinkType.RePub]: -2,
    [SinkType.Console]: -1,
    ...bridgeOrderIndex,
  }
  const nodeArr: Array<NodeTypeItem> = [
    {
      type: NodeType.Source,
      typeLabel: 'Source',
      nodeList: Object.entries(SourceType).map(([, value]) => generateNodeByType(value)),
    },
    {
      type: NodeType.Processing,
      typeLabel: 'Processing',
      nodeList: [
        generateNodeByType(ProcessingType.Function),
        generateNodeByType(ProcessingType.Filter),
      ],
    },
    {
      type: NodeType.Sink,
      typeLabel: 'Sink',
      nodeList: Object.entries(SinkType)
        .sort(
          (a, b) =>
            (sinkOrderIndex[removeDirectionFromSpecificType(a[1])] || 0) -
            (sinkOrderIndex[removeDirectionFromSpecificType(b[1])] || 0),
        )
        .map(([, value]) => generateNodeByType(value)),
    },
  ]

  const flowData: Ref<FlowData> = ref([])

  const nodeTypeMap: Record<NodeType, FlowNodeType> = {
    [NodeType.Source]: FlowNodeType.Input,
    [NodeType.Processing]: FlowNodeType.Default,
    [NodeType.Sink]: FlowNodeType.Output,
  }

  const nodeTypeOnlyByOne: Array<string> = [
    ProcessingType.Filter,
    ProcessingType.Function,
    SinkType.Console,
  ]

  const getFlowNodeType = (type: NodeType) => nodeTypeMap[type] || FlowNodeType.Default

  const createFlowNodeDataFromEvent = (
    event: DragEvent,
    positionOffset: { x: number; y: number },
  ) => {
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
      x: event.clientX - reactFlowBounds.left - positionOffset.x,
      y: event.clientY - reactFlowBounds.top - positionOffset.y,
    })
    const flowNodeType = getFlowNodeType(type)

    return {
      id: createRandomString(),
      type: flowNodeType,
      label: name,
      position,
      class: `node-item ${getNodeClass(type)}`,
      ...getFlowNodeHookPosition(flowNodeType),
      data: { specificType },
    }
  }

  return {
    nodeArr,
    flowData,
    nodeTypeOnlyByOne,
    createFlowNodeDataFromEvent,
  }
}
