import { numToFixed } from '@/common/tools'
import { NodeMsg } from '@/types/dashboard'
import { NodeStatus } from '@/types/enum'
import { ComputedRef, Ref, computed, onMounted, ref } from 'vue'

export interface FlowNodeData {
  type: 'core' | 'replicant'
  class: string
  id: string
  label: string
  position: { x: number; y: number }
  data: {
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

export const useCoreNode = (): {
  OUTER_SIDE_MULTIPLES: number
  INNER_SIDE_MULTIPLES: number
  coreNodeHeight: number
  coreNodeWidth: number
  svgHeight: number
  svgWidth: number
} => {
  const OUTER_SIDE_MULTIPLES = 2
  const INNER_SIDE_MULTIPLES = 1 + (OUTER_SIDE_MULTIPLES - 1) / 2

  const coreNodeHeight = 20
  const coreNodeWidth = numToFixed(coreNodeHeight * Math.cos(Math.PI / 6), 3)

  const svgHeight = coreNodeHeight * OUTER_SIDE_MULTIPLES
  const svgWidth = coreNodeWidth * OUTER_SIDE_MULTIPLES

  return {
    OUTER_SIDE_MULTIPLES,
    INNER_SIDE_MULTIPLES,
    coreNodeHeight,
    coreNodeWidth,
    svgHeight,
    svgWidth,
  }
}

export const useCoreNodeSize = (): {
  OUTER_SIDE_MULTIPLES: number
  INNER_SIDE_MULTIPLES: number
  coreNodeHeight: Ref<number>
  coreNodeWidth: Ref<number>
  SVGHeight: Ref<number>
  SVGWidth: Ref<number>
  setCoreNodeHeight: (height: number) => void
} => {
  const OUTER_SIDE_MULTIPLES = 2
  const INNER_SIDE_MULTIPLES = 1 + (OUTER_SIDE_MULTIPLES - 1) / 2

  const coreNodeHeight = ref(0)
  const coreNodeWidth = ref(0)

  const SVGHeight = ref(0)
  const SVGWidth = ref(0)

  const countCoreNodeWidth = () => {
    return numToFixed(coreNodeHeight.value * Math.cos(Math.PI / 6), 3)
  }

  const countSVGWidth = () => {
    return coreNodeWidth.value * OUTER_SIDE_MULTIPLES
  }

  const countSVGHeight = () => {
    return coreNodeHeight.value * OUTER_SIDE_MULTIPLES
  }

  // Height in non-active state (outer circle diameter)
  const setCoreNodeHeight = (height: number) => {
    coreNodeHeight.value = height
    coreNodeWidth.value = countCoreNodeWidth()
    SVGHeight.value = countSVGHeight()
    SVGWidth.value = countSVGWidth()
  }

  return {
    OUTER_SIDE_MULTIPLES,
    INNER_SIDE_MULTIPLES,
    coreNodeHeight,
    coreNodeWidth,
    SVGHeight,
    SVGWidth,
    setCoreNodeHeight,
  }
}

export default (
  props: Readonly<
    {
      modelValue?: unknown
      data?: unknown
    } & {
      nodes: Array<NodeMsg>
    } & {
      modelValue?: string | undefined
    }
  >,
): {
  BACKGROUND_CIRCLE_RADIUS: number
  BACKGROUND_CIRCLE_INNER_RADIUS: number
  BACKGROUND_CIRCLE_OUTER_RADIUS: number
  FlowInstance: Ref<any>
  showBackgroundCircle: ComputedRef<boolean>
  backgroundCirclePosition: Ref<{ x: number; y: number }>
  coreNodeHeight: Ref<number>
  countCoreNodeHeight: () => void
  generateFlowData: (nodes: Array<NodeMsg>) => Array<FlowDataItem>
} => {
  const BACKGROUND_CIRCLE_RADIUS = 55.5
  const BACKGROUND_CIRCLE_INNER_RADIUS = 79.5
  const BACKGROUND_CIRCLE_OUTER_RADIUS = 118.5

  const FlowInstance = ref()
  let flowEleWidth = 640
  let flowEleHeight = 243

  // Height in non-active state (outer circle diameter)
  const coreNodeHeight = ref(20)

  const {
    SVGHeight: coreNodeSVGHeight,
    SVGWidth: coreNodeSVGWidth,
    setCoreNodeHeight,
  } = useCoreNodeSize()

  const showBackgroundCircle = computed(() => props.nodes.some(({ role }) => role === 'replicant'))

  const backgroundCirclePosition = ref({ x: 200, y: 0 })
  const countBackgroundCirclePosition = () => {
    const el = FlowInstance.value.$el
    const { width, height } = el.getBoundingClientRect()
    flowEleWidth = numToFixed(width, 2)
    flowEleHeight = numToFixed(height, 2)
    backgroundCirclePosition.value = {
      x: numToFixed(width / 2 - BACKGROUND_CIRCLE_OUTER_RADIUS, 2),
      y: numToFixed(height / 2 - BACKGROUND_CIRCLE_OUTER_RADIUS, 2),
    }
  }

  const countCoreNodeHeight = () => {
    if (showBackgroundCircle.value) {
      coreNodeHeight.value = 20
    } else {
      const nodesLen = props.nodes.length
      if (nodesLen === 1) {
        coreNodeHeight.value = numToFixed(flowEleHeight / 2.8, 0)
      } else {
        coreNodeHeight.value = 24 + numToFixed(flowEleHeight / (nodesLen * 2), 3)
      }
    }
  }

  const getNodePosition = (nodeIndex: number, nodesNum: number): { x: number; y: number } => {
    const angleOffset = (Math.PI / 2) * nodesNum
    const angle = numToFixed(angleOffset + ((Math.PI * 2) / nodesNum) * nodeIndex, 2)
    const radius =
      (showBackgroundCircle.value ? BACKGROUND_CIRCLE_RADIUS : flowEleHeight / 2) -
      coreNodeHeight.value * Math.log10(nodesNum) * 1.5
    const x0 = flowEleWidth / 2
    const y0 = flowEleHeight / 2
    const xOffset = nodesNum === 1 ? 0 : radius * Math.cos(angle)
    const yOffset = nodesNum === 1 ? 0 : radius * Math.sin(angle)
    return {
      x: numToFixed(x0 + xOffset - coreNodeSVGWidth.value / 2, 2),
      y: numToFixed(y0 + yOffset - coreNodeSVGHeight.value / 2, 2),
    }
  }

  const generateFlowNodeData = (nodes: Array<NodeMsg>) =>
    nodes.map(({ node, node_status, role }, index) => ({
      type: role,
      class: `node-${role}`,
      id: node,
      label: node,
      data: {
        node_status,
      },
      position: getNodePosition(index, nodes.length),
    }))

  const generateFlowEdgeData = (nodes: Array<NodeMsg>) => {
    const ret = []
    for (let i = 0; i < nodes.length; i++) {
      const source = nodes[i].node
      for (let j = i + 1; j < nodes.length; j++) {
        const target = nodes[j].node
        ret.push({ id: `${source}-${target}`, source: source, target: target, type: 'straight' })
      }
    }
    return ret
  }

  const generateFlowData = (nodes: Array<NodeMsg>): Array<FlowDataItem> => {
    const flowNodeData = generateFlowNodeData(nodes)
    const flowEdgeData = generateFlowEdgeData(nodes)
    return [...flowNodeData, ...flowEdgeData]
  }

  onMounted(() => {
    countCoreNodeHeight()
    countBackgroundCirclePosition()
    setCoreNodeHeight(coreNodeHeight.value)
  })

  return {
    BACKGROUND_CIRCLE_RADIUS,
    BACKGROUND_CIRCLE_INNER_RADIUS,
    BACKGROUND_CIRCLE_OUTER_RADIUS,
    FlowInstance,
    showBackgroundCircle,
    backgroundCirclePosition,
    coreNodeHeight,
    countCoreNodeHeight,
    generateFlowData,
  }
}
