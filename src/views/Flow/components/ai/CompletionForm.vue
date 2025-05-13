<template>
  <el-form
    ref="FormCom"
    label-width="120px"
    class="completion-form"
    label-position="right"
    hide-required-asterisk
    :rules="rules"
    :model="record"
    :validate-on-rule-change="false"
    @submit.prevent
  >
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
import { AICompletionProfile, AnthropicCompletion, AnthropicVersion } from '@/types/typeAlias'

const props = defineProps<{
  modelValue: AICompletionProfile
  readonly: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: AICompletionProfile): void
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
  provider_name: createRequiredRule(tl('provider')),
}))

const anthropicVersionOpts = Object.values(AnthropicVersion)

function isAnthropicProfile(profile: AICompletionProfile): profile is AnthropicCompletion {
  return profile.type === 'anthropic'
}

defineExpose({ validate: () => FormCom.value.validate() })
</script>

<style lang="scss">
.completion-form {
  max-width: 480px;
}
</style>
