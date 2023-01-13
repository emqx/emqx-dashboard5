import { PageData } from '@/types/common'
import { computed, ref, Ref, WritableComputedRef } from 'vue'

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
   * reset
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
