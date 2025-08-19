import { useFlowEdge } from '@emqx/shared-ui-components'
import { ElementData, GraphEdge, Styles } from '@vue-flow/core'
import { FALLBACK_EDGE_STYLE } from '@emqx/shared-ui-constants'

export default (): {
  fallbackEdgeStyle: Styles
  unavailableEdgeStyle: Styles
  checkConnection: (
    edge:
      | GraphEdge<ElementData>
      | Pick<GraphEdge<ElementData>, 'source' | 'sourceNode' | 'target' | 'targetNode'>,
  ) => Promise<void>
} => {
  const fallbackEdgeStyle = FALLBACK_EDGE_STYLE
  const unavailableEdgeStyle = { stroke: '#eb4e3d' }

  const { checkConnection } = useFlowEdge()

  return {
    fallbackEdgeStyle,
    unavailableEdgeStyle,
    checkConnection,
  }
}
