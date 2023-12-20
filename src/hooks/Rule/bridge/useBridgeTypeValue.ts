import {
  BRIDGE_OLD_TYPES_MAP,
  INGRESS_BRIDGE_TYPES,
  SUPPORTED_CONNECTOR_TYPES,
} from '@/common/constants'
import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem, MQTTBridge } from '@/types/rule'

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
  const { t, tl } = useI18nTl('RuleEngine')

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
  BridgeType.Pulsar,
  BridgeType.AzureEventHubs,
  BridgeType.AmazonKinesis,
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
  getSchemaRefByType: (type: string, suffix?: string) => string
  getTypeByBridgeSchemaRef: (ref: string) => string
} => {
  const refPrefix = 'bridge_'
  const refSuffix = '.post'

  const getRef = (type: string, suffix?: string) => {
    const finalSuffix = `${refSuffix}${suffix || ''}`
    return refPrefix + type + finalSuffix
  }

  const specialBridgeTypeRefKeyMap: Map<string, string> = new Map([])

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
  const getRef = (type: string, prefix?: string) => `${prefix ?? refPrefix}${type}.${refSuffix}`

  const specialTypeRefKeyMap: Map<string, string> = new Map([])

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

  const getRef = (type: string, prefix?: string, suffix?: string) => {
    const finalSuffix = `${refSuffix}${suffix || ''}`
    return (prefix ?? refPrefix) + type + finalSuffix
  }

  const specialActionTypeRefKeyMap: Map<string, string> = new Map([])
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
