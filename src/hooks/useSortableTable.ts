import Sortable, { SortableEvent } from 'sortablejs'
import { ref, Ref, Component } from 'vue'

export default (
  onUpdate: (evt: SortableEvent) => void,
): {
  tableCom: Ref<Component>
  sortable: undefined | Sortable
  initSortable: () => void
} => {
  /**
   * must bind to element table component
   */
  const tableCom = ref()
  let sortable: undefined | Sortable = undefined

  /**
   * called after table data changes
   */
  const initSortable = () => {
    sortable && sortable?.destroy()
    sortable = new Sortable(tableCom.value.$el.querySelector('tbody'), {
      onUpdate: onUpdate,
    })
  }

  return {
    tableCom,
    sortable,
    initSortable,
  }
}
