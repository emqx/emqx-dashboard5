import { BridgeType } from '@/types/enum'
import bridgeWebhook from '@/assets/img/webhook.png'
import bridgeMQTT from '@/assets/img/mqtt.png'
import bridgeInfluxDB from '@/assets/img/influxdb.png'
import bridgeMySQL from '@/assets/img/mysql.png'
import bridgeKafka from '@/assets/img/kafka.png'
import bridgeRedis from '@/assets/img/redis.png'
import bridgeGCP from '@/assets/img/gcp_pubsub.png'
import bridgeMongoDB from '@/assets/img/mongodb.png'
import console from './console.png'
import event from './event.png'
import republish from './republish.png'
import rule from './rule.png'
import topic from './topic.png'

const iconMap: Record<string, SVGAElement> = {
  [`bridge-${BridgeType.Webhook}`]: bridgeWebhook,
  [`bridge-${BridgeType.MQTT}`]: bridgeMQTT,
  [`bridge-${BridgeType.InfluxDB}`]: bridgeInfluxDB,
  [`bridge-${BridgeType.MySQL}`]: bridgeMySQL,
  [`bridge-${BridgeType.Kafka}`]: bridgeKafka,
  [`bridge-${BridgeType.Redis}`]: bridgeRedis,
  [`bridge-${BridgeType.GCP}`]: bridgeGCP,
  [`bridge-${BridgeType.MongoDB}`]: bridgeMongoDB,
  console,
  event,
  republish,
  rule,
  topic,
}

export default iconMap
