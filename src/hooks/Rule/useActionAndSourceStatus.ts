import { ConnectionStatus } from '@/types/enum'

const useActionAndSourceStatus = (): {
  statusOptList: Array<{ value: ConnectionStatus; label: string }>
  statusLabelMap: Record<ConnectionStatus, string>
} => {
  const { t, tl } = useI18nTl('RuleEngine')
  const statusLabelMap = {
    [ConnectionStatus.Connected]: tl('actionAvailable'),
    [ConnectionStatus.Disconnected]: tl('actionUnavailable'),
    [ConnectionStatus.Connecting]: t('Base.connecting'),
    [ConnectionStatus.Inconsistent]: t('Base.inconsistent'),
    [ConnectionStatus.Stopped]: t('Base.stopped'),
  }
  const statusOptList = (Object.entries(statusLabelMap) as [ConnectionStatus, string][]).map(
    ([key, value]) => ({
      value: key,
      label: value,
    }),
  )
  return {
    statusLabelMap,
    statusOptList,
  }
}

export default useActionAndSourceStatus
