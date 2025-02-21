import { CONNECTOR_TYPES_WITH_TWO_DIRECTIONS, INGRESS_BRIDGE_TYPES } from '@/common/constants'
import { getImg, getLabelFromValueInOptionList } from '@/common/tools'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'

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
} => {
  const { bridgeTypeList } = useBridgeTypeValue()

  const connectorTypeList = bridgeTypeList

  const getTypeStr = (type: string) => getLabelFromValueInOptionList(type, connectorTypeList)

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

export const consumerReg = /consumer/i

export const useBridgeTypeOptions = (): {
  bridgeTypeOptions: BridgeTypeOptions[]
} => {
  const { bridgeTypeList } = useBridgeTypeValue()

  const bridgeTypeOptions: Array<BridgeTypeOptions> = bridgeTypeList.map((item) => ({
    ...item,
    desc: '',
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
  getTypeByConnectorSchemaRef: (ref: string) => string
} => {
  const refPrefix = `bridge_`
  const refSuffix = 'post_connector'
  const getRef = (type: string, prefix?: string) => `${prefix ?? refPrefix}${type}.${refSuffix}`

  const specialTypeRefKeyMap: Map<string, string> = new Map([
    [BridgeType.MQTT, getRef(BridgeType.MQTT, 'connector_')],
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
