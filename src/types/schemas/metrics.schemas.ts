export type GetMonitor400Code = typeof GetMonitor400Code[keyof typeof GetMonitor400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMonitor400Code = {
  BAD_RPC: 'BAD_RPC',
} as const

export type GetMonitor400 = {
  code?: GetMonitor400Code
  message?: string
}

export type GetMonitorParams = {
  latest?: number
}

export type GetMonitorNodesNode404Code =
  typeof GetMonitorNodesNode404Code[keyof typeof GetMonitorNodesNode404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMonitorNodesNode404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMonitorNodesNode404 = {
  code?: GetMonitorNodesNode404Code
  message?: string
}

export type GetMonitorNodesNodeParams = {
  latest?: number
}

export type GetMonitorCurrentNodesNode404Code =
  typeof GetMonitorCurrentNodesNode404Code[keyof typeof GetMonitorCurrentNodesNode404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMonitorCurrentNodesNode404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMonitorCurrentNodesNode404 = {
  code?: GetMonitorCurrentNodesNode404Code
  message?: string
}

export type GetStats200 = EmqxMgmtApiStatsAggregatedData | EmqxMgmtApiStatsPerNodeData[]

export type GetStatsParams = {
  aggregate?: EmqxMgmtApiStatsAggregateParameter
}

export type GetMetrics200 = EmqxMgmtApiMetricsNodeMetrics[] | EmqxMgmtApiMetricsAggregatedMetrics

export type GetMetricsParams = {
  aggregate?: boolean
}

export type EmqxMgmtApiStatsAggregateParameter = boolean

export interface EmqxMgmtApiStatsPerNodeData {
  node?: string
  'durable_subscriptions.count'?: number
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

export interface EmqxMgmtApiMetricsNodeMetrics {
  node?: string
  'actions.failure'?: number
  'actions.success'?: number
  'bytes.received'?: number
  'bytes.sent'?: number
  'client.auth.anonymous'?: number
  'client.authenticate'?: number
  'client.check_authz'?: number
  'client.connack'?: number
  'client.connect'?: number
  'client.connected'?: number
  'client.disconnected'?: number
  'client.subscribe'?: number
  'client.unsubscribe'?: number
  'delivery.dropped'?: number
  'delivery.dropped.expired'?: number
  'delivery.dropped.no_local'?: number
  'delivery.dropped.qos0_msg'?: number
  'delivery.dropped.queue_full'?: number
  'delivery.dropped.too_large'?: number
  'messages.acked'?: number
  'messages.delayed'?: number
  'messages.delivered'?: number
  'messages.dropped'?: number
  'messages.dropped.await_pubrel_timeout'?: number
  'messages.dropped.no_subscribers'?: number
  'messages.forward'?: number
  'messages.publish'?: number
  'messages.qos0.received'?: number
  'messages.qos0.sent'?: number
  'messages.qos1.received'?: number
  'messages.qos1.sent'?: number
  'messages.qos2.received'?: number
  'messages.qos2.sent'?: number
  'messages.received'?: number
  'messages.sent'?: number
  'packets.auth.received'?: number
  'packets.auth.sent'?: number
  'packets.connack.auth_error'?: number
  'packets.connack.error'?: number
  'packets.connack.sent'?: number
  'packets.connect.received'?: number
  'packets.disconnect.received'?: number
  'packets.disconnect.sent'?: number
  'packets.pingreq.received'?: number
  'packets.pingresp.sent'?: number
  'packets.puback.inuse'?: number
  'packets.puback.missed'?: number
  'packets.puback.received'?: number
  'packets.puback.sent'?: number
  'packets.pubcomp.inuse'?: number
  'packets.pubcomp.missed'?: number
  'packets.pubcomp.received'?: number
  'packets.pubcomp.sent'?: number
  'packets.publish.auth_error'?: number
  'packets.publish.dropped'?: number
  'packets.publish.error'?: number
  'packets.publish.inuse'?: number
  'packets.publish.received'?: number
  'packets.publish.sent'?: number
  'packets.pubrec.inuse'?: number
  'packets.pubrec.missed'?: number
  'packets.pubrec.received'?: number
  'packets.pubrec.sent'?: number
  'packets.pubrel.missed'?: number
  'packets.pubrel.received'?: number
  'packets.pubrel.sent'?: number
  'packets.received'?: number
  'packets.sent'?: number
  'packets.suback.sent'?: number
  'packets.subscribe.auth_error'?: number
  'packets.subscribe.error'?: number
  'packets.subscribe.received'?: number
  'packets.unsuback.sent'?: number
  'packets.unsubscribe.error'?: number
  'packets.unsubscribe.received'?: number
  'rules.matched'?: number
  'session.created'?: number
  'session.discarded'?: number
  'session.resumed'?: number
  'session.takenover'?: number
  'session.terminated'?: number
}

export interface EmqxMgmtApiMetricsAggregatedMetrics {
  'actions.failure'?: number
  'actions.success'?: number
  'bytes.received'?: number
  'bytes.sent'?: number
  'client.auth.anonymous'?: number
  'client.authenticate'?: number
  'client.check_authz'?: number
  'client.connack'?: number
  'client.connect'?: number
  'client.connected'?: number
  'client.disconnected'?: number
  'client.subscribe'?: number
  'client.unsubscribe'?: number
  'delivery.dropped'?: number
  'delivery.dropped.expired'?: number
  'delivery.dropped.no_local'?: number
  'delivery.dropped.qos0_msg'?: number
  'delivery.dropped.queue_full'?: number
  'delivery.dropped.too_large'?: number
  'messages.acked'?: number
  'messages.delayed'?: number
  'messages.delivered'?: number
  'messages.dropped'?: number
  'messages.dropped.await_pubrel_timeout'?: number
  'messages.dropped.no_subscribers'?: number
  'messages.forward'?: number
  'messages.publish'?: number
  'messages.qos0.received'?: number
  'messages.qos0.sent'?: number
  'messages.qos1.received'?: number
  'messages.qos1.sent'?: number
  'messages.qos2.received'?: number
  'messages.qos2.sent'?: number
  'messages.received'?: number
  'messages.sent'?: number
  'packets.auth.received'?: number
  'packets.auth.sent'?: number
  'packets.connack.auth_error'?: number
  'packets.connack.error'?: number
  'packets.connack.sent'?: number
  'packets.connect.received'?: number
  'packets.disconnect.received'?: number
  'packets.disconnect.sent'?: number
  'packets.pingreq.received'?: number
  'packets.pingresp.sent'?: number
  'packets.puback.inuse'?: number
  'packets.puback.missed'?: number
  'packets.puback.received'?: number
  'packets.puback.sent'?: number
  'packets.pubcomp.inuse'?: number
  'packets.pubcomp.missed'?: number
  'packets.pubcomp.received'?: number
  'packets.pubcomp.sent'?: number
  'packets.publish.auth_error'?: number
  'packets.publish.dropped'?: number
  'packets.publish.error'?: number
  'packets.publish.inuse'?: number
  'packets.publish.received'?: number
  'packets.publish.sent'?: number
  'packets.pubrec.inuse'?: number
  'packets.pubrec.missed'?: number
  'packets.pubrec.received'?: number
  'packets.pubrec.sent'?: number
  'packets.pubrel.missed'?: number
  'packets.pubrel.received'?: number
  'packets.pubrel.sent'?: number
  'packets.received'?: number
  'packets.sent'?: number
  'packets.suback.sent'?: number
  'packets.subscribe.auth_error'?: number
  'packets.subscribe.error'?: number
  'packets.subscribe.received'?: number
  'packets.unsuback.sent'?: number
  'packets.unsubscribe.error'?: number
  'packets.unsubscribe.received'?: number
  'rules.matched'?: number
  'session.created'?: number
  'session.discarded'?: number
  'session.resumed'?: number
  'session.takenover'?: number
  'session.terminated'?: number
}

export interface EmqxDashboardMonitorApiSamplerCurrentNode {
  dropped_msg_rate?: number
  persisted_rate?: number
  received_msg_rate?: number
  sent_msg_rate?: number
  validation_failed_rate?: number
  validation_succeeded_rate?: number
  durable_subscriptions?: number
  subscriptions?: number
  topics?: number
  connections?: number
  live_connections?: number
  node_uptime?: number
  retained_msg_count?: number
  shared_subscriptions?: number
  license_quota?: number
}

export interface EmqxDashboardMonitorApiSamplerCurrent {
  dropped_msg_rate?: number
  persisted_rate?: number
  received_msg_rate?: number
  sent_msg_rate?: number
  validation_failed_rate?: number
  validation_succeeded_rate?: number
  durable_subscriptions?: number
  subscriptions?: number
  topics?: number
  connections?: number
  live_connections?: number
  retained_msg_count?: number
  shared_subscriptions?: number
  license_quota?: number
}

export interface EmqxDashboardMonitorApiSampler {
  time_stamp?: number
  durable_subscriptions?: number
  subscriptions?: number
  topics?: number
  connections?: number
  live_connections?: number
  received?: number
  sent?: number
  validation_succeeded?: number
  validation_failed?: number
  dropped?: number
  persisted?: number
}
