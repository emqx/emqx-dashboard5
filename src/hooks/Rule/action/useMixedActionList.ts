import { getActions } from '@/api/action'
import { getBridgeList } from '@/api/ruleengine'
import { SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { getBridgeKey, omitArr } from '@/common/tools'
import { BridgeDirection, BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { useBridgeDirection, useOldNewType } from '../bridge/useBridgeTypeValue'

export default (): {
  getMixedActionList: () => Promise<Array<BridgeItem>>
  getMixedActionListForRule: () => Promise<Array<BridgeItem>>
} => {
  const { BRIDGE_OLD_TYPES_MAP, getNewType } = useOldNewType()

  const { judgeBridgeDirection } = useBridgeDirection()
  /**
   * bridge + action list
   */
  const getMixedActionList = async (): Promise<Array<BridgeItem>> => {
    try {
      const [actionList, rawBridgeList]: Array<Array<BridgeItem>> = await Promise.all([
        getActions(),
        getBridgeList(),
      ])
      // filter source
      const bridgeList = rawBridgeList.filter(
        (item) => judgeBridgeDirection(item) !== BridgeDirection.Ingress,
      )
      /**
       * Supported v2 type
       * When creating a bridge
       * An action will be created at the same time
       *
       * Here, when deduplicating, you need to consider the compatibility of the dashboard
       *
       * The dashboard supports v2, remove the part in bridge
       * If the dashboard does not support it yet, remove the action.
       */
      const bridgeIdArr: Array<string> = bridgeList.map(({ id }: BridgeItem) => id)
      const actionIndexArrNeedRemoved: Array<number> = []
      const bridgeIndexArrNeedRemoved: Array<number> = []
      actionList.forEach(({ id: actionId, name, type: newType }, actionIndex) => {
        const oldTypeArr = BRIDGE_OLD_TYPES_MAP.get(newType)
        let bridgeIndex = -1
        if (oldTypeArr) {
          const oldIdArr = oldTypeArr.map((oldType) =>
            getBridgeKey({ type: oldType as BridgeType, name }),
          )
          bridgeIndex = bridgeIdArr.findIndex((id) => oldIdArr.includes(id))
        } else {
          bridgeIndex = bridgeIdArr.findIndex((id) => id === actionId)
        }
        if (bridgeIndex > -1) {
          if (SUPPORTED_CONNECTOR_TYPES.includes(newType)) {
            bridgeIndexArrNeedRemoved.push(bridgeIndex)
          } else {
            actionIndexArrNeedRemoved.push(actionIndex)
          }
        }
      })

      const filteredActionList: Array<BridgeItem> = omitArr(actionList, actionIndexArrNeedRemoved)
      const filteredBridgeList: Array<BridgeItem> = omitArr(bridgeList, bridgeIndexArrNeedRemoved)
      return Promise.resolve(filteredActionList.concat(filteredBridgeList))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * when for rule, add new id
   */
  const getMixedActionListForRule = async () => {
    try {
      const list = await getMixedActionList()
      list.forEach((item: any) => {
        const { type } = item
        const newType = getNewType(type)
        if (newType) {
          item.type = newType
          item.realType = type
          item.id = getBridgeKey(item)
        }
      })
      return Promise.resolve(list)
    } catch (error) {
      return Promise.reject()
    }
  }

  return {
    getMixedActionList,
    getMixedActionListForRule,
  }
}
