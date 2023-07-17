import { createRandomString } from '@/common/tools'
import { Edge, Node, VueFlow } from '@vue-flow/core'
import { Ref, ref } from 'vue'
import useI18nTl from '../useI18nTl'
import useFlowNode, {
  FlowData,
  FlowNodeType,
  NodeType,
  ProcessingType,
  SinkType,
  SourceType,
} from './useFlowNode'

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
  const { t, tl } = useI18nTl('Flow')

  const nodeArr: Array<NodeTypeItem> = [
    {
      type: NodeType.Source,
      typeLabel: 'Source',
      nodeList: [
        { name: t('RuleEngine.messages'), specificType: SourceType.Message },
        { name: t('RuleEngine.event'), specificType: SourceType.Event },
        { name: t('RuleEngine.mqttBroker'), specificType: SourceType.MQTTBroker },
      ],
    },
    {
      type: NodeType.Processing,
      typeLabel: 'Processing',
      nodeList: [
        { name: tl('function'), specificType: ProcessingType.Function },
        { name: tl('filter'), specificType: ProcessingType.Filter },
      ],
    },
    {
      type: NodeType.Sink,
      typeLabel: 'Sink',
      nodeList: [
        { name: t('RuleEngine.HTTPServer'), specificType: SinkType.HTTP },
        { name: t('RuleEngine.mqttBroker'), specificType: SinkType.MQTTBroker },
        { name: t('RuleEngine.consoleOutput'), specificType: SinkType.Console },
        { name: t('RuleEngine.republish'), specificType: SinkType.RePub },
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

  const { getNodeClass, getFlowNodeHookPosition } = useFlowNode()

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
      class: `node-item ${getNodeClass(type)}`,
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
