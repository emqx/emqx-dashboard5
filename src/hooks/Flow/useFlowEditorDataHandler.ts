/**
 * Process the flow data from the flow editor and convert it into data that can be submitted.
 */
import { FallbackActionKind } from '@/types/enum'
import { BasicRule, BridgeItem } from '@/types/rule'
import { ElementData, GraphEdge } from '@vue-flow/core'
import useI18nTl from '../useI18nTl'
import useFlowEdge from './useFlowEdge'
import useFlowNode, { FlowNodeType, ProcessingType, SinkType, SourceType } from './useFlowNode'
import useHandleFlowDataUtils from './useHandleFlowDataUtils'

interface NodeData {
  id: string
  type: FlowNodeType
  data: {
    specificType: string
    isCreated?: boolean
    isChanged?: boolean
    formData: any
  }
}

type EdgeData = Pick<GraphEdge<ElementData>, 'source' | 'sourceNode' | 'target' | 'targetNode'>

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
  getFromDataFromNodes: (nodes: Array<NodeData>) => Array<string>
  getFieldsExpressionsFromNode: (nodes: Array<NodeData>) => string
  getRulesActionsSourcesFromFlowData: (
    flowBasicInfo: { name: string; desc: string },
    flowData: FlowData,
  ) => Promise<{
    rule: BasicRule
    actions: Array<BridgeData>
    sources: Array<BridgeData>
  }>
} => {
  const { t, tl } = useI18nTl('Flow')

  const { createRawRuleForm } = useRuleForm()
  const { getFuncExpressionFromForm, getFilterExpressionFromForm } = useHandleFlowDataUtils()

  /**
   * At least one input node and one output node are required
   */
  const verifyIntegrityOfFlow = async (flowData: FlowData) => {
    const { nodes } = flowData
    const inputNode = nodes.find(({ type }) => type === FlowNodeType.Input)
    // is output node
    const defaultActionNode = nodes.find((node) => {
      return node.type === FlowNodeType.Default && isBridgerNode(node)
    })
    const outputNode = nodes.find(({ type }) => type === FlowNodeType.Output) ?? defaultActionNode
    if (!inputNode && !outputNode && !defaultActionNode) {
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

  const { checkConnection } = useFlowEdge()
  const verifyConnection = async (flowData: FlowData) => {
    const { nodes, edges } = flowData
    try {
      await Promise.all(edges.map((item) => checkConnection(item)))
      const checkNodeFlow = async (nodeId: string, direction: 'in' | 'out') => {
        const outputTypeSet = edges.reduce((set: Set<FlowNodeType>, edge): Set<FlowNodeType> => {
          const target = direction === 'in' ? edge.target : edge.source
          if (target === nodeId) {
            const node = direction === 'in' ? edge.sourceNode : edge.targetNode
            set.add(node.type as FlowNodeType)
          }
          return set
        }, new Set() as Set<FlowNodeType>)
        // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: new check
        // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: new check
        // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: new check
        // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: new check
        // return [...outputTypeSet].length > 1
        //   ? Promise.reject(tl('incorrectConnection'))
        //   : Promise.resolve()
        return Promise.resolve()
      }
      return Promise.all(
        nodes.map(({ id, type, data }) => {
          if (!type || !data.specificType) {
            return Promise.resolve()
          }
          const isInputNode = type === FlowNodeType.Input
          const isFunctionNode = data.specificType === ProcessingType.Function
          const direction = isInputNode || isFunctionNode ? 'out' : 'in'
          return checkNodeFlow(id, direction)
        }),
      )
    } catch (error: any) {
      return Promise.reject(error)
    }
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
    // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: new check
    // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: new check
    // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: new check
    // FIXME:FIXME:FIXME:FIXME:FIXME:FIXME:FIXME: new check
    // return numberOfConnectedComponents > 1
    //   ? Promise.reject(tl('multipleFlowError'))
    //   : Promise.resolve()
    return Promise.resolve()
  }

  const validateFlow = async (flowData: FlowData) => {
    try {
      await verifyIntegrityOfFlow(flowData)
      await verifyIsolatedNode(flowData)
      await verifyConnection(flowData)
      await verifyMultipleFlow(flowData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const groupNodes = (nodes: Array<NodeData>): NodesAfterGroup =>
    groupBy(nodes, 'type') as NodesAfterGroup

  const getFromDataFromNodes = (nodes: Array<NodeData>): Array<string> => {
    return nodes.reduce((ret: Array<string>, node) => {
      if (node.type !== FlowNodeType.Input) {
        return ret
      }
      const { specificType, formData } = node.data
      const isBridge = isBridgerNode(node)
      let data = ''
      if (isBridge) {
        data = `${RULE_INPUT_BRIDGE_TYPE_PREFIX}${getBridgeKey({
          type: node.data.formData.type,
          name: node.data.formData.name,
        })}`
      } else {
        switch (specificType) {
          case SourceType.Message:
            data = formData.topic
            break
          case SourceType.Event:
            data = formData.event
            break
          default:
            return ret
        }
      }
      ret.push(data)
      return ret
    }, [])
  }

  const getRuleOutputValueFromActionNode = (node: NodeData) => {
    const { formData } = node.data
    return getBridgeKey(formData)
  }
  const getRuleOutputDataFromNodes = (nodes: Array<NodeData>): Array<any> => {
    return nodes.reduce((ret: Array<string>, node) => {
      if (![FlowNodeType.Output, FlowNodeType.Default].includes(node.type)) {
        return ret
      }
      const { specificType, formData } = node.data
      let data = ''
      if (specificType === SinkType.Console || specificType === SinkType.RePub) {
        data = formData
        ret.push(data)
      } else {
        ret.push(getRuleOutputValueFromActionNode(node))
      }

      return ret
    }, [])
  }

  const getRuleActionsFromGroupedNodesAndEdges = (
    nodes: NodesAfterGroup,
    edges: Array<EdgeData>,
  ): Array<any> => {
    const { [FlowNodeType.Default]: defaultNodes = [], [FlowNodeType.Output]: outputNodes = [] } =
      nodes
    const ruleOutputNodes = defaultNodes.filter((node) => {
      const isActionNode = isBridgerNode(node)
      const allInputNodes = edges
        .filter((edge) => edge.target === node.id)
        .map((edge) => edge.sourceNode)
      const withNotActionInput = allInputNodes.some((node) => !isBridgerNode(node))
      return isActionNode && withNotActionInput
    })
    outputNodes.forEach((node) => {
      const { data } = node
      let isRuleOutput = false
      if (data.specificType === SinkType.Console) {
        isRuleOutput = true
      } else {
        const inputEdges = edges.filter((edge) => edge.target === node.id)
        const inputNodes = inputEdges.map((edge) => edge.sourceNode)
        isRuleOutput = inputNodes.some((node) => !isBridgerNode(node))
      }
      if (isRuleOutput) {
        ruleOutputNodes.push(node)
      }
    })
    const ret = getRuleOutputDataFromNodes(uniqBy(ruleOutputNodes, 'id'))
    return ret
  }

  const getFilterStrFromNodes = (nodes: Array<NodeData>): string => {
    const filterNode = nodes.find(({ data }) => data.specificType === ProcessingType.Filter)
    const filterData = filterNode?.data.formData
    if (!filterData) {
      return ''
    }
    return getFilterExpressionFromForm(filterData)
  }

  const getFieldsExpressionsFromNode = (nodes: Array<NodeData>): string => {
    const functionNode = nodes.find(({ data }) => data.specificType === ProcessingType.Function)
    const functionData = functionNode?.data.formData
    if (!functionData) {
      return DEFAULT_SELECT
    }
    return getFuncExpressionFromForm(functionData)
  }

  const { isBridgerNode } = useFlowNode()
  const getBridgeDataFromNode = (node: NodeData): BridgeData => {
    return { isCreated: !!node.data.isCreated, data: node.data.formData }
  }
  const getBridgesFromNodes = (nodes: Array<NodeData>): Array<BridgeData> => {
    const bridgeDataArr = nodes.reduce((arr: Array<BridgeData>, node) => {
      const isBridge = isBridgerNode(node)
      if (isBridge) {
        arr.push(getBridgeDataFromNode(node))
      }
      return arr
    }, [])
    return bridgeDataArr
  }
  const getFallbackActionsFromNodes = (nodes: Array<NodeData>) => {
    return nodes.map((node) => {
      const { data } = node
      if (isBridgerNode(node)) {
        return {
          kind: FallbackActionKind.Reference,
          type: data.formData.type,
          name: data.formData.name,
        }
      } else if (data.specificType === SinkType.RePub) {
        return {
          kind: FallbackActionKind.Republish,
          args: data.formData.args,
        }
      }
    })
  }
  const getActionsDataFromGroupedNodesAndEdges = (
    nodes: NodesAfterGroup,
    edges: Array<EdgeData>,
  ): Array<BridgeData> => {
    const { [FlowNodeType.Default]: defaultNodes = [], [FlowNodeType.Output]: outputNodes = [] } =
      nodes
    const allActionNodes = [...defaultNodes, ...outputNodes].filter((node) => isBridgerNode(node))
    const actionIdFallbackNodesMap = allActionNodes.reduce((map, actionNode) => {
      const allOutputEdges = edges.filter((edge) => edge.source === actionNode.id)
      allOutputEdges.forEach((edge) => {
        const { targetNode } = edge
        if (!map.has(actionNode.id)) {
          map.set(actionNode.id, [])
        }
        map.get(actionNode.id)?.push(targetNode)
      })
      return map
    }, new Map<string, Array<NodeData>>())
    allActionNodes.forEach((node) => {
      const fallbackNodes = actionIdFallbackNodesMap.get(node.id)
      if (fallbackNodes) {
        node.data.formData.fallback_actions = getFallbackActionsFromNodes(fallbackNodes)
      }
    })
    const allActionData = getBridgesFromNodes(allActionNodes)
    return allActionData
  }

  const { transSQLFormDataToSQL } = useRuleUtils()
  const getRulesActionsSourcesFromFlowData = async (
    flowBasicInfo: { name: string; desc: string },
    flowData: FlowData,
  ): Promise<{ rule: BasicRule; actions: Array<BridgeData>; sources: Array<BridgeData> }> => {
    try {
      await validateFlow(flowData)
    } catch (error) {
      ElMessage.error(error?.toString())
      return Promise.reject(error)
    }
    const { name: flowName, desc } = flowBasicInfo
    const rule: BasicRule = { ...createRawRuleForm(), id: flowName, description: desc }
    const nodes = groupNodes(flowData.nodes)
    const { [FlowNodeType.Input]: inputNodes = [], [FlowNodeType.Default]: defaultNodes = [] } =
      nodes
    const fromArr = getFromDataFromNodes(inputNodes)
    const filterStr = getFilterStrFromNodes(defaultNodes)
    const fieldsExpressions = getFieldsExpressionsFromNode(defaultNodes)
    rule.sql = transSQLFormDataToSQL(fieldsExpressions, fromArr, filterStr)
    rule.actions = getRuleActionsFromGroupedNodesAndEdges(nodes, flowData.edges)
    const actions = getActionsDataFromGroupedNodesAndEdges(nodes, flowData.edges)
    const sources = getBridgesFromNodes(inputNodes)
    return { rule, actions, sources }
  }

  return {
    getFromDataFromNodes,
    getFieldsExpressionsFromNode,
    getRulesActionsSourcesFromFlowData,
  }
}
