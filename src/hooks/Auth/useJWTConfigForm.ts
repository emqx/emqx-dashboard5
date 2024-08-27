import { FormRules } from '@/types/common'
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import useFormRules from '../useFormRules'
import useI18nTl from '../useI18nTl'

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
