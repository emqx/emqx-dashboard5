import { createRandomString } from '@/common/tools'
import { FilterLogicalOperator } from '@/types/enum'
import { RePub } from '@/types/rule'
import { ProcessingType, SinkType, SourceType } from './useFlowEditor'

const createMessageForm = () => ({ topic: '' })
const createEventForm = () => ({ event: '' })

export interface FilterItem {
  field: string
  operator: string
  valueForComparison: string
}

export interface FilterForm {
  groupOperator: FilterLogicalOperator
  // It can be used as the ID attribute for list elements, and can be used to
  // identify the source list and target list after a drag-and-drop operation.
  id: string
  items: Array<FilterItem | FilterForm>
}

export const createFilterItem = (): FilterItem => ({
  field: '',
  operator: '',
  valueForComparison: '',
})

export const createFilterForm = (): FilterForm => ({
  groupOperator: FilterLogicalOperator.And,
  id: createRandomString(),
  items: [createFilterItem()],
})

export const createRePubForm = (): RePub => ({
  topic: '',
  qos: 0,
  payload: '',
  retain: false,
})

export default (): {
  getFormDataByType: (type: string) => Record<string, any>
} => {
  const formDataCreatorMap = {
    [SourceType.Message]: createMessageForm,
    [SourceType.Event]: createEventForm,
    [ProcessingType.Filter]: createFilterForm,
    [SinkType.RePub]: createRePubForm,
  }
  const emptyCreator = () => ({})
  const getFormDataByType = (type: string) => {
    const creator = formDataCreatorMap[type]
    if (creator) {
      return creator()
    }
    console.error('EMPTY FORM CREATOR')
    return emptyCreator()
  }
  return {
    getFormDataByType,
  }
}
