import { PageData } from '@/types/common'

const generateDefaultPageMeta = (): PageData => ({
  limit: 20,
  count: 0,
  page: 1,
  hasnext: false,
})

export default (
  customPageMeta?: Partial<PageData>,
): {
  pageMeta: Ref<PageData>
  pageParams: ComputedRef<{
    limit: number
    page: number
  }>
  initPageMeta: () => void
  setPageMeta: (data: PageData) => void
} => {
  const pageMeta: Ref<PageData> = ref({ ...generateDefaultPageMeta(), ...(customPageMeta ?? {}) })
  const pageParams = computed(() => ({
    limit: pageMeta.value.limit,
    page: pageMeta.value.page,
  }))

  const initPageMeta = () => {
    pageMeta.value = generateDefaultPageMeta()
  }

  const setPageMeta = (data: PageData) => {
    if (data.count === undefined) {
      pageMeta.value.count = -1
      pageMeta.value.hasnext = data.hasnext
    } else {
      pageMeta.value.count = data.count
    }
    pageMeta.value.page = data.page
  }

  return {
    pageMeta,
    pageParams,
    initPageMeta,
    setPageMeta,
  }
}
