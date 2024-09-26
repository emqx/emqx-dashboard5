import { getLabelFromValueInOptionList } from '@/common/tools'
import { AuthnMechanismType } from '@/types/enum'

export const useAuthnMechanismType = (): {
  authnMechanismTypeList: {
    value: AuthnMechanismType
    label: string
  }[]
  getLabelByValue: (value: AuthnMechanismType) => string
} => {
  const authnMechanismTypeList = [
    { value: AuthnMechanismType.PasswordBased, label: 'Password-Based' },
    { value: AuthnMechanismType.JWT, label: 'JWT' },
    { value: AuthnMechanismType.SCRAM, label: 'SCRAM' },
    { value: AuthnMechanismType.GSSAPI, label: 'GSSAPI' },
    { value: AuthnMechanismType.CINFO, label: 'Client Info' },
  ]

  const getLabelByValue = (value: AuthnMechanismType) =>
    getLabelFromValueInOptionList(value, authnMechanismTypeList)

  return {
    authnMechanismTypeList,
    getLabelByValue,
  }
}
