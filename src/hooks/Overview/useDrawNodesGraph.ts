import { onMounted, onUnmounted, ref, nextTick, Ref } from 'vue'
import { NodeMsg, NodeStatisticalData } from '@/types/dashboard'
import G6, { Graph } from '@antv/g6'
import { createRandomString, numToFixed } from '@/common/tools'

interface NodeDataItem {
  id: string
  x: number
  y: number
  type: string
  size?: Array<number>
}

interface EdgeItem {
  source: string
  target: string
}

const SQUARE_ROOT_3 = parseFloat(Math.pow(3, 1 / 2).toFixed(2))
const DEFAULT_SIDE_LENGTH = 20
const LARGER_SIDE_LENGTH = 32

const getPath = (cfg: any) => {
  const size = cfg.size || [DEFAULT_SIDE_LENGTH * SQUARE_ROOT_3, DEFAULT_SIDE_LENGTH * 2]
  const width = size[0]
  const height = size[1]
  //  / 1 \
  // 4     2
  // |     |
  // 5     3
  //  \ 4 /
  const path = [
    ['M', 0, height / 2],
    ['L', width / 2, height / 2 / 2],
    ['L', width / 2, -height / 2 / 2],
    ['L', 0, -height / 2],
    ['L', -width / 2, -height / 2 / 2],
    ['L', -width / 2, height / 2 / 2],
    ['Z'],
  ]
  return path
}

const registerCustomNode = () => {
  G6.registerNode('customNode', {
    draw(cfg, group): any {
      const keyShape = group?.addShape('path', {
        attrs: {
          path: getPath(cfg),
          fill: 'l(0) 0:#00B299 1:#45E3C9',
        },
        draggable: false,
        name: 'path-shape',
      })
      return keyShape
    },
    setState(name, value, node) {
      console.log({ name, value, node })
    },
  })
}

registerCustomNode()

export default (
  emit: (event: 'change', ...args: any[]) => void,
): {
  canvasEle: Ref<any>
  drawNodes: (data: { nodes: Array<NodeMsg>; stats: Array<NodeStatisticalData> }) => Promise<void>
} => {
  const canvasEle = ref()
  let canvasWidth = 300
  let canvasHeight = 300

  let lastRenderData: undefined | { nodes: Array<NodeMsg>; stats: Array<NodeStatisticalData> } =
    undefined

  const handleWindowResize = async () => {
    destroyCanvas()
    await nextTick()
    getCanvasSize()
    initCanvas()
    if (lastRenderData) {
      drawNodes(lastRenderData)
    }
  }

  const getCanvasSize = () => {
    const el = canvasEle.value
    if (el) {
      canvasWidth = el.offsetWidth
      canvasHeight = el.offsetHeight
    }
  }

  const arcRandom = numToFixed(Math.random() * Math.PI)
  const getNodePosition = (nodeIndex: number, nodesNum: number): { x: number; y: number } => {
    const angle = numToFixed((Math.PI * 2) / nodesNum) * nodeIndex + arcRandom
    const radius = Math.min(canvasWidth, canvasHeight) / 2 - DEFAULT_SIDE_LENGTH
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    }
  }

  const getNodeItemData = (node: NodeMsg, nodeIndex: number, nodesNum: number): NodeDataItem => {
    const { x, y } = getNodePosition(nodeIndex, nodesNum)
    const ret: NodeDataItem = {
      id: node.node,
      x,
      y,
      type: 'customNode',
    }
    if (nodesNum < 4) {
      ret.size = [LARGER_SIDE_LENGTH * SQUARE_ROOT_3, LARGER_SIDE_LENGTH * 2]
    }
    return ret
  }

  let graph: undefined | Graph = undefined

  const destroyCanvas = () => {
    if (graph) {
      graph.destroy()
    }
  }

  const initCanvas = () => {
    graph = new G6.Graph({
      container: canvasEle.value,
      width: canvasWidth,
      height: canvasHeight,
      fitCenter: true,
      fitView: true,
      linkCenter: true,
      defaultEdge: {
        style: { stroke: '#8E9BF266', lineWidth: 1.5 },
      },
    })

    graph.on('node:mouseenter', (ev) => {
      const node = ev.item
      const id = node?.getID()
      if (id) {
        emit('change', id)
      }
    })
  }

  const createEdgesToConnectEachNode = (nodes: Array<NodeMsg>) => {
    const nodeNameArr = nodes.map(({ node }) => node)
    const ret: Array<EdgeItem> = []
    for (let x = 0; x < nodeNameArr.length - 1; x++) {
      for (let y = x + 1; y < nodeNameArr.length; y++) {
        ret.push({
          source: nodeNameArr[x],
          target: nodeNameArr[y],
        })
      }
    }
    return ret
  }

  const setZoom = () => {
    const nodes = lastRenderData?.nodes || []

    if (nodes.length === 1) {
      graph?.zoomTo(2, { x: canvasWidth / 2, y: canvasHeight / 2 })
    }
  }

  const drawNodes = async (data: { nodes: Array<NodeMsg>; stats: Array<NodeStatisticalData> }) => {
    lastRenderData = data
    const nodes = data?.nodes || []
    const graphData = {
      id: createRandomString(),
      nodes: nodes.map((item, index) => getNodeItemData(item, index, nodes.length)),
      edges: createEdgesToConnectEachNode(nodes),
    }
    graph?.data(graphData)
    graph?.render()
    await nextTick()
    setZoom()
  }

  onMounted(() => {
    getCanvasSize()
    initCanvas()
    window.addEventListener('resize', handleWindowResize)
  })

  onUnmounted(() => {
    destroyCanvas()
    window.removeEventListener('resize', handleWindowResize)
  })

  return {
    canvasEle,
    drawNodes,
  }
}
