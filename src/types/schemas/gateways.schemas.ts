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

export interface EmqxGatewayApiUpdateExproto {
  server: GatewayExprotoGrpcServer
  handler: GatewayExprotoGrpcHandler
  mountpoint?: string
  enable?: boolean
  enable_stats?: boolean
  idle_timeout?: string
  clientinfo_override?: GatewayClientinfoOverride
}

export type PutGatewaysNameBody =
  | EmqxGatewayApiUpdateStomp
  | EmqxGatewayApiUpdateMqttsn
  | EmqxGatewayApiUpdateLwm2m
  | EmqxGatewayApiUpdateExproto
  | EmqxGatewayApiUpdateCoap
  | EmqxGatewayApiStomp
  | EmqxGatewayApiMqttsn
  | EmqxGatewayApiLwm2m
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
  | EmqxGatewayApiMqttsn
  | EmqxGatewayApiLwm2m
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
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
  gc_after_handshake?: boolean
  ocsp?: EmqxOcsp
  enable_crl_check?: boolean
}

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
  dhfile?: string
  fail_if_no_peer_cert?: boolean
  honor_cipher_order?: boolean
  client_renegotiation?: boolean
  handshake_timeout?: string
  gc_after_handshake?: boolean
  ocsp?: EmqxOcsp
  enable_crl_check?: boolean
}

export interface EmqxGatewayApiUpdateStomp {
  frame?: GatewayStompFrame
  mountpoint?: string
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
