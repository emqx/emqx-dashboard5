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
): Promise<ListDataWithCursor<MessageStreamItem>> => {
  return http.get(`/message_streams/streams`, { params })
}

export const postMessageStream = (data: MessageStreamItem): Promise<MessageStreamItem> => {
  return http.post(`/message_streams/streams`, data)
}

export const deleteMessageStream = (topicFilter: string): Promise<void> => {
  return http.delete(`/message_streams/streams/${encodeURIComponent(topicFilter)}`)
}

export const getMessageStreamDetail = (topicFilter: string): Promise<MessageStreamItem> => {
  return http.get(`/message_streams/streams/${encodeURIComponent(topicFilter)}`)
}

export const putMessageStream = (
  topicFilter: string,
  data: Omit<MessageStreamItem, 'topic_filter'>,
): Promise<MessageStreamItem> => {
  return http.put(`/message_streams/streams/${encodeURIComponent(topicFilter)}`, data)
}
