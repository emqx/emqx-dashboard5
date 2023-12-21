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

  const baseFields = ['name', 'connector', 'description']
  const fieldStartIndex = baseFields.length
  const baseOrderMap = {
    ...createOrderObj(baseFields, 0),
    ...createOrderObj(commonAdvancedFields, 99),
  }

  const httpAdvancedFields = [`parameters.max_retries`]

  const pgSqlOrderMap = {
    ...createOrderObj(['parameters.sql', 'parameters.prepare_statement'], fieldStartIndex),
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
    'parameters.max_batch_bytes',
    'parameters.required_acks',
    'parameters.partition_count_refresh_interval',
    'parameters.max_inflight',
    'parameters.query_mode',
    'parameters.sync_query_timeout',
    'parameters.buffer',
    'parameters.buffer.mode',
    'parameters.buffer.per_partition_limit',
    'parameters.buffer.segment_bytes',
    'parameters.buffer.memory_overload_protection',
    'mode',
    'per_partition_limit',
    'segment_bytes',
    'memory_overload_protection',
    'socket_opts.sndbuf',
    'socket_opts.recbuf',
    'socket_opts.tcp_keepalive',
    'socket_opts.nodelay',
  ]

  const azurePropsOrderMap = {
    ...createOrderObj(
      [
        'bootstrap_hosts',
        'authentication.password',
        'ssl',
        'parameters.topic',
        'parameters.kafka_headers',
        'parameters.kafka_header_value_encode_mode',
        'parameters.kafka_ext_headers',
        'parameters.message',
        'parameters.message.key',
        'parameters.message.value',
        'parameters.message.timestamp',
        'parameters.partition_strategy',
      ],
      fieldStartIndex,
    ),
    ...createOrderObj(azureAdvancedProps, 150),
  }
  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.Webhook]: {
      ...baseOrderMap,
      ...createOrderObj(httpAdvancedFields, 70),
    },
    [BridgeType.MySQL]: {
      ...createOrderObj(
        ['server', 'database', 'username', 'password', 'ssl', 'sql'],
        fieldStartIndex,
      ),
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
        fieldStartIndex,
      ),
    },
    [BridgeType.GCPConsumer]: {
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
        fieldStartIndex,
      ),
    },
    [BridgeType.MongoDB]: {
      ...createOrderObj(
        [
          'mongo_type',
          'srv_record',
          'server',
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
        fieldStartIndex,
      ),
    },
    [BridgeType.PgSQL]: pgSqlOrderMap,
    [BridgeType.TimescaleDB]: pgSqlOrderMap,
    [BridgeType.MatrixDB]: pgSqlOrderMap,
    [BridgeType.TDengine]: {
      ...createOrderObj(['server', 'database', 'username', 'password'], fieldStartIndex),
    },
    [BridgeType.ClickHouse]: {
      ...createOrderObj(
        ['url', 'database', 'username', 'password', 'batch_value_separator', 'sql'],
        fieldStartIndex,
      ),
    },
    [BridgeType.DynamoDB]: {
      ...createOrderObj(
        ['url', 'aws_access_key_id', 'aws_secret_access_key', 'table', 'template'],
        fieldStartIndex,
      ),
    },
    [BridgeType.Cassandra]: {
      ...createOrderObj(
        ['keyspace', 'servers', 'username', 'password', 'ssl', 'cql'],
        fieldStartIndex,
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
        fieldStartIndex,
      ),
    },
    [BridgeType.MicrosoftSQLServer]: {
      ...createOrderObj(
        ['server', 'database', 'username', 'password', 'driver', 'sql'],
        fieldStartIndex,
      ),
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
        fieldStartIndex,
      ),
    },
    [BridgeType.OpenTSDB]: {
      ...createOrderObj(['server', 'summary', 'details'], fieldStartIndex),
    },
    [BridgeType.OracleDatabase]: {
      ...createOrderObj(
        ['server', 'service_name', 'sid', 'username', 'password', 'sql'],
        fieldStartIndex,
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
          'timeout',
          'ssl',
          'payload_template',
        ],
        fieldStartIndex,
      ),
    },
    [BridgeType.HStream]: {
      ...createOrderObj(
        ['url', 'stream', 'partition_key', 'grpc_timeout', 'ssl', 'record_template'],
        fieldStartIndex,
      ),
    },
    [BridgeType.AzureEventHubs]: azurePropsOrderMap,
    [BridgeType.Confluent]: azurePropsOrderMap,
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
        fieldStartIndex,
      ),
    },
    [BridgeType.GreptimeDB]: {
      ...createOrderObj(
        ['server', 'dbname', 'username', 'password', 'precision', 'ssl', 'write_syntax'],
        fieldStartIndex,
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

  const azureColClassMap = { 'parameters.topic': 'col-need-row' }
  const typeColClassMap: Record<string, Record<string, string>> = {
    [BridgeType.GCPConsumer]: {
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
    [BridgeType.AzureEventHubs]: azureColClassMap,
    [BridgeType.Confluent]: azureColClassMap,
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
    [BridgeType.Webhook]: [`parameters.max_retries`],
    [BridgeType.RocketMQ]: ['refresh_interval', 'send_buffer', 'sync_timeout'],
    [BridgeType.RabbitMQ]: ['heartbeat', 'publish_confirmation_timeout', 'timeout'],
    [BridgeType.MongoDB]: ['w_mode', ...mongoTopologyProps],
    [BridgeType.IoTDB]: ['enable_pipelining'],
    [BridgeType.ClickHouse]: ['batch_value_separator'],
    [BridgeType.GreptimeDB]: ['precision'],
    [BridgeType.GCPConsumer]: ['pipelining'],
    [BridgeType.AzureEventHubs]: azureAdvancedProps,
    [BridgeType.Confluent]: azureAdvancedProps,
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
      descClass = 'col-hidden'
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
