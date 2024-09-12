import type { Ref, Component } from 'vue'
import { ref, nextTick } from 'vue'
import { listAuthn, queryAuthnItemMetrics } from '@/api/auth'
import { AuthnItem, Metrics } from '@/types/auth'
import useSortableTable from '@/hooks/useSortableTable'
import { SortableEvent } from 'sortablejs'
import useHandleAuthnItem from '@/hooks/Auth/useHandleAuthnItem'
import useMove from '@/hooks/useMove'
import useAuth from '@/hooks/Auth/useAuth'
import jwtIcon from '@/assets/img/jwt.png'
import { getImg } from '@/common/tools'

export type AuthnItemInTable = AuthnItem & {
  metrics?: Metrics
}

export default (): {
  isListLoading: Ref<boolean>
  authnList: Ref<AuthnItemInTable[]>
  tableCom: Ref<Component>
  getAuthnItemBackendForShow: (item: AuthnItemInTable) => string
  getAuthnList: (isInit?: boolean) => Promise<void>
  updateAuthnItemMetrics: (authn: AuthnItem) => Promise<void>
  moveAuthnUp: (index: number) => Promise<void>
  moveAuthnDown: (index: number) => Promise<void>
  moveAuthnToTop: (authn: AuthnItem) => any
  moveAuthnToBottom: (authn: AuthnItem) => any
} => {
  const isListLoading = ref(false)
  const authnList: Ref<Array<AuthnItemInTable>> = ref([])
  const metricsMap: Ref<Record<string, Metrics>> = ref({})
  const { titleMap } = useAuth()

  /**
   * for disable added type
   */
  const setAddedAuthn = () => {
    const addedAuthn = authnList.value.map((authn) => {
      if (authn.backend === undefined) {
        return `${authn.mechanism}`
      }
      return `${authn.mechanism}_${authn.backend}`
    })
    sessionStorage.setItem('addedAuthn', JSON.stringify(addedAuthn))
  }

  const getAuthnList = async (isInit = false) => {
    if (!isInit) {
      isListLoading.value = true
    }
    try {
      const res: AuthnItem[] = await listAuthn()
      authnList.value = res.map((item) => {
        const ret: AuthnItemInTable = item
        if (ret.mechanism !== 'jwt') {
          ret.img = getImg(`img/${ret.backend}.png`)
        } else {
          ret.img = jwtIcon
        }
        ret.metrics = metricsMap.value[ret.id]
        return item
      })
      setAddedAuthn()
      await nextTick()
      initSortable()
    } catch (error) {
      console.error(error)
    } finally {
      isListLoading.value = false
    }
  }

  const getAuthnItemBackendForShow = (item: AuthnItemInTable): string => {
    let backend = item.backend
    if (item.mechanism === 'jwt') {
      backend = 'jwt'
    }
    return titleMap[backend]
  }

  const initTableData = async () => {
    try {
      metricsMap.value = {}
      isListLoading.value = true
      await getAuthnList(true)
      await Promise.all(
        authnList.value.map(async (item) => {
          const metrics = await queryAuthnItemMetrics(item.id)
          metricsMap.value[item.id] = metrics
          item.metrics = metrics
        }),
      )
    } catch (error) {
      console.error(error)
    } finally {
      isListLoading.value = false
    }
  }

  const updateAuthnItemMetrics = async (authn: AuthnItem) => {
    const metrics = await queryAuthnItemMetrics(authn.id)
    metricsMap.value[authn.id] = metrics
    const target = authnList.value.find((item) => item.id === authn.id)
    if (target) {
      target.metrics = metrics
    }
  }

  const {
    moveAuthnBeforeAnotherAuthn,
    moveAuthnAfterAnotherAuthn,
    moveAuthnToTop: requestMoveAuthnToTop,
    moveAuthnToBottom: requestMoveAuthnToBottom,
  } = useHandleAuthnItem()
  const moveAuthnUp = async (index: number) => handleDragEvent(index - 1, index, authnList.value)
  const moveAuthnDown = async (index: number) => handleDragEvent(index + 1, index, authnList.value)
  const moveAuthnToTop = async (row: AuthnItem) => {
    try {
      await requestMoveAuthnToTop(row)
    } catch (error) {
      // empty the array first when an error occurs, otherwise the view will not be updated
      authnList.value = []
    } finally {
      getAuthnList()
    }
  }
  const moveAuthnToBottom = async (row: AuthnItem) => {
    try {
      await requestMoveAuthnToBottom(row)
    } catch (error) {
      // empty the array first when an error occurs, otherwise the view will not be updated
      authnList.value = []
    } finally {
      getAuthnList()
    }
  }
  const { handleDragEvent } = useMove(
    {
      moveToBottom: moveAuthnToBottom,
      moveToTop: moveAuthnToTop,
      moveBeforeAnotherTarget: moveAuthnBeforeAnotherAuthn,
      moveAfterAnotherTarget: moveAuthnAfterAnotherAuthn,
    },
    undefined,
    getAuthnList,
  )

  const handleOrderChanged = async (evt: SortableEvent) => {
    const { newIndex, oldIndex } = evt
    if (newIndex === undefined || oldIndex === undefined) {
      return
    }
    handleDragEvent(newIndex, oldIndex, authnList.value)
  }

  const { tableCom, initSortable } = useSortableTable(handleOrderChanged)

  initTableData()

  return {
    isListLoading,
    authnList,
    tableCom,
    getAuthnItemBackendForShow,
    getAuthnList,
    updateAuthnItemMetrics,
    moveAuthnUp,
    moveAuthnDown,
    moveAuthnToTop,
    moveAuthnToBottom,
  }
}
