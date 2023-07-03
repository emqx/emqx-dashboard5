import Sortable, { SortableEvent } from 'sortablejs'
import { ref, Ref } from 'vue'

export default (
  onUpdate: (evt: SortableEvent) => void,
): {
  ListContainer: Ref<HTMLElement>
  listWrapClass: string
  sortableArr: Array<Sortable>
  initSortable: () => void
} => {
  const ListContainer = ref()
  const listWrapClass = 'list-wrap'
  let sortableArr: Array<Sortable> = []

  /**
   * called after table data changes
   */
  const initSortable = () => {
    sortableArr.forEach((item) => item?.destroy())
    const eleArr: Array<HTMLElement> = Array.from(
      ListContainer.value.querySelectorAll(`.${listWrapClass}`),
    )
    sortableArr = eleArr.map((item) => {
      return new Sortable(item, {
        group: 'shared',
        draggable: '.filter-item',
        invertSwap: true,
        onEnd: onUpdate,
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
