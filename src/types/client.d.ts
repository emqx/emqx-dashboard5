export interface Client {
  awaiting_rel_cnt: number
  awaiting_rel_max: number
  clean_start: boolean
  clientid: string
  connected: boolean
  connected_at: number
  created_at: number
  disconnected_at: number
  expiry_interval: number
  heap_size: number
  inflight_cnt: number
  inflight_max: number
  ip_address: string
  is_bridge: boolean
  keepalive: number
  mailbox_len: number
  mqueue_dropped: number
  mqueue_len: number
  mqueue_max: number
  mountpoint: string
  node: string
  port: number
  proto_name: string
  proto_ver: number
  recv_cnt: number
  recv_msg: number
  'recv_msg.dropped': number
  'recv_msg.dropped.await_pubrel_timeout': number
  'recv_msg.qos0': number
  'recv_msg.qos1': number
  'recv_msg.qos2': number
  recv_oct: number
  recv_pkt: number
  reductions: number
  send_cnt: number
  send_msg: number
  'send_msg.dropped': number
  'send_msg.dropped.expired': number
  'send_msg.dropped.queue_full': number
  'send_msg.dropped.too_large': number
  'send_msg.qos0': number
  'send_msg.qos1': number
  'send_msg.qos2': number
  send_oct: number
  send_pkt: number
  subscriptions_cnt: number
  subscriptions_max: number
  username: string
  will_msg: string
  zone: string
  durable: boolean
  [key: string]: any
}

/**
 * message queue / inflight
 */
export interface MessageItem {
  from_clientid: string
  from_username: string
  msgid: string
  payload: string
  publish_at: number
  qos: number
  topic: string
}
