import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'

export const useBridgeTypeValue = (): {
  bridgeTypeList: Array<{
    value: BridgeType
    label: string
  }>
  getBridgeLabelByTypeValue: (typeValue: BridgeType) => string | undefined
} => {
  const { tl } = useI18nTl('RuleEngine')

  const bridgeTypeList = [
    { value: BridgeType.Webhook, label: 'Webhook' },
    { value: BridgeType.MQTT, label: 'MQTT' },
    { value: BridgeType.Kafka, label: tl('kafka') },
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
  ]

  const getBridgeLabelByTypeValue = (typeValue: BridgeType) => {
    return getLabelFromValueInOptionList(typeValue, bridgeTypeList)
  }

  return {
    bridgeTypeList,
    getBridgeLabelByTypeValue,
  }
}

export default useBridgeTypeValue

export interface BridgeTypeOptions {
  value: BridgeType
  label: string
  desc: string
  externalConfig?: Partial<BridgeItem>
}

export const useBridgeTypeOptions = (): {
  bridgeTypeOptions: BridgeTypeOptions[]
  getBridgeType: (typeStr: string) => BridgeType
  getTypeStr: (bridge: BridgeItem) => string
} => {
  const { tl, t } = useI18nTl('RuleEngine')
  const { bridgeTypeList } = useBridgeTypeValue()

  const descMap = new Map([
    [BridgeType.Webhook, tl('bridgeDescHTTP')],
    [BridgeType.MQTT, tl('bridgeDescMQTT')],
    [BridgeType.Kafka, tl('kafkaDesc')],
    [BridgeType.InfluxDB, t('RuleEngine.egressDataBaseDesc', { name: tl('influxDBLabel') })],
    [BridgeType.MySQL, t('RuleEngine.egressDataBaseDesc', { name: tl('mySQL') })],
    [BridgeType.Redis, t('RuleEngine.egressDataBaseDesc', { name: tl('redis') })],
    [BridgeType.GCP, tl('gcpPubSubDesc')],
    [BridgeType.MongoDB, t('RuleEngine.egressDataBaseDesc', { name: tl('mongoDB') })],
    [BridgeType.PgSQL, t('RuleEngine.egressDataBaseDesc', { name: tl('pgSql') })],
    [BridgeType.TimescaleDB, t('RuleEngine.egressDataBaseDesc', { name: tl('timescaleDB') })],
    [BridgeType.MatrixDB, t('RuleEngine.egressDataBaseDesc', { name: tl('matrixDB') })],
    [BridgeType.TDengine, t('RuleEngine.egressDataBaseDesc', { name: tl('TDengine') })],
    [BridgeType.ClickHouse, t('RuleEngine.egressDataBaseDesc', { name: tl('clickHouse') })],
    [BridgeType.DynamoDB, t('RuleEngine.egressDataBaseDesc', { name: tl('dynamoDB') })],
  ])

  const bridgeTypeOptions: Array<BridgeTypeOptions> = bridgeTypeList.map((item) => ({
    ...item,
    desc: descMap.get(item.value) || '',
  }))

  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()

  /**
   * Not a specific type, but a general type, such as influxdb v1 v2 are all influxdb
   */
  const typesWithMultiSpecificType = [BridgeType.InfluxDB, BridgeType.Redis, BridgeType.MongoDB]
  const getBridgeType = (typeStr: string): BridgeType => {
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

  const getTypeStr = (bridge: BridgeItem): string => {
    const type = getBridgeType(bridge.type)
    return getBridgeLabelByTypeValue(type) || ''
  }

  return {
    bridgeTypeOptions,
    getBridgeType,
    getTypeStr,
  }
}

export const useBridgeTypeIcon = (): {
  getBridgeIconKey: (value: string) => string
  getBridgeIcon: (type: string) => string
} => {
  const specialIconMap = {
    [BridgeType.PgSQL]: 'postgresql',
  }

  const { getBridgeType } = useBridgeTypeOptions()
  const getBridgeIconKey = (value: string) => {
    const ret = getBridgeType(value)
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
