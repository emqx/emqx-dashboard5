import { FilterLogicalOperator } from '@/types/enum'
import { ProcessingType, SourceType } from './useFlowEditor'
import { createRandomString } from '@/common/tools'

const createMessageForm = () => ({ topic: '' })
const createEventForm = () => ({ event: '' })

export interface FilterItem {
  field: string
  operator: string
  valueForComparison: string
}

export interface FilterForm {
  groupOperator: FilterLogicalOperator
  // Just for Vue rendering
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

export default (): {
  getFormDataByType: (type: string) => Record<string, any>
} => {
  const formDataCreatorMap = {
    [SourceType.Message]: createMessageForm,
    [SourceType.Event]: createEventForm,
    [ProcessingType.Filter]: createFilterForm,
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
