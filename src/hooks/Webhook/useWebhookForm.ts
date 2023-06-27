import { WEBHOOK_PREFIX } from '@/common/constants'
import useBridgeFormCreator from '@/hooks/Rule/bridge/useBridgeFormCreator'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import { BridgeType } from '@/types/enum'
import { WebhookForm } from '@/types/webhook'

export default (): {
  createRawWebhookForm: () => WebhookForm
  getRuleIdByName: (name: string) => string
  getBridgeNameByName: (name: string) => string
} => {
  const { createRawHTTPForm } = useBridgeFormCreator()
  const { createRawRuleForm } = useRuleForm()

  const createRawWebhookForm = (): WebhookForm => ({
    bridge: { ...createRawHTTPForm(), type: BridgeType.Webhook },
    rule: createRawRuleForm(),
    name: '',
  })

  const getRuleIdByName = (name: string) => `${WEBHOOK_PREFIX}${name}`
  const getBridgeNameByName = (name: string) => `${WEBHOOK_PREFIX}${name}`

  return {
    createRawWebhookForm,
    getRuleIdByName,
    getBridgeNameByName,
  }
}
