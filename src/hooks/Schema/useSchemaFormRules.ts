import { FormRules } from '@/types/common'
import { PropType } from '@/types/enum'
import { Component } from '@/types/schemaForm'
import { ref, Ref } from 'vue'
import useFormRules from '../useFormRules'

export type SchemaRules = FormRules

export default (): {
  rules: Ref<FormRules>
  setToRules: (component: Component, path?: string) => void
  countRules: (component: Component, rules: FormRules, path?: string) => FormRules
} => {
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
        (minimum !== undefined || maximum !== undefined)
      ) {
        const currentRule = ruleMap[pathToSet]
        const ruleArr = createNumRangeRule(minimum, maximum)
        if (currentRule && Array.isArray(currentRule)) {
          currentRule.push(...ruleArr)
        } else if (!currentRule) {
          ruleMap[pathToSet] = ruleArr
        }
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
