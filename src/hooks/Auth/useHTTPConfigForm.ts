import { FormRules } from '@/types/common'
import { isJSONString } from '@emqx/shared-ui-utils'

const HOSTNAME_REG = /^[a-z0-9-]+(?:\.[a-z0-9-]+)*$/i
const MAX_HOSTNAME_LENGTH = 253

const isTemplatedURLHost = (url: string): boolean => {
  const authority = url.match(/^[a-z][a-z\d+.-]*:\/\/([^/?#]*)/i)?.[1]
  return authority?.includes('${') ?? false
}

const isValidAllowedHost = (value: string): boolean => {
  const hostname = value.startsWith('*.') ? value.slice(2) : value
  return (
    hostname.length > 0 && hostname.length <= MAX_HOSTNAME_LENGTH && HOSTNAME_REG.test(hostname)
  )
}

export default (
  httpConfig: Ref<Record<string, any>>,
  supportsDynamicHostname: () => boolean,
): {
  formCom: Ref<any>
  rules: ComputedRef<FormRules>
  validate: () => any
} => {
  const { t, tl } = useI18nTl('Auth')
  const { createRequiredRule, createIntFieldRule } = useFormRules()
  const formCom = ref()
  const rules: ComputedRef<FormRules> = computed(() => {
    const isDynamic = httpConfig.value.hostname_resolution === 'dynamic'
    const ret: FormRules = {
      method: createRequiredRule(tl('method'), 'select'),
      url: [
        ...createRequiredRule('URL'),
        {
          validator(_rule, value: string, callback) {
            if (!value || !isTemplatedURLHost(value)) {
              return callback()
            }
            if (!supportsDynamicHostname()) {
              return callback(new Error(tl('templatedHostnameNotSupported')))
            }
            if (!isDynamic) {
              return callback(new Error(tl('templatedHostnameRequiresDynamic')))
            }
            callback()
          },
        },
      ],
      hostname_resolution: [
        ...createRequiredRule(tl('hostnameResolution'), 'select'),
        {
          validator(_rule, value: string, callback) {
            if (value === 'dynamic' && httpConfig.value.oauth2?.enable) {
              return callback(new Error(tl('dynamicHostnameOAuth2Conflict')))
            }
            callback()
          },
        },
      ],
      allowed_hosts: [
        {
          validator(_rule, value: unknown, callback) {
            const allowedHosts = Array.isArray(value) ? value : []
            if (
              isDynamic &&
              isTemplatedURLHost(httpConfig.value.url) &&
              allowedHosts.length === 0
            ) {
              return callback(new Error(tl('templatedHostnameRequiresAllowedHosts')))
            }
            if (
              allowedHosts.some((item) => typeof item !== 'string' || !isValidAllowedHost(item))
            ) {
              return callback(new Error(tl('invalidAllowedHost')))
            }
            callback()
          },
        },
      ],
      pool_size: createIntFieldRule(isDynamic ? 0 : 1),
      body: [
        {
          validator(_rule, value, callback) {
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
