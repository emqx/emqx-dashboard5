import { BridgeType } from '@/types/enum'
import type { Component, ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import HTTPConfig from './HTTPConfig.vue'

export default (
  type: Ref<BridgeType>,
): {
  formCom: ComputedRef<Component | null>
} => {
  const comMap = new Map([[BridgeType.Webhook, HTTPConfig]])
  const formCom = computed<Component | null>(() => {
    return comMap.get(type.value) || null
  })
  return { formCom }
}
