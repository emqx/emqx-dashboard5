import { getSimplifiedSources } from '@/api/sources'
import { BridgeItem } from '@/types/rule'

export default (): {
  getSourceList: () => Promise<Array<BridgeItem>>
} => {
  const getSourceList = async () => {
    try {
      const sourceList = await getSimplifiedSources()
      return Promise.resolve(sourceList)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return { getSourceList }
}
