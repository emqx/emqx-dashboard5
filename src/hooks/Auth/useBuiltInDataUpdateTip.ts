import { AuthnItem } from '@/types/auth'
import { ElMessageBox, MessageBoxData } from 'element-plus'
import { cloneDeep } from 'lodash'
import useI18nTl from '../useI18nTl'

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
      (newHashSetting.name === oldHashSetting.name &&
        newHashSetting.salt_position === oldHashSetting.salt_position)
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
