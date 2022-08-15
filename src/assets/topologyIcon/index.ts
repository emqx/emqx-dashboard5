import { BridgeType } from '@/types/enum'
import bridgeWebhook from '@/assets/img/webhook.png'
import bridgeMQTT from '@/assets/img/mqtt.png'
import bridgeInfluxDB from '@/assets/img/influxdb.png'
import bridgeMySQL from '@/assets/img/mysql.png'
import console from './console.png'
import event from './event.png'
import republish from './republish.png'
import rule from './rule.png'
import topic from './topic.png'

const iconMap: Record<string, SVGAElement> = {
  [`bridge-${BridgeType.Webhook}`]: bridgeWebhook,
  [`bridge-${BridgeType.MQTT}`]: bridgeMQTT,
  [`bridge-${BridgeType.InfluxDBV1}`]: bridgeInfluxDB,
  [`bridge-${BridgeType.InfluxDBV2}`]: bridgeInfluxDB,
  [`bridge-${BridgeType.InfluxDBUPD}`]: bridgeInfluxDB,
  [`bridge-${BridgeType.MySQL}`]: bridgeMySQL,
  console,
  event,
  republish,
  rule,
  topic,
}

export default iconMap
