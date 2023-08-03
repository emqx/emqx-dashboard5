import {
  createBridge,
  createRules,
  deleteBridge,
  updateBridge,
  updateRules,
} from '@/api/ruleengine'
import { checkNOmitFromObj } from '@/common/tools'
import { BasicRule, BridgeItem } from '@/types/rule'
import { groupBy } from 'lodash'
import { ref } from 'vue'

export default () => {
  const isSubmitting = ref(false)

  const createBridges = async (bridges: Array<any>) => {
    const addedIds: string[] = []
    for (const data of bridges) {
      try {
        const { id } = await createBridge(checkNOmitFromObj(data))
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
    return Promise.all(bridges.map((item) => updateBridge(item.id, checkNOmitFromObj(item))))
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
      await createBridges(bridges.map(({ data }) => data))
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
      await createBridges(groupedBridge['false'].map(({ data }) => data))
      await updateBridges(groupedBridge['true'].map(({ data }) => data))
      await updateRules(rule.id, rule as any)
      isSubmitting.value = false
      return Promise.resolve()
    } catch (error) {
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
