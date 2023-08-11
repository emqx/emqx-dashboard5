import { createRandomString } from '@/common/tools'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import { BridgeDirection, FilterLogicalOperator } from '@/types/enum'
import { OutputItemObj } from '@/types/rule'
import { isObject } from 'lodash'
import {
  EditedWay,
  FilterForm,
  FilterFormData,
  FilterItem,
  FunctionForm,
  FunctionItem,
  ProcessingType,
  SinkType,
  SourceType,
} from './useFlowNode'

export const createMessageForm = (topic = ''): { topic: string } => ({ topic })
export const createEventForm = (event = ''): { event: string } => ({ event })

export const createFilterItem = (): FilterItem => ({
  field: '',
  operator: '',
  valueForComparison: '',
})

export const createFilterFormData = (): {
  groupOperator: FilterLogicalOperator
  id: string
  items: Array<FilterItem>
} => ({
  groupOperator: FilterLogicalOperator.And,
  id: createRandomString(),
  items: [createFilterItem()],
})

export const createFilterForm = (): FilterForm => ({
  editedWay: EditedWay.Form,
  sql: '',
  form: createFilterFormData(),
})

export const createFunctionItem = (): FunctionItem => ({
  id: createRandomString(),
  field: '',
  func: {
    name: '',
    args: [],
  },
  alias: '',
})

export const createFunctionForm = (): FunctionForm => ({
  editedWay: EditedWay.Form,
  form: [createFunctionItem()],
  sql: '',
})

export const createRePubForm = (): OutputItemObj => ({
  function: 'republish',
  args: {
    topic: '',
    qos: 0,
    payload: '',
    retain: false,
  },
})

export const createConsoleForm = (): OutputItemObj => ({ function: 'console' })

export default (): {
  getFormDataByType: (type: string) => Record<string, any>
  checkFormIsEmpty: (type: string, form: Record<string, any>) => boolean
} => {
  const { createRawMQTTForm, createRawHTTPForm } = useBridgeFormCreator()
  const emptyCreator = () => ({})
  const formDataCreatorMap = {
    [SourceType.Message]: createMessageForm,
    [SourceType.Event]: createEventForm,
    [SourceType.MQTTBroker]: () => createRawMQTTForm(BridgeDirection.Ingress),
    [ProcessingType.Filter]: createFilterForm,
    [ProcessingType.Function]: createFunctionForm,
    [SinkType.RePub]: createRePubForm,
    [SinkType.Console]: createConsoleForm,
    [SinkType.MQTTBroker]: () => createRawMQTTForm(BridgeDirection.Egress),
    [SinkType.HTTP]: createRawHTTPForm,
  }
  const getFormDataByType = (type: string) => {
    const creator = formDataCreatorMap[type]
    if (creator) {
      return creator()
    }
    console.error('EMPTY FORM CREATOR')
    return emptyCreator()
  }

  const checkALevelFormIsEmpty = (form: Record<string, any>): boolean => {
    const keys = Object.keys(form)
    return keys.every((key): boolean => {
      const val = form[key]
      if (Array.isArray(val)) {
        return val.length === 0
      }
      if (isObject(val)) {
        if (Object.keys(val).length === 0) {
          return true
        }
        return checkALevelFormIsEmpty(val)
      }
      return val === undefined || val === ''
    })
  }

  const checkFilterFormDataIsEmpty = (form: FilterFormData): boolean => {
    return form.items.every((filter) => {
      if ('items' in filter) {
        return checkFilterFormDataIsEmpty(filter)
      }
      return checkALevelFormIsEmpty(filter)
    })
  }

  const checkFilterFormIsEmpty = (data: FilterForm): boolean => {
    const { editedWay, form, sql } = data
    if (editedWay === EditedWay.Form) {
      return checkFilterFormDataIsEmpty(form)
    }
    return !sql
  }

  /**
   * Only check for types where the form may be empty
   */
  const typesFormNeedCheck = [
    SourceType.Message,
    SourceType.Event,
    ProcessingType.Filter,
    ProcessingType.Function,
  ]
  const checkFormIsEmpty = (type: string, form: Record<string, any>) => {
    if (!isObject(form) || !typesFormNeedCheck.includes(type)) {
      return false
    }
    if (type === ProcessingType.Filter) {
      return checkFilterFormIsEmpty(form as FilterForm)
    }
    return checkALevelFormIsEmpty(form)
  }

  return {
    getFormDataByType,
    checkFormIsEmpty,
  }
}
