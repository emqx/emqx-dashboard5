import { BridgeType } from '@/types/enum'
import { isFunction } from 'lodash'
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

  const getPathInParameters = (key: string) => `parameters.${key}`
  const getPathArrInParameters = (keyArr: Array<string>): Array<string> =>
    keyArr.map(getPathInParameters)

  const commonAdvancedFields = [
    'pool_type',
    'pool_size',
    'connect_timeout',
    'max_retries',
    'parameters.max_retries',
    ...resourceOptFields,
  ]

  const baseFields = ['name', 'connector', 'description']
  const fieldStartIndex = baseFields.length
  const baseOrderMap = {
    ...createOrderObj(baseFields, 0),
    ...createOrderObj(commonAdvancedFields, 99),
  }

  const httpAdvancedFields = [`parameters.max_retries`]

  const pgSqlOrderMap = createOrderObj(
    ['parameters.sql', 'parameters.prepare_statement'],
    fieldStartIndex,
  )

  const kafkaProducerAdvancedProps = getPathArrInParameters([
    'max_batch_bytes',
    'required_acks',
    'partition_count_refresh_interval',
    'max_inflight',
    'query_mode',
    'sync_query_timeout',
    'buffer',
    'buffer.mode',
    'buffer.per_partition_limit',
    'buffer.segment_bytes',
    'buffer.memory_overload_protection',
  ])

  const kafkaConsumerAdvancedProps = getPathArrInParameters([
    'max_batch_bytes',
    'offset_commit_interval_seconds',
  ])

  const HStreamAdvancedProps = getPathArrInParameters([
    'grpc_flush_timeout',
    'aggregation_pool_size',
    'max_batches',
    'writer_pool_size',
    'batch_size',
    'batch_interval',
  ])

  const pulsarAdvancedProps = getPathArrInParameters([
    'send_buffer',
    'batch_size',
    'max_batch_bytes',
    'sync_timeout',
    'buffer.mode',
    'buffer.per_partition_limit',
    'buffer.segment_bytes',
    'buffer.memory_overload_protection',
  ])

  const kafkaProducerPropsOrderMap = {
    ...createOrderObj(
      getPathArrInParameters([
        'topic',
        'kafka_headers',
        'kafka_header_value_encode_mode',
        'kafka_ext_headers',
        'message',
        'message.key',
        'message.value',
        'message.timestamp',
        'compression',
        'partition_strategy',
        'partitions_limit',
      ]),
      fieldStartIndex,
    ),
    ...createOrderObj(kafkaProducerAdvancedProps, 70),
  }
  const propsOrderTypeMap: Record<string, Record<string, number>> = {
    [BridgeType.Webhook]: {
      ...createOrderObj(
        getPathArrInParameters(['path', 'method', 'headers', 'body']),
        fieldStartIndex,
      ),
      ...createOrderObj(httpAdvancedFields, 70),
    },
    [BridgeType.MQTT]: createOrderObj(
      getPathArrInParameters(['topic', 'qos', 'retain', 'payload']),
      fieldStartIndex,
    ),
    [BridgeType.MySQL]: createOrderObj(['sql'], fieldStartIndex),
    [BridgeType.Redis]: createOrderObj(['command_template'], fieldStartIndex),
    [BridgeType.GCPProducer]: createOrderObj(
      getPathArrInParameters([
        'pubsub_topic',
        'payload_template',
        'attributes_template',
        'ordering_key_template',
      ]),
      fieldStartIndex,
    ),
    [BridgeType.GCPConsumer]: createOrderObj(
      ['pubsub_topic', 'consumer.pull_max_messages'],
      fieldStartIndex,
    ),
    [BridgeType.MongoDB]: createOrderObj(['collection', 'payload_template'], fieldStartIndex),
    [BridgeType.PgSQL]: pgSqlOrderMap,
    [BridgeType.TimescaleDB]: pgSqlOrderMap,
    [BridgeType.MatrixDB]: pgSqlOrderMap,
    [BridgeType.ClickHouse]: createOrderObj(
      getPathArrInParameters(['batch_value_separator', 'sql']),
      fieldStartIndex,
    ),
    [BridgeType.DynamoDB]: createOrderObj(
      getPathArrInParameters(['table', 'hash_key', 'range_key', 'template']),
      fieldStartIndex,
    ),
    [BridgeType.RocketMQ]: createOrderObj(
      getPathArrInParameters([
        'topic',
        'template',
        'strategy',
        'refresh_interval',
        'send_buffer',
        'sync_timeout',
      ]),
      fieldStartIndex,
    ),
    [BridgeType.IoTDB]: createOrderObj(
      ['device_id', 'is_aligned', 'data'].map((k) => `parameters.${k}`),
      fieldStartIndex,
    ),
    [BridgeType.RabbitMQ]: createOrderObj(
      getPathArrInParameters([
        /* action */
        'exchange',
        'routing_key',
        'delivery_mode',
        'wait_for_publish_confirmations',
        'publish_confirmation_timeout',
        'payload_template',
        /* source */
        'queue',
        'no_ack',
        'wait_for_publish_confirmations',
      ]),
      fieldStartIndex,
    ),
    [BridgeType.HStream]: createOrderObj(
      [
        ...getPathArrInParameters(['stream', 'partition_key', 'record_template']),
        ...HStreamAdvancedProps,
      ],
      fieldStartIndex,
    ),
    [BridgeType.KafkaProducer]: kafkaProducerPropsOrderMap,
    [BridgeType.KafkaConsumer]: createOrderObj(
      [
        ...getPathArrInParameters([
          'topic',
          'key_encoding_mode',
          'value_encoding_mode',
          'offset_reset_policy',
        ]),
        ...kafkaConsumerAdvancedProps,
      ],
      fieldStartIndex,
    ),
    [BridgeType.AzureEventHubs]: kafkaProducerPropsOrderMap,
    [BridgeType.Confluent]: kafkaProducerPropsOrderMap,
    [BridgeType.AmazonKinesis]: createOrderObj(
      getPathArrInParameters(['stream_name', 'partition_key', 'payload_template']),
      fieldStartIndex,
    ),
    [BridgeType.GreptimeDB]: createOrderObj(
      getPathArrInParameters(['write_syntax', 'precision']),
      fieldStartIndex,
    ),
    [BridgeType.SysKeeperForwarder]: createOrderObj(
      getPathArrInParameters(['target_topic', 'target_qos', 'template']),
      fieldStartIndex,
    ),
    [BridgeType.Elasticsearch]: createOrderObj(
      ['index', 'id', 'doc_as_upsert', 'doc', 'routing', 'overwrite', 'max_retries'],
      fieldStartIndex,
    ),
    [BridgeType.TDengine]: createOrderObj(
      getPathArrInParameters(['database', 'sql']),
      fieldStartIndex,
    ),
    [BridgeType.S3]: createOrderObj(
      [
        'parameters',
        'bucket',
        'key',
        'acl',
        'content',
        'container',
        'type',
        'column_order',
        'aggregation',
        'max_records',
        'time_interval',
        'headers',
        'min_part_size',
        'max_part_size',
      ],
      fieldStartIndex,
    ),
    [BridgeType.AzureBlobStorage]: createOrderObj(
      [
        'parameters',
        'container',
        'blob',
        'content',
        'type',
        'column_order',
        'aggregation',
        'max_records',
        'time_interval',
      ],
      fieldStartIndex,
    ),
    [BridgeType.Pulsar]: createOrderObj(
      [
        ...getPathArrInParameters([
          'pulsar_topic',
          'strategy',
          'compression',
          'retention_period',
          'message.key',
          'message.value',
        ]),
        ...pulsarAdvancedProps,
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

  const kafkaProducerColClassMap = { 'parameters.topic': 'col-need-row' }
  const S3ColClassMap = (formData: Record<string, any>): Record<string, string> => {
    if (/direct/i.test(formData?.parameters?.mode)) {
      return { 'parameters.mode': 'col-hidden', 'resource_opts.batch_size': 'col-hidden' }
    }
    return { 'parameters.mode': 'col-hidden' }
  }
  const typeColClassMap: Record<
    string,
    Record<string, string> | ((formData: Record<string, any>) => Record<string, string>)
  > = {
    [BridgeType.MicrosoftSQLServer]: { driver: 'dividing-line-below' },
    [BridgeType.KafkaProducer]: kafkaProducerColClassMap,
    [BridgeType.AzureEventHubs]: kafkaProducerColClassMap,
    [BridgeType.Confluent]: kafkaProducerColClassMap,
    [BridgeType.Elasticsearch]: { 'parameters.action': 'col-hidden' },
    [BridgeType.S3]: S3ColClassMap,
    [BridgeType.AzureBlobStorage]: S3ColClassMap,
  }

  const advancedFieldsMap: Record<string, Array<string>> = {
    [BridgeType.Webhook]: [`parameters.max_retries`],
    [BridgeType.RocketMQ]: getPathArrInParameters([
      'strategy',
      'refresh_interval',
      'send_buffer',
      'sync_timeout',
    ]),
    [BridgeType.RabbitMQ]: ['parameters.publish_confirmation_timeout'],
    [BridgeType.ClickHouse]: ['batch_value_separator'],
    [BridgeType.GreptimeDB]: ['precision'],
    [BridgeType.GCPConsumer]: ['pipelining'],
    [BridgeType.KafkaProducer]: kafkaProducerAdvancedProps,
    [BridgeType.AzureEventHubs]: kafkaProducerAdvancedProps,
    [BridgeType.Confluent]: kafkaProducerAdvancedProps,
    [BridgeType.KafkaConsumer]: kafkaConsumerAdvancedProps,
    [BridgeType.HStream]: HStreamAdvancedProps,
    [BridgeType.Pulsar]: pulsarAdvancedProps,
    [BridgeType.S3]: getPathArrInParameters(['headers', 'min_part_size', 'max_part_size']),
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
    if (props.hideName) {
      connectorClass = 'dividing-line-below'
      nameClass = 'col-hidden'
    } else {
      descClass = singleFieldWithLineBelow
    }

    return { nameClass, connectorClass, descClass }
  }

  const { syncEtcFieldsClassMap } = useSyncConfiguration(bridgeRecord)
  const customColClass = computed(() => {
    let externalClass = props.type ? typeColClassMap[props.type] || {} : {}
    if (isFunction(externalClass)) {
      externalClass = externalClass(bridgeRecord.value)
    }
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
