import http from '@/common/http'
import { Connector } from '@/types/rule'

export const testConnectorConnectivity = (data: Connector): Promise<void> => {
  return http.post(`/connectors_probe`, data)
}

export const deleteConnector = (id: string): Promise<void> => {
  return http.delete(`/connectors/${encodeURIComponent(id)}`)
}

export const getConnectorDetail = async (id: string): Promise<Connector> => {
  try {
    const data = await http.get(`/connectors/${encodeURIComponent(id)}`)
    return Promise.resolve(Object.assign(data, { id: getBridgeKey(data) }))
  } catch (error) {
    return Promise.reject(error)
  }
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

export const postConnector = async (data: Connector): Promise<Connector> => {
  try {
    const ret = await http.post(`/connectors`, data)
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}
