import { BasicRule, HTTPBridge } from './rule'

export interface WebhookForm {
  bridge: HTTPBridge
  rule: BasicRule
  name: string
}

export interface WebhookItem extends WebhookForm {
  name: string
  enable: boolean
}
