<template>
  <el-row :gutter="16" class="avro-record-fields">
    <template v-for="field in fields" :key="field.name">
      <el-col :span="isRecordField(field) ? 24 : 12">
        <el-form-item :label="fieldLabel(field.name)" class="avro-field-item">
          <el-switch v-if="field.type === 'boolean'" v-model="bindValue[field.name]" />
          <custom-input-number
            v-else-if="isNumberType(field.type)"
            v-model="bindValue[field.name]"
          />
          <array-editor-input v-else-if="isArrayType(field.type)" v-model="bindValue[field.name]" />
          <template v-else-if="isRecordField(field)">
            <div class="nested-record">
              <avro-record-fields v-model="bindValue[field.name]" :fields="field.type.fields" />
            </div>
          </template>
          <el-input v-else v-model="bindValue[field.name]" />
        </el-form-item>
      </el-col>
    </template>
  </el-row>
</template>

<script lang="ts">
export default {
  name: 'AvroRecordFields',
}
</script>

<script lang="ts" setup>
import AvroRecordFields from './AvroRecordFields.vue'

interface AvroField {
  name: string
  type: any
  default?: any
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  fields: {
    type: Array as PropType<AvroField[]>,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

function getDefaultForType(type: any): any {
  if (typeof type === 'string') {
    switch (type) {
      case 'string':
        return ''
      case 'int':
      case 'long':
      case 'float':
      case 'double':
        return 0
      case 'boolean':
        return false
      default:
        return null
    }
  }
  if (typeof type === 'object' && !Array.isArray(type)) {
    if (type.type === 'array') return []
    if (type.type === 'map') return {}
    if (type.type === 'record') {
      return Object.fromEntries(
        (type.fields ?? []).map((f: AvroField) => [
          f.name,
          f.default !== undefined ? cloneDeep(f.default) : getDefaultForType(f.type),
        ]),
      )
    }
  }
  return null
}

function initValue(modelValue: Record<string, any>, fields: AvroField[]): Record<string, any> {
  const val = cloneDeep(modelValue ?? {})
  fields.forEach((field) => {
    if (val[field.name] === undefined) {
      val[field.name] =
        field.default !== undefined ? cloneDeep(field.default) : getDefaultForType(field.type)
    }
  })
  return val
}

const bindValue = ref<Record<string, any>>(initValue(props.modelValue, props.fields))

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, bindValue.value)) {
      bindValue.value = initValue(val, props.fields)
    }
  },
  { deep: true },
)

watch(bindValue, (val) => emit('update:modelValue', val), { deep: true })

const isNumberType = (type: any) =>
  type === 'int' || type === 'long' || type === 'float' || type === 'double'

const isArrayType = (type: any) =>
  typeof type === 'object' && !Array.isArray(type) && type?.type === 'array'

const isRecordField = (field: AvroField) =>
  typeof field.type === 'object' && !Array.isArray(field.type) && field.type?.type === 'record'

const fieldLabel = (name: string) =>
  name
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
</script>

<style lang="scss" scoped>
.avro-record-fields {
  width: 100%;
}

.avro-field-item {
  :deep(.el-form-item__label) {
    font-size: 12px;
  }
}

.nested-record {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--border-radius-small);
  background-color: var(--color-bg-content);
}
</style>
