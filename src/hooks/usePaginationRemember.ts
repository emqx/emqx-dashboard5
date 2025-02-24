import { parseJSONSafely } from '@emqx/shared-ui-utils'
import { PageData } from '@/types/common'

const STORE_KEY = 'list_page_params'

export default (
  pageName: string,
): {
  checkParamsInQuery: () => {
    pageParams: Partial<Pick<PageData, 'limit' | 'page'>>
    filterParams: Record<string, any>
  }
  checkNewCursorParamsInQuery: (resetQuery?: boolean) => {
    pageParams: Partial<{ page?: number; cursor?: string }>
    filterParams: Record<string, any>
  }
  updateCursorMap: (listPageName: string, cursorMap: Map<number, string | undefined>) => void
  getCursorMap: (listPageName: string) => Map<any, any>
  resetRouteQuery: () => void
  setParamsFromQuery: (pageParams: Ref<PageData>, filterParams: Ref<Record<string, any>>) => void
  updateParams: (p: Record<string, any>) => void
} => {
  const route = useRoute()
  const router = useRouter()

  let params = {}

  const resetRouteQuery = () => {
    router.replace({ ...route, query: {} })
  }

  const checkParamsInQuery = (resetQuery = true) => {
    const { query } = route
    const pageParams: Partial<Pick<PageData, 'limit' | 'page'>> = {}
    if (query.limit) {
      pageParams.limit = Number(query.limit)
    }
    if (query.page) {
      pageParams.page = Number(query.page)
    }
    const filterParams = omit(query, ['limit', 'page'])
    if (resetQuery) {
      resetRouteQuery()
    }
    return { pageParams, filterParams }
  }

  const checkNewCursorParamsInQuery = (resetQuery = true) => {
    const { query } = route
    const pageParams: Partial<{ page?: number; cursor?: string }> = {}
    if (query.cursor) {
      pageParams.cursor = query.cursor.toString()
    }
    if (query.page) {
      pageParams.page = Number(query.page)
    }
    const filterParams = omit(query, ['limit', 'page'])
    if (resetQuery) {
      resetRouteQuery()
    }
    return { pageParams, filterParams }
  }

  const updateCursorMap = (listPageName: string, cursorMap: Map<number, string | undefined>) => {
    const storageKey = `${listPageName}_cursor_map`
    const obj = Object.fromEntries(cursorMap)
    sessionStorage.setItem(storageKey, JSON.stringify(obj))
  }

  const getCursorMap = (listPageName: string) => {
    const storageKey = `${listPageName}_cursor_map`
    const obj = parseJSONSafely(sessionStorage.getItem(storageKey))
    const map = new Map<number, string | undefined>([])
    if (obj) {
      Object.entries(obj).forEach(([key, value]) => {
        map.set(Number(key), value)
      })
      if (!map.get(1)) {
        map.set(1, undefined)
      }
    }
    return map
  }

  const setParamsFromQuery = (
    pageParams: Ref<PageData>,
    filterParams: Ref<Record<string, any>>,
  ) => {
    const params = checkParamsInQuery()
    pageParams.value = { ...pageParams.value, ...params.pageParams }
    filterParams.value = params.filterParams
  }

  const updateParams = (p: Record<string, any>) => {
    params = p
  }

  onBeforeRouteLeave((to, from, next) => {
    if (to.name === pageName) {
      from = { ...from, query: { ...from.query, ...params } }
      sessionStorage.setItem(STORE_KEY, JSON.stringify(params))
    }
    next()
  })

  return {
    checkParamsInQuery,
    checkNewCursorParamsInQuery,
    updateCursorMap,
    getCursorMap,
    resetRouteQuery,
    setParamsFromQuery,
    updateParams,
  }
}

const createQueryStr = (obj: Record<string, any>) =>
  Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

/**
 * use it in detail page
 */
export const useReceiveParams = (
  pageName: string,
): {
  getBackRoute: (raw: RouteLocationRaw) => RouteLocationRaw
} => {
  let listPageParams = {}

  const getBackRoute = (route: RouteLocationRaw) => {
    const params = parseJSONSafely(sessionStorage.getItem(STORE_KEY))
    // Because this function will be repeatedly called in a short period of time for unknown reasons..
    window.setTimeout(() => {
      sessionStorage.removeItem(STORE_KEY)
    }, 3000)
    listPageParams = params || { limit: 20, page: 1 }
    if (typeof route === 'string') {
      const queryStr = createQueryStr(listPageParams)
      return route.indexOf('?') > -1 ? `${route}${queryStr}` : `${route}?${queryStr}`
    }
    return { ...route, query: { ...route.query, ...listPageParams } }
  }

  // Dual insurance to prevent duplicate routing
  let nextTrigger = false
  // Handle browser's back event
  onBeforeRouteLeave((to, from, next) => {
    if (!nextTrigger && to.name === pageName && (!to.query || Object.keys(to.query).length === 0)) {
      nextTrigger = true
      next({ ...to, query: { ...to.query, ...listPageParams } })
      return
    }
    next()
  })

  return {
    getBackRoute,
  }
}
