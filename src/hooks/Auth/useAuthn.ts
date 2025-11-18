import { listAuthn, queryAuthnItemMetrics } from '@/api/auth'
import jwtIcon from '@/assets/img/jwt.png'
import { AuthnItem, Metrics } from '@/types/auth'
import { AuthnMechanismType } from '@/types/enum'

export type AuthnItemInTable = AuthnItem & {
  metrics?: Metrics
}

export default (): {
  isListLoading: Ref<boolean>
  authnList: Ref<AuthnItemInTable[]>
  getAuthnItemBackendForShow: (item: AuthnItemInTable) => string
  getAuthnList: (isInit?: boolean) => Promise<void>
  updateAuthnItemMetrics: (authn: AuthnItem) => Promise<void>
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
        if (ret.mechanism !== 'jwt' && ret.mechanism !== AuthnMechanismType.CINFO) {
          try {
            ret.img = getImg(`img/${ret.backend}.png`)
          } catch {
            ret.img = ''
          }
        } else if (ret.mechanism === AuthnMechanismType.CINFO) {
          ret.img = getImg(`img/cinfo.png`)
        } else {
          ret.img = jwtIcon
        }
        ret.metrics = metricsMap.value[ret.id]
        return item
      })
      setAddedAuthn()
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
    if (item.mechanism === 'cinfo') {
      backend = 'cinfo'
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

  initTableData()

  return {
    isListLoading,
    authnList,
    getAuthnItemBackendForShow,
    getAuthnList,
    updateAuthnItemMetrics,
  }
}
