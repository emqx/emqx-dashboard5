import { BridgeType } from '@/types/enum'
import { ConnectorForm, HTTPBridge } from '@/types/rule'
import { WebhookForm } from '@/types/webhook'

export default (): {
  createRawWebhookForm: () => Promise<WebhookForm>
  getWebhookName: (bridgeName: string) => string
  getRuleIdByName: (name: string) => string
  getActionNameByName: (name: string) => string
  syncHeaders: (webhookForm: WebhookForm) => void
} => {
  const { getSchemaRefByType: getActionSchemaRefByType } = useActionSchema()
  const getActionTypeRefKey = (type: string) => getActionSchemaRefByType(type)

  const { initRecordByComponents } = useSchemaRecord()
  const { components: httpConnectorComponents, schemaLoadPromise: connectorSchemaLoadPromise } =
    useSchemaForm(
      getAPIPath(`/schemas/connectors`),
      { ref: `#/components/schemas/bridge_http.post_connector` },
      false,
    )
  const { components: httpActionComponents, schemaLoadPromise: actionSchemaLoadPromise } =
    useSchemaForm(
      getAPIPath(`/schemas/actions`),
      { ref: `#/components/schemas/${getActionTypeRefKey(BridgeType.Webhook)}` },
      false,
    )

  const createRawHTTPConnector = () => {
    const ret = initRecordByComponents(httpConnectorComponents.value) as ConnectorForm
    if (ret.headers && typeof ret.headers === 'object') {
      ret.headers = pick(ret.headers, 'content-type')
    }
    return ret
  }
  const createRawHTTPAction = () => {
    return initRecordByComponents(httpActionComponents.value) as HTTPBridge
  }

  const { createRawRuleForm } = useRuleForm()

  const createRawWebhookForm = async (): Promise<WebhookForm> => {
    await Promise.all([connectorSchemaLoadPromise, actionSchemaLoadPromise])
    return {
      action: { ...createRawHTTPAction(), type: BridgeType.Webhook },
      connector: { ...createRawHTTPConnector(), url: 'http://' },
      rule: createRawRuleForm('#'),
      name: '',
    }
  }

  const webhookTargetReg = new RegExp(`${WEBHOOK_SUFFIX}$`)
  const getWebhookName = (bridgeName: string) => bridgeName.replace(webhookTargetReg, '')

  const getRuleIdByName = (name: string) => `${name}${WEBHOOK_SUFFIX}`
  const getActionNameByName = (name: string) => `${name}${WEBHOOK_SUFFIX}`

  const syncHeaders = (webhookForm: WebhookForm) => {
    const { connector, action } = webhookForm
    action.parameters.headers = connector.headers
  }

  return {
    createRawWebhookForm,
    getWebhookName,
    getRuleIdByName,
    getActionNameByName,
    syncHeaders,
  }
}
