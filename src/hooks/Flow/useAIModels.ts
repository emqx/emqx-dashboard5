import { getAIModels } from '@/api/ai'
import { AIConfig } from '@/types/rule'
import { ProcessingType } from './useFlowNode'
import aiModels from '@/common/aiModels.json'
import axios from 'axios'

const useAIModels = () => {
  const getHeaders = (token: string) => ({ Authorization: `Bearer ${token}` })
  const modelsUrlMap = new Map<ProcessingType, string>([
    [ProcessingType.AIOpenAI, 'https://api.openai.com/v1/models'],
    [ProcessingType.AIAnthropic, 'https://api.anthropic.com/v1/models'],
    [ProcessingType.AIGemini, 'https://generativelanguage.googleapis.com/v1beta/openai/models'],
  ])
  const http = axios.create()
  const requestModels = async (
    data: AIConfig,
    provider: ProcessingType,
  ): Promise<Array<string>> => {
    try {
      const { api_key, base_url } = data
      if (base_url && provider !== ProcessingType.AIGemini) {
        return Promise.reject()
      }
      const url = modelsUrlMap.get(provider)
      if (!url) {
        return Promise.reject(new Error('Invalid provider'))
      }
      const { data: list } = await http.get(url, { headers: getHeaders(api_key) })
      return list as Array<string>
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const modelOptsMap = new Map([
    [ProcessingType.AIOpenAI, aiModels.openai],
    [ProcessingType.AIAnthropic, aiModels.anthropic],
    [ProcessingType.AIGemini, aiModels.gemini],
  ])
  const getModels = async (data: AIConfig, type: ProcessingType): Promise<Array<string>> => {
    try {
      let ret: Array<string> = []
      debugger
      if (/^\*{1,6}$/.test(data.api_key) && data.name) {
        ret = await getAIModels(data.name)
      } else if (data.api_key) {
        ret = await requestModels(data, type)
      }
      return ret.length ? ret : (modelOptsMap.get(type) ?? [])
    } catch (error) {
      return modelOptsMap.get(type) ?? []
    }
  }
  return {
    getModels,
  }
}

export default useAIModels
