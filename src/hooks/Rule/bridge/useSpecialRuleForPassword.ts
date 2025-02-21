import { ENCRYPTED_PWD_REG } from '@/common/constants'
import { FormItemRule } from '@/types/common'

export default (
  props: { edit?: boolean } & unknown,
): {
  ruleWhenEditing: Array<FormItemRule>
} => {
  const { tl } = useI18nTl('RuleEngine')
  // TODO: add rules for likePasswordFieldKeys
  // src/hooks/Rule/useDataHandler.ts:164:30
  const ruleWhenEditing = [
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
    ruleWhenEditing,
  }
}
