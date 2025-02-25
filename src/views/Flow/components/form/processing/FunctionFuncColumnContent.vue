<template>
  <CustomFormItem class="form-item-func" :readonly="readonly" prop="func.name">
    <el-cascader
      v-model="record.func.name"
      filterable
      class="select-func"
      :show-all-levels="false"
      :options="funcOptList as any"
      :props="cascaderProps"
      :placeholder="tl('transform')"
      @change="handleSelectFunc"
    />
  </CustomFormItem>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import { FunctionItem } from '@/hooks/Flow/useFlowNode'

const props = defineProps<{
  modelValue: FunctionItem
  readonly: boolean
  availableFields: Array<string>
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: FunctionItem): void }>()

const { tl } = useI18nTl('Flow')

const { record, funcOptList, handleSelectFunc } = useFunctionItemData(props, emit)
const cascaderProps = { value: 'name', label: 'name', children: 'list', emitPath: false }
</script>

<style lang="scss">
.form-item-func {
  .el-cascader {
    width: 100%;
  }
}
</style>
