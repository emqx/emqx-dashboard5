import { getBridgeList as queryBridgeList } from '@/api/ruleengine'
import { MQTTBridgeDirection } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { EdgeItem, NodeItem } from './topologyType'
import useUtilsForTopology from './useUtilsForTopology'

export default (): {
  getData: () => Promise<{
    nodeData: {
      bridge: Array<NodeItem>
      topic: Array<NodeItem>
    }
    edgeList: Array<EdgeItem>
  }>
  getBridgeList: () => BridgeItem[]
} => {
  let bridgeList: Array<BridgeItem> = []

  const {
    createSingleDirectionBridgeNode,
    createBridgeNodeWithoutDirection,
    createTopicNodeAndEdgeForBridge,
  } = useUtilsForTopology()

  const createBridgeNodes = (bridge: BridgeItem): Array<NodeItem> => {
    const ret = []
    if (!('ingress' in bridge) && !('egress' in bridge)) {
      ret.push(createBridgeNodeWithoutDirection(bridge))
    } else {
      if ('ingress' in bridge) {
        ret.push(createSingleDirectionBridgeNode(bridge, MQTTBridgeDirection.In))
      }
      if ('egress' in bridge) {
        ret.push(createSingleDirectionBridgeNode(bridge, MQTTBridgeDirection.Out))
      }
    }
    return ret
  }

  const createBridgeNTopicEle = (
    bridgeArr: Array<BridgeItem>,
  ): {
    topicNodeArr: Array<NodeItem>
    bridgeNodeArr: Array<NodeItem>
    topic2BridgeEdgeArr: Array<EdgeItem>
  } => {
    const topicNodeArr: Array<NodeItem> = []
    const bridgeNodeArr: Array<NodeItem> = []
    const topic2BridgeEdgeArr: Array<EdgeItem> = []

    bridgeArr.forEach((bridgeItem) => {
      // bridge node
      bridgeNodeArr.push(...createBridgeNodes(bridgeItem))
      const topicNodeAndEdgeData = createTopicNodeAndEdgeForBridge(bridgeItem)
      if (topicNodeAndEdgeData) {
        const { nodes, edges } = topicNodeAndEdgeData
        topicNodeArr.push(...nodes)
        topic2BridgeEdgeArr.push(...edges)
      }
    })
    return {
      topicNodeArr,
      bridgeNodeArr,
      topic2BridgeEdgeArr,
    }
  }

  const getData = async (): Promise<{
    nodeData: {
      bridge: Array<NodeItem>
      topic: Array<NodeItem>
    }
    edgeList: Array<EdgeItem>
  }> => {
    try {
      bridgeList = await queryBridgeList()
      const { topicNodeArr, bridgeNodeArr, topic2BridgeEdgeArr } = createBridgeNTopicEle(bridgeList)
      const nodeData = {
        bridge: bridgeNodeArr,
        topic: topicNodeArr,
      }
      const edgeList = topic2BridgeEdgeArr
      return Promise.resolve({ nodeData, edgeList })
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const getBridgeList = () => bridgeList

  return {
    getData,
    getBridgeList,
  }
}
