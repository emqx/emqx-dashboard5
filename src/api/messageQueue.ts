/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import { ListDataWithCursor } from '@/types/common'
import { MessageQueue } from '@/types/typeAlias'

export const getMessageQueues = (
  params?: {
    cursor?: string
    limit?: number
  },
  config?: any,
): Promise<ListDataWithCursor<MessageQueue>> => {
  return http.get('/message_queues/queues', { params, ...config })
}

export const getMessageQueue = (name: string): Promise<MessageQueue> => {
  return http.get(`/message_queues/queues/${encodeURIComponent(name)}`)
}

export const createMessageQueue = (data: MessageQueue): Promise<MessageQueue> => {
  return http.post('/message_queues/queues', data)
}

export const updateMessageQueue = (
  name: string,
  data: Omit<MessageQueue, 'name' | 'topic_filter'>,
): Promise<MessageQueue> => {
  return http.put(`/message_queues/queues/${encodeURIComponent(name)}`, data)
}

export const deleteMessageQueue = (name: string): Promise<void> => {
  return http.delete(`/message_queues/queues/${encodeURIComponent(name)}`)
}
