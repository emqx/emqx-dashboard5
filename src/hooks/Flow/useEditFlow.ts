import { getRuleInfo } from '@/api/ruleengine'
import { RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import useHandleSourceItem from '../Rule/action/useHandleSourceItem'
import useRuleEvents from '../Rule/rule/useRuleEvents'
import useFlowNode, { FlowNodeType, NodeType } from './useFlowNode'
import useGenerateFlowDataUtils, { GroupedNode } from './useGenerateFlowDataUtils'

export default (): {
  flowId: ComputedRef<string>
  ruleData: Ref<RuleItem | undefined>
  flowData: Ref<(Node<any, any, string> | Edge)[] | undefined>
  addBridgeFormDataToNodes: (nodes: Node[]) => Promise<Node[]>
  getData: () => Promise<void>
} => {
  const route = useRoute()

  const flowId = computed(() => route.params.id?.toString())
  const ruleData: Ref<undefined | RuleItem> = ref(undefined)
  // let bridgeInfoMap = {}
  const flowData: Ref<undefined | Array<Node | Edge>> = ref(undefined)

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
          node.type = FlowNodeType.Default
          nodes[NodeType.Fallback].push(...fallbackNodes[NodeType.Fallback])
          retEdges.push(...fallbackEdges)
        }
      }
    }
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
    countNodePositionWhileEditing,
    addFlagToRemovedBridgeNode,
    generateFlowDataFromActionItem,
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
    await addBridgeFormDataToNodes(nodes[NodeType.Fallback])

    Object.entries(nodes).forEach(([key, value]) => {
      nodes[key as keyof GroupedNode] = unionBy(value, 'id')
    })

    countNodePositionWhileEditing(nodes)
    flowData.value = [
      ...Object.entries(nodes).reduce((arr: Array<Node>, [key, value]) => {
        if ([NodeType.Source, NodeType.Fallback, NodeType.Sink].includes(Number(key) as NodeType)) {
          value.forEach((item) => addFlagToRemovedBridgeNode(item))
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
    addBridgeFormDataToNodes,
    getData,
  }
}
