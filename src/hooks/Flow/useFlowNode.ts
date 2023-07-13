import { FilterLogicalOperator } from '@/types/enum'
import { Edge, Node, Position } from '@vue-flow/core'

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
  Filter = 'filter',
  Function = 'function',
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

export interface FilterItem {
  field: string
  operator: string
  valueForComparison: string | number
}

export interface FilterForm {
  groupOperator: FilterLogicalOperator
  // It can be used as the ID attribute for list elements, and can be used to
  // identify the source list and target list after a drag-and-drop operation.
  id: string
  items: Array<FilterItem | FilterForm>
}

type PositionData =
  | { sourcePosition: Position; targetPosition?: undefined }
  | { targetPosition: Position; sourcePosition?: undefined }
  | { sourcePosition: Position; targetPosition: Position }

export default (): {
  getNodeClass: (type: NodeType) => string
  getFlowNodeHookPosition: (nodeType: FlowNodeType) => PositionData
  getTypeCommonData: (type: NodeType) => { type: FlowNodeType; class: string } & PositionData
} => {
  const nodeClassMap: Record<NodeType, string> = {
    [NodeType.Source]: 'node-source',
    [NodeType.Processing]: 'node-processing',
    [NodeType.Sink]: 'node-sink',
  }
  const getNodeClass = (type: NodeType) => nodeClassMap[type]

  const getFlowNodeHookPosition = (nodeType: FlowNodeType) => {
    if (nodeType === FlowNodeType.Input) {
      return { sourcePosition: Position.Right }
    }
    if (nodeType === FlowNodeType.Output) {
      return { targetPosition: Position.Left }
    }
    return { sourcePosition: Position.Right, targetPosition: Position.Left }
  }

  const typeMap = {
    [NodeType.Source]: FlowNodeType.Input,
    [NodeType.Processing]: FlowNodeType.Default,
    [NodeType.Sink]: FlowNodeType.Output,
  }
  const getTypeCommonData = (type: NodeType) => {
    const flowNodeType = typeMap[type]
    return {
      class: `node-item ${getNodeClass(type)}`,
      type: flowNodeType,
      ...getFlowNodeHookPosition(flowNodeType),
    }
  }

  return {
    getNodeClass,
    getFlowNodeHookPosition,
    getTypeCommonData,
  }
}
