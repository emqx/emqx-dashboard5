import http from '@/common/http'
import { Listener } from '@/types/listener'

export const queryListener = (): Promise<Array<{ node: string; listeners: Array<Listener> }>> => {
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
