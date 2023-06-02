import { startStopBridge, updateRules } from '@/api/ruleengine'
import { Webhook } from '@/types/webhook'

export default (): {
  toggleWebhookEnableStatus: (webhook: Webhook) => Promise<[any, any]>
} => {
  const toggleBridgeEnableStatus = async (id: string, enable: boolean) => {
    const statusToSend = enable ? 'enable' : 'disable'
    return startStopBridge(id, statusToSend)
  }

  const toggleRuleEnableStatus = async (id: string, enable: boolean) => {
    return updateRules(id, { enable })
  }

  const toggleWebhookEnableStatus = async (webhook: Webhook) => {
    const enable = webhook.enable
    return await Promise.all([
      toggleBridgeEnableStatus(webhook.bridge.id, enable),
      toggleRuleEnableStatus(webhook.rule.id, enable),
    ])
  }

  return {
    toggleWebhookEnableStatus,
  }
}
