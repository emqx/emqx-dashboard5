import http from '@/common/http'
import { AICompletionProfile, AIProviderForm } from '@/types/typeAlias'

export const getAICompletionProfiles = (): Promise<Array<AICompletionProfile>> => {
  return http.get(`/ai/completion_profiles`)
}

export const postAICompletionProfile = (
  data: AICompletionProfile,
): Promise<AICompletionProfile> => {
  return http.post(`/ai/completion_profiles`, data)
}

export const getAICompletionProfileDetail = (name: string): Promise<AICompletionProfile> => {
  return http.get(`/ai/completion_profiles/${encodeURIComponent(name)}`)
}

export const putAICompletionProfile = (
  name: string,
  data: Omit<AICompletionProfile, 'name'>,
): Promise<AICompletionProfile> => {
  return http.put(`/ai/completion_profiles/${encodeURIComponent(name)}`, data)
}

export const deleteAICompletionProfile = (name: string): Promise<void> => {
  return http.delete(`/ai/completion_profiles/${encodeURIComponent(name)}`)
}

export const getAIProviders = (): Promise<Array<AIProviderForm>> => {
  return http.get(`/ai/providers`)
}

export const postAIProvider = (data: AIProviderForm): Promise<AIProviderForm> => {
  return http.post(`/ai/providers`, data)
}

export const getAIProviderDetail = (name: string): Promise<AIProviderForm> => {
  return http.get(`/ai/providers/${encodeURIComponent(name)}`)
}

export const putAIProvider = (
  name: string,
  data: Omit<AIProviderForm, 'name'>,
): Promise<AIProviderForm> => {
  return http.put(`/ai/providers/${encodeURIComponent(name)}`, data)
}

export const deleteAIProvider = (name: string): Promise<void> => {
  return http.delete(`/ai/providers/${encodeURIComponent(name)}`)
}

export const getAIModels = (providerName: string): Promise<Array<string>> => {
  return http.get(`/ai/providers/${encodeURIComponent(providerName)}/models`, {
    errorsHandleCustom: [503],
  } as any)
}
