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
  </el-form>
</template>

<script setup lang="ts">
import { AIProviderForm } from '@/types/typeAlias'

const props = defineProps<{
  modelValue: AIProviderForm
  readonly: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: AIProviderForm): void
}>()

const { tl } = useI18nTl('Base')
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

defineExpose({ validate: () => FormCom.value.validate() })
</script>

<style lang="scss">
.provider-form {
  max-width: 480px;
}
</style>
