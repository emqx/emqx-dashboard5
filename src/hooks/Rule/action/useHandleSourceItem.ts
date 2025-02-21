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
import useI18nTl from '@/hooks/useI18nTl'
import { Source } from '@/types/rule'
import { useActionDataHandler } from '../useDataHandler'

const useHandleSourceItem = (): {
  getSourceDetail: (id: string) => Promise<Source>
  handleDataAfterLoaded: (data: Source) => Source
  addSource: (data: Source) => Promise<Source>
  updateSource: (data: Source) => Promise<Source>
  deleteSource: (id: string, withDependency?: boolean) => Promise<void>
  getSourceMetrics: (id: string) => Promise<any>
  resetSourceMetrics: (id: string) => Promise<void>
  toggleSourceEnable: (id: string, isEnable: boolean) => Promise<Source>
  reconnectSource: (id: string) => Promise<void>
  reconnectSourceForNode: (node: string, id: string) => Promise<void>
  isTesting: Ref<boolean>
  testConnectivity: (data: Source) => Promise<void>
} => {
  const { handleActionDataBeforeUpdate, handleActionDataBeforeSubmit } = useActionDataHandler()

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

  const getSourceMetrics = async (id: string): Promise<any> => {
    return requestSourceMetrics(id)
  }

  const resetSourceMetrics = async (id: string) => {
    return requestResetSourceMetrics(id)
  }

  const toggleSourceEnable = (id: string, isEnable: boolean) => {
    return putSourceEnable(id, isEnable)
  }

  const reconnectSource = async (id: string): Promise<void> => {
    return requestReconnectSource(id)
  }

  const reconnectSourceForNode = async (node: string, id: string): Promise<void> => {
    return requestReconnectSourceForNode(node, id)
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
  currentDeleteBridgeId: Ref<string>
  handleDeleteSuc: () => void
  handleDeleteSource: (item: Source) => Promise<void>
} => {
  const { t } = useI18nTl('RuleEngine')

  const showSecondConfirm = ref(false)
  const usingBridgeRules: Ref<Array<string>> = ref([])
  const currentDeleteBridgeId = ref('')

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
      currentDeleteBridgeId.value = item.id
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
    currentDeleteBridgeId,
    handleDeleteSuc,
    handleDeleteSource,
  }
}
