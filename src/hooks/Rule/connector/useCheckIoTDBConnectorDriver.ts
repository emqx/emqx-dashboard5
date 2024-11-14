import { getBridgeKey } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import useHandleConnectorItem from './useHandleConnectorItem'

export default (): {
  checkIsIoTDBThriftConnector: (name: string) => Promise<boolean>
} => {
  const { getConnectorDetail } = useHandleConnectorItem()
  const checkIsIoTDBThriftConnector = async (name: string) => {
    try {
      const connectorId = getBridgeKey({ type: BridgeType.IoTDB, name })
      const { driver } = await getConnectorDetail(connectorId)
      const ret = /thrift/i.test(driver)
      return Promise.resolve(ret)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return {
    checkIsIoTDBThriftConnector,
  }
}
