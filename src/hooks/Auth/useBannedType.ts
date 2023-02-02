import { BannedType } from '@/types/enum'
import useI18nTl from '../useI18nTl'
import { getLabelFromValueInOptionList } from '@/common/tools'

export default (): {
  typeList: {
    label: string
    value: BannedType
  }[]
  getLabelFromValue: (value: BannedType) => string
} => {
  const { t } = useI18nTl('General')

  const typeList = [
    { label: t('Clients.clientId'), value: BannedType.Client },
    { label: t('Clients.username'), value: BannedType.User },
    { label: t('Clients.ipAddress'), value: BannedType.Address },
  ]

  const getLabelFromValue = (value: BannedType) => {
    return getLabelFromValueInOptionList(value, typeList)
  }
  return {
    typeList,
    getLabelFromValue,
  }
}
