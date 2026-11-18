import type { SSOBackend } from './typeAlias'

export interface SSOBackendStatus {
  backend: SSOBackend
  enable?: boolean
  last_error?: string
  running?: boolean
}

export interface LDAPLoginRequest {
  backend: 'ldap'
  username: string
  password: string
}
