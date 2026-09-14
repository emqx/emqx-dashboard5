import { getAICompletionProfiles, getAIProviders } from '@/api/ai'
import { getRules } from '@/api/ruleengine'
import { BridgeItem, RuleItem } from '@/types/rule'
import { AICompletionProfile, AIProviderForm } from '@/types/typeAlias'
import { Edge, Node } from '@vue-flow/core'
import useHandleActionItem from '../Rule/action/useHandleActionItem'
import useActionList from '../Rule/action/useActionList'
import useSourceList from '../Rule/action/useSourceList'
import useFlowNode, { FlowData, NodeType, ProcessingType } from './useFlowNode'
import { ConnectionStatus } from '@/types/enum'
import type { NamespaceSelection } from '@/common/constants'

export default (): {
  isLoading: Ref<boolean>
  flowData: Ref<FlowData>
  getFlowData: (ns: NamespaceSelection | undefined) => Promise<void>
} => {
  let ruleList: Array<RuleItem> = []
  let bridgeData: Map<string, BridgeItem> = new Map()
  let providerDataMap: Map<string, AIProviderForm> = new Map()
  let completionDataMap: Map<string, AICompletionProfile> = new Map()

  // column 1
  let sourceNodes: Array<Node> = []
  // column 2
  let functionNodes: Array<Node> = []
  // column 3
  let filterNodes: Array<Node> = []
  // column 4
  let sinkNodes: Array<Node> = []
  // column 5
  let fallbackNodes: Array<Node> = []

  let edgeArr: Array<Edge> = []

  const isLoading = ref(false)
  const flowData: Ref<FlowData> = ref([])

  const { getListNamespaceParams } = useListNsParams()
  const getRuleData = async (namespace: NamespaceSelection | undefined) => {
    try {
      ruleList = await getAllListData((params) => {
        return getRules({ ...params, ...getListNamespaceParams(namespace) })
      })
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const { getActionList } = useActionList()
  const { getSourceList } = useSourceList()
  const { getActionDetail, handleActionDataAfterLoaded } = useHandleActionItem()
  const getBridgeData = async (namespace: NamespaceSelection | undefined) => {
    try {
      const nsParams = getListNamespaceParams(namespace)
      const sourceList = await getSourceList(nsParams)
      const sinkList = await getActionList(nsParams)
      await Promise.allSettled(
        sinkList.map(async (item, index) => {
          const actionDetail = await getActionDetail(item.id, item.namespace)
          sinkList[index] = { ...sinkList[index], ...actionDetail } as BridgeItem
        }),
      )
      const list = [...sourceList, ...sinkList]
      const bridgeDataMap = new Map<string, BridgeItem>()
      await Promise.allSettled(
        list.map(async (item) => {
          const data = (await handleActionDataAfterLoaded(item)) as BridgeItem
          bridgeDataMap.set(item.id, data)
        }),
      )
      bridgeData = bridgeDataMap
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const getProviderData = async () => {
    const list = await getAIProviders()
    providerDataMap = list.reduce((m: Map<string, AIProviderForm>, item) => {
      m.set(item.name, item)
      return m
    }, new Map())
  }

  const getCompletionData = async () => {
    const list = await getAICompletionProfiles()
    completionDataMap = list.reduce((m: Map<string, AICompletionProfile>, item) => {
      m.set(item.name, item)
      return m
    }, new Map())
  }

  const {
    generateFlowDataFromRuleItem,
    generateFallbackRelatedDataFromActionItem,
    countNodesPosition,
    addFlagToRemovedBridgeNode,
    addFlagToRemovedAINode,
    addAIRecordToAINode,
  } = useGenerateFlowDataUtils()
  const { isBridgerNode, isAIType } = useFlowNode()

  const addRuleIdToNode = (node: Node, ruleId: string) => {
    if (!node.data.rulesUsed) {
      node.data.rulesUsed = []
    }
    if (!node.data.rulesUsed.includes(ruleId)) {
      node.data.rulesUsed.push(ruleId)
    }
    return node
  }

  const addRuleDataToNodes = (nodes: Array<Node>, rule: RuleItem) => {
    const { id: ruleId } = rule
    return nodes.map((node) => {
      node.data.namespace = rule.namespace
      return addRuleIdToNode(node, ruleId)
    })
  }

  const addBridgeFormDataToNodes = (node: Array<Node>): Array<Node> => {
    return node.map((item) => {
      if (isBridgerNode(item) && bridgeData.get(item.data.formData?.id)) {
        item.data.formData = {
          ...item.data.formData,
          ...(bridgeData.get(item.data.formData?.id) || {}),
        }
      }
      return item
    })
  }

  const addAIRecordDataToNodes = (node: Array<Node>): Array<Node> => {
    return node.map((item) => {
      if (isAIType(item.data.specificType)) {
        const provider = providerDataMap.get(item.data.formData?.name)
        const completion = completionDataMap.get(item.data.formData?.name)
        addAIRecordToAINode(item, provider, completion)
      }
      return item
    })
  }

  /**
   * If a node already exists in the list, modify the rulesUsed data of the node
   * @param type added direction
   */
  const addNodesToNodeArr = (
    nodes: Array<Node>,
    nodeArr: Array<Node>,
    addedDirection: 'push' | 'unshift' = 'push',
  ) => {
    nodes.forEach((node) => {
      const index = nodeArr.findIndex((item) => item.id === node.id)
      if (index > -1) {
        if (!nodeArr[index].data.rulesUsed) {
          nodeArr[index].data.rulesUsed = []
        }
        nodeArr[index].data.rulesUsed.push(...(node.data?.rulesUsed ?? []))
      } else {
        addedDirection === 'push' ? nodeArr.push(node) : nodeArr.unshift(node)
      }
    })
    return nodeArr
  }

  const enum RuleContent {
    Both,
    Function,
    Filter,
    None,
  }

  const classifyRuleContent = (nodes: GroupedNode) => {
    if (nodes[ProcessingType.Filter].length && nodes[ProcessingType.Function].length) {
      return RuleContent.Both
    }
    if (nodes[ProcessingType.Function].length) {
      return RuleContent.Function
    }
    if (nodes[ProcessingType.Filter].length) {
      return RuleContent.Filter
    }
    return RuleContent.None
  }

  const generateFlowDataFromRuleData = (ruleArr: Array<RuleItem>) => {
    // Push the node from top to bottom; this is because the function node
    // and the filter node should not be in the middle as far as possible,
    // blocking the connection
    const rulesGroupedByContent: Record<string, Array<GroupedNode>> = {
      // with function & filter node
      [RuleContent.Both]: [],
      // with function node and without filter node
      [RuleContent.Function]: [],
      // with filter node and with out function node
      [RuleContent.Filter]: [],
      // without filter & function node
      [RuleContent.None]: [],
    }
    ruleArr.forEach((rule) => {
      try {
        const { nodes, edges } = generateFlowDataFromRuleItem(rule)
        Object.entries(nodes).forEach(([key, value]) => {
          addRuleDataToNodes(value, rule)
          if ([NodeType.Source, NodeType.Sink].includes(Number(key))) {
            nodes[key as keyof GroupedNode] = addBridgeFormDataToNodes(value)
          }
          if (key === ProcessingType.Function) {
            nodes[key as keyof GroupedNode] = addAIRecordDataToNodes(value)
          }
        })

        rulesGroupedByContent[classifyRuleContent(nodes)].push(nodes)

        edgeArr.push(...edges)
      } catch (error) {
        console.error(error)
      }
    })
    ;[RuleContent.Both, RuleContent.Function, RuleContent.Filter, RuleContent.None].forEach(
      (key) => {
        const nodesArr = rulesGroupedByContent[key]
        nodesArr.forEach((nodes) => {
          sourceNodes = addNodesToNodeArr(nodes[NodeType.Source], sourceNodes)
          functionNodes.push(...nodes[ProcessingType.Function])
          filterNodes.push(...nodes[ProcessingType.Filter])
          sinkNodes = addNodesToNodeArr(nodes[NodeType.Sink], sinkNodes)
        })
      },
    )
  }

  /**
   * When an action both as a regular action (directly used by rules) and as a fallback action,
   * for better layout organization, place it in the fallback action list.
   */
  const addNodeToFallbackNodes = (node: Node) => {
    try {
      const sinkNodeIndex = sinkNodes.findIndex((item) => item.id === node.id)
      if (sinkNodeIndex > -1) {
        if (!node.data.rulesUsed) {
          node.data.rulesUsed = []
        }
        const rulesUsed = sinkNodes[sinkNodeIndex].data.rulesUsed
        if (rulesUsed?.length) {
          rulesUsed.forEach((rule: string) => addRuleIdToNode(node, rule))
        }
        sinkNodes.splice(sinkNodeIndex, 1)
      }
      addNodesToNodeArr([node], fallbackNodes)
    } catch (error) {
      console.error(error)
    }
  }

  const generateFallbackNodesAndEdges = () => {
    const actionFallbackNodes: Array<Node> = []
    const actionFallbackEdges: Array<Edge> = []
    sinkNodes.forEach((node: Node) => {
      // do not render action node without rules
      if (!isBridgerNode(node)) {
        return
      }

      const { nodes, edges } = generateFallbackRelatedDataFromActionItem(
        node.data.formData,
        node.id,
      )
      if (edges.length) {
        const rules = node.data.rulesUsed
        actionFallbackNodes.push(
          ...(nodes[NodeType.Fallback] ?? []).map((node) => {
            rules?.forEach?.((rule: string) => addRuleIdToNode(node, rule))
            return node
          }),
        )
        actionFallbackEdges.push(...edges)
      }
    })
    addBridgeFormDataToNodes(actionFallbackNodes).forEach((node) => addNodeToFallbackNodes(node))
    edgeArr.push(...actionFallbackEdges)
  }

  const { unavailableEdgeStyle } = useFlowEdge()
  const redUnavailableEdges = () => {
    ;[...sourceNodes, ...sinkNodes, ...fallbackNodes].forEach((node) => {
      if (isBridgerNode(node)) {
        const status = node.data?.formData?.status
        const needRed = status === ConnectionStatus.Disconnected
        if (needRed) {
          const targetEdges = edgeArr.filter(
            (edge) => edge.target === node.id || edge.source === node.id,
          )
          targetEdges.forEach((edge) => {
            edge.style = { ...(edge.style ?? {}), ...unavailableEdgeStyle }
            console.log(JSON.stringify(edge.style, null, 2))
          })
        }
      }
    })
  }

  const removeDuplicatedNodes = () => {
    const nodeArrays = [sourceNodes, functionNodes, filterNodes, sinkNodes]
    nodeArrays.forEach((nodeArray, i) => (nodeArrays[i] = unionBy(nodeArray, 'id')))
    ;[sourceNodes, functionNodes, filterNodes, sinkNodes] = nodeArrays
  }

  const removeIsolatedBridge = () => {
    const nodeArrays = [sourceNodes, sinkNodes]
    const connectedIds = edgeArr.reduce(
      (arr, { source, target }) => arr.add(source).add(target),
      new Set(),
    )
    nodeArrays.forEach((nodeArray, i) => {
      nodeArrays[i] = nodeArray.filter(({ id }) => connectedIds.has(id))
    })
    ;[sourceNodes, sinkNodes] = nodeArrays
  }

  const setClassToRemovedBridges = () => {
    const nodeArrays = [sourceNodes, sinkNodes, fallbackNodes]
    nodeArrays.forEach((nodeArray) => {
      nodeArray.forEach((node) => addFlagToRemovedBridgeNode(node))
    })
    ;[sourceNodes, sinkNodes, fallbackNodes] = nodeArrays
    functionNodes.forEach((node) => addFlagToRemovedAINode(node))
  }

  const setPositionToNodes = async () => {
    const nodes = {
      [NodeType.Source]: sourceNodes,
      [ProcessingType.Filter]: filterNodes,
      [ProcessingType.Function]: functionNodes,
      [NodeType.Sink]: sinkNodes,
      [NodeType.Fallback]: fallbackNodes,
    }
    return countNodesPosition(nodes, edgeArr)
  }

  const joinToFlowData = () => {
    flowData.value = [
      ...sourceNodes,
      ...functionNodes,
      ...filterNodes,
      ...sinkNodes,
      ...fallbackNodes,
      ...edgeArr,
    ]
  }

  const initNodeAndEdge = () => {
    sourceNodes = []
    functionNodes = []
    filterNodes = []
    sinkNodes = []
    fallbackNodes = []
    edgeArr = []
  }

  const generateFlowData = async () => {
    try {
      initNodeAndEdge()
      generateFlowDataFromRuleData(ruleList)
      generateFallbackNodesAndEdges()
      redUnavailableEdges()
      removeDuplicatedNodes()
      removeIsolatedBridge()
      setClassToRemovedBridges()
      await setPositionToNodes()
      joinToFlowData()
    } catch (error) {
      console.error(error)
    }
  }

  const getData = async (namespace: NamespaceSelection | undefined) => {
    return await Promise.all([
      getRuleData(namespace),
      getBridgeData(namespace),
      getProviderData(),
      getCompletionData(),
    ])
  }

  const { getEventList } = useRuleEvents()
  const getFlowData = async (namespace: NamespaceSelection | undefined) => {
    try {
      isLoading.value = true
      await getData(namespace)
      // For event node info
      await getEventList()
      await generateFlowData()
    } catch (error) {
      //
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    flowData,
    getFlowData,
  }
}
