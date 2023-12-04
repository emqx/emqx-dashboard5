import { WEBHOOK_SUFFIX } from '@/common/constants'
import { useBridgeTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { OtherNodeType } from '@/hooks/Rule/topology/topologyType'
import useUtilsForTopology from '@/hooks/Rule/topology/useUtilsForTopology'
import { BridgeType } from '@/types/enum'
import { BridgeItem, Connector, HTTPBridge, RuleItem } from '@/types/rule'
import { WebhookItem } from '@/types/webhook'

/* 
  The naming convention for rules created for webhooks
  ${webhook name}${WEBHOOK_SUFFIX}
 */

export default (): {
  judgeIsWebhookConnector: (connector: Connector) => boolean
  judgeIsWebhookAction: (action: BridgeItem) => boolean
  judgeIsWebhookRule: ({ id }: RuleItem) => boolean
  getEnableStatus: (action: HTTPBridge, rule: RuleItem) => boolean
  joiningDataToWebhookList: (
    httpConnectorList: Array<Connector>,
    httpActionList: Array<HTTPBridge>,
    ruleList: Array<RuleItem>,
  ) => Array<WebhookItem>
} => {
  const webhookTargetReg = new RegExp(`${WEBHOOK_SUFFIX}$`)

  const { judgeOutputType } = useUtilsForTopology()
  const { getBridgeGeneralType } = useBridgeTypeValue()

  const judgeIsWebhookConnector = (connector: Connector) => {
    const { type, name } = connector
    return type === BridgeType.Webhook && webhookTargetReg.test(name)
  }

  const judgeIsWebhookAction = (action: BridgeItem) => {
    const { type, name, connector } = action
    if (!(type === BridgeType.Webhook && webhookTargetReg.test(name))) {
      return false
    }
    return name === connector
  }

  const judgeOutputsContainWebhook = (rule: RuleItem) => {
    const { actions } = rule
    return (
      (Array.isArray(actions) &&
        actions.some((item) => {
          return (
            judgeOutputType(item) === OtherNodeType.Bridge &&
            typeof item === 'string' &&
            getBridgeGeneralType(item.slice(0, item?.indexOf(':'))) === BridgeType.Webhook
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

  const getEnableStatus = (action: HTTPBridge, rule: RuleItem) => action.enable && rule.enable

  const joiningDataToWebhookList = (
    httpConnectorList: Array<Connector>,
    httpActionList: Array<HTTPBridge>,
    ruleList: Array<RuleItem>,
  ): Array<WebhookItem> => {
    const actionArr = [...httpActionList]
    const ruleArr = [...ruleList]
    return actionArr.reduce((arr: Array<WebhookItem>, actionItem) => {
      const { id: actionId } = actionItem
      const ruleIndex = ruleArr.findIndex(
        ({ actions }) => Array.isArray(actions) && actions.includes(actionId),
      )
      const rule = ruleIndex !== -1 ? ruleArr.splice(ruleIndex, 1)[0] : undefined
      const connectorIndex = httpConnectorList.findIndex(
        ({ name }) => name === actionItem.connector,
      )
      const connector =
        connectorIndex !== -1 ? httpConnectorList.splice(connectorIndex, 1)[0] : undefined
      return arr.concat(
        rule && connector
          ? {
              name: getWebhookName(actionItem.name),
              enable: getEnableStatus(actionItem, rule),
              action: actionItem,
              connector,
              rule,
            }
          : [],
      )
    }, [])
  }

  return {
    judgeIsWebhookConnector,
    judgeIsWebhookAction,
    judgeIsWebhookRule,
    getEnableStatus,
    joiningDataToWebhookList,
  }
}
