import { QUERY_TAB } from '@/common/constants'

const useQueryTab = (tabEnum: Record<string, string>) => {
  const route = useRoute()
  const routeQuery = route.query ?? {}
  const queryTab = computed(() => {
    const tab = routeQuery[QUERY_TAB]?.toString() ?? undefined
    if (tab && Object.values(tabEnum).includes(tab)) {
      return tab
    }
    return undefined
  })
  const router = useRouter()
  const handleTabChange = (tab: string) => {
    if (tab && Object.values(tabEnum).includes(tab)) {
      router.replace({ query: { ...routeQuery, [QUERY_TAB]: tab } })
    }
  }
  return {
    queryTab,
    handleTabChange,
  }
}

export default useQueryTab
