import { QoSLevel } from './enum'

export interface SysTopics {
  sys_msg_interval: string
  sys_heartbeat_interval: string
  sys_event_messages: {
    client_connected: boolean
    client_disconnected: boolean
    client_subscribed: boolean
    client_unsubscribed: boolean
  }
}

export interface Retainer {
  max_payload_size: string
  msg_expiry_interval: string
  msg_expiry_interval_override: string
  allow_never_expire: boolean
  msg_clear_interval: string
  delivery_rate: string
  max_publish_rate: string
  backend: {
    type: string
    storage_type: string
    max_retained_messages: number
  }
}

export interface RetainerMessage {
  msgid: string
  topic: string
  qos: string
  publish_at: string
  from_clientid: string
  from_username: string
}

export interface RetainerMessageDetail extends RetainerMessage {
  payload: string
}

export interface Rewrite {
  action: string
  source_topic: string
  dest_topic: string
  re: string
}

export interface AutoSubscribe {
  topic: string
  qos: QoSLevel
  rh: number
  rap: number
  nl: number
}

export interface Delayed {
  enable: boolean
  max_delayed_messages: number
}

export interface DelayedMessage {
  msgid: string
  node: string
  publish_at: string
  delayed_interval: number
  delayed_remaining: number
  expected_at: string
  topic: string
  qos: string
  from_clientid: string
  from_username: string
  payload: string
}
