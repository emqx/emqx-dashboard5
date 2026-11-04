import { FormRules } from '@/types/common'

export default (getConnector: () => Record<string, any>, prefix = ''): FormRules => {
  const { t } = useI18n()
  return {
    [`${prefix}active_health_check.path`]: [
      {
        validator(_rule, value, callback) {
          if (value === undefined || value === '') {
            if (getConnector().active_health_check?.enable) {
              callback(
                new Error(
                  t('Rule.inputFieldRequiredError', { name: t('BridgeSchema.http.path.label') }),
                ),
              )
              return
            }
            callback()
            return
          }
          const valid =
            typeof value === 'string' &&
            value.startsWith('/') &&
            !value.startsWith('//') &&
            !/[#\r\n]/.test(value) &&
            !value.includes('\0') &&
            !/\$\{[.]?[a-zA-Z0-9._-]*\}/.test(value)
          callback(
            valid ? undefined : new Error(t('BridgeSchema.http.active_health_check_path.desc')),
          )
        },
        trigger: 'blur',
      },
    ],
    [`${prefix}resource_opts.health_check_timeout`]: [
      {
        validator(_rule, value, callback) {
          const invalid = getConnector().active_health_check?.enable && value === 'infinity'
          callback(
            invalid
              ? new Error(t('BridgeSchema.http.active_health_check_timeout.desc'))
              : undefined,
          )
        },
        trigger: 'change',
      },
    ],
  }
}
