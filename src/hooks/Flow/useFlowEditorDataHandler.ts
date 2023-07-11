/**
 * Process the flow data from the flow editor and convert it into data that can be submitted.
 */
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { getBridgeKey } from '@/common/tools'
import { ProcessingType, SinkType, SourceType } from '@/hooks/Flow/useFlowEditor'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { BridgeType } from '@/types/enum'
import { BasicRule, BridgeItem } from '@/types/rule'
import { groupBy } from 'lodash'
import { FilterForm, FilterItem } from './useNodeForm'

const enum FlowNodeType {
  Input = 'input',
  Output = 'output',
  Default = 'default',
}

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

export default () => {
  const { createRawRuleForm } = useRuleForm()

  const filterUsedNodesInFlowData = ({
    nodes,
    edges,
  }: FlowData): {
    nodes: NodesAfterGroup
    edges: Array<EdgeData>
  } => {
    // TODO:Check for incomplete data flows.
    const nodesWithEdge = edges.reduce(
      (arr, { source, target }) => arr.add(source).add(target),
      new Set(),
    )
    const nodeRet = groupBy(
      nodes.filter(({ id }) => nodesWithEdge.has(id)),
      'type',
    ) as NodesAfterGroup
    return { nodes: nodeRet, edges }
  }

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
            name: flowName,
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
  const getRuleNBridgesFromFlowData = (
    flowName: string,
    flowData: FlowData,
  ): { rule: BasicRule; bridges: Array<BridgeItem> } => {
    const rule = { ...createRawRuleForm(), id: flowName }
    const { nodes, edges } = filterUsedNodesInFlowData(flowData)
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
