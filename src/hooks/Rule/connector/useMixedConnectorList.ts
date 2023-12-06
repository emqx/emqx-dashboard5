import { getActions } from '@/api/action'
import { getConnectors } from '@/api/connector'
import { getBridgeList } from '@/api/ruleengine'
import { BRIDGE_OLD_TYPES_MAP, SUPPORTED_CONNECTOR_TYPES } from '@/common/constants'
import { getBridgeKey, omitArr } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { BridgeItem, Connector } from '@/types/rule'

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
      const bridgeIndexArrNeedRemoved: Array<number> = []
      bridgeList.forEach(({ id, type: oldType, name }: BridgeItem, bridgeIndex: number) => {
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
            if (
              SUPPORTED_CONNECTOR_TYPES.includes(oldType) ||
              (newType && SUPPORTED_CONNECTOR_TYPES.includes(newType as BridgeType))
            ) {
              bridgeIndexArrNeedRemoved.push(bridgeIndex)
            } else {
              connectorIndexArrNeedRemoved.push(connectorIndex)
            }
          }
        }
      })
      const connectorListRemovedBridge: Array<Connector> = omitArr(
        connectorList,
        connectorIndexArrNeedRemoved,
      )
      const bridgeListRemovedConnector: Array<BridgeItem> = omitArr(
        bridgeList,
        bridgeIndexArrNeedRemoved,
      )
      return Promise.resolve([...connectorListRemovedBridge, ...bridgeListRemovedConnector])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getMixedConnectorList,
  }
}
