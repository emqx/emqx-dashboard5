import { INGRESS_BRIDGE_TYPES, SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem, MQTTBridge } from '@/types/rule'
import { escapeRegExp } from 'lodash'

const bridgesOrder = [BridgeType.MQTT, BridgeType.Webhook]
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
  const { t } = useI18nTl('RuleEngine')

  const bridgeTypeList = [
    { value: BridgeType.Webhook, label: t('Auth.HTTPServer') },
    { value: BridgeType.MQTT, label: t('RuleEngine.mqttBroker') },
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
} => {
  const { bridgeTypeList, getGeneralTypeLabel } = useBridgeTypeValue()

  const connectorTypeList = bridgeTypeList

  const getTypeStr = (type: string) => getGeneralTypeLabel(type) || type

  return {
    connectorTypeList,
    getTypeStr,
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
  BridgeType.Kafka,
  BridgeType.Pulsar,
  BridgeType.AzureEventHubs,
  BridgeType.AmazonKinesis,
  BridgeType.GCP,
]
export const useBridgeTypeOptions = (): {
  bridgeTypeOptions: BridgeTypeOptions[]
} => {
  const { tl } = useI18nTl('RuleEngine')
  const { bridgeTypeList } = useBridgeTypeValue()

  const descMap = new Map([
    [BridgeType.Webhook, tl('bridgeDescHTTP')],
    [BridgeType.MQTT, tl('bridgeDescMQTT')],
  ])

  const bridgeTypeOptions: Array<BridgeTypeOptions> = bridgeTypeList.map((item) => ({
    ...item,
    desc: descMap.get(item.value) || '',
  }))

  return {
    bridgeTypeOptions,
  }
}

export const useBridgeTypeIcon = (): {
  getBridgeIconKey: (value: string) => string
  getBridgeIcon: (type: string) => string
} => {
  const specialIconMap = {
    [BridgeType.Webhook]: 'http',
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

    return BridgeDirection.Egress
  }

  return {
    judgeBridgeDirection,
  }
}

export const useBridgeSchema = (): {
  getSchemaRefByType: (type: string) => string
  getTypeBySchemaRef: (ref: string) => string
} => {
  const refPrefix = 'bridge_'
  const refSuffix = '.post'
  const typeReg = new RegExp(`${escapeRegExp(refPrefix)}(.+)${escapeRegExp(refSuffix)}`)
  /**
   * @param type The 'type' here is not the same as the 'type' field data in the bridge data. It is used to concatenate a string to obtain `ref`, and longer ones are usually abbreviated.
   */
  const getSchemaRefByType = (type: string) => refPrefix + type + refSuffix

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
