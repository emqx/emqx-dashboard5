import { computed, inject, unref, type MaybeRef } from 'vue'
import { useRoute } from 'vue-router'

/** Keep nested resource forms in their pipeline's namespace, including global scope. */
export default () => {
  const route = useRoute()
  const store = useStore()
  const inherited = inject<MaybeRef<string | undefined> | null>('ns', null)
  return computed<string | undefined>(() => {
    if (store.getters.isNamespaceUser) {
      return store.getters.userNamespace
    }
    if (inherited !== null) {
      return unref(inherited)
    }
    return typeof route.query.ns === 'string' ? route.query.ns : undefined
  })
}
