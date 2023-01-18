import { ENCRYPTED_PWD_REG } from '@/common/constants'
import useI18nTl from '@/hooks/useI18nTl'

export default (props: any) => {
  const { tl } = useI18nTl('RuleEngine')

  const ruleWhenTestConnection = [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (props.validateForTestConnection && ENCRYPTED_PWD_REG.test(value)) {
          callback(new Error(tl('reInputPwdRequired')))
        } else {
          callback()
        }
      },
    },
  ]

  return {
    ruleWhenTestConnection,
  }
}
