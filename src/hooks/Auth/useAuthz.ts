import { listAuthz, queryAuthzItemMetrics } from '@/api/auth'
import { AuthzSourceItem, Metrics } from '@/types/auth'
import { SortableEvent } from 'sortablejs'

export type AuthzItemInTable = AuthzSourceItem & {
  metrics: Metrics
}

export default (): {
  isDataLoading: Ref<boolean>
  authzList: Ref<Array<AuthzItemInTable>>
  tableCom: Ref<Component>
  getAuthzList: (isInit?: boolean) => void
  updateAuthzItemMetrics: (authz: AuthzItemInTable) => void
  moveAuthzUp: (index: number) => Promise<void>
  moveAuthzDown: (index: number) => Promise<void>
  moveAuthzToTop: (row: AuthzItemInTable) => Promise<void>
  moveAuthzToBottom: (row: AuthzItemInTable) => Promise<void>
} => {
  const isDataLoading = ref(false)
  const authzList = ref<AuthzItemInTable[]>([])
  const metricsMap: Ref<Record<string, Metrics>> = ref({})
  const { tl } = useI18nTl('Auth')
  const { operationWarning } = useOperationConfirm()

  /**
   * for disable added type
   */
  const setAddedAuthz = () => {
    const addedAuthz = authzList.value.map((authz) => authz.type)
    sessionStorage.setItem('addedAuthz', JSON.stringify(addedAuthz))
  }

  const getAuthzList = async (isInit = false) => {
    if (!isInit) {
      isDataLoading.value = true
    }
    try {
      const res: { sources: AuthzSourceItem[] } = await listAuthz()
      authzList.value = res.sources.map((item) => {
        let img = ''
        try {
          img = getImg(`img/${item.type}.png`)
        } catch (error) {
          console.error(error)
        }
        return {
          ...item,
          img,
          metrics: metricsMap.value[item.type],
        }
      })
      await nextTick()
      initSortable()
      setAddedAuthz()
    } catch (error) {
      console.error(error)
    } finally {
      isDataLoading.value = false
    }
  }

  const initTableData = async () => {
    try {
      metricsMap.value = {}
      isDataLoading.value = true
      await getAuthzList()
      await Promise.all(
        authzList.value.map(async (item) => {
          const metrics = await queryAuthzItemMetrics(item.type)
          metricsMap.value[item.type] = metrics
          item.metrics = metrics
        }),
      )
    } catch (error) {
      console.error(error)
    } finally {
      isDataLoading.value = false
    }
  }

  const updateAuthzItemMetrics = async (authz: AuthzItemInTable) => {
    const metrics = await queryAuthzItemMetrics(authz.type)
    metricsMap.value[authz.type] = metrics
    const target = authzList.value.find((item) => item.type === authz.type)
    if (target) {
      target.metrics = metrics
    }
  }

  const {
    moveAuthzBeforeAnotherAuthz,
    moveAuthzAfterAnotherAuthz,
    moveAuthzToTop: moveAuthzToTopApi,
    moveAuthzToBottom: moveAuthzToBottomApi,
  } = useHandleAuthzItem()

  const clearAuthzList = async () => {
    authzList.value = []
    await nextTick()
  }

  const confirmOrderChange = () => operationWarning(tl('confirmOrderChange'))

  const requestMoveAuthzToTop = async (row: AuthzItemInTable) => {
    try {
      await moveAuthzToTopApi(row)
    } catch (error) {
      authzList.value = []
    } finally {
      getAuthzList()
    }
  }
  const requestMoveAuthzToBottom = async (row: AuthzItemInTable) => {
    try {
      await moveAuthzToBottomApi(row)
    } catch (error) {
      authzList.value = []
    } finally {
      getAuthzList()
    }
  }

  const moveAuthzUp = async (index: number) => {
    try {
      await confirmOrderChange()
      await handleDragEvent(index - 1, index, authzList.value)
    } catch (error) {
      // canceled
    }
  }
  const moveAuthzDown = async (index: number) => {
    try {
      await confirmOrderChange()
      await handleDragEvent(index + 1, index, authzList.value)
    } catch (error) {
      // canceled
    }
  }
  const moveAuthzToTop = async (row: AuthzItemInTable) => {
    try {
      await confirmOrderChange()
      await requestMoveAuthzToTop(row)
    } catch (error) {
      // canceled
    }
  }
  const moveAuthzToBottom = async (row: AuthzItemInTable) => {
    try {
      await confirmOrderChange()
      await requestMoveAuthzToBottom(row)
    } catch (error) {
      // canceled
    }
  }

  const { handleDragEvent } = useMove(
    {
      moveToBottom: requestMoveAuthzToBottom,
      moveToTop: requestMoveAuthzToTop,
      moveBeforeAnotherTarget: moveAuthzBeforeAnotherAuthz,
      moveAfterAnotherTarget: moveAuthzAfterAnotherAuthz,
    },
    clearAuthzList,
    getAuthzList,
  )
  const handleOrderChanged = async (evt: SortableEvent) => {
    const { newIndex, oldIndex } = evt
    if (newIndex === undefined || oldIndex === undefined) {
      return
    }
    try {
      await confirmOrderChange()
      await handleDragEvent(newIndex, oldIndex, authzList.value)
    } catch (error) {
      await clearAuthzList()
      await getAuthzList()
    }
  }

  const { tableCom, initSortable } = useSortableTable(handleOrderChanged)

  initTableData()

  return {
    isDataLoading,
    authzList,
    tableCom,
    getAuthzList,
    updateAuthzItemMetrics,
    moveAuthzUp,
    moveAuthzDown,
    moveAuthzToTop,
    moveAuthzToBottom,
  }
}
