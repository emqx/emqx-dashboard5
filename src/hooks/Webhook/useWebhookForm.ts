import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import { WebhookForm } from '@/types/webhook'

export default () => {
  const { createRawHTTPForm } = useBridgeFormCreator()
  const { createRawRuleForm } = useRuleForm()

  const createRawWebhookForm = (): WebhookForm => ({
    bridge: createRawHTTPForm(),
    rule: createRawRuleForm(),
  })

  return {
    createRawWebhookForm,
  }
}
