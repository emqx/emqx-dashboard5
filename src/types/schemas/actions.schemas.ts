export type PostNodesNodeActionsIdOperation503Code =
  typeof PostNodesNodeActionsIdOperation503Code[keyof typeof PostNodesNodeActionsIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostNodesNodeActionsIdOperation503 = {
  code?: PostNodesNodeActionsIdOperation503Code
  message?: string
}

export type PostNodesNodeActionsIdOperation501Code =
  typeof PostNodesNodeActionsIdOperation501Code[keyof typeof PostNodesNodeActionsIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostNodesNodeActionsIdOperation501 = {
  code?: PostNodesNodeActionsIdOperation501Code
  message?: string
}

export type PostNodesNodeActionsIdOperation404Code =
  typeof PostNodesNodeActionsIdOperation404Code[keyof typeof PostNodesNodeActionsIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostNodesNodeActionsIdOperation404 = {
  code?: PostNodesNodeActionsIdOperation404Code
  message?: string
}

export type PostNodesNodeActionsIdOperation400Code =
  typeof PostNodesNodeActionsIdOperation400Code[keyof typeof PostNodesNodeActionsIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostNodesNodeActionsIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostNodesNodeActionsIdOperation400 = {
  code?: PostNodesNodeActionsIdOperation400Code
  message?: string
}

export type GetActionsIdMetrics404Code =
  typeof GetActionsIdMetrics404Code[keyof typeof GetActionsIdMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetActionsIdMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetActionsIdMetrics404 = {
  code?: GetActionsIdMetrics404Code
  message?: string
}

export type GetActionsIdMetrics200 = {
  metrics?: BridgeMetrics
  node_metrics?: BridgeNodeMetrics[]
}

export type DeleteActionsId503Code =
  typeof DeleteActionsId503Code[keyof typeof DeleteActionsId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteActionsId503 = {
  code?: DeleteActionsId503Code
  message?: string
}

export type DeleteActionsId404Code =
  typeof DeleteActionsId404Code[keyof typeof DeleteActionsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteActionsId404 = {
  code?: DeleteActionsId404Code
  message?: string
}

export type DeleteActionsId400Code =
  typeof DeleteActionsId400Code[keyof typeof DeleteActionsId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteActionsId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteActionsId400 = {
  rules?: string[]
  code?: DeleteActionsId400Code
  message?: string
}

export type DeleteActionsIdParams = {
  also_delete_dep_actions?: boolean
}

export type PutActionsId404Code = typeof PutActionsId404Code[keyof typeof PutActionsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsId404 = {
  code?: PutActionsId404Code
  message?: string
}

export type PutActionsId400Code = typeof PutActionsId400Code[keyof typeof PutActionsId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutActionsId400 = {
  code?: PutActionsId400Code
  message?: string
}

export type PutActionsId200 = BridgeMqttPublisherGetBridgeV2 | BridgeHttpGetBridgeV2

export type PutActionsIdBody = BridgeMqttPublisherPutBridgeV2 | BridgeHttpPutBridgeV2

export type GetActionsId404Code = typeof GetActionsId404Code[keyof typeof GetActionsId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetActionsId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetActionsId404 = {
  code?: GetActionsId404Code
  message?: string
}

export type GetActionsId200 = BridgeMqttPublisherGetBridgeV2 | BridgeHttpGetBridgeV2

export type GetActionTypes200Item = typeof GetActionTypes200Item[keyof typeof GetActionTypes200Item]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetActionTypes200Item = {
  http: 'http',
  mqtt: 'mqtt',
} as const

export type PostActionsProbe400Code =
  typeof PostActionsProbe400Code[keyof typeof PostActionsProbe400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsProbe400Code = {
  TEST_FAILED: 'TEST_FAILED',
} as const

export type PostActionsProbe400 = {
  code?: PostActionsProbe400Code
  message?: string
}

export type PostActionsProbeBody = BridgeMqttPublisherPostBridgeV2 | BridgeHttpPostBridgeV2

export type PostActions400Code = typeof PostActions400Code[keyof typeof PostActions400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActions400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostActions400 = {
  code?: PostActions400Code
  message?: string
}

export type PostActions201 = BridgeMqttPublisherGetBridgeV2 | BridgeHttpGetBridgeV2

export type PostActionsBody = BridgeMqttPublisherPostBridgeV2 | BridgeHttpPostBridgeV2

export type GetActions200Item = BridgeMqttPublisherGetBridgeV2 | BridgeHttpGetBridgeV2

export type PutActionsIdEnableEnable503Code =
  typeof PutActionsIdEnableEnable503Code[keyof typeof PutActionsIdEnableEnable503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdEnableEnable503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutActionsIdEnableEnable503 = {
  code?: PutActionsIdEnableEnable503Code
  message?: string
}

export type PutActionsIdEnableEnable404Code =
  typeof PutActionsIdEnableEnable404Code[keyof typeof PutActionsIdEnableEnable404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdEnableEnable404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsIdEnableEnable404 = {
  code?: PutActionsIdEnableEnable404Code
  message?: string
}

export type PostActionsIdOperation503Code =
  typeof PostActionsIdOperation503Code[keyof typeof PostActionsIdOperation503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostActionsIdOperation503 = {
  code?: PostActionsIdOperation503Code
  message?: string
}

export type PostActionsIdOperation501Code =
  typeof PostActionsIdOperation501Code[keyof typeof PostActionsIdOperation501Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation501Code = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
} as const

export type PostActionsIdOperation501 = {
  code?: PostActionsIdOperation501Code
  message?: string
}

export type PostActionsIdOperation404Code =
  typeof PostActionsIdOperation404Code[keyof typeof PostActionsIdOperation404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostActionsIdOperation404 = {
  code?: PostActionsIdOperation404Code
  message?: string
}

export type PostActionsIdOperation400Code =
  typeof PostActionsIdOperation400Code[keyof typeof PostActionsIdOperation400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostActionsIdOperation400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostActionsIdOperation400 = {
  code?: PostActionsIdOperation400Code
  message?: string
}

export type PutActionsIdMetricsReset404Code =
  typeof PutActionsIdMetricsReset404Code[keyof typeof PutActionsIdMetricsReset404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutActionsIdMetricsReset404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutActionsIdMetricsReset404 = {
  code?: PutActionsIdMetricsReset404Code
  message?: string
}

export type BridgeNodeStatusStatus =
  typeof BridgeNodeStatusStatus[keyof typeof BridgeNodeStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeNodeStatusStatus = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeNodeStatus {
  node?: string
  status?: BridgeNodeStatusStatus
  status_reason?: string
}

export interface BridgeMetrics {
  dropped?: number
  'dropped.other'?: number
  'dropped.queue_full'?: number
  'dropped.resource_not_found'?: number
  'dropped.resource_stopped'?: number
  matched?: number
  queuing?: number
  retried?: number
  failed?: number
  inflight?: number
  success?: number
  rate?: number
  rate_max?: number
  rate_last5m?: number
  received?: number
}

export interface BridgeNodeMetrics {
  node?: string
  metrics?: BridgeMetrics
}

export interface BridgeMqttPublisherPutBridgeV2 {
  local_topic?: string
  parameters: BridgeMqttPublisherActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export type BridgeMqttPublisherPostBridgeV2Type =
  typeof BridgeMqttPublisherPostBridgeV2Type[keyof typeof BridgeMqttPublisherPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherPostBridgeV2Type = {
  mqtt: 'mqtt',
} as const

export interface BridgeMqttPublisherPostBridgeV2 {
  type: BridgeMqttPublisherPostBridgeV2Type
  name: string
  local_topic?: string
  parameters: BridgeMqttPublisherActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export type BridgeMqttPublisherGetBridgeV2Status =
  typeof BridgeMqttPublisherGetBridgeV2Status[keyof typeof BridgeMqttPublisherGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export type BridgeMqttPublisherGetBridgeV2Type =
  typeof BridgeMqttPublisherGetBridgeV2Type[keyof typeof BridgeMqttPublisherGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherGetBridgeV2Type = {
  mqtt: 'mqtt',
} as const

export interface BridgeMqttPublisherGetBridgeV2 {
  type: BridgeMqttPublisherGetBridgeV2Type
  name: string
  status?: BridgeMqttPublisherGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  local_topic?: string
  parameters: BridgeMqttPublisherActionParameters
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  resource_opts?: BridgeMqttPublisherActionResourceOpts
}

export type BridgeMqttPublisherActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeMqttPublisherActionResourceOptsQueryMode =
  typeof BridgeMqttPublisherActionResourceOptsQueryMode[keyof typeof BridgeMqttPublisherActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeMqttPublisherActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeMqttPublisherActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeMqttPublisherActionResourceOptsQueryMode
  request_ttl?: BridgeMqttPublisherActionResourceOptsRequestTtl
  inflight_window?: number
  max_buffer_bytes?: string
}

export type BridgeMqttPublisherActionParametersRetain = string | boolean

export type BridgeMqttPublisherActionParametersQos = string | number

export interface BridgeMqttPublisherActionParameters {
  topic: string
  qos?: BridgeMqttPublisherActionParametersQos
  retain?: BridgeMqttPublisherActionParametersRetain
  payload?: string
}

export interface BridgeHttpPutBridgeV2 {
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHttpParametersOpts
  resource_opts?: BridgeHttpActionResourceOpts
}

export type BridgeHttpPostBridgeV2Type =
  typeof BridgeHttpPostBridgeV2Type[keyof typeof BridgeHttpPostBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpPostBridgeV2Type = {
  http: 'http',
} as const

export interface BridgeHttpPostBridgeV2 {
  type: BridgeHttpPostBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHttpParametersOpts
  resource_opts?: BridgeHttpActionResourceOpts
}

export type BridgeHttpParametersOptsHeaders = { [key: string]: any }

export type BridgeHttpParametersOptsMethod =
  typeof BridgeHttpParametersOptsMethod[keyof typeof BridgeHttpParametersOptsMethod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpParametersOptsMethod = {
  post: 'post',
  put: 'put',
  get: 'get',
  delete: 'delete',
} as const

export interface BridgeHttpParametersOpts {
  path?: string
  method?: BridgeHttpParametersOptsMethod
  headers?: BridgeHttpParametersOptsHeaders
  body?: string
  max_retries?: number
  /** @deprecated */
  request_timeout?: string
}

export type BridgeHttpGetBridgeV2Type =
  typeof BridgeHttpGetBridgeV2Type[keyof typeof BridgeHttpGetBridgeV2Type]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetBridgeV2Type = {
  http: 'http',
} as const

export type BridgeHttpGetBridgeV2Status =
  typeof BridgeHttpGetBridgeV2Status[keyof typeof BridgeHttpGetBridgeV2Status]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpGetBridgeV2Status = {
  connected: 'connected',
  disconnected: 'disconnected',
  connecting: 'connecting',
  inconsistent: 'inconsistent',
} as const

export interface BridgeHttpGetBridgeV2 {
  status?: BridgeHttpGetBridgeV2Status
  status_reason?: string
  node_status?: BridgeNodeStatus[]
  type: BridgeHttpGetBridgeV2Type
  name: string
  enable?: boolean
  connector: string
  tags?: string[]
  description?: string
  parameters: BridgeHttpParametersOpts
  resource_opts?: BridgeHttpActionResourceOpts
}

export type BridgeHttpActionResourceOptsRequestTtl = 'infinity' | string

export type BridgeHttpActionResourceOptsQueryMode =
  typeof BridgeHttpActionResourceOptsQueryMode[keyof typeof BridgeHttpActionResourceOptsQueryMode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const BridgeHttpActionResourceOptsQueryMode = {
  sync: 'sync',
  async: 'async',
} as const

export interface BridgeHttpActionResourceOpts {
  worker_pool_size?: number
  health_check_interval?: string
  query_mode?: BridgeHttpActionResourceOptsQueryMode
  request_ttl?: BridgeHttpActionResourceOptsRequestTtl
  inflight_window?: number
  max_buffer_bytes?: string
}
