import { INGRESS_BRIDGE_TYPES, SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem, MQTTBridge } from '@/types/rule'
import { escapeRegExp } from 'lodash'

const bridgesOrder = [BridgeType.Webhook, BridgeType.MQTT]
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
  getBridgeLabelByTypeValue: (typeValue: BridgeType) => string | undefined
} => {
  const { t } = useI18nTl('RuleEngine')

  const bridgeTypeList = [
    { value: BridgeType.Webhook, label: t('Auth.HTTPServer') },
    { value: BridgeType.MQTT, label: t('RuleEngine.mqttBroker') },
  ].sort((a, b) => (bridgeOrderIndex[a.value] || 0) - (bridgeOrderIndex[b.value] || 0))

  const getBridgeLabelByTypeValue = (typeValue: BridgeType) => {
    return getLabelFromValueInOptionList(typeValue, bridgeTypeList)
  }

  return {
    bridgeTypeList,
    getBridgeLabelByTypeValue,
  }
}

export const isConnectorSupported = (type: string): boolean =>
  SUPPORTED_CONNECTOR_TYPES.includes(type as BridgeType)

export const useConnectorTypeValue = (): {
  connectorTypeList: TypeItem[]
  getTypeStr: (type: string) => string
} => {
  const { bridgeTypeList } = useBridgeTypeValue()

  const connectorTypeList = bridgeTypeList

  const getTypeStr = (type: string) =>
    getLabelFromValueInOptionList(type, connectorTypeList) || type

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
  getBridgeType: (typeStr: string) => BridgeType
  getTypeStr: (bridge: BridgeItem) => string
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

  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()

  /**
   * Not a specific type, but a general type, such as influxdb v1 v2 are all influxdb
   */
  const typesWithMultiSpecificType = [
    BridgeType.InfluxDB,
    BridgeType.Redis,
    BridgeType.MongoDB,
    ...typesWithProducerAndConsumer,
  ]
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
    [BridgeType.Webhook]: 'http',
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

export const useBridgeDirection = (): {
  judgeBridgeDirection: (bridge: BridgeItem) => BridgeDirection
} => {
  const { getBridgeType } = useBridgeTypeOptions()
  const judgeBridgeDirection = (bridge: BridgeItem): BridgeDirection => {
    const { type: rawType } = bridge
    const type = getBridgeType(rawType)
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
      return BridgeDirection.Egress
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
    const matchRet = ref.match(typeReg)
    return matchRet ? matchRet[1] : ''
  }
  return {
    getSchemaRefByType,
    getTypeBySchemaRef,
  }
}
