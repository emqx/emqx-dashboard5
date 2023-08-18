import { getBridgeList, getRules } from '@/api/ruleengine'
import { getAllListData } from '@/common/tools'
import useGenerateFlowDataUtils, { GroupedNode } from '@/hooks/Flow/useGenerateFlowDataUtils'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import { BridgeItem, RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import { unionBy } from 'lodash'
import { Ref, ref } from 'vue'
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
  let filterNodes: Array<Node> = []
  // column 3
  let functionNodes: Array<Node> = []
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

  const { handleBridgeDataAfterLoaded } = useBridgeDataHandler()
  const getBridgeData = async () => {
    try {
      const list: Array<BridgeItem> = await getBridgeList()
      bridgeData = list.reduce((m: Map<string, BridgeItem>, item) => {
        m.set(item.id, handleBridgeDataAfterLoaded(item))
        return m
      }, new Map())
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const { generateFlowDataFromRuleItem, countNodesPosition, isRemovedBridge } =
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
   */
  const addNodesToNodeArr = (nodes: Array<Node>, nodeArr: Array<Node>) => {
    nodes.forEach((node) => {
      const index = nodeArr.findIndex((item) => item.id === node.id)
      if (index > -1) {
        if (!nodeArr[index].data.rulesUsed) {
          nodeArr[index].data.rulesUsed = []
        }
        nodeArr[index].data.rulesUsed.push(...node.data.rulesUsed)
      } else {
        nodeArr.push(node)
      }
    })
    return nodeArr
  }

  const generateFlowDataFromRuleData = (ruleArr: Array<RuleItem>) => {
    ruleArr.forEach((rule) => {
      const { nodes, edges } = generateFlowDataFromRuleItem(rule)
      Object.entries(nodes).forEach(([key, value]) => {
        addRuleDataToNodes(value, rule.id)
        if ([NodeType.Source, NodeType.Sink].includes(Number(key))) {
          nodes[key as keyof GroupedNode] = addBridgeFormDataToNodes(value)
        }
      })

      sourceNodes = addNodesToNodeArr(nodes[NodeType.Source], sourceNodes)
      filterNodes.push(...nodes[ProcessingType.Filter])
      functionNodes.push(...nodes[ProcessingType.Function])
      sinkNodes = addNodesToNodeArr(nodes[NodeType.Sink], sinkNodes)

      edgeArr.push(...edges)
    })
  }

  const removeDuplicatedNodes = () => {
    const nodeArrays = [sourceNodes, filterNodes, functionNodes, sinkNodes]
    nodeArrays.forEach((nodeArray, i) => (nodeArrays[i] = unionBy(nodeArray, 'id')))
    ;[sourceNodes, filterNodes, functionNodes, sinkNodes] = nodeArrays
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
      nodeArray.forEach((node) => {
        if (isRemovedBridge(node)) {
          node.class = (node.class || '') + ' is-disabled'
        }
      })
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
    flowData.value = [...sourceNodes, ...filterNodes, ...functionNodes, ...sinkNodes, ...edgeArr]
  }

  const initNodeAndEdge = () => {
    sourceNodes = []
    filterNodes = []
    functionNodes = []
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
