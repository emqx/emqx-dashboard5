import { getRuleInfo, getBridgeInfo } from '@/api/ruleengine'
import { Edge, Node } from '@vue-flow/core'
import { Ref, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import useFlowUtils, { GroupedNode } from './useFlowUtils'
import { RuleItem } from '@/types/rule'
import useFlowNode, { FlowNodeType, NodeType } from './useFlowNode'
import { unionBy } from 'lodash'

export default () => {
  const route = useRoute()

  const isInfoLoading = ref(false)

  const flowId = computed(() => route.params.id?.toString())
  let ruleData: undefined | RuleItem = undefined
  // let bridgeInfoMap = {}
  const flowData: Ref<undefined | Array<Node | Edge>> = ref(undefined)

  const getRuleData = async () => {
    try {
      ruleData = await getRuleInfo(flowId.value)
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const { generateFlowDataFromRuleItem, generateNodeFromBridgeData, countNodesPosition } =
    useFlowUtils()
  const { isBridgerNode } = useFlowNode()
  const getFlowData = async () => {
    if (!ruleData) {
      return
    }
    const ruleFlowData = generateFlowDataFromRuleItem(ruleData)
    const { nodes, edges } = ruleFlowData
    const sourceAndSinkNodes = [...nodes[NodeType.Source], ...nodes[NodeType.Sink]]
    const bridgeArr = await Promise.allSettled(
      sourceAndSinkNodes
        .filter((item) => isBridgerNode(item))
        .map(({ id: nodeId }) => {
          const bridgeId = nodeId.split('-')[1]
          return getBridgeInfo(bridgeId)
        }),
    )
    bridgeArr.forEach((bridgeItem) => {
      if (!bridgeItem) {
        return
      }
      const node = generateNodeFromBridgeData(bridgeItem)
      const targetNodes =
        node.type === FlowNodeType.Input ? nodes[NodeType.Source] : nodes[NodeType.Sink]
      // Push the node containing bridge info data to the front of the array,
      // after deduplication, the node with info will be kept first
      targetNodes.unshift(node)
    })
    Object.entries(nodes).forEach(([key, value]) => {
      nodes[key as keyof GroupedNode] = unionBy(value, 'id')
    })
    countNodesPosition(nodes)
    flowData.value = [
      ...Object.entries(nodes).reduce((arr: Array<Node>, [, value]) => [...arr, ...value], []),
      ...edges,
    ]
  }

  const initData = async () => {
    try {
      isInfoLoading.value = true
      await getRuleData()
      await getFlowData()
    } catch (error) {
      //
    } finally {
      isInfoLoading.value = false
    }
  }

  if (flowId.value) {
    initData()
  }

  return {
    isInfoLoading,
    flowId,
    flowData,
  }
}
