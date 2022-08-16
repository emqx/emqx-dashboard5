import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { MQTTBridgeDirection } from '@/types/enum'
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
    { value: BridgeType.InfluxDBV1, label: tl('influxDBV1Label') },
    { value: BridgeType.InfluxDBV2, label: tl('influxDBV2Label') },
    { value: BridgeType.InfluxDBUPD, label: tl('influxDBUDPLabel') },
    { value: BridgeType.MySQL, label: tl('mySQL') },
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
      valueForRadio: `${BridgeType.MQTT}:${MQTTBridgeDirection.In}`,
      label: 'MQTT Source',
      desc: tl('bridgeDescMQTTIn'),
      externalConfig: { direction: MQTTBridgeDirection.In },
    },
    {
      value: BridgeType.MQTT,
      valueForRadio: `${BridgeType.MQTT}:${MQTTBridgeDirection.Out}`,
      label: 'MQTT Sink',
      desc: tl('bridgeDescMQTTOut'),
      externalConfig: {
        direction: MQTTBridgeDirection.Out,
      },
    },
    {
      value: BridgeType.InfluxDBV1,
      valueForRadio: BridgeType.InfluxDBV1,
      label: tl('influxDBV1Label'),
      desc: tl('influxDBV1Desc'),
    },
    {
      value: BridgeType.InfluxDBV2,
      valueForRadio: BridgeType.InfluxDBV2,
      label: tl('influxDBV2Label'),
      desc: tl('influxDBV2Desc'),
    },
    {
      value: BridgeType.InfluxDBUPD,
      valueForRadio: BridgeType.InfluxDBUPD,
      label: tl('influxDBUDPLabel'),
      desc: tl('influxDBUDPDesc'),
    },
    {
      value: BridgeType.MySQL,
      valueForRadio: BridgeType.MySQL,
      label: tl('mySQL'),
      desc: tl('mySQLDesc'),
    },
  ]

  const getTrueTypeObjByRadioValue = (radioValue: string) =>
    bridgeTypeOptions.find(({ valueForRadio }) => valueForRadio === radioValue)

  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()

  const getTypeStr = (bridge: BridgeItem): string => {
    if (bridge.type === BridgeType.Webhook) {
      return getLabelFromValueInOptionList(bridge.type, bridgeTypeOptions)
    }
    const directionStr =
      'direction' in bridge && bridge.direction === MQTTBridgeDirection.In ? 'Source' : 'Sink'
    return `${getBridgeLabelByTypeValue(bridge.type)} ${directionStr}`
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
