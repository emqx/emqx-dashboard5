import useI18nTl from '@/hooks/useI18nTl'
import { ConnectionStatus, NodeStatusClass } from '@/types/enum'

export default (): {
  getStatusClass: (status: ConnectionStatus) => NodeStatusClass
  getStatusLabel: (status: ConnectionStatus) => string
} => {
  const { tl } = useI18nTl('Base')

  const getStatusClass = (status: ConnectionStatus) => {
    const map = {
      [ConnectionStatus.Connected]: NodeStatusClass.Success,
      [ConnectionStatus.Disconnected]: NodeStatusClass.Danger,
      [ConnectionStatus.Connecting]: NodeStatusClass.Warning,
    }
    return map[status] || NodeStatusClass.Danger
  }

  const getStatusLabel = (status: ConnectionStatus) => {
    const statusLabelMap = {
      [ConnectionStatus.Connected]: tl('connected'),
      [ConnectionStatus.Disconnected]: tl('disconnected'),
      [ConnectionStatus.Connecting]: tl('connecting'),
    }
    return statusLabelMap[status] || tl('disconnected')
  }
  return {
    getStatusClass,
    getStatusLabel,
  }
}
