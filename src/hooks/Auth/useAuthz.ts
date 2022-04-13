import { ref, Ref } from 'vue'
import { listAuthz, queryAuthzItemMetrics } from '@/api/auth'
import { AuthzSourceItem, Metrics } from '@/types/auth'

type AuthzItemInTable = AuthzSourceItem & {
  metrics: Metrics
}

export const hasMetrics = ({ type }: AuthzItemInTable): boolean =>
  type !== 'built_in_database' && type !== 'file'

export default (): {
  isDataLoading: Ref<boolean>
  authzList: Ref<Array<AuthzItemInTable>>
  getAuthzList: (isInit?: boolean) => void
  updateAuthnItemMetrics: (type: string) => void
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
    isDataLoading.value = !isInit && true
    try {
      const res: { sources: AuthzSourceItem[] } = await listAuthz()
      authzList.value = res.sources.map((item) => {
        let img = ''
        try {
          img = require(`@/assets/img/${item.type}.png`)
        } catch (error) {
          console.error(error)
        }
        return {
          ...item,
          img,
          metrics: metricsMap.value[item.type],
        }
      })
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
          if (hasMetrics(item)) {
            const metrics = await queryAuthzItemMetrics(item.type)
            metricsMap.value[item.type] = metrics
            item.metrics = metrics
          }
        }),
      )
    } catch (error) {
      console.error(error)
    } finally {
      isDataLoading.value = false
    }
  }

  const updateAuthnItemMetrics = async (type: string) => {
    const metrics = await queryAuthzItemMetrics(type)
    metricsMap.value[type] = metrics
    const target = authzList.value.find((item) => item.type === type)
    if (target) {
      target.metrics = metrics
    }
  }

  initTableData()

  return {
    isDataLoading,
    authzList,
    getAuthzList,
    updateAuthnItemMetrics,
  }
}
