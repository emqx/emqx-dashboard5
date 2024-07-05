import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import useFormRules from '@/hooks/useFormRules'
import { FormRules } from '@/types/common'
import useI18nTl from '../useI18nTl'

export default (): {
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => any
} => {
  const { t, tl } = useI18nTl('Auth')
  const { createRequiredRule } = useFormRules()
  const formCom = ref()
  const rules: ComputedRef<FormRules> = computed(() => {
    return {
      username: createRequiredRule(t('Base.username')),
      server: createRequiredRule(tl('server')),
      base_dn: createRequiredRule(tl('base_dn')),
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
