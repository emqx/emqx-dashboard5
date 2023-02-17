import { useI18n } from 'vue-i18n'
import { checkStringWithUnit, checkInRange } from '@/common/tools'
import { FormItemRule } from 'element-plus'
import { InternalRuleItem } from 'async-validator'

export default (): {
  createRequiredRule: (name: string, type?: 'input' | 'select') => Array<FormItemRule>
  createNumRangeRule: (min?: number, max?: number) => Array<FormItemRule>
  createIntFieldRule: (min?: number | undefined, max?: number | undefined) => Array<FormItemRule>
  createStringWithUnitFieldRule: (
    units: Array<string>,
    min?: number | undefined,
    max?: number | undefined,
  ) => Array<FormItemRule>
} => {
  const { t } = useI18n()

  const createRequiredRule = (
    name: string,
    type: 'input' | 'select' = 'input',
  ): Array<FormItemRule> => {
    return [
      {
        required: true,
        message: t(
          type === 'input' ? 'Rule.inputFieldRequiredError' : 'Rule.selectFieldRequiredError',
          { name },
        ),
      },
    ]
  }

  const createNumRangeRule = (min?: number, max?: number): Array<FormItemRule> => {
    if (min === undefined && max === undefined) {
      return []
    }
    const errorMsg =
      min !== undefined && max !== undefined
        ? t('Rule.errorRange', { min, max })
        : min !== undefined
        ? t('Rule.minimumError', { min })
        : t('Rule.maximumError', { max })
    return [{ type: 'number', min, max, message: errorMsg, trigger: 'change' }]
  }

  const createIntFieldRule = (min?: number, max?: number): Array<FormItemRule> => {
    return [
      {
        type: 'number',
        message: t('Rule.errorType', { type: t('Rule.int') }),
        trigger: 'blur',
      },
      ...createNumRangeRule(min, max),
    ]
  }

  const createStringWithUnitFieldRule = (
    units: Array<string>,
    min?: number,
    max?: number,
  ): Array<FormItemRule> => {
    const ret = [
      {
        validator(rule: InternalRuleItem, val: string) {
          if (!checkStringWithUnit(val, units)) {
            return [new Error(t('Rule.formatError'))]
          }
          return []
        },
        trigger: 'blur',
      },
    ]
    if (min !== undefined && max !== undefined) {
      ret.push({
        validator(rule: InternalRuleItem, val: string) {
          if (!checkInRange(parseFloat(val), min, max)) {
            return [new Error(t('Rule.errorRange', { min, max }))]
          }
          return []
        },
        trigger: 'change',
      })
    }
    return ret
  }

  return {
    createRequiredRule,
    createIntFieldRule,
    createNumRangeRule,
    createStringWithUnitFieldRule,
  }
}
