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
  | EmqxAuthzLdapSchemaLdap
  | EmqxAuthzMongodbSchemaMongoSharded
  | EmqxAuthzMongodbSchemaMongoRs
  | EmqxAuthzMongodbSchemaMongoSingle
  | EmqxAuthzPostgresqlSchemaPostgresql
  | EmqxAuthzMysqlSchemaMysql
  | EmqxAuthzRedisSchemaRedisCluster
  | EmqxAuthzRedisSchemaRedisSentinel
  | EmqxAuthzRedisSchemaRedisSingle
  | EmqxAuthzHttpSchemaHttpPost
  | EmqxAuthzHttpSchemaHttpGet
  | EmqxAuthzMnesiaSchemaBuiltinDb
  | EmqxAuthzFileSchemaApiFile

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
  | EmqxAuthzLdapSchemaLdap
  | EmqxAuthzMongodbSchemaMongoSharded
  | EmqxAuthzMongodbSchemaMongoRs
  | EmqxAuthzMongodbSchemaMongoSingle
  | EmqxAuthzPostgresqlSchemaPostgresql
  | EmqxAuthzMysqlSchemaMysql
  | EmqxAuthzRedisSchemaRedisCluster
  | EmqxAuthzRedisSchemaRedisSentinel
  | EmqxAuthzRedisSchemaRedisSingle
  | EmqxAuthzHttpSchemaHttpPost
  | EmqxAuthzHttpSchemaHttpGet
  | EmqxAuthzMnesiaSchemaBuiltinDb
  | EmqxAuthzFileSchemaApiFile

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
  | EmqxAuthzLdapSchemaLdap
  | EmqxAuthzMongodbSchemaMongoSharded
  | EmqxAuthzMongodbSchemaMongoRs
  | EmqxAuthzMongodbSchemaMongoSingle
  | EmqxAuthzPostgresqlSchemaPostgresql
  | EmqxAuthzMysqlSchemaMysql
  | EmqxAuthzRedisSchemaRedisCluster
  | EmqxAuthzRedisSchemaRedisSentinel
  | EmqxAuthzRedisSchemaRedisSingle
  | EmqxAuthzHttpSchemaHttpPost
  | EmqxAuthzHttpSchemaHttpGet
  | EmqxAuthzMnesiaSchemaBuiltinDb
  | EmqxAuthzFileSchemaApiFile

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

export type GetAuthorizationSourcesBuiltInDatabaseRulesClientsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  like_clientid?: string
}

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

export interface MongoTopology {
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

export type EmqxLdapSslServerNameIndication = string | 'disable'

export type EmqxLdapSslLogLevel = typeof EmqxLdapSslLogLevel[keyof typeof EmqxLdapSslLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLdapSslLogLevel = {
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

export type EmqxLdapSslVerify = typeof EmqxLdapSslVerify[keyof typeof EmqxLdapSslVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxLdapSslVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxLdapSsl {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxLdapSslVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxLdapSslLogLevel
  hibernate_after?: string
  enable?: boolean
  server_name_indication?: EmqxLdapSslServerNameIndication
}

export interface EmqxAuthzSchemaResourceMetrics {
  matched?: number
  success?: number
  failed?: number
  rate?: number
  rate_max?: number
  rate_last5m?: number
}

export type EmqxAuthzSchemaNodeStatusStatus =
  typeof EmqxAuthzSchemaNodeStatusStatus[keyof typeof EmqxAuthzSchemaNodeStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzSchemaNodeStatusStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
} as const

export interface EmqxAuthzSchemaNodeStatus {
  node?: string
  status?: EmqxAuthzSchemaNodeStatusStatus
}

export interface EmqxAuthzSchemaNodeResourceMetrics {
  node?: string
  metrics?: EmqxAuthzSchemaResourceMetrics
}

export interface EmqxAuthzSchemaNodeError {
  node?: string
  error?: string
}

export type EmqxAuthzSchemaMetricsStatusFieldsStatus =
  typeof EmqxAuthzSchemaMetricsStatusFieldsStatus[keyof typeof EmqxAuthzSchemaMetricsStatusFieldsStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzSchemaMetricsStatusFieldsStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface EmqxAuthzSchemaMetrics {
  total?: number
  allow?: number
  deny?: number
  nomatch?: number
  rate?: number
  rate_max?: number
  rate_last5m?: number
}

export interface EmqxAuthzSchemaNodeMetrics {
  node?: string
  metrics?: EmqxAuthzSchemaMetrics
}

export interface EmqxAuthzSchemaMetricsStatusFields {
  resource_metrics?: EmqxAuthzSchemaResourceMetrics
  node_resource_metrics?: EmqxAuthzSchemaNodeResourceMetrics[]
  metrics?: EmqxAuthzSchemaMetrics
  node_metrics?: EmqxAuthzSchemaNodeMetrics[]
  status?: EmqxAuthzSchemaMetricsStatusFieldsStatus
  node_status?: EmqxAuthzSchemaNodeStatus[]
  node_error?: EmqxAuthzSchemaNodeError[]
}

export type EmqxAuthzRedisSchemaRedisSingleRedisType =
  typeof EmqxAuthzRedisSchemaRedisSingleRedisType[keyof typeof EmqxAuthzRedisSchemaRedisSingleRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzRedisSchemaRedisSingleRedisType = {
  single: 'single',
} as const

export type EmqxAuthzRedisSchemaRedisSingleType =
  typeof EmqxAuthzRedisSchemaRedisSingleType[keyof typeof EmqxAuthzRedisSchemaRedisSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzRedisSchemaRedisSingleType = {
  redis: 'redis',
} as const

export interface EmqxAuthzRedisSchemaRedisSingle {
  type: EmqxAuthzRedisSchemaRedisSingleType
  enable?: boolean
  server: string
  redis_type?: EmqxAuthzRedisSchemaRedisSingleRedisType
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  cmd: string
}

export type EmqxAuthzRedisSchemaRedisSentinelRedisType =
  typeof EmqxAuthzRedisSchemaRedisSentinelRedisType[keyof typeof EmqxAuthzRedisSchemaRedisSentinelRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzRedisSchemaRedisSentinelRedisType = {
  sentinel: 'sentinel',
} as const

export type EmqxAuthzRedisSchemaRedisSentinelType =
  typeof EmqxAuthzRedisSchemaRedisSentinelType[keyof typeof EmqxAuthzRedisSchemaRedisSentinelType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzRedisSchemaRedisSentinelType = {
  redis: 'redis',
} as const

export interface EmqxAuthzRedisSchemaRedisSentinel {
  type: EmqxAuthzRedisSchemaRedisSentinelType
  enable?: boolean
  servers: string
  redis_type?: EmqxAuthzRedisSchemaRedisSentinelRedisType
  sentinel: string
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  cmd: string
}

export type EmqxAuthzRedisSchemaRedisClusterRedisType =
  typeof EmqxAuthzRedisSchemaRedisClusterRedisType[keyof typeof EmqxAuthzRedisSchemaRedisClusterRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzRedisSchemaRedisClusterRedisType = {
  cluster: 'cluster',
} as const

export type EmqxAuthzRedisSchemaRedisClusterType =
  typeof EmqxAuthzRedisSchemaRedisClusterType[keyof typeof EmqxAuthzRedisSchemaRedisClusterType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzRedisSchemaRedisClusterType = {
  redis: 'redis',
} as const

export interface EmqxAuthzRedisSchemaRedisCluster {
  type: EmqxAuthzRedisSchemaRedisClusterType
  enable?: boolean
  servers: string
  redis_type?: EmqxAuthzRedisSchemaRedisClusterRedisType
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  cmd: string
}

export type EmqxAuthzPostgresqlSchemaPostgresqlPrepareStatement = { [key: string]: any }

export type EmqxAuthzPostgresqlSchemaPostgresqlType =
  typeof EmqxAuthzPostgresqlSchemaPostgresqlType[keyof typeof EmqxAuthzPostgresqlSchemaPostgresqlType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzPostgresqlSchemaPostgresqlType = {
  postgresql: 'postgresql',
} as const

export interface EmqxAuthzPostgresqlSchemaPostgresql {
  type: EmqxAuthzPostgresqlSchemaPostgresqlType
  enable?: boolean
  server: string
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  prepare_statement?: EmqxAuthzPostgresqlSchemaPostgresqlPrepareStatement
  query: string
}

export type EmqxAuthzMysqlSchemaMysqlPrepareStatement = { [key: string]: any }

export type EmqxAuthzMysqlSchemaMysqlType =
  typeof EmqxAuthzMysqlSchemaMysqlType[keyof typeof EmqxAuthzMysqlSchemaMysqlType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMysqlSchemaMysqlType = {
  mysql: 'mysql',
} as const

export interface EmqxAuthzMysqlSchemaMysql {
  type: EmqxAuthzMysqlSchemaMysqlType
  enable?: boolean
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: BrokerSslClientOpts
  prepare_statement?: EmqxAuthzMysqlSchemaMysqlPrepareStatement
  query: string
}

export type EmqxAuthzMongodbSchemaMongoSingleUseLegacyProtocol =
  typeof EmqxAuthzMongodbSchemaMongoSingleUseLegacyProtocol[keyof typeof EmqxAuthzMongodbSchemaMongoSingleUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoSingleUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type EmqxAuthzMongodbSchemaMongoSingleWMode =
  typeof EmqxAuthzMongodbSchemaMongoSingleWMode[keyof typeof EmqxAuthzMongodbSchemaMongoSingleWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoSingleWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type EmqxAuthzMongodbSchemaMongoSingleMongoType =
  typeof EmqxAuthzMongodbSchemaMongoSingleMongoType[keyof typeof EmqxAuthzMongodbSchemaMongoSingleMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoSingleMongoType = {
  single: 'single',
} as const

export type EmqxAuthzMongodbSchemaMongoSingleFilter = { [key: string]: any }

export type EmqxAuthzMongodbSchemaMongoSingleType =
  typeof EmqxAuthzMongodbSchemaMongoSingleType[keyof typeof EmqxAuthzMongodbSchemaMongoSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoSingleType = {
  mongodb: 'mongodb',
} as const

export interface EmqxAuthzMongodbSchemaMongoSingle {
  type: EmqxAuthzMongodbSchemaMongoSingleType
  enable?: boolean
  collection: string
  filter?: EmqxAuthzMongodbSchemaMongoSingleFilter
  mongo_type?: EmqxAuthzMongodbSchemaMongoSingleMongoType
  server: string
  w_mode?: EmqxAuthzMongodbSchemaMongoSingleWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: EmqxAuthzMongodbSchemaMongoSingleUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzMongodbSchemaMongoShardedUseLegacyProtocol =
  typeof EmqxAuthzMongodbSchemaMongoShardedUseLegacyProtocol[keyof typeof EmqxAuthzMongodbSchemaMongoShardedUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoShardedUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type EmqxAuthzMongodbSchemaMongoShardedWMode =
  typeof EmqxAuthzMongodbSchemaMongoShardedWMode[keyof typeof EmqxAuthzMongodbSchemaMongoShardedWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoShardedWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type EmqxAuthzMongodbSchemaMongoShardedMongoType =
  typeof EmqxAuthzMongodbSchemaMongoShardedMongoType[keyof typeof EmqxAuthzMongodbSchemaMongoShardedMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoShardedMongoType = {
  sharded: 'sharded',
} as const

export type EmqxAuthzMongodbSchemaMongoShardedFilter = { [key: string]: any }

export type EmqxAuthzMongodbSchemaMongoShardedType =
  typeof EmqxAuthzMongodbSchemaMongoShardedType[keyof typeof EmqxAuthzMongodbSchemaMongoShardedType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoShardedType = {
  mongodb: 'mongodb',
} as const

export interface EmqxAuthzMongodbSchemaMongoSharded {
  type: EmqxAuthzMongodbSchemaMongoShardedType
  enable?: boolean
  collection: string
  filter?: EmqxAuthzMongodbSchemaMongoShardedFilter
  mongo_type?: EmqxAuthzMongodbSchemaMongoShardedMongoType
  servers: string
  w_mode?: EmqxAuthzMongodbSchemaMongoShardedWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: EmqxAuthzMongodbSchemaMongoShardedUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzMongodbSchemaMongoRsUseLegacyProtocol =
  typeof EmqxAuthzMongodbSchemaMongoRsUseLegacyProtocol[keyof typeof EmqxAuthzMongodbSchemaMongoRsUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoRsUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type EmqxAuthzMongodbSchemaMongoRsRMode =
  typeof EmqxAuthzMongodbSchemaMongoRsRMode[keyof typeof EmqxAuthzMongodbSchemaMongoRsRMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoRsRMode = {
  master: 'master',
  slave_ok: 'slave_ok',
} as const

export type EmqxAuthzMongodbSchemaMongoRsWMode =
  typeof EmqxAuthzMongodbSchemaMongoRsWMode[keyof typeof EmqxAuthzMongodbSchemaMongoRsWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoRsWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type EmqxAuthzMongodbSchemaMongoRsMongoType =
  typeof EmqxAuthzMongodbSchemaMongoRsMongoType[keyof typeof EmqxAuthzMongodbSchemaMongoRsMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoRsMongoType = {
  rs: 'rs',
} as const

export type EmqxAuthzMongodbSchemaMongoRsFilter = { [key: string]: any }

export type EmqxAuthzMongodbSchemaMongoRsType =
  typeof EmqxAuthzMongodbSchemaMongoRsType[keyof typeof EmqxAuthzMongodbSchemaMongoRsType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMongodbSchemaMongoRsType = {
  mongodb: 'mongodb',
} as const

export interface EmqxAuthzMongodbSchemaMongoRs {
  type: EmqxAuthzMongodbSchemaMongoRsType
  enable?: boolean
  collection: string
  filter?: EmqxAuthzMongodbSchemaMongoRsFilter
  mongo_type?: EmqxAuthzMongodbSchemaMongoRsMongoType
  servers: string
  w_mode?: EmqxAuthzMongodbSchemaMongoRsWMode
  r_mode?: EmqxAuthzMongodbSchemaMongoRsRMode
  replica_set_name: string
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: EmqxAuthzMongodbSchemaMongoRsUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: EmqxMongodbTopology
  ssl?: BrokerSslClientOpts
}

export type EmqxAuthzMnesiaSchemaBuiltinDbType =
  typeof EmqxAuthzMnesiaSchemaBuiltinDbType[keyof typeof EmqxAuthzMnesiaSchemaBuiltinDbType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzMnesiaSchemaBuiltinDbType = {
  built_in_database: 'built_in_database',
} as const

export interface EmqxAuthzMnesiaSchemaBuiltinDb {
  type: EmqxAuthzMnesiaSchemaBuiltinDbType
  enable?: boolean
}

export type EmqxAuthzLdapSchemaLdapType =
  typeof EmqxAuthzLdapSchemaLdapType[keyof typeof EmqxAuthzLdapSchemaLdapType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzLdapSchemaLdapType = {
  ldap: 'ldap',
} as const

export interface EmqxAuthzLdapSchemaLdap {
  type: EmqxAuthzLdapSchemaLdapType
  enable?: boolean
  publish_attribute?: string
  subscribe_attribute?: string
  all_attribute?: string
  query_timeout?: string
  server: string
  pool_size?: number
  username: string
  password?: string
  base_dn: string
  filter?: string
  request_timeout?: string
  ssl?: EmqxLdapSsl
}

export type EmqxAuthzHttpSchemaHttpPostHeadersItem = { [key: string]: any }

export type EmqxAuthzHttpSchemaHttpPostMethod =
  typeof EmqxAuthzHttpSchemaHttpPostMethod[keyof typeof EmqxAuthzHttpSchemaHttpPostMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzHttpSchemaHttpPostMethod = {
  post: 'post',
} as const

export type EmqxAuthzHttpSchemaHttpPostBody = { [key: string]: any }

export type EmqxAuthzHttpSchemaHttpPostType =
  typeof EmqxAuthzHttpSchemaHttpPostType[keyof typeof EmqxAuthzHttpSchemaHttpPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzHttpSchemaHttpPostType = {
  http: 'http',
} as const

export interface EmqxAuthzHttpSchemaHttpPost {
  type: EmqxAuthzHttpSchemaHttpPostType
  enable?: boolean
  url: string
  request_timeout?: string
  body?: EmqxAuthzHttpSchemaHttpPostBody
  connect_timeout?: string
  /** @deprecated */
  max_retries?: number
  /** @deprecated */
  retry_interval?: string
  pool_size?: number
  enable_pipelining?: number
  request?: ConnectorHttpRequest
  ssl?: BrokerSslClientOpts
  method: EmqxAuthzHttpSchemaHttpPostMethod
  headers?: EmqxAuthzHttpSchemaHttpPostHeadersItem[]
}

export type EmqxAuthzHttpSchemaHttpGetHeadersItem = { [key: string]: any }

export type EmqxAuthzHttpSchemaHttpGetMethod =
  typeof EmqxAuthzHttpSchemaHttpGetMethod[keyof typeof EmqxAuthzHttpSchemaHttpGetMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzHttpSchemaHttpGetMethod = {
  get: 'get',
} as const

export type EmqxAuthzHttpSchemaHttpGetBody = { [key: string]: any }

export type EmqxAuthzHttpSchemaHttpGetType =
  typeof EmqxAuthzHttpSchemaHttpGetType[keyof typeof EmqxAuthzHttpSchemaHttpGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzHttpSchemaHttpGetType = {
  http: 'http',
} as const

export interface EmqxAuthzHttpSchemaHttpGet {
  type: EmqxAuthzHttpSchemaHttpGetType
  enable?: boolean
  url: string
  request_timeout?: string
  body?: EmqxAuthzHttpSchemaHttpGetBody
  connect_timeout?: string
  /** @deprecated */
  max_retries?: number
  /** @deprecated */
  retry_interval?: string
  pool_size?: number
  enable_pipelining?: number
  request?: ConnectorHttpRequest
  ssl?: BrokerSslClientOpts
  method: EmqxAuthzHttpSchemaHttpGetMethod
  headers?: EmqxAuthzHttpSchemaHttpGetHeadersItem[]
}

export type EmqxAuthzFileSchemaApiFileType =
  typeof EmqxAuthzFileSchemaApiFileType[keyof typeof EmqxAuthzFileSchemaApiFileType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzFileSchemaApiFileType = {
  file: 'file',
} as const

export interface EmqxAuthzFileSchemaApiFile {
  type: EmqxAuthzFileSchemaApiFileType
  enable?: boolean
  rules: string
}

export type EmqxAuthzApiSourcesSourcesSourcesItem =
  | EmqxAuthzLdapSchemaLdap
  | EmqxAuthzMongodbSchemaMongoSharded
  | EmqxAuthzMongodbSchemaMongoRs
  | EmqxAuthzMongodbSchemaMongoSingle
  | EmqxAuthzPostgresqlSchemaPostgresql
  | EmqxAuthzMysqlSchemaMysql
  | EmqxAuthzRedisSchemaRedisCluster
  | EmqxAuthzRedisSchemaRedisSentinel
  | EmqxAuthzRedisSchemaRedisSingle
  | EmqxAuthzHttpSchemaHttpPost
  | EmqxAuthzHttpSchemaHttpGet
  | EmqxAuthzMnesiaSchemaBuiltinDb
  | EmqxAuthzFileSchemaApiFile

export interface EmqxAuthzApiSourcesSources {
  sources?: EmqxAuthzApiSourcesSourcesSourcesItem[]
}

export interface EmqxAuthzApiSourcesPosition {
  position: string
}

export interface EmqxAuthzApiMnesiaUsernameResponseData {
  data?: EmqxAuthzApiMnesiaRulesForUsername[]
  meta?: PublicMeta
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

export interface EmqxAuthzApiMnesiaRulesForClientid {
  rules?: EmqxAuthzApiMnesiaRuleItem[]
  clientid: string
}

export interface EmqxAuthzApiMnesiaRules {
  rules?: EmqxAuthzApiMnesiaRuleItem[]
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
