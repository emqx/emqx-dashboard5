import { BridgeDirection, BridgeType } from '@/types/enum'
import type { Component, ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import BridgeKafkaConsumerConfig from '../../Bridge/Components/BridgeConfig/BridgeKafkaConsumerConfig.vue'
import BridgeMqttConfig from '../../Bridge/Components/BridgeConfig/BridgeMqttConfig.vue'
import UsingSchemaBridgeConfig from '../../Bridge/Components/UsingSchemaBridgeConfig.vue'

export default (
  type: ComputedRef<string> | Ref<string>,
): {
  formCom: ComputedRef<Component | null>
  formComProps: ComputedRef<Record<string, any>>
} => {
  const sourceComMap: Map<string, Component> = new Map([
    [BridgeType.MQTT, BridgeMqttConfig as Component],
    [BridgeType.KafkaConsumer, BridgeKafkaConsumerConfig],
  ])
  const formCom = computed<Component | null>((): Component | null => {
    if (!type.value) {
      return null
    }
    return sourceComMap.get(type.value) || UsingSchemaBridgeConfig
  })

  const formComPropsMap: Map<string, Record<string, any>> = new Map([
    [BridgeType.MQTT, { singleDirection: BridgeDirection.Ingress }],
  ])
  const formComProps = computed(() => {
    const props = formComPropsMap.get(type.value)
    return props || {}
  })
  return { formCom, formComProps }
}
