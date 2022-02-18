import { onMounted, ref, onUnmounted, Ref } from 'vue'
import G6, { Graph, ModelConfig, IGroup } from '@antv/g6'
import { NodeItem, EdgeItem } from './topologyType'
import useTopologyNodeTooltipNEvent from './useTopologyNodeTooltipNEvent'
import useTopologyRuleData from './useTopologyRuleData'
import useTopologyBridgeData from './useTopologyBridgeData'
import { cloneDeep } from 'lodash'
import { RULE_TOPOLOGY_ID } from '@/common/constants'

type DataList = Array<NodeItem> | Array<EdgeItem>
const concatNCloneInObj = (obj: Record<string, DataList>): DataList => {
  const keys = Object.keys(obj)
  const ret: DataList = []
  return keys.reduce((arr, key) => {
    return [...arr, ...cloneDeep(obj[key])] as DataList
  }, ret)
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

const defaultNodeConfig = {
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
  labelCfg: { style: { fontSize: 14 } },
}

const defaultEdgeConfig = {
  type: 'cubic-horizontal',
  style: { stroke: '#b5b5b5', lineAppendWidth: 3 },
}

// TODO:
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
  const rulePartNodeData: Ref<Record<'input' | 'rule' | 'output', Array<NodeItem>>> = ref({
    input: [],
    rule: [],
    output: [],
  })
  const rulePartEdgeData: Ref<Record<'input2Rule' | 'rule2Output', Array<EdgeItem>>> = ref({
    input2Rule: [],
    rule2Output: [],
  })

  /* case 2 & 3 */
  const bridgePartNodeData: Ref<Record<'bridge' | 'topic', Array<NodeItem>>> = ref({
    bridge: [],
    topic: [],
  })
  // topic to bridge and bridge to topic
  const bridgePartEdgeData: Ref<Array<EdgeItem>> = ref([])

  const topologyDiagramCanvasEle = ref()
  let graphInstance: undefined | Graph = undefined
  const { setRuleList, setBridgeList, createNodeTooltip, handleNodeClickEvent } =
    useTopologyNodeTooltipNEvent()
  const { getData: getRuleNodeNEdgeData, getRuleList } = useTopologyRuleData()
  const { getData: getBridgeNodeNEdgeData, getBridgeList } = useTopologyBridgeData()

  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent: createNodeTooltip,
    itemTypes: ['node'],
    fixToNode: [0.8, 0.5],
  })

  const bindClickNodeEvent = () => {
    graphInstance?.on('node:click', handleNodeClickEvent)
  }

  const getRequiredList = async () => {
    try {
      const [ruleNodeNEdgeData, bridgeNodeNEdgeData] = await Promise.all([
        getRuleNodeNEdgeData(),
        getBridgeNodeNEdgeData(),
      ])
      rulePartNodeData.value = ruleNodeNEdgeData.nodeData
      rulePartEdgeData.value = ruleNodeNEdgeData.edgeData

      bridgePartNodeData.value = bridgeNodeNEdgeData.nodeData
      bridgePartEdgeData.value = bridgeNodeNEdgeData.edgeList
      setRuleList(getRuleList())
      setBridgeList(getBridgeList())
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const initialG6 = () => {
    const container = topologyDiagramCanvasEle.value
    const width = container.scrollWidth
    const height = 700

    const data = {
      nodes: [
        ...concatNCloneInObj(rulePartNodeData.value),
        ...concatNCloneInObj(bridgePartNodeData.value),
      ],
      edges: [...concatNCloneInObj(rulePartEdgeData.value), ...cloneDeep(bridgePartEdgeData.value)],
    }

    data.nodes = data.nodes.filter(
      (v, i, a) => a.findIndex((vi) => (v as NodeItem).id === (vi as NodeItem).id) === i,
    )

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
        nodesep: 8,
        ranksep: 72,
      },
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'dice-mindmap'],
      },
      plugins: [tooltip],
      minZoom: 0.5,
      maxZoom: 4,
      defaultNode: defaultNodeConfig,
      defaultEdge: defaultEdgeConfig,
    })

    bindClickNodeEvent()
    graphInstance.data({ id: RULE_TOPOLOGY_ID, ...data })
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
