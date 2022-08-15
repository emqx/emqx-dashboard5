import { BridgeType } from '@/types/enum'
import bridgeWebhook from '@/assets/img/webhook.png'
import bridgeMQTT from '@/assets/img/mqtt.png'
import console from './console.png'
import event from './event.png'
import republish from './republish.png'
import rule from './rule.png'
import topic from './topic.png'

const iconMap: Record<string, SVGAElement> = {
  [`bridge-${BridgeType.Webhook}`]: bridgeWebhook,
  [`bridge-${BridgeType.MQTT}`]: bridgeMQTT,
  console,
  event,
  republish,
  rule,
  topic,
}

export default iconMap
