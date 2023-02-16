import { BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'

export default (): {
  judgeShowEgressStats: (bridge: BridgeItem) => boolean
  judgeShowIngressStats: (bridge: BridgeItem) => boolean
} => {
  const judgeShowEgressStats = (bridge: BridgeItem) => {
    // TODO: consider kafka
    if ('ingress' in bridge) {
      const withIngress = 'ingress' in bridge && !!bridge.ingress?.remote?.topic
      const withoutEgress = !('egress' in bridge) || !bridge.egress?.remote?.topic
      const justShowIngress = withIngress && withoutEgress
      return !justShowIngress
    }
    return true
  }
  const judgeShowIngressStats = (bridge: BridgeItem) => {
    const isMQTT = bridge.type === BridgeType.MQTT
    const withIngress = 'ingress' in bridge && !!bridge.ingress?.remote?.topic
    return isMQTT && withIngress
  }

  return {
    judgeShowEgressStats,
    judgeShowIngressStats,
  }
}
