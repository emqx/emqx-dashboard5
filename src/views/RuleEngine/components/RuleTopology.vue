<template>
  <div class="app-wrapper">
    <div class="part-header">Overview</div>
    <div class="topology-wrap">
      <div id="rule-topology" ref="topologyDiagramCanvasEle"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleTopology',
})
</script>

<script lang="ts" setup>
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
  img: string
}

const ruleDataList: Ref<Array<RuleItem>> = ref([])
/* Node */
const fromList: Ref<Array<NodeItem>> = ref([])
const toList: Ref<Array<NodeItem>> = ref([])
const ruleNodeList: Ref<Array<NodeItem>> = ref([])
/* Edge */
const input2Rule: Ref<Array<EdgeItem>> = ref([])
const rule2output: Ref<Array<EdgeItem>> = ref([])

const RANDOM = Math.random().toString().substring(2, 8)

const topologyDiagramCanvasEle = ref()
let graphInstance: undefined | Graph = undefined

const createIdOfFromNode = (target: string) => `__from__${RANDOM}:${target}`
// When output is console or republish, nodes need to be created separately for each rule.
const createIdOfToNode = (target: string, ruleId?: string) =>
  `__to__${RANDOM}:${target}${ruleId ? `-${ruleId}` : ''}`
const isOutputConsoleOrRepub = (output: string | OutputItem) => {
  return (
    typeof output === 'object' &&
    (output.function === RuleOutput.Console || output.function === RuleOutput.Republish)
  )
}
const getBridgeTypeFromString = (str: string): BridgeType => {
  // now has mqtt & http
  const bridgeTypeList = [BridgeType.MQTT, BridgeType.HTTP]
  return bridgeTypeList.find((item) => str.indexOf(item) > -1) || BridgeType.MQTT
}
/**
 * get icon from from-data
 */
const getIconFromFromData = (from: string): string => {
  if (from.indexOf(BridgeType.MQTT) > -1) {
    return iconMap['bridge-mqtt']
  }
  if (from.indexOf('$events') > -1) {
    return iconMap.event
  }
  return iconMap.topic
}
const getIconFromOutputItem = (output: OutputItem) => {
  if (typeof output === 'string') {
    return iconMap[`bridge-${getBridgeTypeFromString(output)}`]
  } else {
    return output.function === RuleOutput.Console ? iconMap.console : iconMap.republish
  }
}

const getRequiredList = async () => {
  const result = await Promise.all([getRules(), getBridgeList()]).catch(() => {})
  if (result) {
    ruleDataList.value = result[0]
    ruleDataList.value.forEach((v) => {
      if (v.from instanceof Array) {
        v.from.forEach((from) => {
          const fromNode = createIdOfFromNode(from)
          input2Rule.value.push({ source: fromNode, target: v.id })
          fromList.value.push({ id: fromNode, label: from, img: getIconFromFromData(from) })
        })
      } else {
        const fromNode = createIdOfFromNode(v.from)
        input2Rule.value.push({ source: fromNode, target: v.id })
        fromList.value.push({ id: fromNode, label: v.from, img: getIconFromFromData(v.from) })
      }
    })

    ruleDataList.value.forEach((v) => {
      // When the outputs of multiple rules point to same bridge, they all point to the same bridge node.
      if (v.outputs instanceof Array) {
        v.outputs.forEach((output) => {
          const outputTarget = typeof output === 'object' ? output?.function || '' : output
          const toNode = isOutputConsoleOrRepub(output)
            ? createIdOfToNode(outputTarget, v.id)
            : createIdOfToNode(outputTarget)

          rule2output.value.push({ source: v.id, target: toNode })
          toList.value.push({ id: toNode, label: outputTarget, img: getIconFromOutputItem(output) })
        })
      } else {
        const outputTarget =
          typeof v.outputs === 'object' ? v.outputs.function || '' : v.outputs.toString()
        const toNode = isOutputConsoleOrRepub(v.outputs)
          ? createIdOfToNode(outputTarget, v.id)
          : createIdOfToNode(outputTarget)

        rule2output.value.push({ source: v.id, target: toNode })
        toList.value.push({
          id: toNode,
          label: outputTarget,
          img: getIconFromOutputItem(v.outputs),
        })
      }
    })

    ruleNodeList.value = ruleDataList.value.map((v) => {
      return { id: v.id, label: v.name || 'rule id:' + v.id, img: iconMap.rule }
    })
  }
}

type CloneObjArr = <T>(arr: Array<T>) => Array<T>
const cloneObjArr: CloneObjArr = (arr) => [...arr.map((item) => ({ ...item }))]

const initialG6 = () => {
  const container = topologyDiagramCanvasEle.value
  const width = container.scrollWidth
  const height = 700

  const data = {
    nodes: [
      ...cloneObjArr(fromList.value),
      ...cloneObjArr(ruleNodeList.value),
      ...cloneObjArr(toList.value),
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

onMounted(async () => {
  registerCustomNode()
  await getRequiredList()
  initialG6()
})

onUnmounted(() => {
  graphInstance?.destroy && graphInstance.destroy()
})
</script>

<style lang="scss" scoped>
.part-header {
  margin-bottom: 30px;
}
.topology-wrap {
  border: 1px solid #ededed;
  background-color: #fafafa;
}
</style>
