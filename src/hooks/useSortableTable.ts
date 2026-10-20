import Sortable, { SortableEvent } from 'sortablejs'

export default (
  onUpdate: (evt: SortableEvent) => void,
  options: Sortable.Options = {},
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
      ...options,
      onUpdate: onUpdate,
    })
  }

  return {
    tableCom,
    sortable,
    initSortable,
  }
}
