import iconMap from '@/assets/topologyIcon/index'
import {
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  RULE_INPUT_EVENT_PREFIX,
  RULE_TOPOLOGY_ID,
} from '@/common/constants'
import { BridgeType, RuleOutput } from '@/types/enum'
import { OutputItem } from '@/types/rule'
import { NodeItem, NodeType, OtherNodeType, RuleInputType, RuleOutputType } from './topologyType'
import { escapeRegExp } from 'lodash'

export default (): {
  cutLabel: (label: string) => string
  addCursorPointerToNodeData: (node: NodeItem) => NodeItem
  judgeInputType: (from: string) => RuleInputType
  judgeOutputType: (output: OutputItem) => RuleOutputType
  createNodeId: (target: string, targetType: NodeType) => string
  getBridgeTypeFromString: (str: string) => BridgeType
  getIconFromInputData: (input: string) => SVGElement
  getIconFromOutputItem: (output: OutputItem) => SVGAElement
  getBridgeNodeLabel: (bridgeID: string) => string
} => {
  /* 
  Node Id Format:
  bridge, event, rule, topic: {randomStr}-{type:bridge | event | rule | topic}-{id|name}]
  Because except for these two, other identical nodes must be merged
  console:  {randomStr}-{type:console | republish}-{ruleID}]
  republish: {randomStr}-{type:console | republish}-{ruleID}:{republish topic}]
 */
  // When output is console or republish, nodes need to be created separately for each rule.

  const LABEL_MAX_LENGTH_TO_SHOW = 28
  const LABEL_TOO_LONG_SUFFIX = '...'

  const cutLabel = (label: string) => {
    return label.length > 28
      ? label.substring(0, LABEL_MAX_LENGTH_TO_SHOW - LABEL_TOO_LONG_SUFFIX.length) +
          LABEL_TOO_LONG_SUFFIX
      : label
  }

  const addCursorPointerToNodeData = (node: NodeItem): NodeItem => {
    return {
      ...node,
      labelCfg: {
        style: {
          cursor: 'pointer',
        },
      },
      style: {
        cursor: 'pointer',
      },
    }
  }

  const judgeInputType = (from: string): RuleInputType => {
    if (from.indexOf(RULE_INPUT_EVENT_PREFIX) > -1) {
      return OtherNodeType.Event
    }
    // now has mqtt & http
    const reg = new RegExp(`^${escapeRegExp(RULE_INPUT_BRIDGE_TYPE_PREFIX)}`)
    if (reg.test(from)) {
      return OtherNodeType.Bridge
    }
    return OtherNodeType.Topic
  }

  const judgeOutputType = (output: OutputItem): RuleOutputType => {
    if (typeof output === 'string') {
      return OtherNodeType.Bridge
    }
    if (output.function === RuleOutput.Console) {
      return RuleOutput.Console
    }
    return RuleOutput.Republish
  }

  /**
   * Called when the type of node can be determined
   */
  const createNodeId = (target: string, targetType: NodeType) => {
    return `${RULE_TOPOLOGY_ID}-${targetType}-${target}`
  }

  const getBridgeTypeFromString = (str: string): BridgeType => {
    // now has mqtt & http
    const bridgeTypeList = [BridgeType.MQTT, BridgeType.HTTP]
    return bridgeTypeList.find((item) => str.indexOf(item) > -1) || BridgeType.MQTT
  }

  const getIconFromInputData = (input: string): SVGElement => {
    if (input.indexOf(BridgeType.MQTT) > -1) {
      return iconMap['bridge-mqtt']
    }
    if (input.indexOf('$events') > -1) {
      return iconMap.event
    }
    return iconMap.topic
  }

  const getIconFromOutputItem = (output: OutputItem) => {
    if (typeof output === 'string') {
      const key = `bridge-${getBridgeTypeFromString(output)}`
      return iconMap[key]
    } else {
      return output.function === RuleOutput.Console ? iconMap.console : iconMap.republish
    }
  }

  const getBridgeNodeLabel = (bridgeID: string): string => bridgeID.slice(bridgeID.indexOf(':') + 1)

  return {
    cutLabel,
    addCursorPointerToNodeData,
    judgeInputType,
    judgeOutputType,
    createNodeId,
    getBridgeTypeFromString,
    getIconFromInputData,
    getIconFromOutputItem,
    getBridgeNodeLabel,
  }
}
