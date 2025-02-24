import { BridgeType, RuleOutput } from '@/types/enum'
import { BridgeItem, Connector, HTTPBridge, OutputItem, RuleItem } from '@/types/rule'
import { WebhookItem } from '@/types/webhook'

const enum OtherNodeType {
  Bridge = 'bridge',
  Event = 'event',
  Rule = 'rule',
  Topic = 'topic',
}

/* 
  The naming convention for rules created for webhooks
  ${webhook name}${WEBHOOK_SUFFIX}
 */

export default (): {
  judgeIsWebhookConnector: (connector: Connector) => boolean
  judgeIsWebhookAction: (action: BridgeItem) => boolean
  judgeIsWebhookRuleId: (id: string) => boolean
  judgeIsWebhookRule: ({ id }: RuleItem) => boolean
  getEnableStatus: (action: HTTPBridge, rule: RuleItem) => boolean
  joiningDataToWebhookList: (
    httpConnectorList: Array<Connector>,
    httpActionList: Array<HTTPBridge>,
    ruleList: Array<RuleItem>,
  ) => Array<WebhookItem>
} => {
  const webhookTargetReg = new RegExp(`${WEBHOOK_SUFFIX}$`)

  const { getBridgeGeneralType } = useBridgeTypeValue()

  const judgeOutputType = (output: OutputItem): string => {
    if (typeof output === 'string') {
      return OtherNodeType.Bridge
    }
    if (output.function === RuleOutput.Console) {
      return RuleOutput.Console
    }
    return RuleOutput.Republish
  }

  const judgeIsWebhookConnector = (connector: Connector) => {
    const { type, name } = connector
    return type === BridgeType.Webhook && webhookTargetReg.test(name)
  }

  const judgeIsWebhookAction = (action: BridgeItem) => {
    const { type, name, rules } = action
    if (!(type === BridgeType.Webhook && webhookTargetReg.test(name) && rules?.length > 0)) {
      return false
    }
    return rules.some((ruleName: string) => ruleName === name)
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

  const judgeIsWebhookRuleId = (id: string) => webhookTargetReg.test(id)

  const judgeIsWebhookRule = (rule: RuleItem) => {
    const { id } = rule
    return judgeIsWebhookRuleId(id) && judgeOutputsContainWebhook(rule)
  }

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
              name: actionItem.name,
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
    judgeIsWebhookRuleId,
    judgeIsWebhookRule,
    getEnableStatus,
    joiningDataToWebhookList,
  }
}
