import { createRandomString } from '@/common/tools'
import { Edge, Node, VueFlow } from '@vue-flow/core'
import { Ref, ref } from 'vue'
import useFlowNode, {
  FlowData,
  FlowNodeType,
  NodeType,
  ProcessingType,
  SinkType,
} from './useFlowNode'
import useGenerateFlowDataUtils from './useGenerateFlowDataUtils'

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
  countNeededEdges: (nodes: Array<Node>) => Edge[]
}

export default (FlowerInstance: Ref<typeof VueFlow>, FlowWrapper: Ref<HTMLDivElement>): Ret => {
  const {
    sourceNodeList,
    processingNodeList,
    sinkNodeList,
    getNodeClass,
    getFlowNodeHookPosition,
  } = useFlowNode()

  const nodeArr: Array<NodeTypeItem> = [
    {
      type: NodeType.Source,
      typeLabel: 'Source',
      nodeList: sourceNodeList,
    },
    {
      type: NodeType.Processing,
      typeLabel: 'Processing',
      nodeList: processingNodeList,
    },
    {
      type: NodeType.Sink,
      typeLabel: 'Sink',
      nodeList: sinkNodeList,
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
    if (!event.dataTransfer?.getData(MsgKey.Type)) {
      return
    }
    const reactFlowBounds = FlowWrapper.value.getBoundingClientRect()
    const type: NodeType = Number(event.dataTransfer.getData(MsgKey.Type)) as NodeType
    const name = event.dataTransfer?.getData(MsgKey.Name)
    const specificType = event.dataTransfer?.getData(MsgKey.SpecificType)

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

  const { generateEdgesFromNodes } = useGenerateFlowDataUtils()
  const countNeededEdges = (nodes: Array<Node>) => {
    const groupedNodes = {
      [NodeType.Source]: nodes.filter((node) => node.type === FlowNodeType.Input),
      [ProcessingType.Function]: nodes.filter(
        ({ data }) => data.specificType === ProcessingType.Function,
      ),
      [ProcessingType.Filter]: nodes.filter(
        ({ data }) => data.specificType === ProcessingType.Filter,
      ),
      [NodeType.Sink]: nodes.filter((node) => node.type === FlowNodeType.Output),
    }
    return generateEdgesFromNodes(groupedNodes)
  }

  return {
    nodeArr,
    flowData,
    nodeTypeOnlyByOne,
    createFlowNodeDataFromEvent,
    countNeededEdges,
  }
}
