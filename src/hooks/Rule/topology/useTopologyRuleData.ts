import { getRules } from '@/api/ruleengine'
import { RuleOutput } from '@/types/enum'
import { OutputItem, OutputItemObj, RuleItem } from '@/types/rule'
import { EdgeItem, NodeItem, OtherNodeType } from './topologyType'
import useUtilsForTopology from './useUtilsForTopology'
import iconMap from '@/assets/topologyIcon/index'
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'

export default (): {
  getData: () => Promise<{
    nodeData: {
      input: Array<NodeItem>
      rule: Array<NodeItem>
      output: Array<NodeItem>
    }
    edgeData: {
      rule2Output: Array<EdgeItem>
      input2Rule: Array<EdgeItem>
    }
  }>
  getRuleList: () => Array<RuleItem>
} => {
  let ruleList: Array<RuleItem> = []
  const {
    cutLabel,
    addCursorPointerToNodeData,
    judgeInputType,
    judgeOutputType,
    createNodeId,
    getIconFromInputData,
    getIconFromOutputItem,
    getBridgeNodeLabel,
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
    const idOfInputNode = createNodeId(rawFrom, inputType)

    let node = {
      id: idOfInputNode,
      label: cutLabel(getBridgeNodeLabel(rawFrom)),
      img: getIconFromInputData(fromData),
    }
    if (inputType === OtherNodeType.Bridge) {
      node = addCursorPointerToNodeData(node)
    }
    return {
      node,
      edge: { source: idOfInputNode, target: createNodeId(ruleID, OtherNodeType.Rule) },
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
    const outputNodeLabel = typeof outputData === 'object' ? outputData?.function || '' : outputData
    const toNode = createNodeId(target as string, outputType)
    let node: NodeItem = {
      id: toNode,
      label: cutLabel(outputNodeLabel),
      img: getIconFromOutputItem(outputData),
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
      if (v.outputs instanceof Array) {
        v.outputs.forEach((output) => {
          const { node, edge } = createOutputNodeNRule2OutputEdge(output, v.id)
          rule2OutputEdgeList.push(edge)
          outputNodeList.push(node)
        })
      } else {
        const { node, edge } = createOutputNodeNRule2OutputEdge(v.outputs, v.id)
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

  const getData = async () => {
    try {
      ruleList = await getRules()

      const { inputNodeList, outputNodeList, input2RuleEdgeList, rule2OutputEdgeList } =
        createNodeNEdgeExceptRuleNode(ruleList)
      const ruleNodeList = ruleList.map((v: RuleItem) => {
        return addCursorPointerToNodeData({
          id: createNodeId(v.id, OtherNodeType.Rule),
          label: cutLabel(v.name || 'rule id:' + v.id),
          img: iconMap.rule,
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
    getData,
    getRuleList,
  }
}
