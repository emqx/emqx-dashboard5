import { getSources } from '@/api/sources'
import { BridgeItem } from '@/types/rule'

export default (): {
  getSourceList: () => Promise<Array<BridgeItem>>
} => {
  const getSourceList = async () => {
    try {
      const sourceList: Array<BridgeItem> = await getSources()
      return Promise.resolve(sourceList)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return { getSourceList }
}
