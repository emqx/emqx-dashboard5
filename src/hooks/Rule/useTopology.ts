import { onMounted, ref, onUnmounted, Ref } from 'vue'
import { getRules, getBridgeList } from '@/api/ruleengine'
import G6, { Graph, ModelConfig, IGroup } from '@antv/g6'
import { MQTTBridgeDirection, RuleOutput } from '@/types/enum'
import iconMap from '@/assets/topologyIcon/index'
import { BridgeType } from '@/types/enum'
import { BridgeItem, FromData, MQTTOut, OutputItem, RuleItem } from '@/types/rule'
import useTopologyNodeTooltip from './useTopologyNodeTooltipNEvent'
import { NodeType, OtherNodeType, RuleInputType, RuleOutputType } from './topologyType'

interface EdgeItem {
  source: string
  target: string
}
interface NodeItem {
  id: string
  label: string
  img: SVGElement
  style?: {
    cursor: 'pointer'
  }
  labelCfg?: {
    style?: {
      cursor: 'pointer'
    }
  }
}

/* 
  Node Id Format:
  bridge, event, rule, topic: {randomStr}-{type:bridge | event | rule | topic}-{id|name}]
  Because except for these two, other identical nodes must be merged
  console, republish: {randomStr}-{type:console | republish}-{ruleID}]
 */
// When output is console or republish, nodes need to be created separately for each rule.

const RANDOM = Math.random().toString().substring(2, 8)
const EVENT_INPUT_PREFIX = '$events/'
const LABEL_MAX_LENGTH_TO_SHOW = 28
const LABEL_TOO_LONG_SUFFIX = '...'

const cutLabel = (label: string) => {
  return label.length > 28
    ? label.substring(0, LABEL_MAX_LENGTH_TO_SHOW - LABEL_TOO_LONG_SUFFIX.length) +
        LABEL_TOO_LONG_SUFFIX
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
  if (from.indexOf(EVENT_INPUT_PREFIX) > -1) {
    return OtherNodeType.Event
  }
  // now has mqtt & http
  const bridgeTypeList = [BridgeType.MQTT, BridgeType.HTTP]
  if (bridgeTypeList.some((item) => from.indexOf(item) > -1)) {
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
  return `${RANDOM}-${targetType}-${target}`
}

const createIdOfRuleNode = (ruleId: string) => {
  return `${RANDOM}-${OtherNodeType.Rule}-${ruleId}`
}

const getBridgeTypeFromString = (str: string): BridgeType => {
  // now has mqtt & http
  const bridgeTypeList = [BridgeType.MQTT, BridgeType.HTTP]
  return bridgeTypeList.find((item) => str.indexOf(item) > -1) || BridgeType.MQTT
}

const getIconFromInputData = (input: string): SVGElement => {
  if (input.indexOf(BridgeType.MQTT) > -1) {
    return iconMap['bridge-mqtt']
  }
  if (input.indexOf('$events') > -1) {
    return iconMap.event
  }
  return iconMap.topic
}

const getIconFromOutputItem = (output: OutputItem) => {
  if (typeof output === 'string') {
    const key = `bridge-${getBridgeTypeFromString(output)}`
    return iconMap[key]
  } else {
    return output.function === RuleOutput.Console ? iconMap.console : iconMap.republish
  }
}

type CloneObjArr = <T>(arr: Array<T>) => Array<T>
const cloneObjArr: CloneObjArr = (arr) => [...arr.map((item) => ({ ...item }))]

const createInputNodeNInput2RuleEdge = (
  fromData: string,
  ruleID: string,
): { node: NodeItem; edge: EdgeItem } => {
  const inputType = judgeInputType(fromData)
  const idOfInputNode = createNodeId(fromData, inputType)
  let node = {
    id: idOfInputNode,
    label: cutLabel(fromData),
    img: getIconFromInputData(fromData),
  }
  if (inputType === OtherNodeType.Bridge) {
    node = addCursorPointerToNodeData(node)
  }
  return {
    node,
    edge: { source: idOfInputNode, target: createIdOfRuleNode(ruleID) },
  }
}

const createOutputNodeNRule2OutputEdge = (
  outputData: OutputItem,
  ruleID: string,
): { node: NodeItem; edge: EdgeItem } => {
  const outputType = judgeOutputType(outputData)
  const isConsoleOrRepublish =
    outputType === RuleOutput.Console || outputType === RuleOutput.Republish
  // When output is console or republish, nodes need to be created separately for each rule.
  const target = isConsoleOrRepublish ? ruleID : outputData
  const outputNodeLabel = typeof outputData === 'object' ? outputData?.function || '' : outputData
  const toNode = createNodeId(target as string, outputType)
  let node: NodeItem = {
    id: toNode,
    label: cutLabel(outputNodeLabel),
    img: getIconFromOutputItem(outputData),
  }
  if (outputType === OtherNodeType.Bridge) {
    node = addCursorPointerToNodeData(node)
  }
  return {
    node,
    edge: { source: createIdOfRuleNode(ruleID), target: toNode },
  }
}

const createNodeNEdgeExceptRuleNode = (
  ruleArr: Array<RuleItem>,
): {
  inputNodeList: Array<NodeItem>
  outputNodeList: Array<NodeItem>
  input2RuleEdgeList: Array<EdgeItem>
  rule2OutputEdgeList: Array<EdgeItem>
} => {
  const inputNodeList: Array<NodeItem> = []
  const outputNodeList: Array<NodeItem> = []
  const input2RuleEdgeList: Array<EdgeItem> = []
  const rule2OutputEdgeList: Array<EdgeItem> = []
  ruleArr.forEach((v) => {
    /* inputNodeList & input2RuleEdgeList */
    if (v.from instanceof Array) {
      v.from.forEach((from) => {
        const { node, edge } = createInputNodeNInput2RuleEdge(from, v.id)
        input2RuleEdgeList.push(edge)
        inputNodeList.push(node)
      })
    } else {
      const { node, edge } = createInputNodeNInput2RuleEdge(v.from, v.id)
      input2RuleEdgeList.push(edge)
      inputNodeList.push(node)
    }

    /* outputNodeList & rule2OutputEdgeList */
    // When the outputs of multiple rules point to same bridge, they all point to the same bridge node.
    if (v.outputs instanceof Array) {
      v.outputs.forEach((output) => {
        const { node, edge } = createOutputNodeNRule2OutputEdge(output, v.id)
        rule2OutputEdgeList.push(edge)
        outputNodeList.push(node)
      })
    } else {
      const { node, edge } = createOutputNodeNRule2OutputEdge(v.outputs, v.id)
      rule2OutputEdgeList.push(edge)
      outputNodeList.push(node)
    }
  })

  return {
    inputNodeList,
    outputNodeList,
    input2RuleEdgeList,
    rule2OutputEdgeList,
  }
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
    const { id, local_topic } = bridgeItem
    const iconKey = `bridge-${getBridgeTypeFromString(id)}`
    const topicNodeId = createNodeId(local_topic, OtherNodeType.Topic)
    const bridgeNodeId = createNodeId(id, OtherNodeType.Bridge)

    topicNodeArr.push({
      id: topicNodeId,
      label: cutLabel(local_topic),
      img: iconMap.topic,
    })
    bridgeNodeArr.push(
      addCursorPointerToNodeData({
        id: bridgeNodeId,
        label: cutLabel(id),
        img: iconMap[iconKey],
      }),
    )
    if (
      id.indexOf(BridgeType.MQTT) > -1 &&
      (bridgeItem as MQTTOut).direction === MQTTBridgeDirection.Out
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

const registerCustomNode = () => {
  G6.registerNode(
    'custom-rect-with-icon',
    {
      afterDraw(config?: ModelConfig, group?: IGroup) {
        if (!config || !group) {
          return
        }
        let rectWidth = 0
        let rectHeight = 0
        const iconWidth = 16
        const iconHeight = 16
        if (Array.isArray(config.size)) {
          ;[rectWidth, rectHeight] = config.size
        } else if (typeof config.size === 'number') {
          rectWidth = config.size
          rectHeight = config.size
        }

        const image = group.addShape('image', {
          attrs: {
            x: -rectWidth / 2 + 16,
            y: -iconHeight / 2,
            width: iconWidth,
            height: iconHeight,
            img: config.img,
          },
          name: 'image-shape',
        })
      },
    },
    'rect',
  )
}

// const toolbar = new G6.ToolBar()

export default () => {
  /* 
    simple desc
    1. topic/event/bridge -> rule -> console/republish/bridge(multi)
    2. topic -> bridge(mqtt-in & other bridge)
    3. bridge -> topic(mqtt-out)
   */

  /* case 1 */
  /* Node */
  const inputList: Ref<Array<NodeItem>> = ref([])
  const outputList: Ref<Array<NodeItem>> = ref([])
  const ruleNodeList: Ref<Array<NodeItem>> = ref([])
  /* Edge */
  const input2Rule: Ref<Array<EdgeItem>> = ref([])
  const rule2output: Ref<Array<EdgeItem>> = ref([])

  /* case 2 & 3 */
  const topicNodeList: Ref<Array<NodeItem>> = ref([])
  const bridgeNodeList: Ref<Array<NodeItem>> = ref([])
  // and bridge to topic
  const topic2BridgeEdgeList: Ref<Array<EdgeItem>> = ref([])

  const topologyDiagramCanvasEle = ref()
  let graphInstance: undefined | Graph = undefined
  const { setRuleList, setBridgeList, createNodeTooltip, handleNodeClickEvent } =
    useTopologyNodeTooltip(RANDOM)

  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent: createNodeTooltip,
    itemTypes: ['node'],
    fixToNode: [0.8, 0.5],
  })

  const getRequiredList = async () => {
    try {
      const [ruleList, bridgeList] = await Promise.all([getRules(), getBridgeList()])

      setRuleList(ruleList)
      setBridgeList(bridgeList)

      const { inputNodeList, outputNodeList, input2RuleEdgeList, rule2OutputEdgeList } =
        createNodeNEdgeExceptRuleNode(ruleList)
      inputList.value = inputNodeList
      outputList.value = outputNodeList
      input2Rule.value = input2RuleEdgeList
      rule2output.value = rule2OutputEdgeList

      const { topicNodeArr, bridgeNodeArr, topic2BridgeEdgeArr } = createBridgeNTopicEle(bridgeList)
      topicNodeList.value = topicNodeArr
      bridgeNodeList.value = bridgeNodeArr
      topic2BridgeEdgeList.value = topic2BridgeEdgeArr

      ruleNodeList.value = ruleList.map((v: RuleItem) => {
        return {
          id: createIdOfRuleNode(v.id),
          label: cutLabel(v.name || 'rule id:' + v.id),
          img: iconMap.rule,
          style: {
            cursor: 'pointer',
          },
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const bindClickNodeEvent = () => {
    graphInstance?.on('node:click', handleNodeClickEvent)
  }

  const initialG6 = () => {
    const container = topologyDiagramCanvasEle.value
    const width = container.scrollWidth
    const height = 700

    const data = {
      nodes: [
        ...cloneObjArr(inputList.value),
        ...cloneObjArr(ruleNodeList.value),
        ...cloneObjArr(outputList.value),
        ...cloneObjArr(topicNodeList.value),
        ...cloneObjArr(bridgeNodeList.value),
      ],
      edges: [
        ...cloneObjArr(input2Rule.value),
        ...cloneObjArr(rule2output.value),
        ...cloneObjArr(topic2BridgeEdgeList.value),
      ],
    }

    data.nodes = data.nodes.filter((v, i, a) => a.findIndex((vi) => v.id === vi.id) === i)

    graphInstance = new G6.Graph({
      container,
      width,
      height,
      fitView: true,
      fitViewPadding: [32, 24, 32, 24],
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'DL',
        nodesepFunc: () => 1,
        ranksepFunc: () => 1,
      },
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'dice-mindmap'],
      },
      plugins: [tooltip],
      minZoom: 0.5,
      maxZoom: 4,
      defaultNode: {
        size: [268, 50],
        type: 'custom-rect-with-icon',
        style: {
          fill: '#FFFFFF',
          stroke: '#e5e5e5',
          radius: 8,
        },
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
        labelCfg: {
          style: {
            fontSize: 14,
          },
        },
      },
      defaultEdge: {
        style: {
          stroke: '#b5b5b5',
          lineAppendWidth: 3,
          // endArrow: {
          //   path: G6.Arrow.triangle(10, 20, 55),
          //   d: 25,
          // },
        },
      },
    })

    bindClickNodeEvent()

    graphInstance.data({ id: RANDOM, ...data })
    graphInstance.render()
  }

  onMounted(async () => {
    registerCustomNode()
    await getRequiredList()
    initialG6()
  })

  onUnmounted(() => {
    graphInstance?.destroy && graphInstance.destroy()
  })

  return { topologyDiagramCanvasEle }
}
