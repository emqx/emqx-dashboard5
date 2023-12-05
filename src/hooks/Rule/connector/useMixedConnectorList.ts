import { getActions } from '@/api/action'
import { getConnectors } from '@/api/connector'
import { getBridgeList } from '@/api/ruleengine'
import { BRIDGE_OLD_TYPES_MAP } from '@/common/constants'
import { getBridgeKey } from '@/common/tools'
import { BridgeType } from '@/types/enum'
import { Action, BridgeItem, Connector } from '@/types/rule'

export default (): {
  getMixedConnectorList: () => Promise<Array<Connector | BridgeItem>>
} => {
  const getMixedConnectorList = async (): Promise<Array<Connector | BridgeItem>> => {
    try {
      const [connectorList, actionList, bridgeList] = await Promise.all([
        getConnectors(),
        getActions(),
        getBridgeList(),
      ])
      const actionIdArr = actionList.map(({ id }: Action) => id)
      const bridgeIdArr = bridgeList.map(({ id }: BridgeItem) => id)
      /**
       * Supported for v2
       * When adding a bridge
       * action + connector is created
       *
       * The dashboard will use the bridge item
       * so you need to remove these connectors
       */
      const connectorListRemovedBridge = connectorList.filter(
        ({ id, type: newType, name }: Connector) => {
          const oldTypeArr = BRIDGE_OLD_TYPES_MAP.get(newType)
          const isActionIdIncluded = actionIdArr.includes(id)
          let isCreatedFromBridge = false
          if (oldTypeArr) {
            const oldIdArr = oldTypeArr.map((oldType) =>
              getBridgeKey({ type: oldType as BridgeType, name }),
            )
            isCreatedFromBridge = oldIdArr.some((oldId) => bridgeIdArr.includes(oldId))
          } else {
            isCreatedFromBridge = bridgeIdArr.includes(id)
          }

          return !isCreatedFromBridge && isActionIdIncluded
        },
      )
      return Promise.resolve(connectorListRemovedBridge.concat(bridgeList))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getMixedConnectorList,
  }
}
