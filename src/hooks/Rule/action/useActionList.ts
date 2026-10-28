import { getSimplifiedActions } from '@/api/action'
import { BridgeItem, NsWithGlobalParams } from '@/types/rule'

export default (): {
  getActionList: (params?: NsWithGlobalParams) => Promise<Array<BridgeItem>>
} => {
  const getActionList = async (params?: NsWithGlobalParams): Promise<Array<BridgeItem>> => {
    try {
      const data = await getSimplifiedActions(params)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getActionList,
  }
}
