import { checkInRange, checkStringWithUnit } from '@/common/tools'
import { InternalRuleItem } from 'async-validator'
import { FormItemRule } from 'element-plus'
import { isUndefined } from 'lodash'
import { useI18n } from 'vue-i18n'

const COMMON_ID_REG = /^[A-Za-z0-9]+[A-Za-z0-9-_]*$/
export const NO_CHINESE_REG = /^[^\u4e00-\u9fa5]+$/

export default (): {
  createRequiredRule: (name: string, type?: 'input' | 'select') => Array<FormItemRule>
  createNumRangeRule: (min?: number, max?: number) => Array<FormItemRule>
  createIntFieldRule: (min?: number | undefined, max?: number | undefined) => Array<FormItemRule>
  createCommonIdRule: () => Array<FormItemRule>
  createNoChineseRule: () => Array<FormItemRule>
  createStringWithUnitFieldRule: (
    units: Array<string>,
    min?: number | undefined,
    max?: number | undefined,
  ) => Array<FormItemRule>
} => {
  const { t } = useI18n()

  const createCommonIdRule = (): Array<FormItemRule> => [
    { pattern: COMMON_ID_REG, message: t('Base.commonIdError') },
  ]

  const createNoChineseRule = (): Array<FormItemRule> => [
    { pattern: NO_CHINESE_REG, message: t('Base.notSupportedChinese') },
  ]

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
    if (isUndefined(min) && isUndefined(max)) {
      return [
        {
          type: 'number',
          message: t('Rule.errorType', { type: t('Rule.int') }),
          trigger: 'blur',
        },
      ]
    }
    return createNumRangeRule(min, max)
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
    createCommonIdRule,
    createNoChineseRule,
    createStringWithUnitFieldRule,
  }
}
