import { BridgeStatus, RuleOutput } from '@/types/enum'
import { RuleItem, BridgeItem, OutputItemObj } from '@/types/rule'
import { IG6GraphEvent } from '@antv/g6'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { OtherNodeType, NodeType } from './topologyType'

export default (randomPrefix: string) => {
  const { t } = useI18n()

  const nodeTypeList = [
    OtherNodeType.Bridge,
    OtherNodeType.Event,
    OtherNodeType.Rule,
    OtherNodeType.Topic,
    RuleOutput.Console,
    RuleOutput.Republish,
  ]
  // Id Format Desc: ./useTopology.ts row-31
  const nodeIdReg = new RegExp(`^(${randomPrefix}-)(${nodeTypeList.join('|')})-(.+)$`)

  let ruleList: Array<RuleItem> = []
  let bridgeList: Array<BridgeItem> = []

  const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

  const setRuleList = (ruleArr: Array<RuleItem>) => {
    ruleList = ruleArr
  }

  const setBridgeList = (bridgeArr: Array<BridgeItem>) => {
    bridgeList = bridgeArr
  }

  const createContainerEle = () => {
    const container = document.createElement('div')
    container.className = 'topology-node-tooltip'
    return container
  }

  const createEmptyTooltip = (id: string) => ''

  const createMsgListHTMLStr = (
    msgArr: Array<{ label: string; value: string | number; valueClass?: string }>,
  ) => {
    return msgArr.reduce((ret, { label, value, valueClass }) => {
      const classStr = valueClass ? `class="${valueClass}"` : ''
      return (ret += `
        <li>
          <label>${label}</label>
          <span ${classStr}>${value}</span>
        </li>`)
    }, '')
  }

  const createRuleNodeTooltip = (ruleID: string) => {
    const targetRule = ruleList.find(({ id }) => id === ruleID)

    if (!targetRule) {
      return ''
    }
    const container = createContainerEle()
    const { name, id, from, metrics, enable, created_at } = targetRule
    const fromDataToShow = Array.isArray(from) ? from.join('') : from
    const statusClass = `text-status ${enable ? 'success' : 'danger'}`

    const msgArr = [
      { label: tl('name'), value: name },
      { label: 'ID', value: id },
      { label: tl('input'), value: fromDataToShow },
      { label: tl('sqlHit'), value: metrics['sql.matched'] },
      { label: tl('sqlFailed'), value: metrics['sql.failed'] },
      // TODO: speed, ask xing yu
      { label: tl('currentSpeed'), value: metrics['sql.failed'] },
      {
        label: tl('status'),
        value: tl(enable ? 'activated' : 'deactivated'),
        valueClass: statusClass,
      },
      { label: tl('createdAt'), value: moment(created_at).format('YYYY-MM-DD HH:mm:ss') },
    ]
    // TODO:SQL
    container.innerHTML = `
      <ul>
        ${createMsgListHTMLStr(msgArr)}
      </ul>
    `
    return container
  }

  const createBridgeNodeTooltip = (bridgeID: string) => {
    const targetBridge = bridgeList.find(({ id }) => id === bridgeID)
    if (!targetBridge) {
      return ''
    }

    const container = createContainerEle()
    const { type, name, id, metrics, status } = targetBridge
    const statusStr = tl(status === BridgeStatus.Connected ? 'connected' : 'disconnected')
    const statusClass = `text-status ${status === BridgeStatus.Connected ? 'success' : 'danger'}`

    const msgArr = [
      { label: tl('type'), value: type.toUpperCase() },
      { label: tl('name'), value: name },
      { label: 'ID', value: id },
      { label: tl('success'), value: metrics.success },
      { label: tl('failure'), value: metrics.failed },
      { label: tl('currentSpeed'), value: metrics.rate },
      { label: tl('status'), value: statusStr, valueClass: statusClass },
    ]

    container.innerHTML = `
      <ul>
        ${createMsgListHTMLStr(msgArr)}
      </ul>
    `
    return container
  }

  const createRepublishNodeTooltip = (ruleID: string) => {
    const targetRule = ruleList.find(({ id }) => id === ruleID)

    if (!targetRule) {
      return ''
    }
    const container = createContainerEle()
    let topic = ''
    if (Array.isArray(targetRule.outputs)) {
      const targetOutput = targetRule.outputs.find((outputItem) => {
        return typeof outputItem === 'object' && outputItem.function === RuleOutput.Republish
      })
      topic = targetOutput ? (targetOutput as OutputItemObj).args?.topic || '' : ''
    } else if (typeof targetRule.outputs === 'object') {
      topic = (targetRule.outputs as OutputItemObj).args?.topic || ''
    }
    container.innerHTML = `
    <ul>
      ${createMsgListHTMLStr([{ value: topic, label: 'Topic' }])}
    </ul>
    `
    return container
  }

  const getNodeTypeNTargetIDByNodeID = (nodeID: string): { id?: string; type?: NodeType } => {
    const matchResult = nodeID.match(nodeIdReg)
    if (!matchResult) {
      return {}
    }
    const [nodeIDStr, randomStr, type, id] = matchResult

    return {
      id,
      type: type as NodeType,
    }
  }

  const createTooltipMap: Record<NodeType, (id: string) => HTMLDivElement | string> = {
    [OtherNodeType.Topic]: createEmptyTooltip,
    [RuleOutput.Console]: createEmptyTooltip,
    [OtherNodeType.Event]: createEmptyTooltip,
    [OtherNodeType.Rule]: createRuleNodeTooltip,
    [OtherNodeType.Bridge]: createBridgeNodeTooltip,
    [RuleOutput.Republish]: createRepublishNodeTooltip,
  }

  /* 
    DESC
    - console | event | topic: no tooltip
    - rule | bridge: show detail
    - republish: show topic
   */
  // TODO: debounce
  const createNodeTooltip = (e?: IG6GraphEvent | undefined): HTMLDivElement | string => {
    const model = e?.item?.getModel()
    if (!e || !model || !model.id || !model.label) {
      return ''
    }

    const { label, id } = model
    const { type: nodeType, id: targetID } = getNodeTypeNTargetIDByNodeID(id)
    if (!nodeType || !targetID) {
      return ''
    }

    const createFunc = createTooltipMap[nodeType]
    if (!createFunc) {
      return ''
    }
    const ret = createFunc(targetID)

    return ret
  }

  return {
    setRuleList,
    setBridgeList,
    createNodeTooltip,
  }
}
