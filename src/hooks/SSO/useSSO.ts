import { ref, Ref, reactive, computed, ComputedRef } from 'vue'
import { getSSOList, postSSOLogin } from '@/api/sso'
import {
  EmqxDashboardSsoLdapLogin,
  PostSsoLogin200,
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

type LoginBackend = 'native' | 'ldap'

interface LdapLoginResult {
  username: string | undefined
  response: PostSsoLogin200
}

export default function useSSO(): {
  currentLoginBackend: Ref<LoginBackend>
  isSSOLoading: Ref<boolean>
  loadConfigPromise: undefined | Promise<Array<DashboardSsoBackendStatus>>
  SSOConfig: Ref<Array<DashboardSsoBackendStatus>>
  ldapRecord: EmqxDashboardSsoLdapLogin
  hasSSOEnabled: ComputedRef<boolean>
  getSSOList: () => Promise<unknown[]>
  ldapLogin: () => Promise<LdapLoginResult>
} {
  let loadConfigPromise: undefined | Promise<Array<DashboardSsoBackendStatus>> = undefined
  const SSOConfig = ref<Array<DashboardSsoBackendStatus>>([])
  const isSSOLoading = ref(false)
  const ldapRecord = reactive<EmqxDashboardSsoLdapLogin>({
    username: '',
    password: '',
    backend: 'ldap',
  })
  const currentLoginBackend = ref<LoginBackend>('native')

  const hasSSOEnabled = computed(() => SSOConfig.value.some(({ enable }) => enable))

  const getSSOConfig = async () => {
    try {
      loadConfigPromise = getSSOList()
      SSOConfig.value = await loadConfigPromise
    } catch (error) {
      //
    }
  }
  getSSOConfig()

  const ldapLogin = async (): Promise<LdapLoginResult> => {
    try {
      isSSOLoading.value = true
      const res = await postSSOLogin(ldapRecord)
      const { username } = ldapRecord
      return Promise.resolve({ username, response: res })
    } catch (error) {
      return Promise.reject(error)
    } finally {
      isSSOLoading.value = false
    }
  }

  return {
    loadConfigPromise,
    currentLoginBackend,
    isSSOLoading,
    SSOConfig,
    ldapRecord,
    hasSSOEnabled,
    getSSOList,
    ldapLogin,
  }
}
