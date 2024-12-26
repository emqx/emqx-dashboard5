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
  username?: string
}

export type PostLogoutBackend = (typeof PostLogoutBackend)[keyof typeof PostLogoutBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLogoutBackend = {
  local: 'local',
  ldap: 'ldap',
  saml: 'saml',
  oidc: 'oidc',
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
  old_pwd?: string
  new_pwd?: string
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
  saml: 'saml',
  oidc: 'oidc',
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
  username?: string
  role?: string
  description?: string
  backend?: string
}

export type PutUsersUsernameBody = {
  role?: string
  description?: string
}

export type PutUsersUsernameBackend =
  (typeof PutUsersUsernameBackend)[keyof typeof PutUsersUsernameBackend]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutUsersUsernameBackend = {
  local: 'local',
  ldap: 'ldap',
  saml: 'saml',
  oidc: 'oidc',
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
  role?: string
  token?: string
  version?: string
  license?: PostLogin200License
}

export type PostLoginBody = {
  username?: string
  password?: string
}

export type PostUsers200 = {
  username?: string
  role?: string
  description?: string
  backend?: string
}

export type PostUsersBody = {
  username?: string
  password?: string
  role?: string
  description?: string
}

export interface DashboardUser {
  username?: string
  role?: string
  description?: string
  backend?: string
}
