import getIcon from '@/assets/topologyIcon/index'
import {
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  RULE_INPUT_EVENT_PREFIX,
  RULE_TOPOLOGY_ID,
} from '@/common/constants'
import { BridgeType, MQTTBridgeDirection, RuleOutput } from '@/types/enum'
import {
  BridgeItem,
  OutputItem,
  MQTTBridgeEgress,
  MQTTBridgeIngress,
  MQTTBridge,
} from '@/types/rule'
import {
  NodeItem,
  NodeType,
  OtherNodeType,
  RuleInputType,
  RuleOutputType,
  EdgeItem,
} from './topologyType'
import { escapeRegExp } from 'lodash'
import { useBridgeTypeOptions } from '../bridge/useBridgeTypeValue'

export const LABEL_FONT_SIZE = 14

export default (): {
  cutLabel: (label: string) => string
  addCursorPointerToNodeData: (node: NodeItem) => NodeItem
  judgeInputType: (from: string) => RuleInputType
  judgeOutputType: (output: OutputItem) => RuleOutputType
  createNodeId: (target: string, targetType: NodeType) => string
  createBridgeSingleDirectionNodeId: (id: string, direction: MQTTBridgeDirection) => string
  getBridgeTypeFromId: (str: string) => BridgeType
  getBridgeIDFromInputting: (inputting: string) => string
  getIconFromInputData: (input: string, type: RuleInputType) => SVGElement | undefined
  getIconFromOutputItem: (output: OutputItem) => SVGAElement | undefined
  getBridgeNodeLabel: (bridgeID: string) => string
  createSingleDirectionBridgeNode: (bridge: BridgeItem, direction: MQTTBridgeDirection) => NodeItem
  createBridgeNodeWithoutDirection: (bridge: BridgeItem) => NodeItem
  createTopicNodeAndEdgeForBridge: (bridge: BridgeItem) =>
    | {
        nodes: Array<NodeItem>
        edges: Array<EdgeItem>
      }
    | undefined
} => {
  /* 
    Node Id Format:
    bridge: {randomStr}-bridge-{id}
    bridge topic: {randomStr}-topic-{server}:{direction}:{name}
    event: {randomStr}-event-{name}
    rule: {randomStr}-rule-{id}
    rule topic: {randomStr}-topic-{name}

    Because except for these two, other identical nodes must be merged
    console:  {randomStr}-{type:console | republish}-{ruleID}
    republish: {randomStr}-{type:console | republish}-{ruleID}:{republish topic}
   */
  // When output is console or republish, nodes need to be created separately for each rule.

  const canvas = document.createElement('canvas')
  function getTextWidth(text: string): number {
    // re-use canvas object for better performance
    const context = canvas.getContext('2d')
    if (context) {
      context.font = `${LABEL_FONT_SIZE}px`
      const metrics = context.measureText(text)
      return Math.ceil(metrics.width)
    }
    return text.length * LABEL_FONT_SIZE
  }

  /**
   * When the characters are at their maximum, the current node width
   * can display the number of characters in the label completely.
   */
  const MIN_CHAR_COUNT = 10
  const LABEL_WIDTH = 100
  const getAptCharLength = (str: string) => {
    let pre = getTextWidth(str.slice(0, MIN_CHAR_COUNT))
    if (pre >= LABEL_WIDTH) {
      return MIN_CHAR_COUNT
    }
    for (let index = MIN_CHAR_COUNT + 1; index < str.length; index++) {
      const current = getTextWidth(str.slice(0, index))
      if (pre <= LABEL_WIDTH && current >= LABEL_WIDTH) {
        return index
      }
      pre = current
    }
    return str.length
  }

  const LABEL_TOO_LONG_SUFFIX = '...'

  const cutLabel = (label: string) => {
    const labelWith = getTextWidth(label)
    return labelWith > LABEL_WIDTH
      ? label.substring(0, getAptCharLength(label)) + LABEL_TOO_LONG_SUFFIX
      : label
  }

  const addCursorPointerToNodeData = (node: NodeItem): NodeItem => {
    return {
      ...node,
      labelCfg: {
        style: {
          cursor: 'pointer',
        },
      },
      style: {
        cursor: 'pointer',
      },
    }
  }

  const judgeInputType = (from: string): RuleInputType => {
    if (from.indexOf(RULE_INPUT_EVENT_PREFIX) > -1) {
      return OtherNodeType.Event
    }
    // now has mqtt & http
    const reg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
    if (reg.test(from)) {
      return OtherNodeType.Bridge
    }
    return OtherNodeType.Topic
  }

  const judgeOutputType = (output: OutputItem): RuleOutputType => {
    if (typeof output === 'string') {
      return OtherNodeType.Bridge
    }
    if (output.function === RuleOutput.Console) {
      return RuleOutput.Console
    }
    return RuleOutput.Republish
  }

  /**
   * Called when the type of node can be determined
   */
  const createNodeId = (target: string, targetType: NodeType) => {
    return `${RULE_TOPOLOGY_ID}-${targetType}-${target}`
  }

  const createBridgeSingleDirectionNodeId = (bridgeID: string, direction: MQTTBridgeDirection) => {
    return `${RULE_TOPOLOGY_ID}-${OtherNodeType.Bridge}-${bridgeID}-${direction}`
  }

  const getBridgeIDFromInputting = (inputting: string) =>
    inputting.replace(RULE_INPUT_BRIDGE_TYPE_PREFIX, '')

  const { getBridgeType } = useBridgeTypeOptions()
  const getBridgeTypeFromId = (id: string): BridgeType => {
    const type = id.slice(0, id.indexOf(':'))
    return getBridgeType(type)
  }

  const getBridgeIcon = (bridgeId: string) => {
    const iconKey = `bridge-${getBridgeTypeFromId(bridgeId)}`
    return getIcon(iconKey)
  }

  const createSingleDirectionBridgeNode = (bridge: BridgeItem, direction: MQTTBridgeDirection) => {
    const { id } = bridge
    const bridgeNodeId = createBridgeSingleDirectionNodeId(id, direction)
    // bridge node
    return addCursorPointerToNodeData({
      id: bridgeNodeId,
      label: cutLabel(getBridgeNodeLabel(id)),
      img: getBridgeIcon(id),
      _customData: { id, type: OtherNodeType.Bridge },
    })
  }

  const createBridgeNodeWithoutDirection = (bridge: BridgeItem) => {
    const { id } = bridge
    const iconKey = `bridge-${getBridgeTypeFromId(id)}`
    const bridgeNodeId = createNodeId(id, OtherNodeType.Bridge)
    // bridge node
    return addCursorPointerToNodeData({
      id: bridgeNodeId,
      label: cutLabel(getBridgeNodeLabel(id)),
      img: getIcon(iconKey),
      _customData: { id, type: OtherNodeType.Bridge },
    })
  }

  const getIconFromInputData = (input: string, type: RuleInputType): SVGElement | undefined => {
    if (type === OtherNodeType.Bridge) {
      return getBridgeIcon(input.slice(RULE_INPUT_BRIDGE_TYPE_PREFIX.length))
    }
    if (type === OtherNodeType.Event) {
      return getIcon('event')
    }
    return getIcon('topic')
  }

  const getIconFromOutputItem = (output: OutputItem) => {
    if (typeof output === 'string') {
      const key = `bridge-${getBridgeTypeFromId(output)}`
      return getIcon(key)
    } else {
      return output.function === RuleOutput.Console ? getIcon('console') : getIcon('republish')
    }
  }

  const createMQTTBridgeRemoteTopicAndEdge = (
    transConfig: MQTTBridgeEgress | MQTTBridgeIngress,
    server: string,
    direction: MQTTBridgeDirection,
    bridgeID: string,
  ) => {
    if (!transConfig || !transConfig.remote.topic) {
      return
    }
    const remoteTopic = transConfig.remote.topic
    const topicNodeId = `${server}:${direction}:${remoteTopic}`
    const isIngress = direction === MQTTBridgeDirection.In
    const bridgeNodeId = createBridgeSingleDirectionNodeId(bridgeID, direction)
    const edgeSource = isIngress ? topicNodeId : bridgeNodeId
    const edgeTarget = isIngress ? bridgeNodeId : topicNodeId
    return {
      node: {
        id: topicNodeId,
        label: cutLabel(remoteTopic),
        img: getIcon('topic'),
        _customData: {
          type: OtherNodeType.Topic,
          id: remoteTopic,
        },
      },
      edge: {
        source: edgeSource,
        target: edgeTarget,
        _customData: {
          source: edgeSource,
          target: edgeTarget,
        },
      },
    }
  }

  const createTopicNodeAndEdgeForBridge = (
    bridge: BridgeItem,
  ):
    | undefined
    | {
        nodes: Array<NodeItem>
        edges: Array<EdgeItem>
      } => {
    if (bridge.type !== BridgeType.MQTT) {
      return
    }
    const { ingress, egress, id: bridgeID, server } = bridge as MQTTBridge
    const { node: ingressTopic, edge: ingressTopicToBridgeEdge } =
      createMQTTBridgeRemoteTopicAndEdge(ingress, server, MQTTBridgeDirection.In, bridgeID) || {}
    const { node: egressTopic, edge: egressBridgeTOTopicEdge } =
      createMQTTBridgeRemoteTopicAndEdge(egress, server, MQTTBridgeDirection.Out, bridgeID) || {}
    const nodes: Array<NodeItem> = [ingressTopic, egressTopic].filter(
      (item) => item,
    ) as Array<NodeItem>
    const edges: Array<EdgeItem> = [ingressTopicToBridgeEdge, egressBridgeTOTopicEdge].filter(
      (item) => item,
    ) as Array<EdgeItem>
    return { nodes, edges }
  }

  const getBridgeNodeLabel = (bridgeID: string): string => bridgeID.slice(bridgeID.indexOf(':') + 1)

  return {
    cutLabel,
    addCursorPointerToNodeData,
    judgeInputType,
    judgeOutputType,
    createNodeId,
    createBridgeSingleDirectionNodeId,
    getBridgeIDFromInputting,
    getBridgeTypeFromId,
    getIconFromInputData,
    getIconFromOutputItem,
    getBridgeNodeLabel,
    createSingleDirectionBridgeNode,
    createBridgeNodeWithoutDirection,
    createTopicNodeAndEdgeForBridge,
  }
}
