import { getBridgeInfo, getRuleInfo } from '@/api/ruleengine'
import { BridgeItem, RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import { unionBy } from 'lodash'
import { Ref, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import useFlowNode, { FlowNodeType, NodeType } from './useFlowNode'
import useFlowUtils, { GroupedNode } from './useFlowUtils'

export default () => {
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

  const {
    generateFlowDataFromRuleItem,
    generateNodeFromBridgeData,
    countNodesPosition,
    isRemovedBridge,
  } = useFlowUtils()
  const { isBridgerNode } = useFlowNode()
  const getFlowData = async () => {
    if (!ruleData.value) {
      return
    }
    const ruleFlowData = generateFlowDataFromRuleItem(ruleData.value)
    const { nodes, edges } = ruleFlowData
    const sourceAndSinkNodes = [...nodes[NodeType.Source], ...nodes[NodeType.Sink]]
    const bridgeRequestArr = await Promise.allSettled(
      sourceAndSinkNodes
        .filter((item) => isBridgerNode(item))
        .map(({ id: nodeId }) => {
          const bridgeId = nodeId.split('-')[1]
          return getBridgeInfo(bridgeId)
        }),
    )
    const bridgeArr = bridgeRequestArr.reduce((arr: Array<BridgeItem>, item) => {
      if (item.status === 'fulfilled') {
        arr.push(item.value)
      }
      return arr
    }, [])
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
      ...Object.entries(nodes).reduce((arr: Array<Node>, [key, value]) => {
        if (Number(key) === NodeType.Source || Number(key) === NodeType.Sink) {
          value.forEach((item) => {
            if (isRemovedBridge(item)) {
              item.class = (item.class || '') + ' is-disabled'
            }
          })
        }
        return [...arr, ...value]
      }, []),
      ...edges,
    ]
  }

  const getData = async () => {
    try {
      await getRuleData()
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
    getData,
  }
}
