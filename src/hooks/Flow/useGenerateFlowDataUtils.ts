import { arraysAreEqual, getTypeAndNameFromKey } from '@/common/tools'
import { Action, OutputItem, OutputItemObj, RuleItem } from '@/types/rule'
import { AICompletionProfile, AIProviderForm, AIProviderType } from '@/types/typeAlias'
import { useGenerateFlowDataUtils } from '@emqx/shared-ui-components'
import { Edge, Node, Styles } from '@vue-flow/core'
import { useRuleFallbackActions, useRuleInputs, useRuleUtils } from '../Rule/rule/useRule'
import useWebhookUtils from '../Webhook/useWebhookUtils'
import useI18nTl from '../useI18nTl'
import useFlowNode, {
  EditedWay,
  FilterFormData,
  FunctionItem,
  NodeType,
  ProcessingType,
  SinkType,
  SourceTypeAllMsgsAndEvents,
} from './useFlowNode'
import { useNodeForm } from '@emqx/shared-ui-components'

/**
 * ID rule of each node
 * - event - `event-{val}`
 * - topic - `topic-{val}`
 * - console - `console`
 * - bridge - `{bridgeType}-{bridgeID}`
 * if bridge type is both direction, add `_source` to the source node id
 * - repub - `republish-{topic}`
 * - filter - `filter-{ruleID}`
 * - function - `function-{ruleID}`
 * - ai - `{aiName}-{ruleID}`
 */

/**
 * Sort by column
 * ‼️‼️‼️‼️‼️ Note that since the AI part is essentially a function, it is grouped together in the function part
 */
export type GroupedNode = {
  [NodeType.Source]: Array<Node>
  [ProcessingType.Filter]: Array<Node>
  [ProcessingType.Function]: Array<Node>
  [NodeType.Sink]: Array<Node>
  [NodeType.Fallback]?: Array<Node>
}

export default (): {
  getBridgeIdFromInput: (input: string) => string
  detectInputType: (from: string) => string
  detectOutputType: (action: OutputItem) => string
  detectFieldsExpressionsEditedWay: (functionForm: Array<FunctionItem>) => EditedWay
  detectWhereDataEditedWay: (filterForm: FilterFormData) => EditedWay
  generateFunctionFormFromExpression: (expression: string) => Array<FunctionItem> | undefined
  addAIRecordToAINode: (
    node: Node,
    provider?: AIProviderForm,
    completion?: AICompletionProfile,
  ) => Node
  customHandleAINode: (
    node: Node,
    provider: AIProviderForm,
    completion: AICompletionProfile,
  ) => Node
  generateFlowDataFromRuleItem: (ruleData: RuleItem) => {
    nodes: GroupedNode
    edges: Array<Edge>
  }
  generateFlowDataFromActionItem: (action: Action) => {
    nodes: GroupedNode
    edges: Array<Edge>
  }
  fallbackEdgeStyle: Styles
  generateFallbackEdge: (source: Node, target: Node, style?: Record<string, string>) => Edge
  countNodesPosition: (nodes: GroupedNode, edgeArr: Array<Edge>) => Promise<void>
  isRemovedBridge: (node: Node) => boolean
  addFlagToRemovedBridgeNode: (node: Node) => Node
  addFlagToRemovedAINode: (node: Node) => Node
  addFallbackFlagToNodes: (nodes: Array<Node>) => Array<Node>
  generateEdgesFromNodes: (nodes: GroupedNode) => Array<Edge>
} => {
  const { getTypeCommonData, getTypeLabel, getNodeInfo, isAIType } = useFlowNode()
  const { getBridgeGeneralType } = useBridgeTypeValue()
  const {
    detectFieldsExpressionsEditedWay,
    detectWhereDataEditedWay,
    generateFunctionFormFromExpression,
    addAIRecordToAINode: addAIRecordToAINodeInShared,
    generateFallbackEdge,
    countNodesPosition,
    isRemovedBridge,
    addFlagToRemovedBridgeNode,
    addFlagToRemovedAINode,
    addFallbackFlagToNodes,
    generateEdgesFromNodes,
    createInitNodes,
    generateEdgeFromTwoNodes,
    generateNodesBaseRuleFrom,
    newFlowDataFromRuleItem,
  } = useGenerateFlowDataUtils()

  const getBridgeNameFromId = (id: string): string => getTypeAndNameFromKey(id).name

  const getBridgeTypeFromId = (id: string): string => getTypeAndNameFromKey(id).type

  /**
   * @param bridgeType The bridge type here is a specific type, for example, if it is influxdb, which version is it?
   */
  const getSpecificTypeForBridge = (bridgeType: string) => getBridgeGeneralType(bridgeType)

  /* FIELDS */
  const aiNodeSpecificTypeMap = new Map([
    [AIProviderType.openai_response, ProcessingType.AIOpenAI],
    [AIProviderType.anthropic, ProcessingType.AIAnthropic],
    [AIProviderType.openai, ProcessingType.AIGemini],
  ])

  const geminiModelReg = /gemini|gemma/
  const getAiNodeSpecificType = (
    provider: AIProviderForm,
    completion: AICompletionProfile,
  ): string => {
    if (provider.type === AIProviderType.openai) {
      const isGeminiModel = completion.model && geminiModelReg.test(completion.model)
      const isGeminiBaseUrl = provider.base_url === GEMINI_DEFAULT_BASE_URL
      if (isGeminiModel || isGeminiBaseUrl) {
        return ProcessingType.AIGemini
      }
    }
    return aiNodeSpecificTypeMap.get(provider.type) ?? ''
  }

  const customHandleAINode = (
    node: Node,
    provider: AIProviderForm,
    completion: AICompletionProfile,
  ) => {
    if (!node.data.specificType) {
      node.data.specificType = getAiNodeSpecificType(provider, completion)
      node.label = getTypeLabel(node.data.specificType)
      node.data.desc = getNodeInfo(node)
    }
    return node
  }

  const addAIRecordToAINode = (
    node: Node,
    provider?: AIProviderForm,
    completion?: AICompletionProfile,
  ) => {
    let retNode = node
    if (isAIType(node.data.specificType) && provider && completion) {
      retNode = customHandleAINode(
        addAIRecordToAINodeInShared(node, provider as any, completion as any),
        provider as any,
        completion as any,
      )
    }
    return retNode
  }

  /* SOURCE */
  const { getBridgeIdFromInput, detectInputType } = useRuleInputs()

  /**
   * generate input node
   * - Message
   * - Event
   * - Bridge
   */
  const generateNodesBaseFromData = (fromArr: Array<string>) => {
    return generateNodesBaseRuleFrom(fromArr, getTypeLabel, getNodeInfo, getSpecificTypeForBridge)
  }

  const { tl } = useI18nTl('RuleEngine')

  const generateAllMsgsAndEventsNode = () => {
    const node = {
      id: SourceTypeAllMsgsAndEvents,
      ...getTypeCommonData(NodeType.Source),
      label: tl('allMsgsAndEvents'),
      position: { x: 0, y: 0 },
      data: { specificType: SourceTypeAllMsgsAndEvents, formData: {} },
    }
    return node
  }

  /* WHERE */

  /* RULE OUTPUTS */
  /**
   * @returns If the returned type is a bridge type, it is a specific bridge type
   */
  const detectOutputType = (action: OutputItem): string => {
    if (isString(action)) {
      return getBridgeTypeFromId(action)
    } else {
      const { function: func } = action
      if (func === SinkType.Console) {
        return SinkType.Console
      } else if (action.args?.topic) {
        return SinkType.RePub
      }
    }
    return ''
  }
  const { getCommonFormDataByType } = useNodeForm()
  const generateNodeBaseRuleOutput = (action: OutputItem): Node | undefined => {
    const type = detectOutputType(action)
    if (!type) {
      return undefined
    }

    let specificType = type
    if (type !== SinkType.Console && type !== SinkType.RePub) {
      specificType = getSpecificTypeForBridge(specificType)
    }

    let id = ''
    let formData = {}

    if (type === SinkType.Console) {
      id = SinkType.Console
      formData = getCommonFormDataByType(SinkType.Console)
    } else if (type === SinkType.RePub) {
      id = `${SinkType.RePub}-${(action as OutputItemObj).args?.topic}`
      formData = action
    } else {
      id = `${type}-${action}`
      formData = { name: getBridgeNameFromId(action as string), id: action }
    }

    const node: Node = {
      id,
      ...getTypeCommonData(NodeType.Sink),
      label: getTypeLabel(specificType),
      position: { x: 0, y: 0 },
      data: { specificType, formData, desc: '' },
    }
    node.data.desc = getNodeInfo(node)
    return node
  }
  const generateNodesBaseRuleOutputs = (actions: Array<OutputItem>): Array<Node> => {
    return actions.reduce((arr: Array<Node>, action): Array<Node> => {
      const node = generateNodeBaseRuleOutput(action)
      if (node) {
        arr.push(node)
      }
      return arr
    }, [])
  }

  /* RULE */
  const { judgeIsWebhookRule } = useWebhookUtils()
  const { allMsgsAndEvents } = useRuleUtils()
  /**
   * Generate message, event, filter, and function nodes based on the SQL of the rule.
   * Generate bridge, console, and republish nodes based on the actions.
   * And the corresponding edges.
   */
  const generateFlowDataFromRuleItem = (rule: RuleItem): { nodes: GroupedNode; edges: Edge[] } => {
    const { actions, from } = rule

    const getSourceNodes = () => {
      if (from && from.length > 0) {
        if (judgeIsWebhookRule(rule) && arraysAreEqual(from, allMsgsAndEvents.value)) {
          // TODO:
          return [generateAllMsgsAndEventsNode()]
        }
        return generateNodesBaseFromData(from)
      }
      return []
    }
    const getSinkNodes = () => generateNodesBaseRuleOutputs(actions)
    return newFlowDataFromRuleItem(rule, getSourceNodes, getSinkNodes)
  }

  /* ACTIONS */
  const { convertFallbackActionToRuleOutput } = useRuleFallbackActions()
  const { fallbackEdgeStyle } = useFlowEdge()

  const generateFlowDataFromActionItem = (
    action: Action,
  ): { nodes: GroupedNode; edges: Edge[] } => {
    const { fallback_actions } = action
    const id = action.id ?? getBridgeKey(action)
    const nodes: GroupedNode = createInitNodes()
    if (!fallback_actions?.length) {
      return { nodes, edges: [] }
    }
    const sourceNode = generateNodeBaseRuleOutput(id)
    if (!sourceNode) {
      return { nodes, edges: [] }
    }

    const convertedFallbackActions = fallback_actions.map(convertFallbackActionToRuleOutput)
    const targetNodes = addFallbackFlagToNodes(
      generateNodesBaseRuleOutputs(convertedFallbackActions),
    )
    const edges = targetNodes.map((node) =>
      generateEdgeFromTwoNodes(sourceNode, node, fallbackEdgeStyle),
    )
    nodes[NodeType.Sink] = [sourceNode]
    nodes[NodeType.Fallback] = targetNodes
    return { nodes, edges }
  }

  /* BRIDGE */

  return {
    getBridgeIdFromInput,
    detectInputType,
    detectOutputType,
    detectFieldsExpressionsEditedWay,
    detectWhereDataEditedWay,
    generateFunctionFormFromExpression,
    addAIRecordToAINode,
    customHandleAINode,
    generateFlowDataFromRuleItem,
    generateFallbackEdge,
    generateFlowDataFromActionItem,
    fallbackEdgeStyle,
    countNodesPosition,
    isRemovedBridge,
    addFlagToRemovedBridgeNode,
    addFallbackFlagToNodes,
    generateEdgesFromNodes,
    addFlagToRemovedAINode,
  }
}
