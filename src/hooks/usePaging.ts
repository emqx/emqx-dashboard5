import { ref, Ref } from 'vue'
import _ from 'lodash'

type ListData = Array<any>

interface PageMeta {
  page: number
  limit: number
}

export interface FilterItem {
  key: string
  value: string
}

interface SortFrom {
  key: string
  type: 'asc' | 'desc'
}

const DEFAULT_PAGE_SIZE = 20

export default () => {
  const totalData: Ref<ListData> = ref([])
  // Use the following six variables to do a cache-like operation to reduce computational overhead
  let latestFiltersString = ''
  const listAfterFilter: Ref<ListData> = ref([])
  let latestSortFromString: string | undefined = undefined
  const listAfterFilterNSort: Ref<ListData> = ref([])
  let currentPageSize = DEFAULT_PAGE_SIZE
  const currentChunks: Ref<Array<ListData>> = ref([])

  const setTotalData = (data: ListData) => {
    totalData.value = data
    filterList()
    sortList()
    chunkList()
  }

  const filterList = (filters: Array<FilterItem> = []) => {
    latestFiltersString = JSON.stringify(filters)
    if (filters.length === 0) {
      listAfterFilter.value = totalData.value
    } else {
      listAfterFilter.value = totalData.value.filter((item) =>
        filters.every(({ key, value }) => item[key]?.indexOf && item[key].indexOf(value) > -1),
      )
    }
  }

  const sortList = (sortFrom?: SortFrom) => {
    if (!sortFrom) {
      latestSortFromString = undefined
      listAfterFilterNSort.value = listAfterFilter.value
    } else {
      latestSortFromString = JSON.stringify(sortFrom)
      listAfterFilterNSort.value = _.orderBy(listAfterFilter.value, [sortFrom.key], [sortFrom.type])
    }
  }

  const chunkList = (pageSize = DEFAULT_PAGE_SIZE) => {
    currentPageSize = pageSize
    currentChunks.value = _.chunk(listAfterFilterNSort.value, currentPageSize)
  }

  const getAPageData = (
    pageMeta: PageMeta,
    filters: Array<FilterItem> = [],
    sortFrom?: SortFrom,
  ) => {
    if (latestFiltersString !== JSON.stringify(filters)) {
      filterList(filters)
      sortList(sortFrom)
      chunkList(pageMeta.limit)
    } else if (
      (!sortFrom && latestSortFromString) ||
      (sortFrom && latestSortFromString !== JSON.stringify(sortFrom))
    ) {
      sortList(sortFrom)
      chunkList(pageMeta.limit)
    } else if (pageMeta.limit !== currentPageSize) {
      chunkList(pageMeta.limit)
    }
    const retData =
      currentChunks.value.length === 0 ? [] : currentChunks.value[pageMeta.page - 1] || []
    return {
      data: retData,
      meta: {
        count: listAfterFilterNSort.value.length,
        limit: pageMeta.limit,
        page: pageMeta.page,
      },
    }
  }

  return {
    totalData,
    setTotalData,
    getAPageData,
  }
}
