import {
  BRIDGE_TYPES_WITH_TWO_DIRECTIONS,
  DEFAULT_SELECT,
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  RULE_INPUT_EVENT_PREFIX,
} from '@/common/constants'
import { getKeyPartsFromSQL, splitOnComma, trimSpacesAndLFs } from '@/common/tools'
import { useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem, OutputItem, OutputItemObj, RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import { escapeRegExp, isString } from 'lodash'
import useRuleFunc, { ArgItem } from '../useRuleFunc'
import useFlowNode, {
  NodeType,
  ProcessingType,
  SinkType,
  SourceType,
  getSpecificTypeWithDirection,
} from './useFlowNode'
import { createEventForm, createFunctionItem, createMessageForm } from './useNodeForm'
import useParseWhere from './useParseWhere'

/**
 * Sort by column
 */
type GroupedNode = {
  [NodeType.Source]: Array<Node>
  [ProcessingType.Filter]: Array<Node>
  [ProcessingType.Function]: Array<Node>
  [NodeType.Sink]: Array<Node>
}

export default () => {
  const { getTypeCommonData, getTypeLabel, getNodeInfo } = useFlowNode()
  const { getBridgeType } = useBridgeTypeOptions()
  const { generateFilterForm } = useParseWhere()
  const { getFuncGroupByName, getFuncItemByName, getArgIndex } = useRuleFunc()

  const isTwoDirectionBridge = (bridgeType: string): boolean =>
    BRIDGE_TYPES_WITH_TWO_DIRECTIONS.includes(bridgeType as BridgeType)

  const getBridgeNameFromId = (id: string): string => id.slice(id.indexOf(':'))

  const getBridgeTypeFromId = (id: string): BridgeType => {
    const type = id.slice(0, id.indexOf(':'))
    return getBridgeType(type)
  }

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

  const getFuncDataFromExpression = (
    expression: string,
  ): { field: string | number; func: { name: string; args: Array<string | number> } } => {
    const funcName = expression.slice(0, expression.indexOf('('))
    const funcGroup = getFuncGroupByName(funcName)
    const funcItem = getFuncItemByName(funcName)
    if (!funcGroup || !funcItem) {
      throw new Error(`can not find function ${funcName}`)
    }
    const argIndex = getArgIndex(funcItem, funcGroup)
    const funcArgs = expression
      .slice(expression.indexOf('(') + 1, expression.lastIndexOf(')'))
      .split(',')
      .map((item) => item.trim())
    let args: Array<string | number> = []
    if (funcArgs.length !== funcItem.args.length) {
      args = countArgsWhenLengthNotMatch(funcItem.args, funcArgs)
    } else {
      args = funcArgs
    }
    return { func: { name: funcName, args }, field: args[argIndex] }
  }

  const funcExpressionReg = /^(\w|_)+\(.|\n+\)/
  const aliasPartReg = /\sas\s(\S+)/
  const aliasReg = new RegExp(`.+${aliasPartReg.source}`)
  const generateFunctionFormFromExpression = (expression: string) => {
    const form = createFunctionItem()
    const withAlias = aliasReg.test(expression)
    if (withAlias) {
      const [, alias = ''] = expression.match(aliasReg) || []
      form.alias = alias
    }

    const selection = expression.replace(aliasPartReg, '')

    if (funcExpressionReg.test(selection)) {
      return { ...form, ...getFuncDataFromExpression(selection) }
    }
    return { ...form, field: selection }
  }

  const generateNodeBaseFieldsExpressions = (fieldsExpressions: string, ruleId: string) => {
    if (trimSpacesAndLFs(fieldsExpressions) === DEFAULT_SELECT) {
      return
    }
    const expressionArr = splitOnComma(fieldsExpressions).map((item) => trimSpacesAndLFs(item))
    const formData = expressionArr.map((item) => generateFunctionFormFromExpression(item))
    const node = {
      id: `${ProcessingType.Function}-${ruleId}`,
      ...getTypeCommonData(NodeType.Processing),
      label: getTypeLabel(ProcessingType.Function),
      position: { x: 0, y: 0 },
      data: {
        specificType: ProcessingType.Function,
        formData,
        desc: '',
      },
    }
    node.data.desc = getNodeInfo(node)
    return node
  }

  /* SOURCE */
  const getFormDataByType = (type: string, value: string) => {
    if (type === SourceType.Event) {
      return createEventForm(value)
    } else if (type === SourceType.Message) {
      return createMessageForm(value)
    }
    return { name: getBridgeNameFromId(value) }
  }
  const detectInputType = (from: string): string => {
    if (from.indexOf(RULE_INPUT_EVENT_PREFIX) > -1) {
      return SourceType.Event
    }
    // now has mqtt & http
    const reg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
    if (reg.test(from)) {
      return getBridgeTypeFromId(from.replace(RULE_INPUT_BRIDGE_TYPE_PREFIX, ''))
    }
    return SourceType.Message
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
      if (
        type !== SourceType.Event &&
        type !== SourceType.Message &&
        isTwoDirectionBridge(specificType)
      ) {
        specificType = getSpecificTypeWithDirection(
          specificType as BridgeType,
          BridgeDirection.Ingress,
        )
      }
      const formData = getFormDataByType(type, fromItem)
      const id =
        type === SourceType.Event || type === SourceType.Message
          ? `${type}-${fromItem}`
          : `${specificType}-${fromItem.replace(RULE_INPUT_BRIDGE_TYPE_PREFIX, '')}`

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

  /* WHERE */
  /**
   * generate filter node
   */
  const generateNodeBaseWhereData = (whereStr: string, ruleId: string): Node => {
    const node = {
      id: `${ProcessingType.Filter}-${ruleId}`,
      ...getTypeCommonData(NodeType.Processing),
      label: getTypeLabel(ProcessingType.Filter),
      position: { x: 0, y: 0 },
      data: {
        specificType: ProcessingType.Filter,
        formData: generateFilterForm(whereStr),
        desc: '',
      },
    }
    node.data.desc = getNodeInfo(node)
    return node
  }

  /* ACTIONS */
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
      if (
        type !== SinkType.Console &&
        type !== SinkType.RePub &&
        isTwoDirectionBridge(specificType)
      ) {
        specificType = getSpecificTypeWithDirection(
          specificType as BridgeType,
          BridgeDirection.Egress,
        )
      }

      let id = ''
      let formData = {}

      if (type === SinkType.Console) {
        id = SinkType.Console
      } else if (type === SinkType.RePub) {
        id = `${SinkType.RePub}-${(item as OutputItemObj).args?.topic}`
        formData = item
      } else {
        id = `${specificType}-${item}`
        formData = { name: getBridgeNameFromId(item as string) }
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

  /* BRIDGES */
  const generateNodeFromBridgeData = (bridge: BridgeItem) => {
    const { type } = bridge
    let specificType = type
    let direction = BridgeDirection.Egress

    if (isTwoDirectionBridge(type)) {
      if (type === BridgeType.MQTT && 'ingress' in bridge) {
        direction = BridgeDirection.Ingress
      }
      specificType = getSpecificTypeWithDirection(type, direction)
    }
    // TODO: for kafka,gcp...detect direction
    const nodeType = direction === BridgeDirection.Ingress ? NodeType.Source : NodeType.Sink
    const node: Node = {
      id: `${specificType}-${bridge.id}`,
      position: { x: 0, y: 0 },
      label: getTypeLabel(specificType),
      ...getTypeCommonData(nodeType),
      data: { specificType, formData: bridge, desc: '' },
    }
    node.data.desc = getNodeInfo(node)
    return node
  }

  /* RULE */
  /**
   * Generate message, event, filter, and function nodes based on the SQL of the rule.
   * Generate bridge, console, and republish nodes based on the actions.
   * And the corresponding edges.
   */
  const generateFlowDataFromRuleItem = ({
    sql,
    actions,
    id,
    from,
  }: RuleItem): { nodes: GroupedNode; edges: Edge[] } => {
    const nodes: GroupedNode = {
      [NodeType.Source]: [],
      [ProcessingType.Filter]: [],
      [ProcessingType.Function]: [],
      [NodeType.Sink]: [],
    }
    const { fieldStr, whereStr } = getKeyPartsFromSQL(sql)
    if (from && from.length > 0) {
      nodes[NodeType.Source] = generateNodesBaseFromData(from)
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
      ProcessingType.Filter,
      ProcessingType.Function,
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
            })
          })
        })
      }
    }
    return result
  }

  /* NODE POSITION */
  const nodeWidth = 200
  const nodeHeight = 60
  const nodeColumnSpacing = 100
  const nodeRowSpacing = 30
  const setPositionToColumnNodes = (
    columnNodes: Array<Node>,
    columnIndex: number,
    totalHeight: number,
  ) => {
    const columnTotalHeight = columnNodes.length * (nodeHeight + nodeRowSpacing) - nodeRowSpacing
    const x = (nodeWidth + nodeColumnSpacing) * columnIndex
    const startY = (totalHeight - columnTotalHeight) / 2
    columnNodes.forEach((node, index) => {
      node.position = { x, y: startY + index * (nodeRowSpacing + nodeHeight) }
    })
  }
  const countNodesPosition = (nodes: GroupedNode) => {
    const keys: Array<keyof GroupedNode> = [
      NodeType.Source,
      ProcessingType.Filter,
      ProcessingType.Function,
      NodeType.Sink,
    ]
    const nodesArr = keys.map((key) => nodes[key])

    const totalHeight =
      Math.max(...keys.map((key) => nodes[key].length)) * (nodeHeight + nodeRowSpacing) -
      nodeRowSpacing
    nodesArr.forEach((arr, index) => setPositionToColumnNodes(arr, index, totalHeight))
  }

  return {
    generateNodeFromBridgeData,
    generateFlowDataFromRuleItem,
    countNodesPosition,
  }
}
