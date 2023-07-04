import { ComputedRef, WritableComputedRef, computed } from 'vue'
import { FilterForm, FilterItem } from './useNodeForm'
import { isUndefined, sum } from 'lodash'

/**
 * just recorded, without any actual control.
 */
export const INPUT_HEIGHT = 32
export const INPUT_MARGIN_BOTTOM = 16
export const DOT_RADIUS = 3

interface ConnectorDataItem {
  startIndex: number
  endIndex: number
}

export default (record: WritableComputedRef<any>) => {
  function countCanConnect(arr: Array<FilterItem | FilterForm>) {
    const ret = []
    let prevHasItems = true
    const length = arr.length
    for (let i = 0; i < length; i++) {
      const currentObj = arr[i]
      const nextObj = arr[i + 1]

      const currentHasItems = 'items' in currentObj
      const nextHasItems = nextObj === undefined ? true : nextObj && 'items' in nextObj

      ret.push(!currentHasItems && (!prevHasItems || !nextHasItems))
      prevHasItems = currentHasItems
    }
    return ret
  }

  /**
   * The length is the same as the items in the record, determining whether
   * a filter item in the items can be connected.
   * There are two conditions:
   * 1. It must be in the first level and not belong to any group
   * 2. There must be two consecutive filter items.
   */
  const canConnectArr = computed(() => countCanConnect(record.value.items))

  /**
   * If it is a single filter, the count is recorded as 1.
   * If it is a group, the count is equal to the number of items in the group.
   */
  const filterCountArr = computed(() =>
    record.value.items.map(({ items }: any) => (isUndefined(items) ? 1 : items.length)),
  )

  const getConnectorTop = (index: number) => {
    const itemCount = sum(filterCountArr.value.slice(0, index))
    return INPUT_HEIGHT / 2 + itemCount * (INPUT_HEIGHT + INPUT_MARGIN_BOTTOM) - DOT_RADIUS
  }

  const getConnectorHeight = (item: ConnectorDataItem) => {
    const { startIndex, endIndex } = item
    const length = endIndex - startIndex + 1
    return (length - 1) * (INPUT_HEIGHT + INPUT_MARGIN_BOTTOM) + 2 * DOT_RADIUS
  }

  const getConnectorStyle = (item: ConnectorDataItem) => {
    return {
      top: getConnectorTop(item.startIndex) + 'px',
      height: getConnectorHeight(item) + 'px',
    }
  }

  const countConnectorArr = (arr: boolean[]): Array<ConnectorDataItem> => {
    const ranges: { startIndex: number; endIndex: number }[] = []
    let startIndex = -1
    let endIndex = -1

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        if (startIndex === -1) {
          startIndex = i
        }
      } else {
        if (startIndex !== -1) {
          endIndex = i - 1
          ranges.push({ startIndex, endIndex })
          startIndex = -1
          endIndex = -1
        }
      }
    }

    if (startIndex !== -1) {
      endIndex = arr.length - 1
      ranges.push({ startIndex, endIndex })
    }

    return ranges
  }

  /**
   * for example: if canConnectArr is [false, true, true, false, false, true, true, true, true]
   * this will be [{startIndex: 1, endIndex: 2}, {startIndex: 5, endIndex: 8}]
   */
  const connectorArr: ComputedRef<Array<ConnectorDataItem>> = computed(() =>
    countConnectorArr(canConnectArr.value),
  )

  return {
    canConnectArr,
    connectorArr,
    getConnectorStyle,
  }
}
