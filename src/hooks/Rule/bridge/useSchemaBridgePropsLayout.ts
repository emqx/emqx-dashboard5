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
        'resource_opts.start_timeout',
        'resource_opts.worker_pool_size',
        'resource_opts.request_timeout',
        'resource_opts.health_check_interval',
        'resource_opts.auto_restart_interval',
        'resource_opts.max_buffer_bytes',
        'resource_opts.batch_size',
        'resource_opts.batch_time',
        'resource_opts.query_mode',
        'resource_opts.inflight_window',
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
      ...createOrderObj(
        [
          'pubsub_topic',
          'pipelining',
          'connect_timeout',
          'pool_size',
          'max_retries',
          'service_account_json',
          'payload_template',
        ],
        1,
      ),
    },
    [BridgeType.MongoDB]: {
      ...createOrderObj(
        [
          'mongo_type',
          'srv_record',
          'servers',
          'database',
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
      ...createOrderObj(
        ['url', 'aws_access_key_id', 'aws_secret_access_key', 'table', 'pool_size', 'template'],
        1,
      ),
    },
    [BridgeType.Cassandra]: {
      ...createOrderObj(
        ['keyspace', 'servers', 'username', 'password', 'pool_size', 'ssl', 'cql'],
        1,
      ),
    },
    [BridgeType.RocketMQ]: {
      ...createOrderObj(
        [
          'servers',
          'access_key',
          'secret_key',
          'security_token',
          'topic',
          'refresh_interval',
          'send_buffer',
          'template',
        ],
        1,
      ),
    },
    [BridgeType.MicrosoftSQLServer]: {
      ...createOrderObj(
        ['server', 'database', 'username', 'password', 'driver', 'pool_size', 'sql'],
        1,
      ),
    },
    [BridgeType.IoTDB]: {
      ...createOrderObj(
        [
          'base_url',
          'iotdb_version',
          'authentication.username',
          'authentication.password',
          'is_aligned',
          'device_id',
          'connect_timeout',
          'retry_interval',
          'pool_type',
          'pool_size',
          'enable_pipelining',
          'max_retries',
          'ssl',
        ],
        1,
      ),
    },
    [BridgeType.OpenTSDB]: {
      ...createOrderObj(['server', 'pool_size', 'summary', 'details'], 1),
    },
    [BridgeType.OracleDatabase]: {
      ...createOrderObj(
        ['server', 'service_name', 'sid', 'username', 'password', 'pool_size', 'sql'],
        1,
      ),
    },
    [BridgeType.RabbitMQ]: {
      ...createOrderObj(
        [
          'server',
          'port',
          'username',
          'password',
          'exchange',
          'routing_key',
          'virtual_host',
          'heartbeat',
          'auto_reconnect',
          'delivery_mode',
          'wait_for_publish_confirmations',
          'publish_confirmation_timeout',
          'pool_size',
          'timeout',
          'payload_template',
        ],
        1,
      ),
    },
    [BridgeType.HStream]: {
      ...createOrderObj(
        ['url', 'stream', 'partition_key', 'grpc_timeout', 'pool_size', 'ssl', 'record_template'],
        1,
      ),
    },
    [BridgeType.AzureEventHubs]: {
      ...createOrderObj(
        [
          'bootstrap_hosts',
          'authentication.password',
          'connect_timeout',
          'min_metadata_refresh_interval',
          'metadata_request_timeout',
          'ssl',
          'kafka.topic',
          'kafka.message',
          'kafka.max_batch_bytes',
          'kafka.partition_strategy',
          'kafka.required_acks',
          'kafka.kafka_headers',
          'kafka.kafka_ext_headers',
          'kafka.kafka_header_value_encode_mode',
          'kafka.partition_count_refresh_interval',
          'kafka.max_inflight',
          'kafka.buffer',
          'kafka.query_mode',
          'kafka.sync_query_timeout',
          'socket_opts.sndbuf',
          'socket_opts.recbuf',
          'socket_opts.tcp_keepalive',
        ],
        1,
      ),
    },
    [BridgeType.AmazonKinesis]: {
      ...createOrderObj(
        [
          'aws_access_key_id',
          'aws_secret_access_key',
          'endpoint',
          'stream_name',
          'partition_key',
          'max_retries',
          'pool_size',
          'payload_template',
        ],
        1,
      ),
    },
    [BridgeType.GreptimeDB]: {
      ...createOrderObj(
        ['server', 'dbname', 'username', 'password', 'precision', 'ssl', 'write_syntax'],
        1,
      ),
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
      service_account_json: 'custom-col-24 dividing-line-above',
      payload_template: 'custom-col-24   dividing-line-below',
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
    [BridgeType.Cassandra]: {
      cql: 'dividing-line-below',
    },
    [BridgeType.RocketMQ]: {
      send_buffer: 'dividing-line-below',
      template: 'dividing-line-below',
    },
    [BridgeType.MicrosoftSQLServer]: {
      driver: 'dividing-line-below',
      sql: 'dividing-line-below',
    },
    [BridgeType.OpenTSDB]: {
      summary: 'dividing-line-below',
    },
    [BridgeType.OracleDatabase]: {
      password: 'dividing-line-below',
      sql: 'dividing-line-below',
    },
    [BridgeType.RabbitMQ]: {
      payload_template: 'dividing-line-below',
      timeout: 'dividing-line-below',
    },
    [BridgeType.HStream]: {
      // TODO:remove
      pool_size: 'dividing-line-below',
      record_template: 'dividing-line-below',
    },
    [BridgeType.AmazonKinesis]: {
      pool_size: 'dividing-line-below',
      payload_template: 'dividing-line-below',
    },
    [BridgeType.GreptimeDB]: {
      write_syntax: 'dividing-line-below',
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
