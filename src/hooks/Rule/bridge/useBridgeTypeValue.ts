import { INGRESS_BRIDGE_TYPES, SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem, MQTTBridge } from '@/types/rule'
import { escapeRegExp } from 'lodash'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'

const bridgesOrder = [
  BridgeType.Webhook,
  BridgeType.MQTT,
  BridgeType.KafkaProducer,
  BridgeType.KafkaConsumer,
  BridgeType.Confluent,
  BridgeType.Pulsar,
  BridgeType.RocketMQ,
  BridgeType.RabbitMQ,
  BridgeType.AzureEventHubs,
  BridgeType.AmazonKinesis,
  BridgeType.GCP,
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
    { value: BridgeType.GCP, label: tl('gcpPubSub') },
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
  ].sort((a, b) => (bridgeOrderIndex[a.value] || 99) - (bridgeOrderIndex[b.value] || 99))

  /**
   * use it in add action to rule
   */
  const egressBridgeTypeList = bridgeTypeList.filter(
    ({ value }) => !INGRESS_BRIDGE_TYPES.includes(value),
  )

  const getBridgeLabelByTypeValue = (typeValue: BridgeType) => {
    return getLabelFromValueInOptionList(typeValue, bridgeTypeList)
  }

  /**
   * Not a specific type, but a general type, such as influxdb v1 v2 are all influxdb
   */
  const typesWithMultiSpecificType = [
    BridgeType.InfluxDB,
    BridgeType.Redis,
    BridgeType.MongoDB,
    ...typesWithProducerAndConsumer,
  ]
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

export const isConnectorSupported = (type: string): boolean =>
  SUPPORTED_CONNECTOR_TYPES.includes(type as BridgeType)

export const useConnectorTypeValue = (): {
  connectorTypeList: TypeItem[]
  getTypeStr: (type: string) => string
  searchQuery: Ref<string>
  filteredConnectorTypeList: ComputedRef<TypeItem[]>
} => {
  const { bridgeTypeList, getGeneralTypeLabel } = useBridgeTypeValue()

  // const connectorTypeLabel = new Map([
  //   [BridgeType.KafkaProducer, `${tl('kafka')} ${tl('producer')}`],
  // ])

  const connectorTypeList = bridgeTypeList

  const getTypeStr = (type: string) => getGeneralTypeLabel(type) || type

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
  BridgeType.GCP,
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
    [BridgeType.Kafka, t('RuleEngine.bridgeDataToDesc', { name: tl('kafka') })],
    [BridgeType.InfluxDB, t('RuleEngine.egressDataBaseDesc', { name: tl('influxDBLabel') })],
    [BridgeType.MySQL, t('RuleEngine.egressDataBaseDesc', { name: tl('mySQL') })],
    [BridgeType.Redis, t('RuleEngine.egressDataBaseDesc', { name: tl('redis') })],
    [BridgeType.GCP, t('RuleEngine.bridgeDataToDesc', { name: tl('gcpPubSub') })],
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
  getTypeBySchemaRef: (ref: string) => string
} => {
  const refPrefix = 'bridge_'
  const refSuffix = '.post'
  const refSuffixMap: Record<string, string> = {
    producer: `${refSuffix}_producer`,
    consumer: `${refSuffix}_consumer`,
  }
  const typeReg = new RegExp(
    `${escapeRegExp(refPrefix)}(.+)(?:${escapeRegExp(refSuffix)}|${Object.values(refSuffixMap)
      .map(escapeRegExp)
      .join('|')})`,
  )

  const getSchemaRefByType = (type: string, suffix?: string) => {
    const finalSuffix = `${refSuffix}${suffix || ''}`
    return refPrefix + type + finalSuffix
  }

  const getTypeBySchemaRef = (ref: string) => {
    // 1. remove path 2. remove prefix 3. remove suffix
    const ret = ref
      .replace(/^.+\//, '')
      .replace(new RegExp(`${refPrefix}`), '')
      .replace(new RegExp(`${refSuffix}\\w*`), '')
    return ret
  }

  return {
    getSchemaRefByType,
    getTypeBySchemaRef,
  }
}

export const useActionSchema = (): {
  getSchemaRefByType: (type: string, suffix?: string) => string
  getTypeBySchemaRef: (ref: string) => string
} => {
  const refPrefix = 'bridge_'
  const refSuffix = '.post_bridge_v2'
  const typeReg = new RegExp(`${escapeRegExp(refPrefix)}(.+)(?:${escapeRegExp(refSuffix)})`)

  const getSchemaRefByType = (type: string, suffix?: string) => {
    const finalSuffix = `${refSuffix}${suffix || ''}`
    return refPrefix + type + finalSuffix
  }

  const getTypeBySchemaRef = (ref: string) => {
    const matchRet = ref.match(typeReg)
    return matchRet ? matchRet[1] : ''
  }

  return {
    getSchemaRefByType,
    getTypeBySchemaRef,
  }
}
