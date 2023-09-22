import { ref, Ref, reactive, computed, ComputedRef } from 'vue'
import { getSSORunning, postSSOLogin } from '@/api/sso'
import {
  EmqxDashboardSsoLdapLogin,
  PostSsoLoginBackend200,
  DashboardSsoBackendStatusBackend,
} from '@/types/schemas/dashboardSingleSignOn.schemas'

export const useSSOBackendsLabel = (): { getBackendLabel: (backend: string) => string } => {
  const backendsLabelMap: Map<string, string> = new Map([
    [DashboardSsoBackendStatusBackend.ldap, 'LDAP'],
    [DashboardSsoBackendStatusBackend.saml, 'SAML 2.0'],
  ])
  const getBackendLabel = (backend: string): string => backendsLabelMap.get(backend) || ''

  return { getBackendLabel }
}

type LoginBackend = 'local' | 'ldap'

interface LdapLoginResult {
  username: string | undefined
  response: PostSsoLoginBackend200
}

export default function useSSO(): {
  currentLoginBackend: Ref<LoginBackend>
  isSSOLoading: Ref<boolean>
  enabledSSOList: Ref<Array<string>>
  ldapRecord: EmqxDashboardSsoLdapLogin
  hasSSOEnabled: ComputedRef<boolean>
  ldapLogin: () => Promise<LdapLoginResult>
  getEanbledSSO: () => Promise<void>
} {
  const enabledSSOList = ref<Array<string>>([])
  const isSSOLoading = ref(false)
  const ldapRecord = reactive<EmqxDashboardSsoLdapLogin>({
    username: '',
    password: '',
    backend: 'ldap',
  })
  const currentLoginBackend = ref<LoginBackend>('local')

  const hasSSOEnabled = computed(() => enabledSSOList.value.length > 0)

  const getEanbledSSO = async () => {
    try {
      enabledSSOList.value = await getSSORunning()
    } catch (error) {
      //
    }
  }

  const ldapLogin = async (): Promise<LdapLoginResult> => {
    try {
      isSSOLoading.value = true
      const res = await postSSOLogin('ldap', ldapRecord)
      const { username } = ldapRecord
      return Promise.resolve({ username, response: res })
    } catch (error) {
      return Promise.reject(error)
    } finally {
      isSSOLoading.value = false
    }
  }

  return {
    currentLoginBackend,
    isSSOLoading,
    enabledSSOList,
    ldapRecord,
    hasSSOEnabled,
    ldapLogin,
    getEanbledSSO,
  }
}
