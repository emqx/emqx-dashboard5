import { deleteAction, putActionEnable } from '@/api/action'
import { deleteConnector } from '@/api/connector'
import { deleteRules, updateRules } from '@/api/ruleengine'
import { WebhookItem } from '@/types/webhook'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default (): {
  toggleWebhookEnableStatus: (webhook: WebhookItem) => Promise<[any, any]>
  deleteLoading: Ref<boolean>
  deleteWebhook: (webhook: WebhookItem) => Promise<void>
} => {
  const toggleBridgeEnableStatus = putActionEnable

  const toggleRuleEnableStatus = async (id: string, enable: boolean) => {
    return updateRules(id, { enable })
  }

  const toggleWebhookEnableStatus = async (webhook: WebhookItem) => {
    const enable = webhook.enable
    return await Promise.all([
      toggleBridgeEnableStatus(webhook.action.id, enable),
      toggleRuleEnableStatus(webhook.rule.id, enable),
    ])
  }

  const { t } = useI18n()
  const deleteLoading = ref(false)
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
      await deleteRules(webhook.rule.id)
      // Once rule is deleted, delete the Data Bridge
      await deleteAction(webhook.action.id)
      await deleteConnector(webhook.connector.id)
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
