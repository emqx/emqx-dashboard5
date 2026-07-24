import { FormRules } from '@/types/common'
import { isJSONString } from '@emqx/shared-ui-utils'

export default (): {
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => any
} => {
  const { t, tl } = useI18nTl('Auth')
  const { createRequiredRule } = useFormRules()
  const formCom = ref()
  const rules: ComputedRef<FormRules> = computed(() => {
    const ret: FormRules = {
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
      'oauth2.token_endpoint': createRequiredRule(
        t('BridgeSchema.http.oauth2_token_endpoint.label'),
      ),
      'oauth2.client_id': createRequiredRule(t('BridgeSchema.http.oauth2_client_id.label')),
      'oauth2.client_secret': createRequiredRule(t('BridgeSchema.http.oauth2_client_secret.label')),
    }
    return ret
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
