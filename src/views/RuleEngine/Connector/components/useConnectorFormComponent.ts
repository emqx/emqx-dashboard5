import { BridgeType } from '@/types/enum'
import type { Component, ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import HTTPConfig from './HTTPConfig.vue'
import ConnectorSchemaForm from './ConnectorSchemaForm.vue'

export default (
  type: Ref<BridgeType>,
): {
  formCom: ComputedRef<Component | null>
} => {
  const comMap = new Map([[BridgeType.Webhook, HTTPConfig]])
  const formCom = computed<Component | null>(() => {
    return comMap.get(type.value) || ConnectorSchemaForm
  })
  return { formCom }
}
