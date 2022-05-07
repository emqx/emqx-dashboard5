import { ExhookStatus, NodeStatusClass } from '@/types/enum'
import { Exhook } from '@/types/systemModule'
import useI18nTl from '../useI18nTl'

export default (): {
  getTheWorstStatus: (exhook: Exhook) => ExhookStatus
  statusText: (status: ExhookStatus) => string
  statusTextClass: (status: ExhookStatus) => NodeStatusClass
} => {
  const { t, tl } = useI18nTl('Exhook')

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

  const statusText = (status: ExhookStatus) =>
    ({
      [ExhookStatus.Connected]: t('RuleEngine.connected'),
      [ExhookStatus.Connecting]: t('RuleEngine.connecting'),
      [ExhookStatus.Unconnected]: t('RuleEngine.disconnected'),
      [ExhookStatus.Disable]: tl('disabled'),
      [ExhookStatus.Error]: tl('error'),
    }[status] || 'unknown')

  const statusTextClass = (status: ExhookStatus): NodeStatusClass =>
    ({
      [ExhookStatus.Connected]: NodeStatusClass.Success,
      [ExhookStatus.Connecting]: NodeStatusClass.Warning,
      [ExhookStatus.Unconnected]: NodeStatusClass.Danger,
      [ExhookStatus.Disable]: NodeStatusClass.Danger,
      [ExhookStatus.Error]: NodeStatusClass.Danger,
    }[status] || NodeStatusClass.Danger)

  return {
    getTheWorstStatus,
    statusText,
    statusTextClass,
  }
}
