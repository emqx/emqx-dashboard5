import { getSSORunning, postSSOLogin } from '@/api/sso'
import { API_BASE_URL } from '@/common/constants'
import {
  DashboardSsoBackendStatusBackend,
  SsoLogin,
  DashboardSamlBackend,
  PostSsoLoginBackend200,
} from '@/types/schemas/dashboardSingleSignOn.schemas'
import { ComputedRef, Ref, computed, reactive, ref } from 'vue'
import useI18nTl from '../useI18nTl'

export const useSSOBackendsLabel = (): { getBackendLabel: (backend: string) => string } => {
  const { tl } = useI18nTl('General')

  const backendsLabelMap: Map<string, string> = new Map([
    [DashboardSsoBackendStatusBackend.ldap, 'LDAP'],
    [DashboardSsoBackendStatusBackend.saml, 'SAML 2.0'],
    [DashboardSsoBackendStatusBackend.iframe, tl('customToken')],
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
  samlLoginUrl: string
  samlBackend: Ref<'saml'>
  currentLoginBackend: Ref<LoginBackend>
  isSSOLoading: Ref<boolean>
  enabledSSOList: Ref<Array<string>>
  ldapRecord: SsoLogin
  hasSSOEnabled: ComputedRef<boolean>
  ldapLogin: () => Promise<LdapLoginResult>
  getEnabledSSO: () => Promise<void>
} {
  const enabledSSOList = ref<Array<string>>([])
  const isSSOLoading = ref(false)
  const ldapRecord = reactive<SsoLogin>({
    username: '',
    password: '',
    backend: 'ldap',
  })
  const currentLoginBackend = ref<LoginBackend>('local')

  const samlLoginUrl = `${API_BASE_URL}/sso/login/saml`
  const samlBackend = ref(DashboardSamlBackend.saml)

  const hasSSOEnabled = computed(() => enabledSSOList.value.length > 0)

  const getEnabledSSO = async () => {
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
    samlLoginUrl,
    samlBackend,
    isSSOLoading,
    enabledSSOList,
    ldapRecord,
    hasSSOEnabled,
    ldapLogin,
    getEnabledSSO,
  }
}
