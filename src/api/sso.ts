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
  backend: 'ldap' | 'saml',
  emqxDashboardSsoLdapLogin: PostSsoLoginBackendBody,
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

export type SSOTokenExchangeResult =
  | {
      token: string
      username: string
      role: string
      backend: string
      version: string
      license: any
    }
  | {
      action: 'mfa_setup'
      setup_token: string
      mechanism: string
      username: string
      backend: string
    }
  | { action: 'mfa_verify'; verify_token: string; username: string; backend: string }

export const postSSOTokenExchange = (code: string): Promise<SSOTokenExchangeResult> => {
  return http.post(`/sso/token_exchange`, { code })
}

export const postSSOmfaSetupInfo = (
  setup_token: string,
): Promise<{ secret: string; mechanism: string }> => {
  return http.post(`/sso/mfa/setup_info`, { setup_token })
}

export const postSSOmfaSetup = (setup_token: string, totp_code: string): Promise<any> => {
  return http.post(`/sso/mfa/setup`, { setup_token, totp_code })
}

export const postSSOmfaVerify = (verify_token: string, totp_code: string): Promise<any> => {
  return http.post(`/sso/mfa/verify`, { verify_token, totp_code })
}
