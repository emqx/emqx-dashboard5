import http from '@/common/http'
import type {
  DashboardSsoBackendStatus,
  EmqxDashboardSsoLdapLdap,
  GetSsoRunning200Item,
  PostSsoLoginBackend200,
  PostSsoLoginBackendBody,
} from '@/types/schemas/dashboardSingleSignOn.schemas'

export const getSSOList = (): Promise<DashboardSsoBackendStatus[]> => {
  return http.get('/sso')
}

export const postSSOLogin = (
  backend: 'ldap' | 'saml',
  emqxDashboardSsoLdapLogin: PostSsoLoginBackendBody,
): Promise<PostSsoLoginBackend200> => {
  return http.post(`/sso/login/${backend}`, emqxDashboardSsoLdapLogin)
}

export const getSSORunning = (): Promise<GetSsoRunning200Item[]> => {
  return http.get('/sso/running')
}

export const getSSOBackend = (backend: 'ldap'): Promise<EmqxDashboardSsoLdapLdap> => {
  return http.get(`/sso/${backend}`)
}

export const putSSOBackend = (
  backend: 'ldap',
  emqxDashboardSsoLdapLdap: EmqxDashboardSsoLdapLdap,
): Promise<EmqxDashboardSsoLdapLdap> => {
  return http.put(`/sso/${backend}`, emqxDashboardSsoLdapLdap)
}
