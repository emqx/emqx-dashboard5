import { WEBHOOK_PREFIX } from '@/common/constants'
import { useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { OtherNodeType } from '@/hooks/Rule/topology/topologyType'
import useUtilsForTopology from '@/hooks/Rule/topology/useUtilsForTopology'
import { BridgeType } from '@/types/enum'
import { BridgeItem, HTTPBridge, RuleItem } from '@/types/rule'
import { WebhookItem } from '@/types/webhook'

/* 
  The naming convention for rules created for webhooks
  ${WEBHOOK_PREFIX}${webhook name}
 */

export default (): {
  judgeIsWebhookBridge: (bridge: BridgeItem) => boolean
  judgeIsWebhookRule: ({ id }: RuleItem) => boolean
  joiningDataToWebhookList: (
    httpBridgeList: Array<HTTPBridge>,
    ruleList: Array<RuleItem>,
  ) => Array<WebhookItem>
} => {
  const webhookTargetReg = new RegExp(`^${WEBHOOK_PREFIX}`)

  const { judgeOutputType } = useUtilsForTopology()
  const { getBridgeType } = useBridgeTypeOptions()

  const judgeIsWebhookBridge = (bridge: BridgeItem) => {
    const { type, name } = bridge
    return type === BridgeType.Webhook && webhookTargetReg.test(name)
  }

  const judgeOutputsContainWebhook = (rule: RuleItem) => {
    const { actions } = rule
    return (
      (Array.isArray(actions) &&
        actions.some((item) => {
          return (
            judgeOutputType(item) === OtherNodeType.Bridge &&
            typeof item === 'string' &&
            getBridgeType(item.slice(0, item?.indexOf(':'))) === BridgeType.Webhook
          )
        })) ||
      false
    )
  }

  const judgeIsWebhookRule = (rule: RuleItem) => {
    const { id } = rule
    return webhookTargetReg.test(id) && judgeOutputsContainWebhook(rule)
  }

  const getWebhookName = (bridgeName: string) => bridgeName.replace(webhookTargetReg, '')

  const getEnableStatus = (bridge: HTTPBridge, rule: RuleItem) => bridge.enable && rule.enable

  const joiningDataToWebhookList = (
    httpBridgeList: Array<HTTPBridge>,
    ruleList: Array<RuleItem>,
  ): Array<WebhookItem> => {
    const bridgeArr = [...httpBridgeList]
    const ruleArr = [...ruleList]
    return bridgeArr.reduce((arr: Array<WebhookItem>, bridgeItem) => {
      const { id: bridgeId } = bridgeItem
      const ruleIndex = ruleArr.findIndex(
        ({ actions }) => Array.isArray(actions) && actions.includes(bridgeId),
      )
      const rule = ruleIndex !== -1 ? ruleArr.splice(ruleIndex, 1)[0] : undefined
      return arr.concat(
        rule
          ? {
              name: getWebhookName(bridgeItem.name),
              enable: getEnableStatus(bridgeItem, rule),
              bridge: bridgeItem,
              rule,
            }
          : [],
      )
    }, [])
  }

  return {
    judgeIsWebhookBridge,
    judgeIsWebhookRule,
    joiningDataToWebhookList,
  }
}
