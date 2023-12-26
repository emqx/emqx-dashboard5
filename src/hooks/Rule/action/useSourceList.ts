import { getBridgeList } from '@/api/ruleengine'
import { BridgeDirection } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { useBridgeDirection } from '../bridge/useBridgeTypeValue'

export default (): {
  getSourceList: () => Promise<Array<BridgeItem>>
} => {
  const { judgeBridgeDirection } = useBridgeDirection()
  const getSourceList = async () => {
    try {
      const list: Array<BridgeItem> = await getBridgeList()
      return Promise.resolve(
        list.filter((item) => judgeBridgeDirection(item) !== BridgeDirection.Egress),
      )
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { getSourceList }
}
