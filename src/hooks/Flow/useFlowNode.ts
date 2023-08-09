import { BridgeDirection, BridgeType, FilterLogicalOperator } from '@/types/enum'
import { Edge, Node, Position } from '@vue-flow/core'
import useI18nTl from '../useI18nTl'

export type FlowData = Array<Node | Edge>

export const enum NodeType {
  Source,
  Processing,
  Sink,
}

export const SOURCE_SUFFIX = '_source'
export const SINK_SUFFIX = '_sink'

export const getSpecificTypeWithDirection = (
  type: BridgeType,
  direction: BridgeDirection,
): string => `${type}_${direction === BridgeDirection.Ingress ? SOURCE_SUFFIX : SINK_SUFFIX}`

export const SourceType = {
  Message: 'message',
  Event: 'event',
  MQTTBroker: getSpecificTypeWithDirection(BridgeType.MQTT, BridgeDirection.Ingress),
}

export const enum ProcessingType {
  Filter = 'filter',
  Function = 'function',
}

export const SinkType = {
  HTTP: BridgeType.Webhook,
  MQTTBroker: getSpecificTypeWithDirection(BridgeType.MQTT, BridgeDirection.Egress),
  Console: 'console',
  RePub: 'republish',
}

export const enum FlowNodeType {
  Input = 'custom_input',
  Default = 'custom_default',
  Output = 'custom_output',
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
  getTypeLabel: (specificType: string) => string
  getNodeInfo: (node: Node) => string
  getNodeIcon: (type: string) => string
} => {
  const { t, tl } = useI18nTl('Flow')

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

  const typeLabelMap = {
    [SourceType.Message]: t('RuleEngine.messages'),
    [SourceType.Event]: t('RuleEngine.event'),
    [SourceType.MQTTBroker]: t('RuleEngine.mqttBroker'),
    [ProcessingType.Function]: tl('function'),
    [ProcessingType.Filter]: tl('filter'),
    [SinkType.HTTP]: t('RuleEngine.HTTPServer'),
    [SinkType.MQTTBroker]: t('RuleEngine.mqttBroker'),
    [SinkType.Console]: t('RuleEngine.consoleOutput'),
    [SinkType.RePub]: t('RuleEngine.republish'),
  }

  const getTypeLabel = (specificType: string): string =>
    typeLabelMap[specificType] || (specificType as string)

  const countFiltersNum = (filter: FilterForm) => {
    return filter.items.reduce((count, item) => {
      if ('items' in item) {
        count += countFiltersNum(item)
      } else {
        count += 1
      }
      return count
    }, 0)
  }

  const getFilterInfo = (filter: FilterForm) => {
    const num = countFiltersNum(filter)
    return `${num}${t('Flow.condition', num)}`
  }

  const getNodeInfo = (node: Node): string => {
    const { specificType, formData } = node.data
    if (!specificType || !formData) {
      return ''
    }
    switch (specificType) {
      case SourceType.Message:
        return `${t('Base.topic')}: ${formData.topic}`
      case SourceType.Event:
        return `${t('RuleEngine.event')}: ${formData.event}`
      case ProcessingType.Function:
        // TODO:TODO:TODO:TODO:
        return ''
      case ProcessingType.Filter:
        return getFilterInfo(formData)
      case SinkType.Console:
        return ''
      case SinkType.RePub:
        return `${t('Base.topic')}: ${formData.args?.topic}`
      default:
        return `${t('Base.name')}: ${formData.name}`
    }
  }

  const getNodeIcon = (type: string): string => {
    try {
      if (!type) {
        return ''
      }
      if (type === SourceType.MQTTBroker || type === SinkType.MQTTBroker) {
        return require(`@/assets/flowIcon/mqtt.png`)
      }
      return require(`@/assets/flowIcon/${type}.png`)
    } catch (error) {
      return ''
    }
  }

  return {
    getNodeClass,
    getFlowNodeHookPosition,
    getTypeCommonData,
    getTypeLabel,
    getNodeInfo,
    getNodeIcon,
  }
}
