import { getBridgeList as queryBridgeList, getRules as queryRules } from '@/api/ruleengine'
import { getAllListData } from '@/common/tools'
import { BridgeItem, HTTPBridge, RuleItem } from '@/types/rule'
import { WebhookItem } from '@/types/webhook'
import { Ref, ref } from 'vue'
import useWebhookUtils from './useWebhookUtils'
import { deleteBridge, deleteRules } from '@/api/ruleengine'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'
import { useI18n } from 'vue-i18n'

export default (): {
  webhookList: Ref<WebhookItem[]>
  isLoading: Ref<boolean>
  isEmpty: Ref<boolean>
  deleteLoading: Ref<boolean>
  getWebhookList: () => Promise<void>
  deleteWebhook: (webhook: WebhookItem) => Promise<void>
} => {
  let bridgeList: Array<HTTPBridge> = []
  let ruleList: Array<RuleItem> = []
  const webhookList: Ref<Array<WebhookItem>> = ref([])
  const isLoading = ref(false)
  const deleteLoading = ref(false)
  const { t } = useI18n()
  const isEmpty = ref(false)

  const { judgeIsWebhookBridge, judgeIsWebhookRule, joiningDataToWebhookList } = useWebhookUtils()

  const getBridgeList = async () => {
    try {
      const data: Array<BridgeItem> = await queryBridgeList()
      bridgeList = data.filter((item) => judgeIsWebhookBridge(item)) as Array<HTTPBridge>
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getRuleList = async () => {
    try {
      const data: Array<RuleItem> = await getAllListData(queryRules)
      ruleList = data.filter((item) => judgeIsWebhookRule(item))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getRequiredData = () => {
    return Promise.all([getBridgeList(), getRuleList()])
  }

  const joiningData = () => {
    webhookList.value = joiningDataToWebhookList(bridgeList, ruleList)
    if (!webhookList.value.length) {
      isEmpty.value = true
    }
  }

  const getWebhookList = async () => {
    try {
      isLoading.value = true
      await getRequiredData()
      joiningData()
    } catch (error) {
      //
    } finally {
      isLoading.value = false
    }
  }

  getWebhookList()

  const deleteWebhook = async (webhook: WebhookItem) => {
    if (!webhook.bridge.id || !webhook.rule.id) return

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
      await deleteBridge(webhook.bridge.id)

      M.success(t('Base.deleteSuccess'))
      getWebhookList()
    } catch (error) {
      // ignore error
    } finally {
      deleteLoading.value = false
    }
  }

  return {
    webhookList,
    isLoading,
    isEmpty,
    deleteLoading,
    getWebhookList,
    deleteWebhook,
  }
}
