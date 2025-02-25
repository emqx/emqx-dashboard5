<template>
  <CustomFormItem
    class="vertical-align-center form-item-param"
    v-for="(item, $index) in args || []"
    :key="`${record.func.name}-${item.name}`"
    :label-width="150"
    :label="tl(item.name)"
    :required="item.required && !readonly"
    :error="getErrorMsg($index)"
  >
    <template v-if="!readonly">
      <el-select
        v-if="item.type === ArgumentType.Enum"
        clearable
        filterable
        allow-create
        v-model="record.func.args[$index]"
        @change="handleSelectFunc($event), validateItem($index)"
      >
        <el-option
          v-for="value in item.optionalValues"
          :key="value"
          :label="value"
          :value="value"
        />
      </el-select>
      <el-input
        v-else
        v-model="record.func.args[$index]"
        @change="handleArgChanged($event, $index, item.type), validateItem($index)"
      />
    </template>
    <p v-else class="value">{{ record.func.args[$index] }}</p>
  </CustomFormItem>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import { FunctionItem } from '@/hooks/Flow/useFlowNode'

import type { Rules, ValidateError } from 'async-validator'
import Schema from 'async-validator'

const props = defineProps<{
  modelValue: FunctionItem
  readonly: boolean
  availableFields: Array<string>
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: FunctionItem): void }>()

const { tl } = useI18nTl('Function')

const { record, args, handleSelectFunc, handleArgChanged } = useFunctionItemData(props, emit)

const { createRequiredRule } = useFormRules()
const rules = computed(() =>
  args.value.reduce((rules: Rules, argItem, index) => {
    if (argItem.required) {
      rules[index] = createRequiredRule(tl(argItem.name))
    }
    return rules
  }, {}),
)
const errorMsgMap = ref<Record<string, string>>({})
const getErrorMsg = (index: number) => get(errorMsgMap.value, index)
const updateErrorMsg = (error: Array<ValidateError> | null) => {
  if (error) {
    errorMsgMap.value = error.reduce((map: Record<string, string>, { field, message }) => {
      if (field) {
        map[field] = message?.toString() ?? ''
      }
      return map
    }, {})
  }
}
const validate = async () => {
  return new Promise((resolve, rejects) => {
    const validator = new Schema(rules.value)
    errorMsgMap.value = {}
    validator.validate(record.value.func.args, updateErrorMsg)
    Object.keys(errorMsgMap.value).length ? rejects() : resolve(undefined)
  })
}
const validateItem = (index: number) => {
  const validator = new Schema({ [index]: rules.value[index] })
  validator.validate(pick(record.value.func.args, index), (errors) => {
    errorMsgMap.value[index] = errors ? (errors[0].message ?? '') : ''
  })
}
defineExpose({ validate })
</script>

<style lang="scss">
.form-item-param {
  .el-form-item__label {
    text-align: right;
  }
}
</style>
