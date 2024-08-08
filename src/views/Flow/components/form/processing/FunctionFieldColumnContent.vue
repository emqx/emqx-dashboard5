<template>
  <CustomFormItem :readonly="readonly" prop="field">
    <el-autocomplete
      v-model="record.field"
      :fetch-suggestions="getFieldList"
      :placeholder="t('components.field')"
      clearable
      class="common-fields"
      popper-class="is-wider"
      @change="handleFieldChanged($event)"
      @blur="handleBlur($event)"
      @select="handleFieldChanged($event.value)"
    />
  </CustomFormItem>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import { FunctionItem } from '@/hooks/Flow/useFlowNode'
import { useFunctionItemData } from '@/hooks/useRuleFunc'
import { defineEmits, defineProps, withDefaults } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    modelValue: FunctionItem
    readonly: boolean
    availableFields: Array<string>
  }>(),
  {
    modelValue: () => ({ func: {} } as FunctionItem),
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: FunctionItem): void
  (e: 'blur', value: string): void
}>()

const { t } = useI18n()

const { record, getFieldList, handleFieldChanged } = useFunctionItemData(props, emit)

const handleBlur = (value: string) => {
  emit('blur', value)
}
</script>
