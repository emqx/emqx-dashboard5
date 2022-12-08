import { MQTTBridgeDirection, RuleOutput } from '@/types/enum'
import { getRules, queryRuleMetrics } from '@/api/ruleengine'
import { OutputItem, OutputItemObj, RuleDataItemWithMetrics, RuleItem } from '@/types/rule'
import { EdgeItem, NodeItem, OtherNodeType } from './topologyType'
import useUtilsForTopology from './useUtilsForTopology'
import iconMap from '@/assets/topologyIcon/index'
import {
  RULE_INPUT_BRIDGE_TYPE_PREFIX,
  RULE_MAX_NUM_PER_PAGE,
  BRIDGE_TYPES_WITH_TWO_DIRECTIONS,
} from '@/common/constants'
import { ref, Ref } from 'vue'

interface RuleData {
  nodeData: {
    input: Array<NodeItem>
    rule: Array<NodeItem>
    output: Array<NodeItem>
  }
  edgeData: {
    rule2Output: Array<EdgeItem>
    input2Rule: Array<EdgeItem>
  }
}

export default (): {
  pageData: Ref<{
    count: number
    page: number
  }>
  getData: () => Promise<RuleData>
  getRuleList: () => Array<RuleDataItemWithMetrics>
  getOtherPageData: (page: number) => Promise<RuleData>
} => {
  let ruleList: Array<RuleDataItemWithMetrics> = []
  const pageData = ref({
    count: 0,
    page: 1,
  })
  const {
    cutLabel,
    addCursorPointerToNodeData,
    judgeInputType,
    judgeOutputType,
    createNodeId,
    getIconFromInputData,
    getIconFromOutputItem,
    getBridgeNodeLabel,
    getBridgeTypeFromString,
    createBridgeSingleDirectionNodeId,
  } = useUtilsForTopology()

  const createInputNodeNInput2RuleEdge = (
    fromData: string,
    ruleID: string,
  ): { node: NodeItem; edge: EdgeItem } => {
    const inputType = judgeInputType(fromData)
    /**
     * before cut length, if is bridge, cut prefix
     */
    const rawFrom =
      inputType === OtherNodeType.Bridge
        ? fromData.slice(RULE_INPUT_BRIDGE_TYPE_PREFIX.length)
        : fromData
    const isBridgeNode = inputType === OtherNodeType.Bridge
    const label = isBridgeNode ? getBridgeNodeLabel(rawFrom) : rawFrom
    let idOfInputNode = createNodeId(rawFrom, inputType)
    if (
      isBridgeNode &&
      BRIDGE_TYPES_WITH_TWO_DIRECTIONS.includes(getBridgeTypeFromString(fromData))
    ) {
      idOfInputNode = createBridgeSingleDirectionNodeId(rawFrom, MQTTBridgeDirection.In)
    }

    let node: NodeItem = {
      id: idOfInputNode,
      label: cutLabel(label),
      img: getIconFromInputData(fromData),
      _customData: { id: rawFrom, type: inputType },
    }
    if (inputType === OtherNodeType.Bridge) {
      node = addCursorPointerToNodeData(node)
    }
    return {
      node,
      edge: {
        source: idOfInputNode,
        target: createNodeId(ruleID, OtherNodeType.Rule),
        _customData: {
          source: rawFrom,
          target: ruleID,
        },
      },
    }
  }

  const getTargetStrInNodeId = (outputData: OutputItem, ruleID: string) => {
    const outputType = judgeOutputType(outputData)

    const isConsole = outputType === RuleOutput.Console
    const isRepublish = outputType === RuleOutput.Republish
    // When output is console or republish, nodes need to be created separately for each rule.
    if (isConsole) {
      return ruleID
    }
    if (isRepublish) {
      return `${ruleID}:${(outputData as OutputItemObj)?.args?.topic}`
    }
    return outputData
  }

  const createOutputNodeNRule2OutputEdge = (
    outputData: OutputItem,
    ruleID: string,
  ): { node: NodeItem; edge: EdgeItem } => {
    const outputType = judgeOutputType(outputData)
    const target = getTargetStrInNodeId(outputData, ruleID)
    const rawNodeLabel = typeof outputData === 'object' ? outputData?.function || '' : outputData
    const isBridgeNode = outputType === OtherNodeType.Bridge
    const labelBeforeCut = isBridgeNode ? getBridgeNodeLabel(rawNodeLabel) : rawNodeLabel
    let toNode = createNodeId(target as string, outputType)
    if (
      isBridgeNode &&
      BRIDGE_TYPES_WITH_TWO_DIRECTIONS.includes(getBridgeTypeFromString(outputData as string))
    ) {
      toNode = createBridgeSingleDirectionNodeId(outputData as string, MQTTBridgeDirection.Out)
    }

    let node: NodeItem = {
      id: toNode,
      label: cutLabel(labelBeforeCut),
      img: getIconFromOutputItem(outputData),
      _customData: { type: outputType, id: rawNodeLabel },
    }
    if (outputType === OtherNodeType.Bridge) {
      node = addCursorPointerToNodeData(node)
    }
    return {
      node,
      edge: { source: createNodeId(ruleID, OtherNodeType.Rule), target: toNode },
    }
  }

  const createNodeNEdgeExceptRuleNode = (
    ruleArr: Array<RuleItem>,
  ): {
    inputNodeList: Array<NodeItem>
    outputNodeList: Array<NodeItem>
    input2RuleEdgeList: Array<EdgeItem>
    rule2OutputEdgeList: Array<EdgeItem>
  } => {
    const inputNodeList: Array<NodeItem> = []
    const outputNodeList: Array<NodeItem> = []
    const input2RuleEdgeList: Array<EdgeItem> = []
    const rule2OutputEdgeList: Array<EdgeItem> = []
    ruleArr.forEach((v) => {
      /* inputNodeList & input2RuleEdgeList */
      if (v.from instanceof Array) {
        v.from.forEach((from) => {
          const { node, edge } = createInputNodeNInput2RuleEdge(from, v.id)
          input2RuleEdgeList.push(edge)
          inputNodeList.push(node)
        })
      } else {
        const { node, edge } = createInputNodeNInput2RuleEdge(v.from, v.id)
        input2RuleEdgeList.push(edge)
        inputNodeList.push(node)
      }

      /* outputNodeList & rule2OutputEdgeList */
      // When the outputs of multiple rules point to same bridge, they all point to the same bridge node.
      if (v.actions instanceof Array) {
        v.actions.forEach((output) => {
          const { node, edge } = createOutputNodeNRule2OutputEdge(output, v.id)
          rule2OutputEdgeList.push(edge)
          outputNodeList.push(node)
        })
      } else {
        const { node, edge } = createOutputNodeNRule2OutputEdge(v.actions, v.id)
        rule2OutputEdgeList.push(edge)
        outputNodeList.push(node)
      }
    })

    return {
      inputNodeList,
      outputNodeList,
      input2RuleEdgeList,
      rule2OutputEdgeList,
    }
  }

  const getOtherPageData = async (page: number) => {
    pageData.value.page = page
    return getData()
  }

  const getData = async () => {
    try {
      const { meta, data } = await getRules({
        page: pageData.value.page,
        limit: RULE_MAX_NUM_PER_PAGE,
      })
      pageData.value.count = meta.count
      ruleList = await Promise.all(
        data.map(async (item) => {
          try {
            const { metrics } = await queryRuleMetrics(item.id)
            return Promise.resolve({ ...item, metrics })
          } catch (error) {
            console.error(error)
            return Promise.resolve({ ...item, metrics: {} })
          }
        }),
      )

      const { inputNodeList, outputNodeList, input2RuleEdgeList, rule2OutputEdgeList } =
        createNodeNEdgeExceptRuleNode(ruleList)
      const ruleNodeList = ruleList.map((v: RuleItem) => {
        return addCursorPointerToNodeData({
          id: createNodeId(v.id, OtherNodeType.Rule),
          label: cutLabel(v.name || 'rule id:' + v.id),
          img: iconMap.rule,
          _customData: { id: v.id, type: OtherNodeType.Rule },
        })
      })

      const nodeData = {
        input: inputNodeList,
        rule: ruleNodeList,
        output: outputNodeList,
      }
      const edgeData = {
        rule2Output: rule2OutputEdgeList,
        input2Rule: input2RuleEdgeList,
      }
      return Promise.resolve({ nodeData, edgeData })
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  const getRuleList = () => ruleList

  return {
    pageData,
    getData,
    getRuleList,
    getOtherPageData,
  }
}
