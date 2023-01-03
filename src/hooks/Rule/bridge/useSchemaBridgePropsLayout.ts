import { BridgeType } from '@/types/enum'
import { computed, ComputedRef, WritableComputedRef } from 'vue'
import useSyncConfiguration from './useSyncConfiguration'

type PropsType = Readonly<
  {
    modelValue?: unknown
    type?: unknown
    edit?: unknown
  } & {
    edit: boolean
  } & {
    modelValue?: Record<string, any> | undefined
    type?: BridgeType.MySQL | BridgeType.Redis | BridgeType.GCP | BridgeType.MongoDB | undefined
  }
>

/**
 * props order and class name
 */
export default (
  props: PropsType,
  bridgeRecord: WritableComputedRef<Record<string, any>>,
): {
  propsOrderMap: ComputedRef<Record<string, number>>
  customColClass: ComputedRef<{
    name: string
    direction: string
    type: string
    enable: string
    local_topic: string
    'connector.ssl': string
  }>
} => {
  const createOrderObj = (keyArr: Array<string>, beginning: number) =>
    keyArr.reduce((obj, key, index) => ({ ...obj, [key]: index + beginning }), {})

  const baseOrderMap = {
    name: 0,
    ...createOrderObj(
      [
        'worker_pool_size',
        'health_check_interval',
        'auto_restart_interval',
        'query_mode',
        'async_inflight_window',
        'enable_queue',
        'max_queue_bytes',
        'enable_batch',
        'batch_size',
        'batch_time',
      ],
      99,
    ),
  }

  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.MySQL]: {
      ...createOrderObj(
        ['server', 'database', 'username', 'password', 'pool_size', 'auto_reconnect', 'sql', 'ssl'],
        1,
      ),
    },
    [BridgeType.Redis]: {
      ...createOrderObj(
        [
          'redis_type',
          'servers',
          'server',
          'password',
          'database',
          'sentinel',
          'pool_size',
          'auto_reconnect',
          'command_template',
        ],
        1,
      ),
    },
    [BridgeType.GCP]: {
      ...createOrderObj(['pubsub_topic', 'request_timeout', 'pool_size', 'pipelining'], 1),
    },
  }

  const propsOrderMap = computed(() => {
    let ret = baseOrderMap
    if (props.type && props.type in propsOrderTypeMap) {
      ret = { ...ret, ...propsOrderTypeMap[props.type] }
    }
    return ret
  })

  const typeColClassMap = {
    [BridgeType.MySQL]: {},
    [BridgeType.Redis]: {
      'resource_opts.auto_restart_interval': 'col-need-row',
      command_template: 'custom-col-24',
    },
    [BridgeType.GCP]: {
      payload_template: 'custom-col-24',
      service_account_json: 'custom-col-24',
    },
    [BridgeType.MongoDB]: {},
  }

  const { syncEtcFieldsClassMap } = useSyncConfiguration(bridgeRecord)
  const customColClass = computed(() => {
    const externalClass = props.type ? typeColClassMap[props.type] : {}
    return {
      ...syncEtcFieldsClassMap.value,
      name: 'col-need-row dividing-line-below',
      direction: 'col-hidden',
      type: 'col-hidden',
      enable: 'col-hidden',
      local_topic: 'col-hidden',
      'connector.ssl': 'col-ssl',
      ...externalClass,
    }
  })

  return {
    propsOrderMap,
    customColClass,
  }
}
