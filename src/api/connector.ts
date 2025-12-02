import http from '@/common/http'
import { Connector, NsParams, NsWithGlobalParams } from '@/types/rule'

export const testConnectorConnectivity = (data: Connector, params?: NsParams): Promise<void> => {
  return http.post(`/connectors_probe`, data, { params })
}

export const deleteConnector = (id: string, params?: NsParams): Promise<void> => {
  return http.delete(`/connectors/${encodeURIComponent(id)}`, { params })
}

export const getConnectorDetail = async (id: string, params?: NsParams): Promise<Connector> => {
  try {
    const data = await http.get(`/connectors/${encodeURIComponent(id)}`, { params })
    return Promise.resolve(Object.assign(data, { id: getBridgeKey(data) }))
  } catch (error) {
    return Promise.reject(error)
  }
}

export const putConnector = (
  id: string,
  data: Connector,
  params?: NsParams,
): Promise<Connector> => {
  return http.put(`/connectors/${encodeURIComponent(id)}`, data, { params })
}

export const reconnectConnector = (id: string, params?: NsParams): Promise<void> => {
  return http.post(`/connectors/${encodeURIComponent(id)}/start`, { params })
}

export const putConnectorEnable = (
  id: string,
  enable: boolean,
  params?: NsParams,
): Promise<void> => {
  return http.put(`/connectors/${encodeURIComponent(id)}/enable/${enable}`, undefined, { params })
}

export const getConnectors = async (params?: NsWithGlobalParams): Promise<Array<Connector>> => {
  try {
    const data = await http.get(`/connectors`, { params })
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

export const postConnector = async (data: Connector, params?: NsParams): Promise<Connector> => {
  try {
    const ret = await http.post(`/connectors`, data, { params })
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}
