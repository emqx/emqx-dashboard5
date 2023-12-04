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
  const oldNewTypeMap = new Map(
    [...BRIDGE_OLD_TYPES_MAP].reduce((map, [key, value]) => {
      map.set(value, key)
      return map
    }, new Map([])),
  )

  const getMixedConnectorList = async (): Promise<Array<Connector | BridgeItem>> => {
    try {
      const [connectorList, actionList, bridgeList] = await Promise.all([
        getConnectors(),
        getActions(),
        getBridgeList(),
      ])
      const actionIdArr = actionList.map(({ id }: Action) => id)
      const bridgeListRemovedAction = bridgeList.filter(({ id, name, type }: Action) => {
        const newType = oldNewTypeMap.get(type)
        const isIdIncluded = !actionIdArr.includes(id)
        const isNewActionIdIncluded = !newType
          ? false
          : !actionIdArr.includes(getBridgeKey({ type: newType as BridgeType, name }))
        return isIdIncluded && isNewActionIdIncluded
      })
      return Promise.resolve(connectorList.concat(bridgeListRemovedAction))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getMixedConnectorList,
  }
}
