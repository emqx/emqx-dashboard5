export type PutApiKeyName404Code = (typeof PutApiKeyName404Code)[keyof typeof PutApiKeyName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutApiKeyName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutApiKeyName404 = {
  code?: PutApiKeyName404Code
  message?: string
}

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
  role?: string
}

export type PutApiKeyNameBodyExpiredAtOneOf = string | number

export type PutApiKeyNameBodyExpiredAt = 'infinity' | PutApiKeyNameBodyExpiredAtOneOf

export type PutApiKeyNameBody = {
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: PutApiKeyNameBodyExpiredAt
  role?: string
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
  role?: string
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

export type PostApiKey400Code = (typeof PostApiKey400Code)[keyof typeof PostApiKey400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostApiKey400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostApiKey400 = {
  code?: PostApiKey400Code
  message?: string
}

export type PostApiKeyBodyExpiredAtOneOf = string | number

export type PostApiKeyBodyExpiredAt = 'infinity' | PostApiKeyBodyExpiredAtOneOf

export type PostApiKeyBody = {
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: PostApiKeyBodyExpiredAt
  name?: string
  role?: string
}

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
  role?: string
}

export type ApiKeyAppExpiredAtOneOf = string | number

export type ApiKeyAppExpiredAt = 'infinity' | ApiKeyAppExpiredAtOneOf

export type ApiKeyAppCreatedAt = string | number

export interface ApiKeyApp {
  api_key?: string
  api_secret?: string
  created_at?: ApiKeyAppCreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
  expired_at?: ApiKeyAppExpiredAt
  name?: string
  role?: string
}
