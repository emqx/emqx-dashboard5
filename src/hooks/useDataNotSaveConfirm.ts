import useI18nTl from '@/hooks/useI18nTl'
import { ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'

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

export default (
  judgeNeedBlock?: () => boolean,
  leaveTipKey = 'Base.unloadTip',
): {
  updateIsSubmitted: () => void
} => {
  const { t } = useI18nTl('RuleEngine')

  /**
   * just for the flow page
   */
  let isSubmitted = false

  const { getters } = useStore()
  const unloadHandler = (event: BeforeUnloadEvent) => {
    if (isFunction(judgeNeedBlock) && !judgeNeedBlock()) {
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
      message: t(leaveTipKey ?? 'Base.unloadTip'),
      showCancelButton: true,
      confirmButtonText: t('Base.leave'),
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
    })
  }

  const updateIsSubmitted = () => {
    isSubmitted = true
  }

  onBeforeRouteLeave(async (to) => {
    try {
      // is same
      if (to.name === 'login' || isSubmitted) {
        return
      }
      if (!isFunction(judgeNeedBlock) || judgeNeedBlock()) {
        await customPopupWarning()
      }
      return
    } catch (error) {
      return false
    }
  })

  onMounted(bindEventListener)

  onUnmounted(unbindEventListener)

  return {
    updateIsSubmitted,
  }
}
