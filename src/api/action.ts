import http from '@/common/http'
import { Action, BridgeMetricsData, NsParams, NsWithGlobalParams } from '@/types/rule'

export const reconnectAction = (id: string, params?: NsParams): Promise<void> => {
  return http.post(`/actions/${encodeURIComponent(id)}/start`, { params })
}

export const putActionEnable = (id: string, enable: boolean, params?: NsParams): Promise<void> => {
  return http.put(`/actions/${encodeURIComponent(id)}/enable/${enable}`, undefined, { params })
}

export const getActions = async (params: NsWithGlobalParams): Promise<Array<Action>> => {
  try {
    const data: Omit<Action, 'id'>[] = await http.get(`/actions`, { params })
    return Promise.resolve(
      data.map(
        (item: Omit<Action, 'id'>) => ({ id: getBridgeKey(item as any), ...item }) as Action,
      ),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getSimplifiedActions = async (params: NsWithGlobalParams): Promise<Array<Action>> => {
  try {
    const data: Omit<Action, 'id'>[] = await http.get(`/actions_summary`, { params })
    return Promise.resolve(
      data.map(
        (item: Omit<Action, 'id'>) => ({ id: getBridgeKey(item as any), ...item }) as Action,
      ),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export const postAction = async (data: Action, params?: NsParams): Promise<Action> => {
  try {
    const ret: Action = await http.post(`/actions`, data, { params })
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const testActionConnectivity = (data: Action, params?: NsParams): Promise<void> => {
  return http.post(`/actions_probe`, data, { params })
}

export const getActionTypes = (): Promise<Array<string>> => {
  return http.get(`/action_types`)
}

export const deleteAction = (id: string, withDependency = false, ns?: string): Promise<void> => {
  const params = { ns, also_delete_dep_actions: withDependency }
  return http.delete(`/actions/${encodeURIComponent(id)}`, { params, errorsHandleCustom: [400] })
}

export const getActionDetail = async (id: string, params?: NsParams): Promise<Action> => {
  if (!id) return Promise.reject()
  try {
    const data: any = await http.get(`/actions/${encodeURIComponent(id)}`, {
      params,
    })
    return Promise.resolve({ ...data, id: getBridgeKey(data) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const putAction = async (id: string, data: Action, params?: NsParams): Promise<Action> => {
  if (!id) return Promise.reject()
  try {
    const ret: any = await http.put(`/actions/${encodeURIComponent(id)}`, data, { params })
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const reconnectActionForNode = (
  node: string,
  id: string,
  params?: NsParams,
): Promise<void> => {
  return http.post(`/nodes/${node}/actions/${encodeURIComponent(id)}/start`, { params })
}

export const getActionMetrics = (id: string, params?: NsParams): Promise<BridgeMetricsData> => {
  return http.get(`/actions/${id}/metrics`, { params })
}

export const resetActionMetrics = (id: string, params?: NsParams): Promise<void> => {
  return http.put(`/actions/${id}/metrics/reset`, undefined, { params })
}
