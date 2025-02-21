import { FormRules } from '@/types/common'

export default (): {
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => Promise<boolean>
} => {
  const formCom = ref()

  const { createRequiredRule } = useFormRules()
  const { tl } = useI18nTl('Auth')
  const rules: ComputedRef<FormRules> = computed(() => {
    return {
      algorithm: createRequiredRule(tl('algorithm'), 'select'),
      endpoint: createRequiredRule('JWKS Server'),
      secret: createRequiredRule('Secret'),
      public_key: createRequiredRule('Public Key'),
    }
  })

  const validate = () => {
    return formCom.value?.validate()
  }

  return {
    formCom,
    rules,
    validate,
  }
}
