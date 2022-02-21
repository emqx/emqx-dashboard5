import { getLabelFromValueInOptionList } from '@/common/tools'
import { BridgeStatus, BridgeType } from '@/types/enum'
import { MQTTBridgeDirection } from '@/types/enum'
import { useI18n } from 'vue-i18n'

export default () => {
  const bridgeTypeList = [
    { value: BridgeType.HTTP, label: 'HTTP' },
    { value: BridgeType.MQTT, label: 'MQTT' },
  ]

  const getBridgeLabelByTypeValue = (typeValue: BridgeType) => {
    return getLabelFromValueInOptionList(typeValue, bridgeTypeList)
  }

  return {
    getBridgeLabelByTypeValue,
  }
}

export const useBridgeDirectionTypeValue = () => {
  const { t } = useI18n()
  const bridgeDirectionList = [
    { value: MQTTBridgeDirection.In, label: t('RuleEngine.input') },
    { value: MQTTBridgeDirection.Out, label: t('RuleEngine.output') },
  ]

  const getLabelByDirectionValue = (directionValue: MQTTBridgeDirection) => {
    return getLabelFromValueInOptionList(directionValue, bridgeDirectionList)
  }

  return {
    getLabelByDirectionValue,
  }
}

export const useBridgeStatusLabelValue = () => {
  const { t } = useI18n()
  const bridgeStatusList = [
    { value: BridgeStatus.Connected, label: t('RuleEngine.connected') },
    { value: BridgeStatus.Disconnected, label: t('RuleEngine.disconnected') },
  ]

  const getLabelByStatusValue = (directionValue: BridgeStatus) => {
    return getLabelFromValueInOptionList(directionValue, bridgeStatusList)
  }

  return {
    getLabelByStatusValue,
  }
}
