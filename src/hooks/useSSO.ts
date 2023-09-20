import { ref, Ref } from 'vue'
import { getSSOList } from '@/api/sso'
import {
  DashboardSsoBackendStatus,
  DashboardSsoBackendStatusBackend,
} from '@/types/schemas/dashboardSingleSignOn.schemas'

export const useSSOBackendsLabel = (): { getBackendLabel: (backend: string) => string } => {
  const backendsLabelMap: Map<string, string> = new Map([
    [DashboardSsoBackendStatusBackend.ldap, 'LDAP'],
  ])
  const getBackendLabel = (backend: string): string => backendsLabelMap.get(backend) || ''

  return { getBackendLabel }
}

export default function useSSO(): {
  loadConfigPromise: undefined | Promise<Array<DashboardSsoBackendStatus>>
  SSOConfig: Ref<Array<DashboardSsoBackendStatus>>
  getSSOList: () => Promise<unknown[]>
} {
  let loadConfigPromise: undefined | Promise<Array<DashboardSsoBackendStatus>> = undefined
  const SSOConfig = ref<Array<DashboardSsoBackendStatus>>([])
  const getSSOConfig = async () => {
    try {
      loadConfigPromise = getSSOList()
      SSOConfig.value = await loadConfigPromise
    } catch (error) {
      //
    }
  }
  getSSOConfig()

  return {
    loadConfigPromise,
    SSOConfig,
    getSSOList,
  }
}
