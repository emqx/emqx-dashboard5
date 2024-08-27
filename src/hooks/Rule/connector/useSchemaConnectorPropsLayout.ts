import { BridgeType } from '@/types/enum'
import type { ComputedRef, WritableComputedRef } from 'vue'
import { computed } from 'vue'
import useSyncConfiguration from '../bridge/useSyncConfiguration'

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

  const baseFields = ['name', 'description']
  const fieldStartIndex = baseFields.length
  const baseOrderMap = {
    ...createOrderObj(baseFields, 0),
    ...createOrderObj(commonAdvancedFields, 99),
  }

  const httpAdvancedProps = ['pool_type', 'pool_size', 'connect_timeout', 'enable_pipelining']

  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.Webhook]: {
      ...createOrderObj(['url', 'headers'], fieldStartIndex),
      ...createOrderObj(httpAdvancedProps, 70),
    },
    [BridgeType.MQTT]: createOrderObj(
      [
        'server',
        'clientid_prefix',
        'username',
        'password',
        'keepalive',
        'proto_ver',
        'clean_start',
        'ssl',
        'retry_interval',
        'bridge_mode',
        'max_inflight',
      ],
      fieldStartIndex,
    ),
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
    [BridgeType.Webhook]: httpAdvancedProps,
    [BridgeType.MQTT]: ['retry_interval', 'bridge_mode', 'max_inflight'],
  }

  const advancedFields = computed(() => {
    const externalFields = props.type ? advancedFieldsMap[props.type] || [] : []
    return [...commonAdvancedFields, ...externalFields]
  })

  const { syncEtcFieldsClassMap } = useSyncConfiguration(bridgeRecord)
  const customColClass = computed(() => {
    const externalClass = props.type ? typeColClassMap[props.type] || {} : {}
    return {
      ...syncEtcFieldsClassMap.value,
      name: `dividing-line-below`,
      type: 'col-hidden',
      enable: 'col-hidden',
      ssl: 'col-ssl col-need-row',
      ...externalClass,
    }
  })

  return {
    propsOrderMap,
    customColClass,
    advancedFields,
  }
}
