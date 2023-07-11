import { createRandomString } from '@/common/tools'
import { BridgeDirection, FilterLogicalOperator } from '@/types/enum'
import { OutputItemObj } from '@/types/rule'
import { ProcessingType, SinkType, SourceType } from './useFlowEditor'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'

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
  return {
    getFormDataByType,
    isBridgeType,
  }
}
