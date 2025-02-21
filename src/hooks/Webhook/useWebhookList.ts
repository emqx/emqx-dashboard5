import { getActions as queryActions } from '@/api/action'
import { getConnectors as queryConnectors } from '@/api/connector'
import { getRules as queryRules } from '@/api/ruleengine'
import { getAllListData } from '@/common/tools'
import { BridgeItem, Connector, HTTPBridge, RuleItem } from '@/types/rule'
import { WebhookItem } from '@/types/webhook'

export default (): {
  webhookList: Ref<WebhookItem[]>
  isLoading: Ref<boolean>
  isEmpty: Ref<boolean>
  getWebhookList: () => Promise<void>
} => {
  let connectorList: Array<Connector> = []
  let actionList: Array<HTTPBridge> = []
  let ruleList: Array<RuleItem> = []
  const webhookList: Ref<Array<WebhookItem>> = ref([])
  const isLoading = ref(false)
  const isEmpty = ref(false)

  const {
    judgeIsWebhookConnector,
    judgeIsWebhookAction,
    judgeIsWebhookRule,
    joiningDataToWebhookList,
  } = useWebhookUtils()

  const getConnectors = async () => {
    try {
      const data: Array<Connector> = await queryConnectors()
      connectorList = data.filter((item) => judgeIsWebhookConnector(item))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getActions = async () => {
    try {
      const data: Array<BridgeItem> = await queryActions()
      actionList = data.filter((item) => judgeIsWebhookAction(item)) as Array<HTTPBridge>
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
    return Promise.all([getConnectors(), getActions(), getRuleList()])
  }

  const joiningData = () => {
    webhookList.value = joiningDataToWebhookList(connectorList, actionList, ruleList)
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

  return {
    webhookList,
    isLoading,
    isEmpty,
    getWebhookList,
  }
}
