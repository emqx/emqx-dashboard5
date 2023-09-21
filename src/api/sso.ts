import http from '@/common/http'
import type {
  DashboardSsoBackendStatus,
  PostSsoLoginBackend200,
  EmqxDashboardSsoLdapLogin,
  EmqxDashboardSsoLdapLdap,
  GetSsoRunning200Item,
} from '@/types/schemas/dashboardSingleSignOn.schemas'

export const verifyTokenFromSAML = (token: string): Promise<unknown> => {
  return Promise.resolve()
}

export const getSSOList = (): Promise<DashboardSsoBackendStatus[]> => {
  return http.get(`/sso`)
}

export const postSSOLogin = (
  backend: 'ldap',
  emqxDashboardSsoLdapLogin: EmqxDashboardSsoLdapLogin,
): Promise<PostSsoLoginBackend200> => {
  return http.post(`/sso/login/${backend}`, emqxDashboardSsoLdapLogin)
}

export const getSSORunning = (): Promise<GetSsoRunning200Item[]> => {
  return http.get(`/sso/running`)
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
