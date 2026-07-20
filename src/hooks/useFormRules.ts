import { InternalRuleItem } from 'async-validator'
import { FormItemRule } from 'element-plus'
import {
  COMMON_ID_REG,
  LIMITER_BURST_REG,
  LIMITER_BYTES_BURST_REG,
  MESSAGE_QUEUE_NAME_REG,
} from '@/common/constants'

export const NO_CHINESE_REG = /^[^\u4e00-\u9fa5]+$/

export default (): {
  createRequiredRule: (name: string, type?: 'input' | 'select') => Array<FormItemRule>
  createNumRangeRule: (min?: number, max?: number) => Array<FormItemRule>
  createIntFieldRule: (min?: number | undefined, max?: number | undefined) => Array<FormItemRule>
  createCommonIdRule: () => Array<FormItemRule>
  /**
   * for message queue and stream name
   */
  createMessageQueueNameRule: () => Array<FormItemRule>
  createLetterStartRule: () => Array<FormItemRule>
  createNoChineseRule: () => Array<FormItemRule>
  createLimiterRule: (isBytesLimiter?: boolean) => Array<FormItemRule>
  createStringWithUnitFieldRule: (
    units: Array<string>,
    min?: number | undefined,
    max?: number | undefined,
  ) => Array<FormItemRule>
  createMqttPublishTopicRule: () => Array<FormItemRule>
  createMqttSubscribeTopicRule: () => Array<FormItemRule>
} => {
  const { t } = useI18n()

  const createCommonIdRule = (): Array<FormItemRule> => [
    { pattern: COMMON_ID_REG, message: t('Base.commonIdError') },
  ]

  const createMessageQueueNameRule = (): Array<FormItemRule> => [
    { pattern: MESSAGE_QUEUE_NAME_REG, message: t('Base.messageQueueNameError') },
  ]

  const createLetterStartRule = (): Array<FormItemRule> => [
    { pattern: /^[A-Za-z]+[A-Za-z0-9-_]*$/, message: t('Base.letterBeginError') },
  ]

  const createNoChineseRule = (): Array<FormItemRule> => [
    { pattern: NO_CHINESE_REG, message: t('Base.notSupportedChinese') },
  ]

  const createLimiterRule = (isBytesLimiter = false): Array<FormItemRule> => [
    {
      pattern: isBytesLimiter ? LIMITER_BYTES_BURST_REG : LIMITER_BURST_REG,
      message: t('Rule.formatError'),
      trigger: 'blur',
    },
  ]

  const createRequiredRule = (
    name: string,
    type: 'input' | 'select' = 'input',
  ): Array<FormItemRule> => {
    let message = ''
    if (name) {
      message = t(
        type === 'input' ? 'Rule.inputFieldRequiredError' : 'Rule.selectFieldRequiredError',
        { name },
      )
    } else {
      message = t(type === 'input' ? 'Rule.inputRequired' : 'Rule.selectRequired')
    }

    return [{ message, required: true }]
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

  const createMqttPublishTopicRule = (): Array<FormItemRule> => {
    return [
      {
        validator(rule: InternalRuleItem, val: string) {
          if (!val) {
            return []
          }
          // Validate whether the length exceeds the limit
          if (val.length > 65535) {
            return [new Error(t('Rule.errorTopicLengthExceedLimit'))]
          }
          // Validate whether it contains illegal characters
          if (/[+#]/.test(val)) {
            return [new Error(t('Rule.errorInvalidCharacterInPublish'))]
          }
          return []
        },
        trigger: 'blur',
      },
    ]
  }

  const createMqttSubscribeTopicRule = (): Array<FormItemRule> => {
    return [
      {
        validator(rule: InternalRuleItem, val: string) {
          if (!val) {
            return []
          }
          // Validate whether the length exceeds the limit
          if (val.length > 65535) {
            return [new Error(t('Rule.errorTopicLengthExceedLimit'))]
          }
          // Validate the correct use of wildcards
          const segments = val.split('/')
          for (let i = 0; i < segments.length; i++) {
            const segment = segments[i]
            // '#' should only appear alone and in the last segment
            if (segment === '#') {
              if (i !== segments.length - 1) {
                return [new Error(t('Rule.errorInvalidUseOfHashWildcard'))]
              }
            } else if (segment.includes('#')) {
              return [new Error(t('Rule.errorInvalidUseOfHashWildcard'))]
            }
            // '+' should only appear alone in a segment
            if (segment.includes('+') && segment !== '+') {
              return [new Error(t('Rule.errorInvalidUseOfPlusWildcard'))]
            }
          }
          return []
        },
        trigger: 'blur',
      },
    ]
  }

  return {
    createRequiredRule,
    createIntFieldRule,
    createNumRangeRule,
    createCommonIdRule,
    createMessageQueueNameRule,
    createLetterStartRule,
    createNoChineseRule,
    createLimiterRule,
    createStringWithUnitFieldRule,
    createMqttPublishTopicRule,
    createMqttSubscribeTopicRule,
  }
}
