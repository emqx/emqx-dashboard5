import http from '@/common/http'
import { Action, BridgeMetricsData } from '@/types/rule'

export const reconnectAction = (id: string): Promise<void> => {
  return http.post(`/actions/${encodeURIComponent(id)}/start`)
}

export const putActionEnable = (id: string, enable: boolean): Promise<void> => {
  return http.put(`/actions/${encodeURIComponent(id)}/enable/${enable}`)
}

export const getActions = async (): Promise<Array<Action>> => {
  try {
    const data = await http.get(`/actions`)
    return Promise.resolve(
      data.map((item: Omit<Action, 'id'>) => ({ id: getBridgeKey(item as any), ...item })),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getSimplifiedActions = async (): Promise<Array<Action>> => {
  try {
    const data = await http.get(`/actions_summary`)
    return Promise.resolve(
      data.map((item: Omit<Action, 'id'>) => ({ id: getBridgeKey(item as any), ...item })),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export const postAction = async (data: Action): Promise<Action> => {
  try {
    const ret = await http.post(`/actions`, data)
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const testActionConnectivity = (data: Action): Promise<void> => {
  return http.post(`/actions_probe`, data)
}

export const getActionTypes = (): Promise<Array<string>> => {
  return http.get(`/action_types`)
}

export const deleteAction = (id: string, withDependency = false): Promise<void> => {
  return http.delete(`/actions/${encodeURIComponent(id)}`, {
    params: withDependency ? { also_delete_dep_actions: withDependency } : undefined,
    errorsHandleCustom: [400],
  })
}

export const getActionDetail = async (id: string): Promise<Action> => {
  if (!id) return Promise.reject()
  try {
    const data = await http.get(`/actions/${encodeURIComponent(id)}`)
    return Promise.resolve({ ...data, id: getBridgeKey(data) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const putAction = async (id: string, data: Action): Promise<Action> => {
  if (!id) return Promise.reject()
  try {
    const ret = await http.put(`/actions/${encodeURIComponent(id)}`, data)
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const reconnectActionForNode = (node: string, id: string): Promise<void> => {
  return http.post(`/nodes/${node}/actions/${encodeURIComponent(id)}/start`)
}

export const getActionMetrics = (id: string): Promise<BridgeMetricsData> => {
  return http.get(`/actions/${id}/metrics`)
}

export const resetActionMetrics = (id: string): Promise<void> => {
  return http.put(`/actions/${id}/metrics/reset`)
}
