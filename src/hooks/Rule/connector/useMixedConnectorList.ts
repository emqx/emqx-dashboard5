import { getActions } from '@/api/action'
import { getConnectors } from '@/api/connector'
import { getBridgeList } from '@/api/ruleengine'
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
      const bridgeListRemovedAction = bridgeList.filter(
        ({ id }: Action) => !actionIdArr.includes(id),
      )
      return Promise.resolve(connectorList.concat(bridgeListRemovedAction))
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    getMixedConnectorList,
  }
}
