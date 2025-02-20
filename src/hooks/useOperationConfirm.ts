import type { MessageBoxData } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isFunction } from 'lodash'
import useI18nTl from './useI18nTl'

export default (): {
  operationWarning: (confirmText: string, opts?: Record<string, any>) => Promise<MessageBoxData>
  confirmDel: (
    callback: () => Promise<unknown>,
    confirmText?: string,
    sucText?: string,
  ) => Promise<void>
} => {
  const { tl } = useI18nTl('Base')

  const operationWarning = (confirmText: string, opts: Record<string, any> = {}) =>
    ElMessageBox.confirm(confirmText, {
      confirmButtonText: tl('confirm'),
      cancelButtonText: tl('cancel'),
      type: 'warning',
      ...opts,
    })

  const defaultDelConfirmText = tl('confirmDelete')
  const defaultSucText = tl('deleteSuccess')
  const confirmDel = async (
    callback: () => Promise<unknown>,
    confirmText = defaultDelConfirmText,
    sucText = defaultSucText,
  ) => {
    try {
      await operationWarning(confirmText, { confirmButtonClass: 'confirm-danger' })
      if (callback && isFunction(callback)) {
        await callback()
      }
      sucText && ElMessage.success(sucText)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    operationWarning,
    confirmDel,
  }
}
