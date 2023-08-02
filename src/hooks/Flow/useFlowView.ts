import { getBridgeList, getRules } from '@/api/ruleengine'
import { getAllListData } from '@/common/tools'
import useFlowUtils from '@/hooks/Flow/useFlowUtils'
import useRuleEvents from '@/hooks/Rule/rule/useRuleEvents'
import { BridgeItem, RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import { unionBy } from 'lodash'
import { Ref, ref } from 'vue'
import useWebhookUtils from '../Webhook/useWebhookUtils'
import useFlowNode, { FlowData, FlowNodeType, NodeType, ProcessingType } from './useFlowNode'

export default (): {
  isLoading: Ref<boolean>
  flowData: Ref<FlowData>
  getFlowData: () => Promise<void>
} => {
  let ruleList: Array<RuleItem> = []
  let bridgeList: Array<BridgeItem> = []

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

  const { isBridgerNode } = useFlowNode()

  const { judgeIsWebhookBridge, judgeIsWebhookRule } = useWebhookUtils()

  const getRuleData = async () => {
    try {
      const data = await getAllListData(getRules)
      ruleList = data.filter((item) => !judgeIsWebhookRule(item))
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const getBridgeData = async () => {
    try {
      const list: Array<BridgeItem> = await getBridgeList()
      bridgeList = list.filter((item) => !judgeIsWebhookBridge(item))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  const { generateNodeFromBridgeData, generateFlowDataFromRuleItem, countNodesPosition } =
    useFlowUtils()

  const addRuleDataToNodes = (nodes: Array<Node>, ruleId: string) =>
    nodes.map((node) => {
      node.data.rulesUsed = [ruleId]
      return node
    })

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
      Object.entries(nodes).forEach(([, value]) => addRuleDataToNodes(value, rule.id))

      sourceNodes = addNodesToNodeArr(nodes[NodeType.Source], sourceNodes)
      filterNodes.push(...nodes[ProcessingType.Filter])
      functionNodes.push(...nodes[ProcessingType.Function])
      sinkNodes = addNodesToNodeArr(nodes[NodeType.Sink], sinkNodes)

      edgeArr.push(...edges)
    })
  }
  const generateNodesFromBridgeData = (bridgeArr: Array<BridgeItem>) => {
    bridgeArr.forEach((bridge) => {
      const node = generateNodeFromBridgeData(bridge)
      const targetNodes = node.type === FlowNodeType.Input ? sourceNodes : sinkNodes
      targetNodes.push(node)
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

  const isRemovedBridge = (node: Node) =>
    isBridgerNode(node) && Object.keys(node.data?.formData || {}).length < 3

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
    // create bridge node first because this can get bridge data and set to form data,
    // then remove duplicated node will remove the node without form data which from rule SQL
    generateNodesFromBridgeData(bridgeList)
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
