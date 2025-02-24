export default (): {
  pwdErrorWhenCoping: Ref<string>
  checkLikePwdField: (bridge: any, errorMsg?: string) => Promise<void>
} => {
  const { tl } = useI18nTl('RuleEngine')

  const pwdErrorWhenCoping = ref('')

  const { likePasswordFieldKeys } = useBridgeDataHandler()
  const getPwdValues = (bridge: any) => {
    return likePasswordFieldKeys.map((key) => get(bridge, key)).filter(Boolean)
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
