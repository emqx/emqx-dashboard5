import { BasicRule, ConnectorForm, HTTPBridge } from './rule'

export interface WebhookForm {
  action: HTTPBridge
  rule: BasicRule
  connector: ConnectorForm
  name: string
}

export interface WebhookItem extends WebhookForm {
  enable: boolean
}
