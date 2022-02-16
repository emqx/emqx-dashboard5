import { onMounted, ref, onUnmounted, Ref } from 'vue'
import { getRules, getBridgeList } from '@/api/ruleengine'
import G6, { Graph, ModelConfig, IGroup } from '@antv/g6'
import { RuleOutput } from '@/types/enum'
import iconMap from '@/assets/topologyIcon/index'
import { BridgeType } from '@/types/enum'

type Metrics = Record<string, number>
/**
 * is string when output is bridge
 * is obj when output is console or repub
 */
type OutputItem =
  | string
  | {
      function: string
      args?: {
        payload: string
        topic: string
      }
    }
type FromData = Array<string> | string
interface RuleItem {
  created_at: string
  description: string
  enable: boolean
  from: FromData
  id: string
  metrics: Metrics
  name: string
  node_metrics: Array<{
    node: string
    metrics: Metrics
  }>
  outputs: Array<OutputItem> | OutputItem
  sql: string
}
interface EdgeItem {
  source: string
  target: string
}
interface NodeItem {
  id: string
  label: string
  img: SVGElement
}

const RANDOM = Math.random().toString().substring(2, 8)
const createIdOfInputNode = (target: string) => `__from__${RANDOM}:${target}`
// When output is console or republish, nodes need to be created separately for each rule.
const createIdOfOutputNode = (target: string, ruleId?: string) =>
  `__to__${RANDOM}:${target}${ruleId ? `-${ruleId}` : ''}`
const isOutputConsoleOrRepub = (output: OutputItem) => {
  if (typeof output === 'object') {
    const isConsole = output.function === RuleOutput.Console
    const isRepublish = output.function === RuleOutput.Republish
    return isConsole || isRepublish
  }
  return false
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
        const toNode = isOutputConsoleOrRepub(output)
          ? createIdOfOutputNode(outputTarget, v.id)
          : createIdOfOutputNode(outputTarget)

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
      const toNode = isOutputConsoleOrRepub(v.outputs)
        ? createIdOfOutputNode(outputTarget, v.id)
        : createIdOfOutputNode(outputTarget)

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
  /* Node */
  const inputList: Ref<Array<NodeItem>> = ref([])
  const outputList: Ref<Array<NodeItem>> = ref([])
  const ruleNodeList: Ref<Array<NodeItem>> = ref([])
  /* Edge */
  const input2Rule: Ref<Array<EdgeItem>> = ref([])
  const rule2output: Ref<Array<EdgeItem>> = ref([])

  const topologyDiagramCanvasEle = ref()
  let graphInstance: undefined | Graph = undefined

  const getRequiredList = async () => {
    try {
      // TODO: bridgeList
      const [ruleList, bridgeList] = await Promise.all([getRules(), getBridgeList()])
      const { inputNodeList, outputNodeList, input2RuleEdgeList, rule2OutputEdgeList } =
        createNodeNEdgeExceptRuleNode(ruleList)
      inputList.value = inputNodeList
      outputList.value = outputNodeList
      input2Rule.value = input2RuleEdgeList
      rule2output.value = rule2OutputEdgeList

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
      ],
      edges: [...cloneObjArr(input2Rule.value), ...cloneObjArr(rule2output.value)],
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
