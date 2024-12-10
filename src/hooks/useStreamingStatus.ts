import { getStreamingConfig } from '@/api/streaming'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default (): {
  isStreamingEnabled: ComputedRef<boolean>
  updateStreamingStatus: (isStreamingEnabled: boolean) => void
  getStreamingIsEnabled: () => Promise<void>
} => {
  const { state, commit } = useStore()
  const isStreamingEnabled = computed(() => state.isStreamingEnabled)
  const updateStreamingStatus = (isStreamingEnabled: boolean) => {
    commit('SET_IS_STREAMING_ENABLED', isStreamingEnabled)
  }
  const getStreamingIsEnabled = async () => {
    try {
      const { enable } = await getStreamingConfig()
      updateStreamingStatus(enable ?? false)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return { isStreamingEnabled, updateStreamingStatus, getStreamingIsEnabled }
}
