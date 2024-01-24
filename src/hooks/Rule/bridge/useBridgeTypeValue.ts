import {
  BRIDGE_OLD_TYPES_MAP,
  INGRESS_BRIDGE_TYPES,
  SUPPORTED_CONNECTOR_TYPES,
} from '@/common/constants'
import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem, MQTTBridge } from '@/types/rule'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

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
  BridgeType.HStream,
  BridgeType.Elasticsearch,
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
    { value: BridgeType.HStream, label: tl('hStream') },
    { value: BridgeType.AzureEventHubs, label: tl('azureEventHubs') },
    { value: BridgeType.AmazonKinesis, label: tl('amazonKinesis') },
    { value: BridgeType.GreptimeDB, label: tl('greptimeDB') },
    { value: BridgeType.Confluent, label: `Confluent ${tl('producer')}` },
    { value: BridgeType.SysKeeperForwarder, label: tl('sysKeeperForwarder') },
    { value: BridgeType.Elasticsearch, label: 'Elasticsearch' },
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

export const useOldNewType = (): {
  BRIDGE_OLD_TYPES_MAP: Map<string, Array<string>>
  getNewType: (oldType: string) => string | undefined
} => {
  const getNewType = (oldType: string) => {
    for (const [newType, oldTypeArr] of BRIDGE_OLD_TYPES_MAP.entries()) {
      if (oldTypeArr.includes(oldType)) {
        return newType
      }
    }
    return undefined
  }
  return {
    BRIDGE_OLD_TYPES_MAP,
    getNewType,
  }
}

export const isConnectorSupported = (type: string): boolean =>
  SUPPORTED_CONNECTOR_TYPES.includes(type as BridgeType)

export const useConnectorTypeValue = (): {
  connectorTypeList: TypeItem[]
  getTypeStr: (type: string) => string
  searchQuery: Ref<string>
  filteredConnectorTypeList: ComputedRef<TypeItem[]>
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

  return {
    connectorTypeList,
    getTypeStr,
    searchQuery,
    filteredConnectorTypeList,
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
  const { tl, t } = useI18nTl('RuleEngine')
  const { bridgeTypeList } = useBridgeTypeValue()

  const descMap = new Map([
    [BridgeType.Webhook, tl('bridgeDescHTTP')],
    [BridgeType.MQTT, tl('bridgeDescMQTT')],
    [BridgeType.InfluxDB, t('RuleEngine.egressDataBaseDesc', { name: tl('influxDBLabel') })],
    [BridgeType.MySQL, t('RuleEngine.egressDataBaseDesc', { name: tl('mySQL') })],
    [BridgeType.Redis, t('RuleEngine.egressDataBaseDesc', { name: tl('redis') })],
    [BridgeType.MongoDB, t('RuleEngine.egressDataBaseDesc', { name: tl('mongoDB') })],
    [BridgeType.PgSQL, t('RuleEngine.egressDataBaseDesc', { name: tl('pgSql') })],
    [BridgeType.TimescaleDB, t('RuleEngine.egressDataBaseDesc', { name: tl('timescaleDB') })],
    [BridgeType.MatrixDB, t('RuleEngine.egressDataBaseDesc', { name: tl('matrixDB') })],
    [BridgeType.TDengine, t('RuleEngine.egressDataBaseDesc', { name: tl('TDengine') })],
    [BridgeType.ClickHouse, t('RuleEngine.egressDataBaseDesc', { name: tl('clickHouse') })],
    [BridgeType.DynamoDB, t('RuleEngine.egressDataBaseDesc', { name: tl('dynamoDB') })],
    [BridgeType.Cassandra, t('RuleEngine.egressDataBaseDesc', { name: tl('cassandra') })],
    [BridgeType.RocketMQ, t('RuleEngine.bridgeDataToDesc', { name: tl('rocketMQ') })],
    [
      BridgeType.MicrosoftSQLServer,
      t('RuleEngine.egressDataBaseDesc', { name: tl('microsoftSqlServer') }),
    ],
    [BridgeType.IoTDB, t('RuleEngine.egressDataBaseDesc', { name: tl('iotDB') })],
    [BridgeType.OpenTSDB, t('RuleEngine.egressDataBaseDesc', { name: tl('openTSDB') })],
    [BridgeType.OracleDatabase, t('RuleEngine.egressDataBaseDesc', { name: tl('oracleDatabase') })],
    [BridgeType.RabbitMQ, t('RuleEngine.bridgeDataToDesc', { name: tl('rabbitMQ') })],
    [BridgeType.Pulsar, t('RuleEngine.bridgeDataToDesc', { name: tl('pulsar') })],
    [BridgeType.HStream, t('RuleEngine.egressDataBaseDesc', { name: tl('hStream') })],
    [BridgeType.AzureEventHubs, t('RuleEngine.bridgeDataToDesc', { name: tl('azureEventHubs') })],
    [BridgeType.AmazonKinesis, t('RuleEngine.bridgeDataToDesc', { name: tl('amazonKinesis') })],
    [BridgeType.GreptimeDB, t('RuleEngine.egressDataBaseDesc', { name: tl('greptimeDB') })],
  ])

  const bridgeTypeOptions: Array<BridgeTypeOptions> = bridgeTypeList.map((item) => ({
    ...item,
    desc: descMap.get(item.value) || '',
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
      return require(`@/assets/img/${getBridgeIconKey(type)}.png`)
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

export const useBridgeDirection = (): {
  judgeBridgeDirection: (bridge: BridgeItem) => BridgeDirection
} => {
  const { getBridgeGeneralType } = useBridgeTypeValue()
  const judgeBridgeDirection = (bridge: BridgeItem): BridgeDirection => {
    const { type: rawType } = bridge
    const type = getBridgeGeneralType(rawType)
    // FOR MQTT
    if (type === BridgeType.MQTT) {
      const { ingress, egress } = bridge as MQTTBridge
      const withIngress = !!ingress?.remote?.topic
      const withEgress = !!egress?.remote?.topic
      if (withIngress && withEgress) {
        return BridgeDirection.Both
      } else if (withIngress) {
        return BridgeDirection.Ingress
      }
      return BridgeDirection.Egress
    } else if (INGRESS_BRIDGE_TYPES.includes(rawType)) {
      return BridgeDirection.Ingress
    }
    if (typesWithProducerAndConsumer.includes(type)) {
      return consumerReg.test(rawType) ? BridgeDirection.Ingress : BridgeDirection.Egress
    }

    return BridgeDirection.Egress
  }

  return {
    judgeBridgeDirection,
  }
}

export const useBridgeSchema = (): {
  getSchemaRefByType: (type: string, suffix?: string) => string
  getTypeByBridgeSchemaRef: (ref: string) => string
} => {
  const refPrefix = 'bridge_'
  const refSuffix = '.post'

  const getRef = (type: string, suffix?: string) => {
    const finalSuffix = `${refSuffix}${suffix || ''}`
    return refPrefix + type + finalSuffix
  }

  const specialBridgeTypeRefKeyMap: Map<string, string> = new Map([
    [BridgeType.Cassandra, getRef('cassa')],
    [BridgeType.AmazonKinesis, getRef('kinesis', '_producer')],
    [BridgeType.GCPConsumer, getRef('gcp_pubsub', '_consumer')],
    [BridgeType.GreptimeDB, getRef('greptimedb', '_grpc_v1')],
  ])

  const getSchemaRefByType = (type: string) => {
    const ref = specialBridgeTypeRefKeyMap.get(type)
    return ref ?? getRef(type)
  }

  const getTypeByBridgeSchemaRef = (ref: string) => {
    const refKey = ref.replace(/^.+\//, '')
    for (const [type, refValue] of specialBridgeTypeRefKeyMap.entries()) {
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
    getTypeByBridgeSchemaRef,
  }
}

export const useConnectorSchema = (): {
  getTypeRefKey: (type: string) => string
  getTypeByConnectorSchemaRef: (ref: string) => string
} => {
  const refPrefix = `bridge_`
  const refSuffix = 'post_connector'
  const getRef = (type: string, prefix?: string, suffix?: string) =>
    `${prefix ?? refPrefix}${type}.${suffix ?? refSuffix}`

  const specialTypeRefKeyMap: Map<string, string> = new Map([
    [BridgeType.MQTT, getRef(BridgeType.MQTT, 'connector_')],
    [BridgeType.KafkaProducer, getRef('kafka')],
    [BridgeType.AzureEventHubs, getRef('azure_event_hub')],
    [BridgeType.Confluent, getRef('confluent', '')],
    [BridgeType.PgSQL, getRef('postgres', 'connector_')],
    [BridgeType.GCPProducer, getRef(BridgeType.GCPProducer, '')],
    [BridgeType.Redis, getRef(BridgeType.Redis, '')],
    [BridgeType.SysKeeperForwarder, getRef(BridgeType.SysKeeperForwarder, '', 'post')],
    [BridgeType.SysKeeperProxy, getRef(BridgeType.SysKeeperProxy, 'connector_', 'post')],
    [BridgeType.IoTDB, getRef(BridgeType.IoTDB, '', 'post')],
    [BridgeType.Elasticsearch, getRef(BridgeType.Elasticsearch, '', 'post')],
    [BridgeType.OpenTSDB, getRef(`${BridgeType.OpenTSDB}_connector`, '', 'post')],
    [BridgeType.Cassandra, getRef('cassa')],
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
    return refKey
      .replace(new RegExp(`${refPrefix}`), '')
      .replace(new RegExp(`\\.${refSuffix}\\w*`), '')
  }

  return {
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
    [BridgeType.Cassandra, getRef('cassa')],
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
