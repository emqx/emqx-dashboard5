import { HTTPBridge, RuleItem } from './rule'

export interface Webhook {
  name: string
  enable: boolean
  bridge: HTTPBridge
  rule: RuleItem
}
