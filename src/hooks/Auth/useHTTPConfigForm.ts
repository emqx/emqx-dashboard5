import { computed, ref, Ref, ComputedRef } from 'vue'
import useFormRules from '@/hooks/useFormRules'
import { FormRules } from '@/types/common'

export default (): {
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => any
} => {
  const { createRequiredRule } = useFormRules()
  const formCom = ref()
  const rules: ComputedRef<FormRules> = computed(() => {
    return {
      url: createRequiredRule('URL'),
    }
  })

  const validate = () => {
    return formCom.value.validate()
  }
  return {
    formCom,
    rules,
    validate,
  }
}
