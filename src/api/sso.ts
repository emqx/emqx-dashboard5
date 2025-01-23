import http from '@/common/http'
import type {
  DashboardSsoBackendStatus,
  SsoLdap,
  GetSsoRunning200Item,
  PostSsoLoginBackend200,
  PostSsoLoginBackendBody,
} from '@/types/schemas/dashboardSingleSignOn.schemas'

export const getSSOList = (): Promise<DashboardSsoBackendStatus[]> => {
  return http.get('/sso')
}

export const postSSOLogin = (
  backend: 'ldap' | 'saml' | 'tongauth',
  emqxDashboardSsoLdapLogin?: PostSsoLoginBackendBody,
): Promise<PostSsoLoginBackend200> => {
  return http.post(`/sso/login/${backend}`, emqxDashboardSsoLdapLogin)
}

export const getSSORunning = (): Promise<GetSsoRunning200Item[]> => {
  return http.get('/sso/running')
}

export const getSSOBackend = (backend: 'ldap'): Promise<SsoLdap> => {
  return http.get(`/sso/${backend}`)
}

export const putSSOBackend = (
  backend: 'ldap',
  emqxDashboardSsoLdapLdap: SsoLdap,
): Promise<SsoLdap> => {
  return http.put(`/sso/${backend}`, emqxDashboardSsoLdapLdap)
}
