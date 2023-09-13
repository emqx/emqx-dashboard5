export type PostAuthorizationSourcesBuiltInDatabaseRulesAll400Code =
  typeof PostAuthorizationSourcesBuiltInDatabaseRulesAll400Code[keyof typeof PostAuthorizationSourcesBuiltInDatabaseRulesAll400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthorizationSourcesBuiltInDatabaseRulesAll400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostAuthorizationSourcesBuiltInDatabaseRulesAll400 = {
  code?: PostAuthorizationSourcesBuiltInDatabaseRulesAll400Code
  message?: string
}

export type PutAuthorizationSettings400Code =
  typeof PutAuthorizationSettings400Code[keyof typeof PutAuthorizationSettings400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSettings400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutAuthorizationSettings400 = {
  code?: PutAuthorizationSettings400Code
  message?: string
}

export type PutAuthorizationSettings200DenyAction =
  typeof PutAuthorizationSettings200DenyAction[keyof typeof PutAuthorizationSettings200DenyAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSettings200DenyAction = {
  ignore: 'ignore',
  disconnect: 'disconnect',
} as const

export type PutAuthorizationSettings200NoMatch =
  typeof PutAuthorizationSettings200NoMatch[keyof typeof PutAuthorizationSettings200NoMatch]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSettings200NoMatch = {
  allow: 'allow',
  deny: 'deny',
} as const

export type PutAuthorizationSettings200 = {
  no_match: PutAuthorizationSettings200NoMatch
  deny_action: PutAuthorizationSettings200DenyAction
  cache?: BrokerAuthzCache
}

export type PutAuthorizationSettingsBodyDenyAction =
  typeof PutAuthorizationSettingsBodyDenyAction[keyof typeof PutAuthorizationSettingsBodyDenyAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSettingsBodyDenyAction = {
  ignore: 'ignore',
  disconnect: 'disconnect',
} as const

export type PutAuthorizationSettingsBodyNoMatch =
  typeof PutAuthorizationSettingsBodyNoMatch[keyof typeof PutAuthorizationSettingsBodyNoMatch]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSettingsBodyNoMatch = {
  allow: 'allow',
  deny: 'deny',
} as const

export type PutAuthorizationSettingsBody = {
  no_match: PutAuthorizationSettingsBodyNoMatch
  deny_action: PutAuthorizationSettingsBodyDenyAction
  cache?: BrokerAuthzCache
}

export type GetAuthorizationSettings200DenyAction =
  typeof GetAuthorizationSettings200DenyAction[keyof typeof GetAuthorizationSettings200DenyAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthorizationSettings200DenyAction = {
  ignore: 'ignore',
  disconnect: 'disconnect',
} as const

export type GetAuthorizationSettings200NoMatch =
  typeof GetAuthorizationSettings200NoMatch[keyof typeof GetAuthorizationSettings200NoMatch]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthorizationSettings200NoMatch = {
  allow: 'allow',
  deny: 'deny',
} as const

export type GetAuthorizationSettings200 = {
  no_match: GetAuthorizationSettings200NoMatch
  deny_action: GetAuthorizationSettings200DenyAction
  cache?: BrokerAuthzCache
}

export type DeleteAuthorizationCache400Code =
  typeof DeleteAuthorizationCache400Code[keyof typeof DeleteAuthorizationCache400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteAuthorizationCache400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteAuthorizationCache400 = {
  code?: DeleteAuthorizationCache400Code
  message?: string
}

export type PutAuthorizationSourcesType400Code =
  typeof PutAuthorizationSourcesType400Code[keyof typeof PutAuthorizationSourcesType400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSourcesType400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutAuthorizationSourcesType400 = {
  code?: PutAuthorizationSourcesType400Code
  message?: string
}

export type PutAuthorizationSourcesTypeBody =
  | EmqxAuthzApiSchemaFile
  | EmqxAuthzApiSchemaPostgresql
  | EmqxAuthzApiSchemaMysql
  | EmqxAuthzApiSchemaBuiltInDatabase
  | EmqxAuthzApiSchemaRedisCluster
  | EmqxAuthzApiSchemaRedisSentinel
  | EmqxAuthzApiSchemaRedisSingle
  | EmqxAuthzApiSchemaMongoSharded
  | EmqxAuthzApiSchemaMongoRs
  | EmqxAuthzApiSchemaMongoSingle
  | EmqxAuthzApiSchemaHttpPost
  | EmqxAuthzApiSchemaHttpGet

export type GetAuthorizationSourcesType404Code =
  typeof GetAuthorizationSourcesType404Code[keyof typeof GetAuthorizationSourcesType404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthorizationSourcesType404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetAuthorizationSourcesType404 = {
  code?: GetAuthorizationSourcesType404Code
  message?: string
}

export type GetAuthorizationSourcesType200 =
  | EmqxAuthzApiSchemaFile
  | EmqxAuthzApiSchemaPostgresql
  | EmqxAuthzApiSchemaMysql
  | EmqxAuthzApiSchemaBuiltInDatabase
  | EmqxAuthzApiSchemaRedisCluster
  | EmqxAuthzApiSchemaRedisSentinel
  | EmqxAuthzApiSchemaRedisSingle
  | EmqxAuthzApiSchemaMongoSharded
  | EmqxAuthzApiSchemaMongoRs
  | EmqxAuthzApiSchemaMongoSingle
  | EmqxAuthzApiSchemaHttpPost
  | EmqxAuthzApiSchemaHttpGet

export type DeleteAuthorizationSourcesType400Code =
  typeof DeleteAuthorizationSourcesType400Code[keyof typeof DeleteAuthorizationSourcesType400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteAuthorizationSourcesType400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteAuthorizationSourcesType400 = {
  code?: DeleteAuthorizationSourcesType400Code
  message?: string
}

export type PostAuthorizationSourcesTypeMove404Code =
  typeof PostAuthorizationSourcesTypeMove404Code[keyof typeof PostAuthorizationSourcesTypeMove404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthorizationSourcesTypeMove404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostAuthorizationSourcesTypeMove404 = {
  code?: PostAuthorizationSourcesTypeMove404Code
  message?: string
}

export type PostAuthorizationSourcesTypeMove400Code =
  typeof PostAuthorizationSourcesTypeMove400Code[keyof typeof PostAuthorizationSourcesTypeMove400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthorizationSourcesTypeMove400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostAuthorizationSourcesTypeMove400 = {
  code?: PostAuthorizationSourcesTypeMove400Code
  message?: string
}

export type DeleteAuthorizationSourcesBuiltInDatabaseRules400Code =
  typeof DeleteAuthorizationSourcesBuiltInDatabaseRules400Code[keyof typeof DeleteAuthorizationSourcesBuiltInDatabaseRules400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteAuthorizationSourcesBuiltInDatabaseRules400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteAuthorizationSourcesBuiltInDatabaseRules400 = {
  code?: DeleteAuthorizationSourcesBuiltInDatabaseRules400Code
  message?: string
}

export type PutAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code =
  typeof PutAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code[keyof typeof PutAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400 = {
  code?: PutAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code
  message?: string
}

export type GetAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code =
  typeof GetAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code[keyof typeof GetAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404 = {
  code?: GetAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code
  message?: string
}

export type DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code =
  typeof DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code[keyof typeof DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404 = {
  code?: DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername404Code
  message?: string
}

export type DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code =
  typeof DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code[keyof typeof DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400 = {
  code?: DeleteAuthorizationSourcesBuiltInDatabaseRulesUsersUsername400Code
  message?: string
}

export type PostAuthorizationSources400Code =
  typeof PostAuthorizationSources400Code[keyof typeof PostAuthorizationSources400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthorizationSources400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostAuthorizationSources400 = {
  code?: PostAuthorizationSources400Code
  message?: string
}

export type PostAuthorizationSourcesBody =
  | EmqxAuthzApiSchemaFile
  | EmqxAuthzApiSchemaPostgresql
  | EmqxAuthzApiSchemaMysql
  | EmqxAuthzApiSchemaBuiltInDatabase
  | EmqxAuthzApiSchemaRedisCluster
  | EmqxAuthzApiSchemaRedisSentinel
  | EmqxAuthzApiSchemaRedisSingle
  | EmqxAuthzApiSchemaMongoSharded
  | EmqxAuthzApiSchemaMongoRs
  | EmqxAuthzApiSchemaMongoSingle
  | EmqxAuthzApiSchemaHttpPost
  | EmqxAuthzApiSchemaHttpGet

export type GetAuthorizationSourcesTypeStatus404Code =
  typeof GetAuthorizationSourcesTypeStatus404Code[keyof typeof GetAuthorizationSourcesTypeStatus404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthorizationSourcesTypeStatus404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetAuthorizationSourcesTypeStatus404 = {
  code?: GetAuthorizationSourcesTypeStatus404Code
  message?: string
}

export type GetAuthorizationSourcesTypeStatus400Code =
  typeof GetAuthorizationSourcesTypeStatus400Code[keyof typeof GetAuthorizationSourcesTypeStatus400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthorizationSourcesTypeStatus400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetAuthorizationSourcesTypeStatus400 = {
  code?: GetAuthorizationSourcesTypeStatus400Code
  message?: string
}

export type PutAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code =
  typeof PutAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code[keyof typeof PutAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400 = {
  code?: PutAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code
  message?: string
}

export type GetAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code =
  typeof GetAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code[keyof typeof GetAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404 = {
  code?: GetAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code
  message?: string
}

export type DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code =
  typeof DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code[keyof typeof DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404 = {
  code?: DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid404Code
  message?: string
}

export type DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code =
  typeof DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code[keyof typeof DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400 = {
  code?: DeleteAuthorizationSourcesBuiltInDatabaseRulesClientsClientid400Code
  message?: string
}

export type PostAuthorizationSourcesBuiltInDatabaseRulesClients400Code =
  typeof PostAuthorizationSourcesBuiltInDatabaseRulesClients400Code[keyof typeof PostAuthorizationSourcesBuiltInDatabaseRulesClients400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthorizationSourcesBuiltInDatabaseRulesClients400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostAuthorizationSourcesBuiltInDatabaseRulesClients400 = {
  code?: PostAuthorizationSourcesBuiltInDatabaseRulesClients400Code
  message?: string
}

export type GetAuthorizationSourcesBuiltInDatabaseRulesClientsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  like_clientid?: string
}

export type PostAuthorizationSourcesBuiltInDatabaseRulesUsers409Code =
  typeof PostAuthorizationSourcesBuiltInDatabaseRulesUsers409Code[keyof typeof PostAuthorizationSourcesBuiltInDatabaseRulesUsers409Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthorizationSourcesBuiltInDatabaseRulesUsers409Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostAuthorizationSourcesBuiltInDatabaseRulesUsers409 = {
  code?: PostAuthorizationSourcesBuiltInDatabaseRulesUsers409Code
  message?: string
}

export type PostAuthorizationSourcesBuiltInDatabaseRulesUsers400Code =
  typeof PostAuthorizationSourcesBuiltInDatabaseRulesUsers400Code[keyof typeof PostAuthorizationSourcesBuiltInDatabaseRulesUsers400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthorizationSourcesBuiltInDatabaseRulesUsers400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostAuthorizationSourcesBuiltInDatabaseRulesUsers400 = {
  code?: PostAuthorizationSourcesBuiltInDatabaseRulesUsers400Code
  message?: string
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetAuthorizationSourcesBuiltInDatabaseRulesUsersParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  like_username?: string
}

export interface PublicMeta {
  page?: number
  limit?: number
  count?: number
  hasnext: boolean
}

export interface EmqxMongodbTopology {
  max_overflow?: number
  overflow_ttl?: string
  overflow_check_period?: string
  local_threshold_ms?: string
  connect_timeout_ms?: string
  socket_timeout_ms?: string
  server_selection_timeout_ms?: string
  wait_queue_timeout_ms?: string
  heartbeat_frequency_ms?: string
  min_heartbeat_frequency_ms?: string
}

export type EmqxAuthzApiSchemaRedisSingleRedisType =
  typeof EmqxAuthzApiSchemaRedisSingleRedisType[keyof typeof EmqxAuthzApiSchemaRedisSingleRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaRedisSingleRedisType = {
  single: 'single',
} as const

export interface EmqxAuthzApiSchemaRedisSingle {
  enable?: boolean
  type: EmqxAuthzApiSchemaRedisSingleType
  cmd: string
  server: string
  redis_type?: EmqxAuthzApiSchemaRedisSingleRedisType
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSourcesSourcesSourcesItem =
  | EmqxAuthzApiSchemaFile
  | EmqxAuthzApiSchemaPostgresql
  | EmqxAuthzApiSchemaMysql
  | EmqxAuthzApiSchemaBuiltInDatabase
  | EmqxAuthzApiSchemaRedisCluster
  | EmqxAuthzApiSchemaRedisSentinel
  | EmqxAuthzApiSchemaRedisSingle
  | EmqxAuthzApiSchemaMongoSharded
  | EmqxAuthzApiSchemaMongoRs
  | EmqxAuthzApiSchemaMongoSingle
  | EmqxAuthzApiSchemaHttpPost
  | EmqxAuthzApiSchemaHttpGet

export interface EmqxAuthzApiSourcesSources {
  sources?: EmqxAuthzApiSourcesSourcesSourcesItem[]
}

export type EmqxAuthzApiSchemaRedisSingleType =
  typeof EmqxAuthzApiSchemaRedisSingleType[keyof typeof EmqxAuthzApiSchemaRedisSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaRedisSingleType = {
  redis: 'redis',
} as const

export type EmqxAuthzApiSchemaRedisSentinelRedisType =
  typeof EmqxAuthzApiSchemaRedisSentinelRedisType[keyof typeof EmqxAuthzApiSchemaRedisSentinelRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaRedisSentinelRedisType = {
  sentinel: 'sentinel',
} as const

export type EmqxAuthzApiSchemaRedisSentinelType =
  typeof EmqxAuthzApiSchemaRedisSentinelType[keyof typeof EmqxAuthzApiSchemaRedisSentinelType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaRedisSentinelType = {
  redis: 'redis',
} as const

export interface EmqxAuthzApiSchemaRedisSentinel {
  enable?: boolean
  type: EmqxAuthzApiSchemaRedisSentinelType
  cmd: string
  servers: string
  redis_type?: EmqxAuthzApiSchemaRedisSentinelRedisType
  sentinel: string
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSchemaRedisClusterRedisType =
  typeof EmqxAuthzApiSchemaRedisClusterRedisType[keyof typeof EmqxAuthzApiSchemaRedisClusterRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaRedisClusterRedisType = {
  cluster: 'cluster',
} as const

export type EmqxAuthzApiSchemaRedisClusterType =
  typeof EmqxAuthzApiSchemaRedisClusterType[keyof typeof EmqxAuthzApiSchemaRedisClusterType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaRedisClusterType = {
  redis: 'redis',
} as const

export interface EmqxAuthzApiSchemaRedisCluster {
  enable?: boolean
  type: EmqxAuthzApiSchemaRedisClusterType
  cmd: string
  servers: string
  redis_type?: EmqxAuthzApiSchemaRedisClusterRedisType
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSchemaPostgresqlType =
  typeof EmqxAuthzApiSchemaPostgresqlType[keyof typeof EmqxAuthzApiSchemaPostgresqlType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaPostgresqlType = {
  postgresql: 'postgresql',
} as const

export interface EmqxAuthzApiSchemaPostgresql {
  enable?: boolean
  type: EmqxAuthzApiSchemaPostgresqlType
  query: string
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export interface EmqxAuthzApiSchemaPosition {
  position: string
}

export type EmqxAuthzApiSchemaMysqlType =
  typeof EmqxAuthzApiSchemaMysqlType[keyof typeof EmqxAuthzApiSchemaMysqlType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMysqlType = {
  mysql: 'mysql',
} as const

export interface EmqxAuthzApiSchemaMysql {
  enable?: boolean
  type: EmqxAuthzApiSchemaMysqlType
  query: string
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSchemaMongoSingleUseLegacyProtocol =
  typeof EmqxAuthzApiSchemaMongoSingleUseLegacyProtocol[keyof typeof EmqxAuthzApiSchemaMongoSingleUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoSingleUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type EmqxAuthzApiSchemaMongoSingleWMode =
  typeof EmqxAuthzApiSchemaMongoSingleWMode[keyof typeof EmqxAuthzApiSchemaMongoSingleWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoSingleWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type EmqxAuthzApiSchemaMongoSingleMongoType =
  typeof EmqxAuthzApiSchemaMongoSingleMongoType[keyof typeof EmqxAuthzApiSchemaMongoSingleMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoSingleMongoType = {
  single: 'single',
} as const

export type EmqxAuthzApiSchemaMongoSingleFilter = { [key: string]: any }

export type EmqxAuthzApiSchemaMongoSingleType =
  typeof EmqxAuthzApiSchemaMongoSingleType[keyof typeof EmqxAuthzApiSchemaMongoSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoSingleType = {
  mongodb: 'mongodb',
} as const

export interface EmqxAuthzApiSchemaMongoSingle {
  enable?: boolean
  type: EmqxAuthzApiSchemaMongoSingleType
  collection: string
  filter?: EmqxAuthzApiSchemaMongoSingleFilter
  mongo_type?: EmqxAuthzApiSchemaMongoSingleMongoType
  server: string
  w_mode?: EmqxAuthzApiSchemaMongoSingleWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: EmqxAuthzApiSchemaMongoSingleUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSchemaMongoShardedUseLegacyProtocol =
  typeof EmqxAuthzApiSchemaMongoShardedUseLegacyProtocol[keyof typeof EmqxAuthzApiSchemaMongoShardedUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoShardedUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type EmqxAuthzApiSchemaMongoShardedWMode =
  typeof EmqxAuthzApiSchemaMongoShardedWMode[keyof typeof EmqxAuthzApiSchemaMongoShardedWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoShardedWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type EmqxAuthzApiSchemaMongoShardedMongoType =
  typeof EmqxAuthzApiSchemaMongoShardedMongoType[keyof typeof EmqxAuthzApiSchemaMongoShardedMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoShardedMongoType = {
  sharded: 'sharded',
} as const

export type EmqxAuthzApiSchemaMongoShardedFilter = { [key: string]: any }

export type EmqxAuthzApiSchemaMongoShardedType =
  typeof EmqxAuthzApiSchemaMongoShardedType[keyof typeof EmqxAuthzApiSchemaMongoShardedType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoShardedType = {
  mongodb: 'mongodb',
} as const

export interface EmqxAuthzApiSchemaMongoSharded {
  enable?: boolean
  type: EmqxAuthzApiSchemaMongoShardedType
  collection: string
  filter?: EmqxAuthzApiSchemaMongoShardedFilter
  mongo_type?: EmqxAuthzApiSchemaMongoShardedMongoType
  servers: string
  w_mode?: EmqxAuthzApiSchemaMongoShardedWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: EmqxAuthzApiSchemaMongoShardedUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSchemaMongoRsUseLegacyProtocol =
  typeof EmqxAuthzApiSchemaMongoRsUseLegacyProtocol[keyof typeof EmqxAuthzApiSchemaMongoRsUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoRsUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type EmqxAuthzApiSchemaMongoRsRMode =
  typeof EmqxAuthzApiSchemaMongoRsRMode[keyof typeof EmqxAuthzApiSchemaMongoRsRMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoRsRMode = {
  master: 'master',
  slave_ok: 'slave_ok',
} as const

export type EmqxAuthzApiSchemaMongoRsWMode =
  typeof EmqxAuthzApiSchemaMongoRsWMode[keyof typeof EmqxAuthzApiSchemaMongoRsWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoRsWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type EmqxAuthzApiSchemaMongoRsMongoType =
  typeof EmqxAuthzApiSchemaMongoRsMongoType[keyof typeof EmqxAuthzApiSchemaMongoRsMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoRsMongoType = {
  rs: 'rs',
} as const

export type EmqxAuthzApiSchemaMongoRsFilter = { [key: string]: any }

export type EmqxAuthzApiSchemaMongoRsType =
  typeof EmqxAuthzApiSchemaMongoRsType[keyof typeof EmqxAuthzApiSchemaMongoRsType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaMongoRsType = {
  mongodb: 'mongodb',
} as const

export interface EmqxAuthzApiSchemaMongoRs {
  enable?: boolean
  type: EmqxAuthzApiSchemaMongoRsType
  collection: string
  filter?: EmqxAuthzApiSchemaMongoRsFilter
  mongo_type?: EmqxAuthzApiSchemaMongoRsMongoType
  servers: string
  w_mode?: EmqxAuthzApiSchemaMongoRsWMode
  r_mode?: EmqxAuthzApiSchemaMongoRsRMode
  replica_set_name: string
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: EmqxAuthzApiSchemaMongoRsUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSchemaHttpPostBody = { [key: string]: any }

export type EmqxAuthzApiSchemaHttpPostType =
  typeof EmqxAuthzApiSchemaHttpPostType[keyof typeof EmqxAuthzApiSchemaHttpPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaHttpPostType = {
  http: 'http',
} as const

export type EmqxAuthzApiSchemaHttpPostHeaders = { [key: string]: any }

export type EmqxAuthzApiSchemaHttpPostMethod =
  typeof EmqxAuthzApiSchemaHttpPostMethod[keyof typeof EmqxAuthzApiSchemaHttpPostMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaHttpPostMethod = {
  post: 'post',
} as const

export interface EmqxAuthzApiSchemaHttpPost {
  method: EmqxAuthzApiSchemaHttpPostMethod
  headers?: EmqxAuthzApiSchemaHttpPostHeaders
  enable?: boolean
  type: EmqxAuthzApiSchemaHttpPostType
  url: string
  body?: EmqxAuthzApiSchemaHttpPostBody
  request_timeout?: string
  connect_timeout?: string
  enable_pipelining?: number
  /** @deprecated */
  max_retries?: number
  pool_size?: number
  request?: ConnectorHttpRequest
  /** @deprecated */
  retry_interval?: string
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSchemaHttpGetBody = { [key: string]: any }

export type EmqxAuthzApiSchemaHttpGetType =
  typeof EmqxAuthzApiSchemaHttpGetType[keyof typeof EmqxAuthzApiSchemaHttpGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaHttpGetType = {
  http: 'http',
} as const

export type EmqxAuthzApiSchemaHttpGetHeaders = { [key: string]: any }

export type EmqxAuthzApiSchemaHttpGetMethod =
  typeof EmqxAuthzApiSchemaHttpGetMethod[keyof typeof EmqxAuthzApiSchemaHttpGetMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaHttpGetMethod = {
  get: 'get',
} as const

export interface EmqxAuthzApiSchemaHttpGet {
  method: EmqxAuthzApiSchemaHttpGetMethod
  headers?: EmqxAuthzApiSchemaHttpGetHeaders
  enable?: boolean
  type: EmqxAuthzApiSchemaHttpGetType
  url: string
  body?: EmqxAuthzApiSchemaHttpGetBody
  request_timeout?: string
  connect_timeout?: string
  enable_pipelining?: number
  /** @deprecated */
  max_retries?: number
  pool_size?: number
  request?: ConnectorHttpRequest
  /** @deprecated */
  retry_interval?: string
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzApiSchemaFileType =
  typeof EmqxAuthzApiSchemaFileType[keyof typeof EmqxAuthzApiSchemaFileType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaFileType = {
  file: 'file',
} as const

export interface EmqxAuthzApiSchemaFile {
  enable?: boolean
  type: EmqxAuthzApiSchemaFileType
  rules: string
}

export type EmqxAuthzApiSchemaBuiltInDatabaseType =
  typeof EmqxAuthzApiSchemaBuiltInDatabaseType[keyof typeof EmqxAuthzApiSchemaBuiltInDatabaseType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSchemaBuiltInDatabaseType = {
  built_in_database: 'built_in_database',
} as const

export interface EmqxAuthzApiSchemaBuiltInDatabase {
  enable?: boolean
  type: EmqxAuthzApiSchemaBuiltInDatabaseType
}

export interface EmqxAuthzApiMnesiaRulesForClientid {
  rules?: EmqxAuthzApiMnesiaRuleItem[]
  clientid: string
}

export interface EmqxAuthzApiMnesiaRules {
  rules?: EmqxAuthzApiMnesiaRuleItem[]
}

export type EmqxAuthzApiMnesiaRuleItemRetain = boolean | 'all'

export type EmqxAuthzApiMnesiaRuleItemAction =
  typeof EmqxAuthzApiMnesiaRuleItemAction[keyof typeof EmqxAuthzApiMnesiaRuleItemAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiMnesiaRuleItemAction = {
  publish: 'publish',
  subscribe: 'subscribe',
  all: 'all',
} as const

export type EmqxAuthzApiMnesiaRuleItemPermission =
  typeof EmqxAuthzApiMnesiaRuleItemPermission[keyof typeof EmqxAuthzApiMnesiaRuleItemPermission]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiMnesiaRuleItemPermission = {
  allow: 'allow',
  deny: 'deny',
} as const

export interface EmqxAuthzApiMnesiaRuleItem {
  topic: string
  permission: EmqxAuthzApiMnesiaRuleItemPermission
  action: EmqxAuthzApiMnesiaRuleItemAction
  qos?: number[]
  retain?: EmqxAuthzApiMnesiaRuleItemRetain
}

export interface EmqxAuthzApiMnesiaRulesForUsername {
  rules?: EmqxAuthzApiMnesiaRuleItem[]
  username: string
}

export interface EmqxAuthzApiMnesiaUsernameResponseData {
  data?: EmqxAuthzApiMnesiaRulesForUsername[]
  meta?: PublicMeta
}

export interface EmqxAuthzApiMnesiaClientidResponseData {
  data?: EmqxAuthzApiMnesiaRulesForClientid[]
  meta?: PublicMeta
}

export type ConnectorHttpRequestHeaders = { [key: string]: any }

export interface ConnectorHttpRequest {
  method?: string
  path?: string
  body?: string
  headers?: ConnectorHttpRequestHeaders
  max_retries?: number
  request_timeout?: string
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

export interface BrokerAuthzCache {
  enable: boolean
  max_size?: number
  ttl?: string
}

export interface AuthzResourceMetrics {
  matched?: number
  success?: number
  failed?: number
  rate?: number
  rate_max?: number
  rate_last5m?: number
}

export type AuthzNodeStatusStatus = typeof AuthzNodeStatusStatus[keyof typeof AuthzNodeStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzNodeStatusStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
} as const

export interface AuthzNodeStatus {
  node?: string
  status?: AuthzNodeStatusStatus
}

export interface AuthzNodeResourceMetrics {
  node?: string
  metrics?: AuthzResourceMetrics
}

export interface AuthzNodeError {
  node?: string
  error?: string
}

export type AuthzMetricsStatusFieldsStatus =
  typeof AuthzMetricsStatusFieldsStatus[keyof typeof AuthzMetricsStatusFieldsStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMetricsStatusFieldsStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface AuthzMetrics {
  total?: number
  allow?: number
  deny?: number
  nomatch?: number
  rate?: number
  rate_max?: number
  rate_last5m?: number
}

export interface AuthzNodeMetrics {
  node?: string
  metrics?: AuthzMetrics
}

export interface AuthzMetricsStatusFields {
  resource_metrics?: AuthzResourceMetrics
  node_resource_metrics?: AuthzNodeResourceMetrics[]
  metrics?: AuthzMetrics
  node_metrics?: AuthzNodeMetrics[]
  status?: AuthzMetricsStatusFieldsStatus
  node_status?: AuthzNodeStatus[]
  node_error?: AuthzNodeError[]
}
