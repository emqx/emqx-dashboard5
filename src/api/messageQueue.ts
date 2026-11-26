/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import http from '@/common/http'
import { ListDataWithCursor } from '@/types/common'
import type { MessageQueue, MessageQueueItem, MessageQueueUpdate } from '@/types/typeAlias'

export const getMessageQueues = (
  params?: {
    cursor?: string
    limit?: number
  },
  config?: any,
): Promise<ListDataWithCursor<MessageQueueItem>> => {
  return http.get('/queues', { params, ...config })
}

export const createMessageQueue = (data: MessageQueue): Promise<MessageQueueItem> => {
  return http.post('/queues', data)
}

export const updateMessageQueue = (
  name: string,
  data: MessageQueueUpdate,
): Promise<MessageQueueItem> => {
  return http.put(`/queue/${encodeURIComponent(name)}`, data)
}

export const deleteMessageQueue = (name: string): Promise<void> => {
  return http.delete(`/queue/${encodeURIComponent(name)}`)
}
