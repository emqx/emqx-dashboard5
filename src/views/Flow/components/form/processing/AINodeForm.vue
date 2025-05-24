<template>
  <el-form
    ref="FormCom"
    label-width="164px"
    class="provider-form"
    label-position="right"
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @submit.prevent
  >
    <CustomFormItem prop="input" :label="t('RuleEngine.input')" :readonly="readonly">
      <el-autocomplete
        v-model="record.input"
        :fetch-suggestions="getFieldList"
        clearable
        popper-class="is-wider"
      />
    </CustomFormItem>
    <CustomFormItem prop="system_prompt" :label="t('Flow.systemPrompt')" :readonly="readonly">
      <el-input v-model="record.system_prompt" type="textarea" :rows="5" />
    </CustomFormItem>
    <CustomFormItem prop="model" :label="t('Flow.model')" :readonly="readonly">
      <el-select
        v-model="record.model"
        allow-create
        filterable
        default-first-option
        @blur="handleModelBlur"
      >
        <el-option v-for="item in modelOpts" :key="item" :label="item" :value="item" />
      </el-select>
    </CustomFormItem>
    <template v-if="isAnthropicProfile(record)">
      <CustomFormItem prop="max_tokens" :label="t('Flow.maxTokens')" :readonly="readonly">
        <CustomInputNumber v-model="record.max_tokens" />
      </CustomFormItem>
      <CustomFormItem
        prop="anthropic_version"
        :label="t('Flow.anthropicVersion')"
        :readonly="readonly"
      >
        <el-select v-model="record.anthropic_version">
          <el-option v-for="item in anthropicVersionOpts" :key="item" :label="item" :value="item" />
        </el-select>
      </CustomFormItem>
    </template>
    <CustomFormItem prop="api_key" :label="tl('apiKey')" :readonly="readonly">
      <CustomInputPassword v-model="record.api_key" />
    </CustomFormItem>
    <CustomFormItem prop="base_url" :label="t('Flow.baseURL')" :readonly="readonly">
      <el-input v-model="record.base_url" />
    </CustomFormItem>
    <CustomFormItem prop="alias" :readonly="readonly">
      <template #label>
        <FormItemLabel :label="t('Flow.aiOutputAlias')" :desc="t('Flow.aiOutputAliasDesc')" />
      </template>
      <el-input v-model="record.alias" />
    </CustomFormItem>
  </el-form>
</template>

<script setup lang="ts">
import type { AIAnthropicConfig, AIConfig } from '@/types/rule'
import { AIProviderType, AnthropicVersion } from '@/types/typeAlias'
import type { Node } from '@vue-flow/core'

const modelOptsMap = new Map([
  [
    AIProviderType.openai,
    [
      'gpt-4.5-preview',
      'gpt-4.1',
      'gpt-4.1-mini',
      'gpt-4.1-nano',
      'chatgpt-4o-latest',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4',
      'o4-mini',
      'gpt-3.5-turbo',
      'o3',
      'o3-mini',
      'o1-pro',
      'o1',
    ],
  ],
  [
    AIProviderType.anthropic,
    [
      'claude-3-7-sonnet-latest',
      'claude-3-5-haiku-latest',
      'claude-3-5-sonnet-latest',
      'claude-3-5-sonnet-20240620',
      'claude-3-opus-latest',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ],
  ],
])

const props = defineProps<{
  modelValue: AIConfig
  readonly: boolean
  nodes: Array<Node>
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: AIConfig): void
}>()

const { t, tl } = useI18nTl('Base')
const FormCom = ref()

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule } = useFormRules()
const { ruleWhenEditing } = useSpecialRuleForPassword({ edit: true })
const rules = computed(() => ({
  input: createRequiredRule(t('RuleEngine.input')),
  system_prompt: createRequiredRule(t('Flow.systemPrompt')),
  api_key: [...createRequiredRule(tl('apiKey')), ...ruleWhenEditing],
  alias: createRequiredRule(t('Flow.aiOutputAlias')),
}))

const { getAvailableFields } = useFlowAvailableFields()
const availableFields: ComputedRef<Array<{ value: string }>> = computed(() => {
  return getAvailableFields(props.nodes || []).map((value) => ({ value }))
})
const getFieldList = (queryString: string, cb: any) => {
  if (!queryString) {
    cb(availableFields.value)
  }
  const ret = availableFields.value.filter(({ value }) => value.includes(queryString))
  cb(ret)
}

const modelOpts = computed(() => modelOptsMap.get(props.modelValue.type) ?? [])

const anthropicVersionOpts = Object.values(AnthropicVersion)

const isAnthropicProfile = (profile: AIConfig): profile is AIAnthropicConfig => {
  return profile.type === 'anthropic'
}

const handleModelBlur = (e: FocusEvent) => {
  const inputValue = (e.target as HTMLInputElement).value
  if (inputValue) {
    record.value.model = inputValue
  }
}

defineExpose({ validate: () => FormCom.value.validate() })
</script>

<style lang="scss">
.provider-form {
  max-width: 480px;
}
</style>
