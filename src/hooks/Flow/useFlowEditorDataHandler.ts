/**
 * Process the flow data from the flow editor and convert it into data that can be submitted.
 */
import { DEFAULT_SELECT, RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { getBridgeKey } from '@/common/tools'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { BridgeType } from '@/types/enum'
import { BasicRule, BridgeItem } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { groupBy } from 'lodash'
import useI18nTl from '../useI18nTl'
import useFlowNode, {
  FilterForm,
  FilterItem,
  FlowNodeType,
  FunctionItem,
  ProcessingType,
  SinkType,
  SourceType,
} from './useFlowNode'

interface NodeData {
  id: string
  type: FlowNodeType
  data: {
    specificType: string
    isCreated?: boolean
    formData: any
  }
}

interface EdgeData {
  source: string
  target: string
}

type NodesAfterGroup = Record<FlowNodeType, Array<NodeData>>

interface FlowData {
  nodes: Array<NodeData>
  edges: Array<EdgeData>
}

interface BridgeData {
  isCreated: boolean
  data: BridgeItem
}

export default (): {
  getRuleNBridgesFromFlowData: (
    flowBasicInfo: { name: string; desc: string },
    flowData: FlowData,
  ) => Promise<{
    rule: BasicRule
    bridges: Array<BridgeData>
  }>
} => {
  const { t, tl } = useI18nTl('Flow')

  const { createRawRuleForm } = useRuleForm()

  /**
   * At least one input node and one output node are required
   */
  const verifyIntegrityOfFlow = async (flowData: FlowData) => {
    const { nodes } = flowData
    const inputNode = nodes.find(({ type }) => type === FlowNodeType.Input)
    const outputNode = nodes.find(({ type }) => type === FlowNodeType.Output)
    if (!inputNode && !outputNode) {
      return Promise.reject(tl('flowEmptyError'))
    }
    if (!inputNode || !outputNode) {
      return Promise.reject(tl('flowIntegrityError', { missing: !inputNode ? 'Source' : 'Sink' }))
    }
    return Promise.resolve()
  }

  const verifyIsolatedNode = async ({ nodes, edges }: FlowData) => {
    const nodesWithEdge = edges.reduce(
      (arr, { source, target }) => arr.add(source).add(target),
      new Set(),
    )
    const isolatedNodes = nodes.filter(({ id }) => !nodesWithEdge.has(id))
    return isolatedNodes.length > 0
      ? Promise.reject(t('Flow.isolatedNodeError', isolatedNodes.length))
      : Promise.resolve()
  }

  const verifyMultipleFlow = async ({ edges }: FlowData) => {
    const graph: Map<string, Array<string>> = new Map()

    for (const edge of edges) {
      if (!graph.get(edge.source)) {
        graph.set(edge.source, [])
      }
      if (!graph.has(edge.target)) {
        graph.set(edge.target, [])
      }
      ;(graph.get(edge.source) as Array<string>).push(edge.target)
      ;(graph.get(edge.target) as Array<string>).push(edge.source)
    }

    const visited: Set<string> = new Set()
    function dfs(nodeId: string) {
      visited.add(nodeId)
      const neighbors = graph.get(nodeId)
      if (neighbors) {
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            dfs(neighbor)
          }
        }
      }
    }

    let numberOfConnectedComponents = 0

    for (const nodeId of graph.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId)
        numberOfConnectedComponents++
      }
    }
    return numberOfConnectedComponents > 1
      ? Promise.reject(tl('multipleFlowError'))
      : Promise.resolve()
  }

  const validateFlow = async (flowData: FlowData) => {
    try {
      await verifyIntegrityOfFlow(flowData)
      await verifyIsolatedNode(flowData)
      await verifyMultipleFlow(flowData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const groupNodes = (nodes: Array<NodeData>): NodesAfterGroup =>
    groupBy(nodes, 'type') as NodesAfterGroup

  const getFromDataFromNodes = (flowName: string, nodes: Array<NodeData>): Array<string> => {
    return nodes.reduce((ret: Array<string>, node) => {
      if (node.type !== FlowNodeType.Input) {
        return ret
      }
      const { specificType, formData } = node.data
      let data = ''
      switch (specificType) {
        case SourceType.Message:
          data = formData.topic
          break
        case SourceType.Event:
          data = formData.event
          break
        case SourceType.MQTTBroker:
          data = `${RULE_INPUT_BRIDGE_TYPE_PREFIX}${getBridgeKey({
            type: BridgeType.MQTT,
            name: node.data.formData.name,
          })}`
          break
        default:
          return ret
      }
      ret.push(data)
      return ret
    }, [])
  }

  const getActionDataFromNodes = (flowName: string, nodes: Array<NodeData>): Array<any> => {
    return nodes.reduce((ret: Array<string>, node) => {
      if (node.type !== FlowNodeType.Output) {
        return ret
      }
      const { specificType, formData } = node.data
      let data = ''
      if (specificType === SinkType.Console || specificType === SinkType.RePub) {
        data = formData
        ret.push(data)
      } else {
        ret.push(getBridgeKey(formData))
      }
      // TODO:TODO:TODO:Various types of bridges.
      // TODO:TODO:TODO:Various types of bridges.
      // TODO:TODO:TODO:Various types of bridges.
      return ret
    }, [])
  }

  const processFilterDataToSql = (filterData: FilterForm, level = 0): string => {
    if (Array.isArray(filterData.items)) {
      const clauses: Array<string> = filterData.items.map((item) =>
        processFilterDataToSql(item as FilterForm, level + 1),
      )
      return `${level > 0 ? '(' : ''}${clauses.join(` ${filterData.groupOperator} `)}${
        level > 0 ? ')' : ''
      }`
    }
    const { field, operator, valueForComparison } = filterData as unknown as FilterItem
    // TODO:Confirm how to determine the type of input data.
    const strForComparison =
      typeof valueForComparison === 'string' ? `'${valueForComparison}'` : valueForComparison
    return `${field} ${operator} ${strForComparison}`
  }

  const getFilterStrFromNodes = (nodes: Array<NodeData>): string => {
    const filterNode = nodes.find(({ data }) => data.specificType === ProcessingType.Filter)
    const filterData = filterNode?.data.formData
    if (!filterData) {
      return ''
    }
    return processFilterDataToSql(filterData)
  }

  const getExpressionFromFunctionItem = ({
    name,
    args,
  }: {
    name: string
    args: Array<string | number>
  }): string => {
    const argsStr = args.filter((item) => item !== '' && item !== undefined).join(', ')
    return `${name}(${argsStr})`
  }

  const getFieldsExpressionsFromNode = (nodes: Array<NodeData>): string => {
    const functionNode = nodes.find(({ data }) => data.specificType === ProcessingType.Function)
    const functionData = functionNode?.data.formData
    if (!functionData) {
      return DEFAULT_SELECT
    }
    return functionData.reduce((str: string, item: FunctionItem) => {
      const { field, func, alias } = item
      const selection = func.name ? getExpressionFromFunctionItem(func) : field
      const aliasStr = alias ? ` as ${alias}` : ''
      const currentExpression = selection + aliasStr
      return str ? `${str}, ${currentExpression}` : currentExpression
    }, '')
  }

  const { isBridgerNode } = useFlowNode()
  const getBridgesFromNodes = (nodes: Array<NodeData>): Array<BridgeData> => {
    const bridgeDataArr = nodes.reduce((arr: Array<BridgeData>, node) => {
      const isBridge = isBridgerNode(node)
      if (isBridge) {
        arr.push({ isCreated: !!node.data.isCreated, data: node.data.formData })
      }
      return arr
    }, [])
    return bridgeDataArr
  }

  const { transSQLFormDataToSQL } = useRuleUtils()
  const getRuleNBridgesFromFlowData = async (
    flowBasicInfo: { name: string; desc: string },
    flowData: FlowData,
  ): Promise<{ rule: BasicRule; bridges: Array<BridgeData> }> => {
    try {
      await validateFlow(flowData)
    } catch (error) {
      ElMessage.error(error?.toString())
      return Promise.reject(error)
    }
    const { name: flowName, desc } = flowBasicInfo
    const rule: BasicRule = { ...createRawRuleForm(), id: flowName, description: desc }
    const nodes = groupNodes(flowData.nodes)
    const {
      [FlowNodeType.Input]: inputNodes = [],
      [FlowNodeType.Default]: processingNodes = [],
      [FlowNodeType.Output]: outputNodes = [],
    } = nodes
    const fromArr = getFromDataFromNodes(flowName, inputNodes)
    const filterStr = getFilterStrFromNodes(processingNodes)
    const fieldsExpressions = getFieldsExpressionsFromNode(processingNodes)
    rule.sql = transSQLFormDataToSQL(fieldsExpressions, fromArr, filterStr)
    rule.actions = getActionDataFromNodes(flowName, outputNodes)
    const bridges = getBridgesFromNodes([...inputNodes, ...outputNodes])
    return { rule, bridges }
  }

  return {
    getRuleNBridgesFromFlowData,
  }
}
