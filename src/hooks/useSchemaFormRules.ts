import { PropType } from '@/types/enum'
import { Component } from '@/types/schemaForm'
import { FormItemRule } from 'element-plus'
import { ref, Ref } from 'vue'
import useFormRules from './useFormRules'
import { set, get } from 'lodash'

export type SchemaRules = {
  [key: string]: FormItemRule | SchemaRules
}

export default (): {
  rules: Ref<SchemaRules>
  countRules: (component: Component, path?: string) => void
} => {
  const rules: Ref<SchemaRules> = ref({})

  const { createRequiredRule, createNumRangeRule } = useFormRules()

  const getRuleItem = (type: PropType, label: string) => {
    const typeForRule = type === PropType.Enum ? 'select' : 'input'
    return createRequiredRule(label, typeForRule)
  }

  const countRules = (component: Component, path?: string): void => {
    const { required = [], properties } = component
    const getPathToSet = (key: string) => (path ? `${path}.${key}` : key)
    // add required rule
    required.forEach((key) => {
      const pathToSet = getPathToSet(key)
      const propItem = properties[key]
      const { type, label } = propItem
      set(rules.value, pathToSet, getRuleItem(type as PropType, label))
    })
    // add range limit
    Object.keys(properties).forEach((key) => {
      const pathToSet = getPathToSet(key)
      const propItem = properties[key]
      const { type, minimum, maximum } = propItem
      if (type === 'number' && (minimum !== undefined || maximum !== undefined)) {
        const currentRule = get(rules.value, pathToSet)
        const ruleArr = createNumRangeRule(minimum, maximum)
        if (currentRule && Array.isArray(currentRule)) {
          currentRule.push(...ruleArr)
        } else if (!currentRule) {
          set(rules.value, pathToSet, ruleArr)
        }
      }
    })
  }

  return {
    rules,
    countRules,
  }
}
