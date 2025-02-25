import Sortable, { SortableEvent } from 'sortablejs'

export default (
  onEnd: (evt: SortableEvent) => void,
): {
  ListContainer: Ref<HTMLElement>
  listWrapClass: string
  sortableArr: Array<Sortable>
  initSortable: (
    otherEventOpt?: Record<string, ((event: SortableEvent) => void) | undefined>,
  ) => void
} => {
  const ListContainer = ref()
  const listWrapClass = 'list-wrap'
  let sortableArr: Array<Sortable> = []

  /**
   * called after table data changes
   */
  const initSortable = (
    otherEventOpt: Record<string, ((event: SortableEvent) => void) | undefined> = {},
  ) => {
    sortableArr.forEach((item) => item?.destroy())
    const selected = ListContainer.value?.querySelectorAll(`.${listWrapClass}`)
    if (!selected) {
      return
    }
    const eleArr: Array<HTMLElement> = Array.from(selected)
    sortableArr = eleArr?.map((item) => {
      return new Sortable(item, {
        group: 'shared',
        draggable: '.filter-item',
        invertSwap: true,
        onEnd,
        ...otherEventOpt,
      })
    })
  }

  return {
    ListContainer,
    listWrapClass,
    sortableArr,
    initSortable,
  }
}
