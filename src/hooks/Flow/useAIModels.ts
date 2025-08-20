import { getAIModels, getProviderModels } from '@/api/ai'
import { AIConfig } from '@/types/rule'
import { AIProviderType } from '@/types/typeAlias'
import { ProcessingType } from './useFlowNode'
import aiModels from '@/common/aiModels.json'
import axios from 'axios'

interface OpenAIModel {
  id: string
  object: string
  created: number
  owned_by: string
}

interface AnthropicModel {
  created_at: string
  display_name: string
  id: string
  type: string
}

interface GeminiModel {
  id: string
  object: string
  owned_by: string
}

type ModelInfo = OpenAIModel | AnthropicModel | GeminiModel

const useAIModels = () => {
  const getHeaders = (token: string) => ({ Authorization: `Bearer ${token}` })
  const geminiModelsUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/models'
  const filterOpenaiModels = (data: Array<string>) => {
    const doNotUseModels = [
      'whisper',
      'audio',
      'speech',
      'dall-e',
      'vision',
      'image',
      'video',
      'motion',
      'embedding',
      'text-embedding',
      'tts',
      'moderation',
      'computer-use',
      'codex',
    ]
    const textOnlyModels = data.filter((item) => {
      if (doNotUseModels.some((model) => new RegExp(model, 'i').test(item))) {
        return false
      }
      if (/code-/i.test(item) && !/gpt/i.test(item)) {
        return false
      }
      return true
    })
    return textOnlyModels
  }

  const filterAnthropicModels = (data: Array<string>) => {
    const confirm = (item: string, key: string) => {
      const reg = new RegExp(key, 'i')
      return reg.test(item)
    }
    const doNotUseModels = ['audio', 'vision', 'video']
    const textOnlyModels = data.filter((item) => {
      if (doNotUseModels.some((key) => confirm(item, key))) {
        return false
      }
      const embeddingReg = new RegExp('embedding', 'i')
      if (embeddingReg.test(item) || embeddingReg.test(item)) {
        return false
      }
      return true
    })
    return textOnlyModels
  }

  const filterGeminiModels = (data: Array<string>) => {
    const doNotUseModels = [
      'audio',
      'speech',
      'vision',
      'image',
      'video',
      'motion',
      'embedding',
      'tts',
    ]
    const textOnlyModels = data.filter((item) => {
      if (doNotUseModels.some((key) => new RegExp(key, 'i').test(item))) {
        return false
      }
      // 排除代码补全专用模型
      if (/code-/i.test(item) && !/gemini/i.test(item)) {
        return false
      }
      return true
    })
    return textOnlyModels
  }
  const modelsFilterMap = new Map<ProcessingType, (data: Array<any>) => Array<any>>([
    [ProcessingType.AIOpenAI, filterOpenaiModels],
    [ProcessingType.AIAnthropic, filterAnthropicModels],
    [ProcessingType.AIGemini, filterGeminiModels],
  ])
  const http = axios.create()
  const requestGeminiModels = async (data: AIConfig) => {
    try {
      const { api_key, base_url } = data

      const trueBaseUrl = base_url && /\/$/.test(base_url) ? base_url : `${base_url}/`
      let url = geminiModelsUrl
      if (trueBaseUrl) {
        url = `${trueBaseUrl}models`
      }
      const { data: res } = await http.get(url, { headers: getHeaders(api_key) })
      return res.data.map(({ id }: ModelInfo) => id)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const requestModels = async (
    data: AIConfig,
    provider: ProcessingType,
  ): Promise<Array<string>> => {
    try {
      if (provider === ProcessingType.AIGemini) {
        return requestGeminiModels(data)
      }
      const { api_key, base_url, type } = data
      const res = await getAIModels({ api_key, type, ...(base_url ? { base_url } : {}) })
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getLocalModels = (type: ProcessingType) => {
    return modelOptsMap.get(type) ?? []
  }

  const modelOptsMap = new Map([
    [ProcessingType.AIOpenAI, aiModels.openai],
    [ProcessingType.AIAnthropic, aiModels.anthropic],
    [ProcessingType.AIGemini, aiModels.gemini],
  ])
  const getModels = async (data: AIConfig, type: ProcessingType): Promise<Array<string>> => {
    try {
      let ret: Array<string> = []
      const isEncryptedPassword = /^\*{1,6}$/.test(data.api_key)
      const isEditing = isEncryptedPassword && data.name
      const isGemini = type === ProcessingType.AIGemini
      if (isEditing && !isGemini) {
        ret = await getProviderModels(data.name)
      } else if (data.api_key && !isEncryptedPassword) {
        ret = await requestModels(data, type)
      }

      if (!ret.length) {
        ret = getLocalModels(type)
      } else {
        const filter = modelsFilterMap.get(type)
        if (filter) {
          ret = filter(ret)
        }
        if (type === ProcessingType.AIGemini) {
          ret = ret.map((item) => item.replace(/^models\//, ''))
        }
      }

      return ret
    } catch (error) {
      return getLocalModels(type)
    }
  }
  return {
    getModels,
  }
}

export default useAIModels
