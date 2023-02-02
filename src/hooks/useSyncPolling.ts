import { onUnmounted, ref, Ref } from 'vue'

export default (): {
  needPolling: Ref<boolean>
  syncPolling: (queryData: () => Promise<void>, interval: number) => Promise<void>
} => {
  const needPolling = ref(true)

  const syncPolling = async (queryData: () => Promise<void>, interval: number) => {
    const query = async () => {
      const startTime = Date.now()
      try {
        await queryData()
      } catch (error) {
        //
      } finally {
        if (needPolling.value) {
          const diff = Date.now() - startTime
          if (diff > interval) {
            query()
          } else {
            window.setTimeout(query, interval - diff)
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
  }
}
