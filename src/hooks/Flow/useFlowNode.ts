import { getImg } from './../../common/tools'
import useBridgeTypeValue, {
  bridgeOrderIndex,
  typesWithProducerAndConsumer,
  useBridgeTypeIcon,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType, FilterLogicalOperator } from '@/types/enum'
import { RuleEvent } from '@/types/rule'
import { Edge, Node, Position } from '@vue-flow/core'
import { RuleSourceType, useRuleInputs } from '../Rule/rule/useRule'
import useRuleEvents from '../Rule/rule/useRuleEvents'
import useRuleSourceEvents from '../Rule/rule/useRuleSourceEvents'
import useI18nTl from '../useI18nTl'

export type FlowData = Array<Node | Edge>

export const enum NodeType {
  Source,
  Processing,
  Sink,
}

export const SourceType = RuleSourceType

/**
 * Cannot be added, only for show webhook
 */
export const SourceTypeAllMsgsAndEvents = 'all-msgs-and-events'

export const enum ProcessingType {
  Filter = 'filter',
  Function = 'function',
}

type OmitKeys = 'KafkaConsumer' | 'GCPConsumer' | 'SysKeeperProxy'
const ActionSinkType: Omit<typeof BridgeType, OmitKeys> = omit(
  BridgeType,
  Object.keys(BridgeType).filter((key) => {
    const value = BridgeType[key as keyof typeof BridgeType]
    return INGRESS_BRIDGE_TYPES.includes(value) || value === BridgeType.SysKeeperProxy
  }),
) as Omit<typeof BridgeType, OmitKeys>

export const SinkType = {
  ...ActionSinkType,
  RePub: 'republish',
  Console: 'console',
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

export interface FunctionItem {
  id: string
  field: string
  func: {
    name: string
    args: Array<string | number>
  }
  alias: string
}

interface NodeItem {
  name: string
  specificType: string
}

export const enum EditedWay {
  Form,
  SQL,
}

export type FunctionForm = {
  editedWay: EditedWay
  form: Array<FunctionItem>
  sql: string
}

export interface FilterFormData {
  groupOperator: FilterLogicalOperator
  // It can be used as the ID attribute for list elements, and can be used to
  // identify the source list and target list after a drag-and-drop operation.
  id: string
  items: Array<FilterItem | FilterFormData>
}

export interface FilterForm {
  editedWay: EditedWay
  sql: string
  form: FilterFormData
}

type PositionData =
  | { sourcePosition: Position; targetPosition?: undefined }
  | { targetPosition: Position; sourcePosition?: undefined }
  | { sourcePosition: Position; targetPosition: Position }

export default (): {
  nodeWidth: number
  nodeHeight: number
  sourceNodeList: Array<NodeItem>
  processingNodeList: Array<NodeItem>
  sinkNodeList: Array<NodeItem>
  getNodeClass: (type: NodeType) => string
  getFlowNodeHookPosition: (nodeType: FlowNodeType) => PositionData
  getTypeCommonData: (type: NodeType) => { type: FlowNodeType; class: string } & PositionData
  isBridgerNode: (node: Partial<Node>) => boolean
  isBridgeType: (type: string) => boolean
  getTypeLabel: (specificType: string) => string
  getNodeInfo: (node: Node) => string
  getNodeIcon: (type: string, disabled?: boolean) => string
  getIconClass: (type: string) => string
} => {
  const { t, tl } = useI18nTl('Flow')

  /**
   * just record, not for setting
   */
  const nodeWidth = 200
  const nodeHeight = 60

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
    [ProcessingType.Function]: t('RuleEngine.dataProcessing'),
    [ProcessingType.Filter]: tl('filter'),
    [SinkType.Webhook]: t('RuleEngine.HTTPServer'),
    [SinkType.MQTT]: t('RuleEngine.mqttBroker'),
    [SinkType.Console]: t('RuleEngine.consoleOutput'),
    [SinkType.RePub]: t('RuleEngine.republish'),
    [SinkType.KafkaProducer]: `${t('RuleEngine.kafka')} ${t('RuleEngine.producer')}`,
  }
  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()
  const getTypeLabel = (specificType: string): string => {
    let ret: string | undefined = typeLabelMap[specificType]
    if (!ret && isBridgeType(specificType)) {
      ret = getBridgeLabelByTypeValue(specificType as BridgeType)
    }
    return ret || specificType
  }

  const countFiltersNum = (filter: FilterFormData) => {
    return filter.items.reduce((count, item) => {
      if ('items' in item) {
        count += countFiltersNum(item)
      } else {
        count += 1
      }
      return count
    }, 0)
  }

  const { getEventLabel } = useRuleSourceEvents()
  const { getEventList } = useRuleEvents()
  let eventList: Array<RuleEvent> = []

  const initEventList = async () => {
    eventList = await getEventList()
  }
  initEventList()

  const isNotBridgeSourceNodeTypes = [
    SourceType.Message,
    SourceType.Event,
    SourceTypeAllMsgsAndEvents,
  ]
  const isNotBridgeSinkNodeTypes = [SinkType.Console, SinkType.RePub]
  const isBridgerNode = ({ type, data }: Partial<Node>): boolean => {
    const { specificType } = data || {}
    return (
      (type === FlowNodeType.Input &&
        !isNotBridgeSourceNodeTypes.includes(specificType as string)) ||
      (type === FlowNodeType.Output && !isNotBridgeSinkNodeTypes.includes(specificType as string))
    )
  }
  const { sourceOptList, isNotBridgeSourceTypes, inputTypesIconNew, getRuleSourceIcon } =
    useRuleInputs()

  const isNotBridgeTypes = [
    ...isNotBridgeSourceTypes,
    ProcessingType.Filter,
    ProcessingType.Function,
    SinkType.RePub,
    SinkType.Console,
  ]
  const isBridgeType = (type: string) => {
    const isBridge = Object.entries(BridgeType).some(([, value]) => value === type)
    return !isNotBridgeTypes.includes(type) && isBridge
  }

  const getEventLabelFromVal = (val: string) => {
    if (!val || !eventList.length) {
      return ''
    }
    const target = eventList.find(({ event }) => event === val)
    return target ? startCase(getEventLabel(target.title)) : ''
  }

  const getFilterInfo = (filter: FilterForm) => {
    const num = countFiltersNum(filter.form)
    return `${num} ${t('Flow.condition', num)}`
  }

  // const getFunctionInfo = (func: FunctionForm) => {
  //   const num = func?.form?.length
  //   return num ? `${num} ${t('Flow.functionNum', num)}` : ''
  // }

  const getNodeInfo = (node: Node): string => {
    const { specificType, formData } = node.data
    if (!specificType || !formData) {
      return ''
    }
    switch (specificType) {
      case SourceType.Message:
        return `${t('Base.topic')}: ${formData.topic}`
      case SourceType.Event:
        return `${t('RuleEngine.event')}: ${getEventLabelFromVal(formData.event)}`
      case ProcessingType.Function:
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

  const adjustTypeForSpecialCases = (type: string): string => {
    if (([SourceType.MQTT, SinkType.MQTT] as Array<string>).includes(type)) {
      return BridgeType.MQTT
    }

    const match = typesWithProducerAndConsumer.find((item) => type.includes(item))
    return match || type
  }
  /**
   * these types icon in @/assets/flowIcon
   * others in @/assets/img
   */
  const typesIconNew: Array<string> = [
    ...inputTypesIconNew,
    SourceTypeAllMsgsAndEvents,
    ProcessingType.Filter,
    ProcessingType.Function,
    SinkType.Console,
    SinkType.RePub,
    SinkType.Webhook,
  ]
  const isTypeUsingNewIcon = (type: string) => typesIconNew.includes(type)
  const { getBridgeIcon } = useBridgeTypeIcon()
  const getNodeIcon = (type: string, disabled = false): string => {
    try {
      if (!type) {
        return ''
      }
      if (Object.values(SourceType).includes(type)) {
        return getRuleSourceIcon(type)
      }
      const adjustedType = adjustTypeForSpecialCases(type)
      const iconSuffix = disabled ? '-disabled' : ''

      if (isTypeUsingNewIcon(adjustedType)) {
        return getImg(`flowIcon/${adjustedType}${iconSuffix}.png`)
      }
      if (isBridgeType(type)) {
        return getBridgeIcon(type)
      }
      return getImg(`img/${adjustedType}${iconSuffix}.png`)
    } catch (error) {
      return ''
    }
  }

  // zoom in old icon for clip space padding
  const getIconClass = (type: string): string => {
    if (!type) {
      return ''
    }
    const adjustedType = adjustTypeForSpecialCases(type)
    return isTypeUsingNewIcon(adjustedType) ? '' : 'is-scaled-up'
  }

  const generateNodeByType = (type: string): NodeItem => ({
    name: getTypeLabel(type),
    specificType: type,
  })

  const sinkOrderIndex = {
    [SinkType.RePub]: -2,
    [SinkType.Console]: -1,
    ...bridgeOrderIndex,
  }

  const sourceNodeList: Array<NodeItem> = sourceOptList.map(({ value, label }) => ({
    specificType: value,
    name: label,
  }))
  const processingNodeList: Array<NodeItem> = [
    generateNodeByType(ProcessingType.Function),
    generateNodeByType(ProcessingType.Filter),
  ]
  const sinkNodeList: Array<NodeItem> = Object.entries(SinkType)
    .sort(
      (a, b) =>
        (sinkOrderIndex[a[1]] || Number.MAX_SAFE_INTEGER) -
        (sinkOrderIndex[b[1]] || Number.MAX_SAFE_INTEGER),
    )
    .map(([, value]) => generateNodeByType(value))

  return {
    nodeWidth,
    nodeHeight,
    sourceNodeList,
    processingNodeList,
    sinkNodeList,
    getNodeClass,
    getFlowNodeHookPosition,
    getTypeCommonData,
    isBridgerNode,
    isBridgeType,
    getTypeLabel,
    getNodeInfo,
    getNodeIcon,
    getIconClass,
  }
}
