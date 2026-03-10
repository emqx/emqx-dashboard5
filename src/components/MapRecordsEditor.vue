<template>
  <div class="map-records-editor">
    <el-collapse v-if="entries.length" v-model="activeEntries" class="map-entries">
      <el-collapse-item
        v-for="entry in entries"
        :key="entry.id"
        :name="entry.id"
        class="map-entry-item"
      >
        <template #title>
          <div class="entry-title">
            <el-input
              v-model="entry.key"
              :placeholder="$t('components.key')"
              class="entry-key-input"
              @click.stop
            />
            <el-button
              link
              type="danger"
              size="small"
              class="btn-remove"
              @click.stop="removeEntry(entry.id)"
            >
              <Trash2 :size="14" />
            </el-button>
          </div>
        </template>
        <el-row v-if="hasValueChildren" :gutter="20">
          <plugin-form-kit-item
            v-for="(configs, fieldName) in valueChildren"
            :key="fieldName"
            :name="`${name}.${entry.key.trim()}.${String(fieldName)}`"
            :form-configs="configs"
            v-model="entry.value[String(fieldName)]"
          />
        </el-row>
        <avro-record-fields
          v-else-if="!hasValueChildren && isRecordSchema(valueSchema) && entry.key.trim()"
          v-model="entry.value"
          :fields="(valueSchema as any).fields"
        />
      </el-collapse-item>
    </el-collapse>

    <el-button link type="primary" @click="addEntry">
      <Plus class="mr-2" />
      {{ $t('Base.add') }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { Plus, Trash2 } from 'lucide-vue-next'
import AvroRecordFields from './AvroRecordFields.vue'
import { AvroSchema, AvroMap } from '@/types/plugin'

interface AvroField {
  name: string
  type: any
  default?: any
}

interface MapEntry {
  id: string
  key: string
  value: Record<string, any>
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  name: {
    type: String,
    required: true,
  },
  valueSchema: {
    type: Object as PropType<AvroSchema | AvroMap | string>,
    default: null,
  },
  valueChildren: {
    type: Object as PropType<Record<string, any> | null>,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

function mapToEntries(map: Record<string, any>): MapEntry[] {
  return Object.entries(map ?? {}).map(([key, value]) => ({
    id: createRandomString(),
    key,
    value: cloneDeep(value),
  }))
}

function entriesToMap(arr: MapEntry[]): Record<string, any> {
  const result: Record<string, any> = {}
  arr.forEach(({ key, value }) => {
    if (key.trim()) {
      result[key.trim()] = value
    }
  })
  return result
}

const entries = ref<MapEntry[]>(mapToEntries(props.modelValue))
const activeEntries = ref<string[]>([])

// Expand only entries that have validation errors
const validationFailedFields = inject<Ref<Record<string, any>>>(
  'pluginFormValidationFailed',
  ref({}),
)
watch(validationFailedFields, (fields) => {
  const failedIds = entries.value
    .filter((entry) => {
      if (!entry.key.trim()) return false
      const prefix = `${props.name}.${entry.key.trim()}.`
      return Object.keys(fields).some((path) => path.startsWith(prefix))
    })
    .map((e) => e.id)
  if (failedIds.length > 0) {
    activeEntries.value = [...new Set([...activeEntries.value, ...failedIds])]
  }
})

const hasValueChildren = computed(
  () => !!props.valueChildren && Object.keys(props.valueChildren).length > 0,
)

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, entriesToMap(entries.value))) {
      entries.value = mapToEntries(val)
    }
  },
  { deep: true },
)

watch(entries, (val) => emit('update:modelValue', entriesToMap(val)), { deep: true })

function isRecordSchema(schema: any): schema is AvroSchema {
  return typeof schema === 'object' && schema?.type === 'record' && Array.isArray(schema?.fields)
}

function buildDefault(schema: AvroSchema): Record<string, any> {
  const result: Record<string, any> = {}
  schema.fields.forEach((field: AvroField) => {
    if (field.default !== undefined) {
      result[field.name] = cloneDeep(field.default)
    } else if (typeof field.type === 'string') {
      result[field.name] = getDefaultForPrimitive(field.type)
    } else if (typeof field.type === 'object' && !Array.isArray(field.type)) {
      if (field.type.type === 'record') result[field.name] = buildDefault(field.type)
      else if (field.type.type === 'array') result[field.name] = []
      else if (field.type.type === 'map') result[field.name] = {}
    }
  })
  return result
}

function getDefaultForPrimitive(type: string): any {
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

function addEntry() {
  const id = createRandomString()
  const defaultValue = isRecordSchema(props.valueSchema)
    ? buildDefault(props.valueSchema as AvroSchema)
    : {}
  entries.value = [...entries.value, { id, key: '', value: defaultValue }]
  activeEntries.value = [...activeEntries.value, id]
}

function removeEntry(id: string) {
  entries.value = entries.value.filter((e) => e.id !== id)
  activeEntries.value = activeEntries.value.filter((a) => a !== id)
}
</script>

<style lang="scss" scoped>
.map-records-editor {
  width: 100%;
}

.map-entries {
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--border-radius-small);

  :deep(.el-collapse-item__header) {
    padding: 0 12px;
    background-color: var(--color-bg-split);
  }

  :deep(.el-collapse-item__content) {
    padding: 16px;
  }

  :deep(.el-collapse-item:last-child .el-collapse-item__wrap) {
    border-bottom: 1px solid var(--el-border-color-light);
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }
}

.entry-title {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding-right: 8px;

  .entry-key-input {
    flex: 1;
  }

  .btn-remove {
    flex-shrink: 0;
  }
}
</style>
