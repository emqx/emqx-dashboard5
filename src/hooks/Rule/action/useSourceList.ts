import { getSimplifiedSources } from '@/api/sources'
import { BridgeItem, NsWithGlobalParams } from '@/types/rule'

export default (): {
  getSourceList: (params?: NsWithGlobalParams) => Promise<Array<BridgeItem>>
} => {
  const getSourceList = async (params?: NsWithGlobalParams) => {
    try {
      const sourceList = await getSimplifiedSources(params)
      return Promise.resolve(sourceList)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return { getSourceList }
}
