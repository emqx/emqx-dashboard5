import { ConnectionStatus } from '@/types/enum'
import useI18nTl from '../useI18nTl'

const useActionAndSourceStatus = (): {
  statusOptList: Array<{ value: ConnectionStatus; label: string }>
  statusLabelMap: Partial<Record<ConnectionStatus, string>>
} => {
  const { t, tl } = useI18nTl('RuleEngine')
  const statusLabelMap = {
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
  return {
    statusLabelMap,
    statusOptList,
  }
}

export default useActionAndSourceStatus
