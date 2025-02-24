import copy from 'copy-to-clipboard'

export default function useCopy(callback?: () => void): {
  copyText: (text: string | undefined) => Promise<void>
  copySuccess: () => void
} {
  const { t } = useI18n()
  let copyShowTimeout: null | number = null
  const copyText = async (text: string | undefined) => {
    if (text === undefined) {
      return
    }
    try {
      copy(text)
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
