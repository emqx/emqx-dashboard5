import { loadCurrentUser } from '@/api/function'
import store from '@/store'
import { computed, ref, watch } from 'vue'

export default function usePemCachePermission() {
  const hasSystemScope = ref(false)
  const isGlobalAdmin = computed(
    () => store.state.user.role === 'administrator' && !store.getters.isNamespaceUser,
  )
  let requestId = 0

  const reset = () => {
    requestId++
    hasSystemScope.value = false
  }

  watch(() => store.state.user.token, reset)

  const refreshPermissions = async () => {
    reset()
    if (!isGlobalAdmin.value) {
      return
    }
    const currentRequest = requestId
    try {
      const user = await loadCurrentUser()
      if (currentRequest !== requestId || user.role !== 'administrator') {
        return
      }
      hasSystemScope.value = user.scopes.includes('system')
    } catch {
      // Keep cache cleanup hidden when user permissions cannot be verified.
    }
  }

  return {
    canCleanPemCache: computed(() => isGlobalAdmin.value && hasSystemScope.value),
    refreshPermissions,
  }
}
