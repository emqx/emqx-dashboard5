import http from '@/common/http'
import { Exhook, ExhookFormForCreate, RegisteredHook } from '@/types/systemModule'
import { AxiosResponse } from 'axios'

export const queryExhooks = (): Promise<Array<Exhook>> => {
  return http.get('/exhooks')
}

export const createExhook = (data: ExhookFormForCreate): Promise<Exhook> => {
  return http.post('/exhooks', data)
}

export const queryExhookDetail = async (name: string): Promise<Exhook> => {
  return await http.get(`/exhooks/${name}`)
}

export const updateExhook = (data: ExhookFormForCreate): Promise<Exhook> => {
  return http.put(`/exhooks/${data.name}`, data)
}

export const deleteExhook = (name: string): Promise<undefined> => {
  return http.delete(`/exhooks/${name}`)
}

export const queryExhookRegisteredHooks = (name: string): Promise<Array<RegisteredHook>> => {
  return http.get(`/exhooks/${name}/hooks`)
}

export const moveExhook = (name: string, positionStr: string): Promise<AxiosResponse> => {
  return http.post(`/exhooks/${name}/move`, { position: positionStr })
}
