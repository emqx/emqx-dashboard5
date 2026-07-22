export type PostUsersUsernameMfa404Code =
  (typeof PostUsersUsernameMfa404Code)[keyof typeof PostUsersUsernameMfa404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostUsersUsernameMfa404Code = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const

export type PostUsersUsernameMfa404 = {
  code?: PostUsersUsernameMfa404Code
  message?: string
}

export type PostUsersUsernameMfaBodyMechanism =
  (typeof PostUsersUsernameMfaBodyMechanism)[keyof typeof PostUsersUsernameMfaBodyMechanism]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostUsersUsernameMfaBodyMechanism = {
  totp: 'totp',
} as const

export type PostUsersUsernameMfaBody = {
  mechanism: PostUsersUsernameMfaBodyMechanism
}

export type PostUsersUsernameMfaBackend =
  (typeof PostUsersUsernameMfaBackend)[keyof typeof PostUsersUsernameMfaBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostUsersUsernameMfaBackend = {
  ldap: 'ldap',
  local: 'local',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type PostUsersUsernameMfaParams = {
  backend?: PostUsersUsernameMfaBackend
}

export type DeleteUsersUsernameMfa404Code =
  (typeof DeleteUsersUsernameMfa404Code)[keyof typeof DeleteUsersUsernameMfa404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteUsersUsernameMfa404Code = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
} as const

export type DeleteUsersUsernameMfa404 = {
  code?: DeleteUsersUsernameMfa404Code
  message?: string
}

export type DeleteUsersUsernameMfaBackend =
  (typeof DeleteUsersUsernameMfaBackend)[keyof typeof DeleteUsersUsernameMfaBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteUsersUsernameMfaBackend = {
  ldap: 'ldap',
  local: 'local',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type DeleteUsersUsernameMfaParams = {
  backend?: DeleteUsersUsernameMfaBackend
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

export type PutUsersUsername400Code =
  (typeof PutUsersUsername400Code)[keyof typeof PutUsersUsername400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutUsersUsername400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_ALLOWED: 'NOT_ALLOWED',
} as const

export type PutUsersUsername400 = {
  code?: PutUsersUsername400Code
  message?: string
}

export type PutUsersUsername200Scopes = 'unset' | string[]

export type PutUsersUsername200Mfa =
  (typeof PutUsersUsername200Mfa)[keyof typeof PutUsersUsername200Mfa]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutUsersUsername200Mfa = {
  disabled: 'disabled',
  none: 'none',
  totp: 'totp',
} as const

export type PutUsersUsername200 = {
  backend?: string
  description?: string
  mfa?: PutUsersUsername200Mfa
  role?: string
  scopes?: PutUsersUsername200Scopes
  /** @maxLength 100 */
  username?: string
}

export type PutUsersUsernameBody = {
  description?: string
  role?: string
  scopes?: string[]
}

export type PutUsersUsernameBackend =
  (typeof PutUsersUsernameBackend)[keyof typeof PutUsersUsernameBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutUsersUsernameBackend = {
  ldap: 'ldap',
  local: 'local',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type PutUsersUsernameParams = {
  backend?: PutUsersUsernameBackend
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
  ldap: 'ldap',
  local: 'local',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type DeleteUsersUsernameParams = {
  backend?: DeleteUsersUsernameBackend
}

export type PostUsers200Scopes = 'unset' | string[]

export type PostUsers200Mfa = (typeof PostUsers200Mfa)[keyof typeof PostUsers200Mfa]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostUsers200Mfa = {
  disabled: 'disabled',
  none: 'none',
  totp: 'totp',
} as const

export type PostUsers200 = {
  backend?: string
  description?: string
  mfa?: PostUsers200Mfa
  role?: string
  scopes?: PostUsers200Scopes
  /** @maxLength 100 */
  username?: string
}

export type PostUsersBody = {
  description?: string
  /** @maxLength 100 */
  password?: string
  role?: string
  scopes?: string[]
  /** @maxLength 100 */
  username?: string
}

export type GetUserScopes200 = { [key: string]: unknown }

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
  ldap: 'ldap',
  local: 'local',
  oidc: 'oidc',
  saml: 'saml',
} as const

export type PostLogoutParams = {
  backend?: PostLogoutBackend
}

export type PostLogin401Code = (typeof PostLogin401Code)[keyof typeof PostLogin401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLogin401Code = {
  BAD_MFA_TOKEN: 'BAD_MFA_TOKEN',
  BAD_USERNAME_OR_PWD: 'BAD_USERNAME_OR_PWD',
  LOGIN_LOCKED: 'LOGIN_LOCKED',
} as const

export type PostLogin401 = {
  code?: PostLogin401Code
  message?: string
}

export type PostLogin200LicenseEdition =
  (typeof PostLogin200LicenseEdition)[keyof typeof PostLogin200LicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLogin200LicenseEdition = {
  enterprise: 'enterprise',
  opensource: 'opensource',
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
}

export type PostLoginBody = {
  /** @maxLength 9 */
  mfa_token?: string
  /** @maxLength 100 */
  password?: string
  /** @maxLength 100 */
  username?: string
}

export type DashboardUserScopes = 'unset' | string[]

export type DashboardUserMfa = (typeof DashboardUserMfa)[keyof typeof DashboardUserMfa]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardUserMfa = {
  disabled: 'disabled',
  none: 'none',
  totp: 'totp',
} as const

export interface DashboardUser {
  backend?: string
  description?: string
  mfa?: DashboardUserMfa
  role?: string
  scopes?: DashboardUserScopes
  /** @maxLength 100 */
  username?: string
}
