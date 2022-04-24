import { computed, ref, Ref, ComputedRef } from 'vue'
import useFormRules from '@/hooks/useFormRules'
import { FormRules } from '@/types/common'
import useI18nTl from '../useI18nTl'

export default (): {
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => any
} => {
  const { tl } = useI18nTl('Auth')
  const { createRequiredRule } = useFormRules()
  const formCom = ref()
  const rules: ComputedRef<FormRules> = computed(() => {
    return {
      method: createRequiredRule(tl('method'), 'select'),
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
