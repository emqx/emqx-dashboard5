import http from '@/common/http'
import type {
  DashboardSsoBackendStatus,
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

export const postSSOLogin = (
  emqxDashboardSsoLdapLogin: EmqxDashboardSsoLdapLogin,
): Promise<PostSsoLogin200> => {
  return http.post(`/sso/login`, emqxDashboardSsoLdapLogin)
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
