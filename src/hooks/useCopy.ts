import { onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { copyToClipboard } from '@/common/tools'

export default function useCopy(callback?: () => void): {
  copyText: (text: string) => Promise<void>
  copySuccess: () => void
} {
  const { t } = useI18n()
  let copyShowTimeout: null | number = null
  const copyText = async (text: string) => {
    try {
      await copyToClipboard(text)
      copySuccess()
    } catch (error) {
      ElMessage.success(t('Base.opErr'))
    }
  }
  const copySuccess = function () {
    ElMessage.success(t('Base.copied'))
    if (!callback) {
      return
    }
    if (copyShowTimeout) {
      clearTimeout(copyShowTimeout)
    }
    copyShowTimeout = window.setTimeout(callback, 500)
  }
  onBeforeUnmount(() => {
    if (copyShowTimeout) {
      clearTimeout(copyShowTimeout)
    }
  })
  return {
    copyText,
    copySuccess,
  }
}
