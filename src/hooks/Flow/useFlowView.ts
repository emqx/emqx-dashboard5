import { getBridgeList, getRules } from '@/api/ruleengine'
import {
  BRIDGE_TYPES_WITH_TWO_DIRECTIONS,
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  RULE_INPUT_EVENT_PREFIX,
  RULE_MAX_NUM_PER_PAGE,
} from '@/common/constants'
import { getKeyPartsFromSQL } from '@/common/tools'
import { useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem, OutputItem, OutputItemObj, RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import { escapeRegExp, isString, unionBy } from 'lodash'
import { Ref, ref } from 'vue'
import useFlowNode, {
  FlowData,
  NodeType,
  ProcessingType,
  SinkType,
  SourceType,
  getSpecificTypeWithDirection,
} from './useFlowNode'

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
type GroupedNode = {
  [NodeType.Source]: Array<Node>
  [ProcessingType.Filter]: Array<Node>
  [ProcessingType.Function]: Array<Node>
  [NodeType.Sink]: Array<Node>
}

export default () => {
  let ruleList: Array<RuleItem> = []
  let bridgeList: Array<BridgeItem> = []

  // column 1
  let sourceNodes: Array<Node> = []
  // column 2
  let filterNodes: Array<Node> = []
  // column 3
  let functionNodes: Array<Node> = []
  // column 4
  let sinkNodes: Array<Node> = []

  let edgeArr: Array<Edge> = []

  const flowData: Ref<FlowData> = ref([])

  const pageData = ref({ count: 0, page: 1 })

  const { transFromStrToFromArr } = useRuleUtils()
  const { getTypeCommonData, getTypeLabel } = useFlowNode()

  const getOtherPageData = async (page: number) => {
    pageData.value.page = page
    return getRuleData()
  }

  const getRuleData = async () => {
    try {
      const { meta, data } = await getRules({
        page: pageData.value.page,
        limit: RULE_MAX_NUM_PER_PAGE,
      })
      pageData.value.count = meta.count as number
      ruleList = data
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const getBridgeData = async () => {
    try {
      bridgeList = await getBridgeList()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const { getBridgeType } = useBridgeTypeOptions()
  const getBridgeTypeFromId = (id: string): BridgeType => {
    const type = id.slice(0, id.indexOf(':'))
    return getBridgeType(type)
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

  const isTwoDirectionBridge = (bridgeType: string): boolean =>
    BRIDGE_TYPES_WITH_TWO_DIRECTIONS.includes(bridgeType as BridgeType)

  /**
   * generate input node
   * - Message
   * - Event
   * - Bridge
   */
  const generateNodesBaseFromData = (fromArr: Array<string>) => {
    return fromArr.reduce((arr: Array<Node>, fromItem): Array<Node> => {
      let id = ''
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
      if (type === SourceType.Event || type === SourceType.Message) {
        id = `${type}-${fromItem}`
      } else {
        id = `${specificType}-${fromItem.replace(RULE_INPUT_BRIDGE_TYPE_PREFIX, '')}`
      }
      arr.push({
        id,
        ...getTypeCommonData(NodeType.Source),
        label: getTypeLabel(specificType),
        position: { x: 0, y: 0 },
      })
      return arr
    }, [])
  }

  /**
   * generate filter node
   */
  const generateNodeBaseWhereData = (whereStr: string, ruleId: string): Node => {
    return {
      id: `${ProcessingType.Filter}-${ruleId}`,
      ...getTypeCommonData(NodeType.Processing),
      label: getTypeLabel(ProcessingType.Filter),
      position: { x: 0, y: 0 },
    }
  }

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

      const node: Node = {
        id: '',
        ...getTypeCommonData(NodeType.Sink),
        label: getTypeLabel(specificType),
        position: { x: 0, y: 0 },
      }

      if (type === SinkType.Console) {
        node.id = SinkType.Console
      } else if (type === SinkType.RePub) {
        node.id = `${SinkType.RePub}-${(item as OutputItemObj).args?.topic}`
      } else {
        node.id = `${specificType}-${item}`
      }

      arr.push(node)
      return arr
    }, [])
  }

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

      if (nodes[currentKey].length === 0) continue

      while (nodes[nextKey].length === 0 && i < keys.length - 2) {
        nextKeyIndex += 1
        nextKey = keys[nextKeyIndex]
      }
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
    return result
  }

  /**
   * Generate message, event, filter, and function nodes based on the SQL of the rule.
   * Generate bridge, console, and republish nodes based on the actions.
   * And the corresponding edges.
   */
  const generateFlowDataFromRuleItem = ({
    sql,
    actions,
    id,
  }: RuleItem): { nodes: GroupedNode; edges: Edge[] } => {
    const nodes: GroupedNode = {
      [NodeType.Source]: [],
      [ProcessingType.Filter]: [],
      [ProcessingType.Function]: [],
      [NodeType.Sink]: [],
    }

    const { fieldStr, fromStr, whereStr } = getKeyPartsFromSQL(sql)
    if (fromStr !== undefined) {
      nodes[NodeType.Source] = generateNodesBaseFromData(transFromStrToFromArr(fromStr))
    }
    if (whereStr !== undefined) {
      nodes[ProcessingType.Filter].push(generateNodeBaseWhereData(whereStr, id))
    }
    if (fieldStr !== undefined) {
      // TODO:TODO:TODO:
      nodes[ProcessingType.Function] = []
    }
    if (actions.length > 0) {
      nodes[NodeType.Sink] = generateNodesBaseActions(actions)
    }
    const edges: Array<Edge> = generateEdgesFromNodes(nodes)
    return { nodes, edges }
  }

  const generateFlowDataFromRuleData = (ruleArr: Array<RuleItem>) => {
    ruleArr.forEach((rule) => {
      const { nodes, edges } = generateFlowDataFromRuleItem(rule)
      sourceNodes.push(...nodes[NodeType.Source])
      filterNodes.push(...nodes[ProcessingType.Filter])
      functionNodes.push(...nodes[ProcessingType.Function])
      sinkNodes.push(...nodes[NodeType.Sink])
      edgeArr.push(...edges)
    })
  }

  const generateNodesFromBridgeData = (bridgeArr: Array<BridgeItem>) => {
    bridgeArr.forEach((bridge) => {
      const { type } = bridge
      const node: Node = {
        id: `${type}-${bridge.id}`,
        position: { x: 0, y: 0 },
        label: getTypeLabel(type),
      }
      let direction = BridgeDirection.Egress
      if (isTwoDirectionBridge(type)) {
        if (type === BridgeType.MQTT && 'ingress' in bridge) {
          direction = BridgeDirection.Ingress
        }
        const specificType = getSpecificTypeWithDirection(type, direction)
        node.label = getTypeLabel(specificType)
      }

      // TODO: for kafka,gcp...detect direction
      const targetNodes = direction === BridgeDirection.Ingress ? sourceNodes : sinkNodes
      Object.assign(
        node,
        getTypeCommonData(direction === BridgeDirection.Ingress ? NodeType.Source : NodeType.Sink),
      )
      targetNodes.push(node)
    })
  }

  const nodeWidth = 150
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

  const removeDuplicatedNodes = () => {
    const nodeArrays = [sourceNodes, filterNodes, functionNodes, sinkNodes]
    nodeArrays.forEach((nodeArray, i) => (nodeArrays[i] = unionBy(nodeArray, 'id')))
    ;[sourceNodes, filterNodes, functionNodes, sinkNodes] = nodeArrays
  }

  const removeIsolatedBridge = () => {
    const nodeArrays = [sourceNodes, sinkNodes]
    const connectedIds = edgeArr.reduce(
      (arr, { source, target }) => arr.add(source).add(target),
      new Set(),
    )
    nodeArrays.forEach((nodeArray, i) => {
      nodeArrays[i] = nodeArray.filter(({ id }) => connectedIds.has(id))
    })
    ;[sourceNodes, sinkNodes] = nodeArrays
  }

  const countNodesPosition = () => {
    const totalHeight =
      Math.max(sourceNodes.length, filterNodes.length, functionNodes.length, sinkNodes.length) *
        (nodeHeight + nodeRowSpacing) -
      nodeRowSpacing
    ;[sourceNodes, filterNodes, functionNodes, sinkNodes].forEach((arr, index) => {
      setPositionToColumnNodes(arr, index, totalHeight)
    })
  }

  const joinToFlowData = () => {
    flowData.value = [...sourceNodes, ...filterNodes, ...functionNodes, ...sinkNodes, ...edgeArr]
  }

  const initNodeAndEdge = () => {
    sourceNodes = []
    filterNodes = []
    functionNodes = []
    sinkNodes = []
    edgeArr = []
  }

  const generateFlowData = () => {
    initNodeAndEdge()
    generateFlowDataFromRuleData(ruleList)
    generateNodesFromBridgeData(bridgeList)
    removeDuplicatedNodes()
    removeIsolatedBridge()
    countNodesPosition()
    joinToFlowData()
  }

  const getData = async () => {
    return await Promise.all([getRuleData(), getBridgeData()])
  }

  const getFlowData = async () => {
    try {
      await getData()
      generateFlowData()
    } catch (error) {
      //
    }
  }

  return {
    flowData,
    getFlowData,
  }
}
