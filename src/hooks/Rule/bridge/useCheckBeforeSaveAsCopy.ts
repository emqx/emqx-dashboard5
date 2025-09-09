import { ENCRYPTED_PWD_REG } from '@/common/constants'
import { jumpToErrorFormItem } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { get } from 'lodash'
import { ref, Ref } from 'vue'
import { useCommonDataHandler } from '../useDataHandler'

export default (): {
  pwdErrorWhenCoping: Ref<string>
  checkLikePwdField: (bridge: any, errorMsg?: string) => Promise<void>
} => {
  const { tl } = useI18nTl('RuleEngine')

  const pwdErrorWhenCoping = ref('')

  const { likePasswordFieldKeys, getLikePasswordFieldKeys } = useCommonDataHandler()
  const getPwdValues = (bridge: any) => {
    const ret = likePasswordFieldKeys.map((key) => get(bridge, key)).filter(Boolean)
    const specialKeys = getLikePasswordFieldKeys(bridge)
    specialKeys.forEach((key) => {
      if (get(bridge, key) !== undefined) {
        ret.push(get(bridge, key))
      }
    })
    return ret
  }

  const tryToViewPwdInput = () => {
    const jumpSuc = jumpToErrorFormItem('input[type="password"]')
    if (!jumpSuc) {
      const el = (
        Array.from(
          document.querySelectorAll('input[autocomplete="one-time-code"]'),
        ) as Array<HTMLInputElement>
      ).find((item) => {
        return item.value && ENCRYPTED_PWD_REG.test(item.value)
      })
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }
  const checkLikePwdField = async (bridge: any, errorMsg?: string) => {
    const pwdValues = getPwdValues(bridge)
    pwdErrorWhenCoping.value = ''
    if (
      pwdValues !== undefined &&
      pwdValues.length &&
      pwdValues.some((item) => ENCRYPTED_PWD_REG.test(item))
    ) {
      pwdErrorWhenCoping.value = errorMsg || tl('pwdWarningWhenCoping')
      tryToViewPwdInput()
      return Promise.reject()
    }
    return Promise.resolve()
  }
  return {
    pwdErrorWhenCoping,
    checkLikePwdField,
  }
}
