import { ExhookStatus, NodeStatusClass } from '@/types/enum'
import { Exhook } from '@/types/systemModule'

export default (tl: (key: string, moduleName?: string) => string) => {
  const getTheWorstStatus = (exhook: Exhook) => {
    const { node_status } = exhook
    if (!node_status || node_status.length === 0) {
      return ExhookStatus.Error
    }
    let ret = ExhookStatus.Connected
    // The order cannot be changed

    const badStatusArr = [
      ExhookStatus.Connected,
      ExhookStatus.Connecting,
      ExhookStatus.Unconnected,
      ExhookStatus.Disable,
      ExhookStatus.Error,
    ]
    for (const currentBadStatus of badStatusArr) {
      if (node_status.some(({ status }) => status === currentBadStatus)) {
        ret = currentBadStatus
        break
      }
    }
    return ret
  }

  const dotClass = (status: ExhookStatus): NodeStatusClass =>
    ({
      [ExhookStatus.Connected]: NodeStatusClass.Success,
      [ExhookStatus.Connecting]: NodeStatusClass.Warning,
      [ExhookStatus.Unconnected]: NodeStatusClass.Danger,
      [ExhookStatus.Disable]: NodeStatusClass.Danger,
      [ExhookStatus.Error]: NodeStatusClass.Danger,
    }[status] || NodeStatusClass.Danger)

  const statusText = (status: ExhookStatus) =>
    ({
      [ExhookStatus.Connected]: tl('connected', 'RuleEngine'),
      [ExhookStatus.Connecting]: tl('connecting', 'RuleEngine'),
      [ExhookStatus.Unconnected]: tl('disconnected', 'RuleEngine'),
      [ExhookStatus.Disable]: tl('disabled'),
      [ExhookStatus.Error]: tl('error'),
    }[status] || 'unknown')

  const statusTextClass = dotClass

  return {
    getTheWorstStatus,
    dotClass,
    statusText,
    statusTextClass,
  }
}
