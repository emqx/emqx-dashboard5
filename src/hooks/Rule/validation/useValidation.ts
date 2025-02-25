import useI18nTl from '@/hooks/useI18nTl'
import type { SchemaValidationCheckItem } from '@/types/typeAlias'
import {
  SchemaValidationFailureAction,
  SchemaValidationLogLevel,
  SchemaValidationStrategy,
} from '@/types/typeAlias'
import useSchemaType from '../schema/useSchemaType'

type FailureActionValue =
  (typeof SchemaValidationFailureAction)[keyof typeof SchemaValidationFailureAction]

export const useValidationFailureAction = (): {
  failureActionOpts: { label: string; value: FailureActionValue }[]
  getLabelByValue: (value: FailureActionValue) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const failureActionOpts: Array<{ label: string; value: FailureActionValue }> = [
    { label: tl('dropMsg'), value: SchemaValidationFailureAction.drop },
    { label: tl('disconnect'), value: SchemaValidationFailureAction.disconnect },
    { label: tl('ignore'), value: SchemaValidationFailureAction.ignore },
  ]

  const getLabelByValue = (value: FailureActionValue) =>
    getLabelFromValueInOptionList(value, failureActionOpts)

  return { failureActionOpts, getLabelByValue }
}

type ValidationStrategyValue =
  (typeof SchemaValidationStrategy)[keyof typeof SchemaValidationStrategy]

export const useValidationStrategy = (): {
  validationStrategyOpts: { label: string; value: ValidationStrategyValue }[]
  getLabelByValue: (value: ValidationStrategyValue) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const validationStrategyOpts: Array<{ label: string; value: ValidationStrategyValue }> = [
    { label: tl('allPass'), value: SchemaValidationStrategy.all_pass },
    { label: tl('anyPass'), value: SchemaValidationStrategy.any_pass },
  ]

  const getLabelByValue = (value: ValidationStrategyValue) =>
    getLabelFromValueInOptionList(value, validationStrategyOpts)

  return { validationStrategyOpts, getLabelByValue }
}

type ValidationLogLevelValue =
  (typeof SchemaValidationLogLevel)[keyof typeof SchemaValidationLogLevel]

export const useValidationLogLevel = (): {
  validationLogLevelOpts: { label: string; value: ValidationLogLevelValue }[]
  getLabelByValue: (value: ValidationLogLevelValue) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const validationLogLevelOpts: Array<{ label: string; value: ValidationLogLevelValue }> = [
    { label: 'error', value: SchemaValidationLogLevel.error },
    { label: 'warning', value: SchemaValidationLogLevel.warning },
    { label: 'notice', value: SchemaValidationLogLevel.notice },
    { label: 'info', value: SchemaValidationLogLevel.info },
    { label: 'debug', value: SchemaValidationLogLevel.debug },
    { label: tl('logLevelNone'), value: SchemaValidationLogLevel.none },
  ]

  const getLabelByValue = (value: ValidationLogLevelValue) =>
    getLabelFromValueInOptionList(value, validationLogLevelOpts)

  return { validationLogLevelOpts, getLabelByValue }
}

type ValidationItemType = SchemaValidationCheckItem['type']
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
