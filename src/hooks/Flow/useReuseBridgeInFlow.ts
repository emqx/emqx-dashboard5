import { getBridgeList } from '@/api/ruleengine'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'
import {
  typesWithProducerAndConsumer,
  useBridgeDirection,
  useBridgeTypeOptions,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { cloneDeep, groupBy } from 'lodash'
import { ComputedRef, Ref, computed, ref } from 'vue'

type GroupedBridgeMap = { [key in BridgeType]?: Array<BridgeItem> }

export default (
  type: BridgeType,
  props: any,
  record: any,
): {
  isCreateBridgeInFlow: ComputedRef<any>
  isBridgeSelected: Ref<boolean>
  getBridgesInSameType: (direction?: BridgeDirection) => BridgeItem[] | undefined
  handleNameChange: (name: string) => void
} => {
  let getBridgeRequest: undefined | Promise<Array<BridgeItem>> = undefined
  const groupedBridgeMap: Ref<GroupedBridgeMap> = ref({})

  const isCreateBridgeInFlow: ComputedRef<boolean> = computed(
    () => props.isUsingInFlow && !props.edit && !props.readonly,
  )

  const { getBridgeType } = useBridgeTypeOptions()

  const getBridges = async () => {
    try {
      getBridgeRequest = getBridgeList()
      const bridges = await getBridgeRequest
      groupedBridgeMap.value = groupBy(bridges, ({ type }) => getBridgeType(type))
    } catch (error) {
      console.error(error)
    }
  }

  const { judgeBridgeDirection } = useBridgeDirection()
  /**
   * @param type For mqtt, the direction needs to be specified
   * For consumer and producer separate types, the direction needs to be specified
   * For types where versions are separate (e.g., redis and mongo), a generic type
   */
  const getBridgesInSameType = (direction?: BridgeDirection) => {
    if (!type) {
      return []
    }
    const generalType = getBridgeType(type)
    if (type === BridgeType.MQTT) {
      const list = groupedBridgeMap.value[type] || []
      return direction !== undefined
        ? list.filter((item) => judgeBridgeDirection(item) === direction)
        : list
    } else if (typesWithProducerAndConsumer.includes(type as BridgeType)) {
      // TODO:
    } else {
      return groupedBridgeMap.value[type] || []
    }
  }

  const getBridgeByName = (name: string) => {
    const bridges = getBridgesInSameType()
    return bridges?.find((item) => item.name === name)
  }

  const isBridgeSelected = ref(false)

  const { handleBridgeDataAfterLoaded } = useBridgeDataHandler()

  const handleNameChange = (name: string) => {
    const bridge = !!name && getBridgeByName(name)
    if (bridge) {
      isBridgeSelected.value = true
      record.value = handleBridgeDataAfterLoaded(cloneDeep(bridge))
    } else {
      isBridgeSelected.value = false
    }
  }

  if (isCreateBridgeInFlow.value) {
    getBridges()
  }

  return {
    isCreateBridgeInFlow,
    isBridgeSelected,
    getBridgesInSameType,
    handleNameChange,
  }
}
