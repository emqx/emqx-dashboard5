import http from '@/common/http'
import { ListDataWithPagination } from '@/types/common'
import { APIKey, APIKeyFormWhenCreating, APIKeyFormWhenEditing } from '@/types/systemModule'
import { AuditLogItem, GetAuditParams } from '@/types/typeAlias'
import {
  EmqxMgmtApiDataBackupFilesResponse,
  EmqxMgmtApiDataBackupBackupFileInfo,
  EmqxMgmtApiDataBackupImportRequestBody,
} from '@/types/schemas/dataBackup.schemas'

// API key
export const loadAPIKeyList = async (): Promise<Array<APIKey>> => {
  try {
    const data: Array<APIKey> = await http.get('/api_key')
    return Promise.resolve(
      data.map(({ expired_at, ...otherMsg }) => {
        return {
          expired_at: expired_at === 'infinity' ? undefined : expired_at,
          ...otherMsg,
        }
      }),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}
export const queryAPIKeyDetail = (name: string): Promise<APIKey> => {
  return http.get(`/api_key/${name}`)
}
export const createAPIKey = (data: APIKeyFormWhenCreating): Promise<APIKey> => {
  return http.post('/api_key', data)
}
export const updateAPIKey = (
  name: string,
  data: Pick<APIKeyFormWhenEditing, 'desc' | 'enable' | 'expired_at'>,
): Promise<APIKey> => {
  return http.put(`/api_key/${name}`, data)
}
export const deleteAPIKey = (name: string): Promise<void> => {
  return http.delete(`/api_key/${name}`)
}

// Audit log
export const queryAuditLogs = (
  params: GetAuditParams,
): Promise<ListDataWithPagination<AuditLogItem>> => {
  return http.get('/audit', { params })
}

// Data Backup
export const getBackups = (
  params = { page: 1, limit: 1000 },
): Promise<EmqxMgmtApiDataBackupFilesResponse> => {
  return http.get('/data/files', { params })
}
export const createBackup = (): Promise<EmqxMgmtApiDataBackupBackupFileInfo> => {
  return http.post('/data/export')
}
export const deleteBackup = (fileName: string, node?: string): Promise<void> => {
  const params = node ? { node } : undefined
  return http.delete(`/data/files/${fileName}`, { params })
}
export const restoreBackup = (payload: EmqxMgmtApiDataBackupImportRequestBody): Promise<void> => {
  return http.post(`/data/import`, payload, { timeout: 600000 })
}
export const downloadBackup = (
  fileName: string,
  node?: string,
): Promise<{
  data: Blob
}> => {
  const params = node ? { node } : undefined
  return http.get(`/data/files/${fileName}`, { responseType: 'blob', params })
}
export const uploadBackup = (fileName: string, file: File): Promise<unknown> => {
  const formData = new FormData()
  formData.append(fileName, file)
  return http.post('/data/files', formData, {
    timeout: 600000,
  })
}
