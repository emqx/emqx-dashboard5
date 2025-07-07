import { getAICompletionProfileDetail, getAIProviderDetail } from '@/api/ai'
import { getRuleInfo } from '@/api/ruleengine'
import { RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import useHandleSourceItem from '../Rule/action/useHandleSourceItem'
import useRuleEvents from '../Rule/rule/useRuleEvents'
import useFlowNode, { FlowNodeType, NodeType, ProcessingType } from './useFlowNode'
import useGenerateFlowDataUtils, { GroupedNode } from './useGenerateFlowDataUtils'

export default (): {
  flowId: ComputedRef<string>
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

  const flowId = computed(() => route.params.id?.toString())
  const ruleData: Ref<undefined | RuleItem> = ref(undefined)
  // let bridgeInfoMap = {}
  const flowData: Ref<undefined | Array<Node | Edge>> = ref(undefined)

  /**
   * for remove useless AI data when submit
   */
  const initialAIData = ref<{
    provider: Array<string>
    completion: Array<string>
  }>({ provider: [], completion: [] })
  const assignInitialAIData = (name: string, type: 'provider' | 'completion') => {
    if (!initialAIData.value[type].includes(name)) {
      initialAIData.value[type].push(name)
    }
  }

  const getRuleData = async () => {
    try {
      ruleData.value = await getRuleInfo(flowId.value)
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const { getSourceDetail } = useHandleSourceItem()
  const { getDetail: getActionDetail } = useHandleActionItem()
  const addBridgeFormDataToNodes = async (nodes: Array<Node>) => {
    await Promise.allSettled(
      nodes.map(async (item) => {
        if (isBridgerNode(item) && item.data?.formData?.id) {
          const request = item.type === FlowNodeType.Input ? getSourceDetail : getActionDetail
          const nodeInfo = await request(item.data.formData.id)
          item.data.formData = { ...item.data.formData, ...nodeInfo }
          addFlagToBridgeNode(item)
        }
        return Promise.resolve()
      }),
    )
    return nodes
  }
  const addAIRecordDataToNodes = async (nodes: Array<Node>) => {
    await Promise.allSettled(
      nodes.map(async (item) => {
        try {
          if (isAIType(item.data.specificType)) {
            const completion = await getAICompletionProfileDetail(item.data.formData?.name)
            assignInitialAIData(completion.name, 'completion')
            const provider = await getAIProviderDetail(completion.provider_name)
            assignInitialAIData(provider.name, 'provider')
            addAIRecordToAINode(item, provider, completion)
          }
          return Promise.resolve()
        } catch (error) {
          return Promise.reject()
        }
      }),
    )

    return nodes
  }
  const updateInitialAIDataAfterRemoveAINode = (
    uselessProvider: Array<string>,
    uselessCompletion: Array<string>,
  ) => {
    // Update initAIData to reflect current state after cleanup
    initialAIData.value.provider = initialAIData.value.provider.filter(
      (provider) => !uselessProvider.includes(provider),
    )
    initialAIData.value.completion = initialAIData.value.completion.filter(
      (completion) => !uselessCompletion.includes(completion),
    )
  }
  const addFallbackNodeToNodes = (fallbackNode: Node, nodes: GroupedNode) => {
    const sinkNodeIndex = nodes[NodeType.Sink].findIndex((item) => item.id === fallbackNode.id)
    if (sinkNodeIndex > -1) {
      nodes[NodeType.Sink].splice(sinkNodeIndex, 1)
    }
    if (!nodes[NodeType.Fallback]) {
      nodes[NodeType.Fallback] = []
    }
    nodes[NodeType.Fallback].push(fallbackNode)
  }
  const addFallbackDataToFlow = (nodes: GroupedNode, edges: Array<Edge>) => {
    const retEdges = [...edges]
    const outputNodes = nodes[NodeType.Sink]
    for (let index = 0; index < outputNodes.length; index++) {
      const node = outputNodes[index]
      if (isBridgerNode(node) && node.data.isCreated) {
        const { nodes: fallbackNodes, edges: fallbackEdges } = generateFlowDataFromActionItem(
          node.data.formData,
        )
        if (fallbackEdges.length) {
          ;(fallbackNodes[NodeType.Fallback] ?? []).forEach((item) => {
            addFallbackNodeToNodes(item, nodes)
          })
          retEdges.push(...fallbackEdges)
        }
      }
    }
    nodes[NodeType.Fallback] = unionBy(nodes[NodeType.Fallback], 'id')
    return { nodes, edges: retEdges }
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
    generateFlowDataFromActionItem,
    addAIRecordToAINode,
  } = useGenerateFlowDataUtils()
  const { isBridgerNode, isAIType } = useFlowNode()

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
    ruleData,
    flowData,
    initialAIData,
    addBridgeFormDataToNodes,
    addAIRecordDataToNodes,
    getData,
    updateInitialAIDataAfterRemoveAINode,
  }
}
