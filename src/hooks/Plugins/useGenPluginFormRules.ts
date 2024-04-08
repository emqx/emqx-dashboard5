import { PluginUIConfigForm, Rule } from '@/types/plugin'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import { computed } from 'vue'

const checkRange = (
  rule: Rule,
  value: number,
  lang: 'zh' | 'en',
  callback: (error?: Error) => void,
) => {
  const { min, max, message } = rule
  if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
    callback(new Error(message[lang]))
  } else {
    callback()
  }
}

const checkPattern = (
  rule: Rule,
  value: string | null,
  lang: 'zh' | 'en',
  callback: (error?: Error) => void,
) => {
  const { pattern, message } = rule
  if (pattern && value) {
    const reg = new RegExp(pattern as string)
    if (!reg.test(value)) {
      callback(new Error(message[lang]))
      return
    }
  }
  callback()
}

const genElementUIFormRules = (formConfigs: PluginUIConfigForm, lang: 'zh' | 'en') => {
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
                checkRange(rule, value, lang, callback),
              trigger: 'blur',
            })
            break
          case 'length':
            res[key].push({
              min: rule.minLength,
              max: rule.maxLength,
              message: rule.message[lang],
              trigger: 'blur',
            })
            break
          case 'pattern':
            res[key].push({
              validator: (_: any, value: string, callback: (error?: Error) => Error) =>
                checkPattern(rule, value, lang, callback),
              trigger: 'blur',
            })
        }
      })
    } else if (formConfigs[key].children) {
      const childRules = genElementUIFormRules(formConfigs[key].children, lang)
      if (!isEmptyObj(childRules)) {
        res[key] = childRules
      }
    }
  })
  return res
}

export default function usePluginGenFormRules(options: {
  lang: 'zh' | 'en'
  formConfigs: PluginUIConfigForm
}): Record<string, any> {
  const rules = computed(() => genElementUIFormRules(options.formConfigs, options.lang))
  return {
    rules,
  }
}
