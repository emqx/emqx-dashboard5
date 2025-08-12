import { PageData } from '@/types/common'

export default (): {
  page: Ref<number>
  limit: Ref<number>
  count: Ref<number>
  pageParams: WritableComputedRef<PageData>
  resetPageNum: (tableData: Array<unknown>, pageNum: number) => number
} => {
  const page = ref(1)
  const limit = ref(20)
  const count = ref(0)

  const pageParams = computed({
    get() {
      return {
        page: page.value,
        limit: limit.value,
        count: count.value,
      }
    },
    set(data: PageData) {
      page.value = data.page
      limit.value = data.limit
      count.value = data.count || 0
    },
  })

  /**
   * reset page num after delete
   */
  const resetPageNum = (tableData: Array<unknown>, pageNum: number) => {
    if (tableData.length === 1 && pageNum !== 1) {
      return pageNum - 1
    }
    return pageNum
  }

  return {
    page,
    limit,
    count,
    pageParams,
    resetPageNum,
  }
}

const FIRST_CURSOR = undefined
export const useCursorPagination = (): {
  page: Ref<number>
  limit: Ref<number>
  cursorMap: Ref<Map<number, string | undefined>>
  currentCursor: ComputedRef<string | undefined>
  pageParams: ComputedRef<{
    cursor: string | undefined
    limit: number
  }>
  hasNext: ComputedRef<boolean>
  resetCursorMap: () => void
  getCursor: (pageNo: number) => string | undefined
  setCursor: (pageNo: number, cursor: string | undefined) => void
  resetPage: () => void
  emptyCursorAfter: (index: number) => void
} => {
  const page = ref(1)
  const limit = ref(20)

  const createEmptyCursorMap = () => new Map<number, string | undefined>([[1, FIRST_CURSOR]])
  const cursorMap = ref(createEmptyCursorMap())

  const getCursor = (pageNo: number) => cursorMap.value.get(pageNo) ?? FIRST_CURSOR
  const currentCursor = computed(() => getCursor(page.value))

  const hasNext = computed(() => {
    return !!cursorMap.value.get(page.value + 1)
  })

  const pageParams = computed(() => ({
    cursor: currentCursor.value,
    limit: limit.value,
  }))

  const setCursor = (pageNo: number, cursor: string | undefined) => {
    cursorMap.value.set(pageNo, cursor)
  }

  const resetCursorMap = () => {
    cursorMap.value = createEmptyCursorMap()
  }

  const resetPage = () => {
    page.value = 1
  }

  const emptyCursorAfter = (index: number) => {
    for (const key of cursorMap.value.keys()) {
      if (key >= index) {
        cursorMap.value.delete(key)
      }
    }
  }

  return {
    page,
    limit,
    cursorMap,
    currentCursor,
    pageParams,
    hasNext,
    getCursor,
    setCursor,
    resetCursorMap,
    resetPage,
    emptyCursorAfter,
  }
}
