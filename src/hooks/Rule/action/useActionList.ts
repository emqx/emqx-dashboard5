import { getSimplifiedActions } from '@/api/action'
import { BridgeItem } from '@/types/rule'

export default (): {
  getActionList: () => Promise<Array<BridgeItem>>
} => {
  const getActionList = async (): Promise<Array<BridgeItem>> => {
    try {
      const data = await getSimplifiedActions()
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getActionList,
  }
}
