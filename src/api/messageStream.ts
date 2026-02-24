import http from '@/common/http'
import { CursorParams, ListDataWithCursor } from '@/types/common'
import { MessageStreamConfig, MessageStreamItem } from '@/types/typeAlias'

export const getMessageStreamsConfig = (): Promise<MessageStreamConfig> => {
  return http.get(`/message_streams/config`)
}

export const putMessageStreamsConfig = (config: MessageStreamConfig): Promise<void> => {
  return http.put(`/message_streams/config`, config)
}

export const getMessageStreamList = (
  params?: CursorParams,
  config?: any,
): Promise<ListDataWithCursor<MessageStreamItem>> => {
  return http.get(`/message_streams/streams`, { params, ...config })
}

export const postMessageStream = (data: MessageStreamItem): Promise<MessageStreamItem> => {
  return http.post(`/message_streams/streams`, data)
}

export const deleteMessageStream = (name: string): Promise<void> => {
  return http.delete(`/message_streams/streams/${encodeURIComponent(name)}`)
}

export const getMessageStreamDetail = (name: string): Promise<MessageStreamItem> => {
  return http.get(`/message_streams/streams/${encodeURIComponent(name)}`)
}

export const putMessageStream = (
  name: string,
  data: Omit<MessageStreamItem, 'name' | 'topic_filter'>,
): Promise<MessageStreamItem> => {
  return http.put(`/message_streams/streams/${encodeURIComponent(name)}`, data)
}
