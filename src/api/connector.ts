import http from '@/common/http'
import { getBridgeKey } from '@/common/tools'
import { Connector } from '@/types/rule'

export const testConnectorConnectivity = (data: Connector): Promise<void> => {
  return http.post(`/connectors_probe`, data)
}

export const deleteConnector = (id: string): Promise<void> => {
  return http.delete(`/connectors/${encodeURIComponent(id)}`)
}

export const getConnectorDetail = (id: string): Promise<Connector> => {
  return http.get(`/connectors/${encodeURIComponent(id)}`)
}

export const putConnector = (id: string, data: Connector): Promise<Connector> => {
  return http.put(`/connectors/${encodeURIComponent(id)}`, data)
}

export const reconnectConnector = (id: string): Promise<void> => {
  return http.post(`/connectors/${encodeURIComponent(id)}/start`)
}

export const reconnectConnectorForNode = (
  node: string,
  id: string,
  operation: 'start',
): Promise<void> => {
  return http.post(`/nodes/${node}/connectors/${encodeURIComponent(id)}/${operation}`)
}

export const putConnectorEnable = (id: string, enable: boolean): Promise<void> => {
  return http.put(`/connectors/${encodeURIComponent(id)}/enable/${enable}`)
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

export const postConnector = (data: Connector): Promise<Connector> => {
  return http.post(`/connectors`, data)
}
