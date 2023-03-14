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
    ssl: string
  }>
} => {
  const createOrderObj = (keyArr: Array<string>, beginning: number) =>
    keyArr.reduce((obj, key, index) => ({ ...obj, [key]: index + beginning }), {})

  const baseOrderMap = {
    name: 0,
    ...createOrderObj(
      [
        'resource_opts.worker_pool_size',
        'resource_opts.request_timeout',
        'resource_opts.health_check_interval',
        'resource_opts.auto_restart_interval',
        'resource_opts.max_queue_bytes',
        'resource_opts.batch_size',
        'resource_opts.batch_time',
        'resource_opts.query_mode',
        'resource_opts.async_inflight_window',
      ],
      99,
    ),
  }

  const pgSqlOrderMap = {
    ...createOrderObj(['server', 'database', 'username', 'password', 'pool_size', 'ssl'], 1),
  }

  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.MySQL]: {
      ...createOrderObj(
        ['server', 'database', 'username', 'password', 'pool_size', 'ssl', 'sql'],
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
          'ssl',
          'command_template',
        ],
        1,
      ),
    },
    [BridgeType.GCP]: {
      ...createOrderObj(['pubsub_topic', 'pool_size', 'pipelining'], 1),
    },
    [BridgeType.MongoDB]: {
      ...createOrderObj(
        [
          'mongo_type',
          'srv_record',
          'database',
          'servers',
          'replica_set_name',
          'pool_size',
          'username',
          'password',
          'auth_source',
          'w_mode',
          'r_mode',
          'collection',
          'ssl',
          'payload_template',
          'topology.pool_size',
          'topology.max_overflow',
          'topology.overflow_ttl',
          'topology.overflow_check_period',
          'topology.local_threshold_ms',
          'topology.connect_timeout_ms',
          'topology.socket_timeout_ms',
          'topology.server_selection_timeout_ms',
          'topology.wait_queue_timeout_ms',
          'topology.heartbeat_frequency_ms',
          'topology.min_heartbeat_frequency_ms',
        ],
        1,
      ),
    },
    [BridgeType.PgSQL]: pgSqlOrderMap,
    [BridgeType.TimescaleDB]: pgSqlOrderMap,
    [BridgeType.MatrixDB]: pgSqlOrderMap,
    [BridgeType.TDengine]: {
      ...createOrderObj(['server', 'database', 'username', 'password', 'pool_size'], 1),
    },
    [BridgeType.ClickHouse]: {
      ...createOrderObj(
        ['url', 'database', 'username', 'password', 'pool_size', 'batch_value_separator', 'sql'],
        1,
      ),
    },
    [BridgeType.DynamoDB]: {
      ...createOrderObj(['url', 'database', 'username', 'password', 'pool_size', 'template'], 1),
    },
  }

  const propsOrderMap = computed(() => {
    let ret = baseOrderMap
    if (props.type && props.type in propsOrderTypeMap) {
      ret = { ...ret, ...propsOrderTypeMap[props.type] }
    }
    return ret
  })

  const pgSqlColClassMap = { sql: 'dividing-line-below' }

  const typeColClassMap = {
    [BridgeType.MySQL]: {
      sql: 'dividing-line-below',
    },
    [BridgeType.Redis]: {
      command_template: 'custom-col-24 dividing-line-below',
    },
    [BridgeType.GCP]: {
      payload_template: 'custom-col-24  dividing-line-above',
      service_account_json: 'custom-col-24 dividing-line-below',
    },
    [BridgeType.MongoDB]: {
      payload_template: 'dividing-line-below',
    },
    [BridgeType.PgSQL]: pgSqlColClassMap,
    [BridgeType.TimescaleDB]: pgSqlColClassMap,
    [BridgeType.MatrixDB]: pgSqlColClassMap,
    [BridgeType.TDengine]: {
      pool_size: 'dividing-line-below',
      sql: 'dividing-line-below',
    },
    [BridgeType.ClickHouse]: {
      pool_size: 'dividing-line-below',
      sql: 'dividing-line-below',
    },
    [BridgeType.DynamoDB]: {
      pool_size: 'dividing-line-below',
      template: 'dividing-line-below',
    },
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
      ssl: 'col-ssl col-need-row dividing-line-below',
      ...externalClass,
    }
  })

  return {
    propsOrderMap,
    customColClass,
  }
}
