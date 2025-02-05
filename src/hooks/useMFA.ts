import { UserMFA } from '@/types/typeAlias'
import useI18nTl from './useI18nTl'

export const useMFAMethods = () => {
  const { t, tl } = useI18nTl('General')

  const mfaLabelMap = new Map<string, string>([
    [UserMFA.totp, tl('totpLabel')],
    [UserMFA.none, t('Base.none')],
    [UserMFA.disabled, t('Base.disabled')],
  ])

  const noMFAValues = [UserMFA.disabled, UserMFA.none]
  const mfaOptions = Object.values(UserMFA).reduce(
    (acc: Array<{ label: string; value: string }>, value: any) => {
      if (noMFAValues.includes(value)) {
        return acc
      }
      acc.push({ label: mfaLabelMap.get(value) ?? '', value })
      return acc
    },
    [],
  )

  const getMFAMethodLabel = (value: string) => {
    return mfaLabelMap.get(value) ?? ''
  }

  return { noMFAValues, mfaOptions, getMFAMethodLabel }
}
