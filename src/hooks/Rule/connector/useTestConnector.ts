import { testConnectorConnectivity } from '@/api/connector'
import { Connector } from '@/types/rule'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useConnectorDataHandler } from '../useDataHandler'

export default (): {
  isTesting: Ref<boolean>
  testConnectivity: (connector: Connector) => Promise<void>
} => {
  const isTesting = ref(false)

  const { handleConnectorDataBeforeSubmit } = useConnectorDataHandler()
  const testConnectivity = async (connector: Connector) => {
    try {
      isTesting.value = true
      await testConnectorConnectivity(handleConnectorDataBeforeSubmit(connector))
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
