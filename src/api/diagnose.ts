import http from '@/common/http'
import { TraceRecord, TraceItem } from '@/types/diagnose'
import { getLocalMessage } from '@/i18n'

export function getTraceList(): Promise<Array<TraceItem>> {
  return http.get('/trace')
}

export function addTrace(body: TraceRecord): Promise<TraceRecord> {
  return http.post('/trace', body)
}

export function getTraceNodesMsg(
  name: string,
): Promise<Array<{ node: string; size: number; mtime: number }>> {
  return http.get(`/trace/${name}/log_detail`)
}

export function getTraceLog(
  name: string,
  params: { bytes: number; position: number; node: string },
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
