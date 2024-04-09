import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { MessageValidationFailureAction } from '@/types/typeAlias'

type FailureActionValue =
  typeof MessageValidationFailureAction[keyof typeof MessageValidationFailureAction]

export const useFailureAction = (): {
  failureActionOpts: { label: string; value: FailureActionValue }[]
  getLabelByValue: (value: FailureActionValue) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const failureActionOpts: Array<{ label: string; value: FailureActionValue }> = [
    { label: tl('dropMsg'), value: MessageValidationFailureAction.drop },
    { label: tl('disconnect'), value: MessageValidationFailureAction.disconnect },
    { label: tl('ignore'), value: MessageValidationFailureAction.ignore },
  ]

  const getLabelByValue = (value: FailureActionValue) =>
    getLabelFromValueInOptionList(value, failureActionOpts)

  return { failureActionOpts, getLabelByValue }
}
