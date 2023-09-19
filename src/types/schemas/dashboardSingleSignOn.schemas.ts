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

export type PostSsoLogin404Code = typeof PostSsoLogin404Code[keyof typeof PostSsoLogin404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLogin404Code = {
  BACKEND_NOT_FOUND: 'BACKEND_NOT_FOUND',
} as const

export type PostSsoLogin404 = {
  code?: PostSsoLogin404Code
  message?: string
}

export type PostSsoLogin401Code = typeof PostSsoLogin401Code[keyof typeof PostSsoLogin401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLogin401Code = {
  BAD_USERNAME_OR_PWD: 'BAD_USERNAME_OR_PWD',
} as const

export type PostSsoLogin401 = {
  code?: PostSsoLogin401Code
  message?: string
}

export type PostSsoLogin200LicenseEdition =
  typeof PostSsoLogin200LicenseEdition[keyof typeof PostSsoLogin200LicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoLogin200LicenseEdition = {
  opensource: 'opensource',
  enterprise: 'enterprise',
} as const

export type PostSsoLogin200License = {
  edition?: PostSsoLogin200LicenseEdition
}

export type PostSsoLogin200 = {
  token?: string
  version?: string
  license?: PostSsoLogin200License
}

export type GetSsoRunning200Item = typeof GetSsoRunning200Item[keyof typeof GetSsoRunning200Item]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSsoRunning200Item = {
  ldap: 'ldap',
} as const

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
  ssl?: BrokerSslClientOpts
  bind_password?: string
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

export type BrokerSslClientOptsServerNameIndication = string | 'disable'

export type BrokerSslClientOptsLogLevel =
  typeof BrokerSslClientOptsLogLevel[keyof typeof BrokerSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerSslClientOptsLogLevel = {
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

export type BrokerSslClientOptsVerify =
  typeof BrokerSslClientOptsVerify[keyof typeof BrokerSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BrokerSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface BrokerSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: BrokerSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: BrokerSslClientOptsLogLevel
  hibernate_after?: string
  enable?: boolean
  server_name_indication?: BrokerSslClientOptsServerNameIndication
}
