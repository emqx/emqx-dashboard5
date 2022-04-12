import { RULE_TOPOLOGY_ID } from '@/common/constants'
import { RuleOutput } from '@/types/enum'
import { RuleItem, BridgeItem } from '@/types/rule'
import { IG6GraphEvent } from '@antv/g6'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { OtherNodeType, NodeType } from './topologyType'
import hljs from 'highlight.js/lib/core'
import sql from 'highlight.js/lib/languages/sql'
import useCommonConnectionStatus from '@/hooks/useCommonConnectionStatus'
import { useBridgeTypeOptions } from '../bridge/useBridgeTypeValue'

hljs.registerLanguage('sql', sql)

const highlightSQL = (sql: string): string => {
  try {
    return hljs.highlight(sql, { language: 'sql' }).value
  } catch (error) {
    return sql
  }
}

export default (): {
  setRuleList: (ruleArr: Array<RuleItem>) => void
  setBridgeList: (bridgeArr: Array<BridgeItem>) => void
  createNodeTooltip: (e?: IG6GraphEvent | undefined) => HTMLDivElement | string
  handleNodeClickEvent: (e: IG6GraphEvent) => void
} => {
  const { t } = useI18n()
  const router = useRouter()

  const nodeTypeList = [
    OtherNodeType.Bridge,
    OtherNodeType.Event,
    OtherNodeType.Rule,
    OtherNodeType.Topic,
    RuleOutput.Console,
    RuleOutput.Republish,
  ]
  // Id Format Desc: ./useTopology.ts row-31
  const nodeIdReg = new RegExp(`^(${RULE_TOPOLOGY_ID}-)(${nodeTypeList.join('|')})-(.+)$`)

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

  const createEmptyTooltip = () => ''

  const createSimpleTooltip = (id: string) => {
    if (!id) {
      return ''
    }
    const container = createContainerEle()
    container.innerHTML = `<p class="simple-info">${id}</p>`
    return container
  }

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
    const { name, from, metrics, enable, created_at, sql } = targetRule
    const fromDataToShow = Array.isArray(from) ? from.join('') : from
    const statusClass = `text-status ${enable ? 'success' : 'danger'}`

    const msgArr = [
      { label: tl('name'), value: name },
      { label: tl('input'), value: fromDataToShow },
      { label: tl('sqlPassed'), value: metrics['sql.passed'] },
      { label: tl('sqlFailed'), value: metrics['sql.failed.exception'] },
      { label: tl('currentSpeed'), value: metrics['sql.matched.rate'] },
      {
        label: tl('status'),
        value: tl(enable ? 'activated' : 'deactivated'),
        valueClass: statusClass,
      },
      { label: tl('createdAt'), value: moment(created_at).format('YYYY-MM-DD HH:mm:ss') },
    ]
    // TODO:sql highlight
    container.innerHTML = `
      <ul>
        ${createMsgListHTMLStr(msgArr)}
      </ul>
      <div>
        <label>${tl('SQL')}</label>
        <div class="sql-container">${highlightSQL(sql)}</div>
      </div>
    `
    return container
  }

  const { getStatusLabel, getStatusClass } = useCommonConnectionStatus()
  const { getTypeStr } = useBridgeTypeOptions()

  const createBridgeNodeTooltip = (bridgeID: string) => {
    const targetBridge = bridgeList.find(({ id }) => id === bridgeID)
    if (!targetBridge) {
      return ''
    }

    const container = createContainerEle()
    const { name, metrics, status } = targetBridge
    const statusStr = getStatusLabel(status)
    const statusClass = getStatusClass(status)

    const msgArr = [
      { label: tl('type'), value: getTypeStr(targetBridge) },
      { label: tl('name'), value: name },
      { label: tl('success'), value: metrics.success },
      { label: tl('failure'), value: metrics.failed },
      { label: tl('currentSpeed'), value: metrics.rate + ' Msg/s' },
      { label: tl('status'), value: statusStr, valueClass: statusClass },
    ]

    container.innerHTML = `
      <ul>
        ${createMsgListHTMLStr(msgArr)}
      </ul>
    `
    return container
  }

  /**
   *
   * @param ruleIDConcatTopic {ruleID}:{Topic}
   */
  const createRepublishNodeTooltip = (ruleIDConcatTopic: string) => {
    const reg = new RegExp(`^${ruleList.map(({ id }) => id).join('|')}:(.+)`)
    const matchResult = ruleIDConcatTopic.match(reg)
    if (!matchResult || matchResult.length < 2) {
      return ''
    }
    const [, topicStr] = matchResult
    const container = createContainerEle()
    container.innerHTML = `
    <ul>
      ${createMsgListHTMLStr([{ value: topicStr, label: 'Topic' }])}
    </ul>
    `
    return container
  }

  const getNodeTypeNTargetIDByNodeID = (nodeID: string): { id?: string; type?: NodeType } => {
    const matchResult = nodeID.match(nodeIdReg)
    if (!matchResult) {
      return {}
    }
    const [, , type, id] = matchResult

    return {
      id,
      type: type as NodeType,
    }
  }

  const createTooltipMap: Record<NodeType, (id: string) => HTMLDivElement | string> = {
    [OtherNodeType.Topic]: createSimpleTooltip,
    [RuleOutput.Console]: createEmptyTooltip,
    [OtherNodeType.Event]: createSimpleTooltip,
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

    const { id } = model
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

  const handleNodeClickEvent = (e: IG6GraphEvent) => {
    const id = e?.item?.get('id')
    const { type, id: targetId } = getNodeTypeNTargetIDByNodeID(id)
    if (!id || !type || !targetId) {
      return
    }

    if (type === OtherNodeType.Rule) {
      router.push({ name: 'iot-detail', params: { id: targetId } })
    } else if (type === OtherNodeType.Bridge) {
      router.push({ name: 'bridge-detail', params: { id: targetId } })
    }
  }

  return {
    setRuleList,
    setBridgeList,
    createNodeTooltip,
    handleNodeClickEvent,
  }
}
