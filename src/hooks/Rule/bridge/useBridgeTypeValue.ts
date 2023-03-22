import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem, MQTTBridge } from '@/types/rule'

export const useBridgeTypeValue = (): {
  bridgeTypeList: Array<{
    value: BridgeType
    label: string
  }>
  getBridgeLabelByTypeValue: (typeValue: BridgeType) => string | undefined
} => {
  const bridgeTypeList = [
    { value: BridgeType.Webhook, label: 'Webhook' },
    { value: BridgeType.MQTT, label: 'MQTT' },
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
  const typesWithMultiSpecificType = [BridgeType.InfluxDB, BridgeType.Redis]
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
    console.log(type)
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
      if (ingress && egress) {
        return BridgeDirection.Both
      } else if (ingress) {
        return BridgeDirection.Ingress
      }
      return BridgeDirection.Egress
    }

    return BridgeDirection.Egress
  }

  return {
    judgeBridgeDirection,
  }
}
