export interface Subscription {
  node: string
  topic: string
  clientid: string
  qos: 0 | 1 | 2
}
