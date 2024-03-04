import { getConnectors } from '@/api/connector'
import { BridgeItem, Connector } from '@/types/rule'

export default (): {
  getConnectorList: () => Promise<Array<Connector | BridgeItem>>
} => {
  const getConnectorList = async (): Promise<Array<Connector | BridgeItem>> => {
    try {
      const data = await getConnectors()
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getConnectorList,
  }
}
