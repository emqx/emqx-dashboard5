import { Connector, RuleItem } from '@/types/rule'
import { WebhookItem } from '@/types/webhook'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'

export default (): {
  toggleWebhookEnableStatus: (webhook: WebhookItem) => Promise<[any, any, any]>
  deleteLoading: Ref<boolean>
  deleteWebhook: (webhook: WebhookItem) => Promise<void>
} => {
  const { toggleActionEnable, deleteAction } = useHandleActionItem()

  const { updateRule } = useRuleItem()
  const toggleRuleEnableStatus = async ({ id, namespace }: RuleItem, enable: boolean) => {
    return updateRule(id, { enable, namespace })
  }

  const { requestPutConnectorEnable, requestDeleteConnector } = useHandleConnectorItem()
  const toggleWebhookEnableStatus = async (webhook: WebhookItem) => {
    const enable = webhook.enable
    return await Promise.all([
      toggleActionEnable(webhook.action, enable),
      toggleRuleEnableStatus(webhook.rule as RuleItem, enable),
      requestPutConnectorEnable(webhook.connector as Connector, enable),
    ])
  }

  const { t } = useI18n()
  const deleteLoading = ref(false)
  const { deleteRule } = useRuleItem()
  const deleteWebhook = async (webhook: WebhookItem) => {
    if (!webhook.action.id || !webhook.rule.id) return

    await MB.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })

    deleteLoading.value = true
    try {
      // Delete the RuleID
      await deleteRule(webhook.rule)
      // Once rule is deleted, delete the Data Bridge
      await deleteAction(webhook.action)
      await requestDeleteConnector(webhook.connector)
      M.success(t('Base.deleteSuccess'))
    } catch (error) {
      // ignore error
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    toggleWebhookEnableStatus,
    deleteLoading,
    deleteWebhook,
  }
}
