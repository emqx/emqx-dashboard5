import http from '@/common/http'
import { APIKey, APIKeyFormWhenCreating, APIKeyFormWhenEditing } from '@/types/systemModule'

export const loadAPIKeyList = (): Promise<Array<APIKey>> => {
  return http.get('/api_key')
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
