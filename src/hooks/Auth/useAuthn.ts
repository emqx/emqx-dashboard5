import { ref, Ref } from 'vue'
import { listAuthn, queryAuthnItemMetrics } from '@/api/auth'
import { AuthnItem, Metrics } from '@/types/auth'

type AuthnItemInTable = AuthnItem & {
  metrics?: Metrics
}

export const hasMetrics = ({ backend }: AuthnItem): boolean =>
  !!backend && backend !== 'jwt' && backend !== 'built_in_database'

export default (): {
  isListLoading: Ref<boolean>
  authnList: Ref<AuthnItemInTable[]>
  getAuthnList: (isInit?: boolean) => Promise<void>
  updateAuthnItemMetrics: (id: string) => Promise<void>
} => {
  const isListLoading = ref(false)
  const authnList: Ref<Array<AuthnItemInTable>> = ref([])
  const metricsMap: Ref<Record<string, Metrics>> = ref({})

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
    isListLoading.value = !isInit && true
    try {
      const res: AuthnItem[] = await listAuthn()
      authnList.value = res.map((item) => {
        const ret: AuthnItemInTable = item
        if (ret.mechanism !== 'jwt') {
          try {
            ret.img = require(`@/assets/img/${ret.backend}.png`)
          } catch {
            ret.img = ''
          }
        } else {
          ret.img = require(`@/assets/img/jwt.png`)
          ret.backend = 'jwt'
        }
        if (hasMetrics(ret)) {
          ret.metrics = metricsMap.value[ret.id]
        }
        return item
      })
      setAddedAuthn()
    } catch (error) {
      console.error(error)
    } finally {
      isListLoading.value = false
    }
  }

  const initTableData = async () => {
    try {
      metricsMap.value = {}
      isListLoading.value = true
      await getAuthnList(true)
      await Promise.all(
        authnList.value.map(async (item) => {
          if (!hasMetrics(item)) {
            return Promise.resolve({ ...item })
          }
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

  const updateAuthnItemMetrics = async (id: string) => {
    const metrics = await queryAuthnItemMetrics(id)
    metricsMap.value[id] = metrics
    const target = authnList.value.find((item) => item.id === id)
    if (target) {
      target.metrics = metrics
    }
  }

  initTableData()

  return {
    isListLoading,
    authnList,
    getAuthnList,
    updateAuthnItemMetrics,
  }
}
