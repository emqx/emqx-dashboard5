import { getBridgeList as queryBridgeList, getRules as queryRules } from '@/api/ruleengine'
import { getAllListData } from '@/common/tools'
import { BridgeItem, HTTPBridge, RuleItem } from '@/types/rule'
import { WebhookItem } from '@/types/webhook'
import { Ref, ref } from 'vue'
import useWebhookUtils from './useWebhookUtils'

export default (): {
  webhookList: Ref<WebhookItem[]>
  isLoading: Ref<boolean>
  getWebhookList: () => Promise<void>
} => {
  let bridgeList: Array<HTTPBridge> = []
  let ruleList: Array<RuleItem> = []
  const webhookList: Ref<Array<WebhookItem>> = ref([])
  const isLoading = ref(false)

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
    getWebhookList,
  }
}
