import { getBridgeList as queryBridgeList } from '@/api/ruleengine'
import { BridgeItem, MQTTOut } from '@/types/rule'
import { EdgeItem, NodeItem, OtherNodeType } from './topologyType'
import useUtilsForTopology from './useUtilsForTopology'
import iconMap from '@/assets/topologyIcon/index'
import { BridgeType, MQTTBridgeDirection } from '@/types/enum'

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
    cutLabel,
    addCursorPointerToNodeData,
    createNodeId,
    getBridgeTypeFromString,
    getBridgeNodeLabel,
  } = useUtilsForTopology()

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
      const { id, local_topic } = bridgeItem
      const iconKey = `bridge-${getBridgeTypeFromString(id)}`
      const topicNodeId = createNodeId(local_topic, OtherNodeType.Topic)
      const bridgeNodeId = createNodeId(id, OtherNodeType.Bridge)

      if (local_topic) {
        topicNodeArr.push({
          id: topicNodeId,
          label: cutLabel(local_topic),
          img: iconMap.topic,
        })
      }
      bridgeNodeArr.push(
        addCursorPointerToNodeData({
          id: bridgeNodeId,
          label: cutLabel(getBridgeNodeLabel(id)),
          img: iconMap[iconKey],
        }),
      )
      if (
        id.indexOf(BridgeType.MQTT) > -1 &&
        (bridgeItem as MQTTOut).direction === MQTTBridgeDirection.In
      ) {
        topic2BridgeEdgeArr.push({
          source: bridgeNodeId,
          target: topicNodeId,
        })
      } else {
        topic2BridgeEdgeArr.push({
          source: topicNodeId,
          target: bridgeNodeId,
        })
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
