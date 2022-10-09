import useI18nTl from '@/hooks/useI18nTl'
import { ElMessageBox } from 'element-plus'
import { isFunction } from 'lodash'
import { onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'

export default (countIsRecordChanged?: () => boolean): void => {
  const { tl } = useI18nTl('RuleEngine')

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
      title: tl('leavePage'),
      message: tl('unloadTip'),
      showCancelButton: true,
      confirmButtonText: tl('leave'),
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
    })
  }

  onBeforeRouteLeave(async () => {
    try {
      // is same
      if (!isFunction(countIsRecordChanged) || countIsRecordChanged()) {
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
