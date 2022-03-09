import { ExhookStatus, NodeStatusClass } from '@/types/enum'
import { Exhook } from '@/types/systemModule'

export default (tl: (key: string, moduleName?: string) => string) => {
  const getTheWorstStatus = (exhook: Exhook) => {
    const { node_status } = exhook
    if (!node_status || node_status.length === 0) {
      return ExhookStatus.Error
    }
    let ret = ExhookStatus.Running
    // The order cannot be changed
    const badStatusArr = [ExhookStatus.Error, ExhookStatus.Stopped, ExhookStatus.Waiting]
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
      [ExhookStatus.Running]: NodeStatusClass.Success,
      [ExhookStatus.Waiting]: NodeStatusClass.Warning,
      [ExhookStatus.Stopped]: NodeStatusClass.Danger,
      [ExhookStatus.Error]: NodeStatusClass.Danger,
    }[status] || NodeStatusClass.Danger)

  const statusText = (status: ExhookStatus) =>
    ({
      [ExhookStatus.Running]: tl('connected'),
      [ExhookStatus.Waiting]: tl('connecting'),
      [ExhookStatus.Stopped]: tl('stopped'),
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
