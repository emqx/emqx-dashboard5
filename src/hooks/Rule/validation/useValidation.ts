import { getLabelFromValueInOptionList } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import type { MessageValidationCheckItem } from '@/types/typeAlias'
import {
  MessageValidationFailureAction,
  MessageValidationLogLevel,
  MessageValidationStrategy,
} from '@/types/typeAlias'
import useSchemaType from '../schema/useSchemaType'

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

type ValidationStrategyValue =
  typeof MessageValidationStrategy[keyof typeof MessageValidationStrategy]

export const useValidationStrategy = (): {
  validationStrategyOpts: { label: string; value: ValidationStrategyValue }[]
  getLabelByValue: (value: ValidationStrategyValue) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const validationStrategyOpts: Array<{ label: string; value: ValidationStrategyValue }> = [
    { label: tl('allPass'), value: MessageValidationStrategy.all_pass },
    { label: tl('anyPass'), value: MessageValidationStrategy.any_pass },
  ]

  const getLabelByValue = (value: ValidationStrategyValue) =>
    getLabelFromValueInOptionList(value, validationStrategyOpts)

  return { validationStrategyOpts, getLabelByValue }
}

type ValidationLogLevelValue =
  typeof MessageValidationLogLevel[keyof typeof MessageValidationLogLevel]

export const useValidationLogLevel = (): {
  validationLogLevelOpts: { label: string; value: ValidationLogLevelValue }[]
  getLabelByValue: (value: ValidationLogLevelValue) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const validationLogLevelOpts: Array<{ label: string; value: ValidationLogLevelValue }> = [
    { label: 'error', value: MessageValidationLogLevel.error },
    { label: 'warning', value: MessageValidationLogLevel.warning },
    { label: 'notice', value: MessageValidationLogLevel.notice },
    { label: 'info', value: MessageValidationLogLevel.info },
    { label: 'debug', value: MessageValidationLogLevel.debug },
    { label: tl('logLevelNone'), value: MessageValidationLogLevel.none },
  ]

  const getLabelByValue = (value: ValidationLogLevelValue) =>
    getLabelFromValueInOptionList(value, validationLogLevelOpts)

  return { validationLogLevelOpts, getLabelByValue }
}

type ValidationItemType = MessageValidationCheckItem['type']
export const useValidationItemType = (): {
  validationItemTypeOpts: Array<{ label: string; value: ValidationItemType }>
  isSchemaRegistry: (value: string) => boolean
} => {
  const { schemaTypeOpts } = useSchemaType()
  const validationItemTypeOpts: Array<{ label: string; value: ValidationItemType }> = [
    ...schemaTypeOpts,
    { label: 'SQL', value: 'sql' },
  ]
  const isSchemaRegistry = (value: string) => schemaTypeOpts.some((item) => item.value === value)

  return {
    validationItemTypeOpts,
    isSchemaRegistry,
  }
}
