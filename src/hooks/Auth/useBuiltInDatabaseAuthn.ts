import { AuthnMechanismType, DatabasesType } from '@/types/enum'

const useBuiltInDatabaseAuthn = () => {
  const defaultAuthnId = `${AuthnMechanismType.PasswordBased}:${DatabasesType.BuiltInDatabase}`

  const { t } = useI18n()
  const getFiledLabel = (field: 'clientid' | 'username') => {
    const fieldMap = {
      clientid: t('Base.clientid'),
      username: t('Base.username'),
    }
    return fieldMap[field]
  }
  return {
    defaultAuthnId,
    getFiledLabel,
  }
}

export default useBuiltInDatabaseAuthn
