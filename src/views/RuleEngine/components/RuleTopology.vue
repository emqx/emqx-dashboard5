<template>
  <div class="app-wrapper">
    <div class="part-header">Overview</div>
    <div id="rule-topology" ref="topologyDiagramCanvasEle"></div>
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
import G6, { Graph } from '@antv/g6'

type Metrics = Record<string, number>
type OutputItem =
  | string
  | {
      function: string
      args?: {
        payload: string
        topic: string
      }
    }
interface RuleItem {
  created_at: string
  description: string
  enable: boolean
  from: Array<string>
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
}

const ruleList: Ref<Array<RuleItem>> = ref([])
/* Node */
const fromList: Ref<Array<NodeItem>> = ref([])
const toList: Ref<Array<NodeItem>> = ref([])
const rulesList: Ref<Array<NodeItem>> = ref([])
/* Edge */
const input2Rule: Ref<Array<EdgeItem>> = ref([])
const rule2output: Ref<Array<EdgeItem>> = ref([])

const RANDOM = Math.random().toString().substring(2, 8)

const topologyDiagramCanvasEle = ref()
let graphInstance: undefined | Graph = undefined

const getRequiredList = async () => {
  const result = await Promise.all([getRules(), getBridgeList()]).catch(() => {})
  if (result) {
    ruleList.value = result[0]
    ruleList.value.forEach((v) => {
      if (v.from instanceof Array) {
        v.from.forEach((from) => {
          const fromNode = '__from__' + RANDOM + ':' + from
          input2Rule.value.push({ source: fromNode, target: v.id })
          fromList.value.push({ id: fromNode, label: from })
        })
      } else {
        const fromNode = '__from__' + RANDOM + ':' + v.from
        input2Rule.value.push({ source: fromNode, target: v.id })
        fromList.value.push({ id: fromNode, label: v.from })
      }
    })

    ruleList.value.forEach((v) => {
      if (v.outputs instanceof Array) {
        v.outputs.forEach((output) => {
          const outputTarget = typeof output === 'object' ? output?.function || '' : output
          const toNode = '__to__' + RANDOM + ':' + outputTarget

          rule2output.value.push({ source: v.id, target: toNode })
          toList.value.push({ id: toNode, label: outputTarget })
        })
      } else {
        const outputTarget =
          typeof v.outputs === 'object' ? v.outputs.function || '' : v.outputs.toString()
        const toNode = '__to__' + RANDOM + ':' + outputTarget

        rule2output.value.push({ source: v.id, target: toNode })
        toList.value.push({ id: toNode, label: outputTarget })
      }
    })

    rulesList.value = ruleList.value.map((v) => {
      return { id: v.id, label: v.name || 'rule id:' + v.id }
    })
  }
}

type CloneObjArr = <T>(arr: Array<T>) => Array<T>
const cloneObjArr: CloneObjArr = (arr) => [...arr.map((item) => ({ ...item }))]

const initialG6 = () => {
  const container = topologyDiagramCanvasEle.value
  const width = container.scrollWidth
  const height = 500

  const data = {
    nodes: [
      ...cloneObjArr(fromList.value),
      ...cloneObjArr(rulesList.value),
      ...cloneObjArr(toList.value),
    ],
    edges: [...cloneObjArr(input2Rule.value), ...cloneObjArr(rule2output.value)],
  }

  data.nodes = data.nodes.filter((v, i, a) => a.findIndex((vi) => v.id === vi.id) === i)

  // console.log(data);

  graphInstance = new G6.Graph({
    container: 'rule-topology',
    width,
    height,
    linkCenter: true,
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      align: 'DL',
      nodesepFunc: () => 1,
      ranksepFunc: () => 1,
    },
    defaultNode: {
      size: [190, 50],
      type: 'rect',
      style: {
        fill: '#FFFFFF',
        stroke: '#00b299',
      },
    },
    defaultEdge: {
      style: {
        stroke: '#b5b5b5',
        lineAppendWidth: 3,
      },
    },
  })

  graphInstance.data({ id: RANDOM, ...data })
  graphInstance.render()
}

onMounted(async () => {
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
</style>
