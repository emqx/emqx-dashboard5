import { getLabelFromValueInOptionList } from '@/common/tools'
import { OptionList } from '@/types/common'
import { BridgeType } from '@/types/enum'
import { MQTTBridgeDirection } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { useI18n } from 'vue-i18n'

const useBridgeTypeValue = (): {
  bridgeTypeList: Array<{
    value: BridgeType
    label: string
  }>
  getBridgeLabelByTypeValue: (typeValue: BridgeType) => string | undefined
} => {
  const bridgeTypeList = [
    { value: BridgeType.HTTP, label: 'HTTP' },
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

interface BridgeTypeOptions {
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
  const { t } = useI18n()

  const bridgeTypeOptions: Array<BridgeTypeOptions> = [
    {
      value: BridgeType.HTTP,
      valueForRadio: BridgeType.HTTP,
      label: 'HTTP Sink',
      desc: t('RuleEngine.bridgeDescHTTP'),
    },
    {
      value: BridgeType.MQTT,
      valueForRadio: `${BridgeType.MQTT}:${MQTTBridgeDirection.In}`,
      label: 'MQTT Source',
      desc: t('RuleEngine.bridgeDescMQTTIn'),
      externalConfig: { direction: MQTTBridgeDirection.In },
    },
    {
      value: BridgeType.MQTT,
      valueForRadio: `${BridgeType.MQTT}:${MQTTBridgeDirection.Out}`,
      label: 'MQTT Sink',
      desc: t('RuleEngine.bridgeDescMQTTOut'),
      externalConfig: {
        direction: MQTTBridgeDirection.Out,
      },
    },
  ]

  const getTrueTypeObjByRadioValue = (radioValue: string) =>
    bridgeTypeOptions.find(({ valueForRadio }) => valueForRadio === radioValue)

  const { getBridgeLabelByTypeValue } = useBridgeTypeValue()

  const getTypeStr = (bridge: BridgeItem): string => {
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
