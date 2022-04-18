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
  msg_expiry_interval: string
  msg_clear_interval: string
  flow_control: {
    batch_read_number: number
    batch_deliver_number: number
    batch_deliver_limiter: string
  }
  max_payload_size: string
  stop_publish_clear_msg: boolean
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
  qos: string
  rh: number
  rap: number
  nl: number
}

export interface Delayed {
  enable: boolean
  max_delayed_messages: number
}

export interface DelayedMessage {
  msgid: number
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
