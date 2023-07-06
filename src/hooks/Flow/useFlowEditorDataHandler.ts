/**
 * Process the flow data from the flow editor and convert it into data that can be submitted.
 */
import { BasicRule, BridgeItem } from '@/types/rule'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import { SourceType, ProcessingType, SinkType } from '@/hooks/Flow/useFlowEditor'
import { getBridgeKey } from '@/common/tools'
import { BridgeType, RuleOutput } from '@/types/enum'
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { FilterForm, FilterItem } from './useNodeForm'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'

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

interface FlowData {
  nodes: Array<NodeData>
  edges: Array<EdgeData>
}

export default () => {
  const { createRawRuleForm } = useRuleForm()

  const filterUsedNodesInFlowData = ({ nodes, edges }: FlowData) => {
    // TODO:Check for incomplete data flows.
    const nodesWithEdge = edges.reduce(
      (arr, { source, target }) => arr.add(source).add(target),
      new Set(),
    )
    const nodeRet = nodes.filter(({ id }) => nodesWithEdge.has(id))
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
      switch (specificType) {
        case SinkType.Console:
          data = RuleOutput.Console
          break
        case SinkType.RePub:
          data = formData
          break
        // TODO:TODO:TODO:Various types of bridges.
        // TODO:TODO:TODO:Various types of bridges.
        // TODO:TODO:TODO:Various types of bridges.
        default:
          return ret
      }
      ret.push(data)
      return ret
    }, [])
  }

  const processFilterDataToSql = (filterData: FilterForm): string => {
    if (Array.isArray(filterData.items)) {
      const clauses: Array<string> = filterData.items.map((item) =>
        processFilterDataToSql(item as FilterForm),
      )
      return '(' + clauses.join(` ${filterData.groupOperator.toUpperCase()} `) + ')'
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

  const { transFromDataArrToStr, transSQLFormDataToSQL } = useRuleUtils()
  const getRuleNBridgesFromFlowData = (
    flowName: string,
    flowData: FlowData,
  ): { rule: BasicRule; bridges: Array<BridgeItem> } => {
    const rule = { ...createRawRuleForm(), name: flowName }
    const bridges: Array<BridgeItem> = []
    const { nodes, edges } = filterUsedNodesInFlowData(flowData)
    const fromArr = getFromDataFromNodes(flowName, nodes)
    const filterStr = getFilterStrFromNodes(nodes)
    // TODO:replace *
    rule.sql = transSQLFormDataToSQL(transFromDataArrToStr(fromArr), ['*'], filterStr)
    rule.actions = getActionDataFromNodes(flowName, nodes)
    return { rule, bridges }
  }

  return {
    getRuleNBridgesFromFlowData,
  }
}
