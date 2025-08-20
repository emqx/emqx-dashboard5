/**
 * Process the flow data from the flow editor and convert it into data that can be submitted.
 */
import { BasicRule, BridgeItem, FallbackAction, FlowDataItemForSubmit } from '@/types/rule'
import { AICompletionProfile, AIProviderForm } from '@/types/typeAlias'
import { useFlowEditorDataHandler } from '@emqx/shared-ui-components'
import { ElementData, GraphEdge, Node } from '@vue-flow/core'
import useFlowNode, { FlowNodeType, SinkType } from './useFlowNode'

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
    aiProviders: Array<FlowDataItemForSubmit<AIProviderForm>>
    aiCompletions: Array<FlowDataItemForSubmit<AICompletionProfile>>
  }>
  getFallbackItemDataFromNode: (node: NodeData | Node) => FallbackAction | undefined
} => {
  const {
    getFromDataFromNodes,
    getFieldsExpressionsFromNode,
    getFallbackItemDataFromNode,
    getFilterStrFromNodes,
    getBridgesFromNodes,
    getFallbackActionsFromNodes,
    groupNodes,
    getAIProvidersAndCompletionsFromNodes: getAIProvidersAndCompletionsFromNodesInSharedUI,
    validateFlow: validateFlowInSharedUI,
  } = useFlowEditorDataHandler()

  const { createRawRuleForm } = useRuleForm()

  const validateFlow = async (flowData: FlowData) => {
    return validateFlowInSharedUI(flowData)
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
        isRuleOutput = inputNodes.some((node) => !isActionBridgeNode(node))
      }
      if (isRuleOutput) {
        ruleOutputNodes.push(node)
      }
    })
    const ret = getRuleOutputDataFromNodes(uniqBy(ruleOutputNodes, 'id'))
    return ret
  }

  const { isBridgerNode, isActionBridgeNode } = useFlowNode()

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
    const { aiCompletions, aiProviders } = getAIProvidersAndCompletionsFromNodesInSharedUI(nodes)
    return {
      aiCompletions: aiCompletions.map(({ isCreated, data }) => ({ isCreated, data })),
      aiProviders: aiProviders.map(({ isCreated, data }) => ({ isCreated, data })),
    }
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
