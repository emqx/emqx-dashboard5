import { BridgeType } from '@/types/enum'
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
  const formCom = computed<Component | null>(() => {
    if (!type.value) {
      return null
    }
    return connectorComMap.get(type.value) || ConnectorSchemaForm
  })
  return { formCom }
}
