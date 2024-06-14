import http from '@/common/http'
import { Metrics } from '@/types/common'
import { MessageTransform } from '@/types/typeAlias'

export const getMessageTransforms = (): Promise<Array<MessageTransform>> => {
  return http.get(`/message_transformations`)
}

export const putMessageTransform = (data: MessageTransform): Promise<MessageTransform> => {
  return http.put(`/message_transformations`, data)
}

export const postMessageTransform = (data: MessageTransform): Promise<MessageTransform> => {
  return http.post(`/message_transformations`, data)
}

export const deleteMessageTransform = (name: string): Promise<void> => {
  return http.delete(`/message_transformations/transformation/${name}`)
}

export const getMessageTransformDetail = (name: string): Promise<MessageTransform> => {
  return http.get(`/message_transformations/transformation/${name}`)
}

export const enableDisableMessageTransform = (name: string, enable: boolean): Promise<void> => {
  return http.post(`/message_transformations/transformation/${name}/enable/${enable}`)
}

export const reorderMessageTransforms = (messageTransformationHttpApiReorder: {
  order: string[]
}): Promise<void> => {
  return http.post(`/message_transformations/reorder`, messageTransformationHttpApiReorder)
}

export const getMessageTransformMetrics = (name: string): Promise<Metrics> => {
  return http.get(`/message_transformations/transformation/${name}/metrics`)
}

export const resetMessageTransformMetrics = (name: string): Promise<void> => {
  return http.post(`/message_transformations/transformation/${name}/metrics/reset`)
}
