export type PutGatewaysNameEnableEnable404Code =
  (typeof PutGatewaysNameEnableEnable404Code)[keyof typeof PutGatewaysNameEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutGatewaysNameEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type PutGatewaysNameEnableEnable404 = {
  code?: PutGatewaysNameEnableEnable404Code
  message?: string
}

export type PutGatewaysName404Code =
  (typeof PutGatewaysName404Code)[keyof typeof PutGatewaysName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutGatewaysName404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type PutGatewaysName404 = {
  code?: PutGatewaysName404Code
  message?: string
}

export type PutGatewaysName400Code =
  (typeof PutGatewaysName400Code)[keyof typeof PutGatewaysName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutGatewaysName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutGatewaysName400 = {
  code?: PutGatewaysName400Code
  message?: string
}

export type PutGatewaysNameBody =
  | EmqxGatewayApiCoap
  | EmqxGatewayApiGbt32960
  | EmqxGatewayApiJt808
  | EmqxGatewayApiLwm2m
  | EmqxGatewayApiMqttsn
  | EmqxGatewayApiNats
  | EmqxGatewayApiOcpp
  | EmqxGatewayApiStomp

export type GetGatewaysName404Code =
  (typeof GetGatewaysName404Code)[keyof typeof GetGatewaysName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysName404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type GetGatewaysName404 = {
  code?: GetGatewaysName404Code
  message?: string
}

export type GetGatewaysName200 =
  | EmqxGatewayApiCoap
  | EmqxGatewayApiGbt32960
  | EmqxGatewayApiJt808
  | EmqxGatewayApiLwm2m
  | EmqxGatewayApiMqttsn
  | EmqxGatewayApiNats
  | EmqxGatewayApiOcpp
  | EmqxGatewayApiStomp

export type GetGateways400Code = (typeof GetGateways400Code)[keyof typeof GetGateways400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGateways400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetGateways400 = {
  code?: GetGateways400Code
  message?: string
}

export type GetGatewaysStatus = (typeof GetGatewaysStatus)[keyof typeof GetGatewaysStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysStatus = {
  running: 'running',
  stopped: 'stopped',
  unloaded: 'unloaded',
} as const

export type GetGatewaysParams = {
  status?: GetGatewaysStatus
}

export type GatewayOcppUpstreamTopicOverrideMapping = {
  $name?: string
}

export interface GatewayOcppUpstream {
  error_topic: string
  reply_topic: string
  topic: string
  topic_override_mapping?: GatewayOcppUpstreamTopicOverrideMapping
}

export interface GatewayOcppDnstream {
  max_mqueue_len?: number
  topic: string
}

export type GatewayWebsocketPiggyback =
  (typeof GatewayWebsocketPiggyback)[keyof typeof GatewayWebsocketPiggyback]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayWebsocketPiggyback = {
  multiple: 'multiple',
  single: 'single',
} as const

export type GatewayWebsocketMaxFrameSize = 'infinity' | number

export interface GatewayWebsocket {
  allow_origin_absence?: boolean
  check_origin_enable?: boolean
  check_origins?: string
  compress?: boolean
  deflate_opts?: EmqxDeflateOpts
  fail_if_no_subprotocol?: boolean
  idle_timeout?: string
  max_frame_size?: GatewayWebsocketMaxFrameSize
  path?: string
  piggyback?: GatewayWebsocketPiggyback
  proxy_address_header?: string
  proxy_port_header?: string
  supported_subprotocols?: string
}

export interface GatewayUdpOpts {
  active_n?: number
  buffer?: string
  recbuf?: string
  reuseaddr?: boolean
  sndbuf?: string
}

export interface GatewayUdpHealthCheck {
  reply?: string
  request?: string
}

export interface GatewayTranslator {
  /**
   * @minimum 0
   * @maximum 2
   */
  qos?: number
  topic: string
}

export interface GatewayStompFrame {
  max_body_length?: number
  /** @minimum 0 */
  max_headers?: number
  /** @minimum 0 */
  max_headers_length?: number
}

export interface GatewayProtocol {
  /** @minimum 0 */
  max_payload_size?: number
}

export interface GatewayMqttsnPredefined {
  /**
   * @minimum 1
   * @maximum 1024
   */
  id: number
  topic: string
}

export interface GatewayLwm2mTranslators {
  command: GatewayTranslator
  notify: GatewayTranslator
  register: GatewayTranslator
  response: GatewayTranslator
  update: GatewayTranslator
}

export interface GatewayLwm2mBlockwise {
  enable?: boolean
  exchange_lifetime?: string
  /**
   * @minimum 16
   * @maximum 1024
   */
  max_block_size?: number
  max_body_size?: string
}

export interface GatewayJwtResolverPreloadEntry {
  jwt: string
  pubkey: string
}

export type GatewayJwtResolverMemoryType =
  (typeof GatewayJwtResolverMemoryType)[keyof typeof GatewayJwtResolverMemoryType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayJwtResolverMemoryType = {
  memory: 'memory',
} as const

export interface GatewayJwtResolverMemory {
  resolver_preload?: GatewayJwtResolverPreloadEntry[]
  type: GatewayJwtResolverMemoryType
}

export type GatewayJt808ProtoAuth = GatewayAnonymousFalse | GatewayAnonymousTrue

export interface GatewayJt808Proto {
  auth?: GatewayJt808ProtoAuth
  dn_topic: string
  ignore_unsupported_frames?: boolean
  up_topic: string
}

export type GatewayJt808FrameStringEncoding =
  (typeof GatewayJt808FrameStringEncoding)[keyof typeof GatewayJt808FrameStringEncoding]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayJt808FrameStringEncoding = {
  gbk: 'gbk',
  utf8: 'utf8',
} as const

export interface GatewayJt808Frame {
  /** @minimum 0 */
  max_length?: number
  parse_unknown_message?: boolean
  string_encoding?: GatewayJt808FrameStringEncoding
}

export type GatewayInternalAuthnTokenType =
  (typeof GatewayInternalAuthnTokenType)[keyof typeof GatewayInternalAuthnTokenType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayInternalAuthnTokenType = {
  token: 'token',
} as const

export interface GatewayInternalAuthnToken {
  token: string
  type: GatewayInternalAuthnTokenType
}

export type GatewayInternalAuthnNkeyType =
  (typeof GatewayInternalAuthnNkeyType)[keyof typeof GatewayInternalAuthnNkeyType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayInternalAuthnNkeyType = {
  nkey: 'nkey',
} as const

export interface GatewayInternalAuthnNkey {
  nkeys: string[]
  type: GatewayInternalAuthnNkeyType
}

export type GatewayInternalAuthnJwtType =
  (typeof GatewayInternalAuthnJwtType)[keyof typeof GatewayInternalAuthnJwtType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayInternalAuthnJwtType = {
  jwt: 'jwt',
} as const

export type GatewayInternalAuthnJwtResolver = GatewayJwtResolverMemory | 'memory'

export interface GatewayInternalAuthnJwt {
  resolver?: GatewayInternalAuthnJwtResolver
  trusted_operators?: string[]
  type: GatewayInternalAuthnJwtType
}

export type GatewayDtlsOptsVerify =
  (typeof GatewayDtlsOptsVerify)[keyof typeof GatewayDtlsOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayDtlsOptsVerify = {
  verify_none: 'verify_none',
  verify_peer: 'verify_peer',
} as const

export type GatewayDtlsOptsSessionTickets =
  (typeof GatewayDtlsOptsSessionTickets)[keyof typeof GatewayDtlsOptsSessionTickets]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayDtlsOptsSessionTickets = {
  disabled: 'disabled',
  stateless: 'stateless',
  stateless_with_cert: 'stateless_with_cert',
} as const

export type GatewayDtlsOptsPartialChain =
  (typeof GatewayDtlsOptsPartialChain)[keyof typeof GatewayDtlsOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayDtlsOptsPartialChain = {
  false: false,
  true: true,
  cacert_from_cacertfile: 'cacert_from_cacertfile',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
} as const

export type GatewayDtlsOptsManagedCerts = EmqxManagedCertsServer | EmqxManagedCertsServer[]

export type GatewayDtlsOptsLogLevel =
  (typeof GatewayDtlsOptsLogLevel)[keyof typeof GatewayDtlsOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayDtlsOptsLogLevel = {
  alert: 'alert',
  all: 'all',
  critical: 'critical',
  debug: 'debug',
  emergency: 'emergency',
  error: 'error',
  info: 'info',
  none: 'none',
  notice: 'notice',
  warning: 'warning',
} as const

export interface GatewayDtlsOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  client_renegotiation?: boolean
  /** @minimum 0 */
  depth?: number
  dhfile?: string
  enable_crl_check?: boolean
  fail_if_no_peer_cert?: boolean
  gc_after_handshake?: boolean
  handshake_timeout?: string
  hibernate_after?: string
  honor_cipher_order?: boolean
  keyfile?: string
  log_level?: GatewayDtlsOptsLogLevel
  managed_certs?: GatewayDtlsOptsManagedCerts
  ocsp?: EmqxOcsp
  partial_chain?: GatewayDtlsOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  session_tickets?: GatewayDtlsOptsSessionTickets
  verify?: GatewayDtlsOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export interface GatewayCoapBlockwise {
  enable?: boolean
  exchange_lifetime?: string
  /**
   * @minimum 16
   * @maximum 1024
   */
  max_block_size?: number
  max_body_size?: string
}

export interface GatewayClientinfoOverride {
  clientid?: string
  password?: string
  username?: string
}

export interface GatewayAnonymousTrue {
  allow_anonymous: true
  authentication?: string
  registry?: string
}

export interface GatewayAnonymousFalse {
  allow_anonymous: false
  authentication: string
  registry: string
}

export type EmqxGatewayApiWssListenerType =
  (typeof EmqxGatewayApiWssListenerType)[keyof typeof EmqxGatewayApiWssListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiWssListenerType = {
  wss: 'wss',
} as const

export type EmqxGatewayApiWssListenerMaxConnections = 'infinity' | number

export interface EmqxGatewayApiWssListener {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  enable?: boolean
  enable_authn?: boolean
  id?: string
  max_conn_rate?: number
  max_connections?: EmqxGatewayApiWssListenerMaxConnections
  mountpoint?: string
  name?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  ssl_options?: EmqxListenerWssOpts
  tcp_options?: EmqxTcpOpts
  type?: EmqxGatewayApiWssListenerType
  websocket?: GatewayWebsocket
}

export type EmqxGatewayApiWsListenerType =
  (typeof EmqxGatewayApiWsListenerType)[keyof typeof EmqxGatewayApiWsListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiWsListenerType = {
  ws: 'ws',
} as const

export type EmqxGatewayApiWsListenerMaxConnections = 'infinity' | number

export interface EmqxGatewayApiWsListener {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  enable?: boolean
  enable_authn?: boolean
  id?: string
  max_conn_rate?: number
  max_connections?: EmqxGatewayApiWsListenerMaxConnections
  mountpoint?: string
  name?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  tcp_options?: EmqxTcpOpts
  type?: EmqxGatewayApiWsListenerType
  websocket?: GatewayWebsocket
}

export type EmqxGatewayApiUdpListenerType =
  (typeof EmqxGatewayApiUdpListenerType)[keyof typeof EmqxGatewayApiUdpListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiUdpListenerType = {
  udp: 'udp',
} as const

export type EmqxGatewayApiUdpListenerMaxConnections = 'infinity' | number

export interface EmqxGatewayApiUdpListener {
  access_rules?: string[]
  bind?: string
  enable?: boolean
  enable_authn?: boolean
  health_check?: GatewayUdpHealthCheck
  id?: string
  max_conn_rate?: number
  max_connections?: EmqxGatewayApiUdpListenerMaxConnections
  mountpoint?: string
  name?: string
  running?: boolean
  type?: EmqxGatewayApiUdpListenerType
  udp_options?: GatewayUdpOpts
}

export type EmqxGatewayApiTcpListenerType =
  (typeof EmqxGatewayApiTcpListenerType)[keyof typeof EmqxGatewayApiTcpListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiTcpListenerType = {
  tcp: 'tcp',
} as const

export type EmqxGatewayApiTcpListenerMaxConnections = 'infinity' | number

export interface EmqxGatewayApiTcpListener {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  enable?: boolean
  enable_authn?: boolean
  id?: string
  max_conn_rate?: number
  max_connections?: EmqxGatewayApiTcpListenerMaxConnections
  mountpoint?: string
  name?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  tcp_options?: EmqxTcpOpts
  type?: EmqxGatewayApiTcpListenerType
}

export type EmqxGatewayApiStompName =
  (typeof EmqxGatewayApiStompName)[keyof typeof EmqxGatewayApiStompName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiStompName = {
  stomp: 'stomp',
} as const

export type EmqxGatewayApiStompListenersItem = EmqxGatewayApiSslListener | EmqxGatewayApiTcpListener

export interface EmqxGatewayApiStomp {
  clientinfo_override?: GatewayClientinfoOverride
  enable?: boolean
  enable_stats?: boolean
  frame?: GatewayStompFrame
  idle_timeout?: string
  listeners?: EmqxGatewayApiStompListenersItem[]
  mountpoint?: string
  name?: EmqxGatewayApiStompName
}

export type EmqxGatewayApiSslListenerType =
  (typeof EmqxGatewayApiSslListenerType)[keyof typeof EmqxGatewayApiSslListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiSslListenerType = {
  ssl: 'ssl',
} as const

export type EmqxGatewayApiSslListenerMaxConnections = 'infinity' | number

export interface EmqxGatewayApiSslListener {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  enable?: boolean
  enable_authn?: boolean
  id?: string
  max_conn_rate?: number
  max_connections?: EmqxGatewayApiSslListenerMaxConnections
  mountpoint?: string
  name?: string
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  running?: boolean
  ssl_options?: EmqxListenerSslOpts
  tcp_options?: EmqxTcpOpts
  type?: EmqxGatewayApiSslListenerType
}

export type EmqxGatewayApiOcppName =
  (typeof EmqxGatewayApiOcppName)[keyof typeof EmqxGatewayApiOcppName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiOcppName = {
  ocpp: 'ocpp',
} as const

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiOcppMessageFormatChecking = {
  all: 'all',
  disable: 'disable',
  dnstream_only: 'dnstream_only',
  upstream_only: 'upstream_only',
} as const

export type EmqxGatewayApiOcppListenersItem = EmqxGatewayApiWsListener | EmqxGatewayApiWssListener

export interface EmqxGatewayApiOcpp {
  clientinfo_override?: GatewayClientinfoOverride
  default_heartbeat_interval: string
  dnstream?: GatewayOcppDnstream
  enable?: boolean
  enable_stats?: boolean
  heartbeat_checking_times_backoff?: number
  idle_timeout?: string
  json_schema_dir?: string
  json_schema_id_prefix?: string
  listeners?: EmqxGatewayApiOcppListenersItem[]
  message_format_checking?: (typeof EmqxGatewayApiOcppMessageFormatChecking)[keyof typeof EmqxGatewayApiOcppMessageFormatChecking]
  mountpoint?: string
  name?: EmqxGatewayApiOcppName
  upstream?: GatewayOcppUpstream
}

export type EmqxGatewayApiNatsName =
  (typeof EmqxGatewayApiNatsName)[keyof typeof EmqxGatewayApiNatsName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiNatsName = {
  nats: 'nats',
} as const

export type EmqxGatewayApiNatsListenersItem =
  | EmqxGatewayApiSslListener
  | EmqxGatewayApiTcpListener
  | EmqxGatewayApiWsListener
  | EmqxGatewayApiWssListener

export type EmqxGatewayApiNatsInternalAuthnItem =
  | GatewayInternalAuthnJwt
  | GatewayInternalAuthnNkey
  | GatewayInternalAuthnToken

export interface EmqxGatewayApiNats {
  clientinfo_override?: GatewayClientinfoOverride
  default_heartbeat_interval?: string
  enable?: boolean
  enable_stats?: boolean
  heartbeat_wait_timeout?: string
  idle_timeout?: string
  internal_authn?: EmqxGatewayApiNatsInternalAuthnItem[]
  listeners?: EmqxGatewayApiNatsListenersItem[]
  mountpoint?: string
  name?: EmqxGatewayApiNatsName
  protocol?: GatewayProtocol
  server_id?: string
  server_name?: string
}

export type EmqxGatewayApiMqttsnName =
  (typeof EmqxGatewayApiMqttsnName)[keyof typeof EmqxGatewayApiMqttsnName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiMqttsnName = {
  mqttsn: 'mqttsn',
} as const

export type EmqxGatewayApiMqttsnListenersItem =
  | EmqxGatewayApiDtlsListener
  | EmqxGatewayApiUdpListener

export interface EmqxGatewayApiMqttsn {
  broadcast?: boolean
  clientinfo_override?: GatewayClientinfoOverride
  enable?: boolean
  enable_qos3?: boolean
  enable_stats?: boolean
  gateway_id: number
  idle_timeout?: string
  listeners?: EmqxGatewayApiMqttsnListenersItem[]
  mountpoint?: string
  name?: EmqxGatewayApiMqttsnName
  predefined?: GatewayMqttsnPredefined[]
  subs_resume?: boolean
}

export type EmqxGatewayApiLwm2mUpdateMsgPublishCondition =
  (typeof EmqxGatewayApiLwm2mUpdateMsgPublishCondition)[keyof typeof EmqxGatewayApiLwm2mUpdateMsgPublishCondition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiLwm2mUpdateMsgPublishCondition = {
  always: 'always',
  contains_object_list: 'contains_object_list',
} as const

export type EmqxGatewayApiLwm2mName =
  (typeof EmqxGatewayApiLwm2mName)[keyof typeof EmqxGatewayApiLwm2mName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiLwm2mName = {
  lwm2m: 'lwm2m',
} as const

export type EmqxGatewayApiLwm2mListenersItem =
  | EmqxGatewayApiDtlsListener
  | EmqxGatewayApiUdpListener

export type EmqxGatewayApiLwm2mAutoObserve = string[] | boolean | string

export interface EmqxGatewayApiLwm2m {
  auto_observe?: EmqxGatewayApiLwm2mAutoObserve
  blockwise?: GatewayLwm2mBlockwise
  clientinfo_override?: GatewayClientinfoOverride
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  lifetime_max?: string
  lifetime_min?: string
  listeners?: EmqxGatewayApiLwm2mListenersItem[]
  mountpoint?: string
  name?: EmqxGatewayApiLwm2mName
  qmode_time_window?: string
  translators: GatewayLwm2mTranslators
  update_msg_publish_condition?: EmqxGatewayApiLwm2mUpdateMsgPublishCondition
  xml_dir: string
}

export type EmqxGatewayApiJt808Name =
  (typeof EmqxGatewayApiJt808Name)[keyof typeof EmqxGatewayApiJt808Name]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiJt808Name = {
  jt808: 'jt808',
} as const

export type EmqxGatewayApiJt808ListenersItem = EmqxGatewayApiSslListener | EmqxGatewayApiTcpListener

export interface EmqxGatewayApiJt808 {
  clientinfo_override?: GatewayClientinfoOverride
  enable?: boolean
  enable_stats?: boolean
  frame?: GatewayJt808Frame
  idle_timeout?: string
  listeners?: EmqxGatewayApiJt808ListenersItem[]
  /** @minimum 0 */
  max_retry_times?: number
  /** @minimum 0 */
  message_queue_len?: number
  mountpoint?: string
  name?: EmqxGatewayApiJt808Name
  proto?: GatewayJt808Proto
  retry_interval?: string
}

export type EmqxGatewayApiGbt32960Name =
  (typeof EmqxGatewayApiGbt32960Name)[keyof typeof EmqxGatewayApiGbt32960Name]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGbt32960Name = {
  gbt32960: 'gbt32960',
} as const

export type EmqxGatewayApiGbt32960ListenersItem =
  | EmqxGatewayApiSslListener
  | EmqxGatewayApiTcpListener

export interface EmqxGatewayApiGbt32960 {
  clientinfo_override?: GatewayClientinfoOverride
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  listeners?: EmqxGatewayApiGbt32960ListenersItem[]
  /** @minimum 0 */
  max_retry_times?: number
  /** @minimum 0 */
  message_queue_len?: number
  mountpoint?: string
  name?: EmqxGatewayApiGbt32960Name
  retry_interval?: string
}

export type EmqxGatewayApiGatewayOverviewStatus =
  (typeof EmqxGatewayApiGatewayOverviewStatus)[keyof typeof EmqxGatewayApiGatewayOverviewStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGatewayOverviewStatus = {
  running: 'running',
  stopped: 'stopped',
  unloaded: 'unloaded',
} as const

export interface EmqxGatewayApiGatewayOverview {
  created_at?: string
  /** @minimum 0 */
  current_connections?: number
  listeners?: EmqxGatewayApiGatewayListenerOverview[]
  /** @minimum 1 */
  max_connections?: number
  name?: string
  node_status?: EmqxGatewayApiGatewayNodeStatus[]
  started_at?: string
  status?: EmqxGatewayApiGatewayOverviewStatus
  stopped_at?: string
}

export type EmqxGatewayApiGatewayNodeStatusStatus =
  (typeof EmqxGatewayApiGatewayNodeStatusStatus)[keyof typeof EmqxGatewayApiGatewayNodeStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGatewayNodeStatusStatus = {
  running: 'running',
  stopped: 'stopped',
  unloaded: 'unloaded',
} as const

export type EmqxGatewayApiGatewayNodeStatusNode =
  (typeof EmqxGatewayApiGatewayNodeStatusNode)[keyof typeof EmqxGatewayApiGatewayNodeStatusNode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGatewayNodeStatusNode = {
  'emqx@1721702': 'emqx@172.17.0.2',
} as const

export interface EmqxGatewayApiGatewayNodeStatus {
  /** @minimum 0 */
  current_connections?: number
  /** @minimum 1 */
  max_connections?: number
  node?: EmqxGatewayApiGatewayNodeStatusNode
  status?: EmqxGatewayApiGatewayNodeStatusStatus
}

export type EmqxGatewayApiGatewayListenerOverviewType =
  (typeof EmqxGatewayApiGatewayListenerOverviewType)[keyof typeof EmqxGatewayApiGatewayListenerOverviewType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGatewayListenerOverviewType = {
  dtls: 'dtls',
  ssl: 'ssl',
  tcp: 'tcp',
  udp: 'udp',
} as const

export interface EmqxGatewayApiGatewayListenerOverview {
  id?: string
  running?: boolean
  type?: EmqxGatewayApiGatewayListenerOverviewType
}

export type EmqxGatewayApiDtlsListenerType =
  (typeof EmqxGatewayApiDtlsListenerType)[keyof typeof EmqxGatewayApiDtlsListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiDtlsListenerType = {
  dtls: 'dtls',
} as const

export type EmqxGatewayApiDtlsListenerMaxConnections = 'infinity' | number

export interface EmqxGatewayApiDtlsListener {
  acceptors?: number
  access_rules?: string[]
  bind?: string
  dtls_options?: GatewayDtlsOpts
  enable?: boolean
  enable_authn?: boolean
  health_check?: GatewayUdpHealthCheck
  id?: string
  max_conn_rate?: number
  max_connections?: EmqxGatewayApiDtlsListenerMaxConnections
  mountpoint?: string
  name?: string
  running?: boolean
  type?: EmqxGatewayApiDtlsListenerType
  udp_options?: GatewayUdpOpts
}

export type EmqxGatewayApiCoapSubscribeQos =
  (typeof EmqxGatewayApiCoapSubscribeQos)[keyof typeof EmqxGatewayApiCoapSubscribeQos]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiCoapSubscribeQos = {
  coap: 'coap',
  qos0: 'qos0',
  qos1: 'qos1',
  qos2: 'qos2',
} as const

export type EmqxGatewayApiCoapPublishQos =
  (typeof EmqxGatewayApiCoapPublishQos)[keyof typeof EmqxGatewayApiCoapPublishQos]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiCoapPublishQos = {
  coap: 'coap',
  qos0: 'qos0',
  qos1: 'qos1',
  qos2: 'qos2',
} as const

export type EmqxGatewayApiCoapNotifyType =
  (typeof EmqxGatewayApiCoapNotifyType)[keyof typeof EmqxGatewayApiCoapNotifyType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiCoapNotifyType = {
  con: 'con',
  non: 'non',
  qos: 'qos',
} as const

export type EmqxGatewayApiCoapName =
  (typeof EmqxGatewayApiCoapName)[keyof typeof EmqxGatewayApiCoapName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiCoapName = {
  coap: 'coap',
} as const

export type EmqxGatewayApiCoapListenersItem = EmqxGatewayApiDtlsListener | EmqxGatewayApiUdpListener

export interface EmqxGatewayApiCoap {
  blockwise?: GatewayCoapBlockwise
  clientinfo_override?: GatewayClientinfoOverride
  connection_required?: boolean
  enable?: boolean
  enable_stats?: boolean
  heartbeat?: string
  idle_timeout?: string
  listeners?: EmqxGatewayApiCoapListenersItem[]
  mountpoint?: string
  name?: EmqxGatewayApiCoapName
  notify_type?: EmqxGatewayApiCoapNotifyType
  publish_qos?: EmqxGatewayApiCoapPublishQos
  subscribe_qos?: EmqxGatewayApiCoapSubscribeQos
}

export interface EmqxTcpOpts {
  /** @minimum 0 */
  active_n?: number
  /** @minimum 1 */
  backlog?: number
  buffer?: string
  high_watermark?: string
  keepalive?: string
  nodelay?: boolean
  nolinger?: boolean
  recbuf?: string
  reuseaddr?: boolean
  send_timeout?: string
  send_timeout_close?: boolean
  sndbuf?: string
}

export interface EmqxOcsp {
  enable_ocsp_stapling?: boolean
  issuer_pem?: string
  refresh_http_timeout?: string
  refresh_interval?: string
  responder_url?: string
}

export interface EmqxManagedCertsServer {
  bundle_name: string
  namespace?: string
  sni?: string
}

export type EmqxListenerWssOptsVerify =
  (typeof EmqxListenerWssOptsVerify)[keyof typeof EmqxListenerWssOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsVerify = {
  verify_none: 'verify_none',
  verify_peer: 'verify_peer',
} as const

export type EmqxListenerWssOptsSessionTickets =
  (typeof EmqxListenerWssOptsSessionTickets)[keyof typeof EmqxListenerWssOptsSessionTickets]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsSessionTickets = {
  disabled: 'disabled',
  stateless: 'stateless',
  stateless_with_cert: 'stateless_with_cert',
} as const

export type EmqxListenerWssOptsPartialChain =
  (typeof EmqxListenerWssOptsPartialChain)[keyof typeof EmqxListenerWssOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsPartialChain = {
  false: false,
  true: true,
  cacert_from_cacertfile: 'cacert_from_cacertfile',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
} as const

export type EmqxListenerWssOptsManagedCerts = EmqxManagedCertsServer | EmqxManagedCertsServer[]

export type EmqxListenerWssOptsLogLevel =
  (typeof EmqxListenerWssOptsLogLevel)[keyof typeof EmqxListenerWssOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsLogLevel = {
  alert: 'alert',
  all: 'all',
  critical: 'critical',
  debug: 'debug',
  emergency: 'emergency',
  error: 'error',
  info: 'info',
  none: 'none',
  notice: 'notice',
  warning: 'warning',
} as const

export interface EmqxListenerWssOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  client_renegotiation?: boolean
  /** @minimum 0 */
  depth?: number
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  handshake_timeout?: string
  hibernate_after?: string
  honor_cipher_order?: boolean
  keyfile?: string
  log_level?: EmqxListenerWssOptsLogLevel
  managed_certs?: EmqxListenerWssOptsManagedCerts
  partial_chain?: EmqxListenerWssOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  session_tickets?: EmqxListenerWssOptsSessionTickets
  verify?: EmqxListenerWssOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export type EmqxListenerSslOptsVerify =
  (typeof EmqxListenerSslOptsVerify)[keyof typeof EmqxListenerSslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsVerify = {
  verify_none: 'verify_none',
  verify_peer: 'verify_peer',
} as const

export type EmqxListenerSslOptsSessionTickets =
  (typeof EmqxListenerSslOptsSessionTickets)[keyof typeof EmqxListenerSslOptsSessionTickets]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsSessionTickets = {
  disabled: 'disabled',
  stateless: 'stateless',
  stateless_with_cert: 'stateless_with_cert',
} as const

export type EmqxListenerSslOptsPartialChain =
  (typeof EmqxListenerSslOptsPartialChain)[keyof typeof EmqxListenerSslOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsPartialChain = {
  false: false,
  true: true,
  cacert_from_cacertfile: 'cacert_from_cacertfile',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
} as const

export type EmqxListenerSslOptsManagedCerts = EmqxManagedCertsServer | EmqxManagedCertsServer[]

export type EmqxListenerSslOptsLogLevel =
  (typeof EmqxListenerSslOptsLogLevel)[keyof typeof EmqxListenerSslOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsLogLevel = {
  alert: 'alert',
  all: 'all',
  critical: 'critical',
  debug: 'debug',
  emergency: 'emergency',
  error: 'error',
  info: 'info',
  none: 'none',
  notice: 'notice',
  warning: 'warning',
} as const

export interface EmqxListenerSslOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  ciphers?: string[]
  client_renegotiation?: boolean
  /** @minimum 0 */
  depth?: number
  dhfile?: string
  enable_crl_check?: boolean
  fail_if_no_peer_cert?: boolean
  gc_after_handshake?: boolean
  handshake_timeout?: string
  hibernate_after?: string
  honor_cipher_order?: boolean
  keyfile?: string
  log_level?: EmqxListenerSslOptsLogLevel
  managed_certs?: EmqxListenerSslOptsManagedCerts
  ocsp?: EmqxOcsp
  partial_chain?: EmqxListenerSslOptsPartialChain
  password?: string
  reuse_sessions?: boolean
  secure_renegotiate?: boolean
  session_tickets?: EmqxListenerSslOptsSessionTickets
  verify?: EmqxListenerSslOptsVerify
  verify_peer_ext_key_usage?: string
  versions?: string[]
}

export type EmqxDeflateOptsStrategy =
  (typeof EmqxDeflateOptsStrategy)[keyof typeof EmqxDeflateOptsStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsStrategy = {
  default: 'default',
  filtered: 'filtered',
  huffman_only: 'huffman_only',
  rle: 'rle',
} as const

export type EmqxDeflateOptsServerContextTakeover =
  (typeof EmqxDeflateOptsServerContextTakeover)[keyof typeof EmqxDeflateOptsServerContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsServerContextTakeover = {
  no_takeover: 'no_takeover',
  takeover: 'takeover',
} as const

export type EmqxDeflateOptsLevel = (typeof EmqxDeflateOptsLevel)[keyof typeof EmqxDeflateOptsLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsLevel = {
  best_compression: 'best_compression',
  best_speed: 'best_speed',
  default: 'default',
  none: 'none',
} as const

export type EmqxDeflateOptsClientContextTakeover =
  (typeof EmqxDeflateOptsClientContextTakeover)[keyof typeof EmqxDeflateOptsClientContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsClientContextTakeover = {
  no_takeover: 'no_takeover',
  takeover: 'takeover',
} as const

export interface EmqxDeflateOpts {
  client_context_takeover?: EmqxDeflateOptsClientContextTakeover
  /**
   * @minimum 8
   * @maximum 15
   */
  client_max_window_bits?: number
  level?: EmqxDeflateOptsLevel
  /**
   * @minimum 1
   * @maximum 9
   */
  mem_level?: number
  server_context_takeover?: EmqxDeflateOptsServerContextTakeover
  /**
   * @minimum 8
   * @maximum 15
   */
  server_max_window_bits?: number
  strategy?: EmqxDeflateOptsStrategy
}
