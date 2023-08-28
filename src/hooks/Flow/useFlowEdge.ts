import { GraphEdge, ElementData, Node } from '@vue-flow/core'
import { FlowNodeType, ProcessingType } from './useFlowNode'
import useI18nTl from '../useI18nTl'

export default (): {
  checkConnection: (
    edge:
      | GraphEdge<ElementData>
      | Pick<GraphEdge<ElementData>, 'source' | 'sourceNode' | 'target' | 'targetNode'>,
  ) => Promise<void>
} => {
  const { tl } = useI18nTl('Flow')

  const isInputNode = (node: Node) => node.type === FlowNodeType.Input
  const isOutputNode = (node: Node) => node.type === FlowNodeType.Output
  const isDefaultNode = (node: Node) => node.type === FlowNodeType.Default
  const checkConnection = async (
    edge:
      | GraphEdge<ElementData>
      | Pick<GraphEdge<ElementData>, 'source' | 'sourceNode' | 'target' | 'targetNode'>,
  ) => {
    const { sourceNode, targetNode } = edge
    if (
      sourceNode.id === targetNode.id ||
      (isInputNode(sourceNode) && isInputNode(targetNode)) ||
      (isOutputNode(sourceNode) && isOutputNode(targetNode))
    ) {
      return Promise.reject(tl('incorrectConnection'))
    }
    if (isDefaultNode(sourceNode) && isDefaultNode(targetNode)) {
      const sourceType = sourceNode.data?.specificType
      const targetType = targetNode.data?.specificType
      if (!sourceType || !targetType) {
        return Promise.resolve()
      }
      if (sourceType === ProcessingType.Filter && targetType === ProcessingType.Function) {
        return Promise.reject(tl('filterFunctionsWrongOrder'))
      }
    }
    return Promise.resolve()
  }

  return {
    checkConnection,
  }
}
