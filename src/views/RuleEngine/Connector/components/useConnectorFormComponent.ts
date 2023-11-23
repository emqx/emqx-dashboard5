import { SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { BridgeType } from '@/types/enum'
import BridgeMqttConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeMqttConfig.vue'
import type { Component, ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import BridgeInfluxdbConfig from '../../Bridge/Components/BridgeConfig/BridgeInfluxdbConfig.vue'
import BridgeKafkaConsumerConfig from '../../Bridge/Components/BridgeConfig/BridgeKafkaConsumerConfig.vue'
import BridgePulsarConfig from '../../Bridge/Components/BridgeConfig/BridgePulsarConfig.vue'
import UsingSchemaBridgeConfig from '../../Bridge/Components/UsingSchemaBridgeConfig.vue'
import ConnectorSchemaForm from './ConnectorSchemaForm.vue'
import HTTPConfig from './HTTPConfig.vue'

export default (
  type: Ref<BridgeType>,
): {
  formCom: ComputedRef<Component | null>
} => {
  /**
   * Already supported connector
   */
  const connectorComMap = new Map([[BridgeType.Webhook, HTTPConfig]])
  /**
   * do not supported connector
   */
  const bridgeComMap: Map<string, Component> = new Map([
    [BridgeType.MQTT, BridgeMqttConfig],
    [BridgeType.KafkaConsumer, BridgeKafkaConsumerConfig as Component],
    [BridgeType.InfluxDB, BridgeInfluxdbConfig],
    [BridgeType.Pulsar, BridgePulsarConfig],
  ])
  const formCom = computed<Component | null>(() => {
    if (SUPPORTED_CONNECTOR_TYPES.includes(type.value)) {
      return connectorComMap.get(type.value) || ConnectorSchemaForm
    }
    return bridgeComMap.get(type.value) || UsingSchemaBridgeConfig
  })
  return { formCom }
}
