import { BridgeType } from '@/types/enum'
import { ConnectorForm, HTTPBridge } from '@/types/rule'
import { WebhookForm } from '@/types/webhook'

export default (): {
  createRawWebhookForm: () => Promise<WebhookForm>
  getWebhookName: (bridgeName: string) => string
  getRuleIdByName: (name: string) => string
  getActionNameByName: (name: string) => string
  syncHeaders: (webhookForm: WebhookForm) => void
  normalizeActionPathForSubmit: (webhookForm: WebhookForm) => void
  normalizeActionPathForDisplay: (webhookForm: WebhookForm) => void
} => {
  const { getSchemaRefByType: getActionSchemaRefByType } = useActionSchema()
  const getActionTypeRefKey = (type: string) => getActionSchemaRefByType(type)

  const { initRecordByComponents } = useSchemaRecord()
  const { components: httpConnectorComponents, schemaLoadPromise: connectorSchemaLoadPromise } =
    useSchemaForm(
      '/schemas/connectors',
      { ref: `#/components/schemas/bridge_http.post_connector` },
      false,
    )
  const { components: httpActionComponents, schemaLoadPromise: actionSchemaLoadPromise } =
    useSchemaForm(
      '/schemas/actions',
      { ref: `#/components/schemas/${getActionTypeRefKey(BridgeType.Webhook)}` },
      false,
    )

  const { filterSSLParams } = useConnectorComponentsHandlers({ type: BridgeType.Webhook })
  const createRawHTTPConnector = () => {
    const ret = initRecordByComponents(
      filterSSLParams(httpConnectorComponents.value),
    ) as ConnectorForm
    if (ret.headers && typeof ret.headers === 'object') {
      ret.headers = pick(ret.headers, 'content-type')
    }
    if (ret.ssl.managed_certs) {
      delete ret.ssl.managed_certs
    }
    if (!ret.oauth2 || typeof ret.oauth2 !== 'object') {
      ret.oauth2 = { enable: false }
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

  const normalizeQueryString = (queryString = '') => queryString.trim().replace(/^\?+/, '')

  // Users edit the raw query string, while the backend expects it as `?foo=bar` in action path.
  const normalizeActionPathForSubmit = (webhookForm: WebhookForm) => {
    const normalizedQueryString = normalizeQueryString(webhookForm.action.parameters.path)
    webhookForm.action.parameters.path = normalizedQueryString ? `?${normalizedQueryString}` : ''
  }

  // Strip the leading `?` only when the stored action path starts with exactly one `?`.
  const normalizeActionPathForDisplay = (webhookForm: WebhookForm) => {
    const actionPath = webhookForm.action.parameters.path
    if (!actionPath) {
      webhookForm.action.parameters.path = ''
      return
    }
    if (!/^\?[^?]/.test(actionPath)) {
      return
    }
    webhookForm.action.parameters.path = actionPath.slice(1)
  }

  return {
    createRawWebhookForm,
    getWebhookName,
    getRuleIdByName,
    getActionNameByName,
    syncHeaders,
    normalizeActionPathForSubmit,
    normalizeActionPathForDisplay,
  }
}
