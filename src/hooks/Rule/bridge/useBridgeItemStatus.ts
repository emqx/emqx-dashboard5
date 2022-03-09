import useI18nTl from '@/hooks/useI18nTl'
import { BridgeStatus, NodeStatusClass } from '@/types/enum'

export default () => {
  const { tl } = useI18nTl('RuleEngine')

  const getStatusClass = (status: BridgeStatus) => {
    const map = {
      [BridgeStatus.Connected]: NodeStatusClass.Success,
      [BridgeStatus.Disconnected]: NodeStatusClass.Danger,
      [BridgeStatus.Connecting]: NodeStatusClass.Warning,
    }
    return map[status] || NodeStatusClass.Danger
  }

  const getStatusLabel = (status: BridgeStatus) => {
    const statusLabelMap = {
      [BridgeStatus.Connected]: tl('connected'),
      [BridgeStatus.Disconnected]: tl('disconnected'),
      [BridgeStatus.Connecting]: tl('connecting'),
    }
    return statusLabelMap[status] || tl('disconnected')
  }
  return {
    getStatusClass,
    getStatusLabel,
  }
}
