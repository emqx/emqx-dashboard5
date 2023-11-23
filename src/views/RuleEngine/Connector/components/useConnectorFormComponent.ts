import { SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { BridgeType } from '@/types/enum'
import BridgeMqttConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeMqttConfig.vue'
import type { Component, ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
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
  const bridgeComMap = new Map([[BridgeType.MQTT, BridgeMqttConfig]])
  const formCom = computed<Component | null>(() => {
    if (SUPPORTED_CONNECTOR_TYPES.includes(type.value)) {
      return connectorComMap.get(type.value) || ConnectorSchemaForm
    }
    return bridgeComMap.get(type.value) || null
  })
  return { formCom }
}
