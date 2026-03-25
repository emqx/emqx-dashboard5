import { getAICompletionProfileDetail, getAIProviderDetail } from '@/api/ai'
import { Action, RuleItem } from '@/types/rule'
import { useEditFlow } from '@emqx/shared-ui-components'
import { Edge, Node } from '@vue-flow/core'
import useHandleSourceItem from '../Rule/action/useHandleSourceItem'
import useRuleEvents from '../Rule/rule/useRuleEvents'
import useFlowNode, { FlowNodeType, NodeType, ProcessingType } from './useFlowNode'
import useGenerateFlowDataUtils, { GroupedNode } from './useGenerateFlowDataUtils'

export default (): {
  flowId: ComputedRef<string>
  namespace: ComputedRef<string | undefined>
  ruleData: Ref<RuleItem | undefined>
  flowData: Ref<(Node<any, any, string> | Edge)[] | undefined>
  initialAIData: Ref<{
    provider: Array<string>
    completion: Array<string>
  }>
  addBridgeFormDataToNodes: (nodes: Node[]) => Promise<Node[]>
  addAIRecordDataToNodes: (nodes: Node[]) => Promise<Node[]>
  getData: () => Promise<void>
  updateInitialAIDataAfterRemoveAINode: (
    uselessProvider: Array<string>,
    uselessCompletion: Array<string>,
  ) => void
} => {
  const route = useRoute()

  const {
    initialAIData,
    addAIRecordDataToNodes: addAIRecordDataToNodesInSharedUI,
    updateInitialAIDataAfterRemoveAINode,
    addFallbackDataToFlow: addFallbackDataToFlowInSharedUI,
  } = useEditFlow()
  const { customHandleAINode } = useGenerateFlowDataUtils()

  const flowId = computed(() => route.params.id?.toString())
  const namespace = computed(() => route.query.ns?.toString())
  const ruleData: Ref<undefined | RuleItem> = ref(undefined)
  // let bridgeInfoMap = {}
  const flowData: Ref<undefined | Array<Node | Edge>> = ref(undefined)
  const { getRuleDetail } = useRuleItem()
  const getRuleData = async () => {
    try {
      ruleData.value = await getRuleDetail(flowId.value, namespace.value)
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const { getSourceDetail } = useHandleSourceItem()
  const { getActionDetail } = useHandleActionItem()
  const addBridgeFormDataToNodes = async (nodes: Array<Node>) => {
    await Promise.allSettled(
      nodes.map(async (item) => {
        if (isBridgerNode(item) && item.data?.formData?.id) {
          const request = item.type === FlowNodeType.Input ? getSourceDetail : getActionDetail
          const nodeInfo = await request(item.data.formData.id, namespace.value)
          item.data.formData = { ...item.data.formData, ...nodeInfo }
          addFlagToBridgeNode(item)
        }
        return Promise.resolve()
      }),
    )
    return nodes
  }
  const addAIRecordDataToNodes = async (nodes: Array<Node>) => {
    await addAIRecordDataToNodesInSharedUI(
      nodes,
      getAICompletionProfileDetail as any,
      getAIProviderDetail as any,
    )
    nodes.forEach((node) => {
      const { api_key, name, type, provider_name } = node.data.formData || {}
      const provider = { api_key, name, type }
      const completion = { provider_name, name, type }
      if (!node.data.specificType) {
        customHandleAINode(node, provider, completion)
      }
    })
    return nodes
  }
  const addFallbackDataToFlow = (nodes: GroupedNode, edges: Array<Edge>) => {
    const findActionNodeId = (action: Action) => {
      const arr = [...nodes[NodeType.Sink], ...(nodes[NodeType.Fallback] ?? [])]
      const item = arr.find((item) => {
        return item.data.formData?.id === action.id
      })
      return item ? item.id : undefined
    }
    return addFallbackDataToFlowInSharedUI(nodes, edges, (action: Action) =>
      generateFallbackRelatedDataFromActionItem(action, findActionNodeId(action)),
    )
  }

  /**
   * Adding a flag to the node data indicates that these bridges have
   * been added before, which can control whether the name can be modified,
   * and when submitting data, whether the current bridge should call
   * the added API or the updated API
   */
  const addFlagToBridgeNode = (node: Node) => {
    node.data.isCreated = true
    return node
  }

  const {
    generateFlowDataFromRuleItem,
    countNodesPosition,
    addFlagToRemovedBridgeNode,
    addFlagToRemovedAINode,
    generateFallbackRelatedDataFromActionItem,
  } = useGenerateFlowDataUtils()
  const { isBridgerNode } = useFlowNode()

  const getFlowData = async () => {
    if (!ruleData.value) {
      return
    }
    const ruleFlowData = generateFlowDataFromRuleItem(ruleData.value)
    const { nodes: withoutFallbackNodes, edges: withoutFallbackEdges } = ruleFlowData
    const sourceAndSinkNodes = [
      ...withoutFallbackNodes[NodeType.Source],
      ...withoutFallbackNodes[NodeType.Sink],
    ]
    await addBridgeFormDataToNodes(sourceAndSinkNodes)
    const { nodes, edges } = addFallbackDataToFlow(withoutFallbackNodes, withoutFallbackEdges)
    await addBridgeFormDataToNodes(nodes[NodeType.Fallback] ?? [])
    await addAIRecordDataToNodes(nodes[ProcessingType.Function] ?? [])

    Object.entries(nodes).forEach(([key, value]) => {
      nodes[key as keyof GroupedNode] = unionBy(value, 'id')
    })

    await countNodesPosition(nodes, edges)
    flowData.value = [
      ...Object.entries(nodes).reduce((arr: Array<Node>, [key, value]) => {
        if ([NodeType.Source, NodeType.Fallback, NodeType.Sink].includes(Number(key) as NodeType)) {
          value.forEach((item) => addFlagToRemovedBridgeNode(item))
        }
        if (key === ProcessingType.Function) {
          value.forEach((item) => addFlagToRemovedAINode(item))
        }
        return [...arr, ...value]
      }, []),
      ...edges,
    ]
  }

  const { getEventList } = useRuleEvents()
  const getData = async () => {
    try {
      await getRuleData()
      await getEventList()
      await getFlowData()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  return {
    flowId,
    namespace,
    ruleData,
    flowData,
    initialAIData,
    addBridgeFormDataToNodes,
    addAIRecordDataToNodes,
    getData,
    updateInitialAIDataAfterRemoveAINode,
  }
}
