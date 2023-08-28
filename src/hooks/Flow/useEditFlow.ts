import { getBridgeInfo, getRuleInfo } from '@/api/ruleengine'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'
import { RuleItem } from '@/types/rule'
import { Edge, Node } from '@vue-flow/core'
import { unionBy } from 'lodash'
import { ComputedRef, Ref, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import useFlowNode, { NodeType } from './useFlowNode'
import useGenerateFlowDataUtils, { GroupedNode } from './useGenerateFlowDataUtils'

export default (): {
  flowId: ComputedRef<string>
  ruleData: Ref<RuleItem | undefined>
  flowData: Ref<(Node<any, any, string> | Edge)[] | undefined>
  getData: () => Promise<void>
} => {
  const route = useRoute()

  const flowId = computed(() => route.params.id?.toString())
  const ruleData: Ref<undefined | RuleItem> = ref(undefined)
  // let bridgeInfoMap = {}
  const flowData: Ref<undefined | Array<Node | Edge>> = ref(undefined)

  const getRuleData = async () => {
    try {
      ruleData.value = await getRuleInfo(flowId.value)
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const { handleBridgeDataAfterLoaded } = useBridgeDataHandler()
  const addBridgeFormDataToNodes = async (nodes: Array<Node>) => {
    await Promise.allSettled(
      nodes.map(async (item) => {
        if (isBridgerNode(item) && item.data?.formData?.id) {
          const bridgeInfo = await getBridgeInfo(item.data.formData.id)
          item.data.formData = { ...item.data.formData, ...handleBridgeDataAfterLoaded(bridgeInfo) }
          addFlagToBridgeNode(item)
        }
        return Promise.resolve()
      }),
    )
    return nodes
  }

  /**
   * Adding a flag to the node data indicates that these bridges have
   * been added before, which can control whether the name can be modified,
   * and when submitting data, whether the current bridge should call
   * the added API or the updated API
   */
  const addFlagToBridgeNode = (node: Node) => {
    node.data.isCreated = true
    return node
  }

  const {
    generateFlowDataFromRuleItem,
    countNodePositionWhileEditing,
    addFlagToRemovedBridgeNode,
  } = useGenerateFlowDataUtils()
  const { isBridgerNode } = useFlowNode()

  const getFlowData = async () => {
    if (!ruleData.value) {
      return
    }
    const ruleFlowData = generateFlowDataFromRuleItem(ruleData.value)
    const { nodes, edges } = ruleFlowData
    const sourceAndSinkNodes = [...nodes[NodeType.Source], ...nodes[NodeType.Sink]]
    await addBridgeFormDataToNodes(sourceAndSinkNodes)

    Object.entries(nodes).forEach(([key, value]) => {
      nodes[key as keyof GroupedNode] = unionBy(value, 'id')
    })

    countNodePositionWhileEditing(nodes)
    flowData.value = [
      ...Object.entries(nodes).reduce((arr: Array<Node>, [key, value]) => {
        if (Number(key) === NodeType.Source || Number(key) === NodeType.Sink) {
          value.forEach((item) => addFlagToRemovedBridgeNode(item))
        }
        return [...arr, ...value]
      }, []),
      ...edges,
    ]
  }

  const getData = async () => {
    try {
      await getRuleData()
      await getFlowData()
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  return {
    flowId,
    ruleData,
    flowData,
    getData,
  }
}
