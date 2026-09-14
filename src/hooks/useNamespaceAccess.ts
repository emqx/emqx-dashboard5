import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Add route names here to restrict more pages for namespaced users.
const globalOnlyRouteNames = new Set(['audit-log'])

interface NavigationItem {
  path?: string
  children?: NavigationItem[]
}

export default function useNamespaceAccess() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const canAccessPath = (path: string) =>
    !store.getters.isNamespaceUser ||
    !router.resolve(path).matched.some(({ name }) => globalOnlyRouteNames.has(String(name)))

  const canAccessCurrentRoute = computed(() => canAccessPath(route.fullPath))

  const filterAccessibleItems = <T extends NavigationItem>(items: T[]): T[] =>
    items.flatMap((item) => {
      if (item.path && !canAccessPath(item.path)) return []
      if (!item.children) return [item]
      const children = filterAccessibleItems(item.children)
      return children.length ? [{ ...item, children }] : []
    })

  return { canAccessCurrentRoute, filterAccessibleItems }
}
