import { PluginUIConfigForm, Rule } from '@/types/plugin'
import { isEmptyObj } from '@emqx/shared-ui-utils'

/**
 * Checks if a given value is within the specified range.
 * @param rule - The rule object containing the range constraints.
 * @param value - The value to be checked.
 * @param callback - The callback function to be called with an optional error parameter.
 */
const checkRange = (rule: Rule, value: number, callback: (error?: Error) => void) => {
  const { min, max, message } = rule
  if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
    callback(new Error(message))
  } else {
    callback()
  }
}

/**
 * Checks if the given value matches the specified pattern and calls the callback function accordingly.
 * @param rule - The rule object containing the pattern and message.
 * @param value - The value to be checked against the pattern.
 * @param callback - The callback function to be called with an error if the value does not match the pattern.
 */
const checkPattern = (rule: Rule, value: string | null, callback: (error?: Error) => void) => {
  const { pattern, message } = rule
  if (pattern && value) {
    const reg = new RegExp(pattern as string)
    if (!reg.test(value)) {
      callback(new Error(message))
      return
    }
  }
  callback()
}

/**
 * Generates Element UI form rules based on the provided form configurations.
 *
 * @param formConfigs - The form configurations.
 * @returns The generated Element UI form rules.
 */
const genElementUIFormRules = (formConfigs: PluginUIConfigForm) => {
  const res: Record<string, any> = {}
  Object.keys(formConfigs).forEach((key) => {
    const { rules } = formConfigs[key]
    if (rules) {
      res[key] = []
      rules.forEach((rule: Rule) => {
        switch (rule.type) {
          case 'range':
            res[key].push({
              validator: (_: any, value: number, callback: (error?: Error) => Error) =>
                checkRange(rule, value, callback),
              trigger: 'blur',
            })
            break
          case 'length':
            res[key].push({
              min: rule.minLength,
              max: rule.maxLength,
              message: rule.message,
              trigger: 'blur',
            })
            break
          case 'pattern':
            res[key].push({
              validator: (_: any, value: string, callback: (error?: Error) => Error) =>
                checkPattern(rule, value, callback),
              trigger: 'blur',
            })
        }
      })
    } else if (formConfigs[key].children) {
      const childRules = genElementUIFormRules(formConfigs[key].children)
      if (!isEmptyObj(childRules)) {
        res[key] = childRules
      }
    }
  })
  return res
}

export default function usePluginGenFormRules(options: {
  formConfigs: PluginUIConfigForm
}): Record<string, any> {
  const rules = computed(() => genElementUIFormRules(options.formConfigs))
  return {
    rules,
  }
}
