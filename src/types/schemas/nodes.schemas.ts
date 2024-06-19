export type GetNodesNode404Code = typeof GetNodesNode404Code[keyof typeof GetNodesNode404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetNodesNode404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetNodesNode404 = {
  code?: GetNodesNode404Code
  message?: string
}

export type GetNodesNodeMetrics404Code =
  typeof GetNodesNodeMetrics404Code[keyof typeof GetNodesNodeMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetNodesNodeMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetNodesNodeMetrics404 = {
  code?: GetNodesNodeMetrics404Code
  message?: string
}

export type GetNodesNodeStats404Code =
  typeof GetNodesNodeStats404Code[keyof typeof GetNodesNodeStats404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetNodesNodeStats404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetNodesNodeStats404 = {
  code?: GetNodesNodeStats404Code
  message?: string
}

export interface EmqxMgmtApiStatsAggregatedData {
  'channels.count'?: number
  'channels.max'?: number
  'connections.count'?: number
  'connections.max'?: number
  'delayed.count'?: number
  'delayed.max'?: number
  'live_connections.count'?: number
  'live_connections.max'?: number
  'cluster_sessions.count'?: number
  'cluster_sessions.max'?: number
  'retained.count'?: number
  'retained.max'?: number
  'sessions.count'?: number
  'sessions.max'?: number
  'suboptions.count'?: number
  'suboptions.max'?: number
  'subscribers.count'?: number
  'subscribers.max'?: number
  'subscriptions.count'?: number
  'subscriptions.max'?: number
  'subscriptions.shared.count'?: number
  'subscriptions.shared.max'?: number
  'topics.count'?: number
  'topics.max'?: number
}

export type EmqxMgmtApiNodesNodeInfoRole =
  typeof EmqxMgmtApiNodesNodeInfoRole[keyof typeof EmqxMgmtApiNodesNodeInfoRole]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiNodesNodeInfoRole = {
  core: 'core',
  replicant: 'replicant',
} as const

export type EmqxMgmtApiNodesNodeInfoEdition =
  typeof EmqxMgmtApiNodesNodeInfoEdition[keyof typeof EmqxMgmtApiNodesNodeInfoEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiNodesNodeInfoEdition = {
  Opensource: 'Opensource',
  Enterprise: 'Enterprise',
} as const

export type EmqxMgmtApiNodesNodeInfoNodeStatus =
  typeof EmqxMgmtApiNodesNodeInfoNodeStatus[keyof typeof EmqxMgmtApiNodesNodeInfoNodeStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiNodesNodeInfoNodeStatus = {
  running: 'running',
  stopped: 'stopped',
} as const

export interface EmqxMgmtApiNodesNodeInfo {
  node?: string
  connections?: number
  live_connections?: number
  cluster_sessions?: number
  load1?: number
  load5?: number
  load15?: number
  max_fds?: number
  memory_total?: string
  memory_used?: string
  node_status?: EmqxMgmtApiNodesNodeInfoNodeStatus
  otp_release?: string
  process_available?: number
  process_used?: number
  uptime?: number
  version?: string
  edition?: EmqxMgmtApiNodesNodeInfoEdition
  sys_path?: string
  log_path?: string
  role?: EmqxMgmtApiNodesNodeInfoRole
}

export interface EmqxMgmtApiMetricsNodeMetrics {
  node?: string
  'bytes.received'?: number
  'bytes.sent'?: number
  'packets.received'?: number
  'packets.sent'?: number
  'packets.connect.received'?: number
  'packets.connack.sent'?: number
  'packets.connack.error'?: number
  'packets.connack.auth_error'?: number
  'packets.publish.received'?: number
  'packets.publish.sent'?: number
  'packets.publish.inuse'?: number
  'packets.publish.error'?: number
  'packets.publish.auth_error'?: number
  'packets.publish.dropped'?: number
  'packets.puback.received'?: number
  'packets.puback.sent'?: number
  'packets.puback.inuse'?: number
  'packets.puback.missed'?: number
  'packets.pubrec.received'?: number
  'packets.pubrec.sent'?: number
  'packets.pubrec.inuse'?: number
  'packets.pubrec.missed'?: number
  'packets.pubrel.received'?: number
  'packets.pubrel.sent'?: number
  'packets.pubrel.missed'?: number
  'packets.pubcomp.received'?: number
  'packets.pubcomp.sent'?: number
  'packets.pubcomp.inuse'?: number
  'packets.pubcomp.missed'?: number
  'packets.subscribe.received'?: number
  'packets.subscribe.error'?: number
  'packets.subscribe.auth_error'?: number
  'packets.suback.sent'?: number
  'packets.unsubscribe.received'?: number
  'packets.unsubscribe.error'?: number
  'packets.unsuback.sent'?: number
  'packets.pingreq.received'?: number
  'packets.pingresp.sent'?: number
  'packets.disconnect.received'?: number
  'packets.disconnect.sent'?: number
  'packets.auth.received'?: number
  'packets.auth.sent'?: number
  'messages.received'?: number
  'messages.sent'?: number
  'messages.qos0.received'?: number
  'messages.qos0.sent'?: number
  'messages.qos1.received'?: number
  'messages.qos1.sent'?: number
  'messages.qos2.received'?: number
  'messages.qos2.sent'?: number
  'messages.publish'?: number
  'messages.dropped'?: number
  'messages.validation_failed'?: number
  'messages.validation_succeeded'?: number
  'messages.transformation_failed'?: number
  'messages.transformation_succeeded'?: number
  'messages.dropped.await_pubrel_timeout'?: number
  'messages.dropped.no_subscribers'?: number
  'messages.forward'?: number
  'messages.delayed'?: number
  'messages.delivered'?: number
  'messages.acked'?: number
  'messages.persisted'?: number
  'delivery.dropped'?: number
  'delivery.dropped.no_local'?: number
  'delivery.dropped.too_large'?: number
  'delivery.dropped.qos0_msg'?: number
  'delivery.dropped.queue_full'?: number
  'delivery.dropped.expired'?: number
  'client.connect'?: number
  'client.connack'?: number
  'client.connected'?: number
  'client.authenticate'?: number
  'client.auth.anonymous'?: number
  'client.authorize'?: number
  'client.subscribe'?: number
  'client.unsubscribe'?: number
  'client.disconnected'?: number
  'session.created'?: number
  'session.resumed'?: number
  'session.takenover'?: number
  'session.discarded'?: number
  'session.terminated'?: number
  'authorization.allow'?: number
  'authorization.deny'?: number
  'authorization.cache_hit'?: number
  'authorization.cache_miss'?: number
  'authentication.success'?: number
  'authentication.success.anonymous'?: number
  'authentication.failure'?: number
  'overload_protection.delay.ok'?: number
  'overload_protection.delay.timeout'?: number
  'overload_protection.hibernation'?: number
  'overload_protection.gc'?: number
  'overload_protection.new_conn'?: number
}
