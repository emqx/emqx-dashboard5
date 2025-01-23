export type PutGatewaysName404Code =
  typeof PutGatewaysName404Code[keyof typeof PutGatewaysName404Code]

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
  typeof PutGatewaysName400Code[keyof typeof PutGatewaysName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutGatewaysName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutGatewaysName400 = {
  code?: PutGatewaysName400Code
  message?: string
}

export type PutGatewaysNameBody =
  | EmqxGatewayApiUpdateStomp
  | EmqxGatewayApiUpdateOcpp
  | EmqxGatewayApiUpdateMqttsn
  | EmqxGatewayApiUpdateLwm2m
  | EmqxGatewayApiUpdateJt808
  | EmqxGatewayApiUpdateGbt32960
  | EmqxGatewayApiUpdateExproto
  | EmqxGatewayApiUpdateCoap
  | EmqxGatewayApiStomp
  | EmqxGatewayApiOcpp
  | EmqxGatewayApiMqttsn
  | EmqxGatewayApiLwm2m
  | EmqxGatewayApiJt808
  | EmqxGatewayApiGbt32960
  | EmqxGatewayApiExproto
  | EmqxGatewayApiCoap

export type GetGatewaysName404Code =
  typeof GetGatewaysName404Code[keyof typeof GetGatewaysName404Code]

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
  | EmqxGatewayApiStomp
  | EmqxGatewayApiOcpp
  | EmqxGatewayApiMqttsn
  | EmqxGatewayApiLwm2m
  | EmqxGatewayApiJt808
  | EmqxGatewayApiGbt32960
  | EmqxGatewayApiExproto
  | EmqxGatewayApiCoap

export type GetGateways400Code = typeof GetGateways400Code[keyof typeof GetGateways400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGateways400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetGateways400 = {
  code?: GetGateways400Code
  message?: string
}

export type GetGatewaysStatus = typeof GetGatewaysStatus[keyof typeof GetGatewaysStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGatewaysStatus = {
  running: 'running',
  stopped: 'stopped',
  unloaded: 'unloaded',
} as const

export type GetGatewaysParams = {
  status?: GetGatewaysStatus
}

export type PutGatewaysNameEnableEnable404Code =
  typeof PutGatewaysNameEnableEnable404Code[keyof typeof PutGatewaysNameEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutGatewaysNameEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
} as const

export type PutGatewaysNameEnableEnable404 = {
  code?: PutGatewaysNameEnableEnable404Code
  message?: string
}

export type GatewayWebsocketMaxFrameSize = number | 'infinity'

export type GatewayWebsocketPiggyback =
  typeof GatewayWebsocketPiggyback[keyof typeof GatewayWebsocketPiggyback]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayWebsocketPiggyback = {
  single: 'single',
  multiple: 'multiple',
} as const

export interface GatewayWebsocket {
  path?: string
  piggyback?: GatewayWebsocketPiggyback
  compress?: boolean
  idle_timeout?: string
  max_frame_size?: GatewayWebsocketMaxFrameSize
  fail_if_no_subprotocol?: boolean
  supported_subprotocols?: string
  check_origin_enable?: boolean
  allow_origin_absence?: boolean
  check_origins?: string
  proxy_address_header?: string
  proxy_port_header?: string
  deflate_opts?: EmqxDeflateOpts
}

export interface GatewayUdpOpts {
  active_n?: number
  recbuf?: string
  sndbuf?: string
  buffer?: string
  reuseaddr?: boolean
}

export interface GatewayUdpHealthCheck {
  request?: string
  reply?: string
}

export interface GatewayTranslator {
  topic: string
  qos?: number
}

export interface GatewayStompFrame {
  max_headers?: number
  max_headers_length?: number
  max_body_length?: number
}

export type GatewaySslServerOptsPartialChain =
  typeof GatewaySslServerOptsPartialChain[keyof typeof GatewaySslServerOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewaySslServerOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type GatewaySslServerOptsLogLevel =
  typeof GatewaySslServerOptsLogLevel[keyof typeof GatewaySslServerOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewaySslServerOptsLogLevel = {
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

export type GatewaySslServerOptsVerify =
  typeof GatewaySslServerOptsVerify[keyof typeof GatewaySslServerOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewaySslServerOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface GatewaySslServerOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: GatewaySslServerOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: GatewaySslServerOptsLogLevel
  hibernate_after?: string
  partial_chain?: GatewaySslServerOptsPartialChain
  verify_peer_ext_key_usage?: string
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
}

export interface GatewayMqttsnPredefined {
  id: number
  topic: string
}

export interface GatewayLwm2mTranslators {
  command: GatewayTranslator
  response: GatewayTranslator
  notify: GatewayTranslator
  register: GatewayTranslator
  update: GatewayTranslator
}

export type GatewayJt808ProtoAuth = GatewayAnonymousFalse | GatewayAnonymousTrue

export interface GatewayJt808Proto {
  auth?: GatewayJt808ProtoAuth
  up_topic: string
  dn_topic: string
}

export interface GatewayJt808Frame {
  max_length?: number
}

export interface GatewayExprotoGrpcServer {
  bind: string
  ssl_options?: GatewaySslServerOpts
}

export type GatewayExprotoGrpcHandlerServiceName =
  typeof GatewayExprotoGrpcHandlerServiceName[keyof typeof GatewayExprotoGrpcHandlerServiceName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayExprotoGrpcHandlerServiceName = {
  ConnectionUnaryHandler: 'ConnectionUnaryHandler',
  ConnectionHandler: 'ConnectionHandler',
} as const

export interface GatewayExprotoGrpcHandler {
  address: string
  service_name: GatewayExprotoGrpcHandlerServiceName
  ssl_options?: EmqxSslClientOpts
}

export type GatewayDtlsOptsPartialChain =
  typeof GatewayDtlsOptsPartialChain[keyof typeof GatewayDtlsOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayDtlsOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type GatewayDtlsOptsLogLevel =
  typeof GatewayDtlsOptsLogLevel[keyof typeof GatewayDtlsOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayDtlsOptsLogLevel = {
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

export type GatewayDtlsOptsVerify = typeof GatewayDtlsOptsVerify[keyof typeof GatewayDtlsOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GatewayDtlsOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface GatewayClientinfoOverride {
  username?: string
  password?: string
  clientid?: string
}

export interface GatewayAnonymousTrue {
  allow_anonymous: 'true'
  registry?: string
  authentication?: string
}

export interface GatewayAnonymousFalse {
  allow_anonymous: 'false'
  registry: string
  authentication: string
}

export type GatewayOcppUpstreamTopicOverrideMapping = {
  $name?: string
}

export interface GatewayOcppUpstream {
  topic: string
  topic_override_mapping?: GatewayOcppUpstreamTopicOverrideMapping
  reply_topic: string
  error_topic: string
}

export interface GatewayOcppDnstream {
  topic: string
  max_mqueue_len?: number
}

export interface EmqxTcpOpts {
  active_n?: number
  backlog?: number
  send_timeout?: string
  send_timeout_close?: boolean
  recbuf?: string
  sndbuf?: string
  buffer?: string
  high_watermark?: string
  nodelay?: boolean
  nolinger?: boolean
  reuseaddr?: boolean
  keepalive?: string
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

export interface EmqxOcsp {
  enable_ocsp_stapling?: boolean
  responder_url?: string
  issuer_pem?: string
  refresh_interval?: string
  refresh_http_timeout?: string
}

export interface GatewayDtlsOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: GatewayDtlsOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: GatewayDtlsOptsLogLevel
  hibernate_after?: string
  partial_chain?: GatewayDtlsOptsPartialChain
  verify_peer_ext_key_usage?: string
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
  gc_after_handshake?: boolean
  ocsp?: EmqxOcsp
  enable_crl_check?: boolean
}

export type EmqxListenerWssOptsPartialChain =
  typeof EmqxListenerWssOptsPartialChain[keyof typeof EmqxListenerWssOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxListenerWssOptsLogLevel =
  typeof EmqxListenerWssOptsLogLevel[keyof typeof EmqxListenerWssOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsLogLevel = {
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

export type EmqxListenerWssOptsVerify =
  typeof EmqxListenerWssOptsVerify[keyof typeof EmqxListenerWssOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerWssOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxListenerWssOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxListenerWssOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxListenerWssOptsLogLevel
  hibernate_after?: string
  partial_chain?: EmqxListenerWssOptsPartialChain
  verify_peer_ext_key_usage?: string
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
}

export type EmqxListenerSslOptsPartialChain =
  typeof EmqxListenerSslOptsPartialChain[keyof typeof EmqxListenerSslOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxListenerSslOptsLogLevel =
  typeof EmqxListenerSslOptsLogLevel[keyof typeof EmqxListenerSslOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsLogLevel = {
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

export type EmqxListenerSslOptsVerify =
  typeof EmqxListenerSslOptsVerify[keyof typeof EmqxListenerSslOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxListenerSslOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxListenerSslOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxListenerSslOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxListenerSslOptsLogLevel
  hibernate_after?: string
  partial_chain?: EmqxListenerSslOptsPartialChain
  verify_peer_ext_key_usage?: string
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
  gc_after_handshake?: boolean
  ocsp?: EmqxOcsp
  enable_crl_check?: boolean
}

export type EmqxDeflateOptsClientContextTakeover =
  typeof EmqxDeflateOptsClientContextTakeover[keyof typeof EmqxDeflateOptsClientContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsClientContextTakeover = {
  takeover: 'takeover',
  no_takeover: 'no_takeover',
} as const

export type EmqxDeflateOptsServerContextTakeover =
  typeof EmqxDeflateOptsServerContextTakeover[keyof typeof EmqxDeflateOptsServerContextTakeover]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsServerContextTakeover = {
  takeover: 'takeover',
  no_takeover: 'no_takeover',
} as const

export type EmqxDeflateOptsStrategy =
  typeof EmqxDeflateOptsStrategy[keyof typeof EmqxDeflateOptsStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsStrategy = {
  default: 'default',
  filtered: 'filtered',
  huffman_only: 'huffman_only',
  rle: 'rle',
} as const

export type EmqxDeflateOptsLevel = typeof EmqxDeflateOptsLevel[keyof typeof EmqxDeflateOptsLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxDeflateOptsLevel = {
  none: 'none',
  default: 'default',
  best_compression: 'best_compression',
  best_speed: 'best_speed',
} as const

export interface EmqxDeflateOpts {
  level?: EmqxDeflateOptsLevel
  mem_level?: number
  strategy?: EmqxDeflateOptsStrategy
  server_context_takeover?: EmqxDeflateOptsServerContextTakeover
  client_context_takeover?: EmqxDeflateOptsClientContextTakeover
  server_max_window_bits?: number
  client_max_window_bits?: number
}

export type EmqxGatewayApiWssListenerMaxConnections = 'infinity' | number

export type EmqxGatewayApiWssListenerType =
  typeof EmqxGatewayApiWssListenerType[keyof typeof EmqxGatewayApiWssListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiWssListenerType = {
  wss: 'wss',
} as const

export interface EmqxGatewayApiWssListener {
  id?: string
  type?: EmqxGatewayApiWssListenerType
  name?: string
  running?: boolean
  acceptors?: number
  tcp_options?: EmqxTcpOpts
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  enable?: boolean
  bind?: string
  max_connections?: EmqxGatewayApiWssListenerMaxConnections
  max_conn_rate?: number
  enable_authn?: boolean
  mountpoint?: string
  access_rules?: string[]
  ssl_options?: EmqxListenerWssOpts
  websocket?: GatewayWebsocket
}

export type EmqxGatewayApiWsListenerMaxConnections = 'infinity' | number

export type EmqxGatewayApiWsListenerType =
  typeof EmqxGatewayApiWsListenerType[keyof typeof EmqxGatewayApiWsListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiWsListenerType = {
  ws: 'ws',
} as const

export interface EmqxGatewayApiWsListener {
  id?: string
  type?: EmqxGatewayApiWsListenerType
  name?: string
  running?: boolean
  acceptors?: number
  tcp_options?: EmqxTcpOpts
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  enable?: boolean
  bind?: string
  max_connections?: EmqxGatewayApiWsListenerMaxConnections
  max_conn_rate?: number
  enable_authn?: boolean
  mountpoint?: string
  access_rules?: string[]
  websocket?: GatewayWebsocket
}

export interface EmqxGatewayApiUpdateStomp {
  frame?: GatewayStompFrame
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export type EmqxGatewayApiUpdateOcppMessageFormatChecking =
  typeof EmqxGatewayApiUpdateOcppMessageFormatChecking[keyof typeof EmqxGatewayApiUpdateOcppMessageFormatChecking]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiUpdateOcppMessageFormatChecking = {
  disable: 'disable',
  dnstream_only: 'dnstream_only',
  upstream_only: 'upstream_only',
  all: 'all',
} as const

export interface EmqxGatewayApiUpdateOcpp {
  mountpoint?: string
  default_heartbeat_interval: string
  heartbeat_checking_times_backoff?: number
  upstream?: GatewayOcppUpstream
  dnstream?: GatewayOcppDnstream
  message_format_checking?: EmqxGatewayApiUpdateOcppMessageFormatChecking
  json_schema_dir?: string
  json_schema_id_prefix?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export interface EmqxGatewayApiUpdateMqttsn {
  gateway_id: number
  broadcast?: boolean
  enable_qos3?: boolean
  subs_resume?: boolean
  predefined?: GatewayMqttsnPredefined[]
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export type EmqxGatewayApiUpdateLwm2mUpdateMsgPublishCondition =
  typeof EmqxGatewayApiUpdateLwm2mUpdateMsgPublishCondition[keyof typeof EmqxGatewayApiUpdateLwm2mUpdateMsgPublishCondition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiUpdateLwm2mUpdateMsgPublishCondition = {
  always: 'always',
  contains_object_list: 'contains_object_list',
} as const

export interface EmqxGatewayApiUpdateLwm2m {
  xml_dir: string
  lifetime_min?: string
  lifetime_max?: string
  qmode_time_window?: string
  auto_observe?: boolean
  update_msg_publish_condition?: EmqxGatewayApiUpdateLwm2mUpdateMsgPublishCondition
  translators: GatewayLwm2mTranslators
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export interface EmqxGatewayApiUpdateJt808 {
  frame?: GatewayJt808Frame
  proto?: GatewayJt808Proto
  mountpoint?: string
  retry_interval?: string
  max_retry_times?: number
  message_queue_len?: number
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export interface EmqxGatewayApiUpdateGbt32960 {
  mountpoint?: string
  retry_interval?: string
  max_retry_times?: number
  message_queue_len?: number
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export interface EmqxGatewayApiUpdateExproto {
  server: GatewayExprotoGrpcServer
  handler: GatewayExprotoGrpcHandler
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export type EmqxGatewayApiUpdateCoapPublishQos =
  typeof EmqxGatewayApiUpdateCoapPublishQos[keyof typeof EmqxGatewayApiUpdateCoapPublishQos]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiUpdateCoapPublishQos = {
  qos0: 'qos0',
  qos1: 'qos1',
  qos2: 'qos2',
  coap: 'coap',
} as const

export type EmqxGatewayApiUpdateCoapSubscribeQos =
  typeof EmqxGatewayApiUpdateCoapSubscribeQos[keyof typeof EmqxGatewayApiUpdateCoapSubscribeQos]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiUpdateCoapSubscribeQos = {
  qos0: 'qos0',
  qos1: 'qos1',
  qos2: 'qos2',
  coap: 'coap',
} as const

export type EmqxGatewayApiUpdateCoapNotifyType =
  typeof EmqxGatewayApiUpdateCoapNotifyType[keyof typeof EmqxGatewayApiUpdateCoapNotifyType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiUpdateCoapNotifyType = {
  non: 'non',
  con: 'con',
  qos: 'qos',
} as const

export interface EmqxGatewayApiUpdateCoap {
  heartbeat?: string
  connection_required?: boolean
  notify_type?: EmqxGatewayApiUpdateCoapNotifyType
  subscribe_qos?: EmqxGatewayApiUpdateCoapSubscribeQos
  publish_qos?: EmqxGatewayApiUpdateCoapPublishQos
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export type EmqxGatewayApiUdpListenerMaxConnections = 'infinity' | number

export type EmqxGatewayApiUdpListenerType =
  typeof EmqxGatewayApiUdpListenerType[keyof typeof EmqxGatewayApiUdpListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiUdpListenerType = {
  udp: 'udp',
} as const

export interface EmqxGatewayApiUdpListener {
  id?: string
  type?: EmqxGatewayApiUdpListenerType
  name?: string
  running?: boolean
  health_check?: GatewayUdpHealthCheck
  udp_options?: GatewayUdpOpts
  enable?: boolean
  bind?: string
  max_connections?: EmqxGatewayApiUdpListenerMaxConnections
  max_conn_rate?: number
  enable_authn?: boolean
  mountpoint?: string
  access_rules?: string[]
}

export type EmqxGatewayApiTcpListenerMaxConnections = 'infinity' | number

export type EmqxGatewayApiTcpListenerType =
  typeof EmqxGatewayApiTcpListenerType[keyof typeof EmqxGatewayApiTcpListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiTcpListenerType = {
  tcp: 'tcp',
} as const

export interface EmqxGatewayApiTcpListener {
  id?: string
  type?: EmqxGatewayApiTcpListenerType
  name?: string
  running?: boolean
  acceptors?: number
  tcp_options?: EmqxTcpOpts
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  enable?: boolean
  bind?: string
  max_connections?: EmqxGatewayApiTcpListenerMaxConnections
  max_conn_rate?: number
  enable_authn?: boolean
  mountpoint?: string
  access_rules?: string[]
}

export type EmqxGatewayApiStompName =
  typeof EmqxGatewayApiStompName[keyof typeof EmqxGatewayApiStompName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiStompName = {
  stomp: 'stomp',
} as const

export type EmqxGatewayApiSslListenerMaxConnections = 'infinity' | number

export type EmqxGatewayApiSslListenerType =
  typeof EmqxGatewayApiSslListenerType[keyof typeof EmqxGatewayApiSslListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiSslListenerType = {
  ssl: 'ssl',
} as const

export interface EmqxGatewayApiSslListener {
  id?: string
  type?: EmqxGatewayApiSslListenerType
  name?: string
  running?: boolean
  acceptors?: number
  tcp_options?: EmqxTcpOpts
  proxy_protocol?: boolean
  proxy_protocol_timeout?: string
  enable?: boolean
  bind?: string
  max_connections?: EmqxGatewayApiSslListenerMaxConnections
  max_conn_rate?: number
  enable_authn?: boolean
  mountpoint?: string
  access_rules?: string[]
  ssl_options?: EmqxListenerSslOpts
}

export type EmqxGatewayApiStompListenersItem = EmqxGatewayApiSslListener | EmqxGatewayApiTcpListener

export interface EmqxGatewayApiStomp {
  name?: EmqxGatewayApiStompName
  frame?: GatewayStompFrame
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
  listeners?: EmqxGatewayApiStompListenersItem[]
}

export type EmqxGatewayApiOcppListenersItem = EmqxGatewayApiWssListener | EmqxGatewayApiWsListener

export type EmqxGatewayApiOcppMessageFormatChecking =
  typeof EmqxGatewayApiOcppMessageFormatChecking[keyof typeof EmqxGatewayApiOcppMessageFormatChecking]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiOcppMessageFormatChecking = {
  disable: 'disable',
  dnstream_only: 'dnstream_only',
  upstream_only: 'upstream_only',
  all: 'all',
} as const

export type EmqxGatewayApiOcppName =
  typeof EmqxGatewayApiOcppName[keyof typeof EmqxGatewayApiOcppName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiOcppName = {
  ocpp: 'ocpp',
} as const

export interface EmqxGatewayApiOcpp {
  name?: EmqxGatewayApiOcppName
  mountpoint?: string
  default_heartbeat_interval: string
  heartbeat_checking_times_backoff?: number
  upstream?: GatewayOcppUpstream
  dnstream?: GatewayOcppDnstream
  message_format_checking?: EmqxGatewayApiOcppMessageFormatChecking
  json_schema_dir?: string
  json_schema_id_prefix?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
  listeners?: EmqxGatewayApiOcppListenersItem[]
}

export type EmqxGatewayApiMqttsnListenersItem =
  | EmqxGatewayApiDtlsListener
  | EmqxGatewayApiUdpListener

export type EmqxGatewayApiMqttsnName =
  typeof EmqxGatewayApiMqttsnName[keyof typeof EmqxGatewayApiMqttsnName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiMqttsnName = {
  mqttsn: 'mqttsn',
} as const

export interface EmqxGatewayApiMqttsn {
  name?: EmqxGatewayApiMqttsnName
  gateway_id: number
  broadcast?: boolean
  enable_qos3?: boolean
  subs_resume?: boolean
  predefined?: GatewayMqttsnPredefined[]
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
  listeners?: EmqxGatewayApiMqttsnListenersItem[]
}

export type EmqxGatewayApiLwm2mListenersItem =
  | EmqxGatewayApiDtlsListener
  | EmqxGatewayApiUdpListener

export type EmqxGatewayApiLwm2mUpdateMsgPublishCondition =
  typeof EmqxGatewayApiLwm2mUpdateMsgPublishCondition[keyof typeof EmqxGatewayApiLwm2mUpdateMsgPublishCondition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiLwm2mUpdateMsgPublishCondition = {
  always: 'always',
  contains_object_list: 'contains_object_list',
} as const

export type EmqxGatewayApiLwm2mName =
  typeof EmqxGatewayApiLwm2mName[keyof typeof EmqxGatewayApiLwm2mName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiLwm2mName = {
  lwm2m: 'lwm2m',
} as const

export interface EmqxGatewayApiLwm2m {
  name?: EmqxGatewayApiLwm2mName
  xml_dir: string
  lifetime_min?: string
  lifetime_max?: string
  qmode_time_window?: string
  auto_observe?: boolean
  update_msg_publish_condition?: EmqxGatewayApiLwm2mUpdateMsgPublishCondition
  translators: GatewayLwm2mTranslators
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
  listeners?: EmqxGatewayApiLwm2mListenersItem[]
}

export type EmqxGatewayApiJt808ListenersItem = EmqxGatewayApiSslListener | EmqxGatewayApiTcpListener

export type EmqxGatewayApiJt808Name =
  typeof EmqxGatewayApiJt808Name[keyof typeof EmqxGatewayApiJt808Name]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiJt808Name = {
  jt808: 'jt808',
} as const

export interface EmqxGatewayApiJt808 {
  name?: EmqxGatewayApiJt808Name
  frame?: GatewayJt808Frame
  proto?: GatewayJt808Proto
  mountpoint?: string
  retry_interval?: string
  max_retry_times?: number
  message_queue_len?: number
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
  listeners?: EmqxGatewayApiJt808ListenersItem[]
}

export type EmqxGatewayApiGbt32960ListenersItem =
  | EmqxGatewayApiSslListener
  | EmqxGatewayApiTcpListener

export type EmqxGatewayApiGbt32960Name =
  typeof EmqxGatewayApiGbt32960Name[keyof typeof EmqxGatewayApiGbt32960Name]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGbt32960Name = {
  gbt32960: 'gbt32960',
} as const

export interface EmqxGatewayApiGbt32960 {
  name?: EmqxGatewayApiGbt32960Name
  mountpoint?: string
  retry_interval?: string
  max_retry_times?: number
  message_queue_len?: number
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
  listeners?: EmqxGatewayApiGbt32960ListenersItem[]
}

export type EmqxGatewayApiGatewayOverviewStatus =
  typeof EmqxGatewayApiGatewayOverviewStatus[keyof typeof EmqxGatewayApiGatewayOverviewStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGatewayOverviewStatus = {
  running: 'running',
  stopped: 'stopped',
  unloaded: 'unloaded',
} as const

export interface EmqxGatewayApiGatewayOverview {
  name?: string
  status?: EmqxGatewayApiGatewayOverviewStatus
  created_at?: string
  started_at?: string
  stopped_at?: string
  max_connections?: number
  current_connections?: number
  listeners?: EmqxGatewayApiGatewayListenerOverview[]
  node_status?: EmqxGatewayApiGatewayNodeStatus[]
}

export type EmqxGatewayApiGatewayNodeStatusStatus =
  typeof EmqxGatewayApiGatewayNodeStatusStatus[keyof typeof EmqxGatewayApiGatewayNodeStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGatewayNodeStatusStatus = {
  running: 'running',
  stopped: 'stopped',
  unloaded: 'unloaded',
} as const

export type EmqxGatewayApiGatewayNodeStatusNode =
  typeof EmqxGatewayApiGatewayNodeStatusNode[keyof typeof EmqxGatewayApiGatewayNodeStatusNode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGatewayNodeStatusNode = {
  'emqx@1721702': 'emqx@172.17.0.2',
} as const

export interface EmqxGatewayApiGatewayNodeStatus {
  node?: EmqxGatewayApiGatewayNodeStatusNode
  status?: EmqxGatewayApiGatewayNodeStatusStatus
  max_connections?: number
  current_connections?: number
}

export type EmqxGatewayApiGatewayListenerOverviewType =
  typeof EmqxGatewayApiGatewayListenerOverviewType[keyof typeof EmqxGatewayApiGatewayListenerOverviewType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiGatewayListenerOverviewType = {
  tcp: 'tcp',
  ssl: 'ssl',
  udp: 'udp',
  dtls: 'dtls',
} as const

export interface EmqxGatewayApiGatewayListenerOverview {
  id?: string
  running?: boolean
  type?: EmqxGatewayApiGatewayListenerOverviewType
}

export type EmqxGatewayApiExprotoListenersItem =
  | EmqxGatewayApiDtlsListener
  | EmqxGatewayApiUdpListener
  | EmqxGatewayApiSslListener
  | EmqxGatewayApiTcpListener

export type EmqxGatewayApiExprotoName =
  typeof EmqxGatewayApiExprotoName[keyof typeof EmqxGatewayApiExprotoName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiExprotoName = {
  exproto: 'exproto',
} as const

export interface EmqxGatewayApiExproto {
  name?: EmqxGatewayApiExprotoName
  server: GatewayExprotoGrpcServer
  handler: GatewayExprotoGrpcHandler
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
  listeners?: EmqxGatewayApiExprotoListenersItem[]
}

export type EmqxGatewayApiDtlsListenerMaxConnections = 'infinity' | number

export type EmqxGatewayApiDtlsListenerType =
  typeof EmqxGatewayApiDtlsListenerType[keyof typeof EmqxGatewayApiDtlsListenerType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiDtlsListenerType = {
  dtls: 'dtls',
} as const

export interface EmqxGatewayApiDtlsListener {
  id?: string
  type?: EmqxGatewayApiDtlsListenerType
  name?: string
  running?: boolean
  acceptors?: number
  health_check?: GatewayUdpHealthCheck
  udp_options?: GatewayUdpOpts
  enable?: boolean
  bind?: string
  max_connections?: EmqxGatewayApiDtlsListenerMaxConnections
  max_conn_rate?: number
  enable_authn?: boolean
  mountpoint?: string
  access_rules?: string[]
  dtls_options?: GatewayDtlsOpts
}

export type EmqxGatewayApiCoapListenersItem = EmqxGatewayApiDtlsListener | EmqxGatewayApiUdpListener

export type EmqxGatewayApiCoapPublishQos =
  typeof EmqxGatewayApiCoapPublishQos[keyof typeof EmqxGatewayApiCoapPublishQos]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiCoapPublishQos = {
  qos0: 'qos0',
  qos1: 'qos1',
  qos2: 'qos2',
  coap: 'coap',
} as const

export type EmqxGatewayApiCoapSubscribeQos =
  typeof EmqxGatewayApiCoapSubscribeQos[keyof typeof EmqxGatewayApiCoapSubscribeQos]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiCoapSubscribeQos = {
  qos0: 'qos0',
  qos1: 'qos1',
  qos2: 'qos2',
  coap: 'coap',
} as const

export type EmqxGatewayApiCoapNotifyType =
  typeof EmqxGatewayApiCoapNotifyType[keyof typeof EmqxGatewayApiCoapNotifyType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiCoapNotifyType = {
  non: 'non',
  con: 'con',
  qos: 'qos',
} as const

export type EmqxGatewayApiCoapName =
  typeof EmqxGatewayApiCoapName[keyof typeof EmqxGatewayApiCoapName]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxGatewayApiCoapName = {
  coap: 'coap',
} as const

export interface EmqxGatewayApiCoap {
  name?: EmqxGatewayApiCoapName
  heartbeat?: string
  connection_required?: boolean
  notify_type?: EmqxGatewayApiCoapNotifyType
  subscribe_qos?: EmqxGatewayApiCoapSubscribeQos
  publish_qos?: EmqxGatewayApiCoapPublishQos
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
  listeners?: EmqxGatewayApiCoapListenersItem[]
}
