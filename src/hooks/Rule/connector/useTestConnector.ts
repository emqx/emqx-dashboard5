import { testConnectorConnectivity } from '@/api/connector'
import { Connector } from '@/types/rule'
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
      isTesting.value = false
      return Promise.resolve()
    } catch (error) {
      isTesting.value = false
      return Promise.reject()
    }
  }

  return {
    isTesting,
    testConnectivity,
  }
}
