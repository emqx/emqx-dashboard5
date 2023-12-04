import { WEBHOOK_SUFFIX } from '@/common/constants'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import { BridgeType } from '@/types/enum'
import { ConnectorForm } from '@/types/rule'
import { WebhookForm } from '@/types/webhook'

export default (): {
  createRawWebhookForm: () => WebhookForm
  getRuleIdByName: (name: string) => string
  getActionNameByName: (name: string) => string
} => {
  const { createRawHTTPForm } = useBridgeFormCreator()
  const { createRawRuleForm } = useRuleForm()
  const createRawHTTPConnector = (): ConnectorForm => ({
    type: BridgeType.Webhook,
    name: '',
    description: '',
    connect_timeout: '15s',
    enable_pipelining: 100,
    headers: { 'content-type': 'application/json' },
    pool_size: 1,
    pool_type: 'hash',
    url: 'http://localhost:8080/api/v1',
  })

  const createRawWebhookForm = (): WebhookForm => ({
    action: { ...createRawHTTPForm(), type: BridgeType.Webhook },
    connector: createRawHTTPConnector(),
    rule: createRawRuleForm('#'),
    name: '',
  })

  const getRuleIdByName = (name: string) => `${name}${WEBHOOK_SUFFIX}`
  const getActionNameByName = (name: string) => `${name}${WEBHOOK_SUFFIX}`

  return {
    createRawWebhookForm,
    getRuleIdByName,
    getActionNameByName,
  }
}
