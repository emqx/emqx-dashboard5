import { PageData } from '@/types/common'
import { useRoute, useRouter } from 'vue-router'
import { omit } from 'lodash'
import { Ref } from 'vue'

export default (): {
  setParamsToQuery: (params: Record<string, any>) => void
  checkParamsInQuery: () => {
    pageParams: Partial<Pick<PageData, 'limit' | 'page'>>
    filterParams: Record<string, any>
  }
  setParamsFromQuery: (pageParams: Ref<PageData>, filterParams: Ref<Record<string, any>>) => void
} => {
  const route = useRoute()
  const router = useRouter()

  const setParamsToQuery = (params: Record<string, any>) => {
    router.replace({ ...route, query: params })
  }

  const checkParamsInQuery = () => {
    const { query } = route
    const pageParams: Partial<Pick<PageData, 'limit' | 'page'>> = {}
    if (query.limit) {
      pageParams.limit = Number(query.limit)
    }
    if (query.page) {
      pageParams.page = Number(query.page)
    }
    const filterParams = omit(query, ['limit', 'page'])
    return { pageParams, filterParams }
  }

  const setParamsFromQuery = (
    pageParams: Ref<PageData>,
    filterParams: Ref<Record<string, any>>,
  ) => {
    const params = checkParamsInQuery()
    pageParams.value = { ...pageParams.value, ...params.pageParams }
    filterParams.value = params.filterParams
  }

  return {
    setParamsToQuery,
    checkParamsInQuery,
    setParamsFromQuery,
  }
}
