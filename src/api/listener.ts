import http from '@/common/http'
import { ListenerAction } from '@/types/enum'
import { Listener, ListenerSimpleInfo } from '@/types/listener'

export const queryListener = (): Promise<Array<ListenerSimpleInfo>> => {
  return http.get('/listeners')
}

export const addListener = (data: Listener, id: string): Promise<Listener> => {
  return http.post(`/listeners/${id}`, data)
}

export const updateListener = (data: Listener, id: string): Promise<Listener> => {
  return http.put(`/listeners/${id}`, data)
}

export const deleteListener = (id: string): Promise<any> => {
  return http.delete(`/listeners/${id}`)
}

export const handleListener = (id: string, action: ListenerAction): Promise<void> => {
  return http.post(`/listeners/${id}/${action}`)
}

export const queryListenerDetail = (id: string): Promise<Listener> => {
  return http.get(`/listeners/${id}`)
}
