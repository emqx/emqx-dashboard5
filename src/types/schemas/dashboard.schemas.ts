export type PostLogout401Code = (typeof PostLogout401Code)[keyof typeof PostLogout401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLogout401Code = {
  BAD_USERNAME_OR_PWD: 'BAD_USERNAME_OR_PWD',
} as const

export type PostLogout401 = {
  code?: PostLogout401Code
  message?: string
}

export type PostLogoutBody = {
  /** @maxLength 100 */
  username?: string
}

export type PostLogoutBackend = (typeof PostLogoutBackend)[keyof typeof PostLogoutBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLogoutBackend = {
  local: 'local',
  ldap: 'ldap',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type PostLogoutParams = {
  backend?: PostLogoutBackend
}

export type PostUsersUsernameChangePwd404Code =
  (typeof PostUsersUsernameChangePwd404Code)[keyof typeof PostUsersUsernameChangePwd404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostUsersUsernameChangePwd404Code = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const

export type PostUsersUsernameChangePwd404 = {
  code?: PostUsersUsernameChangePwd404Code
  message?: string
}

export type PostUsersUsernameChangePwd400Code =
  (typeof PostUsersUsernameChangePwd400Code)[keyof typeof PostUsersUsernameChangePwd400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostUsersUsernameChangePwd400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  ERROR_PWD_NOT_MATCH: 'ERROR_PWD_NOT_MATCH',
} as const

export type PostUsersUsernameChangePwd400 = {
  code?: PostUsersUsernameChangePwd400Code
  message?: string
}

export type PostUsersUsernameChangePwdBody = {
  new_pwd?: string
  old_pwd?: string
}

export type DeleteUsersUsername404Code =
  (typeof DeleteUsersUsername404Code)[keyof typeof DeleteUsersUsername404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteUsersUsername404Code = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const

export type DeleteUsersUsername404 = {
  code?: DeleteUsersUsername404Code
  message?: string
}

export type DeleteUsersUsername400Code =
  (typeof DeleteUsersUsername400Code)[keyof typeof DeleteUsersUsername400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteUsersUsername400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_ALLOWED: 'NOT_ALLOWED',
} as const

export type DeleteUsersUsername400 = {
  code?: DeleteUsersUsername400Code
  message?: string
}

export type DeleteUsersUsernameBackend =
  (typeof DeleteUsersUsernameBackend)[keyof typeof DeleteUsersUsernameBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteUsersUsernameBackend = {
  local: 'local',
  ldap: 'ldap',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type DeleteUsersUsernameParams = {
  backend?: DeleteUsersUsernameBackend
}

export type PutUsersUsername404Code =
  (typeof PutUsersUsername404Code)[keyof typeof PutUsersUsername404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutUsersUsername404Code = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const

export type PutUsersUsername404 = {
  code?: PutUsersUsername404Code
  message?: string
}

export type PutUsersUsername200 = {
  backend?: string
  description?: string
  role?: string
  /** @maxLength 100 */
  username?: string
}

export type PutUsersUsernameBody = {
  description?: string
  role?: string
}

export type PutUsersUsernameBackend =
  (typeof PutUsersUsernameBackend)[keyof typeof PutUsersUsernameBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutUsersUsernameBackend = {
  local: 'local',
  ldap: 'ldap',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type PutUsersUsernameParams = {
  backend?: PutUsersUsernameBackend
}

export type PostLogin401Code = (typeof PostLogin401Code)[keyof typeof PostLogin401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLogin401Code = {
  BAD_USERNAME_OR_PWD: 'BAD_USERNAME_OR_PWD',
} as const

export type PostLogin401 = {
  code?: PostLogin401Code
  message?: string
}

export type PostLogin200LicenseEdition =
  (typeof PostLogin200LicenseEdition)[keyof typeof PostLogin200LicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLogin200LicenseEdition = {
  opensource: 'opensource',
  enterprise: 'enterprise',
} as const

export type PostLogin200License = {
  edition?: PostLogin200LicenseEdition
}

export type PostLogin200 = {
  license?: PostLogin200License
  password_expire_in_seconds?: number
  role?: string
  token?: string
  version?: string
  secret?: string
  method?: string
}

export type PostLoginBody = MfaTotpSecondLogin | DashboardLogin

export type PostUsersUsernameSetupMfa404Code =
  (typeof PostUsersUsernameSetupMfa404Code)[keyof typeof PostUsersUsernameSetupMfa404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostUsersUsernameSetupMfa404Code = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const

export type PostUsersUsernameSetupMfa404 = {
  code?: PostUsersUsernameSetupMfa404Code
  message?: string
}

export type PostUsersUsernameSetupMfa400Code =
  (typeof PostUsersUsernameSetupMfa400Code)[keyof typeof PostUsersUsernameSetupMfa400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostUsersUsernameSetupMfa400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostUsersUsernameSetupMfa400 = {
  code?: PostUsersUsernameSetupMfa400Code
  message?: string
}

export type PostUsers200 = {
  backend?: string
  description?: string
  role?: string
  /** @maxLength 100 */
  username?: string
}

export type PostUsersBody = {
  description?: string
  /** @maxLength 100 */
  password?: string
  role?: string
  /** @maxLength 100 */
  username?: string
}

export type PostMfa400Code = (typeof PostMfa400Code)[keyof typeof PostMfa400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMfa400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMfa400 = {
  code?: PostMfa400Code
  message?: string
}

export type MfaTotpSetupRespMethod =
  (typeof MfaTotpSetupRespMethod)[keyof typeof MfaTotpSetupRespMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MfaTotpSetupRespMethod = {
  totp: 'totp',
} as const

export interface MfaTotpSetupResp {
  method: MfaTotpSetupRespMethod
  secret: string
}

export type MfaTotpSetupMethod = (typeof MfaTotpSetupMethod)[keyof typeof MfaTotpSetupMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MfaTotpSetupMethod = {
  totp: 'totp',
} as const

export interface MfaTotpSetup {
  method: MfaTotpSetupMethod
  /** @maxLength 100 */
  password?: string
}

export type MfaTotpSecondLoginMethod =
  (typeof MfaTotpSecondLoginMethod)[keyof typeof MfaTotpSecondLoginMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MfaTotpSecondLoginMethod = {
  totp: 'totp',
} as const

export interface MfaTotpSecondLogin {
  code: string
  method: MfaTotpSecondLoginMethod
  token?: string
}

export type MfaTotpFirstLoginRespMethod =
  (typeof MfaTotpFirstLoginRespMethod)[keyof typeof MfaTotpFirstLoginRespMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MfaTotpFirstLoginRespMethod = {
  totp: 'totp',
} as const

export interface MfaTotpFirstLoginResp {
  method: MfaTotpFirstLoginRespMethod
  secret?: string
  token?: string
}

export type MfaTotpApiConfigMethod =
  (typeof MfaTotpApiConfigMethod)[keyof typeof MfaTotpApiConfigMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MfaTotpApiConfigMethod = {
  totp: 'totp',
} as const

export interface MfaTotpApiConfig {
  enable?: boolean
  interval_length?: number
  method: MfaTotpApiConfigMethod
  token_length?: number
}

export interface DashboardUser {
  backend?: string
  description?: string
  role?: string
  /** @maxLength 100 */
  username?: string
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
