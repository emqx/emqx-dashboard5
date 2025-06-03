import {
  arraysAreEqual,
  getKeyPartsFromSQL,
  ruleSelectionAliasPartReg,
  getRuleSelectionAlias,
  getTypeAndNameFromKey,
  isForeachReg,
  splitOnComma,
  trimSpacesAndLFs,
  judgeRuleSelectionWithFunc,
} from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { Action, OutputItem, OutputItemObj, RuleItem } from '@/types/rule'
import { AICompletionProfile, AIProviderForm } from '@/types/typeAlias'
import { Edge, Node } from '@vue-flow/core'
import ELK from 'elkjs/lib/elk.bundled'
import { useRuleFallbackActions, useRuleInputs, useRuleUtils } from '../Rule/rule/useRule'
import useWebhookUtils from '../Webhook/useWebhookUtils'
import useI18nTl from '../useI18nTl'
import useRuleFunc, { ArgItem } from '../useRuleFunc'
import useFlowNode, {
  AI_PLACEHOLDER_TYPE,
  EditedWay,
  FilterFormData,
  FunctionItem,
  NodeType,
  ProcessingType,
  SinkType,
  SourceType,
  SourceTypeAllMsgsAndEvents,
} from './useFlowNode'
import {
  createConsoleForm,
  createEventForm,
  createFunctionItem,
  createMessageForm,
} from './useNodeForm'
import useParseWhere from './useParseWhere'

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
  generateFlowDataFromRuleItem: (ruleData: RuleItem) => {
    nodes: GroupedNode
    edges: Array<Edge>
  }
  generateFlowDataFromActionItem: (action: Action) => {
    nodes: GroupedNode
    edges: Array<Edge>
  }
  fallbackEdgeStyle: Record<string, string>
  generateFallbackEdge: (source: Node, target: Node, style?: Record<string, string>) => Edge
  countNodesPosition: (nodes: GroupedNode, edgeArr: Array<Edge>) => Promise<void>
  isRemovedBridge: (node: Node) => boolean
  addFlagToRemovedBridgeNode: (node: Node) => Node
  addFlagToRemovedAINode: (node: Node) => Node
  addFallbackFlagToNodes: (nodes: Array<Node>) => Array<Node>
  generateEdgesFromNodes: (nodes: GroupedNode) => Array<Edge>
} => {
  const { nodeWidth, getTypeCommonData, getTypeLabel, getNodeInfo, isBridgerNode, isAIType } =
    useFlowNode()
  const { getBridgeGeneralType } = useBridgeTypeValue()
  const { detectFilterFormLevel, generateFilterForm } = useParseWhere()
  const { getFuncGroupByName, getFuncItemByName, getArgIndex } = useRuleFunc()

  const getBridgeNameFromId = (id: string): string => getTypeAndNameFromKey(id).name

  const getBridgeTypeFromId = (id: string): string => getTypeAndNameFromKey(id).type

  /**
   * @param bridgeType The bridge type here is a specific type, for example, if it is influxdb, which version is it?
   */
  const getSpecificTypeForBridge = (bridgeType: string) => getBridgeGeneralType(bridgeType)

  /* FIELDS */
  const countArgsWhenLengthNotMatch = (
    functionParamTemplate: Array<ArgItem>,
    actualParams: Array<string>,
  ) => {
    let startIndex = -1
    return functionParamTemplate.map((item, index) => {
      if (item.required && startIndex < 0) {
        startIndex = index
      }
      const argIndex = index - startIndex
      return startIndex > -1 && actualParams[argIndex] !== undefined ? actualParams[argIndex] : ''
    })
  }

  /**
   * Because the subbits parameter is special, it is handled specially.
   * https://docs.emqx.com/en/enterprise/v5.1/data-integration/rule-sql-builtin-functions.html#bit-functions
   */
  const countActualArgsForSubbits = (actualParams: Array<string>): Array<string> => {
    return actualParams.length === 2 ? [actualParams[0], '', actualParams[1]] : actualParams
  }

  const strArgReg = /^'.*'$/
  const getFuncDataFromExpression = (
    expression: string,
  ): { field: string; func: { name: string; args: Array<string | number> } } | undefined => {
    const funcName = expression.slice(0, expression.indexOf('('))
    const funcGroup = getFuncGroupByName(funcName)
    const funcItem = getFuncItemByName(funcName)
    if (!funcGroup || !funcItem) {
      console.error(`can not find function ${funcName}`)
      return
    }
    const argIndex = getArgIndex(funcItem, funcGroup)
    const argsContent = expression.slice(expression.indexOf('(') + 1, expression.lastIndexOf(')'))
    let funcArgs = splitOnComma(argsContent).map((item) => item.trim())

    if (funcName === 'subbits') {
      funcArgs = countActualArgsForSubbits(funcArgs)
    }
    let argStrArr: Array<string> = []
    if (funcArgs.length !== funcItem.args.length) {
      argStrArr = countArgsWhenLengthNotMatch(funcItem.args, funcArgs)
    } else {
      argStrArr = funcArgs
    }
    const args = argStrArr.reduce(
      (result: Array<string | number>, argItem: string, index: number) => {
        const argInfo = funcItem.args?.[index]
        const isStringType =
          argInfo?.type === 'string' ||
          (argInfo?.type === 'enum' &&
            typeof argInfo?.optionalValues?.find(
              (enumItem) => enumItem === argItem.slice(1, -1),
            ) === 'string')
        const argResult = strArgReg.test(argItem) && isStringType ? argItem.slice(1, -1) : argItem
        result.push(argResult)
        return result
      },
      [],
    )
    return { func: { name: funcName, args }, field: argStrArr[argIndex].toString() }
  }

  const generateFunctionFormItemFromExpression = (expressionItem: string): FunctionItem => {
    const form = createFunctionItem()
    const alias = getRuleSelectionAlias(expressionItem)
    if (!isUndefined(alias)) {
      form.alias = alias
    }

    const selection = expressionItem.replace(ruleSelectionAliasPartReg, '')

    if (judgeRuleSelectionWithFunc(selection)) {
      const funcData = getFuncDataFromExpression(selection)
      if (funcData) {
        return { ...form, ...funcData }
      }
    }
    return { ...form, field: selection }
  }

  const generateFunctionFormFromExpression = (expression: string) => {
    if (trimSpacesAndLFs(expression) === DEFAULT_SELECT) {
      return
    }
    const expressionArr = splitOnComma(expression).map((item) => trimSpacesAndLFs(item))
    const formData = expressionArr.map((item) => generateFunctionFormItemFromExpression(item))
    return formData
  }

  const fieldWithFuncReg = /.*\(.*\).*/
  const detectFieldsExpressionsEditedWay = (functionForm: FunctionItem[]) => {
    const containsUnprocessedFields = functionForm.some(
      ({ field }) => fieldWithFuncReg.test(field) || isForeachReg.test(field),
    )
    return containsUnprocessedFields ? EditedWay.SQL : EditedWay.Form
  }
  const aiExpressionReg = new RegExp(`^${aiExpressionPartReg.source}$`, 'i')

  /**
   * normal_expression1, normal_expression2, ai_expression1, ai_expression2, normal_expression3, normal_expression4 =>
   * [normal_expression1, normal_expression2], [ai_expression1, ai_expression2], [normal_expression3, normal_expression4]
   */
  const chunkExpressionArr = (expressionArr: Array<string>) => {
    return expressionArr.reduce((acc: Array<Array<string>>, item) => {
      let isSameWithLastChunk = false
      const lastChunk = acc[acc.length - 1]
      if (lastChunk) {
        const isLastChunkAI = aiExpressionReg.test(lastChunk[lastChunk.length - 1])
        const isCurrentItemAI = aiExpressionReg.test(item)
        isSameWithLastChunk = isLastChunkAI === isCurrentItemAI
      }
      if (isSameWithLastChunk) {
        lastChunk.push(item)
      } else {
        acc.push([item])
      }
      return acc
    }, [])
  }
  const generateNodeBaseNormalFieldExpressions = (
    fieldExpressions: string,
    ruleId: string,
  ): Node | undefined => {
    const formData = generateFunctionFormFromExpression(fieldExpressions)
    if (!formData) {
      return
    }
    const editedWay = detectFieldsExpressionsEditedWay(formData)
    const node = {
      id: `${ProcessingType.Function}-${ruleId}`,
      ...getTypeCommonData(NodeType.Processing),
      label: getTypeLabel(ProcessingType.Function),
      position: { x: 0, y: 0 },
      data: {
        specificType: ProcessingType.Function,
        formData: {
          editedWay,
          sql: fieldExpressions,
          form: formData,
        },
        desc: '',
      },
    }
    node.data.desc = getNodeInfo(node)
    return node
  }
  const generateNodeBaseAIFieldExpression = (
    fieldExpression: string,
    ruleId: string,
  ): Node | undefined => {
    const match = fieldExpression.match(aiExpressionReg)
    if (!match?.groups) {
      return
    }
    const { name, alias, input } = match.groups
    const node = {
      id: `${name}-${ruleId}`,
      ...getTypeCommonData(NodeType.Processing),
      label: name,
      position: { x: 0, y: 0 },
      data: {
        specificType: AI_PLACEHOLDER_TYPE,
        formData: {
          input,
          name,
          alias,
        },
        desc: '',
      },
    }
    return node
  }
  /**
   * @returns function node and ai nodes
   */
  const generateNodesBaseFieldsExpressions = (fieldsExpressions: string, ruleId: string) => {
    const expressionArr = splitOnComma(fieldsExpressions).map((item) => trimSpacesAndLFs(item))
    const chunkedExpressionArr = chunkExpressionArr(expressionArr)
    const nodes: Array<Node> = []
    chunkedExpressionArr.forEach((expressionArr) => {
      const isAI = aiExpressionReg.test(expressionArr[expressionArr.length - 1])
      if (isAI) {
        nodes.push(
          ...(expressionArr
            .map((expression) => generateNodeBaseAIFieldExpression(expression, ruleId))
            .filter(Boolean) as Array<Node>),
        )
      } else {
        const normalNode = generateNodeBaseNormalFieldExpressions(expressionArr.join(','), ruleId)
        if (normalNode) {
          nodes.push(normalNode)
        }
      }
    })
    return nodes
  }

  const addAIRecordToAINode = (
    node: Node,
    provider?: AIProviderForm,
    completion?: AICompletionProfile,
  ) => {
    if (isAIType(node.data.specificType) && provider && completion) {
      const nodeType = `ai-${provider.type}`
      node.label = getTypeLabel(nodeType)
      node.data.specificType = nodeType
      node.data.formData = {
        ...node.data.formData,
        ...provider,
        ...omit(completion, ['name', 'type']),
        api_key: ENCRYPTED_PASSWORD,
      }
      node.data.isCreated = true
      node.data.desc = getNodeInfo(node)
    }
    return node
  }

  /* SOURCE */
  const { getBridgeIdFromInput, detectInputType } = useRuleInputs()
  const getFormDataByType = (type: string, value: string) => {
    if (type === SourceType.Event) {
      return createEventForm(value)
    } else if (type === SourceType.Message) {
      return createMessageForm(value)
    }
    const bridgeId = getBridgeIdFromInput(value)
    return { name: getBridgeNameFromId(bridgeId), id: bridgeId }
  }

  /**
   * generate input node
   * - Message
   * - Event
   * - Bridge
   */
  const generateNodesBaseFromData = (fromArr: Array<string>) => {
    return fromArr.reduce((arr: Array<Node>, fromItem): Array<Node> => {
      const type = detectInputType(fromItem)
      let specificType = type
      if (type !== SourceType.Event && type !== SourceType.Message) {
        specificType = getSpecificTypeForBridge(specificType)
      }
      const formData = getFormDataByType(type, fromItem)
      let typeInId = type
      /**
       * for prevent display issues in the flow diagram when action and source have the same name
       */
      if (CONNECTOR_TYPES_WITH_TWO_DIRECTIONS.includes(type as BridgeType)) {
        typeInId = `${type}_source`
      }
      const id =
        type === SourceType.Event || type === SourceType.Message
          ? `${typeInId}-${fromItem}`
          : `${typeInId}-${getBridgeIdFromInput(fromItem)}`

      const node = {
        id,
        ...getTypeCommonData(NodeType.Source),
        label: getTypeLabel(specificType),
        position: { x: 0, y: 0 },
        data: { specificType, formData, desc: '' },
      }
      node.data.desc = getNodeInfo(node)
      arr.push(node)
      return arr
    }, [])
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

  const detectWhereDataEditedWay = (filterForm: FilterFormData) =>
    detectFilterFormLevel(filterForm) > 2 ? EditedWay.SQL : EditedWay.Form

  /**
   * generate filter node
   */
  const generateNodeBaseWhereData = (whereStr: string, ruleId: string): Node => {
    const filterForm = generateFilterForm(whereStr)
    const editedWay = detectWhereDataEditedWay(filterForm)
    const node = {
      id: `${ProcessingType.Filter}-${ruleId}`,
      ...getTypeCommonData(NodeType.Processing),
      label: getTypeLabel(ProcessingType.Filter),
      position: { x: 0, y: 0 },
      data: {
        specificType: ProcessingType.Filter,
        formData: {
          editedWay,
          sql: whereStr,
          form: filterForm,
        },
        desc: '',
      },
    }
    node.data.desc = getNodeInfo(node)
    return node
  }

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
      formData = createConsoleForm()
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
  const createInitNodes = (): GroupedNode => ({
    [NodeType.Source]: [],
    [ProcessingType.Function]: [],
    [ProcessingType.Filter]: [],
    [NodeType.Sink]: [],
    [NodeType.Fallback]: [],
  })
  const { judgeIsWebhookRule } = useWebhookUtils()
  const { allMsgsAndEvents } = useRuleUtils()
  /**
   * Generate message, event, filter, and function nodes based on the SQL of the rule.
   * Generate bridge, console, and republish nodes based on the actions.
   * And the corresponding edges.
   */
  const generateFlowDataFromRuleItem = (rule: RuleItem): { nodes: GroupedNode; edges: Edge[] } => {
    const { sql, actions, id, from } = rule
    const nodes: GroupedNode = createInitNodes()
    // If the rule is a webhook and the input is "all messages and events",
    // create an "all messages and events node".
    const { fieldStr, whereStr } = getKeyPartsFromSQL(sql)

    if (from && from.length > 0) {
      if (judgeIsWebhookRule(rule) && arraysAreEqual(from, allMsgsAndEvents.value)) {
        // TODO:
        nodes[NodeType.Source] = [generateAllMsgsAndEventsNode()]
      } else {
        nodes[NodeType.Source] = generateNodesBaseFromData(from)
      }
    }
    if (fieldStr !== undefined) {
      const processingNodes = generateNodesBaseFieldsExpressions(fieldStr, id)
      if (processingNodes) {
        // TODO:TODO:TODO:TODO:TODO: new grouped node logic
        nodes[ProcessingType.Function].push(...processingNodes)
      }
    }
    if (whereStr !== undefined) {
      nodes[ProcessingType.Filter].push(generateNodeBaseWhereData(whereStr, id))
    }
    if (actions.length > 0) {
      nodes[NodeType.Sink] = generateNodesBaseRuleOutputs(actions)
    }
    const edges: Array<Edge> = generateEdgesFromNodes(nodes)
    return { nodes, edges }
  }

  const generateEdgeId = (source: Node, target: Node) => `${source.id}-${target.id}`
  const generateEdgeFromTwoNodes = (source: Node, target: Node, style = {}): Edge => ({
    id: generateEdgeId(source, target),
    source: source.id,
    target: target.id,
    style,
  })

  /* ACTIONS */
  const { convertFallbackActionToRuleOutput } = useRuleFallbackActions()
  const fallbackEdgeStyle = { stroke: '#bbb', strokeDasharray: '5 5' }
  const generateFallbackEdge = (source: Node, target: Node) =>
    generateEdgeFromTwoNodes(source, target, fallbackEdgeStyle)
  const addFallbackFlagToNodes = (nodes: Array<Node>) => {
    nodes.forEach((node) => {
      node.data.isFallback = true
    })
    return nodes
  }
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
  /* EDGES */
  const generateEdgesFromNodes = (nodes: GroupedNode): Array<Edge> => {
    const keys: Array<keyof GroupedNode> = [
      NodeType.Source,
      ProcessingType.Function,
      ProcessingType.Filter,
      NodeType.Sink,
    ]
    const result: Edge[] = []
    const withMultipleFunctionNodes = nodes[ProcessingType.Function].length > 1

    for (let i = 0; i < keys.length - 1; i++) {
      const currentKey: keyof GroupedNode = keys[i]

      let nextKeyIndex = i + 1
      let nextKey: keyof GroupedNode = keys[nextKeyIndex]

      if (nodes[currentKey]?.length === 0) continue

      while (nodes[nextKey]?.length === 0 && i < keys.length - 2) {
        nextKeyIndex += 1
        nextKey = keys[nextKeyIndex]
      }
      const notNeedToConnectEachPrevAndNext =
        withMultipleFunctionNodes && [currentKey, nextKey].includes(ProcessingType.Function)
      if (nodes[currentKey] && nodes[nextKey]) {
        const nextNodes = nodes[nextKey] ?? []
        for (let i = 0; i < nodes[currentKey].length; i++) {
          const cur = nodes[currentKey][i]
          if (
            notNeedToConnectEachPrevAndNext &&
            currentKey === ProcessingType.Function &&
            i !== nodes[currentKey].length - 1
          ) {
            continue
          }
          for (let j = 0; j < nextNodes.length; j++) {
            const nex = nextNodes[j]
            result.push(generateEdgeFromTwoNodes(cur, nex))
            if (notNeedToConnectEachPrevAndNext && currentKey === NodeType.Source) {
              break
            }
          }
        }
      }
      if (withMultipleFunctionNodes && currentKey === ProcessingType.Function) {
        for (let i = 0; i < nodes[currentKey].length - 1; i++) {
          const cur = nodes[currentKey][i]
          const nex = nodes[currentKey][i + 1]
          result.push(generateEdgeFromTwoNodes(cur, nex))
        }
      }
    }
    return result
  }

  /* NODE POSITION */
  const convertEdgeToElkEdge = (edge: Edge) => ({
    ...edge,
    sources: [edge.source],
    targets: [edge.target],
  })

  const convertNodeToElkNode = (node: Node) => {
    let layoutOptions = {}
    if (node.type === FlowNodeType.Input) {
      layoutOptions = {
        'elk.layered.layering.layerConstraint': 'FIRST',
      }
    }
    const nodeHeight = [ProcessingType.Function, SinkType.Console].includes(node.data?.specificType)
      ? 42
      : 66
    return {
      ...node,
      layoutOptions,
      width: nodeWidth,
      height: nodeHeight,
    }
  }
  const elk = new ELK()
  /**
   * count nodes position view all flows
   */
  const countNodesPosition = async (nodes: GroupedNode, edgeArr: Array<Edge>) => {
    try {
      const allNodes = Object.values(nodes).flat()
      const { children } = await elk.layout({
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.layered.spacing.nodeNodeBetweenLayers': '60',
          'elk.spacing.edgeNode': '50',
          'elk.edgeRouting': 'POLYLINE',
        },
        children: allNodes.map(convertNodeToElkNode),
        edges: edgeArr.map(convertEdgeToElkEdge),
      })
      allNodes.forEach((node) => {
        const resultNode = children?.find((item) => item.id === node.id)
        if (resultNode) {
          const { x, y } = resultNode
          node.position = { x: x ?? 0, y: y ?? 0 }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const isRemovedBridge = (node: Node) =>
    isBridgerNode(node) && Object.keys(node.data?.formData || {}).length < 3

  /* BRIDGE */
  /**
   * if is remove bridge, add flag and class
   */
  const addFlagToRemovedBridgeNode = (node: Node) => {
    if (isRemovedBridge(node)) {
      node.class = (node.class || '') + ' is-disabled'
      node.data.isRemoved = true
    }
    return node
  }

  const isRemovedAINode = (node: Node) => {
    if (isAIType(node.data.specificType)) {
      return !node.data.formData.system_prompt
    }
    return false
  }
  const addFlagToRemovedAINode = (node: Node) => {
    if (isRemovedAINode(node)) {
      node.class = (node.class || '') + ' is-disabled'
      node.data.isRemoved = true
    }
    return node
  }

  return {
    getBridgeIdFromInput,
    detectInputType,
    detectOutputType,
    detectFieldsExpressionsEditedWay,
    detectWhereDataEditedWay,
    generateFunctionFormFromExpression,
    addAIRecordToAINode,
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
