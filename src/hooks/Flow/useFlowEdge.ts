import { GraphEdge, ElementData, Node } from '@vue-flow/core'
import { FlowNodeType, ProcessingType } from './useFlowNode'
import useI18nTl from '../useI18nTl'

export default () => {
  const { tl } = useI18nTl('Flow')

  const isInputNode = (node: Node) => node.type === FlowNodeType.Input
  const isOutputNode = (node: Node) => node.type === FlowNodeType.Output
  const isDefaultNode = (node: Node) => node.type === FlowNodeType.Default
  const checkConnection = async (edge: GraphEdge<ElementData>) => {
    const { sourceNode, sourceHandle, targetNode, targetHandle } = edge

    if (
      sourceNode.id === targetNode.id ||
      (isInputNode(sourceNode) && isInputNode(targetNode)) ||
      (isOutputNode(sourceNode) && isOutputNode(targetNode))
    ) {
      return Promise.reject(tl('incorrectConnection'))
    }
    if (isDefaultNode(sourceNode) && isDefaultNode(targetNode)) {
      const functionNodeId = [sourceNode, targetNode].find(
        (item) => item.data.specificType === ProcessingType.Function,
      )?.id
      const filterNodeId = [sourceNode, targetNode].find(
        (item) => item.data.specificType === ProcessingType.Filter,
      )?.id
      if (functionNodeId && filterNodeId) {
        const handleArr = [sourceHandle, targetHandle]
        const isFromFunctionToFilter = handleArr.every((item) => {
          const isRightDirection = item?.includes(functionNodeId) && /right/i.test(item)
          const isLeftDirection = item?.includes(filterNodeId) && /left/i.test(item)
          return isRightDirection || isLeftDirection
        })
        if (!isFromFunctionToFilter) {
          return Promise.reject(tl('filterFunctionsWrongOrder'))
        }
      }
    }
    return Promise.resolve()
  }

  return {
    checkConnection,
  }
}
