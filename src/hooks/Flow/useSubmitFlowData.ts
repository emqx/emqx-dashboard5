import { createRules, updateRules } from '@/api/ruleengine'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import { BasicRule, BridgeItem, RuleItem } from '@/types/rule'

import useHandleSourceItem from '../Rule/action/useHandleSourceItem'

interface BridgeData {
  isCreated: boolean
  data: BridgeItem
}

interface GroupedFlowData {
  rule: BasicRule
  actions: Array<BridgeData>
  sources: Array<BridgeData>
}

export default (): {
  isSubmitting: Ref<boolean>
  createFlow: (data: GroupedFlowData) => Promise<RuleItem>
  updateFlow: (data: GroupedFlowData) => Promise<RuleItem>
} => {
  const isSubmitting = ref(false)
  const { addAction, updateAction, deleteAction } = useHandleActionItem()
  const { addSource, updateSource, deleteSource } = useHandleSourceItem()

  const createItems = async (
    items: Array<any>,
    funcForCreate: (data: any) => Promise<any>,
    funcForDelete: (id: string) => Promise<any>,
  ) => {
    const addedIds: string[] = []
    for (const data of items) {
      try {
        const { id } = await funcForCreate(data)
        addedIds.push(id)
      } catch (error) {
        for (const id of addedIds) {
          try {
            await funcForDelete(id)
          } catch (error) {
            console.error(`error when deleting ${id}`)
          }
        }
        break
      }
    }
    return addedIds.length === items.length ? Promise.resolve() : Promise.reject()
  }

  const updateItems = (items: Array<any>, funcForUpdate: (data: any) => Promise<any>) => {
    return Promise.all(
      items.map(async (item) => {
        return funcForUpdate({ ...item, id: item.id })
      }),
    )
  }

  const createActions = async (actions: Array<any>) => createItems(actions, addAction, deleteAction)

  const updateActions = async (actions: Array<any>) => updateItems(actions, updateAction)

  const createSources = async (sources: Array<any>) => createItems(sources, addSource, deleteSource)

  const updateSources = async (sources: Array<any>) => updateItems(sources, updateSource)

  const submitActions = async (actions: GroupedFlowData['actions']) => {
    try {
      const groupedAction = groupBy(actions, ({ isCreated }) => !!isCreated)
      if (groupedAction['false']) {
        await createActions(groupedAction['false'].map(({ data }) => data))
      }
      if (groupedAction['true']) {
        await updateActions(groupedAction['true'].map(({ data }) => data))
      }
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const submitSources = async (sources: GroupedFlowData['sources']) => {
    try {
      const groupedSource = groupBy(sources, ({ isCreated }) => !!isCreated)
      if (groupedSource['false']) {
        await createSources(groupedSource['false'].map(({ data }) => data))
      }
      if (groupedSource['true']) {
        await updateSources(groupedSource['true'].map(({ data }) => data))
      }
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const createFlow = async ({ rule, actions, sources }: GroupedFlowData) => {
    /**
     * Same as webhook, create the bridge firstly, because it is easy to encounter errors.
     */
    try {
      isSubmitting.value = true

      await submitActions(actions)
      await submitSources(sources)

      const ruleRet = await createRules(rule as any)
      isSubmitting.value = false
      return Promise.resolve(ruleRet)
    } catch (error) {
      isSubmitting.value = false
      return Promise.reject()
    }
  }

  const updateFlow = async ({ rule, actions, sources }: GroupedFlowData) => {
    /**
     * Same as webhook, create the bridge firstly, because it is easy to encounter errors.
     */
    try {
      isSubmitting.value = true

      await submitActions(actions)
      await submitSources(sources)

      const ruleRet = await updateRules(rule.id, rule as any)
      isSubmitting.value = false
      return Promise.resolve(ruleRet)
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
