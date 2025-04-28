import { ConnectionStatus, NodeStatusClass } from '@/types/enum'

export default (): {
  getStatusClass: (status?: ConnectionStatus) => NodeStatusClass
  getStatusLabel: (status?: ConnectionStatus) => string
  getTheWorstStatus: (statusArr: Array<ConnectionStatus>) => ConnectionStatus
} => {
  const { tl } = useI18nTl('Base')

  const getStatusClass = (status?: ConnectionStatus) => {
    const map = {
      [ConnectionStatus.Connected]: NodeStatusClass.Success,
      [ConnectionStatus.Disconnected]: NodeStatusClass.Danger,
      [ConnectionStatus.Connecting]: NodeStatusClass.Warning,
      [ConnectionStatus.Inconsistent]: NodeStatusClass.Warning,
      [ConnectionStatus.Stopped]: NodeStatusClass.Danger,
    }
    return status ? map[status] || NodeStatusClass.Danger : NodeStatusClass.Danger
  }

  const getStatusLabel = (status?: ConnectionStatus) => {
    const statusLabelMap = {
      [ConnectionStatus.Connected]: tl('connected'),
      [ConnectionStatus.Disconnected]: tl('disconnected'),
      [ConnectionStatus.Connecting]: tl('connecting'),
      [ConnectionStatus.Inconsistent]: tl('inconsistent'),
      [ConnectionStatus.Stopped]: tl('stopped'),
    }
    return status ? statusLabelMap[status] || tl('disconnected') : ''
  }

  const getTheWorstStatus = (statusArr: Array<ConnectionStatus>) => {
    if (!statusArr || statusArr.length === 0) {
      return ConnectionStatus.Connected
    }
    const badStatusArr = [
      ConnectionStatus.Stopped,
      ConnectionStatus.Disconnected,
      ConnectionStatus.Connecting,
      ConnectionStatus.Inconsistent,
      ConnectionStatus.Connected,
    ]
    for (const currentBadStatus of badStatusArr) {
      if (statusArr.some((status) => status === currentBadStatus)) {
        return currentBadStatus
      }
    }
    return ConnectionStatus.Connected
  }
  return {
    getStatusClass,
    getStatusLabel,
    getTheWorstStatus,
  }
}
