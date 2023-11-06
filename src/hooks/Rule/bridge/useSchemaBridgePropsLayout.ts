import { BridgeType } from '@/types/enum'
import { computed, ComputedRef, WritableComputedRef } from 'vue'
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
    ...createOrderObj(commonAdvancedFields, 99),
  }

  const pgSqlOrderMap = {
    ...createOrderObj(['server', 'database', 'username', 'password', 'pool_size', 'ssl'], 1),
  }

  const mongoTopologyProps = [
    'max_overflow',
    'overflow_ttl',
    'overflow_check_period',
    'local_threshold_ms',
    'connect_timeout_ms',
    'socket_timeout_ms',
    'server_selection_timeout_ms',
    'wait_queue_timeout_ms',
    'heartbeat_frequency_ms',
    'min_heartbeat_frequency_ms',
  ].map((item) => `topology.${item}`)

  const azureAdvancedProps = [
    'min_metadata_refresh_interval',
    'metadata_request_timeout',
    'kafka.max_batch_bytes',
    'kafka.required_acks',
    'kafka.partition_count_refresh_interval',
    'kafka.max_inflight',
    'kafka.query_mode',
    'kafka.sync_query_timeout',
    'kafka.buffer',
    'mode',
    'per_partition_limit',
    'segment_bytes',
    'memory_overload_protection',
    'socket_opts.sndbuf',
    'socket_opts.recbuf',
    'socket_opts.tcp_keepalive',
    'socket_opts.nodelay',
  ]

  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.MySQL]: {
      ...createOrderObj(['server', 'database', 'username', 'password', 'ssl', 'sql'], 1),
    },
    [BridgeType.Redis]: {
      ...createOrderObj(
        [
          'redis_type',
          'servers',
          'server',
          'username',
          'password',
          'database',
          'sentinel',
          'ssl',
          'command_template',
        ],
        1,
      ),
    },
    [BridgeType.GCP]: {
      ...createOrderObj(
        [
          'role',
          'pubsub_topic',
          'pipelining',
          'service_account_json',
          'payload_template',
          'attributes_template',
          'ordering_key_template',
          'consumer.topic_mapping',
          'consumer.pull_max_messages',
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
          'username',
          'password',
          'auth_source',
          'w_mode',
          'r_mode',
          'collection',
          'ssl',
          'payload_template',
          ...mongoTopologyProps,
        ],
        1,
      ),
    },
    [BridgeType.PgSQL]: pgSqlOrderMap,
    [BridgeType.TimescaleDB]: pgSqlOrderMap,
    [BridgeType.MatrixDB]: pgSqlOrderMap,
    [BridgeType.TDengine]: {
      ...createOrderObj(['server', 'database', 'username', 'password'], 1),
    },
    [BridgeType.ClickHouse]: {
      ...createOrderObj(
        ['url', 'database', 'username', 'password', 'batch_value_separator', 'sql'],
        1,
      ),
    },
    [BridgeType.DynamoDB]: {
      ...createOrderObj(
        ['url', 'aws_access_key_id', 'aws_secret_access_key', 'table', 'template'],
        1,
      ),
    },
    [BridgeType.Cassandra]: {
      ...createOrderObj(['keyspace', 'servers', 'username', 'password', 'ssl', 'cql'], 1),
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
      ...createOrderObj(['server', 'database', 'username', 'password', 'driver', 'sql'], 1),
    },
    [BridgeType.IoTDB]: {
      ...createOrderObj(
        [
          'base_url',
          'iotdb_version',
          'authentication.username',
          'authentication.password',
          'device_id',
          'is_aligned',
          'retry_interval',
          'enable_pipelining',
          'ssl',
        ],
        1,
      ),
    },
    [BridgeType.OpenTSDB]: {
      ...createOrderObj(['server', 'summary', 'details'], 1),
    },
    [BridgeType.OracleDatabase]: {
      ...createOrderObj(['server', 'service_name', 'sid', 'username', 'password', 'sql'], 1),
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
          'timeout',
          'ssl',
          'payload_template',
        ],
        1,
      ),
    },
    [BridgeType.HStream]: {
      ...createOrderObj(
        ['url', 'stream', 'partition_key', 'grpc_timeout', 'ssl', 'record_template'],
        1,
      ),
    },
    [BridgeType.AzureEventHubs]: {
      ...createOrderObj(
        [
          'bootstrap_hosts',
          'authentication.password',
          'ssl',
          'local_topic',
          'kafka.topic',
          'kafka.kafka_headers',
          'kafka.kafka_header_value_encode_mode',
          'kafka.kafka_ext_headers',
          'kafka.message',
          'kafka.message.key',
          'kafka.message.value',
          'kafka.message.timestamp',
          'kafka.partition_strategy',
        ],
        1,
      ),
      ...createOrderObj(azureAdvancedProps, 150),
    },
    [BridgeType.AmazonKinesis]: {
      ...createOrderObj(
        [
          'aws_access_key_id',
          'aws_secret_access_key',
          'endpoint',
          'stream_name',
          'partition_key',
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

  const typeColClassMap: Record<string, Record<string, string>> = {
    [BridgeType.GCP]: {
      name: 'dividing-line-below',
      pubsub_topic: 'col-need-row',
      service_account_json: 'custom-col-24',
    },
    [BridgeType.TDengine]: {
      username: 'dividing-line-below',
    },
    [BridgeType.ClickHouse]: {
      username: 'dividing-line-below',
    },
    [BridgeType.DynamoDB]: {
      aws_secret_access_key: 'dividing-line-below',
    },
    [BridgeType.RocketMQ]: {
      topic: 'dividing-line-below',
    },
    [BridgeType.MicrosoftSQLServer]: {
      driver: 'dividing-line-below',
    },
    [BridgeType.OracleDatabase]: {
      password: 'dividing-line-below',
    },
    [BridgeType.AzureEventHubs]: {
      local_topic: 'col-need-row',
      'kafka.topic': 'col-need-row',
    },
    [BridgeType.AmazonKinesis]: {
      partition_key: 'dividing-line-below',
    },
    [BridgeType.GreptimeDB]: {
      username: 'dividing-line-below',
    },
    [BridgeType.IoTDB]: {
      ssl: 'col-ssl col-need-row',
    },
  }

  const advancedFieldsMap: Record<string, Array<string>> = {
    [BridgeType.RocketMQ]: ['refresh_interval', 'send_buffer', 'sync_timeout'],
    [BridgeType.RabbitMQ]: ['heartbeat', 'publish_confirmation_timeout', 'timeout'],
    [BridgeType.MongoDB]: ['w_mode', ...mongoTopologyProps],
    [BridgeType.IoTDB]: ['enable_pipelining'],
    [BridgeType.ClickHouse]: ['batch_value_separator'],
    [BridgeType.GreptimeDB]: ['precision'],
    [BridgeType.GCP]: ['pipelining'],
    [BridgeType.AzureEventHubs]: azureAdvancedProps,
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
    advancedFields,
  }
}
