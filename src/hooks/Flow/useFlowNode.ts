import useBridgeTypeValue, {
  bridgeOrderIndex,
  typesWithProducerAndConsumer,
  useBridgeTypeIcon,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType, FilterLogicalOperator } from '@/types/enum'
import { useFlowNode } from '@emqx/shared-ui-components'
import {
  AI_PLACEHOLDER_TYPE,
  EditedWay,
  FlowNodeType,
  NodeType,
  ProcessingType,
  SourceTypeAllMsgsAndEvents,
} from '@emqx/shared-ui-constants'
import { Edge, Node, Position } from '@vue-flow/core'
import { RuleSourceType, useRuleInputs } from '../Rule/rule/useRule'
import useRuleEvents from '../Rule/rule/useRuleEvents'
import useI18nTl from '../useI18nTl'
import { getImg } from './../../common/tools'

export type FlowData = Array<Node | Edge>

export {
  AI_PLACEHOLDER_TYPE,
  EditedWay,
  FlowNodeType,
  NodeType,
  ProcessingType,
  SourceTypeAllMsgsAndEvents,
}

export const SourceType = RuleSourceType

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
  sourceNodeList: Array<NodeItem>
  processingNodeList: Array<NodeItem>
  sinkNodeList: Array<NodeItem>
  getNodeHeight: (specificType: string) => number
  getNodeClass: (type: NodeType) => string
  getFlowNodeHookPosition: (nodeType: FlowNodeType) => PositionData
  getTypeCommonData: (type: NodeType) => { type: FlowNodeType; class: string } & PositionData
  isBridgerNode: (node: Partial<Node>) => boolean
  isActionBridgeNode: (node: Partial<Node>) => boolean
  isWithFallbackNodes: (node: Node) => boolean
  isBridgeType: (type: string) => boolean
  isAIType: (type: string) => boolean
  isLikeFunctionType: (type: string) => boolean
  getTypeLabel: (specificType: string) => string
  getNodeInfo: (node: Node) => string
  getNodeIcon: (type: string, disabled?: boolean) => string
  getIconClass: (type: string) => string
} => {
  const { t, tl } = useI18nTl('Flow')

  const {
    nodeWidth,
    getNodeClass,
    getFlowNodeHookPosition,
    getTypeCommonData,
    isBridgerNode,
    isActionBridgeNode,
    isWithFallbackNodes,
    isBridgeType,
    isAIType,
    isLikeFunctionType,
    getNodeInfoFunc: getNodeInfo,
  } = useFlowNode()
  /**
   * just record, not for setting
   */
  const getNodeHeight = (specificType: string) => {
    if ([ProcessingType.Function, SinkType.Console].includes(specificType)) {
      return 42
    }
    if (isBridgeType(specificType)) {
      return 66
    }
    return 66
  }

  const typeLabelMap = {
    [SourceType.Message]: t('RuleEngine.messages'),
    [SourceType.Event]: t('RuleEngine.event'),
    [ProcessingType.Function]: t('RuleEngine.dataProcessing'),
    [ProcessingType.Filter]: tl('filter'),
    [ProcessingType.AIOpenAI]: 'OpenAI',
    [ProcessingType.AIAnthropic]: 'Anthropic',
    [ProcessingType.AIGemini]: 'Gemini',
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
    return ret || titleCase(specificType)
  }

  const { getEventList } = useRuleEvents()
  getEventList()

  const { sourceOptList, inputTypesIconNew, getRuleSourceIcon } = useRuleInputs()

  // const getFunctionInfo = (func: FunctionForm) => {
  //   const num = func?.form?.length
  //   return num ? `${num} ${t('Flow.functionNum', num)}` : ''
  // }

  const adjustTypeForSpecialCases = (type: string): string => {
    if (([SourceType.MQTTBroker, SinkType.MQTT] as Array<string>).includes(type)) {
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
    SinkType.Console,
    SinkType.RePub,
    SinkType.Webhook,
  ]
  const isTypeUsingNewIcon = (type: string) =>
    typesIconNew.includes(type) || Object.values(ProcessingType).includes(type as ProcessingType)
  const { getBridgeIcon, needsDarkModeInvert, isSvgIcon } = useBridgeTypeIcon()
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

  const blackIconList: Array<string> = [
    ProcessingType.Function,
    ProcessingType.AIOpenAI,
    ProcessingType.AIAnthropic,
  ]
  // zoom in old icon for clip space padding
  const getIconClass = (type: string): string => {
    if (!type) {
      return ''
    }
    const adjustedType = adjustTypeForSpecialCases(type)
    const classes: string[] = []
    if (blackIconList.includes(adjustedType)) {
      classes.push('img-black')
    }
    if (needsDarkModeInvert(type)) {
      classes.push('dark-invert')
    }
    if (isSvgIcon(type)) {
      classes.push('is-svg')
    }
    if (!isTypeUsingNewIcon(adjustedType) && !classes.includes('img-black') && !isSvgIcon(type)) {
      classes.push('is-scaled-up')
    }
    return classes.join(' ')
  }

  const generateNodeByType = (type: string | ProcessingType): NodeItem => ({
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

  const processingNodeList: Array<NodeItem> = Object.values(ProcessingType).map(generateNodeByType)
  const sinkNodeList: Array<NodeItem> = Object.entries(SinkType)
    .sort(
      (a, b) =>
        (sinkOrderIndex[a[1]] ?? Number.MAX_SAFE_INTEGER) -
        (sinkOrderIndex[b[1]] ?? Number.MAX_SAFE_INTEGER),
    )
    .map(([, value]) => generateNodeByType(value))

  return {
    nodeWidth,
    sourceNodeList,
    processingNodeList,
    sinkNodeList,
    getNodeHeight,
    getNodeClass,
    getFlowNodeHookPosition,
    getTypeCommonData,
    isBridgerNode,
    isActionBridgeNode,
    isWithFallbackNodes,
    isBridgeType,
    isAIType,
    isLikeFunctionType,
    getTypeLabel,
    getNodeInfo,
    getNodeIcon,
    getIconClass,
  }
}
