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
    { value: BridgeType.InfluxDB, label: tl('influxDBLabel') },
    { value: BridgeType.MySQL, label: tl('mySQL') },
    { value: BridgeType.Kafka, label: tl('kafka') },
    { value: BridgeType.Redis, label: tl('redis') },
    { value: BridgeType.GCP, label: tl('gcpPubSub') },
    { value: BridgeType.MongoDB, label: tl('mongoDB') },
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

  const bridgeTypeOptions: Array<BridgeTypeOptions> = [
    {
      value: BridgeType.Webhook,
      label: 'Webhook',
      desc: tl('bridgeDescHTTP'),
    },
    {
      value: BridgeType.MQTT,
      label: 'MQTT',
      desc: tl('bridgeDescMQTT'),
    },
    {
      value: BridgeType.Kafka,
      valueForRadio: BridgeType.Kafka,
      label: tl('kafka'),
      desc: tl('kafkaDesc'),
    },
    {
      value: BridgeType.InfluxDB,
      valueForRadio: BridgeType.InfluxDB,
      label: tl('influxDBLabel'),
      desc: t('RuleEngine.egressDataBaseDesc', { name: tl('influxDBLabel') }),
    },
    {
      value: BridgeType.MySQL,
      valueForRadio: BridgeType.MySQL,
      label: tl('mySQL'),
      desc: t('RuleEngine.egressDataBaseDesc', { name: tl('mySQL') }),
    },
    {
      value: BridgeType.Redis,
      valueForRadio: BridgeType.Redis,
      label: tl('redis'),
      desc: t('RuleEngine.egressDataBaseDesc', { name: tl('redis') }),
    },
    {
      value: BridgeType.GCP,
      valueForRadio: BridgeType.GCP,
      label: tl('gcpPubSub'),
      desc: tl('gcpPubSubDesc'),
    },
    {
      value: BridgeType.MongoDB,
      valueForRadio: BridgeType.MongoDB,
      label: tl('mongoDB'),
      desc: t('RuleEngine.egressDataBaseDesc', { name: tl('mongoDB') }),
    },
  ]

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
  const { getBridgeType } = useBridgeTypeOptions()
  const getBridgeIconKey = (value: string) => getBridgeType(value)

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
