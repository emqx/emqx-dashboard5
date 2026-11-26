import http from '@/common/http'
import { CursorParams, ListDataWithCursor } from '@/types/common'
import type {
  MessageStreamConfig,
  MessageStreamCreate,
  MessageStreamItem,
  MessageStreamUpdate,
} from '@/types/typeAlias'

export const getMessageStreamsConfig = (): Promise<MessageStreamConfig> => {
  return http.get(`/streams/config`)
}

export const putMessageStreamsConfig = (config: MessageStreamConfig): Promise<void> => {
  return http.put(`/streams/config`, config)
}

export const getMessageStreamList = (
  params?: CursorParams,
  config?: any,
): Promise<ListDataWithCursor<MessageStreamItem>> => {
  return http.get(`/streams`, { params, ...config })
}

export const postMessageStream = (data: MessageStreamCreate): Promise<MessageStreamItem> => {
  return http.post(`/streams`, data)
}

export const deleteMessageStream = (name: string): Promise<void> => {
  return http.delete(`/stream/${encodeURIComponent(name)}`)
}

export const putMessageStream = (
  name: string,
  data: MessageStreamUpdate,
): Promise<MessageStreamItem> => {
  return http.put(`/stream/${encodeURIComponent(name)}`, data)
}
