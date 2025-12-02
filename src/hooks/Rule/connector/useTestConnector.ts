import { testConnectorConnectivity } from '@/api/connector'
import { Connector } from '@/types/rule'

export default (): {
  isTesting: Ref<boolean>
  testConnectivity: (connector: Connector) => Promise<void>
} => {
  const isTesting = ref(false)

  const { handleConnectorDataBeforeSubmit } = useConnectorDataHandler()
  const { getNsParams } = useNsParams()
  const testConnectivity = async (connector: Connector) => {
    try {
      isTesting.value = true
      const { namespace, ...others } = connector
      const data = await handleConnectorDataBeforeSubmit(others)
      await testConnectorConnectivity(data, getNsParams(namespace))
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
