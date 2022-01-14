import { ref } from 'vue'

export default () => {
  const page = ref(1)
  const limit = ref(20)
  const count = ref(0)
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
    resetPageNum,
  }
}
