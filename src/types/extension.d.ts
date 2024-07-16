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
  enable: boolean
  max_payload_size: string
  msg_expiry_interval: string
  msg_clear_interval: string
  delivery_rate: string
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
