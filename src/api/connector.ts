import http from '@/common/http'
import { getBridgeKey } from '@/common/tools'
import { Connector } from '@/types/rule'

export const postConnectorsProbe = (data: Connector): Promise<void> => {
  return http.post(`/connectors_probe`, data)
}

export const deleteConnectorsId = (id: string): Promise<void> => {
  return http.delete(`/connectors/${id}`)
}

export const getConnectorDetail = (id: string): Promise<Connector> => {
  return http.get(`/connectors/${id}`)
}

export const putConnectorsId = (id: string, data: Connector): Promise<Connector> => {
  return http.put(`/connectors/${id}`, data)
}

export const postConnectorsIdOperation = (id: string, operation: 'start'): Promise<void> => {
  return http.post(`/connectors/${id}/${operation}`)
}

export const postNodesNodeConnectorsIdOperation = (
  node: string,
  id: string,
  operation: 'start',
): Promise<void> => {
  return http.post(`/nodes/${node}/connectors/${id}/${operation}`)
}

export const putConnectorsIdEnableEnable = (id: string, enable: boolean): Promise<void> => {
  return http.put(`/connectors/${id}/enable/${enable}`)
}

export const getConnectors = async (): Promise<Array<Connector>> => {
  try {
    const data = await http.get(`/connectors`)
    return Promise.resolve(
      data.map((item: Connector) => {
        item.id = getBridgeKey(item)
        return item
      }),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export const postConnectors = (data: Connector): Promise<Connector> => {
  return http.post(`/connectors`, data)
}
