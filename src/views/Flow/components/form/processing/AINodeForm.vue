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
    <CustomFormItem prop="system_prompt" :readonly="readonly">
      <template #label>
        <FormItemLabel :label="t('Flow.systemPrompt')" :desc="t('Flow.systemPromptDesc')" />
      </template>
      <InputWithTextEditDialog v-model="record.system_prompt" :title="t('Flow.systemPrompt')" />
    </CustomFormItem>
    <CustomFormItem prop="model" :label="t('Flow.model')" :readonly="readonly">
      <InputWithOptions v-model="record.model" :options="modelOpts" :filterable="false" />
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
      <CustomInputPassword v-model="record.api_key" @blur="getModelOpts" />
    </CustomFormItem>
    <CustomFormItem prop="base_url" :label="t('Flow.baseURL')" :readonly="readonly">
      <el-input
        v-model="baseUrlProxy"
        :class="{ 'with-tooltip': isGemini, 'always-show-tooltip': isGemini && baseUrlProxy }"
      >
        <template #suffix>
          <InfoTooltip>
            <template #content>
              <p>{{ t('RuleEngine.geminiBaseUrlTips') }}</p>
            </template>
          </InfoTooltip>
        </template>
      </el-input>
    </CustomFormItem>
    <CustomFormItem prop="alias" :readonly="readonly">
      <template #label>
        <FormItemLabel
          :label="t('Flow.aiOutputAlias')"
          :desc="`${t('Flow.aiOutputAliasDesc')}<br />${t('Flow.aliasDesc')}`"
          desc-marked
        />
      </template>
      <el-input v-model="record.alias" />
    </CustomFormItem>
    <AdvancedSettingContainer v-if="record.transport_options">
      <CustomFormItem prop="transport_options.connect_timeout" :readonly="readonly">
        <template #label>
          <FormItemLabel :label="t('Auth.connectTimeout')" desc-marked />
        </template>
        <TimeInputWithUnitSelect v-model="record.transport_options.connect_timeout" />
      </CustomFormItem>
      <CustomFormItem prop="transport_options.recv_timeout" :readonly="readonly">
        <template #label>
          <FormItemLabel :label="t('Flow.recvTimeout')" desc-marked />
        </template>
        <TimeInputWithUnitSelect v-model="record.transport_options.recv_timeout" />
      </CustomFormItem>
      <CustomFormItem prop="transport_options.checkout_timeout" :readonly="readonly">
        <template #label>
          <FormItemLabel
            :label="t('Flow.checkoutTimeout')"
            :desc="t('Flow.checkoutTimeoutDesc')"
            desc-marked
          />
        </template>
        <TimeInputWithUnitSelect v-model="record.transport_options.checkout_timeout" />
      </CustomFormItem>
      <CustomFormItem prop="transport_options.max_connections" :readonly="readonly">
        <template #label>
          <FormItemLabel
            :label="t('Gateway.maxConn')"
            :desc="t('Flow.maxConnectionsDesc')"
            desc-marked
          />
        </template>
        <CustomInputNumber v-model="record.transport_options.max_connections" />
      </CustomFormItem>
    </AdvancedSettingContainer>
  </el-form>
</template>

<script setup lang="ts">
import { correctAliasReg, GEMINI_DEFAULT_BASE_URL } from '@/common/constants'
import { ProcessingType } from '@/hooks/Flow/useFlowNode'
import type { AIAnthropicConfig, AIConfig } from '@/types/rule'
import { AnthropicVersion } from '@/types/typeAlias'
import type { Node } from '@vue-flow/core'

const props = defineProps<{
  modelValue: AIConfig
  nodeSpecificType: ProcessingType
  readonly: boolean
  nodes?: Array<Node>
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
  system_prompt: [{ ...createRequiredRule(t('Flow.systemPrompt'))[0], trigger: 'change' }],
  api_key: [...createRequiredRule(tl('apiKey')), ...ruleWhenEditing],
  alias: [
    ...createRequiredRule(t('Flow.aiOutputAlias')),
    {
      pattern: correctAliasReg,
      message: t('Flow.aliasFormatError'),
      trigger: 'blur',
    },
  ],
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

const { getModels } = useAIModels()
const modelOpts = ref<Array<string>>([])
const getModelOpts = async () => {
  console.log('🍅🍅🍅 ~ getModelOpts ~ getModelOpts:')

  modelOpts.value = await getModels(props.modelValue, props.nodeSpecificType)
}
getModelOpts()

const anthropicVersionOpts = Object.values(AnthropicVersion)

const isAnthropicProfile = (profile: AIConfig): profile is AIAnthropicConfig => {
  return profile.type === 'anthropic'
}

const isGemini = computed(() => props.nodeSpecificType === ProcessingType.AIGemini)
const baseUrlProxy = computed({
  get() {
    const { base_url } = record.value
    if (isGemini.value && base_url === GEMINI_DEFAULT_BASE_URL) {
      return ''
    }
    return base_url
  },
  set(val: string) {
    if (isGemini.value) {
      if (!val) {
        record.value.base_url = GEMINI_DEFAULT_BASE_URL
      } else {
        record.value.base_url = val
      }
    } else {
      record.value.base_url = val
    }
  },
})

defineExpose({ validate: () => FormCom.value.validate() })
</script>

<style lang="scss">
.provider-form {
  max-width: 480px;

  .with-tooltip {
    .icon-question {
      display: none;
    }
    &.always-show-tooltip,
    .is-focus {
      .icon-question {
        display: block;
      }
    }
  }
}
</style>
