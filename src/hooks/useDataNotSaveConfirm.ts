import useI18nTl from '@/hooks/useI18nTl'
import { ElMessageBox } from 'element-plus'
import { isFunction } from 'lodash'
import { onMounted, onUnmounted, Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { isEqual, cloneDeep } from 'lodash'

export const useCheckDataChanged = (
  nowData: Ref<any>,
): {
  setRawData: (data: any) => void
  checkDataIsChanged: () => boolean
} => {
  let rawData: any = undefined

  const checkDataIsChanged = () => !isEqual(rawData, nowData.value)

  const setRawData = (data: any) => {
    rawData = cloneDeep(data)
  }

  return {
    setRawData,
    checkDataIsChanged,
  }
}

export default (countIsRecordChanged?: () => boolean): void => {
  const { t } = useI18nTl('RuleEngine')

  const { getters } = useStore()
  const unloadHandler = (event: BeforeUnloadEvent) => {
    if (isFunction(countIsRecordChanged) && !countIsRecordChanged()) {
      return
    }
    event.preventDefault()
    event.returnValue = ''
  }

  const bindEventListener = () => {
    if (getters.isDev) {
      return
    }
    window.addEventListener('beforeunload', unloadHandler)
  }

  const unbindEventListener = () => {
    window.removeEventListener('beforeunload', unloadHandler)
  }

  const customPopupWarning = () => {
    if (getters.isDev) {
      return Promise.resolve()
    }
    return ElMessageBox({
      type: 'info',
      title: t('Base.leavePage'),
      message: t('Base.unloadTip'),
      showCancelButton: true,
      confirmButtonText: t('Base.leave'),
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
    })
  }

  onBeforeRouteLeave(async (to) => {
    try {
      // is same
      if (to.name !== 'login' && (!isFunction(countIsRecordChanged) || countIsRecordChanged())) {
        await customPopupWarning()
      }
      return
    } catch (error) {
      return false
    }
  })

  onMounted(bindEventListener)

  onUnmounted(unbindEventListener)
}
