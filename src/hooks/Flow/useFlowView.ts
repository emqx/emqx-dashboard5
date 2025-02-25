import { getRules } from '@/api/ruleengine'
import { BridgeItem, RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import useHandleActionItem from '../Rule/action/useHandleActionItem'
import useActionList from '../Rule/action/useActionList'
import useSourceList from '../Rule/action/useSourceList'
import useFlowNode, { FlowData, NodeType, ProcessingType } from './useFlowNode'

export default (): {
  isLoading: Ref<boolean>
  flowData: Ref<FlowData>
  getFlowData: () => Promise<void>
} => {
  let ruleList: Array<RuleItem> = []
  let bridgeData: Map<string, BridgeItem> = new Map()

  // column 1
  let sourceNodes: Array<Node> = []
  // column 2
  let functionNodes: Array<Node> = []
  // column 3
  let filterNodes: Array<Node> = []
  // column 4
  let sinkNodes: Array<Node> = []

  let edgeArr: Array<Edge> = []

  const isLoading = ref(false)
  const flowData: Ref<FlowData> = ref([])

  const getRuleData = async () => {
    try {
      ruleList = await getAllListData(getRules)
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const { getActionList } = useActionList()
  const { getSourceList } = useSourceList()
  const { handleActionDataAfterLoaded } = useHandleActionItem()
  const getBridgeData = async () => {
    try {
      const sourceList = await getSourceList()
      const sinkList = await getActionList()
      const list = [...sourceList, ...sinkList]
      bridgeData = list.reduce((m: Map<string, BridgeItem>, item) => {
        m.set(item.id, handleActionDataAfterLoaded(item))
        return m
      }, new Map())
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const { generateFlowDataFromRuleItem, countNodesPosition, addFlagToRemovedBridgeNode } =
    useGenerateFlowDataUtils()
  const { isBridgerNode } = useFlowNode()

  const addRuleDataToNodes = (nodes: Array<Node>, ruleId: string) =>
    nodes.map((node) => {
      node.data.rulesUsed = [ruleId]
      return node
    })

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
        nodeArr[index].data.rulesUsed.push(...node.data.rulesUsed)
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
          addRuleDataToNodes(value, rule.id)
          if ([NodeType.Source, NodeType.Sink].includes(Number(key))) {
            nodes[key as keyof GroupedNode] = addBridgeFormDataToNodes(value)
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
    const nodeArrays = [sourceNodes, sinkNodes]
    nodeArrays.forEach((nodeArray) => {
      nodeArray.forEach((node) => addFlagToRemovedBridgeNode(node))
    })
    ;[sourceNodes, sinkNodes] = nodeArrays
  }

  const setPositionToNodes = () => {
    const nodes = {
      [NodeType.Source]: sourceNodes,
      [ProcessingType.Filter]: filterNodes,
      [ProcessingType.Function]: functionNodes,
      [NodeType.Sink]: sinkNodes,
    }
    countNodesPosition(nodes)
  }

  const joinToFlowData = () => {
    flowData.value = [...sourceNodes, ...functionNodes, ...filterNodes, ...sinkNodes, ...edgeArr]
  }

  const initNodeAndEdge = () => {
    sourceNodes = []
    functionNodes = []
    filterNodes = []
    sinkNodes = []
    edgeArr = []
  }

  const generateFlowData = () => {
    initNodeAndEdge()
    generateFlowDataFromRuleData(ruleList)
    removeDuplicatedNodes()
    removeIsolatedBridge()
    setClassToRemovedBridges()
    setPositionToNodes()
    joinToFlowData()
  }

  const getData = async () => {
    return await Promise.all([getRuleData(), getBridgeData()])
  }

  const { getEventList } = useRuleEvents()
  const getFlowData = async () => {
    try {
      isLoading.value = true
      await getData()
      // For event node info
      await getEventList()
      generateFlowData()
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
