import { getRules } from '@/api/ruleengine'
import { RuleOutput } from '@/types/enum'
import { OutputItem, RuleItem } from '@/types/rule'
import { EdgeItem, NodeItem, OtherNodeType } from './topologyType'
import useTopologyNodeTooltipNEvent from './useTopologyNodeTooltipNEvent'
import useUtilsForTopology from './useUtilsForTopology'
import iconMap from '@/assets/topologyIcon/index'
import { RULE_TOPOLOGY_ID } from '@/common/constants'

export default () => {
  const { setRuleList } = useTopologyNodeTooltipNEvent()
  const {
    cutLabel,
    addCursorPointerToNodeData,
    judgeInputType,
    judgeOutputType,
    createNodeId,
    getIconFromInputData,
    getIconFromOutputItem,
  } = useUtilsForTopology()

  const createInputNodeNInput2RuleEdge = (
    fromData: string,
    ruleID: string,
  ): { node: NodeItem; edge: EdgeItem } => {
    const inputType = judgeInputType(fromData)
    const idOfInputNode = createNodeId(fromData, inputType)
    let node = {
      id: idOfInputNode,
      label: cutLabel(fromData),
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

  const createOutputNodeNRule2OutputEdge = (
    outputData: OutputItem,
    ruleID: string,
  ): { node: NodeItem; edge: EdgeItem } => {
    const outputType = judgeOutputType(outputData)
    const isConsoleOrRepublish =
      outputType === RuleOutput.Console || outputType === RuleOutput.Republish
    // When output is console or republish, nodes need to be created separately for each rule.
    const target = isConsoleOrRepublish ? ruleID : outputData
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
      const ruleList = await getRules()

      setRuleList(ruleList)

      const { inputNodeList, outputNodeList, input2RuleEdgeList, rule2OutputEdgeList } =
        createNodeNEdgeExceptRuleNode(ruleList)
      const ruleNodeList = ruleList.map((v: RuleItem) => {
        return {
          id: createNodeId(v.id, OtherNodeType.Rule),
          label: cutLabel(v.name || 'rule id:' + v.id),
          img: iconMap.rule,
          style: {
            cursor: 'pointer',
          },
        }
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

  return {
    getData,
  }
}
