import { getSimplifiedSources } from '@/api/sources'
import { BridgeItem, NsParams } from '@/types/rule'

export default (): {
  getSourceList: (params?: NsParams) => Promise<Array<BridgeItem>>
} => {
  const getSourceList = async (params?: NsParams) => {
    try {
      const sourceList = await getSimplifiedSources(params)
      return Promise.resolve(sourceList)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return { getSourceList }
}
