import { useFlowEdge } from '@emqx/shared-ui-components'
import { ElementData, GraphEdge, Styles } from '@vue-flow/core'

export default (): {
  fallbackEdgeStyle: Styles
  unavailableEdgeStyle: Styles
  checkConnection: (
    edge:
      | GraphEdge<ElementData>
      | Pick<GraphEdge<ElementData>, 'source' | 'sourceNode' | 'target' | 'targetNode'>,
  ) => Promise<void>
} => {
  const fallbackEdgeStyle = { stroke: '#bbb', strokeDasharray: '5 5' }
  const unavailableEdgeStyle = { stroke: '#eb4e3d' }

  const { checkConnection } = useFlowEdge()

  return {
    fallbackEdgeStyle,
    unavailableEdgeStyle,
    checkConnection,
  }
}
