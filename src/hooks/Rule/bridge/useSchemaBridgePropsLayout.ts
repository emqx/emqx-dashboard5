import { BridgeType } from '@/types/enum'
import { computed, ComputedRef, WritableComputedRef } from 'vue'
import { isConnectorSupported } from './useBridgeTypeValue'
import useSyncConfiguration from './useSyncConfiguration'

export const resourceOptFields = [
  'start_timeout',
  'worker_pool_size',
  'request_ttl',
  'health_check_interval',
  'auto_restart_interval',
  'max_buffer_bytes',
  'batch_size',
  'batch_time',
  'query_mode',
  'inflight_window',
].map((item) => `resource_opts.${item}`)

type PropsType = Readonly<{
  modelValue: Record<string, any>
  type?: string
  edit?: boolean
  copy?: boolean
  isLoading?: boolean
  readonly?: boolean
  disabled?: boolean
  hideName?: boolean
  formProps?: Record<string, any>
  hiddenFields?: string[]
  isUsingInFlow?: boolean
}>

/**
 * props order and class name
 */
export default (
  props: PropsType,
  bridgeRecord: WritableComputedRef<Record<string, any>>,
): {
  propsOrderMap: ComputedRef<Record<string, number>>
  customColClass: ComputedRef<Record<string, string>>
  advancedFields: ComputedRef<Array<string>>
} => {
  const createOrderObj = (keyArr: Array<string>, beginning: number) =>
    keyArr.reduce((obj, key, index) => ({ ...obj, [key]: index + beginning }), {})

  const commonAdvancedFields = [
    'pool_type',
    'pool_size',
    'connect_timeout',
    'max_retries',
    ...resourceOptFields,
  ]

  const baseOrderMap = {
    name: 0,
    connector: 1,
    ...createOrderObj(commonAdvancedFields, 99),
  }

  const httpAdvancedFields = [`parameters.max_retries`]
  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.Webhook]: {
      ...baseOrderMap,
      ...createOrderObj(httpAdvancedFields, 70),
    },
  }

  const propsOrderMap = computed(() => {
    let ret = baseOrderMap
    if (props.type && props.type in propsOrderTypeMap) {
      ret = { ...ret, ...propsOrderTypeMap[props.type] }
    }
    return ret
  })

  const typeColClassMap: Record<string, Record<string, string>> = {}

  const advancedFieldsMap: Record<string, Array<string>> = {
    [BridgeType.Webhook]: [`parameters.max_retries`],
  }

  const advancedFields = computed(() => {
    const externalFields = props.type ? advancedFieldsMap[props.type] || [] : []
    return [...commonAdvancedFields, ...externalFields]
  })

  const singleFieldWithLineBelow = 'dividing-line-below col-need-row'
  const getFirstRowClass = () => {
    let connectorClass = ''
    let nameClass = ''
    let descClass = ''
    if (isConnectorSupported(props.type as BridgeType)) {
      if (props.hideName) {
        connectorClass = 'dividing-line-below'
        nameClass = 'col-hidden'
      } else {
        descClass = singleFieldWithLineBelow
      }
    } else {
      nameClass = props.hideName ? 'col-hidden' : singleFieldWithLineBelow
    }
    return { nameClass, connectorClass, descClass }
  }

  const { syncEtcFieldsClassMap } = useSyncConfiguration(bridgeRecord)
  const customColClass = computed(() => {
    const externalClass = props.type ? typeColClassMap[props.type] || {} : {}
    const { nameClass, connectorClass, descClass } = getFirstRowClass()
    return {
      ...syncEtcFieldsClassMap.value,
      name: nameClass,
      connector: connectorClass,
      description: descClass,
      direction: 'col-hidden',
      type: 'col-hidden',
      enable: 'col-hidden',
      local_topic: 'col-hidden',
      ssl: 'col-ssl col-need-row dividing-line-below',
      ...externalClass,
    }
  })

  return {
    propsOrderMap,
    customColClass,
    advancedFields,
  }
}
