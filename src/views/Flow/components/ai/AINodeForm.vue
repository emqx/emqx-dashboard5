<template>
  <el-form
    ref="FormCom"
    label-width="120px"
    class="provider-form"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @submit.prevent
  >
    <!-- TODO: auto input -->
    <!-- TODO: auto input -->
    <!-- TODO: auto input -->
    <!-- TODO: auto input -->
    <!-- TODO: auto input -->
    <CustomFormItem prop="input" :label="t('RuleEngine.input')" :readonly="readonly">
      <el-input v-model="record.input" />
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
      <el-input v-model="record.api_key" type="password" autocomplete="one-time-code" />
    </CustomFormItem>
    <CustomFormItem prop="base_url" :label="t('Flow.baseURL')" :readonly="readonly">
      <el-input v-model="record.base_url" />
    </CustomFormItem>
    <CustomFormItem prop="alias" :label="t('Flow.aiOutputAlias')" :readonly="readonly">
      <el-input v-model="record.alias" />
    </CustomFormItem>
  </el-form>
</template>

<script setup lang="ts">
import { AIAnthropicConfig, AIConfig } from '@/types/rule'
import { AIProviderType, AnthropicVersion } from '@/types/typeAlias'

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
const rules = computed(() => ({
  api_key: createRequiredRule(tl('apiKey')),
}))

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
