import { onMounted, ref, onUnmounted, Ref, computed, ComputedRef } from 'vue'
import G6, { Graph, ModelConfig, IGroup } from '@antv/g6'
import { NodeItem, EdgeItem } from './topologyType'
import useTopologyNodeTooltipNEvent from './useTopologyNodeTooltipNEvent'
import useTopologyRuleData from './useTopologyRuleData'
import useTopologyBridgeData from './useTopologyBridgeData'
import { cloneDeep } from 'lodash'
import { RULE_TOPOLOGY_ID } from '@/common/constants'
import useCSSVariables from '@/hooks/useCSSVariables'
import { BridgeItem, MQTTIn, MQTTOut } from '@/types/rule'
import { BridgeType, MQTTBridgeDirection } from '@/types/enum'

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
        const iconWidth = 16
        const iconHeight = 16
        if (Array.isArray(config.size)) {
          ;[rectWidth] = config.size
        } else if (typeof config.size === 'number') {
          rectWidth = config.size
        }

        group.addShape('image', {
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

const bgColorVariableKey = '--color-bg-primary'
const textColorVariableKey = '--color-text-primary'

const getDefaultNodeConfig = (bgColor: string, textColor: string) => ({
  size: [268, 50],
  type: 'custom-rect-with-icon',
  style: {
    fill: bgColor,
    stroke: '#e5e5e5',
    radius: 8,
  },
  anchorPoints: [
    [0, 0.5],
    [1, 0.5],
  ],
  labelCfg: { style: { fontSize: 14, fill: textColor } },
})

const defaultEdgeConfig = {
  type: 'cubic-horizontal',
  style: { stroke: '#b5b5b5', lineAppendWidth: 3 },
}

// TODO:
// const toolbar = new G6.ToolBar()

export default (): {
  rulePageData: Ref<{
    page: number
    count: number
  }>
  isDataLoading: Ref<boolean>
  isNoData: ComputedRef<boolean>
  topologyDiagramCanvasEle: Ref<any>
  showOtherPageRuleData: (page: number) => void
} => {
  const { getCSSVariables } = useCSSVariables()
  const colorMap = getCSSVariables([bgColorVariableKey, textColorVariableKey])
  const defaultNodeConfig = getDefaultNodeConfig(
    colorMap[bgColorVariableKey],
    colorMap[textColorVariableKey],
  )

  const isDataLoading = ref(false)
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
  let canvasHeight = 580
  let graphInstance: undefined | Graph = undefined
  const { setRuleList, setBridgeList, createNodeTooltip, handleNodeClickEvent } =
    useTopologyNodeTooltipNEvent()
  const {
    getData: getRuleNodeNEdgeData,
    getRuleList,
    pageData: rulePageData,
    getOtherPageData: getRuleOtherPageData,
  } = useTopologyRuleData()
  const { getData: getBridgeNodeNEdgeData, getBridgeList } = useTopologyBridgeData()
  // for func handleRuleInputs
  let bridgeList: Array<BridgeItem> = []

  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent: createNodeTooltip,
    itemTypes: ['node'],
    fixToNode: [0.8, 0.5],
  })

  const isNoData = computed(() => {
    return [rulePartNodeData, bridgePartNodeData].every((obj) => {
      const nodes = obj.value
      return Object.keys(nodes).every(
        (key) => (nodes[key as keyof typeof nodes] as Array<NodeItem>).length === 0,
      )
    })
  })

  const getCanvasHeight = () => {
    canvasHeight = window.innerHeight - 200
  }

  const bindClickNodeEvent = () => {
    graphInstance?.on('node:click', handleNodeClickEvent)
  }

  const isMQTTSourceBridge = (bridgeID: string) => {
    const bridge = bridgeList.find(({ id }) => id === bridgeID)
    return (
      bridge &&
      bridge.type === BridgeType.MQTT &&
      (bridge as MQTTOut | MQTTIn).direction === MQTTBridgeDirection.In
    )
  }

  /**
   * When the input to the rule is mqtt source, modify the node connected to the rule node
   * before: mqtt-source bridge -> bridge topic & mqtt-source bridge -> rule
   * after: mqtt-source bridge -> bridge topic -> rule
   */
  const handleRuleInputs = () => {
    // node ID map
    const bridgeToRuleMap = new Map()
    const bridgeNodesNeedsBeHandle: Array<{ nodeID: string; bridgeID: string }> = []
    const neededInputToRuleEdge = rulePartEdgeData.value.input2Rule.filter(
      ({ _customData = {}, source, target }) => {
        const { source: bridgeID } = _customData
        if (!bridgeID) {
          return true
        }
        const ret = !isMQTTSourceBridge(bridgeID)
        if (!ret) {
          bridgeToRuleMap.set(source, target)
          bridgeNodesNeedsBeHandle.push({ nodeID: source, bridgeID })
        }
        return ret
      },
    )

    const topicToRuleEdges = bridgeNodesNeedsBeHandle.reduce(
      (arr: Array<EdgeItem>, { nodeID, bridgeID }) => {
        const topic = bridgePartEdgeData.value.find(({ _customData = {} }) => {
          const { source } = _customData
          return source === bridgeID
        })?.target
        if (!topic) {
          return arr
        }
        return [...arr, { source: topic, target: bridgeToRuleMap.get(nodeID) }]
      },
      [],
    )
    rulePartEdgeData.value.input2Rule = [...neededInputToRuleEdge, ...topicToRuleEdges]
  }

  const getRequiredList = async () => {
    try {
      isDataLoading.value = true
      const [ruleNodeNEdgeData, bridgeNodeNEdgeData] = await Promise.all([
        getRuleNodeNEdgeData(),
        getBridgeNodeNEdgeData(),
      ])
      rulePartNodeData.value = ruleNodeNEdgeData.nodeData
      rulePartEdgeData.value = ruleNodeNEdgeData.edgeData

      bridgePartNodeData.value = bridgeNodeNEdgeData.nodeData
      bridgePartEdgeData.value = bridgeNodeNEdgeData.edgeList

      bridgeList = getBridgeList()
      setRuleList(getRuleList())
      setBridgeList(bridgeList)

      handleRuleInputs()

      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    } finally {
      isDataLoading.value = false
    }
  }

  const getChartData = () => {
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
    return { id: RULE_TOPOLOGY_ID, ...data }
  }

  const showOtherPageRuleData = async (page: number) => {
    const { nodeData, edgeData } = await getRuleOtherPageData(page)
    rulePartNodeData.value = nodeData
    rulePartEdgeData.value = edgeData
    graphInstance?.changeData(getChartData())
    graphInstance?.refresh()
  }

  const setZoom = async () => {
    const zoom = graphInstance?.getZoom()

    if (zoom && zoom > 1.2) {
      graphInstance?.zoomTo(1.2)
      graphInstance?.fitCenter()
    }
  }

  const initialG6 = async () => {
    const container = topologyDiagramCanvasEle.value
    if (isNoData.value || !container) {
      return
    }
    const width = container.scrollWidth

    graphInstance = new G6.Graph({
      container,
      width,
      height: canvasHeight,
      fitView: true,
      fitCenter: true,
      fitViewPadding: [32, 24, 32, 24],
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'DL',
        nodesep: 28,
        ranksep: 56,
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
    graphInstance.data(getChartData())
    graphInstance.render()

    graphInstance.on('afterrender', () => {
      setZoom()
    })
  }

  onMounted(async () => {
    registerCustomNode()
    await getRequiredList()
    initialG6()
  })

  onUnmounted(() => {
    graphInstance?.destroy && graphInstance.destroy()
  })

  getCanvasHeight()

  return { rulePageData, isDataLoading, isNoData, topologyDiagramCanvasEle, showOtherPageRuleData }
}
