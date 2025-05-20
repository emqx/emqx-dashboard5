/**
 * Process the flow data from the flow editor and convert it into data that can be submitted.
 */
import { FallbackActionKind } from '@/types/enum'
import { BasicRule, BridgeItem, FallbackAction, FlowDataItemForSubmit } from '@/types/rule'
import { AICompletionProfile, AIProviderForm } from '@/types/typeAlias'
import { ElementData, GraphEdge, Node } from '@vue-flow/core'
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
    /**
     * This value is true when acting as a fallback for any node
     */
    isFallback?: boolean
    formData: any
  }
}

type EdgeData = Pick<GraphEdge<ElementData>, 'source' | 'sourceNode' | 'target' | 'targetNode'>

type NodesAfterGroup = Record<FlowNodeType, Array<NodeData>>

interface FlowData {
  nodes: Array<NodeData>
  edges: Array<EdgeData>
}

type BridgeData = FlowDataItemForSubmit<BridgeItem>

export default (): {
  getFromDataFromNodes: (nodes: Array<NodeData>) => Array<string>
  getFieldsExpressionsFromNode: (nodes: Array<NodeData>, edges: Array<EdgeData>) => string
  getAllRecordsFromFlow: (
    flowBasicInfo: { name: string; desc: string },
    flowData: FlowData,
  ) => Promise<{
    rule: BasicRule
    actions: Array<BridgeData>
    sources: Array<BridgeData>
    // TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
    // TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:is created
    aiProviders: Array<FlowDataItemForSubmit<AIProviderForm>>
    aiCompletions: Array<FlowDataItemForSubmit<AICompletionProfile>>
  }>
  getFallbackItemDataFromNode: (node: NodeData | Node) => FallbackAction | undefined
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

  const { checkConnection } = useFlowEdge()
  const verifyConnection = async (flowData: FlowData) => {
    const { nodes, edges } = flowData
    try {
      await Promise.all(edges.map((item) => checkConnection(item)))
      const notFallbackEdges: Array<EdgeData> = []
      const fallbackEdges: Array<EdgeData> = []
      edges.forEach((edge) => {
        const sourceNode = edge.sourceNode
        if (isBridgerNode(sourceNode)) {
          fallbackEdges.push(edge)
        } else {
          notFallbackEdges.push(edge)
        }
      })
      const checkNodeFlow = async (nodeId: string, checkDirection: 'in' | 'out') => {
        const outputTypeSet = notFallbackEdges.reduce(
          (set: Set<FlowNodeType>, edge): Set<FlowNodeType> => {
            const target = checkDirection === 'in' ? edge.target : edge.source
            if (target === nodeId) {
              const node = checkDirection === 'in' ? edge.sourceNode : edge.targetNode
              set.add(node.type as FlowNodeType)
            }
            return set
          },
          new Set() as Set<FlowNodeType>,
        )
        return [...outputTypeSet].length > 1
          ? Promise.reject(tl('incorrectConnection'))
          : Promise.resolve()
      }
      const checkFallbackEdges = (edges: Array<EdgeData>) => {
        const isAllFallbackEdgesRight = edges.every((edge) => {
          const sourceNode = edge.sourceNode
          const targetNode = edge.targetNode
          return (
            isBridgerNode(sourceNode) &&
            (isBridgerNode(targetNode) || targetNode.data.specificType === SinkType.RePub)
          )
        })
        return isAllFallbackEdgesRight
          ? Promise.resolve()
          : Promise.reject(tl('incorrectConnection'))
      }
      const allDirections: ['in', 'out'] = ['in', 'out']
      return Promise.all([
        ...nodes.map(({ id, type, data }) => {
          if (!type || !data.specificType) {
            return Promise.resolve()
          }
          return Promise.all(allDirections.map((direction) => checkNodeFlow(id, direction)))
        }),
        checkFallbackEdges(fallbackEdges),
      ])
    } catch (error: any) {
      return Promise.reject(error)
    }
  }

  /**
   * For nodes of default type, except for the first and last nodes,
   * all other nodes should have a single entry and a single exit,
   * the first node should have a single exit, and the last node should have a single entry.
   */
  const verifyDefaultNodeConnection = async (flowData: FlowData) => {
    const { nodes, edges } = flowData
    const defaultNodes = nodes.filter(({ type }) => type === FlowNodeType.Default)
    if ([0, 1, 2].includes(defaultNodes.length)) {
      return Promise.resolve()
    }
    const firstDefaultNode = edges.find(({ sourceNode, targetNode }) => {
      return sourceNode.type === FlowNodeType.Input && targetNode.type === FlowNodeType.Default
    })?.targetNode

    const lastDefaultNode = edges.find(({ sourceNode, targetNode }) => {
      return sourceNode.type === FlowNodeType.Default && targetNode.type === FlowNodeType.Output
    })?.sourceNode
    if (!firstDefaultNode || !lastDefaultNode) {
      console.error('Can not handle this case')
      return Promise.reject(tl('incorrectConnection'))
    }
    const otherDefaultNodes = defaultNodes.filter(
      (node) => node.id !== firstDefaultNode.id && node.id !== lastDefaultNode.id,
    )
    const findNodeEdges = (node: NodeData | Node, isToNode: boolean): Array<EdgeData> =>
      edges.filter(({ sourceNode, targetNode }) =>
        isToNode ? targetNode.id === node.id : sourceNode.id === node.id,
      )

    const nodeEdges: Array<Array<EdgeData>> = [
      findNodeEdges(firstDefaultNode, false),
      findNodeEdges(lastDefaultNode, true),
      ...otherDefaultNodes.map((node) => findNodeEdges(node, false)),
      ...otherDefaultNodes.map((node) => findNodeEdges(node, true)),
    ]
    const isAllSingleEdge = nodeEdges.every((edges) => edges.length === 1)
    return !isAllSingleEdge ? Promise.reject(tl('incorrectConnection')) : Promise.resolve()
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
      await verifyConnection(flowData)
      await verifyDefaultNodeConnection(flowData)
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
      if (node.type !== FlowNodeType.Output) {
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

  const getRuleActionsFromOutputNodesAndEdges = (
    outputNodes: Array<NodeData>,
    edges: Array<EdgeData>,
  ): Array<any> => {
    const ruleOutputNodes: Array<NodeData> = []
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

  /**
   * Processing Node and AI Node are processing nodes
   */
  const isProcessingNode = (node: NodeData) => {
    const { specificType } = node.data
    return specificType === ProcessingType.Function || isAIType(specificType)
  }

  const getNextNodes = (node: NodeData, edges: Array<EdgeData>): Array<NodeData> | undefined => {
    const nextNodes = edges.filter(({ sourceNode }) => sourceNode.id === node.id)
    if (!nextNodes.length) {
      return undefined
    }
    return nextNodes.map(({ targetNode }) => targetNode as NodeData)
  }
  const sortProcessingNodesByEdges = (nodes: Array<NodeData>, edges: Array<EdgeData>) => {
    const firstNode = edges.find(({ sourceNode, targetNode }) => {
      const isNotFromProcessingNode = !isProcessingNode(sourceNode as NodeData)
      const isToProcessingNode = isProcessingNode(targetNode as NodeData)
      return isNotFromProcessingNode && isToProcessingNode
    })
    if (!firstNode) {
      return []
    }
    const sortedNodes: Array<NodeData> = [firstNode.targetNode as NodeData]
    let nextNodes = getNextNodes(firstNode.targetNode as NodeData, edges)
    // Theoretically, there should only be one next node, to handle special cases.
    while (nextNodes && isProcessingNode(nextNodes[0])) {
      sortedNodes.push(...nextNodes)
      nextNodes = getNextNodes(nextNodes[nextNodes.length - 1], edges)
    }

    return sortedNodes
  }

  const getFieldsExpressionsFromNode = (nodes: Array<NodeData>, edges: Array<EdgeData>): string => {
    const sortedProcessingNodes = sortProcessingNodesByEdges(nodes, edges)
    if (!sortedProcessingNodes.length) {
      return DEFAULT_SELECT
    }
    return sortedProcessingNodes.reduce((ret, node: NodeData) => {
      let expression = ''
      if (node.data.specificType === ProcessingType.Function) {
        expression = getFuncExpressionFromForm(node.data.formData)
      } else if (isAIType(node.data.specificType)) {
        const { input, name, alias } = node.data.formData
        expression = `${AI_FUNCTION_NAME}('${name}', ${input}) as ${alias}`
      }
      ret += ret ? `, ${expression}` : expression
      return ret
    }, '')
  }

  const { isBridgerNode, isAIType } = useFlowNode()
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
  const getFallbackItemDataFromNode = (node: NodeData | Node): FallbackAction | undefined => {
    const { specificType, formData } = node?.data || {}
    if (isBridgerNode(node)) {
      return {
        kind: FallbackActionKind.Reference,
        type: formData.type,
        name: formData.name,
      }
    } else if (specificType === SinkType.RePub) {
      return {
        kind: FallbackActionKind.Republish,
        args: formData.args,
      }
    }
  }
  const getFallbackActionsFromNodes = (nodes: Array<NodeData>) =>
    nodes.map((node) => getFallbackItemDataFromNode(node)).filter(Boolean)

  const getActionsDataFromOutputNodesAndEdges = (
    outputNodes: Array<NodeData>,
    edges: Array<EdgeData>,
  ): Array<BridgeData> => {
    const allActionNodes = outputNodes.filter((node) => isBridgerNode(node))
    const actionIdFallbackNodesMap = allActionNodes.reduce((map, actionNode) => {
      const allOutputEdges = edges.filter((edge) => edge.source === actionNode.id)
      allOutputEdges.forEach((edge) => {
        const { targetNode } = edge
        if (!map.has(actionNode.id)) {
          map.set(actionNode.id, [])
        }
        map.get(actionNode.id)?.push(targetNode as NodeData)
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

  const getAIProvidersAndCompletionsFromNodes = (nodes: Array<NodeData>) => {
    const ret: {
      aiProviders: Array<FlowDataItemForSubmit<AIProviderForm>>
      aiCompletions: Array<FlowDataItemForSubmit<AICompletionProfile>>
    } = {
      aiProviders: [],
      aiCompletions: [],
    }
    const aiNodes = nodes.filter((node) => isAIType(node.data.specificType))
    aiNodes.forEach((node) => {
      const { formData, isCreated } = node.data
      const { type, api_key, name, base_url, ...rest } = formData
      const aiProvider = { name, type, api_key, base_url }
      const aiCompletion = { name, type, provider_name: name, ...omit(rest, ['input', 'alias']) }

      ret.aiProviders.push({ isCreated: isCreated || false, data: aiProvider })
      ret.aiCompletions.push({ isCreated: isCreated || false, data: aiCompletion })
    })
    return ret
  }

  const { transSQLFormDataToSQL } = useRuleUtils()
  const getAllRecordsFromFlow = async (
    flowBasicInfo: { name: string; desc: string },
    flowData: FlowData,
  ): Promise<{
    rule: BasicRule
    actions: Array<BridgeData>
    sources: Array<BridgeData>
    aiProviders: Array<FlowDataItemForSubmit<AIProviderForm>>
    aiCompletions: Array<FlowDataItemForSubmit<AICompletionProfile>>
  }> => {
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
      [FlowNodeType.Default]: defaultNodes = [],
      [FlowNodeType.Output]: outputNodes = [],
    } = nodes
    const fromArr = getFromDataFromNodes(inputNodes)
    const filterStr = getFilterStrFromNodes(defaultNodes)
    const fieldsExpressions = getFieldsExpressionsFromNode(defaultNodes, flowData.edges)
    rule.sql = transSQLFormDataToSQL(fieldsExpressions, fromArr, filterStr)
    rule.actions = getRuleActionsFromOutputNodesAndEdges(outputNodes, flowData.edges)
    const actions = getActionsDataFromOutputNodesAndEdges(outputNodes, flowData.edges)
    const sources = getBridgesFromNodes(inputNodes)
    const { aiProviders, aiCompletions } = getAIProvidersAndCompletionsFromNodes(defaultNodes)
    return { rule, actions, sources, aiProviders, aiCompletions }
  }

  return {
    getFromDataFromNodes,
    getFieldsExpressionsFromNode,
    getAllRecordsFromFlow,
    getFallbackItemDataFromNode,
  }
}
