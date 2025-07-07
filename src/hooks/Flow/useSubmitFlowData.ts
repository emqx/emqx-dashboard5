import {
  deleteAIProvider,
  deleteAICompletionProfile,
  postAICompletionProfile,
  postAIProvider,
  putAIProvider,
  putAICompletionProfile,
} from '@/api/ai'
import { createRules, updateRules } from '@/api/ruleengine'
import { BasicRule, BridgeItem, FlowDataItemForSubmit, RuleItem } from '@/types/rule'
import { AICompletionProfile, AIProviderForm } from '@/types/typeAlias'
import useHandleSourceItem from '../Rule/action/useHandleSourceItem'

type BridgeData = FlowDataItemForSubmit<BridgeItem>

export interface GroupedFlowData {
  rule: BasicRule
  actions: Array<BridgeData>
  sources: Array<BridgeData>
  aiProviders: Array<FlowDataItemForSubmit<AIProviderForm>>
  aiCompletions: Array<FlowDataItemForSubmit<AICompletionProfile>>
}

export default (): {
  isSubmitting: Ref<boolean>
  submitFlow: (data: GroupedFlowData, operation: 'create' | 'update') => Promise<RuleItem>
  removeUselessAIData: (
    initAIData: {
      provider: Array<string>
      completion: Array<string>
    },
    data: GroupedFlowData,
  ) => Promise<{ uselessProvider: string[]; uselessCompletion: string[] }>
} => {
  const isSubmitting = ref(false)
  const { addAction, updateAction, deleteAction } = useHandleActionItem()
  const { addSource, updateSource, deleteSource } = useHandleSourceItem()

  const createItems = async (
    items: Array<any>,
    funcForCreate: (data: any) => Promise<any>,
    funcForDelete: (id: string) => Promise<any>,
    keyForId: string = 'id',
  ) => {
    const addedIds: string[] = []
    for (const data of items) {
      try {
        const result = await funcForCreate(data)
        const id = result[keyForId] ?? data[keyForId]
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
    return addedIds.length === items.length ? Promise.resolve(addedIds) : Promise.reject()
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
      let createdIds: string[] = []
      const groupedAction = groupBy(actions, ({ isCreated }) => !!isCreated)
      if (groupedAction['false']) {
        createdIds = await createActions(groupedAction['false'].map(({ data }) => data))
      }
      if (groupedAction['true']) {
        await updateActions(groupedAction['true'].map(({ data }) => data))
      }
      return Promise.resolve(createdIds)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const deleteActions = async (actions: Array<string>) =>
    Promise.all(actions.map((id) => deleteAction(id)))

  type UpdateAIDataItems = {
    (
      data: Array<AIProviderForm>,
      updateFun: (name: string, data: Omit<AIProviderForm, 'name'>) => Promise<AIProviderForm>,
    ): Promise<Array<any>>
    (
      data: Array<AICompletionProfile>,
      updateFun: (
        name: string,
        data: Omit<AICompletionProfile, 'name'>,
      ) => Promise<AICompletionProfile>,
    ): Promise<Array<any>>
  }
  const updateAIDataItems: UpdateAIDataItems = async (items, updateFun) => {
    return Promise.all(
      items.map(async (item) => {
        return updateFun(item.name, omit(item, ['name']) as any)
      }),
    )
  }

  const createAIProviders = async (aiProviders: Array<any>) =>
    createItems(aiProviders, postAIProvider, deleteAIProvider, 'name')

  const updateAIProviders = async (aiProviders: Array<any>) =>
    updateAIDataItems(aiProviders, putAIProvider)

  const createAICompletionProfiles = async (aiCompletions: Array<any>) =>
    createItems(aiCompletions, postAICompletionProfile, deleteAICompletionProfile, 'name')

  const updateAICompletionProfiles = async (aiCompletions: Array<any>) =>
    updateAIDataItems(aiCompletions, putAICompletionProfile)

  const submitAIProviders = async (aiProviders: GroupedFlowData['aiProviders']) => {
    try {
      let createdNames: string[] = []
      const groupedProviders = groupBy(aiProviders, ({ isCreated }) => !!isCreated)
      if (groupedProviders['false']) {
        createdNames = await createAIProviders(
          groupedProviders['false'].map(({ data }) => checkNOmitFromObj(data)),
        )
      }
      if (groupedProviders['true']) {
        const providersNeedUpdate = groupedProviders['true'].map(({ data }) => data)
        await updateAIProviders(providersNeedUpdate.map((data) => data))
      }
      return Promise.resolve(createdNames)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const deleteAIProviders = async (aiProviders: Array<string>) =>
    Promise.all(aiProviders.map((name) => deleteAIProvider(name)))

  const submitAICompletionProfiles = async (aiCompletions: GroupedFlowData['aiCompletions']) => {
    try {
      let createdNames: string[] = []
      const groupedCompletions = groupBy(aiCompletions, ({ isCreated }) => !!isCreated)
      if (groupedCompletions['false']) {
        createdNames = await createAICompletionProfiles(
          groupedCompletions['false'].map(({ data }) => data),
        )
      }
      if (groupedCompletions['true']) {
        await updateAICompletionProfiles(groupedCompletions['true'].map(({ data }) => data))
      }
      return Promise.resolve(createdNames)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const deleteAICompletionProfiles = async (aiCompletions: Array<string>) =>
    Promise.all(aiCompletions.map((name) => deleteAICompletionProfile(name)))

  const submitSources = async (sources: GroupedFlowData['sources']) => {
    try {
      let createdIds: string[] = []
      const groupedSource = groupBy(sources, ({ isCreated }) => !!isCreated)
      if (groupedSource['false']) {
        createdIds = await createSources(groupedSource['false'].map(({ data }) => data))
      }
      if (groupedSource['true']) {
        await updateSources(groupedSource['true'].map(({ data }) => data))
      }
      return Promise.resolve(createdIds)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const deleteSources = async (sources: Array<string>) =>
    Promise.all(sources.map((id) => deleteSource(id)))

  const submitFlow = async (
    { rule, actions, sources, aiProviders, aiCompletions }: GroupedFlowData,
    operation: 'create' | 'update',
  ) => {
    let createdActionIds: string[] = []
    let createdSourceIds: string[] = []
    let createdAIProviderNames: string[] = []
    let createdAICompletionNames: string[] = []
    /**
     * Same as webhook, create the bridge firstly, because it is easy to encounter errors.
     */
    try {
      isSubmitting.value = true

      createdActionIds = await submitActions(actions)
      createdSourceIds = await submitSources(sources)

      createdAIProviderNames = await submitAIProviders(aiProviders)
      createdAICompletionNames = await submitAICompletionProfiles(aiCompletions)
    } catch (error) {
      console.error(error)
      deleteActions(createdActionIds)
      deleteSources(createdSourceIds)
      await deleteAICompletionProfiles(createdAICompletionNames)
      deleteAIProviders(createdAIProviderNames)
      isSubmitting.value = false
      return Promise.reject()
    }

    try {
      let ruleRet: RuleItem
      if (operation === 'create') {
        ruleRet = await createRules(rule as any)
      } else {
        ruleRet = await updateRules(rule.id, rule as any)
      }

      isSubmitting.value = false
      return Promise.resolve(ruleRet)
    } catch (error) {
      deleteActions(createdActionIds)
      deleteSources(createdSourceIds)
      await deleteAICompletionProfiles(createdAICompletionNames)
      deleteAIProviders(createdAIProviderNames)
      isSubmitting.value = false
      return Promise.reject()
    }
  }

  const formatAIData = (data: Pick<GroupedFlowData, 'aiProviders' | 'aiCompletions'>) => {
    const ret = {
      provider: data.aiProviders.map(({ data }) => data.name),
      completion: data.aiCompletions.map(({ data }) => data.name),
    }
    return ret
  }
  const findUselessAIData = (
    initAIData: {
      provider: Array<string>
      completion: Array<string>
    },
    submitAIData: {
      provider: Array<string>
      completion: Array<string>
    },
  ) => {
    const uselessProvider = initAIData.provider.filter(
      (provider) => !submitAIData.provider.includes(provider),
    )
    const uselessCompletion = initAIData.completion.filter(
      (completion) => !submitAIData.completion.includes(completion),
    )
    return { uselessProvider, uselessCompletion }
  }

  const removeUselessAIData = async (
    initAIData: {
      provider: Array<string>
      completion: Array<string>
    },
    data: GroupedFlowData,
  ) => {
    const { provider, completion } = formatAIData(data)
    const { uselessProvider, uselessCompletion } = findUselessAIData(initAIData, {
      provider,
      completion,
    })
    await Promise.allSettled(uselessCompletion.map(deleteAICompletionProfile))
    await Promise.allSettled(uselessProvider.map(deleteAIProvider))
    return Promise.resolve({ uselessProvider, uselessCompletion })
  }

  return {
    isSubmitting,
    submitFlow,
    removeUselessAIData,
  }
}
