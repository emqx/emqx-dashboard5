import http from '@/common/http'
import type {
  SSOLoginSuccessResponse,
  SSOMFASetupInfoRequest,
  SSOMFASetupInfoResponse,
  SSOMFASetupRequest,
  SSOMFAVerifyRequest,
  SSOBackend,
  SSOConfig,
} from '@/types/typeAlias'
import type { LDAPLoginRequest, SSOBackendStatus } from '@/types/sso'

export const getSSOList = (): Promise<SSOBackendStatus[]> => {
  return http.get('/sso')
}

export const postSSOLogin = (
  backend: 'ldap' | 'saml',
  emqxDashboardSsoLdapLogin: LDAPLoginRequest | { backend: 'saml' },
): Promise<SSOLoginResult> => {
  return http.post(`/sso/login/${backend}`, emqxDashboardSsoLdapLogin)
}

export const getSSORunning = (): Promise<SSOBackend[]> => {
  return http.get('/sso/running')
}

export const getSSOBackend = (backend: SSOBackend): Promise<SSOConfig> => {
  return http.get(`/sso/${backend}`)
}

export const putSSOBackend = (
  backend: SSOBackend,
  emqxDashboardSsoLdapLdap: SSOConfig,
): Promise<SSOConfig> => {
  return http.put(`/sso/${backend}`, emqxDashboardSsoLdapLdap)
}

export type SSOTokenExchangeResult =
  | Required<SSOLoginSuccessResponse>
  | {
      action: 'mfa_setup'
      setup_token: string
      mechanism: string
      username: string
      backend: string
    }
  | { action: 'mfa_verify'; verify_token: string; username: string; backend: string }

export type SSOLoginResult =
  | SSOLoginSuccessResponse
  | Extract<SSOTokenExchangeResult, { action: string }>

export const postSSOTokenExchange = (
  code: string,
  username: string,
  backend: string,
): Promise<SSOTokenExchangeResult> => {
  return http.post(`/sso/token_exchange`, { code, username, backend })
}

export const postSSOmfaSetupInfo = (
  setup_token: string,
  username: string,
  backend: string,
): Promise<SSOMFASetupInfoResponse> => {
  return http.post(`/sso/mfa/setup_info`, {
    setup_token,
    username,
    backend,
  } satisfies SSOMFASetupInfoRequest)
}

export const postSSOmfaSetup = (
  setup_token: string,
  totp_code: string,
  username: string,
  backend: string,
): Promise<SSOLoginSuccessResponse> => {
  return http.post(`/sso/mfa/setup`, {
    setup_token,
    totp_code,
    username,
    backend,
  } satisfies SSOMFASetupRequest)
}

export const postSSOmfaVerify = (
  verify_token: string,
  totp_code: string,
  username: string,
  backend: string,
): Promise<SSOLoginSuccessResponse> => {
  return http.post(`/sso/mfa/verify`, {
    verify_token,
    totp_code,
    username,
    backend,
  } satisfies SSOMFAVerifyRequest)
}
