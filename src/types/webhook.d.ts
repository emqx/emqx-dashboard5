import { BasicRule, HTTPBridge } from './rule'

export interface WebhookForm {
  bridge: HTTPBridge
  rule: BasicRule
}

export interface WebhookItem extends WebhookForm {
  name: string
  enable: boolean
}
