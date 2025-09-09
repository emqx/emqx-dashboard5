/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import { ListDataWithCursor } from '@/types/common'
import { MessageQueue } from '@/types/typeAlias'

export const getMessageQueues = (params?: {
  cursor?: string
  limit?: number
}): Promise<ListDataWithCursor<MessageQueue>> => {
  return http.get('/message_queues/queues', { params })
}

export const getMessageQueue = (topicFilter: string): Promise<MessageQueue> => {
  return http.get(`/message_queues/queues/${encodeURIComponent(topicFilter)}`)
}

export const createMessageQueue = (data: MessageQueue): Promise<MessageQueue> => {
  return http.post('/message_queues/queues', data)
}

export const updateMessageQueue = (
  topicFilter: string,
  data: Omit<MessageQueue, 'topic_filter'>,
): Promise<MessageQueue> => {
  return http.put(`/message_queues/queues/${encodeURIComponent(topicFilter)}`, data)
}

export const deleteMessageQueue = (topicFilter: string): Promise<void> => {
  return http.delete(`/message_queues/queues/${encodeURIComponent(topicFilter)}`)
}
