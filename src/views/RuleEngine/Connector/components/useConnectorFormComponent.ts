import { SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { BridgeType } from '@/types/enum'
import type { Component, ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import BridgeInfluxdbConfig from '../../Bridge/Components/BridgeConfig/BridgeInfluxdbConfig.vue'
import UsingSchemaBridgeConfig from '../../Bridge/Components/UsingSchemaBridgeConfig.vue'
import ConnectorSchemaForm from './ConnectorSchemaForm.vue'

export default (
  type: Ref<BridgeType>,
): {
  formCom: ComputedRef<Component | null>
} => {
  /**
   * Already supported connector
   */
  const connectorComMap: Map<string, Component> = new Map([])
  /**
   * do not supported connector
   */
  const bridgeComMap: Map<string, Component> = new Map([
    [BridgeType.InfluxDB, BridgeInfluxdbConfig],
  ])
  const formCom = computed<Component | null>(() => {
    if (!type.value) {
      return null
    }
    if (SUPPORTED_CONNECTOR_TYPES.includes(type.value)) {
      return connectorComMap.get(type.value) || ConnectorSchemaForm
    }
    return bridgeComMap.get(type.value) || UsingSchemaBridgeConfig
  })
  return { formCom }
}
