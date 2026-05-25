export type PostSsoTokenExchange400Code =
  (typeof PostSsoTokenExchange400Code)[keyof typeof PostSsoTokenExchange400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoTokenExchange400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostSsoTokenExchange400 = {
  code?: PostSsoTokenExchange400Code
  message?: string
}

export type PostSsoTokenExchange200 =
  | DashboardSsoLoginSuccessResponse
  | DashboardSsoMfaSetupResponse
  | DashboardSsoMfaVerifyResponse

export type GetSsoSamlMetadata404Code =
  (typeof GetSsoSamlMetadata404Code)[keyof typeof GetSsoSamlMetadata404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoSamlMetadata404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type GetSsoSamlMetadata404 = {
  code?: GetSsoSamlMetadata404Code
  message?: string
}

export type GetSsoSamlMetadata200LicenseEdition =
  (typeof GetSsoSamlMetadata200LicenseEdition)[keyof typeof GetSsoSamlMetadata200LicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoSamlMetadata200LicenseEdition = {
  enterprise: 'enterprise',
  opensource: 'opensource',
} as const

export type GetSsoSamlMetadata200License = {
  edition?: GetSsoSamlMetadata200LicenseEdition
}

export type GetSsoSamlMetadata200 = {
  license?: GetSsoSamlMetadata200License
  token?: string
  version?: string
}

export type PostSsoSamlAcs404Code =
  (typeof PostSsoSamlAcs404Code)[keyof typeof PostSsoSamlAcs404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoSamlAcs404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type PostSsoSamlAcs404 = {
  code?: PostSsoSamlAcs404Code
  message?: string
}

export type PostSsoSamlAcs401Code =
  (typeof PostSsoSamlAcs401Code)[keyof typeof PostSsoSamlAcs401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoSamlAcs401Code = {
  BAD_USERNAME_OR_PWD: 'BAD_USERNAME_OR_PWD',
} as const

export type PostSsoSamlAcs401 = {
  code?: PostSsoSamlAcs401Code
  message?: string
}

export type PostSsoSamlAcs302Code =
  (typeof PostSsoSamlAcs302Code)[keyof typeof PostSsoSamlAcs302Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoSamlAcs302Code = {
  REDIRECT: 'REDIRECT',
} as const

export type PostSsoSamlAcs302 = {
  code?: PostSsoSamlAcs302Code
  message?: string
}

export type GetSsoRunning200Item = (typeof GetSsoRunning200Item)[keyof typeof GetSsoRunning200Item]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoRunning200Item = {
  ldap: 'ldap',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type GetSsoOidcCallback404Code =
  (typeof GetSsoOidcCallback404Code)[keyof typeof GetSsoOidcCallback404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoOidcCallback404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type GetSsoOidcCallback404 = {
  code?: GetSsoOidcCallback404Code
  message?: string
}

export type GetSsoOidcCallback401Code =
  (typeof GetSsoOidcCallback401Code)[keyof typeof GetSsoOidcCallback401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoOidcCallback401Code = {
  BAD_USERNAME_OR_PWD: 'BAD_USERNAME_OR_PWD',
} as const

export type GetSsoOidcCallback401 = {
  code?: GetSsoOidcCallback401Code
  message?: string
}

export type GetSsoOidcCallback400Code =
  (typeof GetSsoOidcCallback400Code)[keyof typeof GetSsoOidcCallback400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoOidcCallback400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetSsoOidcCallback400 = {
  code?: GetSsoOidcCallback400Code
  message?: string
}

export type GetSsoOidcCallback200LicenseEdition =
  (typeof GetSsoOidcCallback200LicenseEdition)[keyof typeof GetSsoOidcCallback200LicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoOidcCallback200LicenseEdition = {
  enterprise: 'enterprise',
  opensource: 'opensource',
} as const

export type GetSsoOidcCallback200License = {
  edition?: GetSsoOidcCallback200LicenseEdition
}

export type GetSsoOidcCallback200 = {
  license?: GetSsoOidcCallback200License
  token?: string
  version?: string
}

export type PostSsoMfaVerify401Code =
  (typeof PostSsoMfaVerify401Code)[keyof typeof PostSsoMfaVerify401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaVerify401Code = {
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const

export type PostSsoMfaVerify401 = {
  code?: PostSsoMfaVerify401Code
  message?: string
}

export type PostSsoMfaVerify400Code =
  (typeof PostSsoMfaVerify400Code)[keyof typeof PostSsoMfaVerify400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaVerify400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostSsoMfaVerify400 = {
  code?: PostSsoMfaVerify400Code
  message?: string
}

export type PostSsoMfaSetupInfo401Code =
  (typeof PostSsoMfaSetupInfo401Code)[keyof typeof PostSsoMfaSetupInfo401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaSetupInfo401Code = {
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const

export type PostSsoMfaSetupInfo401 = {
  code?: PostSsoMfaSetupInfo401Code
  message?: string
}

export type PostSsoMfaSetup401Code =
  (typeof PostSsoMfaSetup401Code)[keyof typeof PostSsoMfaSetup401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaSetup401Code = {
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const

export type PostSsoMfaSetup401 = {
  code?: PostSsoMfaSetup401Code
  message?: string
}

export type PostSsoMfaSetup400Code =
  (typeof PostSsoMfaSetup400Code)[keyof typeof PostSsoMfaSetup400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaSetup400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostSsoMfaSetup400 = {
  code?: PostSsoMfaSetup400Code
  message?: string
}

export type PostSsoLoginBackend404Code =
  (typeof PostSsoLoginBackend404Code)[keyof typeof PostSsoLoginBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLoginBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type PostSsoLoginBackend404 = {
  code?: PostSsoLoginBackend404Code
  message?: string
}

export type PostSsoLoginBackend401Code =
  (typeof PostSsoLoginBackend401Code)[keyof typeof PostSsoLoginBackend401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLoginBackend401Code = {
  BAD_USERNAME_OR_PWD: 'BAD_USERNAME_OR_PWD',
} as const

export type PostSsoLoginBackend401 = {
  code?: PostSsoLoginBackend401Code
  message?: string
}

export type PostSsoLoginBackend302Code =
  (typeof PostSsoLoginBackend302Code)[keyof typeof PostSsoLoginBackend302Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLoginBackend302Code = {
  REDIRECT: 'REDIRECT',
} as const

export type PostSsoLoginBackend302 = {
  code?: PostSsoLoginBackend302Code
  message?: string
}

export type PostSsoLoginBackend200 =
  | DashboardSsoLoginSuccessResponse
  | DashboardSsoMfaSetupResponse
  | DashboardSsoMfaVerifyResponse

export type PostSsoLoginBackendBody = DashboardLogin | SsoLogin | SsoLogin

export type PutSsoBackend404Code = (typeof PutSsoBackend404Code)[keyof typeof PutSsoBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSsoBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type PutSsoBackend404 = {
  code?: PutSsoBackend404Code
  message?: string
}

export type PutSsoBackend200 = DashboardSaml | SsoLdap | SsoOidc

export type PutSsoBackendBody = DashboardSaml | SsoLdap | SsoOidc

export type GetSsoBackend404Code = (typeof GetSsoBackend404Code)[keyof typeof GetSsoBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type GetSsoBackend404 = {
  code?: GetSsoBackend404Code
  message?: string
}

export type GetSsoBackend200 = DashboardSaml | SsoLdap | SsoOidc

export type DeleteSsoBackend404Code =
  (typeof DeleteSsoBackend404Code)[keyof typeof DeleteSsoBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteSsoBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type DeleteSsoBackend404 = {
  code?: DeleteSsoBackend404Code
  message?: string
}

export type SsoOidcProvider = (typeof SsoOidcProvider)[keyof typeof SsoOidcProvider]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcProvider = {
  generic: 'generic',
  okta: 'okta',
} as const

export type SsoOidcPreferredAuthMethodsItem =
  (typeof SsoOidcPreferredAuthMethodsItem)[keyof typeof SsoOidcPreferredAuthMethodsItem]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcPreferredAuthMethodsItem = {
  client_secret_basic: 'client_secret_basic',
  client_secret_jwt: 'client_secret_jwt',
  client_secret_post: 'client_secret_post',
  none: 'none',
  private_key_jwt: 'private_key_jwt',
} as const

export type SsoOidcNameVarSource = (typeof SsoOidcNameVarSource)[keyof typeof SsoOidcNameVarSource]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcNameVarSource = {
  id_token: 'id_token',
  userinfo: 'userinfo',
} as const

export type SsoOidcClientJwks = SsoClientFileJwks | 'none'

export type SsoOidcBackend = (typeof SsoOidcBackend)[keyof typeof SsoOidcBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcBackend = {
  oidc: 'oidc',
} as const

export interface SsoOidc {
  backend: SsoOidcBackend
  client_jwks?: SsoOidcClientJwks
  clientid: string
  dashboard_addr?: string
  enable?: boolean
  fallback_methods?: string[]
  force_mfa?: boolean
  issuer: string
  name_var?: string
  name_var_source?: SsoOidcNameVarSource
  preferred_auth_methods?: SsoOidcPreferredAuthMethodsItem[]
  provider?: SsoOidcProvider
  require_pkce?: boolean
  scopes?: string[]
  secret: string
  session_expiry?: string
  ssl?: EmqxSslClientOpts
}

export type SsoLoginBackend = (typeof SsoLoginBackend)[keyof typeof SsoLoginBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoLoginBackend = {
  oidc: 'oidc',
} as const

export interface SsoLogin {
  backend: SsoLoginBackend
}

export type SsoLdapBackend = (typeof SsoLdapBackend)[keyof typeof SsoLdapBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoLdapBackend = {
  ldap: 'ldap',
} as const

export type SsoClientFileJwksType =
  (typeof SsoClientFileJwksType)[keyof typeof SsoClientFileJwksType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoClientFileJwksType = {
  file: 'file',
} as const

export interface SsoClientFileJwks {
  file: string
  type: SsoClientFileJwksType
}

export type LdapSslVerify = (typeof LdapSslVerify)[keyof typeof LdapSslVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslVerify = {
  verify_none: 'verify_none',
  verify_peer: 'verify_peer',
} as const

export type LdapSslServerNameIndication = string | 'disable'

export type LdapSslPartialChain = (typeof LdapSslPartialChain)[keyof typeof LdapSslPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslPartialChain = {
  cacert_from_cacertfile: 'cacert_from_cacertfile',
  false: false,
  true: true,
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
} as const

export type LdapSslLogLevel = (typeof LdapSslLogLevel)[keyof typeof LdapSslLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslLogLevel = {
  alert: 'alert',
  all: 'all',
  critical: 'critical',
  debug: 'debug',
  emergency: 'emergency',
  error: 'error',
  info: 'info',
  none: 'none',
  notice: 'notice',
  warning: 'warning',
} as const

export interface LdapSsl {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  /** @minimum 0 */
  depth?: number
  enable?: boolean
  hibernate_after?: string
  keyfile?: string
  log_level?: LdapSslLogLevel
  managed_certs?: EmqxManagedCerts
  middlebox_comp_mode?: boolean
  partial_chain?: LdapSslPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  server_name_indication?: LdapSslServerNameIndication
  verify?: LdapSslVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export interface SsoLdap {
  backend: SsoLdapBackend
  base_dn: string
  enable?: boolean
  filter?: string
  force_mfa?: boolean
  password?: string
  /** @minimum 1 */
  pool_size?: number
  query_timeout?: string
  request_timeout?: string
  server: string
  ssl?: LdapSsl
  username: string
}

export type EmqxSslClientOptsVerify =
  (typeof EmqxSslClientOptsVerify)[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_none: 'verify_none',
  verify_peer: 'verify_peer',
} as const

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

export type EmqxSslClientOptsPartialChain =
  (typeof EmqxSslClientOptsPartialChain)[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  cacert_from_cacertfile: 'cacert_from_cacertfile',
  false: false,
  true: true,
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
} as const

export type EmqxSslClientOptsLogLevel =
  (typeof EmqxSslClientOptsLogLevel)[keyof typeof EmqxSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsLogLevel = {
  alert: 'alert',
  all: 'all',
  critical: 'critical',
  debug: 'debug',
  emergency: 'emergency',
  error: 'error',
  info: 'info',
  none: 'none',
  notice: 'notice',
  warning: 'warning',
} as const

export interface EmqxManagedCerts {
  bundle_name: string
  namespace?: string
}

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  /** @minimum 0 */
  depth?: number
  enable?: boolean
  hibernate_after?: string
  keyfile?: string
  log_level?: EmqxSslClientOptsLogLevel
  managed_certs?: EmqxManagedCerts
  middlebox_comp_mode?: boolean
  partial_chain?: EmqxSslClientOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
  verify?: EmqxSslClientOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export type DashboardSamlBackend = (typeof DashboardSamlBackend)[keyof typeof DashboardSamlBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSamlBackend = {
  saml: 'saml',
} as const

export interface DashboardSaml {
  backend: DashboardSamlBackend
  dashboard_addr?: string
  enable?: boolean
  force_mfa?: boolean
  idp_metadata_url?: string
  idp_signs_assertions?: boolean
  idp_signs_envelopes?: boolean
  sp_private_key?: string
  sp_public_key?: string
  sp_sign_request?: boolean
}

export type DashboardLoginBackend =
  (typeof DashboardLoginBackend)[keyof typeof DashboardLoginBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardLoginBackend = {
  saml: 'saml',
} as const

export interface DashboardLogin {
  backend: DashboardLoginBackend
}

export interface DashboardSsoTokenExchangeRequest {
  backend: string
  code: string
  username: string
}

export interface DashboardSsoMfaVerifyResponse {
  action?: string
  backend?: string
  username?: string
  verify_token?: string
}

export interface DashboardSsoMfaSetupResponse {
  action?: string
  backend?: string
  mechanism?: string
  setup_token?: string
  username?: string
}

export type DashboardSsoLoginSuccessResponseLicenseEdition =
  (typeof DashboardSsoLoginSuccessResponseLicenseEdition)[keyof typeof DashboardSsoLoginSuccessResponseLicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSsoLoginSuccessResponseLicenseEdition = {
  enterprise: 'enterprise',
  opensource: 'opensource',
} as const

export type DashboardSsoLoginSuccessResponseLicense = {
  edition?: DashboardSsoLoginSuccessResponseLicenseEdition
}

export interface DashboardSsoLoginSuccessResponse {
  backend?: string
  license?: DashboardSsoLoginSuccessResponseLicense
  role?: string
  token?: string
  username?: string
  version?: string
}

export type DashboardSsoBackendStatusBackend =
  (typeof DashboardSsoBackendStatusBackend)[keyof typeof DashboardSsoBackendStatusBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSsoBackendStatusBackend = {
  ldap: 'ldap',
  oidc: 'oidc',
  saml: 'saml',
} as const

export interface DashboardSsoBackendStatus {
  backend: DashboardSsoBackendStatusBackend
  enable?: boolean
  force_mfa?: boolean
  last_error?: string
  running?: boolean
}

export interface DashboardSsoMfaMfaVerifyRequest {
  backend: string
  totp_code: string
  username: string
  verify_token: string
}

export interface DashboardSsoMfaMfaSetupRequest {
  backend: string
  setup_token: string
  totp_code: string
  username: string
}

export interface DashboardSsoMfaMfaSetupInfoResponse {
  mechanism: string
  secret: string
}

export interface DashboardSsoMfaMfaSetupInfoRequest {
  backend: string
  setup_token: string
  username: string
}
