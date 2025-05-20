import { RuleEvent } from '@/types/rule'
import { Node } from '@vue-flow/core'
import { FunctionItem, ProcessingType } from './useFlowNode'

export default () => {
  const { getEventList } = useRuleEvents()
  const eventList: Ref<Array<RuleEvent>> = ref([])
  ;(async () => (eventList.value = await getEventList()))()
  const getSourceFields = (source: string) => {
    const event = eventList.value.find(({ event }) => event === source)
    return event?.columns || []
  }

  const getSourceString = (node: Node) => {
    const {
      data: { specificType, formData },
    } = node
    switch (specificType) {
      case SourceType.Message:
        return TOPIC_EVENT
      case SourceType.Event:
        return formData.event
    }
    console.error('cannot find source')
  }

  const getAvailableFieldsFromSourceNodes = (sourceNodes: Array<Node>) => {
    const sourceStrArr = sourceNodes.map(getSourceString)
    const availableFields = sourceStrArr.reduce((arr: Array<string>, source) => {
      return [...arr, ...getSourceFields(source)]
    }, [])
    return [...new Set(availableFields)]
  }

  const { isAIType } = useFlowNode()
  const getAvailableFieldsFromProcessingNodes = (processingNodes: Array<Node>) => {
    const availableFields = processingNodes.reduce((arr: Array<string>, node) => {
      const { specificType, formData } = node.data
      if (!formData) {
        return arr
      }
      if (isAIType(specificType) && formData.alias) {
        arr.push(formData.alias)
      } else if (specificType === ProcessingType.Function) {
        if (formData && formData.form && formData.form.length) {
          formData.form.forEach(({ alias }: FunctionItem) => {
            if (alias) {
              arr.push(alias)
            }
          })
        }
      }
      return arr
    }, [])
    return [...new Set(availableFields)]
  }

  const getAvailableFields = (nodes: Array<Node>) => {
    const sourceNodes = nodes.filter(({ type }) => type === FlowNodeType.Input)
    const processingNodes = nodes.filter(({ type }) => type === FlowNodeType.Default)
    return [
      ...getAvailableFieldsFromSourceNodes(sourceNodes),
      ...getAvailableFieldsFromProcessingNodes(processingNodes),
    ]
  }
  return { getAvailableFields }
}
