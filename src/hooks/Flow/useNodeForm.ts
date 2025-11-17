import { GEMINI_DEFAULT_BASE_URL } from '@/common/constants'
import { BridgeType, FilterLogicalOperator } from '@/types/enum'
import { AIProviderType, AnthropicVersion } from '@/types/typeAlias'
import { useNodeForm } from '@emqx/shared-ui-components'
import useFlowNode, {
  EditedWay,
  FilterForm,
  FilterItem,
  ProcessingType,
  SinkType,
  SourceType,
} from './useFlowNode'

export const createFilterItem = (): FilterItem => ({
  field: '',
  operator: '',
  valueForComparison: '',
})

export const createFilterFormData = (): {
  groupOperator: FilterLogicalOperator
  id: string
  items: Array<FilterItem>
} => ({
  groupOperator: FilterLogicalOperator.And,
  id: createRandomString(),
  items: [createFilterItem()],
})

export const createFilterForm = (): FilterForm => ({
  editedWay: EditedWay.Form,
  sql: '',
  form: createFilterFormData(),
})

export const createAICommonForm = () => ({
  api_key: '',
  system_prompt: '',
  input: '',
  base_url: '',
  name: `flow_ai_${createRandomString(4)}`,
  transport_options: {
    connect_timeout: '1s',
    recv_timeout: '5s',
    checkout_timeout: '1s',
    max_connections: 50,
  },
})
export const createAIOpenAIForm = () => ({
  type: AIProviderType.openai_response,
  model: 'gpt-4o',
  ...createAICommonForm(),
})
export const createAIAnthropicForm = () => ({
  type: AIProviderType.anthropic,
  model: 'claude-3-5-sonnet-20240620',
  ...createAICommonForm(),
  anthropic_version: AnthropicVersion['2023-06-01'],
  max_tokens: 100,
})

export const createAIGeminiForm = () => ({
  type: AIProviderType.openai,
  model: 'gemini-2.0-flash',
  ...createAICommonForm(),
  base_url: GEMINI_DEFAULT_BASE_URL,
})

export default (): {
  getFormDataByType: (type: string) => Record<string, any>
  isUsingSchemaBridgeType: (type: string) => boolean
  checkFormIsEmpty: (type: string, form: Record<string, any>) => boolean
} => {
  const { createRawInfluxDBForm, createRawDataLayersForm, createRawAWSTimestreamForm } =
    useBridgeFormCreator()
  /**
   *  If you are using a schema bridge, create an empty object directly
   */
  const emptyCreator = () => ({})

  const { isBridgeType } = useFlowNode()
  const isUsingSchemaBridgeType = (type: string) => {
    return isBridgeType(type) && !BRIDGE_TYPES_NOT_USE_SCHEMA.includes(type as BridgeType)
  }
  const { getCommonFormDataByType, checkFormIsEmpty } = useNodeForm()
  const formDataCreatorMap = {
    [SourceType.Message]: () => getCommonFormDataByType(SourceType.Message),
    [SourceType.Event]: () => getCommonFormDataByType(SourceType.Event),
    [ProcessingType.Filter]: () => getCommonFormDataByType(ProcessingType.Filter),
    [ProcessingType.Function]: () => getCommonFormDataByType(ProcessingType.Function),
    [ProcessingType.AIOpenAI]: createAIOpenAIForm,
    [ProcessingType.AIAnthropic]: createAIAnthropicForm,
    [ProcessingType.AIGemini]: createAIGeminiForm,
    [SinkType.RePub]: () => getCommonFormDataByType(SinkType.RePub),
    [SinkType.Console]: () => getCommonFormDataByType(SinkType.Console),
    [SinkType.InfluxDB]: createRawInfluxDBForm,
    [SinkType.Datalayers]: createRawDataLayersForm,
    [SinkType.AWSTimestream]: createRawAWSTimestreamForm,
    [SinkType.Pulsar]: emptyCreator,
  }
  const getFormDataByType = (type: string) => {
    const creator = formDataCreatorMap[type]
    if (!creator && isUsingSchemaBridgeType(type)) {
      return emptyCreator()
    }
    if (creator) {
      return creator()
    }
    console.error('EMPTY FORM CREATOR')
    return emptyCreator()
  }

  return {
    getFormDataByType,
    isUsingSchemaBridgeType,
    checkFormIsEmpty,
  }
}
