export type PutSsoBackend404Code = typeof PutSsoBackend404Code[keyof typeof PutSsoBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutSsoBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type PutSsoBackend404 = {
  code?: PutSsoBackend404Code
  message?: string
}

export type GetSsoBackend404Code = typeof GetSsoBackend404Code[keyof typeof GetSsoBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type GetSsoBackend404 = {
  code?: GetSsoBackend404Code
  message?: string
}

export type DeleteSsoBackend404Code =
  typeof DeleteSsoBackend404Code[keyof typeof DeleteSsoBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteSsoBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type DeleteSsoBackend404 = {
  code?: DeleteSsoBackend404Code
  message?: string
}

export type PostSsoLoginBackend404Code =
  typeof PostSsoLoginBackend404Code[keyof typeof PostSsoLoginBackend404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLoginBackend404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type PostSsoLoginBackend404 = {
  code?: PostSsoLoginBackend404Code
  message?: string
}

export type PostSsoLoginBackend401Code =
  typeof PostSsoLoginBackend401Code[keyof typeof PostSsoLoginBackend401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLoginBackend401Code = {
  BAD_USERNAME_OR_PWD: 'BAD_USERNAME_OR_PWD',
} as const

export type PostSsoLoginBackend401 = {
  code?: PostSsoLoginBackend401Code
  message?: string
}

export type PostSsoLoginBackend200LicenseEdition =
  typeof PostSsoLoginBackend200LicenseEdition[keyof typeof PostSsoLoginBackend200LicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLoginBackend200LicenseEdition = {
  opensource: 'opensource',
  enterprise: 'enterprise',
} as const

export type PostSsoLoginBackend200License = {
  edition?: PostSsoLoginBackend200LicenseEdition
}

export type PostSsoLoginBackend200 = {
  token?: string
  version?: string
  license?: PostSsoLoginBackend200License
}

export type EmqxLdapSslServerNameIndication = string | 'disable'

export type EmqxLdapSslLogLevel = typeof EmqxLdapSslLogLevel[keyof typeof EmqxLdapSslLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLdapSslLogLevel = {
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

export type EmqxLdapSslVerify = typeof EmqxLdapSslVerify[keyof typeof EmqxLdapSslVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLdapSslVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxLdapSsl {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxLdapSslVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxLdapSslLogLevel
  hibernate_after?: string
  enable?: boolean
  server_name_indication?: EmqxLdapSslServerNameIndication
}

export type EmqxDashboardSsoLdapLoginBackend =
  typeof EmqxDashboardSsoLdapLoginBackend[keyof typeof EmqxDashboardSsoLdapLoginBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDashboardSsoLdapLoginBackend = {
  ldap: 'ldap',
} as const

export interface EmqxDashboardSsoLdapLogin {
  backend: EmqxDashboardSsoLdapLoginBackend
  username?: string
  password?: string
}

export type EmqxDashboardSsoLdapLdapBackend =
  typeof EmqxDashboardSsoLdapLdapBackend[keyof typeof EmqxDashboardSsoLdapLdapBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDashboardSsoLdapLdapBackend = {
  ldap: 'ldap',
} as const

export interface EmqxDashboardSsoLdapLdap {
  enable?: boolean
  backend: EmqxDashboardSsoLdapLdapBackend
  query_timeout?: string
  server: string
  pool_size?: number
  username: string
  password?: string
  base_dn: string
  filter?: string
  request_timeout?: string
  ssl?: EmqxLdapSsl
}

export type DashboardSsoBackendStatusBackend =
  typeof DashboardSsoBackendStatusBackend[keyof typeof DashboardSsoBackendStatusBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSsoBackendStatusBackend = {
  ldap: 'ldap',
} as const

export interface DashboardSsoBackendStatus {
  enable?: boolean
  backend: DashboardSsoBackendStatusBackend
}
