import { FormRules } from '@/types/common'
import { computed, ref, ComputedRef, Ref } from 'vue'

export default (): {
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => Promise<boolean>
} => {
  const formCom = ref()

  const rules = computed(() => {
    return {}
  })

  const validate = () => {
    return Promise.resolve(true)
  }

  return {
    formCom,
    rules,
    validate,
  }
}
