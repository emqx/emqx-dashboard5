import {
  postSource,
  putSource,
  putSourceEnable,
  deleteSource as requestDeleteSource,
  reconnectSource as requestReconnectSource,
  reconnectSourceForNode as requestReconnectSourceForNode,
  resetSourceMetrics as requestResetSourceMetrics,
  getSourceDetail as requestSourceDetail,
  getSourceMetrics as requestSourceMetrics,
  testSourceConnectivity,
} from '@/api/sources'
import { Source } from '@/types/rule'

const useHandleSourceItem = (): {
  getSourceDetail: (id: string) => Promise<Source>
  handleDataAfterLoaded: (data: Source) => Source
  addSource: (data: Source) => Promise<Source>
  updateSource: (data: Source) => Promise<Source>
  deleteSource: (id: string, withDependency?: boolean) => Promise<void>
  getSourceMetrics: (source: Source) => Promise<any>
  resetSourceMetrics: (source: Source) => Promise<void>
  toggleSourceEnable: (source: Source, isEnable: boolean) => Promise<Source>
  reconnectSource: (source: Source) => Promise<void>
  reconnectSourceForNode: (node: string, source: Source) => Promise<void>
  isTesting: Ref<boolean>
  testConnectivity: (data: Source) => Promise<void>
} => {
  const { handleActionDataBeforeUpdate, handleActionDataBeforeSubmit } = useActionDataHandler()
  const { getNsParams } = useNsParams()

  const handleDataAfterLoaded = (data: Source): Source => data

  const getSourceDetail = async (id: string): Promise<Source> => {
    try {
      const data = await requestSourceDetail(id)
      return handleDataAfterLoaded(data) as Source
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const addSource = async (data: Source): Promise<Source> => {
    return postSource(data) as Promise<Source>
  }

  const updateSource = async (data: Source): Promise<Source> => {
    try {
      const { id } = data as Source
      const dataToSubmit = await handleActionDataBeforeUpdate(data)
      Reflect.deleteProperty(dataToSubmit as Source, 'id')
      return putSource(id, dataToSubmit as any) as Promise<Source>
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const deleteSource = async (id: string, withDependency = false): Promise<void> => {
    return requestDeleteSource(id, withDependency)
  }

  const getSourceMetrics = async ({ id, namespace }: Source): Promise<any> => {
    return requestSourceMetrics(id, getNsParams(namespace))
  }

  const resetSourceMetrics = async ({ id, namespace }: Source) => {
    return requestResetSourceMetrics(id, getNsParams(namespace))
  }

  const toggleSourceEnable = ({ id, namespace }: Source, isEnable: boolean) => {
    return putSourceEnable(id, isEnable, getNsParams(namespace))
  }

  const reconnectSource = async ({ id, namespace }: Source): Promise<void> => {
    return requestReconnectSource(id, getNsParams(namespace))
  }

  const reconnectSourceForNode = async (node: string, { id, namespace }: Source): Promise<void> => {
    return requestReconnectSourceForNode(node, id, getNsParams(namespace))
  }

  const isTesting = ref(false)
  const testConnectivity = async (data: Source): Promise<void> => {
    try {
      isTesting.value = true
      const dataForSubmit = await handleActionDataBeforeSubmit(data)
      await testSourceConnectivity(dataForSubmit)
      isTesting.value = false
      return Promise.resolve()
    } catch (error) {
      isTesting.value = false
      return Promise.reject(error)
    }
  }

  return {
    getSourceDetail,
    handleDataAfterLoaded,
    addSource,
    updateSource,
    deleteSource,
    getSourceMetrics,
    resetSourceMetrics,
    toggleSourceEnable,
    reconnectSource,
    reconnectSourceForNode,
    isTesting,
    testConnectivity,
  }
}

export default useHandleSourceItem

export const useDeleteSource = (
  deletedCallBack: () => void,
): {
  showSecondConfirm: Ref<boolean>
  usingBridgeRules: Ref<string[]>
  currentDeleteBridgeData: Ref<Source | undefined>
  handleDeleteSuc: () => void
  handleDeleteSource: (item: Source) => Promise<void>
} => {
  const { t } = useI18nTl('RuleEngine')

  const showSecondConfirm = ref(false)
  const usingBridgeRules: Ref<Array<string>> = ref([])
  const currentDeleteBridgeData = ref<Source | undefined>(undefined)

  const handleDeleteSuc = () => {
    ElMessage.success(t('Base.deleteSuccess'))
    if (deletedCallBack && isFunction(deletedCallBack)) {
      deletedCallBack()
    }
  }

  const secondConfirmToDelete = async (ruleList: Array<string>) => {
    usingBridgeRules.value = ruleList
    showSecondConfirm.value = true
  }

  const { deleteSource } = useHandleSourceItem()
  const handleDeleteSource = async (item: Source) => {
    if (item.rules?.length) {
      currentDeleteBridgeData.value = item
      secondConfirmToDelete(item.rules)
      return
    }
    await ElMessageBox.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    try {
      await deleteSource(item.id)
      handleDeleteSuc()
    } catch (error: any) {
      //
    }
  }

  return {
    showSecondConfirm,
    usingBridgeRules,
    currentDeleteBridgeData,
    handleDeleteSuc,
    handleDeleteSource,
  }
}
