import { getBridgeList } from '@/api/ruleengine'
import { BridgeDirection } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { useBridgeDirection } from '../bridge/useBridgeTypeValue'
import { getSources } from '@/api/sources'

export default (): {
  getSourceList: () => Promise<Array<BridgeItem>>
} => {
  const { judgeBridgeDirection } = useBridgeDirection()
  const getSourceList = async () => {
    try {
      const bridgeList: Array<BridgeItem> = await getBridgeList()
      let sourceList: Array<BridgeItem> = []
      // TODO: remove it
      try {
        sourceList = await getSources()
      } catch (error) {
        //
      }
      /**
       * Filter duplicates and actions
       */
      const filteredBridgeList = bridgeList.filter((item) => {
        const isIngress = judgeBridgeDirection(item) !== BridgeDirection.Egress
        const notDuplicated = sourceList.every(({ id }) => id !== item.id)
        return isIngress && notDuplicated
      })
      return Promise.resolve([...sourceList, ...filteredBridgeList])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { getSourceList }
}
