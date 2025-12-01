import http from '@/common/http'
import { BridgeMetricsData, NsParams, NsWithGlobalParams, Source } from '@/types/rule'

export const getSources = async (params?: NsWithGlobalParams): Promise<Array<Source>> => {
  try {
    const data: any[] = await http.get(`/sources`, { params })
    return Promise.resolve(
      data.map((item) => {
        const id = getBridgeKey(item as any)
        return {
          id,
          idForRuleFrom: `${RULE_INPUT_BRIDGE_TYPE_PREFIX}${id}`,
          ...item,
        }
      }),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getSimplifiedSources = async (params?: NsWithGlobalParams): Promise<Array<Source>> => {
  try {
    const data: any[] = await http.get(`/sources_summary`, { params })
    return Promise.resolve(
      data.map((item) => {
        const id = getBridgeKey(item as any)
        return {
          id,
          idForRuleFrom: `${RULE_INPUT_BRIDGE_TYPE_PREFIX}${id}`,
          ...item,
        }
      }),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

export const postSource = async (source: Source, params?: NsParams): Promise<Source> => {
  try {
    const ret: any = await http.post(`/sources`, source, { params })
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const putSource = async (id: string, source: Source, params?: NsParams): Promise<Source> => {
  if (!id) return Promise.reject()
  try {
    const ret: any = await http.put(`/sources/${encodeURIComponent(id)}`, source, { params })
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteSource = (
  id: string,
  also_delete_dep_actions = false,
  ns?: string,
): Promise<void> => {
  return http.delete(`/sources/${encodeURIComponent(id)}`, {
    params: { also_delete_dep_actions, ns },
    errorsHandleCustom: [400],
  })
}

export const getSourceDetail = async (id: string, params: NsParams): Promise<Source> => {
  if (!id) return Promise.reject()
  try {
    const data: any = await http.get(`/sources/${encodeURIComponent(id)}`, { params })
    return Promise.resolve({ ...data, id: getBridgeKey(data) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getSourceMetrics = (id: string, params: NsParams): Promise<BridgeMetricsData> => {
  return http.get(`/sources/${encodeURIComponent(id)}/metrics`, { params })
}

export const resetSourceMetrics = (id: string, params: NsParams): Promise<void> => {
  return http.put(`/sources/${encodeURIComponent(id)}/metrics/reset`, undefined, { params })
}

export const putSourceEnable = (id: string, enable: boolean, params: NsParams): Promise<Source> => {
  return http.put(`/sources/${encodeURIComponent(id)}/enable/${enable}`, undefined, { params })
}

export const testSourceConnectivity = (source: Source, params: NsParams): Promise<Source> => {
  return http.post(`/sources_probe`, source, { params })
}

export const reconnectSourceForNode = (
  node: string,
  id: string,
  params: NsParams,
): Promise<void> => {
  return http.post(`/nodes/${encodeURIComponent(node)}/sources/${encodeURIComponent(id)}/start`, {
    params,
  })
}

export const reconnectSource = (id: string, params: NsParams): Promise<void> => {
  return http.post(`/sources/${encodeURIComponent(id)}/start`, { params })
}
