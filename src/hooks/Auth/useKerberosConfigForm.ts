import { FormRules } from '@/types/common'
import useFormRules from '../useFormRules'
import useI18nTl from '../useI18nTl'

export default (): {
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => any
} => {
  const formCom = ref()
  const { createRequiredRule } = useFormRules()
  const { tl } = useI18nTl('Auth')
  const rules: ComputedRef<FormRules> = computed(() => {
    return {
      principal: createRequiredRule(tl('principal'), 'input'),
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
