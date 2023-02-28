import { ENCRYPTED_PWD_REG } from '@/common/constants'
import useI18nTl from '@/hooks/useI18nTl'

export default (props: any) => {
  const { tl } = useI18nTl('RuleEngine')

  const ruleWhenTestConnection = [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (
          props.edit &&
          // is not encrypted pwd
          !ENCRYPTED_PWD_REG.test(value) &&
          // changed part of pwd
          (/^\*{1,5}$/.test(value) || /^\*{6}.+$/.test(value))
        ) {
          callback(new Error(tl('changePwdTip')))
        }
        callback()
      },
    },
  ]

  return {
    ruleWhenTestConnection,
  }
}
