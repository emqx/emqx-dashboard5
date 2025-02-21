import { transTimeStrToMS } from '@/common/tools'
import { FormRules } from '@/types/common'
import { PropType } from '@/types/enum'
import { Component } from '@/types/schemaForm'

export type SchemaRules = FormRules

export default (): {
  rules: Ref<FormRules>
  setToRules: (component: Component, path?: string) => void
  countRules: (component: Component, rules: FormRules, path?: string) => FormRules
} => {
  const { tl } = useI18nTl('Rule')

  const rules: Ref<FormRules> = ref({})

  const { createRequiredRule, createNumRangeRule } = useFormRules()

  const getRuleItem = (type: PropType, label: string) => {
    const typeForRule = type === PropType.Enum ? 'select' : 'input'
    return createRequiredRule(label, typeForRule)
  }

  const countRules = (component: Component, ruleMap: FormRules, path?: string): FormRules => {
    const { required = [], properties } = component
    const getPathToSet = (key: string) => (path ? `${path}.${key}` : key)
    // add required rule
    required.forEach((key) => {
      const pathToSet = getPathToSet(key)
      const propItem = properties[key]
      const { type, label } = propItem
      ruleMap[pathToSet] = getRuleItem(type as PropType, label)
    })
    // add range limit
    Object.keys(properties).forEach((key) => {
      const pathToSet = getPathToSet(key)
      const propItem = properties[key]
      const { type, minimum, maximum } = propItem
      if (
        (type === 'number' || type === 'integer') &&
        ((minimum !== undefined && isNumber(minimum)) ||
          (maximum !== undefined && isNumber(maximum)))
      ) {
        const currentRule = ruleMap[pathToSet]
        const ruleArr = createNumRangeRule(minimum as number, maximum as number)
        if (currentRule && Array.isArray(currentRule)) {
          currentRule.push(...ruleArr)
        } else if (!currentRule) {
          ruleMap[pathToSet] = ruleArr
        }
      } else if (type === 'duration' && (minimum !== undefined || maximum !== undefined)) {
        ruleMap[pathToSet] = [
          {
            validator: (rule, value, callback) => {
              if (!isUndefined(value)) {
                const msNum = transTimeStrToMS(value)
                const min = minimum ? transTimeStrToMS(minimum as string) : undefined
                const max = maximum ? transTimeStrToMS(maximum as string) : undefined
                if (typeof msNum === 'number') {
                  if (!isUndefined(min) && !isString(min) && msNum < min) {
                    return callback(
                      new Error(tl('durationMinimumError', { min: minimum as string })),
                    )
                  }
                  if (!isUndefined(max) && !isString(max) && msNum > max) {
                    return callback(
                      new Error(tl('durationMaximumError', { max: maximum as string })),
                    )
                  }
                }
              }
              callback()
            },
          },
        ]
      }
    })
    return ruleMap
  }

  const setToRules = (component: Component, path?: string): void => {
    rules.value = countRules(component, rules.value, path)
  }

  return {
    rules,
    countRules,
    setToRules,
  }
}
