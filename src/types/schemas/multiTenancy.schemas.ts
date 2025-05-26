export type PostMtNsNsKickAllClients409Code =
  (typeof PostMtNsNsKickAllClients409Code)[keyof typeof PostMtNsNsKickAllClients409Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMtNsNsKickAllClients409Code = {
  CONFLICT: 'CONFLICT',
} as const

export type PostMtNsNsKickAllClients409 = {
  code?: PostMtNsNsKickAllClients409Code
  message?: string
}

export type PostMtNsNsKickAllClients404Code =
  (typeof PostMtNsNsKickAllClients404Code)[keyof typeof PostMtNsNsKickAllClients404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMtNsNsKickAllClients404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostMtNsNsKickAllClients404 = {
  code?: PostMtNsNsKickAllClients404Code
  message?: string
}

export type PutMtNsNsConfig404Code =
  (typeof PutMtNsNsConfig404Code)[keyof typeof PutMtNsNsConfig404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMtNsNsConfig404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutMtNsNsConfig404 = {
  code?: PutMtNsNsConfig404Code
  message?: string
}

export type PutMtNsNsConfig400Code =
  (typeof PutMtNsNsConfig400Code)[keyof typeof PutMtNsNsConfig400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMtNsNsConfig400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMtNsNsConfig400 = {
  code?: PutMtNsNsConfig400Code
  message?: string
}

export type GetMtNsNsConfig404Code =
  (typeof GetMtNsNsConfig404Code)[keyof typeof GetMtNsNsConfig404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMtNsNsConfig404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMtNsNsConfig404 = {
  code?: GetMtNsNsConfig404Code
  message?: string
}

export type GetMtNsNsClientList404Code =
  (typeof GetMtNsNsClientList404Code)[keyof typeof GetMtNsNsClientList404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMtNsNsClientList404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMtNsNsClientList404 = {
  code?: GetMtNsNsClientList404Code
  message?: string
}

export type GetMtNsNsClientListParams = {
  last_clientid?: string
  limit?: number
}

export type GetMtNsNsClientCount404Code =
  (typeof GetMtNsNsClientCount404Code)[keyof typeof GetMtNsNsClientCount404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMtNsNsClientCount404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMtNsNsClientCount404 = {
  code?: GetMtNsNsClientCount404Code
  message?: string
}

export type GetMtNsNsClientCount200 = {
  /** @minimum 0 */
  count?: number
}

export type PostMtNsNs409Code = (typeof PostMtNsNs409Code)[keyof typeof PostMtNsNs409Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMtNsNs409Code = {
  CONFLICT: 'CONFLICT',
} as const

export type PostMtNsNs409 = {
  code?: PostMtNsNs409Code
  message?: string
}

export type PostMtNsNs400Code = (typeof PostMtNsNs400Code)[keyof typeof PostMtNsNs400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMtNsNs400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMtNsNs400 = {
  code?: PostMtNsNs400Code
  message?: string
}

export type GetMtNsListDetailsParams = {
  last_ns?: string
  limit?: number
}

export type GetMtNsListParams = {
  last_ns?: string
  limit?: number
}

export type GetMtManagedNsListDetailsParams = {
  last_ns?: string
  limit?: number
}

export type GetMtManagedNsListParams = {
  last_ns?: string
  limit?: number
}

export type PostMtBulkImportConfigs500Code =
  (typeof PostMtBulkImportConfigs500Code)[keyof typeof PostMtBulkImportConfigs500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMtBulkImportConfigs500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type PostMtBulkImportConfigs500 = {
  code?: PostMtBulkImportConfigs500Code
  message?: string
}

export type PostMtBulkImportConfigs400Code =
  (typeof PostMtBulkImportConfigs400Code)[keyof typeof PostMtBulkImportConfigs400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMtBulkImportConfigs400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostMtBulkImportConfigs400 = {
  code?: PostMtBulkImportConfigs400Code
  message?: string
}

export type DeleteMtBulkDeleteNs500Code =
  (typeof DeleteMtBulkDeleteNs500Code)[keyof typeof DeleteMtBulkDeleteNs500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMtBulkDeleteNs500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type DeleteMtBulkDeleteNs500 = {
  code?: DeleteMtBulkDeleteNs500Code
  message?: string
}

export type MtSessionConfigInMaxSessions = number | 'infinity'

export interface MtSessionConfigIn {
  max_sessions?: MtSessionConfigInMaxSessions
}

export interface MtNsWithDetailsOut {
  creation_date?: number
  name?: string
}

export interface MtLimiterOptions {
  burst?: string
  rate?: string
}

export interface MtLimiterIn {
  bytes?: MtLimiterOptions
  messages?: MtLimiterOptions
}

export type MtLimiterConfigInTenant = MtLimiterIn | 'disabled'

export type MtLimiterConfigInClient = MtLimiterIn | 'disabled'

export interface MtLimiterConfigIn {
  client?: MtLimiterConfigInClient
  tenant?: MtLimiterConfigInTenant
}

export interface MtConfigOut {
  limiter?: MtLimiterConfigIn
  session?: MtSessionConfigIn
}

export interface MtConfigIn {
  limiter?: MtLimiterConfigIn
  session?: MtSessionConfigIn
}

export interface MtBulkDeleteNsIn {
  nss?: string[]
}

export interface MtBulkConfigIn {
  config?: MtConfigIn
  ns?: string
}
