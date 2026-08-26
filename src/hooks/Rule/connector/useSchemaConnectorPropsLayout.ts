import { BridgeType } from '@/types/enum'
import useSyncConfiguration from '../bridge/useSyncConfiguration'

export const connectorResourceOptFields = [
  'start_timeout',
  'worker_pool_size',
  'request_ttl',
  'health_check_interval',
  'health_check_timeout',
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
    'max_inactive',
    'max_retries',
    ...connectorResourceOptFields,
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
    'allow_auto_topic_creation',
    'min_metadata_refresh_interval',
    'metadata_request_timeout',
    'request_timeout',
    'socket_opts.sndbuf',
    'socket_opts.recbuf',
    'socket_opts.tcp_keepalive',
    'socket_opts.nodelay',
  ]

  const IoTDBAdvancedProps = ['recv_timeout', 'enable_pipelining']

  const S3AdvancedProps = [
    'transport_options.headers',
    'transport_options.pool_type',
    'transport_options.pool_size',
    'transport_options.connect_timeout',
    'transport_options.request_timeout',
    'transport_options.max_retries',
    'transport_options.enable_pipelining',
    'transport_options.ipv6_probe',
  ]
  const S3TablesAdvancedProps = S3AdvancedProps.map((item) => `s3_client.${item}`).toSpliced(
    0,
    0,
    's3_client.access_method',
    'request_timeout',
  )

  const azureOrderMap = {
    ...createOrderObj(
      [
        'bootstrap_hosts',
        'authentication',
        'authentication.password',
        'authentication.endpoint',
        'authentication.region',
        'ssl',
        'health_check_topic',
        'allow_auto_topic_creation',
      ],
      fieldStartIndex,
    ),
    // put health_check_topic at the start
    ...omit(createOrderObj(azureAdvancedProps, 150), [
      'health_check_topic',
      'allow_auto_topic_creation',
    ]),
  }
  const kafkaProducerOrderMap = {
    ...createOrderObj(
      [
        'bootstrap_hosts',
        'authentication',
        'authentication.username',
        'authentication.password',
        'authentication.endpoint',
        'authentication.region',
        // these two just for confluent
        'logical_cluster',
        'identity_pool_id',
        'mechanism',
        'grant_type',
        'endpoint_uri',
        'client_id',
        'client_secret',
        'scope',
        'extensions',
        'ssl',
        'health_check_topic',
        'allow_auto_topic_creation',
      ],
      fieldStartIndex,
    ),
    // put health_check_topic at the start
    ...omit(createOrderObj(azureAdvancedProps, 150), [
      'health_check_topic',
      'allow_auto_topic_creation',
    ]),
  }
  const pgSqlOrderMap = createOrderObj(
    [
      'server',
      'database',
      'username',
      'password',
      'ssl',
      'application_name',
      'disable_prepared_statements',
    ],
    fieldStartIndex,
  )
  const IoTDBOrderMap = createOrderObj(
    [
      'driver',
      'server',
      'base_url',
      'sql',
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
  const greptimeDBOrderMap = createOrderObj(
    ['server', 'dbname', 'username', 'password', 'ssl', 'ttl', 'ts_column'],
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
  const mqttOrderMap = createOrderObj(
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
      'tcp_opts',
      'tcp_opts.active_n',
      'tcp_opts.nodelay',
      'tcp_opts.sndbuf',
      'tcp_opts.recbuf',
      'tcp_opts.buffer',
      'tcp_opts.keepalive',
      'tcp_opts.delay_send',
    ],
    fieldStartIndex,
  )
  const GCPProducerOrderMap = createOrderObj(
    [
      'authentication',
      'service_account_json',
      'gcp_project_id',
      'gcp_project_number',
      'service_account_email',
      'gcp_wif_pool_id',
      'gcp_wif_pool_provider_id',
      'authentication.initial_token.type',
      'client_id',
      'client_secret',
      'endpoint_uri',
      'scope',
      'pipelining',
    ],
    fieldStartIndex,
  )
  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.MQTT]: mqttOrderMap,
    [BridgeType.Webhook]: {
      ...createOrderObj(['url', 'headers', 'oauth2'], fieldStartIndex),
      ...createOrderObj(httpAdvancedProps, 70),
    },
    [BridgeType.AzureEventHubs]: azureOrderMap,
    [BridgeType.KafkaProducer]: kafkaProducerOrderMap,
    [BridgeType.KafkaConsumer]: azureOrderMap,
    [BridgeType.Confluent]: kafkaProducerOrderMap,
    [BridgeType.PgSQL]: pgSqlOrderMap,
    [BridgeType.TimescaleDB]: pgSqlOrderMap,
    [BridgeType.MatrixDB]: pgSqlOrderMap,
    [BridgeType.MySQL]: createOrderObj(
      ['server', 'database', 'username', 'password', 'ssl'],
      fieldStartIndex,
    ),
    [BridgeType.GCPProducer]: GCPProducerOrderMap,
    [BridgeType.GCPConsumer]: GCPProducerOrderMap,
    [BridgeType.BigQuery]: GCPProducerOrderMap,
    [BridgeType.Bigtable]: GCPProducerOrderMap,
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
        'sentinel_username',
        'sentinel_password',
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
      [
        'server',
        'parameters',
        'token',
        'org',
        'bucket',
        'database',
        'username',
        'password',
        'ping_with_auth',
        'ssl',
      ],
      fieldStartIndex,
    ),
    [BridgeType.AWSTimestream]: createOrderObj(
      [
        'server',
        'parameters.influxdb_type',
        'parameters.token',
        'parameters.org',
        'parameters.bucket',
        'parameters.ssl',
      ],
      fieldStartIndex,
    ),
    [BridgeType.IoTDB]: IoTDBOrderMap,
    [BridgeType.Elasticsearch]: IoTDBOrderMap,
    [BridgeType.AmazonKinesis]: createOrderObj(
      ['endpoint', 'aws_access_key_id', 'aws_secret_access_key'],
      fieldStartIndex,
    ),
    [BridgeType.GreptimeDB]: greptimeDBOrderMap,
    [BridgeType.EMQXTables]: greptimeDBOrderMap,
    [BridgeType.TDengine]: createOrderObj(
      ['server', 'username', 'password', 'token'],
      fieldStartIndex,
    ),
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
      [
        'server',
        'servers',
        'port',
        'username',
        'password',
        'virtual_host',
        'heartbeat',
        'timeout',
        'ssl',
      ],
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
    // [BridgeType.HStream]: createOrderObj(['url', 'grpc_timeout', 'ssl'], fieldStartIndex),
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
        'parameters.driver_type',
        'server',
        'parameters.database',
        'parameters.username',
        'parameters.password',
      ],
      fieldStartIndex,
    ),
    [BridgeType.Snowflake]: createOrderObj(
      [
        'server',
        'account',
        'dsn',
        'username',
        'password',
        'private_key_path',
        'private_key_password',
        'proxy',
        'ssl',
      ],
      fieldStartIndex,
    ),
    [BridgeType.SnowflakeStreaming]: createOrderObj(
      ['server', 'account', 'pipe_user', 'private_key', 'private_key_password', 'proxy'],
      fieldStartIndex,
    ),
    [BridgeType.Tablestore]: createOrderObj(
      [
        'endpoint',
        'instance_name',
        'access_key_id',
        'access_key_secret',
        'storage_model_type',
        'probe_table_name',
      ],
      fieldStartIndex,
    ),
    [BridgeType.S3Tables]: createOrderObj(
      [
        's3tables_arn',
        'access_key_id',
        'secret_access_key',
        's3_client.transport_options',
        ...S3TablesAdvancedProps,
      ],
      fieldStartIndex,
    ),
    [BridgeType.Doris]: createOrderObj(
      ['server', 'database', 'username', 'password'],
      fieldStartIndex,
    ),
    [BridgeType.AlloyDB]: pgSqlOrderMap,
    [BridgeType.CockroachDB]: pgSqlOrderMap,
    [BridgeType.Redshift]: pgSqlOrderMap,
    [BridgeType.AzureEventGrid]: mqttOrderMap,
    [BridgeType.QuasarDB]: createOrderObj(
      ['uri', 'dsn', 'username', 'password', 'cluster_public_key'],
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
  const GCPColClass = {
    'authentication.service_account_json': 'custom-col-24',
    'authentication.type': 'col-hidden',
  }
  const getDatalayersColClass = (formData: Record<string, any>): Record<string, string> => {
    const { driver_type } = formData?.parameters ?? {}
    if (/arrow_flight/i.test(driver_type)) {
      return {}
    }
    return { 'parameters.enable_prepared': 'col-hidden' }
  }
  const getKafkaProducerColClass = (formData: Record<string, any>): Record<string, string> => {
    const ret = { 'authentication.type': 'col-hidden' }
    if (/oauth/i.test(formData?.authentication?.mechanism)) {
      return { ...ret, 'authentication.mechanism': 'col-hidden' }
    }
    return ret
  }
  const getKafkaConsumerColClass = (formData: Record<string, any>) => {
    const ret = { allow_auto_topic_creation: 'col-hidden' }
    const extraClass = getKafkaProducerColClass(formData)
    return { ...ret, ...extraClass }
  }
  const typeColClassMap: Record<
    string,
    Record<string, string> | ((formData: Record<string, any>) => Record<string, string>)
  > = {
    [BridgeType.GCPProducer]: GCPColClass,
    [BridgeType.GCPConsumer]: GCPColClass,
    [BridgeType.BigQuery]: GCPColClass,
    [BridgeType.Bigtable]: GCPColClass,
    [BridgeType.KafkaConsumer]: getKafkaConsumerColClass,
    [BridgeType.MongoDB]: { 'parameters.mongo_type': 'col-hidden' },
    [BridgeType.Redis]: { 'parameters.redis_type': 'col-hidden' },
    [BridgeType.InfluxDB]: { 'parameters.influxdb_type': 'col-hidden' },
    [BridgeType.AWSTimestream]: { 'parameters.influxdb_type': 'col-hidden' },
    [BridgeType.S3]: { 'transport_options.ssl': 'col-ssl' },
    [BridgeType.S3Tables]: { 's3_client.transport_options.ssl': 'col-ssl' },
    [BridgeType.IoTDB]: { 'sql.dialect': 'col-hidden' },
    [BridgeType.Datalayers]: getDatalayersColClass,
    [BridgeType.KafkaProducer]: getKafkaProducerColClass,
    [BridgeType.Confluent]: getKafkaProducerColClass,
  }

  const pgSqlAdvancedFields = ['application_name', 'disable_prepared_statements']
  const greptimeDBAdvancedFields = ['ttl', 'ts_column']
  const mqttAdvancedFields = [
    'retry_interval',
    'bridge_mode',
    'max_inflight',
    'tcp_opts',
    /^tcp_opts\./,
  ]
  const advancedFieldsMap: Record<string, Array<string | RegExp>> = {
    [BridgeType.MQTT]: mqttAdvancedFields,
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
    [BridgeType.S3Tables]: S3TablesAdvancedProps,
    [BridgeType.PgSQL]: pgSqlAdvancedFields,
    [BridgeType.TimescaleDB]: pgSqlAdvancedFields,
    [BridgeType.MatrixDB]: pgSqlAdvancedFields,
    [BridgeType.GreptimeDB]: greptimeDBAdvancedFields,
    [BridgeType.EMQXTables]: greptimeDBAdvancedFields,
    [BridgeType.AlloyDB]: pgSqlAdvancedFields,
    [BridgeType.CockroachDB]: pgSqlAdvancedFields,
    [BridgeType.Redshift]: pgSqlAdvancedFields,
    [BridgeType.AzureEventGrid]: mqttAdvancedFields,
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
