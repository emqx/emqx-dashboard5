import { onUnmounted, ref, Ref } from 'vue'

export default (): {
  needPolling: Ref<boolean>
  syncPolling: (queryData: () => Promise<void>, interval: number) => Promise<void>
  pollingTimer: undefined | number
} => {
  const needPolling = ref(true)
  let pollingTimer = undefined

  const syncPolling = async (queryData: () => Promise<void>, interval: number) => {
    const query = async () => {
      const startTime = Date.now()
      try {
        if (needPolling.value) {
          await queryData()
        }
      } catch (error) {
        //
      } finally {
        if (needPolling.value) {
          const diff = Date.now() - startTime
          if (diff > interval) {
            query()
          } else {
            pollingTimer = window.setTimeout(query, interval - diff)
          }
        }
      }
    }
    query()
  }

  onUnmounted(() => {
    needPolling.value = false
  })

  return {
    needPolling,
    syncPolling,
    pollingTimer,
  }
}
