import { getActions } from '@/api/action'
import { getConnectors } from '@/api/connector'
import { getBridgeList } from '@/api/ruleengine'
import { BRIDGE_OLD_TYPES_MAP } from '@/common/constants'
import { getBridgeKey, omitArr } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { Action, BridgeItem, Connector } from '@/types/rule'

export default (): {
  getMixedConnectorList: () => Promise<Array<Connector | BridgeItem>>
} => {
  const getNewType = (oldType: string) => {
    for (const [newType, oldTypeArr] of BRIDGE_OLD_TYPES_MAP.entries()) {
      if (oldTypeArr.includes(oldType)) {
        return newType
      }
    }
    return undefined
  }
  const getMixedConnectorList = async (): Promise<Array<Connector | BridgeItem>> => {
    try {
      const [connectorList, actionList, bridgeList] = await Promise.all([
        getConnectors(),
        getActions(),
        getBridgeList(),
      ])
      const actionIdDataMap = actionList.reduce((map, item) => {
        map.set(item.id, item)
        return map
      }, new Map())
      /**
       * Supported for v2
       * When adding a bridge
       * action + connector is created
       *
       * The dashboard will use the bridge item
       * so you need to remove these connectors
       */
      const connectorIndexArrNeedRemoved: Array<number> = []
      bridgeList.forEach(({ id, type: oldType, name }: BridgeItem) => {
        const newType = getNewType(oldType)
        const newId = getBridgeKey({ type: newType as BridgeType, name })
        const sameIdAction = actionIdDataMap.get(id) || actionIdDataMap.get(newId)
        if (sameIdAction) {
          const associatedConnectorName = sameIdAction.connector
          const type = newType || oldType
          const associatedConnectorId = getBridgeKey({
            type: type as BridgeType,
            name: associatedConnectorName,
          })
          const connectorIndex = connectorList.findIndex(({ id }) => id === associatedConnectorId)
          if (connectorIndex !== -1) {
            connectorIndexArrNeedRemoved.push(connectorIndex)
          }
        }
      })
      const connectorListRemovedBridge = omitArr(connectorList, connectorIndexArrNeedRemoved)
      return Promise.resolve(connectorListRemovedBridge.concat(bridgeList))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getMixedConnectorList,
  }
}
