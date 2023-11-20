<!-- 
  Different from src/components/Oneof.vue, src/components/Oneof.vue handles simple oneof
  - item of oneof is not an object
  - there are only two options for oneof
 -->
<template>
  <el-col :span="colSpan" v-bind="$attrs">
    <el-form-item :label="`TODO:`">
      <el-select v-model="typeIndex" v-if="!readonly" @change="handleTypeChanged">
        <el-option
          v-for="{ value, label } in typeOpts"
          :key="value"
          :value="value"
          :label="label"
        />
      </el-select>
      <p class="value" v-else>{{ typeIndex }}</p>
    </el-form-item>
  </el-col>
  <template v-for="(oneOfItem, $index) in items" :key="$index">
    <template v-if="oneOfItem.$ref && typeIndex === $index">
      <el-col
        v-for="(item, $key) in oneOfItem.properties"
        :span="colSpan"
        :key="$key"
        v-bind="$attrs"
      >
        <el-form-item :label="`TODO:${$key}`" :prop="getFormItemProp($key)">
          <SchemaFormItem
            v-model="fieldValue[$key]"
            :type="(item.type as any)"
            :symbols="item.symbols"
          />
        </el-form-item>
      </el-col>
    </template>
  </template>
</template>

<script setup lang="ts">
import useSchemaRecord from '@/hooks/Schema/useSchemaRecord'
import { Properties, Property } from '@/types/schemaForm'
import { get, isEqual } from 'lodash'
import { PropType, Ref, computed, defineEmits, defineProps, ref, watch } from 'vue'
import SchemaFormItem from './SchemaFormItem'

type OneOfItem = Property | Properties
type FieldValue = string | number | boolean | Record<string, any>
type Symbols = Array<string>

const props = defineProps({
  modelValue: {
    type: [String, Number, Object] as PropType<string | number | Record<string, any> | undefined>,
  },
  items: {
    type: Array as PropType<Array<OneOfItem>>,
    required: true,
    default: () => [],
  },
  path: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  colSpan: {
    type: Number,
    default: 12,
  },
  readonly: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue'])

const isFixedEnum = (item: OneOfItem) => Array.isArray(item.symbols) && item.symbols.length === 1

const typeIndex: Ref<undefined | number> = ref(undefined)

const nameReg = /^.*\.([^.]+)$/
const getTypeLabel = (item: OneOfItem) => {
  if (isFixedEnum(item)) {
    return (item.symbols as Symbols)[0]
  }
  if (typeof item.$ref === 'string') {
    const name = item.$ref.match(nameReg)?.[1]
    return name || item.$ref
  }
  return item?.toString?.()
}
const typeOpts = computed(() => {
  return props.items.map((item, $index) => ({
    value: $index,
    label: getTypeLabel(item),
  }))
})
const { initRecordByComponents } = useSchemaRecord()
const handleTypeChanged = (value: number) => {
  const newProps = props.items[value]
  if (newProps.$ref) {
    const newRecord = initRecordByComponents(newProps.properties as Properties)
    fieldValue.value = get(newRecord, props.path)
  } else if (isFixedEnum(newProps)) {
    fieldValue.value = (newProps.symbols as Symbols)[0]
  }
}
const getFormItemProp = (key: string) => `${props.path}${props.path ? '.' : ''}${key}`

const fieldValue: Ref<string | number | boolean | Record<string, any>> = ref('')

const judgeTypeIndexByValue = (value: FieldValue, items: Array<OneOfItem>): number => {
  if (!value) {
    return 0
  }
  const ret = items.findIndex((item) => {
    if (typeof value === 'string') {
      return item.$ref ? false : isFixedEnum(item) && (item.symbols as Symbols)[0] === value
    }
    if (!item.$ref || !item.properties) {
      return false
    }
    const propKeys = Object.keys(item.properties)
    return Object.keys(value).every((key) => propKeys.includes(key))
  })
  return ret < -1 ? 0 : ret
}
const init = () => {
  if (props.modelValue) {
    fieldValue.value = props.modelValue
    typeIndex.value = judgeTypeIndexByValue(props.modelValue, props.items)
  }
}

watch(
  () => props.modelValue,
  (nV, oV) => {
    if (!isEqual(nV, oV)) {
      init()
    }
  },
)

watch(
  () => fieldValue.value,
  (v) => {
    emit('update:modelValue', v)
  },
)

init()
</script>

<style lang="scss"></style>
