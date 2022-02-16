import { onMounted, ref, onUnmounted, Ref } from 'vue'
import { getRules, getBridgeList } from '@/api/ruleengine'
import G6, { Graph, ModelConfig, IGroup } from '@antv/g6'
import { MQTTBridgeDirection, RuleOutput } from '@/types/enum'
import iconMap from '@/assets/topologyIcon/index'
import { BridgeType } from '@/types/enum'
import { BridgeItem, MQTTOut, OutputItem, RuleItem } from '@/types/rule'

interface EdgeItem {
  source: string
  target: string
}
interface NodeItem {
  id: string
  label: string
  img: SVGElement
}

enum SomeType {
  Bridge = 'bridge',
  Event = 'event',
  Rule = 'rule',
  Topic = 'topic',
}
type RuleInputType = SomeType.Bridge | SomeType.Event | SomeType.Topic
type RuleOutputType = SomeType.Bridge | RuleOutput
type NodeType = SomeType | RuleOutput

/* 
  Node Id Format:
  bridge, event, rule, topic: {randomStr}-{type:bridge | event | rule | topic}-{id|name}]
  Because except for these two, other identical nodes must be merged
  console, republish: {randomStr}-{type:console | republish}-{ruleID}]
 */

const RANDOM = Math.random().toString().substring(2, 8)
const EVENT_INPUT_PREFIX = '$events/'

const judgeInputType = (from: string): RuleInputType => {
  if (from.indexOf(EVENT_INPUT_PREFIX) > -1) {
    return SomeType.Event
  }
  // now has mqtt & http
  const bridgeTypeList = [BridgeType.MQTT, BridgeType.HTTP]
  if (bridgeTypeList.some((item) => from.indexOf(item) > -1)) {
    return SomeType.Bridge
  }
  return SomeType.Topic
}

const judgeOutputType = (output: OutputItem): RuleOutputType => {
  if (typeof output === 'string') {
    return SomeType.Bridge
  }
  if (output.function === RuleOutput.Console) {
    return RuleOutput.Console
  }
  return RuleOutput.Republish
}

const createIdOfInputNode = (target: string) => {
  return `${RANDOM}-${judgeInputType(target)}-${target}`
}

// When output is console or republish, nodes need to be created separately for each rule.
const createIdOfOutputNode = (target: OutputItem, ruleId: string) => {
  const outputType = judgeOutputType(target)
  let ret = `${RANDOM}-${outputType}-`
  if (outputType === RuleOutput.Console || outputType === RuleOutput.Republish) {
    ret += ruleId
  } else {
    ret += target
  }
  return ret
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
        const idOfInputNode = createIdOfInputNode(from)
        input2RuleEdgeList.push({ source: idOfInputNode, target: v.id })
        inputNodeList.push({
          id: idOfInputNode,
          label: from,
          img: getIconFromInputData(from),
        })
      })
    } else {
      const idOfInputNode = createIdOfInputNode(v.from)
      input2RuleEdgeList.push({ source: idOfInputNode, target: v.id })
      inputNodeList.push({
        id: idOfInputNode,
        label: v.from,
        img: getIconFromInputData(v.from),
      })
    }

    /* outputNodeList & rule2OutputEdgeList */
    // When the outputs of multiple rules point to same bridge, they all point to the same bridge node.
    if (v.outputs instanceof Array) {
      v.outputs.forEach((output) => {
        const outputTarget = typeof output === 'object' ? output?.function || '' : output
        const toNode = createIdOfOutputNode(output, v.id)

        rule2OutputEdgeList.push({ source: v.id, target: toNode })
        outputNodeList.push({
          id: toNode,
          label: outputTarget,
          img: getIconFromOutputItem(output),
        })
      })
    } else {
      const outputTarget =
        typeof v.outputs === 'object' ? v.outputs.function || '' : v.outputs.toString()
      const toNode = createIdOfOutputNode(outputTarget, v.id)

      rule2OutputEdgeList.push({ source: v.id, target: toNode })
      outputNodeList.push({
        id: toNode,
        label: outputTarget,
        img: getIconFromOutputItem(v.outputs),
      })
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
    const topicNodeId = createIdOfInputNode(local_topic)
    const bridgeNodeId = createIdOfInputNode(id)

    topicNodeArr.push({
      id: topicNodeId,
      label: local_topic,
      img: iconMap.topic,
    })
    bridgeNodeArr.push({
      id: bridgeNodeId,
      label: id,
      img: iconMap[iconKey],
    })
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

  const getRequiredList = async () => {
    try {
      const [ruleList, bridgeList] = await Promise.all([getRules(), getBridgeList()])
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
        return { id: v.id, label: v.name || 'rule id:' + v.id, img: iconMap.rule }
      })
    } catch (error) {
      console.error(error)
    }
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
      linkCenter: true,
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
      minZoom: 0.5,
      maxZoom: 4,
      defaultNode: {
        size: [190, 50],
        type: 'custom-rect-with-icon',
        style: {
          fill: '#FFFFFF',
          stroke: '#e5e5e5',
          radius: 8,
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
