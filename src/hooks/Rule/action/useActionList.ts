import { getSimplifiedActions } from '@/api/action'
import { BridgeItem, NsParams } from '@/types/rule'

export default (): {
  getActionList: (params?: NsParams) => Promise<Array<BridgeItem>>
} => {
  const getActionList = async (params?: NsParams): Promise<Array<BridgeItem>> => {
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
