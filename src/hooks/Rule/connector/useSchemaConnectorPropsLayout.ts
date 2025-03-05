import { BridgeType } from '@/types/enum'
import { isFunction, omit } from 'lodash'
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
  recordData: WritableComputedRef<Record<string, any>>,
): {
  propsOrderMap: ComputedRef<Record<string, number>>
  customColClass: ComputedRef<Record<string, string>>
  advancedFields: ComputedRef<Array<string | RegExp>>
} => {
  const createOrderObj = (keyArr: Array<string>, beginning: number) =>
    keyArr.reduce((obj, key, index) => ({ ...obj, [key]: index + beginning }), {})

  const commonAdvancedFields = [
    'pipelining',
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

  const azureAdvancedProps = [
    'health_check_topic',
    'min_metadata_refresh_interval',
    'metadata_request_timeout',
    'socket_opts.sndbuf',
    'socket_opts.recbuf',
    'socket_opts.tcp_keepalive',
    'socket_opts.nodelay',
  ]

  const IoTDBAdvancedProps = ['recv_timeout', 'enable_pipelining']

  const S3AdvancedProps = [
    'transport_options.headers',
    'transport_options.request_timeout',
    'transport_options.pool_type',
    'transport_options.pool_size',
    'transport_options.connect_timeout',
    'transport_options.enable_pipelining',
    'transport_options.max_retries',
    'transport_options.ipv6_probe',
  ]

  const azureOrderMap = {
    ...createOrderObj(
      ['bootstrap_hosts', 'authentication', 'authentication.password', 'ssl', 'health_check_topic'],
      fieldStartIndex,
    ),
    // put health_check_topic at the start
    ...omit(createOrderObj(azureAdvancedProps, 150), 'health_check_topic'),
  }
  const pgSqlOrderMap = createOrderObj(
    ['server', 'database', 'username', 'password', 'ssl', 'disable_prepared_statements'],
    fieldStartIndex,
  )
  const IoTDBOrderMap = createOrderObj(
    [
      'driver',
      'server',
      'base_url',
      'authentication.username',
      'authentication.password',
      'username',
      'password',
      'protocol_version',
      'iotdb_version',
      'zoneId',
      'ssl',
      'recv_timeout',
      'enable_pipelining',
    ],
    fieldStartIndex,
  )

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
  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.MQTT]: createOrderObj(
      [
        'server',
        'clientid_prefix',
        'username',
        'password',
        'keepalive',
        'proto_ver',
        'static_clientids',
        'clean_start',
        'ssl',
        'retry_interval',
        'bridge_mode',
        'max_inflight',
      ],
      fieldStartIndex,
    ),
    [BridgeType.Webhook]: {
      ...createOrderObj(['url', 'headers'], fieldStartIndex),
      ...createOrderObj(httpAdvancedProps, 70),
    },
    [BridgeType.AzureEventHubs]: azureOrderMap,
    [BridgeType.KafkaProducer]: azureOrderMap,
    [BridgeType.KafkaConsumer]: azureOrderMap,
    [BridgeType.PgSQL]: pgSqlOrderMap,
    [BridgeType.TimescaleDB]: pgSqlOrderMap,
    [BridgeType.MatrixDB]: pgSqlOrderMap,
    [BridgeType.MySQL]: createOrderObj(
      ['server', 'database', 'username', 'password', 'ssl'],
      fieldStartIndex,
    ),
    [BridgeType.GCPProducer]: createOrderObj(['pipelining'], fieldStartIndex),
    [BridgeType.GCPConsumer]: createOrderObj(
      ['pipelining', 'service_account_json'],
      fieldStartIndex,
    ),
    [BridgeType.MongoDB]: {
      ...createOrderObj(
        [
          'parameters',
          'mongo_type',
          'server',
          'servers',
          'replica_set_name',
          'w_mode',
          'r_mode',
          'database',
          'username',
          'password',
          'auth_source',
          'use_legacy_protocol',
          'srv_record',
          'ssl',
          ...mongoTopologyProps,
        ],
        fieldStartIndex,
      ),
      ...createOrderObj(httpAdvancedProps, 70),
    },
    [BridgeType.Redis]: createOrderObj(
      [
        'parameters',
        'servers',
        'server',
        'username',
        'password',
        'database',
        'sentinel',
        'pool_size',
        'ssl',
      ],
      fieldStartIndex,
    ),
    [BridgeType.SysKeeperProxy]: createOrderObj(
      ['listen', 'acceptors', 'handshake_timeout'],
      fieldStartIndex,
    ),
    [BridgeType.SysKeeperForwarder]: createOrderObj(
      ['server', 'ack_mode', 'ack_timeout'],
      fieldStartIndex,
    ),
    [BridgeType.InfluxDB]: createOrderObj(
      ['server', 'parameters', 'token', 'org', 'bucket', 'database', 'username', 'password', 'ssl'],
      fieldStartIndex,
    ),
    [BridgeType.IoTDB]: IoTDBOrderMap,
    [BridgeType.Elasticsearch]: IoTDBOrderMap,
    [BridgeType.AmazonKinesis]: createOrderObj(
      ['endpoint', 'aws_access_key_id', 'aws_secret_access_key'],
      fieldStartIndex,
    ),
    [BridgeType.GreptimeDB]: createOrderObj(
      ['server', 'dbname', 'username', 'password', 'ssl'],
      fieldStartIndex,
    ),
    [BridgeType.TDengine]: createOrderObj(['server', 'username', 'password'], fieldStartIndex),
    [BridgeType.OracleDatabase]: createOrderObj(
      ['server', 'service_name', 'sid', 'username', 'password'],
      fieldStartIndex,
    ),
    [BridgeType.OpenTSDB]: createOrderObj(['server', 'summary', 'details'], fieldStartIndex),
    [BridgeType.Cassandra]: createOrderObj(
      ['servers', 'keyspace', 'username', 'password', 'ssl'],
      fieldStartIndex,
    ),
    [BridgeType.RabbitMQ]: createOrderObj(
      ['server', 'port', 'username', 'password', 'virtual_host', 'heartbeat', 'timeout', 'ssl'],
      fieldStartIndex,
    ),
    [BridgeType.RocketMQ]: createOrderObj(
      ['servers', 'namespace', 'access_key', 'secret_key', 'security_token'],
      fieldStartIndex,
    ),
    [BridgeType.ClickHouse]: createOrderObj(
      ['url', 'database', 'username', 'password'],
      fieldStartIndex,
    ),
    [BridgeType.S3]: createOrderObj(
      [
        'host',
        'port',
        'access_key_id',
        'secret_access_key',
        'access_method',
        'transport_options.ssl',
        ...S3AdvancedProps,
      ],
      fieldStartIndex,
    ),
    [BridgeType.HStream]: createOrderObj(['url', 'grpc_timeout', 'ssl'], fieldStartIndex),
    [BridgeType.DynamoDB]: createOrderObj(
      ['region', 'url', 'aws_access_key_id', 'aws_secret_access_key'],
      fieldStartIndex,
    ),
    [BridgeType.Pulsar]: createOrderObj(['servers', 'authentication', 'ssl'], fieldStartIndex),
    [BridgeType.MicrosoftSQLServer]: createOrderObj(
      ['server', 'database', 'username', 'password', 'driver'],
      fieldStartIndex,
    ),
    [BridgeType.Couchbase]: createOrderObj(['server', 'username', 'password'], fieldStartIndex),
    [BridgeType.Datalayers]: createOrderObj(
      [
        'server',
        'parameters.driver_type',
        'parameters.database',
        'parameters.username',
        'parameters.password',
      ],
      fieldStartIndex,
    ),
    [BridgeType.Snowflake]: createOrderObj(
      ['server', 'dsn', 'account', 'username', 'password', 'proxy', 'ssl'],
      fieldStartIndex,
    ),
    [BridgeType.Tablestore]: createOrderObj(
      ['endpoint', 'instance_name', 'access_key_id', 'access_key_secret', 'storage_model_type'],
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
  const GCPColClass = { service_account_json: 'custom-col-24' }
  const typeColClassMap: Record<
    string,
    Record<string, string> | ((formData: Record<string, any>) => Record<string, string>)
  > = {
    [BridgeType.GCPProducer]: GCPColClass,
    [BridgeType.GCPConsumer]: GCPColClass,
    [BridgeType.MongoDB]: { 'parameters.mongo_type': 'col-hidden' },
    [BridgeType.Redis]: { 'parameters.redis_type': 'col-hidden' },
    [BridgeType.InfluxDB]: { 'parameters.influxdb_type': 'col-hidden' },
    [BridgeType.S3]: { 'transport_options.ssl': 'col-ssl' },
  }

  const pgSqlAdvancedFields = ['disable_prepared_statements']
  const advancedFieldsMap: Record<string, Array<string | RegExp>> = {
    [BridgeType.MQTT]: ['retry_interval', 'bridge_mode', 'max_inflight'],
    [BridgeType.Webhook]: httpAdvancedProps,
    [BridgeType.AzureEventHubs]: azureAdvancedProps,
    [BridgeType.KafkaProducer]: azureAdvancedProps,
    [BridgeType.KafkaConsumer]: azureAdvancedProps,
    [BridgeType.Confluent]: azureAdvancedProps,
    [BridgeType.MongoDB]: ['w_mode', /topology/],
    [BridgeType.SysKeeperForwarder]: ['ack_mode', 'ack_timeout'],
    [BridgeType.IoTDB]: IoTDBAdvancedProps,
    [BridgeType.Elasticsearch]: IoTDBAdvancedProps,
    [BridgeType.RabbitMQ]: ['heartbeat', 'timeout'],
    [BridgeType.S3]: S3AdvancedProps,
    [BridgeType.PgSQL]: pgSqlAdvancedFields,
    [BridgeType.TimescaleDB]: pgSqlAdvancedFields,
    [BridgeType.MatrixDB]: pgSqlAdvancedFields,
  }

  const advancedFields = computed(() => {
    const externalFields = props.type ? advancedFieldsMap[props.type] || [] : []
    return [...commonAdvancedFields, ...externalFields]
  })

  const { syncEtcFieldsClassMap } = useSyncConfiguration(recordData)
  const customColClass = computed(() => {
    let externalClass = props.type ? typeColClassMap[props.type] || {} : {}
    if (isFunction(externalClass)) {
      externalClass = externalClass(recordData.value)
    }
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
