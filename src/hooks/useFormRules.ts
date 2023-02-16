import { useI18n } from 'vue-i18n'
import { checkStringWithUnit, checkInRange } from '@/common/tools'
import { FormItemRule } from 'element-plus'
import { InternalRuleItem } from 'async-validator'

export default (): {
  createRequiredRule: (name: string, type?: 'input' | 'select') => Array<FormItemRule>
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

  const createIntFieldRule = (min?: number, max?: number): Array<FormItemRule> => {
    const ret: Array<FormItemRule> = [
      {
        type: 'number',
        message: t('Rule.errorType', { type: t('Rule.int') }),
        trigger: 'blur',
      },
    ]
    if (min !== undefined && max !== undefined) {
      ret.push({
        type: 'number',
        min,
        max,
        message: t('Rule.errorRange', { min, max }),
        trigger: 'blur',
      })
    } else if (min !== undefined) {
      ret.push({
        type: 'number',
        min,
        message: t('Rule.minimumError', { min }),
      })
    } else if (max !== undefined) {
      ret.push({
        type: 'number',
        max,
        message: t('Rule.maximumError', { max }),
        trigger: 'blur',
      })
    }
    return ret
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
    createStringWithUnitFieldRule,
  }
}
