import { computed, ref, Ref, ComputedRef } from 'vue'
import useFormRules from '@/hooks/useFormRules'
import { FormRules } from '@/types/common'
import useI18nTl from '../useI18nTl'
import { isJSONString } from '@/common/tools'

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
      body: [
        {
          validator(rules, value, callback) {
            if (!value || isJSONString(value)) {
              return callback()
            }
            callback(new Error(tl('jsonFormatError')))
          },
        },
      ],
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
