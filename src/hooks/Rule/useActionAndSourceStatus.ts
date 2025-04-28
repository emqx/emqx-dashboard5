import { ConnectionStatus } from '@/types/enum'

const useActionAndSourceStatus = (): {
  statusOptList: Array<{ value: ConnectionStatus; label: string }>
  statusLabelMap: Partial<Record<ConnectionStatus, string>>
  getActionStatusLabel: (status?: ConnectionStatus) => string
} => {
  const { t, tl } = useI18nTl('RuleEngine')
  const statusLabelMap: Partial<Record<ConnectionStatus, string>> = {
    [ConnectionStatus.Connected]: tl('actionAvailable'),
    [ConnectionStatus.Disconnected]: tl('actionUnavailable'),
    [ConnectionStatus.Connecting]: t('Base.connecting'),
    [ConnectionStatus.Inconsistent]: t('Base.inconsistent'),
  }
  const statusOptList = (Object.entries(statusLabelMap) as [ConnectionStatus, string][]).map(
    ([key, value]) => ({
      value: key,
      label: value,
    }),
  )
  const getActionStatusLabel = (status?: ConnectionStatus) => {
    return status ? statusLabelMap[status] || tl('disconnected') : ''
  }
  return {
    statusLabelMap,
    statusOptList,
    getActionStatusLabel,
  }
}

export default useActionAndSourceStatus
