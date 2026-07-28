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

  const scrollAlertIntoView = async () => {
    await waitAMoment(100)
    const el = document.querySelector('.el-alert--error')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
      scrollAlertIntoView()
      return Promise.reject()
    }
    return Promise.resolve()
  }
  return {
    pwdErrorWhenCoping,
    checkLikePwdField,
  }
}
