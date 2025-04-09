import { Edge, Node } from '@vue-flow/core'
import useI18nTl from '../useI18nTl'
import { NodeType } from './useFlowNode'

export default (): {
  guideFlowData: Array<Node | Edge>
} => {
  const { tl } = useI18nTl('Flow')
  const idSource = createRandomString()
  const idProcessing = createRandomString()
  const idSink = createRandomString()
  const idFallback = createRandomString()
  const guideFlowData: Array<Node | Edge> = [
    {
      id: idSource,
      label: tl('guideSourceNodeLabel'),
      data: { type: NodeType.Source, desc: tl('guideSourceNodeDesc') },
      type: 'guide',
      position: { x: 90, y: 90 },
    },
    {
      id: idProcessing,
      label: tl('guideProcessingNodeLabel'),
      data: { type: NodeType.Processing, desc: tl('guideProcessingNodeDesc') },
      type: 'guide',
      position: { x: 290, y: 90 },
    },
    {
      id: idSink,
      label: tl('guideSinkNodeLabel'),
      data: { type: NodeType.Sink, desc: tl('guideSinkNodeDesc') },
      type: 'guide',
      position: { x: 490, y: 90 },
    },
    {
      id: idFallback,
      label: tl('guideFallbackNodeLabel'),
      data: { type: NodeType.Fallback, desc: tl('guideFallbackNodeDesc') },
      type: 'guide',
      position: { x: 690, y: 90 },
    },
    {
      id: createRandomString(),
      source: idSource,
      target: idProcessing,
    },
    {
      id: createRandomString(),
      source: idProcessing,
      target: idSink,
    },
    {
      id: createRandomString(),
      source: idSink,
      target: idFallback,
      style: { stroke: '#bbb', strokeDasharray: '5 5' },
    },
  ]

  return {
    guideFlowData,
  }
}
