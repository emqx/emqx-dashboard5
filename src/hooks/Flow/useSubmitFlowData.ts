import {
  createBridge,
  createRules,
  deleteBridge,
  updateBridge,
  updateRules,
} from '@/api/ruleengine'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'
import { BasicRule, BridgeItem } from '@/types/rule'
import { groupBy } from 'lodash'
import { Ref, ref } from 'vue'

interface BridgeData {
  isCreated: boolean
  data: BridgeItem
}

export default (): {
  isSubmitting: Ref<boolean>
  createFlow: (data: { rule: BasicRule; bridges: Array<BridgeData> }) => Promise<void>
  updateFlow: (data: { rule: BasicRule; bridges: Array<BridgeData> }) => Promise<void>
} => {
  const isSubmitting = ref(false)
  const { handleBridgeDataBeforeSubmit } = useBridgeDataHandler()

  const createBridges = async (bridges: Array<any>) => {
    const addedIds: string[] = []
    for (const data of bridges) {
      try {
        const bridge = await handleBridgeDataBeforeSubmit(data)
        const { id } = await createBridge(bridge)
        addedIds.push(id)
      } catch (error) {
        for (const id of addedIds) {
          try {
            await deleteBridge(id)
          } catch (error) {
            console.error(`error when deleting ${id}`)
          }
        }
        break
      }
    }
    return addedIds.length === bridges.length ? Promise.resolve() : Promise.reject()
  }

  const updateBridges = async (bridges: Array<any>) => {
    return Promise.all(
      bridges.map(async (item) => {
        const bridge = await handleBridgeDataBeforeSubmit(item)
        return updateBridge(item.id, bridge)
      }),
    )
  }

  const createFlow = async ({
    rule,
    bridges,
  }: {
    rule: BasicRule
    bridges: Array<{ isCreated: boolean; data: BridgeItem }>
  }) => {
    /**
     * Same as webhook, create the bridge firstly, because it is easy to encounter errors.
     */
    try {
      isSubmitting.value = true
      const groupedBridge = groupBy(bridges, ({ isCreated }) => !!isCreated)

      if (groupedBridge['false']) {
        await createBridges(groupedBridge['false'].map(({ data }) => data))
      }
      if (groupedBridge['true']) {
        await updateBridges(groupedBridge['true'].map(({ data }) => data))
      }
      await createRules(rule as any)
      isSubmitting.value = false
      return Promise.resolve()
    } catch (error) {
      isSubmitting.value = false
      return Promise.reject()
    }
  }

  const updateFlow = async ({
    rule,
    bridges,
  }: {
    rule: BasicRule
    bridges: Array<{ isCreated: boolean; data: BridgeItem }>
  }) => {
    /**
     * Same as webhook, create the bridge firstly, because it is easy to encounter errors.
     */
    try {
      isSubmitting.value = true
      const groupedBridge = groupBy(bridges, 'isCreated')
      if (groupedBridge['false']) {
        await createBridges(groupedBridge['false'].map(({ data }) => data))
      }
      if (groupedBridge['true']) {
        await updateBridges(groupedBridge['true'].map(({ data }) => data))
      }
      await updateRules(rule.id, rule as any)
      isSubmitting.value = false
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      isSubmitting.value = false
      return Promise.reject()
    }
  }

  return {
    isSubmitting,
    createFlow,
    updateFlow,
  }
}
