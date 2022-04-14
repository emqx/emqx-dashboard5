import http from '@/common/http'
import { Listener } from '@/types/listener'

export const addListener = (data: Listener, id: string): Promise<Listener> => {
  return http.post(`/listeners/${id}`, data)
}

export const updateListener = (data: Listener, id: string): Promise<Listener> => {
  return http.put(`/listeners/${id}`, data)
}
