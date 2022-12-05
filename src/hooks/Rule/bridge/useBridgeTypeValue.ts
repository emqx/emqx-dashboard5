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
  valueForRadio: string
  label: string
  desc: string
  externalConfig?: Partial<BridgeItem>
}

export const useBridgeTypeOptions = (): {
  bridgeTypeOptions: BridgeTypeOptions[]
  getTrueTypeObjByRadioValue: (radioValue: string) => BridgeTypeOptions | undefined
  getTypeStr: (bridge: BridgeItem) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const bridgeTypeOptions: Array<BridgeTypeOptions> = [
    {
      value: BridgeType.Webhook,
      valueForRadio: BridgeType.Webhook,
      label: 'Webhook',
      desc: tl('bridgeDescHTTP'),
    },
    {
      value: BridgeType.MQTT,
      valueForRadio: BridgeType.MQTT,
      label: 'MQTT',
      desc: tl('bridgeDescMQTT'),
    },
  ]

  const getTrueTypeObjByRadioValue = (radioValue: string) =>
    bridgeTypeOptions.find(({ valueForRadio }) => valueForRadio === radioValue)

  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()

  const getTypeStr = (bridge: BridgeItem): string => {
    const type = bridge.type?.indexOf(BridgeType.InfluxDB) > -1 ? BridgeType.InfluxDB : bridge.type
    return getBridgeLabelByTypeValue(type) || ''
  }

  return {
    bridgeTypeOptions,
    getTrueTypeObjByRadioValue,
    getTypeStr,
  }
}

export const useBridgeTypeIcon = (): {
  getBridgeIconKey: (value: string) => string
  getBridgeIcon: (type: string) => string
} => {
  const getBridgeIconKey = (value: string) => (value.indexOf('influxdb') > -1 ? `influxdb` : value)
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
