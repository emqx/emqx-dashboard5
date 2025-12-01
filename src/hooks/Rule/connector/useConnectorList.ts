import { getConnectors } from '@/api/connector'
import { BridgeItem, Connector, NsWithGlobalParams } from '@/types/rule'

export default (): {
  getConnectorList: (params?: NsWithGlobalParams) => Promise<Array<Connector | BridgeItem>>
} => {
  const getConnectorList = async (
    params?: NsWithGlobalParams,
  ): Promise<Array<Connector | BridgeItem>> => {
    try {
      const data = await getConnectors(params)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getConnectorList,
  }
}
