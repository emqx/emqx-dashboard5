import { testConnect } from '@/api/ruleengine'
import { BridgeItem } from '@/types/rule'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useBridgeDataHandler } from '../useDataHandler'

export default (): {
  isTesting: Ref<boolean>
  testConnectivity: (bridge: BridgeItem) => Promise<void>
} => {
  const isTesting = ref(false)

  const { handleBridgeDataBeforeSubmit } = useBridgeDataHandler()
  const testConnectivity = async (bridge: BridgeItem) => {
    try {
      isTesting.value = true
      await testConnect(handleBridgeDataBeforeSubmit(bridge))
    } catch (error) {
      //
    } finally {
      isTesting.value = false
    }
  }

  return {
    isTesting,
    testConnectivity,
  }
}
