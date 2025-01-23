import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import http from '@/common/http'
import { getBridgeKey } from '@/common/tools'
import { BridgeMetricsData, Source } from '@/types/rule'

export const getSources = async (): Promise<Array<Source>> => {
  try {
    const data = await http.get(`/sources`)
    return Promise.resolve(
      data.map((item: Omit<Source, 'id'>) => {
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

export const getSimplifiedSources = async (): Promise<Array<Source>> => {
  try {
    const data = await http.get(`/sources_summary`)
    return Promise.resolve(
      data.map((item: Omit<Source, 'id'>) => {
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

export const postSource = async (source: Source): Promise<Source> => {
  try {
    const ret = await http.post(`/sources`, source)
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const putSource = async (id: string, source: Source): Promise<Source> => {
  if (!id) return Promise.reject()
  try {
    const ret = await http.put(`/sources/${encodeURIComponent(id)}`, source)
    return Promise.resolve({ ...ret, id: getBridgeKey(ret) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteSource = (id: string, also_delete_dep_actions = false): Promise<void> => {
  return http.delete(`/sources/${encodeURIComponent(id)}`, {
    params: { also_delete_dep_actions },
    errorsHandleCustom: [400],
  })
}

export const getSourceDetail = async (id: string): Promise<Source> => {
  if (!id) return Promise.reject()
  try {
    const data = await http.get(`/sources/${encodeURIComponent(id)}`)
    return Promise.resolve({ ...data, id: getBridgeKey(data) })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getSourceMetrics = (id: string): Promise<BridgeMetricsData> => {
  return http.get(`/sources/${encodeURIComponent(id)}/metrics`)
}

export const resetSourceMetrics = (id: string): Promise<void> => {
  return http.put(`/sources/${encodeURIComponent(id)}/metrics/reset`)
}

export const putSourceEnable = (id: string, enable: boolean): Promise<Source> => {
  return http.put(`/sources/${encodeURIComponent(id)}/enable/${enable}`)
}

export const testSourceConnectivity = (source: Source): Promise<Source> => {
  return http.post(`/sources_probe`, source)
}

export const reconnectSourceForNode = (node: string, id: string): Promise<void> => {
  return http.post(`/nodes/${encodeURIComponent(node)}/sources/${encodeURIComponent(id)}/start`)
}

export const reconnectSource = (id: string): Promise<void> => {
  return http.post(`/sources/${encodeURIComponent(id)}/start`)
}
