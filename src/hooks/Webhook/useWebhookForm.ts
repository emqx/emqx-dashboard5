import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import { BridgeType } from '@/types/enum'
import { WebhookForm } from '@/types/webhook'

export default (): {
  createRawWebhookForm: () => WebhookForm
} => {
  const { createRawHTTPForm } = useBridgeFormCreator()
  const { createRawRuleForm } = useRuleForm()

  const createRawWebhookForm = (): WebhookForm => ({
    bridge: { ...createRawHTTPForm(), type: BridgeType.Webhook },
    rule: createRawRuleForm(),
    name: '',
  })

  return {
    createRawWebhookForm,
  }
}
