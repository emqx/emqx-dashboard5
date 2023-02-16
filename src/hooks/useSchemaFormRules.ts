import { PropType } from '@/types/enum'
import { Component } from '@/types/schemaForm'
import { FormItemRule } from 'element-plus'
import { ref, Ref } from 'vue'
import useFormRules from './useFormRules'
import { set } from 'lodash'

export type SchemaRules = {
  [key: string]: FormItemRule | SchemaRules
}

export default (): {
  rules: Ref<SchemaRules>
  countRules: (component: Component, path?: string) => void
} => {
  const rules: Ref<SchemaRules> = ref({})

  const { createRequiredRule } = useFormRules()

  const getRuleItem = (type: PropType, label: string) => {
    const typeForRule = type === PropType.Enum ? 'select' : 'input'
    return createRequiredRule(label, typeForRule)
  }

  const countRules = (component: Component, path?: string): void => {
    const { required = [], properties } = component
    required.forEach((key) => {
      const pathToSet = path ? `${path}.${key}` : key
      const propItem = properties[key]
      const { type, label } = propItem
      set(rules.value, pathToSet, getRuleItem(type as PropType, label))
    })
  }

  return {
    rules,
    countRules,
  }
}
