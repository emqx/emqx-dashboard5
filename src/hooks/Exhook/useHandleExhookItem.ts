import { moveExhook, deleteExhook as requestDeleteExhook, updateExhook } from '@/api/exhook'
import { TargetPosition } from '@/types/enum'
import { Exhook, ExhookFormForCreate } from '@/types/systemModule'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useSSL from '../useSSL'

export default (): {
  deleteExhook: (name: string) => Promise<void>
  updateExhookEnable: (exhookData: Exhook, enable: boolean) => Promise<void>
  handleExhookBeforeSubmit: <T extends ExhookFormForCreate>(data: T) => T
  moveExhookToTop: (exhookItem: Exhook) => Promise<void>
  moveExhookToBottom: (exhookItem: Exhook) => Promise<void>
  moveExhookBeforeAnotherExhook: (exhookItem: Exhook, anotherExhook: Exhook) => Promise<void>
  moveExhookAfterAnotherExhook: (exhookItem: Exhook, anotherExhook: Exhook) => Promise<void>
} => {
  const { t } = useI18n()

  const keysForUpdateExhook: Array<keyof ExhookFormForCreate> = [
    'auto_reconnect',
    'enable',
    'failed_action',
    'name',
    'pool_size',
    'request_timeout',
    'ssl',
    'url',
  ]

  const deleteExhook = async (name: string) => {
    try {
      await ElMessageBox.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        confirmButtonClass: 'confirm-danger',
        type: 'warning',
      })
      await requestDeleteExhook(name)
      ElMessage.success(t('Base.deleteSuccess'))
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const getExhookDataNecessaryDataForUpdate = (exhookData: Exhook): ExhookFormForCreate => {
    return keysForUpdateExhook.reduce((obj, currentKey) => {
      return Object.assign(obj, { [currentKey]: exhookData[currentKey] })
    }, {}) as ExhookFormForCreate
  }

  const { handleSSLDataBeforeSubmit } = useSSL()
  const updateExhookEnable = async (exhookData: Exhook, enable: boolean) => {
    try {
      const data = getExhookDataNecessaryDataForUpdate(exhookData)
      data.ssl = handleSSLDataBeforeSubmit(data.ssl)
      data.enable = enable
      await updateExhook(data)
      ElMessage.success(t(`Base.${enable ? 'enableSuccess' : 'disabledSuccess'}`))
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleExhookBeforeSubmit = <T extends ExhookFormForCreate>(data: T): T => {
    const ret = cloneDeep(data)
    if (typeof ret.auto_reconnect === 'string' && ret.auto_reconnect === '') {
      Reflect.deleteProperty(ret, 'auto_reconnect')
    }
    if (!ret.request_timeout) {
      Reflect.deleteProperty(ret, 'request_timeout')
    }
    return ret
  }

  const moveExhookToTop = (exhookItem: Exhook) => {
    return moveExhook(exhookItem.name, TargetPosition.Top)
  }

  const moveExhookToBottom = (exhookItem: Exhook) => {
    return moveExhook(exhookItem.name, TargetPosition.Bottom)
  }

  const moveExhookBeforeAnotherExhook = (exhookItem: Exhook, anotherExhook: Exhook) => {
    return moveExhook(exhookItem.name, `${TargetPosition.Before}${anotherExhook.name}`)
  }

  const moveExhookAfterAnotherExhook = (exhookItem: Exhook, anotherExhook: Exhook) => {
    return moveExhook(exhookItem.name, `${TargetPosition.After}${anotherExhook.name}`)
  }

  return {
    deleteExhook,
    updateExhookEnable,
    handleExhookBeforeSubmit,
    moveExhookToTop,
    moveExhookToBottom,
    moveExhookBeforeAnotherExhook,
    moveExhookAfterAnotherExhook,
  }
}
