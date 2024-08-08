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

export interface EmqxAuthzCache {
  enable: boolean
  max_size?: number
  ttl?: string
  excludes?: string[]
}

export type PutAuthorizationSettings200 = {
  no_match: PutAuthorizationSettings200NoMatch
  deny_action: PutAuthorizationSettings200DenyAction
  cache?: EmqxAuthzCache
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
  cache?: EmqxAuthzCache
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
  cache?: EmqxAuthzCache
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

export type PutAuthorizationSourcesOrder400Code =
  typeof PutAuthorizationSourcesOrder400Code[keyof typeof PutAuthorizationSourcesOrder400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutAuthorizationSourcesOrder400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutAuthorizationSourcesOrder400 = {
  code?: PutAuthorizationSourcesOrder400Code
  message?: string
}

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
  | AuthzLdap
  | AuthzMongoSharded
  | AuthzMongoRs
  | AuthzMongoSingle
  | AuthzPostgresql
  | AuthzMysql
  | AuthzRedisCluster
  | AuthzRedisSentinel
  | AuthzRedisSingle
  | AuthzHttpPost
  | AuthzHttpGet
  | AuthzBuiltinDb
  | AuthzApiFile

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
  | AuthzLdap
  | AuthzMongoSharded
  | AuthzMongoRs
  | AuthzMongoSingle
  | AuthzPostgresql
  | AuthzMysql
  | AuthzRedisCluster
  | AuthzRedisSentinel
  | AuthzRedisSingle
  | AuthzHttpPost
  | AuthzHttpGet
  | AuthzBuiltinDb
  | AuthzApiFile

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
  | AuthzLdap
  | AuthzMongoSharded
  | AuthzMongoRs
  | AuthzMongoSingle
  | AuthzPostgresql
  | AuthzMysql
  | AuthzRedisCluster
  | AuthzRedisSentinel
  | AuthzRedisSingle
  | AuthzHttpPost
  | AuthzHttpGet
  | AuthzBuiltinDb
  | AuthzApiFile

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

export type LdapSslServerNameIndication = string | 'disable'

export type LdapSslPartialChain = typeof LdapSslPartialChain[keyof typeof LdapSslPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type LdapSslLogLevel = typeof LdapSslLogLevel[keyof typeof LdapSslLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslLogLevel = {
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

export type LdapSslVerify = typeof LdapSslVerify[keyof typeof LdapSslVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LdapSslVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface LdapSsl {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: LdapSslVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: LdapSslLogLevel
  hibernate_after?: string
  partial_chain?: LdapSslPartialChain
  verify_peer_ext_key_usage?: string
  enable?: boolean
  server_name_indication?: LdapSslServerNameIndication
}

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

export type EmqxSslClientOptsPartialChain =
  typeof EmqxSslClientOptsPartialChain[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxSslClientOptsLogLevel =
  typeof EmqxSslClientOptsLogLevel[keyof typeof EmqxSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsLogLevel = {
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

export type EmqxSslClientOptsVerify =
  typeof EmqxSslClientOptsVerify[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxSslClientOptsLogLevel
  hibernate_after?: string
  partial_chain?: EmqxSslClientOptsPartialChain
  verify_peer_ext_key_usage?: string
  enable?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
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
  ignore?: number
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

export type EmqxAuthzApiSourcesSourcesSourcesItem =
  | AuthzLdap
  | AuthzMongoSharded
  | AuthzMongoRs
  | AuthzMongoSingle
  | AuthzPostgresql
  | AuthzMysql
  | AuthzRedisCluster
  | AuthzRedisSentinel
  | AuthzRedisSingle
  | AuthzHttpPost
  | AuthzHttpGet
  | AuthzBuiltinDb
  | AuthzApiFile

export interface EmqxAuthzApiSourcesSources {
  sources?: EmqxAuthzApiSourcesSourcesSourcesItem[]
}

export type EmqxAuthzApiSourcesRequestSourcesOrderType =
  typeof EmqxAuthzApiSourcesRequestSourcesOrderType[keyof typeof EmqxAuthzApiSourcesRequestSourcesOrderType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxAuthzApiSourcesRequestSourcesOrderType = {
  file: 'file',
  built_in_database: 'built_in_database',
  http: 'http',
  redis: 'redis',
  mysql: 'mysql',
  postgresql: 'postgresql',
  mongodb: 'mongodb',
  ldap: 'ldap',
} as const

export interface EmqxAuthzApiSourcesRequestSourcesOrder {
  type: EmqxAuthzApiSourcesRequestSourcesOrderType
}

export interface EmqxAuthzApiSourcesPosition {
  position: string
}

export interface EmqxAuthzApiMnesiaUsernameResponseData {
  data?: EmqxAuthzApiMnesiaRulesForUsername[]
  meta?: PublicMeta
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

export type AuthzRedisSingleRedisType =
  typeof AuthzRedisSingleRedisType[keyof typeof AuthzRedisSingleRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzRedisSingleRedisType = {
  single: 'single',
} as const

export type AuthzRedisSingleType = typeof AuthzRedisSingleType[keyof typeof AuthzRedisSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzRedisSingleType = {
  redis: 'redis',
} as const

export interface AuthzRedisSingle {
  type: AuthzRedisSingleType
  enable?: boolean
  server: string
  redis_type?: AuthzRedisSingleRedisType
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  cmd: string
}

export type AuthzRedisSentinelRedisType =
  typeof AuthzRedisSentinelRedisType[keyof typeof AuthzRedisSentinelRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzRedisSentinelRedisType = {
  sentinel: 'sentinel',
} as const

export type AuthzRedisSentinelType =
  typeof AuthzRedisSentinelType[keyof typeof AuthzRedisSentinelType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzRedisSentinelType = {
  redis: 'redis',
} as const

export interface AuthzRedisSentinel {
  type: AuthzRedisSentinelType
  enable?: boolean
  servers: string
  redis_type?: AuthzRedisSentinelRedisType
  sentinel: string
  pool_size?: number
  username?: string
  password?: string
  database?: number
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  cmd: string
}

export type AuthzRedisClusterRedisType =
  typeof AuthzRedisClusterRedisType[keyof typeof AuthzRedisClusterRedisType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzRedisClusterRedisType = {
  cluster: 'cluster',
} as const

export type AuthzRedisClusterType = typeof AuthzRedisClusterType[keyof typeof AuthzRedisClusterType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzRedisClusterType = {
  redis: 'redis',
} as const

export interface AuthzRedisCluster {
  type: AuthzRedisClusterType
  enable?: boolean
  servers: string
  redis_type?: AuthzRedisClusterRedisType
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  cmd: string
}

export type AuthzPostgresqlPrepareStatement = { [key: string]: any }

export type AuthzPostgresqlType = typeof AuthzPostgresqlType[keyof typeof AuthzPostgresqlType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzPostgresqlType = {
  postgresql: 'postgresql',
} as const

export interface AuthzPostgresql {
  type: AuthzPostgresqlType
  enable?: boolean
  server: string
  disable_prepared_statements?: boolean
  database: string
  pool_size?: number
  username: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  prepare_statement?: AuthzPostgresqlPrepareStatement
  query: string
}

export type AuthzMysqlPrepareStatement = { [key: string]: any }

export type AuthzMysqlType = typeof AuthzMysqlType[keyof typeof AuthzMysqlType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMysqlType = {
  mysql: 'mysql',
} as const

export interface AuthzMysql {
  type: AuthzMysqlType
  enable?: boolean
  server: string
  database: string
  pool_size?: number
  username?: string
  password?: string
  /** @deprecated */
  auto_reconnect?: boolean
  ssl?: EmqxSslClientOpts
  prepare_statement?: AuthzMysqlPrepareStatement
  query: string
}

export type AuthzMongoSingleUseLegacyProtocol =
  typeof AuthzMongoSingleUseLegacyProtocol[keyof typeof AuthzMongoSingleUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoSingleUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type AuthzMongoSingleWMode = typeof AuthzMongoSingleWMode[keyof typeof AuthzMongoSingleWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoSingleWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type AuthzMongoSingleMongoType =
  typeof AuthzMongoSingleMongoType[keyof typeof AuthzMongoSingleMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoSingleMongoType = {
  single: 'single',
} as const

export type AuthzMongoSingleFilter = { [key: string]: any }

export type AuthzMongoSingleType = typeof AuthzMongoSingleType[keyof typeof AuthzMongoSingleType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoSingleType = {
  mongodb: 'mongodb',
} as const

export interface AuthzMongoSingle {
  type: AuthzMongoSingleType
  enable?: boolean
  collection: string
  filter?: AuthzMongoSingleFilter
  mongo_type: AuthzMongoSingleMongoType
  server: string
  w_mode?: AuthzMongoSingleWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: AuthzMongoSingleUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
}

export type AuthzMongoShardedUseLegacyProtocol =
  typeof AuthzMongoShardedUseLegacyProtocol[keyof typeof AuthzMongoShardedUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoShardedUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type AuthzMongoShardedWMode =
  typeof AuthzMongoShardedWMode[keyof typeof AuthzMongoShardedWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoShardedWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type AuthzMongoShardedMongoType =
  typeof AuthzMongoShardedMongoType[keyof typeof AuthzMongoShardedMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoShardedMongoType = {
  sharded: 'sharded',
} as const

export type AuthzMongoShardedFilter = { [key: string]: any }

export type AuthzMongoShardedType = typeof AuthzMongoShardedType[keyof typeof AuthzMongoShardedType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoShardedType = {
  mongodb: 'mongodb',
} as const

export interface AuthzMongoSharded {
  type: AuthzMongoShardedType
  enable?: boolean
  collection: string
  filter?: AuthzMongoShardedFilter
  mongo_type: AuthzMongoShardedMongoType
  servers: string
  w_mode?: AuthzMongoShardedWMode
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: AuthzMongoShardedUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
}

export type AuthzMongoRsUseLegacyProtocol =
  typeof AuthzMongoRsUseLegacyProtocol[keyof typeof AuthzMongoRsUseLegacyProtocol]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoRsUseLegacyProtocol = {
  auto: 'auto',
  true: 'true',
  false: 'false',
} as const

export type AuthzMongoRsRMode = typeof AuthzMongoRsRMode[keyof typeof AuthzMongoRsRMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoRsRMode = {
  master: 'master',
  slave_ok: 'slave_ok',
} as const

export type AuthzMongoRsWMode = typeof AuthzMongoRsWMode[keyof typeof AuthzMongoRsWMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoRsWMode = {
  unsafe: 'unsafe',
  safe: 'safe',
} as const

export type AuthzMongoRsMongoType = typeof AuthzMongoRsMongoType[keyof typeof AuthzMongoRsMongoType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoRsMongoType = {
  rs: 'rs',
} as const

export type AuthzMongoRsFilter = { [key: string]: any }

export type AuthzMongoRsType = typeof AuthzMongoRsType[keyof typeof AuthzMongoRsType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzMongoRsType = {
  mongodb: 'mongodb',
} as const

export interface AuthzMongoRs {
  type: AuthzMongoRsType
  enable?: boolean
  collection: string
  filter?: AuthzMongoRsFilter
  mongo_type: AuthzMongoRsMongoType
  servers: string
  w_mode?: AuthzMongoRsWMode
  r_mode?: AuthzMongoRsRMode
  replica_set_name: string
  srv_record?: boolean
  pool_size?: number
  username?: string
  password?: string
  use_legacy_protocol?: AuthzMongoRsUseLegacyProtocol
  auth_source?: string
  database: string
  topology?: MongoTopology
  ssl?: EmqxSslClientOpts
}

export type AuthzLdapType = typeof AuthzLdapType[keyof typeof AuthzLdapType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzLdapType = {
  ldap: 'ldap',
} as const

export interface AuthzLdap {
  type: AuthzLdapType
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
  ssl?: LdapSsl
}

export type AuthzHttpPostHeaders = { [key: string]: any }

export type AuthzHttpPostMethod = typeof AuthzHttpPostMethod[keyof typeof AuthzHttpPostMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzHttpPostMethod = {
  post: 'post',
} as const

export type AuthzHttpPostBody = {
  $name?: string
}

export type AuthzHttpPostType = typeof AuthzHttpPostType[keyof typeof AuthzHttpPostType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzHttpPostType = {
  http: 'http',
} as const

export interface AuthzHttpPost {
  type: AuthzHttpPostType
  enable?: boolean
  url: string
  request_timeout?: string
  body?: AuthzHttpPostBody
  connect_timeout?: string
  /** @deprecated */
  max_retries?: number
  /** @deprecated */
  retry_interval?: string
  pool_size?: number
  enable_pipelining?: number
  request?: ConnectorHttpRequest
  ssl?: EmqxSslClientOpts
  method: AuthzHttpPostMethod
  headers?: AuthzHttpPostHeaders
}

export type AuthzHttpGetHeaders = { [key: string]: any }

export type AuthzHttpGetMethod = typeof AuthzHttpGetMethod[keyof typeof AuthzHttpGetMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzHttpGetMethod = {
  get: 'get',
} as const

export type AuthzHttpGetBody = {
  $name?: string
}

export type AuthzHttpGetType = typeof AuthzHttpGetType[keyof typeof AuthzHttpGetType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzHttpGetType = {
  http: 'http',
} as const

export interface AuthzHttpGet {
  type: AuthzHttpGetType
  enable?: boolean
  url: string
  request_timeout?: string
  body?: AuthzHttpGetBody
  connect_timeout?: string
  /** @deprecated */
  max_retries?: number
  /** @deprecated */
  retry_interval?: string
  pool_size?: number
  enable_pipelining?: number
  request?: ConnectorHttpRequest
  ssl?: EmqxSslClientOpts
  method: AuthzHttpGetMethod
  headers?: AuthzHttpGetHeaders
}

export type AuthzBuiltinDbType = typeof AuthzBuiltinDbType[keyof typeof AuthzBuiltinDbType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzBuiltinDbType = {
  built_in_database: 'built_in_database',
} as const

export interface AuthzBuiltinDb {
  type: AuthzBuiltinDbType
  enable?: boolean
  max_rules?: number
}

export type AuthzApiFileType = typeof AuthzApiFileType[keyof typeof AuthzApiFileType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AuthzApiFileType = {
  file: 'file',
} as const

export interface AuthzApiFile {
  type: AuthzApiFileType
  enable?: boolean
  rules: string
}
