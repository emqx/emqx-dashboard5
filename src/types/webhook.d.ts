import { Action, BasicRule, ConnectorForm } from './rule'

export interface WebhookForm {
  action: Action
  rule: BasicRule
  connector: ConnectorForm
  name: string
}

export interface WebhookItem extends WebhookForm {
  enable: boolean
}
