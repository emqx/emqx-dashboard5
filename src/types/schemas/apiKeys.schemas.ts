export type DeleteApiKeyName404Code =
  typeof DeleteApiKeyName404Code[keyof typeof DeleteApiKeyName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteApiKeyName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteApiKeyName404 = {
  code?: DeleteApiKeyName404Code
  message?: string
}

export type PutApiKeyName404Code = typeof PutApiKeyName404Code[keyof typeof PutApiKeyName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutApiKeyName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutApiKeyName404 = {
  code?: PutApiKeyName404Code
  message?: string
}

export type PutApiKeyName200CreatedAt = number | string

export type PutApiKeyName200 = {
  name?: string
  api_key?: string
  expired_at?: PutApiKeyName200ExpiredAt
  created_at?: PutApiKeyName200CreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
}

export type PutApiKeyName200ExpiredAtOneOf = number | string

export type PutApiKeyName200ExpiredAt = PutApiKeyName200ExpiredAtOneOf | 'infinity'

export type PutApiKeyNameBodyExpiredAtOneOf = number | string

export type PutApiKeyNameBodyExpiredAt = PutApiKeyNameBodyExpiredAtOneOf | 'infinity'

export type PutApiKeyNameBody = {
  expired_at?: PutApiKeyNameBodyExpiredAt
  desc?: string
  enable?: boolean
  expired?: boolean
}

export type GetApiKeyName404Code = typeof GetApiKeyName404Code[keyof typeof GetApiKeyName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetApiKeyName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetApiKeyName404 = {
  code?: GetApiKeyName404Code
  message?: string
}

export type GetApiKeyName200CreatedAt = number | string

export type GetApiKeyName200ExpiredAtOneOf = number | string

export type GetApiKeyName200ExpiredAt = GetApiKeyName200ExpiredAtOneOf | 'infinity'

export type GetApiKeyName200 = {
  name?: string
  api_key?: string
  expired_at?: GetApiKeyName200ExpiredAt
  created_at?: GetApiKeyName200CreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
}

export type PostApiKey400Code = typeof PostApiKey400Code[keyof typeof PostApiKey400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostApiKey400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostApiKey400 = {
  code?: PostApiKey400Code
  message?: string
}

export type PostApiKeyBodyExpiredAtOneOf = number | string

export type PostApiKeyBodyExpiredAt = PostApiKeyBodyExpiredAtOneOf | 'infinity'

export type PostApiKeyBody = {
  name?: string
  expired_at?: PostApiKeyBodyExpiredAt
  desc?: string
  enable?: boolean
  expired?: boolean
}

export type GetApiKey200CreatedAt = number | string

export type GetApiKey200 = {
  name?: string
  api_key?: string
  expired_at?: GetApiKey200ExpiredAt
  created_at?: GetApiKey200CreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
}

export type GetApiKey200ExpiredAtOneOf = number | string

export type GetApiKey200ExpiredAt = GetApiKey200ExpiredAtOneOf | 'infinity'

export type ApiKeyAppCreatedAt = number | string

export interface ApiKeyApp {
  name?: string
  api_key?: string
  api_secret?: string
  expired_at?: ApiKeyAppExpiredAt
  created_at?: ApiKeyAppCreatedAt
  desc?: string
  enable?: boolean
  expired?: boolean
}

export type ApiKeyAppExpiredAtOneOf = number | string

export type ApiKeyAppExpiredAt = ApiKeyAppExpiredAtOneOf | 'infinity'
