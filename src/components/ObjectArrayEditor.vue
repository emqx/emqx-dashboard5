<template>
  <!-- TABLE -->
  <el-table
    v-if="editMode !== 'list'"
    class="object-array-editor key-and-value-editor shadow-none"
    ref="TableCom"
    :data="arr"
  >
    <el-table-column v-for="(value, key) in properties" :key="key" v-bind="getColumnProps(value)">
      <template #header>
        <label :class="getFormItemRules(key) && 'is-required'">
          {{ value.label }}
        </label>
        <InfoTooltip v-if="value.description">
          <template #content>
            <MarkdownContent :content="value.description" in-tooltip />
          </template>
        </InfoTooltip>
      </template>
      <template #default="{ $index }">
        <template v-if="arr[$index] !== undefined">
          <CustomFormItem :prop="getProp($index, key)" :rules="getFormItemRules(key)">
            <SchemaFormItem
              v-model="arr[$index][key]"
              :type="(value as any).type"
              :symbols="(value as any).symbols"
              :custom-props="value.componentProps"
              :property="value"
              :items="value.items"
            />
          </CustomFormItem>
        </template>
      </template>
    </el-table-column>
    <el-table-column width="80px" v-if="!disabled">
      <template #header>
        <el-button link type="primary" @click="addItem">
          {{ $t('Base.add') }}
        </el-button>
      </template>
      <template #default="{ $index }">
        <el-button link type="primary" @click="deleteItem($index)">
          {{ $t('Base.delete') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- LIST -->
  <div v-else class="object-array-editor">
    <ul class="obj-list" v-if="arr && arr.length">
      <li class="obj-item" v-for="(item, $index) in arr" :key="keyArr[$index]">
        <div class="obj-item-bd">
          <CustomFormItem
            v-for="(value, key) in properties"
            :key="key"
            :readonly="readonly"
            :label="value.label"
            :prop="getProp($index, key)"
            :rules="getFormItemRules(key)"
            label-width="118px"
          >
            <SchemaFormItem
              v-model="item[key]"
              :type="(value as any).type"
              :symbols="(value as any).symbols"
            />
          </CustomFormItem>
        </div>
        <el-button v-if="!readonly && !disabled" link class="btn-del" @click="deleteItem($index)">
          <el-icon :size="16" class="icon-del"><Delete /></el-icon>
        </el-button>
      </li>
    </ul>
    <el-button v-if="!readonly && !disabled" link type="primary" :icon="Plus" @click="addItem">
      {{ tl('add') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { FormRules } from '@/types/common'
import { Properties, Property } from '@/types/schemaForm'
import { Delete, Plus } from '@element-plus/icons-vue'
import CustomFormItem from './CustomFormItem.vue'
import InfoTooltip from './InfoTooltip.vue'
import SchemaFormItem from './SchemaFormItem'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<Record<string, any>>>,
    default: () => [],
  },
  properties: {
    type: Object as PropType<Properties>,
    default: () => ({}),
  },
  propKey: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
  },
  editMode: {
    type: String as PropType<'table' | 'list'>,
    default: 'table',
  },
  /**
   * for bind rules to form item
   */
  rules: {
    type: Object as PropType<FormRules>,
  },
  /**
   * for plugin form render
   */
  inPlugins: {
    type: Boolean,
    default: false,
  },
  columnsProps: {
    type: Object,
  },
})
const emit = defineEmits(['update:modelValue', 'add-item', 'delete-item'])

const { tl } = useI18nTl('Base')

const arr = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const TableCom = ref()

const { initRecordByComponents } = useSchemaRecord()

const initRecordByPluginForm = (data: Properties) => {
  return Object.keys(data)
    .map((key) => ({ [key]: '' }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

const keyArr = computed(() => Array.from({ length: arr.value.length }, () => createRandomString()))

const getColumnProps = (property: Property) => {
  const { key, type } = property
  if (key && props.columnsProps && props.columnsProps[key] !== undefined) {
    return props.columnsProps[key]
  }
  return type === 'object' ? { width: 300 } : {}
}

const addItem = () => {
  let objData
  if (props.inPlugins) {
    objData = initRecordByPluginForm(props.properties)
  } else {
    objData = get(initRecordByComponents(props.properties), props.propKey)
  }
  const defaultValue = cloneDeep(objData)
  arr.value = [...arr.value, defaultValue]
  emit('add-item')
}

const deleteItem = (index: number) => {
  arr.value = [...arr.value.slice(0, index), ...arr.value.slice(index + 1)]
  emit('delete-item')
}

const getProp = (index: number, key: string | number) => `${props.propKey}.${index}.${key}`
const getFormItemRules = (key: string | number) => {
  if (!props.rules) {
    return undefined
  }
  const fullPath = `${props.propKey}.${key}`
  return props.rules[fullPath]
}

onMounted(async () => {
  await nextTick()
  if (isFunction(TableCom.value?.doLayout)) {
    TableCom.value.doLayout()
  }
})
</script>

<style lang="scss">
.object-array-editor {
  width: 100%;

  .el-table {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .obj-item-bd {
    flex-grow: 1;
    padding: 16px;
    border-radius: 8px;
    background-color: var(--color-bg-split);
    .el-input:not(.el-input-group--append),
    .el-select {
      width: 100% !important;
    }
    .el-form-item:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  .obj-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    .btn-del {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 22px;
      margin-left: 8px;
    }
  }
  label.is-required::after {
    content: '*';
    color: var(--el-color-danger);
    margin-left: 4px;
  }
}
</style>
