import { AuthnItem } from '@/types/auth'
import { MessageBoxData } from 'element-plus'

export default (): {
  setRawSetting: (data: AuthnItem) => void
  compareData: (data: AuthnItem) => Promise<void> | Promise<MessageBoxData>
} => {
  const { tl } = useI18nTl('Auth')

  let rawSetting: undefined | AuthnItem = undefined

  const setRawSetting = (data: AuthnItem) => {
    rawSetting = cloneDeep(data)
  }

  const compareData = (data: AuthnItem) => {
    const { password_hash_algorithm: newHashSetting } = data
    const { password_hash_algorithm: oldHashSetting } = rawSetting || {}
    if (
      !newHashSetting ||
      !oldHashSetting ||
      (isEqual(newHashSetting, oldHashSetting) &&
        data.autogenerate_password === rawSetting?.autogenerate_password)
    ) {
      return Promise.resolve()
    }
    return ElMessageBox.confirm(tl('updateBuiltInTip'), { type: 'warning' })
  }

  return {
    setRawSetting,
    compareData,
  }
}
