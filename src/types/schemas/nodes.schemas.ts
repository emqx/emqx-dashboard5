export type GetNodesNodeStats404Code =
  (typeof GetNodesNodeStats404Code)[keyof typeof GetNodesNodeStats404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetNodesNodeStats404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetNodesNodeStats404 = {
  code?: GetNodesNodeStats404Code
  message?: string
}

export type GetNodesNodeMetrics404Code =
  (typeof GetNodesNodeMetrics404Code)[keyof typeof GetNodesNodeMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetNodesNodeMetrics404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetNodesNodeMetrics404 = {
  code?: GetNodesNodeMetrics404Code
  message?: string
}

export type GetNodesNode404Code = (typeof GetNodesNode404Code)[keyof typeof GetNodesNode404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetNodesNode404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetNodesNode404 = {
  code?: GetNodesNode404Code
  message?: string
}

export interface EmqxMgmtApiStatsAggregatedData {
  /** @minimum 0 */
  'channels.count'?: number
  /** @minimum 0 */
  'channels.max'?: number
  /** @minimum 0 */
  'cluster_sessions.count'?: number
  /** @minimum 0 */
  'cluster_sessions.max'?: number
  /** @minimum 0 */
  'connections.count'?: number
  /** @minimum 0 */
  'connections.max'?: number
  /** @minimum 0 */
  'delayed.count'?: number
  /** @minimum 0 */
  'delayed.max'?: number
  /** @minimum 0 */
  'live_connections.count'?: number
  /** @minimum 0 */
  'live_connections.max'?: number
  /** @minimum 0 */
  'retained.count'?: number
  /** @minimum 0 */
  'retained.max'?: number
  /** @minimum 0 */
  'sessions.count'?: number
  /** @minimum 0 */
  'sessions.max'?: number
  /** @minimum 0 */
  'suboptions.count'?: number
  /** @minimum 0 */
  'suboptions.max'?: number
  /** @minimum 0 */
  'subscribers.count'?: number
  /** @minimum 0 */
  'subscribers.max'?: number
  /** @minimum 0 */
  'subscriptions.count'?: number
  /** @minimum 0 */
  'subscriptions.max'?: number
  /** @minimum 0 */
  'subscriptions.shared.count'?: number
  /** @minimum 0 */
  'subscriptions.shared.max'?: number
  /** @minimum 0 */
  'topics.count'?: number
  /** @minimum 0 */
  'topics.max'?: number
}

export type EmqxMgmtApiNodesNodeInfoRole =
  (typeof EmqxMgmtApiNodesNodeInfoRole)[keyof typeof EmqxMgmtApiNodesNodeInfoRole]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiNodesNodeInfoRole = {
  core: 'core',
  replicant: 'replicant',
} as const

export type EmqxMgmtApiNodesNodeInfoNodeStatus =
  (typeof EmqxMgmtApiNodesNodeInfoNodeStatus)[keyof typeof EmqxMgmtApiNodesNodeInfoNodeStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiNodesNodeInfoNodeStatus = {
  running: 'running',
  stopped: 'stopped',
} as const

export type EmqxMgmtApiNodesNodeInfoEdition =
  (typeof EmqxMgmtApiNodesNodeInfoEdition)[keyof typeof EmqxMgmtApiNodesNodeInfoEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiNodesNodeInfoEdition = {
  Opensource: 'Opensource',
  Enterprise: 'Enterprise',
} as const

export interface EmqxMgmtApiNodesNodeInfo {
  /** @minimum 0 */
  cluster_sessions?: number
  /** @minimum 0 */
  connections?: number
  edition?: EmqxMgmtApiNodesNodeInfoEdition
  /** @minimum 0 */
  live_connections?: number
  load1?: number
  load15?: number
  load5?: number
  log_path?: string
  /** @minimum 0 */
  max_fds?: number
  memory_total?: string
  memory_used?: string
  node?: string
  node_status?: EmqxMgmtApiNodesNodeInfoNodeStatus
  otp_release?: string
  /** @minimum 0 */
  process_available?: number
  /** @minimum 0 */
  process_used?: number
  role?: EmqxMgmtApiNodesNodeInfoRole
  sys_path?: string
  /** @minimum 0 */
  uptime?: number
  version?: string
}

export interface EmqxMgmtApiMetricsNodeMetrics {
  /** @minimum 0 */
  'authentication.failure'?: number
  /** @minimum 0 */
  'authentication.success'?: number
  /** @minimum 0 */
  'authentication.success.anonymous'?: number
  /** @minimum 0 */
  'authorization.allow'?: number
  /** @minimum 0 */
  'authorization.cache_hit'?: number
  /** @minimum 0 */
  'authorization.cache_miss'?: number
  /** @minimum 0 */
  'authorization.deny'?: number
  /** @minimum 0 */
  'bytes.received'?: number
  /** @minimum 0 */
  'bytes.sent'?: number
  /** @minimum 0 */
  'client.auth.anonymous'?: number
  /** @minimum 0 */
  'client.authenticate'?: number
  /** @minimum 0 */
  'client.authorize'?: number
  /** @minimum 0 */
  'client.connack'?: number
  /** @minimum 0 */
  'client.connect'?: number
  /** @minimum 0 */
  'client.connected'?: number
  /** @minimum 0 */
  'client.disconnected'?: number
  /** @minimum 0 */
  'client.subscribe'?: number
  /** @minimum 0 */
  'client.unsubscribe'?: number
  /** @minimum 0 */
  'delivery.dropped'?: number
  /** @minimum 0 */
  'delivery.dropped.expired'?: number
  /** @minimum 0 */
  'delivery.dropped.no_local'?: number
  /** @minimum 0 */
  'delivery.dropped.qos0_msg'?: number
  /** @minimum 0 */
  'delivery.dropped.queue_full'?: number
  /** @minimum 0 */
  'delivery.dropped.too_large'?: number
  /** @minimum 0 */
  'messages.acked'?: number
  /** @minimum 0 */
  'messages.delayed'?: number
  /** @minimum 0 */
  'messages.delivered'?: number
  /** @minimum 0 */
  'messages.dropped'?: number
  /** @minimum 0 */
  'messages.dropped.await_pubrel_timeout'?: number
  /** @minimum 0 */
  'messages.dropped.no_subscribers'?: number
  /** @minimum 0 */
  'messages.dropped.quota_exceeded'?: number
  /** @minimum 0 */
  'messages.dropped.receive_maximum'?: number
  /** @minimum 0 */
  'messages.forward'?: number
  /** @minimum 0 */
  'messages.persisted'?: number
  /** @minimum 0 */
  'messages.publish'?: number
  /** @minimum 0 */
  'messages.qos0.received'?: number
  /** @minimum 0 */
  'messages.qos0.sent'?: number
  /** @minimum 0 */
  'messages.qos1.received'?: number
  /** @minimum 0 */
  'messages.qos1.sent'?: number
  /** @minimum 0 */
  'messages.qos2.received'?: number
  /** @minimum 0 */
  'messages.qos2.sent'?: number
  /** @minimum 0 */
  'messages.received'?: number
  /** @minimum 0 */
  'messages.sent'?: number
  /** @minimum 0 */
  'messages.transformation_failed'?: number
  /** @minimum 0 */
  'messages.transformation_succeeded'?: number
  /** @minimum 0 */
  'messages.validation_failed'?: number
  /** @minimum 0 */
  'messages.validation_succeeded'?: number
  node?: string
  /** @minimum 0 */
  'overload_protection.delay.ok'?: number
  /** @minimum 0 */
  'overload_protection.delay.timeout'?: number
  /** @minimum 0 */
  'overload_protection.gc'?: number
  /** @minimum 0 */
  'overload_protection.hibernation'?: number
  /** @minimum 0 */
  'overload_protection.new_conn'?: number
  /** @minimum 0 */
  'packets.auth.received'?: number
  /** @minimum 0 */
  'packets.auth.sent'?: number
  /** @minimum 0 */
  'packets.connack.auth_error'?: number
  /** @minimum 0 */
  'packets.connack.error'?: number
  /** @minimum 0 */
  'packets.connack.sent'?: number
  /** @minimum 0 */
  'packets.connect.received'?: number
  /** @minimum 0 */
  'packets.disconnect.received'?: number
  /** @minimum 0 */
  'packets.disconnect.sent'?: number
  /** @minimum 0 */
  'packets.pingreq.received'?: number
  /** @minimum 0 */
  'packets.pingresp.sent'?: number
  /** @minimum 0 */
  'packets.puback.inuse'?: number
  /** @minimum 0 */
  'packets.puback.missed'?: number
  /** @minimum 0 */
  'packets.puback.received'?: number
  /** @minimum 0 */
  'packets.puback.sent'?: number
  /** @minimum 0 */
  'packets.pubcomp.inuse'?: number
  /** @minimum 0 */
  'packets.pubcomp.missed'?: number
  /** @minimum 0 */
  'packets.pubcomp.received'?: number
  /** @minimum 0 */
  'packets.pubcomp.sent'?: number
  /** @minimum 0 */
  'packets.publish.auth_error'?: number
  /** @minimum 0 */
  'packets.publish.error'?: number
  /** @minimum 0 */
  'packets.publish.inuse'?: number
  /** @minimum 0 */
  'packets.publish.quota_exceeded'?: number
  /** @minimum 0 */
  'packets.publish.received'?: number
  /** @minimum 0 */
  'packets.publish.sent'?: number
  /** @minimum 0 */
  'packets.pubrec.inuse'?: number
  /** @minimum 0 */
  'packets.pubrec.missed'?: number
  /** @minimum 0 */
  'packets.pubrec.received'?: number
  /** @minimum 0 */
  'packets.pubrec.sent'?: number
  /** @minimum 0 */
  'packets.pubrel.missed'?: number
  /** @minimum 0 */
  'packets.pubrel.received'?: number
  /** @minimum 0 */
  'packets.pubrel.sent'?: number
  /** @minimum 0 */
  'packets.received'?: number
  /** @minimum 0 */
  'packets.sent'?: number
  /** @minimum 0 */
  'packets.suback.sent'?: number
  /** @minimum 0 */
  'packets.subscribe.auth_error'?: number
  /** @minimum 0 */
  'packets.subscribe.error'?: number
  /** @minimum 0 */
  'packets.subscribe.received'?: number
  /** @minimum 0 */
  'packets.unsuback.sent'?: number
  /** @minimum 0 */
  'packets.unsubscribe.error'?: number
  /** @minimum 0 */
  'packets.unsubscribe.received'?: number
  /** @minimum 0 */
  'session.created'?: number
  /** @minimum 0 */
  'session.discarded'?: number
  /** @minimum 0 */
  'session.resumed'?: number
  /** @minimum 0 */
  'session.takenover'?: number
  /** @minimum 0 */
  'session.terminated'?: number
}
