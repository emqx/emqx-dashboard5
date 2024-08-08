import { numToFixed, waitAMoment } from '@/common/tools'
import { NodeInfo } from '@/types/dashboard'
import { NodeStatus } from '@/types/enum'
import { ComputedRef, Ref, computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export interface FlowNodeData {
  type: 'core' | 'replicant' | 'background'
  class?: string
  id: string
  label?: string
  position: { x: number; y: number }
  selectable?: boolean
  zIndex?: number
  data?: {
    node_status: NodeStatus
  }
}

export interface FlowEdgeData {
  id: string
  source: string
  target: string
  type: string
}

export type FlowDataItem = FlowNodeData | FlowEdgeData

export const useCoreNodeSize = (): {
  INNER_SIDE_MULTIPLES: number
  coreNodeHeight: Ref<number>
  coreNodeWidth: Ref<number>
  SVGHeight: Ref<number>
  SVGWidth: Ref<number>
  setCoreNodeHeight: (height: number) => void
} => {
  const INNER_SIDE_MULTIPLES = 1.5

  const coreNodeHeight = ref(0)
  const coreNodeWidth = ref(0)

  const SVGHeight = ref(0)
  const SVGWidth = ref(0)

  const countCoreNodeWidth = () => {
    return numToFixed(coreNodeHeight.value * Math.cos(Math.PI / 6), 3)
  }

  const countSVGWidth = () => {
    return coreNodeWidth.value * INNER_SIDE_MULTIPLES
  }

  const countSVGHeight = () => {
    return coreNodeHeight.value * INNER_SIDE_MULTIPLES
  }

  // Height in non-active state (outer circle diameter)
  const setCoreNodeHeight = (height: number) => {
    coreNodeHeight.value = height
    coreNodeWidth.value = countCoreNodeWidth()
    SVGHeight.value = countSVGHeight()
    SVGWidth.value = countSVGWidth()
  }

  return {
    INNER_SIDE_MULTIPLES,
    coreNodeHeight,
    coreNodeWidth,
    SVGHeight,
    SVGWidth,
    setCoreNodeHeight,
  }
}

export const BACKGROUND_CIRCLE_RADIUS = 37 * 1.28
export const BACKGROUND_CIRCLE_INNER_RADIUS = 53 * 1.28
export const BACKGROUND_CIRCLE_OUTER_RADIUS = 89 * 1.28
export const ACTIVE_RING_STROKE_WIDTH = 6

export const useRepCodeNodeSize = (): {
  nonactivatedRadius: number
  activatedInnerRadius: number
  activatedOuterRadius: number
} => {
  const ringWidth = BACKGROUND_CIRCLE_OUTER_RADIUS - BACKGROUND_CIRCLE_INNER_RADIUS
  const nonactivatedRadius = ringWidth / 5 / 2
  const activatedInnerRadius = ringWidth / 3 / 2
  const activatedOuterRadius = activatedInnerRadius * 2
  return {
    nonactivatedRadius,
    activatedInnerRadius,
    activatedOuterRadius,
  }
}

export const useBackgroundCircle = (): {
  SVGSideLength: number
} => {
  const SVGSideLength = (BACKGROUND_CIRCLE_OUTER_RADIUS + ACTIVE_RING_STROKE_WIDTH / 2) * 2
  return {
    SVGSideLength,
  }
}

export const MAX_DISPLAYED_REP_NODE = 20

export default (
  props: Readonly<
    {
      modelValue?: unknown
      data?: unknown
    } & {
      nodes: Array<NodeInfo>
    } & {
      modelValue?: string | undefined
    }
  >,
): {
  FlowInstance: Ref<any>
  showBackgroundCircle: ComputedRef<boolean>
  flowEleWidth: Ref<number>
  backgroundCirclePosition: Ref<{ x: number; y: number }>
  coreNodeHeight: Ref<number>
  countCoreNodeHeight: () => void
  generateFlowData: (nodes: Array<NodeInfo>) => Array<FlowDataItem>
} => {
  const { state } = useStore()

  const FlowInstance = ref()
  const flowEleWidth = ref(640)
  const flowEleHeight = ref(243)

  // Height in non-active state (outer circle diameter)
  const coreNodeHeight = ref(20)

  const {
    coreNodeHeight: coreNodeSVGHeight,
    coreNodeWidth: coreNodeSVGWidth,
    setCoreNodeHeight,
  } = useCoreNodeSize()

  const showBackgroundCircle = computed(() => props.nodes.some(({ role }) => role === 'replicant'))

  const backgroundCirclePosition = ref({ x: 200, y: 0 })
  const { SVGSideLength: backgroundSideLength } = useBackgroundCircle()
  const getFlowEleSize = () => {
    const el = FlowInstance.value.$el
    const { width, height } = el.getBoundingClientRect()
    flowEleWidth.value = numToFixed(width, 2)
    flowEleHeight.value = numToFixed(height, 2)
  }
  const countBackgroundCirclePosition = () => {
    backgroundCirclePosition.value = {
      x: numToFixed(flowEleWidth.value / 2 - backgroundSideLength / 2, 2),
      y: numToFixed(flowEleHeight.value / 2 - backgroundSideLength / 2, 2),
    }
  }

  const coreNodesNum = computed(() => props.nodes.filter(({ role }) => role !== 'replicant').length)
  const countCoreNodeHeight = () => {
    if (coreNodesNum.value === 1) {
      coreNodeHeight.value = numToFixed(
        showBackgroundCircle.value ? BACKGROUND_CIRCLE_RADIUS / 1.5 : flowEleHeight.value / 2.8,
        3,
      )
    } else {
      coreNodeHeight.value = showBackgroundCircle.value
        ? 10 + numToFixed(BACKGROUND_CIRCLE_RADIUS / (coreNodesNum.value * 2), 3)
        : 24 + numToFixed(flowEleHeight.value / (coreNodesNum.value * 2), 3)
    }
    setCoreNodeHeight(coreNodeHeight.value)
  }

  const { nonactivatedRadius: regNodeRadius } = useRepCodeNodeSize()
  const getNodePosition = (
    nodeIndex: number,
    nodesNum: number,
    nodeRole: 'core' | 'replicant',
  ): { x: number; y: number } => {
    const isCore = nodeRole !== 'replicant'
    const angleOffset = (Math.PI / 2) * nodesNum
    const angle = numToFixed(angleOffset + ((Math.PI * 2) / nodesNum) * nodeIndex, 2)
    let radius = 0
    if (isCore) {
      radius = numToFixed(
        (showBackgroundCircle.value ? BACKGROUND_CIRCLE_RADIUS * 0.84 : flowEleHeight.value / 2) -
          coreNodeHeight.value * Math.log10(nodesNum) * 1.5,
        3,
      )
    } else {
      radius = (BACKGROUND_CIRCLE_INNER_RADIUS + BACKGROUND_CIRCLE_OUTER_RADIUS) / 2
    }
    const x0 = flowEleWidth.value / 2
    let y0 = flowEleHeight.value / 2
    // If there is only one core node and the total number of nodes is 3,
    // move the center down a bit to achieve visual balance.
    if (!showBackgroundCircle.value && nodesNum === 3 && nodeRole === 'core') {
      y0 += (radius / 2) * Math.sin(Math.PI / 6)
    }
    const xOffset = isCore && nodesNum === 1 ? 0 : radius * Math.cos(angle)
    const yOffset = isCore && nodesNum === 1 ? 0 : radius * Math.sin(angle)
    const nodeWidth = isCore ? coreNodeSVGWidth.value : regNodeRadius * 2
    const nodeHeight = isCore ? coreNodeSVGHeight.value : regNodeRadius * 2
    return {
      x: numToFixed(x0 + xOffset - nodeWidth / 2, 2),
      y: numToFixed(y0 + yOffset - nodeHeight / 2, 2),
    }
  }

  const getCommonFlowNodeData = ({ node, node_status, role }: NodeInfo) => {
    const roleVal = role || 'core'
    return {
      type: roleVal,
      class: `node-${roleVal}`,
      id: node,
      label: node,
      data: { node_status },
    }
  }

  const generateFlowNodeData = (nodes: Array<NodeInfo>) => {
    const coreNodes: Array<NodeInfo> = []
    const repNodes: Array<NodeInfo> = []
    nodes.forEach((item) => (item.role !== 'replicant' ? coreNodes : repNodes).push(item))
    if (repNodes.length > MAX_DISPLAYED_REP_NODE) {
      repNodes.splice(20, repNodes.length - 20)
    }
    return coreNodes
      .map((item, index) => ({
        ...getCommonFlowNodeData(item),
        position: getNodePosition(index, coreNodes.length, item.role),
      }))
      .concat(
        repNodes.map((item, index) => ({
          ...getCommonFlowNodeData(item),
          position: getNodePosition(index, repNodes.length, item.role),
        })),
      )
  }

  const generateFlowEdgeData = (nodes: Array<NodeInfo>) => {
    const ret = []
    const coreNodes = nodes.filter(({ role }) => role !== 'replicant')
    for (let i = 0; i < coreNodes.length; i++) {
      const source = coreNodes[i].node
      for (let j = i + 1; j < coreNodes.length; j++) {
        const target = coreNodes[j].node
        ret.push({ id: `${source}-${target}`, source: source, target: target, type: 'straight' })
      }
    }
    return ret
  }

  const generateFlowData = (nodes: Array<NodeInfo>): Array<FlowDataItem> => {
    const flowNodeData = generateFlowNodeData(nodes)
    const flowEdgeData = generateFlowEdgeData(nodes)
    return [...flowNodeData, ...flowEdgeData]
  }

  const recountBgPosition = () => {
    getFlowEleSize()
    countBackgroundCirclePosition()
  }

  const addListener = () => {
    window.addEventListener('resize', recountBgPosition)
  }

  const removeListener = () => {
    window.removeEventListener('resize', recountBgPosition)
  }

  watch(
    () => state.leftBarCollapse,
    async () => {
      await waitAMoment(300)
      recountBgPosition()
    },
  )

  onUnmounted(() => {
    removeListener()
  })

  onMounted(() => {
    getFlowEleSize()
    countBackgroundCirclePosition()
    countCoreNodeHeight()
    setCoreNodeHeight(coreNodeHeight.value)
    addListener()
  })

  return {
    FlowInstance,
    flowEleWidth,
    showBackgroundCircle,
    backgroundCirclePosition,
    coreNodeHeight,
    countCoreNodeHeight,
    generateFlowData,
  }
}
