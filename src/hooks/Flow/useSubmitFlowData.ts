import { createBridge, createRules, deleteBridge } from '@/api/ruleengine'
import { checkNOmitFromObj } from '@/common/tools'
import { BasicRule, BridgeItem } from '@/types/rule'
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
  const createFlow = async ({ rule, bridges }: { rule: BasicRule; bridges: Array<BridgeItem> }) => {
    /**
     * Same as webhook, create the bridge firstly, because it is easy to encounter errors.
     */
    try {
      isSubmitting.value = true
      await createBridges(bridges)
      await createRules(rule as any)
      isSubmitting.value = false
      return Promise.resolve()
    } catch (error) {
      isSubmitting.value = false
      return Promise.reject()
    }
  }

  const updateFlow = (processedData: { rule: BasicRule; bridges: Array<BridgeItem> }) => {}

  return {
    isSubmitting,
    createFlow,
    updateFlow,
  }
}
