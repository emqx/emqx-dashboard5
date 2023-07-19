import { createRandomString } from '@/common/tools'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import { BridgeDirection, FilterLogicalOperator } from '@/types/enum'
import { OutputItemObj } from '@/types/rule'
import { isObject } from 'lodash'
import { FilterForm, FilterItem, ProcessingType, SinkType, SourceType } from './useFlowNode'

export const createMessageForm = (topic = ''): { topic: string } => ({ topic })
export const createEventForm = (event = ''): { event: string } => ({ event })

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
  isBridgeType: (type: string) => boolean
  checkFormIsEmpty: (type: string, form: Record<string, any>) => boolean
} => {
  const { createRawMQTTForm, createRawHTTPForm } = useBridgeFormCreator()
  const formDataCreatorMap = {
    [SourceType.Message]: createMessageForm,
    [SourceType.Event]: createEventForm,
    [SourceType.MQTTBroker]: () => createRawMQTTForm(BridgeDirection.Ingress),
    [ProcessingType.Filter]: createFilterForm,
    [SinkType.RePub]: createRePubForm,
    [SinkType.Console]: createConsoleForm,
    [SinkType.MQTTBroker]: () => createRawMQTTForm(BridgeDirection.Egress),
    [SinkType.HTTP]: createRawHTTPForm,
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

  const isNotBridgeTypes = [
    SourceType.Event,
    SourceType.Message,
    ProcessingType.Filter,
    SinkType.RePub,
    SinkType.Console,
  ]
  const isBridgeType = (type: string) => !isNotBridgeTypes.includes(type)

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

  const checkFilterFormIsEmpty = (form: FilterForm): boolean => {
    return form.items.every((filter) => {
      if ('items' in filter) {
        return checkFilterFormIsEmpty(filter)
      }
      return checkALevelFormIsEmpty(filter)
    })
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
    isBridgeType,
    checkFormIsEmpty,
  }
}
