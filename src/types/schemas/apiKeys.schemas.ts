export type PutApiKeyName404Code = (typeof PutApiKeyName404Code)[keyof typeof PutApiKeyName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutApiKeyName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutApiKeyName404 = {
  code?: PutApiKeyName404Code
  message?: string
}

export type PutApiKeyName400Code = (typeof PutApiKeyName400Code)[keyof typeof PutApiKeyName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutApiKeyName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutApiKeyName400 = {
  code?: PutApiKeyName400Code
  message?: string
}

export type PutApiKeyName200Scopes = 'unset' | string[]

export type PutApiKeyName200ExpiredAtOneOf = string | number

export type PutApiKeyName200ExpiredAt = 'infinity' | PutApiKeyName200ExpiredAtOneOf

export type PutApiKeyName200CreatedAt = string | number

export type PutApiKeyName200 = {
  api_key?: string
  created_at?: PutApiKeyName200CreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: PutApiKeyName200ExpiredAt
  name?: string
  namespace?: string
  role?: string
  scopes?: PutApiKeyName200Scopes
}

export type PutApiKeyNameBodyScopes = 'unset' | string[]

export type PutApiKeyNameBodyExpiredAtOneOf = string | number

export type PutApiKeyNameBodyExpiredAt = 'infinity' | PutApiKeyNameBodyExpiredAtOneOf

export type PutApiKeyNameBody = {
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: PutApiKeyNameBodyExpiredAt
  namespace?: string
  role?: string
  scopes?: PutApiKeyNameBodyScopes
}

export type GetApiKeyName404Code = (typeof GetApiKeyName404Code)[keyof typeof GetApiKeyName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetApiKeyName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetApiKeyName404 = {
  code?: GetApiKeyName404Code
  message?: string
}

export type GetApiKeyName200Scopes = 'unset' | string[]

export type GetApiKeyName200ExpiredAtOneOf = string | number

export type GetApiKeyName200ExpiredAt = 'infinity' | GetApiKeyName200ExpiredAtOneOf

export type GetApiKeyName200CreatedAt = string | number

export type GetApiKeyName200 = {
  api_key?: string
  created_at?: GetApiKeyName200CreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: GetApiKeyName200ExpiredAt
  name?: string
  namespace?: string
  role?: string
  scopes?: GetApiKeyName200Scopes
}

export type DeleteApiKeyName404Code =
  (typeof DeleteApiKeyName404Code)[keyof typeof DeleteApiKeyName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteApiKeyName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteApiKeyName404 = {
  code?: DeleteApiKeyName404Code
  message?: string
}

export type PostApiKey403Code = (typeof PostApiKey403Code)[keyof typeof PostApiKey403Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostApiKey403Code = {
  FORBIDDEN: 'FORBIDDEN',
} as const

export type PostApiKey403 = {
  code?: PostApiKey403Code
  message?: string
}

export type PostApiKey400Code = (typeof PostApiKey400Code)[keyof typeof PostApiKey400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostApiKey400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostApiKey400 = {
  code?: PostApiKey400Code
  message?: string
}

export type PostApiKeyBodyScopes = 'unset' | string[]

export type PostApiKeyBody = {
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: PostApiKeyBodyExpiredAt
  name?: string
  namespace?: string
  role?: string
  scopes?: PostApiKeyBodyScopes
}

export type PostApiKeyBodyExpiredAtOneOf = string | number

export type PostApiKeyBodyExpiredAt = 'infinity' | PostApiKeyBodyExpiredAtOneOf

export type GetApiKey200Scopes = 'unset' | string[]

export type GetApiKey200ExpiredAtOneOf = string | number

export type GetApiKey200ExpiredAt = 'infinity' | GetApiKey200ExpiredAtOneOf

export type GetApiKey200CreatedAt = string | number

export type GetApiKey200 = {
  api_key?: string
  created_at?: GetApiKey200CreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: GetApiKey200ExpiredAt
  name?: string
  namespace?: string
  role?: string
  scopes?: GetApiKey200Scopes
}

export interface ApiKeyScopeInfo {
  desc?: string
  name?: string
}

export interface ApiKeyScopesResponse {
  scopes?: ApiKeyScopeInfo[]
}

export type ApiKeyAppResponseScopes = 'unset' | string[]

export type ApiKeyAppResponseExpiredAtOneOf = string | number

export type ApiKeyAppResponseExpiredAt = 'infinity' | ApiKeyAppResponseExpiredAtOneOf

export type ApiKeyAppResponseCreatedAt = string | number

export interface ApiKeyAppResponse {
  api_key?: string
  api_secret?: string
  created_at?: ApiKeyAppResponseCreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: ApiKeyAppResponseExpiredAt
  name?: string
  namespace?: string
  role?: string
  scopes?: ApiKeyAppResponseScopes
}
