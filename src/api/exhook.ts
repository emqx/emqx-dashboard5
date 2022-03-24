import http from '@/common/http'
import { Exhook, ExhookFormForCreate, RegisteredHook } from '@/types/systemModule'
import { AxiosResponse } from 'axios'

export const queryExhooks = (): Promise<Array<Exhook>> => {
  return http.get('/exhooks')
}

export const createExhook = (data: ExhookFormForCreate): Promise<Exhook> => {
  return http.post('/exhooks', data)
}

type ExhookDetailFromAPI = Omit<Exhook, 'request_timeout' | 'auto_reconnect'> & {
  request_timeout: number
  auto_reconnect: false | number
}
export const queryExhookDetail = async (name: string): Promise<ExhookDetailFromAPI> => {
  // the request_timeout data returned is of numeric type and the unit is ms, which needs to be processed.
  try {
    const data = await http.get(`/exhooks/${name}`)
    return Promise.resolve(data)
  } catch (error) {
    return Promise.reject(error)
  }
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
