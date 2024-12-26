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

export type PutSsoBackend404Code = (typeof PutSsoBackend404Code)[keyof typeof PutSsoBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSsoBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type PutSsoBackend404 = {
  code?: PutSsoBackend404Code
  message?: string
}

export type PutSsoBackend200 = SsoOidc | DashboardSaml | SsoLdap

export type PutSsoBackendBody = SsoOidc | DashboardSaml | SsoLdap

export type GetSsoBackend404Code = (typeof GetSsoBackend404Code)[keyof typeof GetSsoBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type GetSsoBackend404 = {
  code?: GetSsoBackend404Code
  message?: string
}

export type GetSsoBackend200 = SsoOidc | DashboardSaml | SsoLdap

export type GetSsoRunning200Item = (typeof GetSsoRunning200Item)[keyof typeof GetSsoRunning200Item]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoRunning200Item = {
  ldap: 'ldap',
  saml: 'saml',
  oidc: 'oidc',
} as const

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

export type PostSsoLoginBackend200LicenseEdition =
  (typeof PostSsoLoginBackend200LicenseEdition)[keyof typeof PostSsoLoginBackend200LicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLoginBackend200LicenseEdition = {
  opensource: 'opensource',
  enterprise: 'enterprise',
} as const

export type PostSsoLoginBackend200License = {
  edition?: PostSsoLoginBackend200LicenseEdition
}

export type PostSsoLoginBackend200 = {
  role?: string
  token?: string
  version?: string
  license?: PostSsoLoginBackend200License
}

export type PostSsoLoginBackendBody = SsoLogin | DashboardLogin | SsoLogin

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
  opensource: 'opensource',
  enterprise: 'enterprise',
} as const

export type GetSsoSamlMetadata200License = {
  edition?: GetSsoSamlMetadata200LicenseEdition
}

export type GetSsoSamlMetadata200 = {
  token?: string
  version?: string
  license?: GetSsoSamlMetadata200License
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
  opensource: 'opensource',
  enterprise: 'enterprise',
} as const

export type GetSsoOidcCallback200License = {
  edition?: GetSsoOidcCallback200LicenseEdition
}

export type GetSsoOidcCallback200 = {
  token?: string
  version?: string
  license?: GetSsoOidcCallback200License
}

export type SsoOidcClientJwks = SsoClientFileJwks | 'none'

export type SsoOidcProvider = (typeof SsoOidcProvider)[keyof typeof SsoOidcProvider]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcProvider = {
  okta: 'okta',
  generic: 'generic',
} as const

export type SsoOidcPreferredAuthMethodsItem =
  (typeof SsoOidcPreferredAuthMethodsItem)[keyof typeof SsoOidcPreferredAuthMethodsItem]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcPreferredAuthMethodsItem = {
  private_key_jwt: 'private_key_jwt',
  client_secret_jwt: 'client_secret_jwt',
  client_secret_post: 'client_secret_post',
  client_secret_basic: 'client_secret_basic',
  none: 'none',
} as const

export type SsoOidcBackend = (typeof SsoOidcBackend)[keyof typeof SsoOidcBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SsoOidcBackend = {
  oidc: 'oidc',
} as const

export interface SsoOidc {
  enable?: boolean
  backend: SsoOidcBackend
  issuer: string
  clientid: string
  secret: string
  scopes?: string[]
  name_var?: string
  dashboard_addr?: string
  session_expiry?: string
  require_pkce?: boolean
  preferred_auth_methods?: SsoOidcPreferredAuthMethodsItem[]
  provider?: SsoOidcProvider
  fallback_methods?: string[]
  client_jwks?: SsoOidcClientJwks
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
  type: SsoClientFileJwksType
  file: string
}

export type LdapSslServerNameIndication = string | 'disable'

export type LdapSslPartialChain = (typeof LdapSslPartialChain)[keyof typeof LdapSslPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type LdapSslLogLevel = (typeof LdapSslLogLevel)[keyof typeof LdapSslLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslLogLevel = {
  emergency: 'emergency',
  alert: 'alert',
  critical: 'critical',
  error: 'error',
  warning: 'warning',
  notice: 'notice',
  info: 'info',
  debug: 'debug',
  none: 'none',
  all: 'all',
} as const

export type LdapSslVerify = (typeof LdapSslVerify)[keyof typeof LdapSslVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface LdapSsl {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: LdapSslVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: LdapSslLogLevel
  hibernate_after?: string
  partial_chain?: LdapSslPartialChain
  verify_peer_ext_key_usage?: string
  enable?: boolean
  server_name_indication?: LdapSslServerNameIndication
}

export interface SsoLdap {
  enable?: boolean
  backend: SsoLdapBackend
  query_timeout?: string
  server: string
  pool_size?: number
  username: string
  password?: string
  base_dn: string
  filter?: string
  request_timeout?: string
  ssl?: LdapSsl
}

export type DashboardSamlBackend = (typeof DashboardSamlBackend)[keyof typeof DashboardSamlBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSamlBackend = {
  saml: 'saml',
} as const

export interface DashboardSaml {
  enable?: boolean
  backend: DashboardSamlBackend
  dashboard_addr?: string
  idp_metadata_url?: string
  sp_sign_request?: boolean
  sp_public_key?: string
  sp_private_key?: string
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

export type DashboardSsoBackendStatusBackend =
  (typeof DashboardSsoBackendStatusBackend)[keyof typeof DashboardSsoBackendStatusBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSsoBackendStatusBackend = {
  ldap: 'ldap',
  saml: 'saml',
  oidc: 'oidc',
} as const

export interface DashboardSsoBackendStatus {
  enable?: boolean
  backend: DashboardSsoBackendStatusBackend
  running?: boolean
  last_error?: string
}
