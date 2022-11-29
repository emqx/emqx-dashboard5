import http from '@/common/http'
import {
  SlowSubConfig,
  SlowSubStatistic,
  TopicMetricItem,
  TraceRecord,
  TraceItem,
} from '@/types/diagnose'
import { downloadBlobData } from '@/common/tools'
import { REQUEST_TIMEOUT_CODE } from '@/common/constants'
import { ElMessage } from 'element-plus'
import { getLocalMessage } from '@/i18n'

export const querySlowSubConfig = (): Promise<SlowSubConfig> => {
  return http.get('/slow_subscriptions/settings')
}

export const updateSlowSubConfig = (data: SlowSubConfig): Promise<SlowSubConfig> => {
  return http.put('/slow_subscriptions/settings', data)
}

export const clearSlowSubData = (): Promise<void> => {
  return http.delete('/slow_subscriptions')
}

export const querySlowSubStatistics = async (): Promise<Array<SlowSubStatistic>> => {
  try {
    const { data = [] } = await http.get('/slow_subscriptions', {
      params: { limit: 1000, page: 1 },
    })
    return Promise.resolve(data)
  } catch (error) {
    return Promise.reject(error)
  }
}

export function getTraceList(): Promise<Array<TraceItem>> {
  return http.get('/trace')
}

export function addTrace(body: TraceRecord): Promise<TraceRecord> {
  return http.post('/trace', body)
}

export function getTraceDetail(
  name: string,
): Promise<Array<{ node: string; size: number; mtime: number }>> {
  return http.get(`/trace/${name}/log_detail`)
}

export function getTraceLog(
  name: string,
  params: { bytes: number; position: number },
): Promise<{ items: string; meta: { bytes: number; position: number } }> {
  if (!name) return Promise.reject()
  return http.get(`/trace/${encodeURIComponent(name)}/log`, { params })
}

export async function downloadTrace(name: string, node?: string): Promise<void> {
  try {
    const res = await http.get(`/trace/${encodeURIComponent(name)}/download`, {
      params: { node },
      responseType: 'blob',
      timeout: 45000,
      handleTimeoutSelf: true,
    })
    downloadBlobData(res)
    return Promise.resolve()
  } catch (error: any) {
    if (error.code === REQUEST_TIMEOUT_CODE) {
      ElMessage.error(getLocalMessage('LogTrace.logTraceDownloadTimeout'))
    }
    return Promise.reject(error)
  }
}
export function stopTrace(name: string): Promise<{ enable: boolean; name: string }> {
  return http.put(`/trace/${encodeURIComponent(name)}/stop`)
}

export function deleteTrace(name: string): Promise<void> {
  return http.delete(`/trace/${encodeURIComponent(name)}`)
}

export function getTopicMetrics(topic: null | string = null): Promise<Array<TopicMetricItem>> {
  if (null === topic) {
    return http.get('/mqtt/topic_metrics')
  }
  return http.get('/mqtt/topic_metrics/' + encodeURIComponent(topic))
}

export function addTopicMetrics(topic: string): Promise<TopicMetricItem> {
  const data = { topic: topic }
  return http.post('/mqtt/topic_metrics', data)
}

export function deleteTopicMetrics(topic: string): Promise<any> | undefined {
  if (topic == null) return
  return http.delete('/mqtt/topic_metrics/' + encodeURIComponent(topic))
}

export function resetTopicMetrics(topic: string): any {
  if (topic == null) return
  return http.put(`/mqtt/topic_metrics`, { action: 'reset', topic })
}
