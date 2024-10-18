import type { Component, Ref } from 'vue'
import { nextTick, ref } from 'vue'
import { listAuthz, queryAuthzItemMetrics } from '@/api/auth'
import { AuthzSourceItem, Metrics } from '@/types/auth'
import useHandleAuthzItem from '@/hooks/Auth/useHandleAuthzItem'
import useMove from '@/hooks/useMove'
import useSortableTable from '@/hooks/useSortableTable'
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
  moveAuthzUp: (index: number) => Promise<undefined>
  moveAuthzDown: (index: number) => Promise<undefined>
  moveAuthzToTop: (row: AuthzItemInTable) => Promise<void>
  moveAuthzToBottom: (row: AuthzItemInTable) => Promise<void>
} => {
  const isDataLoading = ref(false)
  const authzList = ref<AuthzItemInTable[]>([])
  const metricsMap: Ref<Record<string, Metrics>> = ref({})

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
          img = new URL(`../assets/img/${item.type}.png`, import.meta.url).href
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
    moveAuthzToTop: requestMoveAuthzToTop,
    moveAuthzToBottom: requestMoveAuthzToBottom,
  } = useHandleAuthzItem()
  const moveAuthzUp = (index: number) => handleDragEvent(index - 1, index, authzList.value)
  const moveAuthzDown = (index: number) => handleDragEvent(index + 1, index, authzList.value)
  const moveAuthzToTop = async (row: AuthzItemInTable) => {
    try {
      await requestMoveAuthzToTop(row)
    } catch (error) {
      authzList.value = []
    } finally {
      getAuthzList()
    }
  }
  const moveAuthzToBottom = async (row: AuthzItemInTable) => {
    try {
      await requestMoveAuthzToBottom(row)
    } catch (error) {
      authzList.value = []
    } finally {
      getAuthzList()
    }
  }

  const { handleDragEvent } = useMove(
    {
      moveToBottom: moveAuthzToBottom,
      moveToTop: moveAuthzToTop,
      moveBeforeAnotherTarget: moveAuthzBeforeAnotherAuthz,
      moveAfterAnotherTarget: moveAuthzAfterAnotherAuthz,
    },
    undefined,
    getAuthzList,
  )
  const handleOrderChanged = async (evt: SortableEvent) => {
    const { newIndex, oldIndex } = evt
    if (newIndex === undefined || oldIndex === undefined) {
      return
    }
    handleDragEvent(newIndex, oldIndex, authzList.value)
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
