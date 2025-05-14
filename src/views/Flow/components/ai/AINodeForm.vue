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
    <CustomFormItem prop="api_key" :label="tl('apiKey')" :readonly="readonly">
      <el-input
        v-model="record.api_key"
        :type="(readonly as boolean) ? 'text' : 'password'"
        :readonly="readonly"
      />
    </CustomFormItem>
    <CustomFormItem prop="model" :label="tl('model')" :readonly="readonly">
      <el-input v-model="record.model" />
    </CustomFormItem>
    <template v-if="isAnthropicProfile(record)">
      <CustomFormItem
        prop="anthropic_version"
        :label="t('RuleEngine.anthropicVersions')"
        :readonly="readonly"
      >
        <el-select v-model="record.anthropic_version">
          <el-option v-for="item in anthropicVersionOpts" :key="item" :label="item" :value="item" />
        </el-select>
      </CustomFormItem>
      <CustomFormItem prop="max_tokens" :label="t('RuleEngine.maxTokens')" :readonly="readonly">
        <CustomInputNumber v-model="record.max_tokens" />
      </CustomFormItem>
    </template>
    <CustomFormItem prop="system_prompt" :label="'System Prompt'" :readonly="readonly">
      <el-input v-model="record.system_prompt" />
    </CustomFormItem>
  </el-form>
</template>

<script setup lang="ts">
import { AIAnthropicConfig, AIConfig } from '@/types/rule'
import { AnthropicVersion } from '@/types/typeAlias'

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

const anthropicVersionOpts = Object.values(AnthropicVersion)

const isAnthropicProfile = (profile: AIConfig): profile is AIAnthropicConfig => {
  return profile.type === 'anthropic'
}

defineExpose({ validate: () => FormCom.value.validate() })
</script>

<style lang="scss">
.provider-form {
  max-width: 480px;
}
</style>
