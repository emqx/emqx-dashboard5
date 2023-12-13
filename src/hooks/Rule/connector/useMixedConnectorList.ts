import { getActions } from '@/api/action'
import { getConnectors } from '@/api/connector'
import { getBridgeList } from '@/api/ruleengine'
import { getBridgeKey, omitArr } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { BridgeItem, Connector } from '@/types/rule'
import { isConnectorSupported, useOldNewType } from '../bridge/useBridgeTypeValue'

export default (): {
  getMixedConnectorList: () => Promise<Array<Connector | BridgeItem>>
} => {
  const { getNewType } = useOldNewType()

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
              isConnectorSupported(oldType) ||
              (newType && isConnectorSupported(newType as BridgeType))
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
      connectorListRemovedBridge.forEach((item) => {
        if (!isConnectorSupported(item.type)) {
          item.canNotView = true
        }
      })
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
