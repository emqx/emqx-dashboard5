import http from '@/common/http'
import { ExhookPosition } from '@/types/enum'
import { Exhook, ExhookFormForCreate, RegisteredHook } from '@/types/systemModule'
import { AxiosResponse } from 'axios'

export const queryExhooks = (): Promise<Array<Exhook>> => {
  return http.get('/exhooks')
}

export const createExhook = (data: ExhookFormForCreate): Promise<Exhook> => {
  return http.post('/exhooks', data)
}

export const queryExhookDetail = async (
  name: string,
): Promise<Omit<Exhook, 'request_timeout'> & { request_timeout: number }> => {
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

export const moveExhook = (
  name: string,
  position: { position: ExhookPosition; related?: string },
): Promise<AxiosResponse> => {
  return http.post(`/exhooks/${name}/move`, position)
}
