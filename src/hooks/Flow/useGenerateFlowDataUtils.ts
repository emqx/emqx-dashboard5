import { DEFAULT_SELECT } from '@/common/constants'
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
import { useBridgeTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { OutputItem, OutputItemObj, RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import { isString, isUndefined } from 'lodash'
import { useRuleInputs, useRuleUtils } from '../Rule/rule/useRule'
import useWebhookUtils from '../Webhook/useWebhookUtils'
import useI18nTl from '../useI18nTl'
import useRuleFunc, { ArgItem } from '../useRuleFunc'
import useFlowNode, {
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
 * - repub - `republish-{topic}`
 * - filter - `filter-{ruleID}`
 * - function - `function-{ruleID}`
 */

/**
 * Sort by column
 */
export type GroupedNode = {
  [NodeType.Source]: Array<Node>
  [ProcessingType.Filter]: Array<Node>
  [ProcessingType.Function]: Array<Node>
  [NodeType.Sink]: Array<Node>
}

export default (): {
  getBridgeIdFromInput: (input: string) => string
  detectInputType: (from: string) => string
  detectFieldsExpressionsEditedWay: (functionForm: Array<FunctionItem>) => EditedWay
  detectWhereDataEditedWay: (filterForm: FilterFormData) => EditedWay
  generateFunctionFormFromExpression: (expression: string) => Array<FunctionItem> | undefined
  generateFlowDataFromRuleItem: (ruleData: RuleItem) => {
    nodes: GroupedNode
    edges: Array<Edge>
  }
  countNodesPosition: (nodes: GroupedNode) => void
  countNodePositionWhileEditing: (nodes: GroupedNode) => void
  isRemovedBridge: (node: Node) => boolean
  addFlagToRemovedBridgeNode: (node: Node) => Node
} => {
  const { nodeWidth, nodeHeight, getTypeCommonData, getTypeLabel, getNodeInfo, isBridgerNode } =
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
    actualParams: Array<string | number>,
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
    let args: Array<string | number> = []
    if (funcArgs.length !== funcItem.args.length) {
      args = countArgsWhenLengthNotMatch(funcItem.args, funcArgs)
    } else {
      args = funcArgs
    }
    return { func: { name: funcName, args }, field: args[argIndex].toString() }
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

  const generateNodeBaseFieldsExpressions = (fieldsExpressions: string, ruleId: string) => {
    const formData = generateFunctionFormFromExpression(fieldsExpressions)
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
          sql: fieldsExpressions,
          form: formData,
        },
        desc: '',
      },
    }
    node.data.desc = getNodeInfo(node)
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
      const id =
        type === SourceType.Event || type === SourceType.Message
          ? `${type}-${fromItem}`
          : `${type}-${getBridgeIdFromInput(fromItem)}`

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

  /* ACTIONS */
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
  const generateNodesBaseActions = (actions: Array<OutputItem>): Array<Node> => {
    return actions.reduce((arr: Array<Node>, item): Array<Node> => {
      const type = detectOutputType(item)
      if (!type) {
        return arr
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
        id = `${SinkType.RePub}-${(item as OutputItemObj).args?.topic}`
        formData = item
      } else {
        id = `${type}-${item}`
        formData = { name: getBridgeNameFromId(item as string), id: item }
      }

      const node: Node = {
        id,
        ...getTypeCommonData(NodeType.Sink),
        label: getTypeLabel(specificType),
        position: { x: 0, y: 0 },
        data: { specificType, formData, desc: '' },
      }
      node.data.desc = getNodeInfo(node)

      arr.push(node)
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
    const { sql, actions, id, from } = rule
    const nodes: GroupedNode = {
      [NodeType.Source]: [],
      [ProcessingType.Function]: [],
      [ProcessingType.Filter]: [],
      [NodeType.Sink]: [],
    }
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
    if (whereStr !== undefined) {
      nodes[ProcessingType.Filter].push(generateNodeBaseWhereData(whereStr, id))
    }
    if (fieldStr !== undefined) {
      const node = generateNodeBaseFieldsExpressions(fieldStr, id)
      if (node) {
        nodes[ProcessingType.Function].push(node)
      }
    }
    if (actions.length > 0) {
      nodes[NodeType.Sink] = generateNodesBaseActions(actions)
    }
    const edges: Array<Edge> = generateEdgesFromNodes(nodes)
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

    for (let i = 0; i < keys.length - 1; i++) {
      const currentKey: keyof GroupedNode = keys[i]

      let nextKeyIndex = i + 1
      let nextKey: keyof GroupedNode = keys[nextKeyIndex]

      if (nodes[currentKey]?.length === 0) continue

      while (nodes[nextKey]?.length === 0 && i < keys.length - 2) {
        nextKeyIndex += 1
        nextKey = keys[nextKeyIndex]
      }
      if (nodes[currentKey] && nodes[nextKey]) {
        nodes[currentKey].forEach((cur) => {
          nodes[nextKey].forEach((nex) => {
            result.push({
              id: `${cur.id}-${nex.id}`,
              source: cur.id,
              target: nex.id,
              style: {},
            })
          })
        })
      }
    }
    return result
  }

  /* NODE POSITION */
  const nodeColumnSpacing = 100
  const nodeRowSpacing = 30
  const getXPosition = (columnIndex: number) => (nodeWidth + nodeColumnSpacing) * columnIndex
  const getYPosition = (index: number, start = 0) => start + index * (nodeRowSpacing + nodeHeight)
  const setPositionToColumnNodes = (
    columnNodes: Array<Node>,
    columnIndex: number,
    totalHeight: number,
  ) => {
    const columnTotalHeight = columnNodes.length * (nodeHeight + nodeRowSpacing) - nodeRowSpacing
    const x = getXPosition(columnIndex)
    const startY = (totalHeight - columnTotalHeight) / 2
    columnNodes.forEach((node, index) => {
      node.position = { x, y: getYPosition(index, startY) }
    })
  }

  const setNodesPositionBySourceType = (
    nodeArr: Array<Node>,
    sourceNodes: Array<Node>,
    columnIndex: number,
    totalHeight: number,
  ) => {
    const sourceIndexUsed: Set<number> = new Set()
    nodeArr.forEach((node) => {
      const ruleId = node.data.rulesUsed[0]
      let firstSourceNodeIndexConnected = sourceNodes.findIndex((item) => {
        const arr = item?.data?.rulesUsed || []
        return arr.includes(ruleId)
      })
      while (sourceIndexUsed.has(firstSourceNodeIndexConnected)) {
        firstSourceNodeIndexConnected += 1
      }
      sourceIndexUsed.add(firstSourceNodeIndexConnected)
      const connectedSourceNode = sourceNodes[firstSourceNodeIndexConnected]
      if (connectedSourceNode) {
        node.position = { y: connectedSourceNode.position.y, x: getXPosition(columnIndex) }
      } else {
        const startIndex = [...sourceIndexUsed][0]
        const startY = sourceNodes[startIndex]?.position.y
        if (startIndex !== undefined && startY !== undefined) {
          node.position = {
            y: getYPosition(firstSourceNodeIndexConnected - startIndex, startY),
            x: getXPosition(columnIndex),
          }
        } else {
          node.position = {
            y: totalHeight / 2,
            x: getXPosition(columnIndex),
          }
        }
      }
    })
  }
  /**
   * count nodes position view all flows
   */
  const countNodesPosition = (nodes: GroupedNode) => {
    // count source & sink nodes position first
    const keys: Array<keyof GroupedNode> = [NodeType.Source, NodeType.Sink]

    const totalHeight =
      Math.max(...keys.map((key) => nodes[key].length)) * (nodeHeight + nodeRowSpacing) -
      nodeRowSpacing
    setPositionToColumnNodes(nodes[NodeType.Source], 0, totalHeight)
    setPositionToColumnNodes(nodes[NodeType.Sink], 3, totalHeight)
    // Set filter & function nodes position based on source nodes to avoid overlap
    const processingTypes: Array<ProcessingType> = [ProcessingType.Function, ProcessingType.Filter]
    processingTypes.forEach((type, columnIndex) =>
      setNodesPositionBySourceType(
        nodes[type],
        nodes[NodeType.Source],
        columnIndex + 1,
        totalHeight,
      ),
    )
  }

  /**
   * Compared to the one above, there's no need to think about node coverage
   */
  const countNodePositionWhileEditing = (nodes: GroupedNode) => {
    const keys: Array<keyof GroupedNode> = [
      NodeType.Source,
      ProcessingType.Function,
      ProcessingType.Filter,
      NodeType.Sink,
    ]
    const nodesArr = keys.map((key) => nodes[key])
    const totalHeight =
      Math.max(...keys.map((key) => nodes[key].length)) * (nodeHeight + nodeRowSpacing) -
      nodeRowSpacing
    nodesArr.forEach((arr, index) => setPositionToColumnNodes(arr, index, totalHeight))
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

  return {
    getBridgeIdFromInput,
    detectInputType,
    detectFieldsExpressionsEditedWay,
    detectWhereDataEditedWay,
    generateFunctionFormFromExpression,
    generateFlowDataFromRuleItem,
    countNodesPosition,
    countNodePositionWhileEditing,
    isRemovedBridge,
    addFlagToRemovedBridgeNode,
  }
}
