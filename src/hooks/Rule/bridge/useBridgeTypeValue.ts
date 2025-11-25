import { BridgeDirection, BridgeType, ConnectorCategory } from '@/types/enum'
import { BridgeItem } from '@/types/rule'

// Mapping connectors to categories
export const connectorCategoryMap: Record<BridgeType, ConnectorCategory> = {
  // Message Streaming
  [BridgeType.MQTT]: ConnectorCategory.MessageStreaming,
  [BridgeType.KafkaProducer]: ConnectorCategory.MessageStreaming,
  [BridgeType.KafkaConsumer]: ConnectorCategory.MessageStreaming,
  [BridgeType.Pulsar]: ConnectorCategory.MessageStreaming,
  [BridgeType.RocketMQ]: ConnectorCategory.MessageStreaming,
  [BridgeType.RabbitMQ]: ConnectorCategory.MessageStreaming,
  [BridgeType.GCPProducer]: ConnectorCategory.MessageStreaming,
  [BridgeType.GCPConsumer]: ConnectorCategory.MessageStreaming,
  [BridgeType.AzureEventHubs]: ConnectorCategory.MessageStreaming,
  [BridgeType.AmazonKinesis]: ConnectorCategory.MessageStreaming,
  [BridgeType.Confluent]: ConnectorCategory.MessageStreaming,

  // Data Persistence
  [BridgeType.MySQL]: ConnectorCategory.DataPersistence,
  [BridgeType.PgSQL]: ConnectorCategory.DataPersistence,
  [BridgeType.MongoDB]: ConnectorCategory.DataPersistence,
  [BridgeType.Redis]: ConnectorCategory.DataPersistence,
  [BridgeType.Cassandra]: ConnectorCategory.DataPersistence,
  [BridgeType.DynamoDB]: ConnectorCategory.DataPersistence,
  [BridgeType.Couchbase]: ConnectorCategory.DataPersistence,
  [BridgeType.MicrosoftSQLServer]: ConnectorCategory.DataPersistence,
  [BridgeType.OracleDatabase]: ConnectorCategory.DataPersistence,
  [BridgeType.CockroachDB]: ConnectorCategory.DataPersistence,
  [BridgeType.AlloyDB]: ConnectorCategory.DataPersistence,
  [BridgeType.InfluxDB]: ConnectorCategory.DataPersistence,
  [BridgeType.TimescaleDB]: ConnectorCategory.DataPersistence,
  [BridgeType.TDengine]: ConnectorCategory.DataPersistence,
  [BridgeType.IoTDB]: ConnectorCategory.DataPersistence,
  [BridgeType.OpenTSDB]: ConnectorCategory.DataPersistence,
  [BridgeType.GreptimeDB]: ConnectorCategory.DataPersistence,
  [BridgeType.AWSTimestream]: ConnectorCategory.DataPersistence,
  [BridgeType.Datalayers]: ConnectorCategory.DataPersistence,

  // Data Analytics
  [BridgeType.ClickHouse]: ConnectorCategory.DataAnalytics,
  [BridgeType.Elasticsearch]: ConnectorCategory.DataAnalytics,
  [BridgeType.MatrixDB]: ConnectorCategory.DataAnalytics,
  [BridgeType.Snowflake]: ConnectorCategory.DataAnalytics,
  [BridgeType.SnowflakeStreaming]: ConnectorCategory.DataAnalytics,
  [BridgeType.BigQuery]: ConnectorCategory.DataAnalytics,
  [BridgeType.Redshift]: ConnectorCategory.DataAnalytics,
  [BridgeType.Doris]: ConnectorCategory.DataAnalytics,

  // Object Storage
  [BridgeType.S3]: ConnectorCategory.ObjectStorage,
  [BridgeType.S3Tables]: ConnectorCategory.ObjectStorage,
  [BridgeType.AzureBlobStorage]: ConnectorCategory.ObjectStorage,
  [BridgeType.Tablestore]: ConnectorCategory.ObjectStorage,

  // HTTP / Webhook
  [BridgeType.Webhook]: ConnectorCategory.HTTPWebhook,

  // Others
  [BridgeType.SysKeeperProxy]: ConnectorCategory.Others,
  [BridgeType.SysKeeperForwarder]: ConnectorCategory.Others,
  [BridgeType.DiskLog]: ConnectorCategory.Others,
}

const bridgesOrder = [
  BridgeType.MQTT,
  BridgeType.Webhook,
  BridgeType.KafkaProducer,
  BridgeType.KafkaConsumer,
  BridgeType.Confluent,
  BridgeType.Pulsar,
  BridgeType.RocketMQ,
  BridgeType.RabbitMQ,
  BridgeType.AzureEventHubs,
  BridgeType.AmazonKinesis,
  BridgeType.GCPProducer,
  BridgeType.GCPConsumer,
  BridgeType.MySQL,
  BridgeType.Redis,
  BridgeType.MongoDB,
  BridgeType.InfluxDB,
  BridgeType.PgSQL,
  BridgeType.TDengine,
  BridgeType.TimescaleDB,
  BridgeType.IoTDB,
  BridgeType.MatrixDB,
  BridgeType.OpenTSDB,
  BridgeType.GreptimeDB,
  BridgeType.ClickHouse,
  BridgeType.DynamoDB,
  BridgeType.Cassandra,
  BridgeType.MicrosoftSQLServer,
  BridgeType.OracleDatabase,
  // BridgeType.HStream,
  BridgeType.Elasticsearch,
  BridgeType.S3,
  BridgeType.AzureBlobStorage,
  BridgeType.Couchbase,
  BridgeType.SysKeeperProxy,
  BridgeType.SysKeeperForwarder,
  BridgeType.Datalayers,
  BridgeType.Snowflake,
  BridgeType.SnowflakeStreaming,
  BridgeType.Tablestore,
]
export const bridgeOrderIndex: Record<string, number> = bridgesOrder.reduce(
  (obj, type, index) => ({ ...obj, [type]: index }),
  {},
)

type TypeItem = {
  value: BridgeType
  label: string
}

export const useBridgeTypeValue = (): {
  bridgeTypeList: Array<TypeItem>
  egressBridgeTypeList: Array<TypeItem>
  getBridgeLabelByTypeValue: (typeValue: BridgeType) => string | undefined
  getBridgeGeneralType: (typeStr: string) => BridgeType
  getGeneralTypeLabel: (type: string) => string
} => {
  const { t, tl } = useI18nTl('RuleEngine')

  const bridgeTypeList = [
    { value: BridgeType.Webhook, label: t('Auth.HTTPServer') },
    { value: BridgeType.MQTT, label: t('RuleEngine.mqttBroker') },
    { value: BridgeType.KafkaProducer, label: `${tl('kafka')} ${tl('producer')}` },
    { value: BridgeType.KafkaConsumer, label: `${tl('kafka')} ${tl('consumer')}` },
    { value: BridgeType.GCPProducer, label: `${tl('gcpPubSub')}  ${tl('producer')}` },
    { value: BridgeType.GCPConsumer, label: `${tl('gcpPubSub')}  ${tl('consumer')}` },
    { value: BridgeType.MySQL, label: tl('mySQL') },
    { value: BridgeType.PgSQL, label: tl('pgSql') },
    { value: BridgeType.MongoDB, label: tl('mongoDB') },
    { value: BridgeType.InfluxDB, label: tl('influxDBLabel') },
    { value: BridgeType.TimescaleDB, label: tl('timescaleDB') },
    { value: BridgeType.Redis, label: tl('redis') },
    { value: BridgeType.MatrixDB, label: tl('matrixDB') },
    { value: BridgeType.TDengine, label: tl('TDengine') },
    { value: BridgeType.ClickHouse, label: tl('clickHouse') },
    { value: BridgeType.DynamoDB, label: tl('dynamoDB') },
    { value: BridgeType.Cassandra, label: tl('cassandra') },
    { value: BridgeType.RocketMQ, label: tl('rocketMQ') },
    { value: BridgeType.MicrosoftSQLServer, label: tl('microsoftSqlServer') },
    { value: BridgeType.IoTDB, label: tl('iotDB') },
    { value: BridgeType.OpenTSDB, label: tl('openTSDB') },
    { value: BridgeType.OracleDatabase, label: tl('oracleDatabase') },
    { value: BridgeType.RabbitMQ, label: tl('rabbitMQ') },
    { value: BridgeType.Pulsar, label: tl('pulsar') },
    // { value: BridgeType.HStream, label: tl('hStream') },
    { value: BridgeType.AzureEventHubs, label: tl('azureEventHubs') },
    { value: BridgeType.AmazonKinesis, label: tl('amazonKinesis') },
    { value: BridgeType.GreptimeDB, label: tl('greptimeDB') },
    { value: BridgeType.Confluent, label: `Confluent ${tl('producer')}` },
    { value: BridgeType.SysKeeperForwarder, label: tl('sysKeeperForwarder') },
    { value: BridgeType.Elasticsearch, label: 'Elasticsearch' },
    { value: BridgeType.S3, label: 'Amazon S3' },
    { value: BridgeType.AzureBlobStorage, label: 'Azure Blob Storage' },
    { value: BridgeType.Couchbase, label: 'Couchbase' },
    { value: BridgeType.Datalayers, label: 'Datalayers' },
    { value: BridgeType.Snowflake, label: 'Snowflake' },
    { value: BridgeType.SnowflakeStreaming, label: 'Snowflake Streaming' },
    { value: BridgeType.Tablestore, label: tl('tablestore') },
    { value: BridgeType.DiskLog, label: 'Disk Log' },
    { value: BridgeType.S3Tables, label: 'S3 Tables' },
    { value: BridgeType.Doris, label: 'Doris' },
    { value: BridgeType.BigQuery, label: 'BigQuery' },
    { value: BridgeType.AlloyDB, label: 'AlloyDB' },
    { value: BridgeType.CockroachDB, label: 'CockroachDB' },
    { value: BridgeType.Redshift, label: 'Redshift' },
    { value: BridgeType.AWSTimestream, label: 'Amazon Timestream' },
  ].sort((a, b) => (bridgeOrderIndex[a.value] ?? 99) - (bridgeOrderIndex[b.value] ?? 99))

  /**
   * use it in add action to rule
   */
  const egressBridgeTypeList = bridgeTypeList.filter(
    ({ value }) => !INGRESS_BRIDGE_TYPES.includes(value),
  )

  const getBridgeLabelByTypeValue = (typeValue: BridgeType) => {
    return getLabelFromValueInOptionList(typeValue, bridgeTypeList)
  }

  const typesWithMultiSpecificType = typesWithProducerAndConsumer
  /**
   * diff from specific type, for example, influxdb v1 v2 are all influxdb
   */
  const getBridgeGeneralType = (typeStr: string): BridgeType => {
    if (!typeStr) {
      return typeStr as BridgeType
    }
    const withMultiSpecificTypeIndex = typesWithMultiSpecificType.findIndex(
      (item) => typeStr.indexOf(item) > -1,
    )
    if (withMultiSpecificTypeIndex > -1) {
      return typesWithMultiSpecificType[withMultiSpecificTypeIndex]
    }
    return typeStr as BridgeType
  }

  const getGeneralTypeLabel = (rawType: string): string => {
    const type = getBridgeGeneralType(rawType)
    return getBridgeLabelByTypeValue(type) || ''
  }

  return {
    bridgeTypeList,
    egressBridgeTypeList,
    getBridgeLabelByTypeValue,
    getBridgeGeneralType,
    getGeneralTypeLabel,
  }
}

export const useConnectorTypeValue = (): {
  connectorTypeList: TypeItem[]
  getTypeStr: (type: string) => string
  searchQuery: Ref<string>
  filteredConnectorTypeList: ComputedRef<TypeItem[]>
  categorizedConnectorTypes: ComputedRef<
    Array<{
      category: ConnectorCategory
      connectors: TypeItem[]
    }>
  >
  getCategoryLabel: (category: ConnectorCategory) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const { bridgeTypeList } = useBridgeTypeValue()

  // const connectorTypeLabel = new Map([
  //   [BridgeType.KafkaProducer, `${tl('kafka')} ${tl('producer')}`],
  // ])

  const connectorTypeList = [...bridgeTypeList]
  connectorTypeList.splice(
    connectorTypeList.findIndex(({ value }) => value === BridgeType.SysKeeperForwarder),
    0,
    { value: BridgeType.SysKeeperProxy, label: tl('sysKeeperProxy') },
  )

  const getTypeStr = (type: string) => getLabelFromValueInOptionList(type, connectorTypeList)

  const searchQuery = ref('')

  const filteredConnectorTypeList = computed(() => {
    if (searchQuery.value.trim() === '') {
      return connectorTypeList
    }
    const reg = new RegExp(searchQuery.value.trim(), 'i')
    return connectorTypeList.filter((option) => reg.test(option.label))
  })

  // Category labels
  const getCategoryLabel = (category: ConnectorCategory): string => {
    const categoryLabels: Record<ConnectorCategory, string> = {
      [ConnectorCategory.MessageStreaming]: tl('categoryMessageStreaming'),
      [ConnectorCategory.DataPersistence]: tl('categoryDataPersistence'),
      [ConnectorCategory.DataAnalytics]: tl('categoryDataAnalytics'),
      [ConnectorCategory.ObjectStorage]: tl('categoryObjectStorage'),
      [ConnectorCategory.HTTPWebhook]: tl('categoryHTTPWebhook'),
      [ConnectorCategory.Others]: tl('categoryOthers'),
    }
    return categoryLabels[category] || category
  }

  // Categorize connectors
  const categorizedConnectorTypes = computed(() => {
    const filtered = filteredConnectorTypeList.value
    const categoryOrder = [
      ConnectorCategory.MessageStreaming,
      ConnectorCategory.HTTPWebhook,
      ConnectorCategory.DataPersistence,
      ConnectorCategory.DataAnalytics,
      ConnectorCategory.ObjectStorage,
      ConnectorCategory.Others,
    ]

    const categorized = categoryOrder
      .map((category) => ({
        category,
        connectors: filtered.filter((item) => connectorCategoryMap[item.value] === category),
      }))
      .filter((group) => group.connectors.length > 0) // Only show categories with connectors

    return categorized
  })

  return {
    connectorTypeList,
    getTypeStr,
    searchQuery,
    filteredConnectorTypeList,
    categorizedConnectorTypes,
    getCategoryLabel,
  }
}

export default useBridgeTypeValue

export interface BridgeTypeOptions {
  value: BridgeType
  label: string
  desc: string
  externalConfig?: Partial<BridgeItem>
}

export const typesWithProducerAndConsumer = [
  BridgeType.Pulsar,
  BridgeType.AzureEventHubs,
  BridgeType.AmazonKinesis,
]

export const consumerReg = /consumer/i

export const useBridgeTypeOptions = (): {
  searchQuery: Ref<string>
  getFilterBridgeOptions: () => BridgeTypeOptions[]
  bridgeTypeOptions: BridgeTypeOptions[]
} => {
  const { bridgeTypeList } = useBridgeTypeValue()

  const bridgeTypeOptions: Array<BridgeTypeOptions> = bridgeTypeList.map((item) => ({
    ...item,
    desc: '',
  }))

  const searchQuery = ref('')

  const getFilterBridgeOptions = () => {
    if (searchQuery.value.trim() === '') {
      return bridgeTypeOptions
    }
    return bridgeTypeOptions.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.value.trim().toLowerCase()),
    )
  }

  return {
    searchQuery,
    bridgeTypeOptions,
    getFilterBridgeOptions,
  }
}

export const useBridgeTypeIcon = (): {
  getBridgeIconKey: (value: string) => string
  getBridgeIcon: (type: string) => string
} => {
  const specialIconMap = {
    [BridgeType.Webhook]: 'http',
    [BridgeType.PgSQL]: 'postgresql',
    [BridgeType.AzureEventHubs]: 'azure_event_hub',
    [BridgeType.KafkaProducer]: 'kafka',
    [BridgeType.KafkaConsumer]: 'kafka',
    [BridgeType.GCPProducer]: 'gcp_pubsub',
    [BridgeType.GCPConsumer]: 'gcp_pubsub',
    [BridgeType.Confluent]: 'confluent',
    [BridgeType.SysKeeperForwarder]: 'syskeeper',
    [BridgeType.SysKeeperProxy]: 'syskeeper',
    [BridgeType.SnowflakeStreaming]: BridgeType.Snowflake,
  }

  const { getBridgeGeneralType } = useBridgeTypeValue()
  const getBridgeIconKey = (value: string) => {
    const ret = getBridgeGeneralType(value)
    if (ret && ret in specialIconMap) {
      return specialIconMap[ret as keyof typeof specialIconMap]
    }
    return ret
  }

  const getBridgeIcon = (type: string): string => {
    if (!type) {
      return ''
    }
    try {
      return getImg(`img/${getBridgeIconKey(type)}.png`)
    } catch (error) {
      console.error(error)
      return ''
    }
  }
  return {
    getBridgeIconKey,
    getBridgeIcon,
  }
}

export const useConnectorDirection = (): {
  judgeConnectorTypeDirection: (bridge: BridgeType) => BridgeDirection
} => {
  const { getBridgeGeneralType } = useBridgeTypeValue()
  const judgeConnectorTypeDirection = (rawType: BridgeType) => {
    const type = getBridgeGeneralType(rawType)
    if (INGRESS_BRIDGE_TYPES.includes(rawType)) {
      return BridgeDirection.Ingress
    }
    if (CONNECTOR_TYPES_WITH_TWO_DIRECTIONS.includes(type)) {
      return BridgeDirection.Both
    }
    if (typesWithProducerAndConsumer.includes(type)) {
      return consumerReg.test(rawType) ? BridgeDirection.Ingress : BridgeDirection.Egress
    }

    return BridgeDirection.Egress
  }

  return {
    judgeConnectorTypeDirection,
  }
}

export const useConnectorSchema = (): {
  getTypeRefKey: (type: string) => string
  typeWithMultipleRefKeyMap: Map<BridgeType, Array<string>>
  getTypeByConnectorSchemaRef: (ref: string) => string
} => {
  const refPrefix = `bridge_`
  const refSuffix = 'post_connector'
  const getRef = (type: string, prefix?: string, suffix?: string) =>
    `${prefix ?? refPrefix}${type}.${suffix ?? refSuffix}`

  const specialTypeRefKeyMap: Map<string, string> = new Map([
    [BridgeType.MQTT, getRef(BridgeType.MQTT, 'connector_')],
    [BridgeType.KafkaProducer, getRef('kafka')],
    [BridgeType.KafkaConsumer, getRef(BridgeType.KafkaConsumer, '')],
    [BridgeType.AzureEventHubs, getRef('azure_event_hub')],
    [BridgeType.Confluent, getRef('confluent', '')],
    [BridgeType.PgSQL, getRef('postgres', 'connector_')],
    [BridgeType.GCPProducer, getRef(BridgeType.GCPProducer, '')],
    [BridgeType.Redis, getRef(BridgeType.Redis, '')],
    [BridgeType.SysKeeperForwarder, getRef(BridgeType.SysKeeperForwarder, '', 'post')],
    [BridgeType.SysKeeperProxy, getRef(BridgeType.SysKeeperProxy, 'connector_', 'post')],
    [BridgeType.Elasticsearch, getRef(BridgeType.Elasticsearch, '', 'post')],
    [BridgeType.TDengine, getRef(`${BridgeType.TDengine}_connector`, '', 'post')],
    [BridgeType.OpenTSDB, getRef(`${BridgeType.OpenTSDB}_connector`, '', 'post')],
    [BridgeType.Cassandra, getRef('cassa')],
    [BridgeType.RabbitMQ, getRef(BridgeType.RabbitMQ, '', 'post')],
    [BridgeType.RocketMQ, getRef(BridgeType.RocketMQ, '')],
    [BridgeType.GCPConsumer, getRef(BridgeType.GCPConsumer, '')],
    [BridgeType.Pulsar, getRef(BridgeType.Pulsar, '', 'post')],
    [BridgeType.AzureBlobStorage, getRef(BridgeType.AzureBlobStorage, 'connector_')],
    [BridgeType.Couchbase, getRef(BridgeType.Couchbase, 'connector_')],
    [BridgeType.Snowflake, getRef('snowflake_aggregated', 'connector_')],
    [BridgeType.SnowflakeStreaming, getRef(BridgeType.SnowflakeStreaming, 'connector_')],
    [BridgeType.DiskLog, getRef(BridgeType.DiskLog, 'connector_')],
    [BridgeType.S3Tables, getRef(BridgeType.S3Tables, 'connector_')],
    [BridgeType.Doris, getRef(BridgeType.Doris, 'connector_')],
    [BridgeType.BigQuery, getRef(BridgeType.BigQuery, 'connector_')],
    [BridgeType.AlloyDB, getRef(BridgeType.AlloyDB, 'connector_')],
    [BridgeType.CockroachDB, getRef(BridgeType.CockroachDB, 'connector_')],
    [BridgeType.Redshift, getRef(BridgeType.Redshift, 'connector_')],
    [BridgeType.AWSTimestream, getRef(BridgeType.AWSTimestream, 'connector_')],
  ])

  const typeWithMultipleRefKeyMap: Map<BridgeType, Array<string>> = new Map([
    [BridgeType.IoTDB, ['iotdb.post_restapi', 'iotdb.post_thrift']],
  ])

  const getTypeRefKey = (type: string): string => {
    const ref = specialTypeRefKeyMap.get(type)
    return ref ?? getRef(type)
  }

  const getTypeByConnectorSchemaRef = (ref: string) => {
    const refKey = ref.replace(/^.+\//, '')
    for (const [type, refValue] of specialTypeRefKeyMap.entries()) {
      if (refValue === refKey) {
        return type
      }
    }
    for (const [type, refValueArr] of typeWithMultipleRefKeyMap.entries()) {
      if (refValueArr.includes(refKey)) {
        return type
      }
    }
    return refKey
      .replace(new RegExp(`${refPrefix}`), '')
      .replace(new RegExp(`\\.${refSuffix}\\w*`), '')
  }

  return {
    typeWithMultipleRefKeyMap,
    getTypeRefKey,
    getTypeByConnectorSchemaRef,
  }
}

export const useActionSchema = (): {
  getSchemaRefByType: (type: string, suffix?: string) => string
  getTypeByActionSchemaRef: (ref: string) => string
} => {
  const refPrefix = 'bridge_'
  const refSuffix = '.post_bridge_v2'

  const getRef = (type: string, prefix?: string) => (prefix ?? refPrefix) + type + refSuffix

  const specialActionTypeRefKeyMap: Map<string, string> = new Map([
    [BridgeType.MQTT, getRef('mqtt_publisher')],
    [BridgeType.AzureEventHubs, getRef('azure_event_hub')],
    [BridgeType.Confluent, getRef('confluent', '')],
    [BridgeType.GCPProducer, getRef('gcp_pubsub_producer', '')],
    [BridgeType.Redis, getRef(BridgeType.Redis, '')],
    [BridgeType.SysKeeperForwarder, getRef('syskeeper', '')],
    [BridgeType.KafkaProducer, getRef('kafka')],
    [BridgeType.Cassandra, getRef('cassa')],
    [BridgeType.RocketMQ, getRef(BridgeType.RocketMQ, '')],
    [BridgeType.Pulsar, getRef(BridgeType.Pulsar, '')],
    [BridgeType.AzureBlobStorage, getRef(BridgeType.AzureBlobStorage, 'action_')],
    [BridgeType.Couchbase, getRef(BridgeType.Couchbase, 'action_')],
    [BridgeType.Snowflake, getRef('snowflake_aggregated', 'action_')],
    [BridgeType.SnowflakeStreaming, getRef(BridgeType.SnowflakeStreaming, 'action_')],
    [BridgeType.DiskLog, getRef(BridgeType.DiskLog, 'action_')],
    [BridgeType.S3Tables, getRef(BridgeType.S3Tables, 'action_')],
    [BridgeType.Doris, getRef(BridgeType.Doris, 'action_')],
    [BridgeType.BigQuery, getRef(BridgeType.BigQuery, 'action_')],
    [BridgeType.AlloyDB, getRef(BridgeType.AlloyDB, 'action_')],
    [BridgeType.CockroachDB, getRef(BridgeType.CockroachDB, 'action_')],
    [BridgeType.Redshift, getRef(BridgeType.Redshift, 'action_')],
    [BridgeType.AWSTimestream, getRef(BridgeType.AWSTimestream, 'action_')],
  ])
  const getSchemaRefByType = (type: string) => {
    const ref = specialActionTypeRefKeyMap.get(type)
    return ref ?? getRef(type)
  }

  const getTypeByActionSchemaRef = (ref: string) => {
    const refKey = ref.replace(/^.+\//, '')
    for (const [type, refValue] of specialActionTypeRefKeyMap.entries()) {
      if (refValue === refKey) {
        return type
      }
    }
    // 1. remove path 2. remove prefix 3. remove suffix
    const ret = refKey
      .replace(new RegExp(`${refPrefix}`), '')
      .replace(new RegExp(`${refSuffix}\\w*`), '')
    return ret
  }

  return {
    getSchemaRefByType,
    getTypeByActionSchemaRef,
  }
}

export const useSourceSchema = (): {
  getSchemaRefByType: (type: string, suffix?: string) => string
  getTypeBySourceSchemaRef: (ref: string) => string
} => {
  const refPrefix = 'bridge_'
  const refSuffix = '.post_source'

  const getRef = (type: string, prefix?: string, suffix?: string) => {
    return (prefix ?? refPrefix) + type + (suffix ?? refSuffix)
  }

  const specialActionTypeRefKeyMap: Map<string, string> = new Map([
    [BridgeType.MQTT, getRef('mqtt_publisher')],
    [BridgeType.GCPConsumer, getRef(BridgeType.GCPConsumer, '')],
    [BridgeType.KafkaConsumer, getRef(BridgeType.KafkaConsumer, '')],
  ])
  const getSchemaRefByType = (type: string) => {
    const ref = specialActionTypeRefKeyMap.get(type)
    return ref ?? getRef(type)
  }

  const getTypeBySourceSchemaRef = (ref: string) => {
    const refKey = ref.replace(/^.+\//, '')
    for (const [type, refValue] of specialActionTypeRefKeyMap.entries()) {
      if (refValue === refKey) {
        return type
      }
    }
    // 1. remove path 2. remove prefix 3. remove suffix
    const ret = refKey
      .replace(new RegExp(`${refPrefix}`), '')
      .replace(new RegExp(`${refSuffix}\\w*`), '')
    return ret
  }

  return {
    getSchemaRefByType,
    getTypeBySourceSchemaRef,
  }
}
