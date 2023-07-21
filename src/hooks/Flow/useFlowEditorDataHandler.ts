/**
 * Process the flow data from the flow editor and convert it into data that can be submitted.
 */
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { getBridgeKey } from '@/common/tools'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { BridgeType } from '@/types/enum'
import { BasicRule, BridgeItem } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { groupBy } from 'lodash'
import useI18nTl from '../useI18nTl'
import {
  FilterForm,
  FilterItem,
  FlowNodeType,
  ProcessingType,
  SinkType,
  SourceType,
} from './useFlowNode'

interface NodeData {
  id: string
  type: FlowNodeType
  data: {
    specificType: string
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

export default (): {
  getRuleNBridgesFromFlowData: (
    flowBasicInfo: { name: string; desc: string },
    flowData: FlowData,
  ) => Promise<{
    rule: BasicRule
    bridges: Array<BridgeItem>
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

  const verifyMultipleFlow = async ({ nodes, edges }: FlowData) => {
    const graph: Map<string, Array<string>> = new Map()
    for (const edge of edges) {
      if (!graph.has(edge.source)) {
        graph.set(edge.source, [])
      }
      ;(graph.get(edge.source) as Array<string>).push(edge.target)
    }

    const visited: Set<string> = new Set()
    const dfs = (nodeId: string) => {
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

    dfs(nodes[0].id)

    const allNodesVisited = nodes.every((node) => visited.has(node.id))
    return !allNodesVisited ? Promise.reject(tl('multipleFlowError')) : Promise.resolve()
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

  const getBridgesFromNodes = (flowName: string, nodes: Array<NodeData>): Array<BridgeItem> => {
    const bridgeDataArr = nodes.reduce((arr: Array<BridgeItem>, { type, data }) => {
      const isInputAndNotMessageOrEvent =
        type === FlowNodeType.Input &&
        data.specificType !== SourceType.Message &&
        data.specificType !== SourceType.Event

      const isOutputAndNotConsoleOrRePub =
        type === FlowNodeType.Output &&
        data.specificType !== SinkType.Console &&
        data.specificType !== SinkType.RePub

      if (isInputAndNotMessageOrEvent || isOutputAndNotConsoleOrRePub) {
        arr.push(data.formData)
      }
      return arr
    }, [])
    return bridgeDataArr
  }

  const { transSQLFormDataToSQL } = useRuleUtils()
  const getRuleNBridgesFromFlowData = async (
    flowBasicInfo: { name: string; desc: string },
    flowData: FlowData,
  ): Promise<{ rule: BasicRule; bridges: Array<BridgeItem> }> => {
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
    // TODO:replace *
    rule.sql = transSQLFormDataToSQL('*', fromArr, filterStr)
    rule.actions = getActionDataFromNodes(flowName, outputNodes)
    const bridges = getBridgesFromNodes(flowName, [...inputNodes, ...outputNodes])
    return { rule, bridges }
  }

  return {
    getRuleNBridgesFromFlowData,
  }
}
