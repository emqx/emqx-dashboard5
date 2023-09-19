import http from '@/common/http'
import type {
  DashboardSsoBackendStatus,
  GetSsoRunning200Item,
  PostSsoLogin200,
  EmqxDashboardSsoLdapLogin,
  EmqxDashboardSsoLdapLdap,
} from '@/types/schemas/dashboardSingleSignOn.schemas'

export const verifyTokenFromSAML = (token: string): Promise<unknown> => {
  return Promise.resolve()
}

export const getSSOList = (): Promise<DashboardSsoBackendStatus[]> => {
  return http.get(`/sso`)
}

export const getSSORunning = (): Promise<GetSsoRunning200Item[]> => {
  return http.get(`/sso/running`)
}

export const postSSOLogin = (
  emqxDashboardSsoLdapLogin: EmqxDashboardSsoLdapLogin,
): Promise<PostSsoLogin200> => {
  return http.post(`/sso/login`, emqxDashboardSsoLdapLogin)
}

export const deleteSSOBackend = (backend: 'ldap'): Promise<void> => {
  return http.delete(`/sso/${backend}`)
}

export const getSSOBackend = (backend: 'ldap'): Promise<EmqxDashboardSsoLdapLdap> => {
  return http.get(`/sso/${backend}`)
}

export const postSSOBackend = (
  backend: 'ldap',
  emqxDashboardSsoLdapLdap: EmqxDashboardSsoLdapLdap,
): Promise<EmqxDashboardSsoLdapLdap> => {
  return http.post(`/sso/${backend}`, emqxDashboardSsoLdapLdap)
}

export const putSSOBacken = (
  backend: 'ldap',
  emqxDashboardSsoLdapLdap: EmqxDashboardSsoLdapLdap,
): Promise<EmqxDashboardSsoLdapLdap> => {
  return http.put(`/sso/${backend}`, emqxDashboardSsoLdapLdap)
}
