import { getAIModels } from '@/api/ai'
import { AIConfig } from '@/types/rule'
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
  const modelsUrlMap = new Map<ProcessingType, string>([
    [ProcessingType.AIOpenAI, 'https://api.openai.com/v1/models'],
    [ProcessingType.AIAnthropic, 'https://api.anthropic.com/v1/models'],
    [ProcessingType.AIGemini, 'https://generativelanguage.googleapis.com/v1beta/openai/models'],
  ])
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
      const { data: res } = await http.get(url, {
        headers: getHeaders(api_key),
        params: {
          ...(provider === ProcessingType.AIAnthropic ? { limit: 1000 } : {}),
        },
      })
      return res.data.map(({ id }: ModelInfo) => {
        return id
      })
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
      if (/^\*{1,6}$/.test(data.api_key) && data.name) {
        ret = await getAIModels(data.name)
      } else if (data.api_key) {
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
