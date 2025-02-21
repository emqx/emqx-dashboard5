import { BannedType } from '@/types/enum'
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
    { label: t('Clients.clientIdReg'), value: BannedType.ClientReg },
    { label: t('Clients.username'), value: BannedType.User },
    { label: t('Clients.usernameReg'), value: BannedType.UserReg },
    { label: t('Clients.ipAddress'), value: BannedType.Address },
    { label: t('Clients.ipAddressRange'), value: BannedType.AddressRange },
  ]

  const getLabelFromValue = (value: BannedType) => {
    return getLabelFromValueInOptionList(value, typeList)
  }
  return {
    typeList,
    getLabelFromValue,
  }
}
