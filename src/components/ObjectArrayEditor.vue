<template>
  <!-- TABLE -->
  <el-table
    v-if="editMode !== 'list'"
    class="object-array-editor key-and-value-editor shadow-none"
    ref="TableCom"
    :data="arr"
  >
    <el-table-column v-for="(value, key) in properties" :key="key">
      <template #header>
        <label :class="getFormItemRules(key) && 'is-required'">
          {{ value.label }}
        </label>
        <InfoTooltip v-if="value.description">
          <template #content>
            <MarkdownContent :content="value.description" />
          </template>
        </InfoTooltip>
      </template>
      <template #default="{ $index }">
        <template v-if="arr[$index] !== undefined">
          <CustomFormItem :prop="getProp($index, key)" :rules="getFormItemRules(key)">
            <SchemaFormItem
              v-model="arr[$index][key]"
              :type="(value.type as any)"
              :symbols="(value.symbols as string[] | number[] | undefined)"
            />
          </CustomFormItem>
        </template>
      </template>
    </el-table-column>
    <el-table-column :width="dbType ? '170px' : '100px'" v-if="!disabled">
      <template #header>
        <div class="header-settings">
          <batch-settings v-if="dbType" :type="dbType" @uploaded-data="handleUploadedData" />
          <a href="javascript:;" @click="addItem">
            {{ $t('Base.add') }}
          </a>
        </div>
      </template>
      <template #default="{ $index }">
        <a href="javascript:;" @click="deleteItem($index)">
          {{ $t('Base.delete') }}
        </a>
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
              :type="(value.type as any)"
              :symbols="(value.symbols as string[] | number[] | undefined)"
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
import { createRandomString } from '@/common/tools'
import MarkdownContent from '@/components/MarkdownContent.vue'
import useSchemaRecord from '@/hooks/Schema/useSchemaRecord'
import useI18nTl from '@/hooks/useI18nTl'
import { FormRules } from '@/types/common'
import { Properties } from '@/types/schemaForm'
import { Delete, Plus } from '@element-plus/icons-vue'
import { cloneDeep, get, isFunction } from 'lodash'
import { PropType, computed, defineEmits, defineProps, nextTick, onMounted, ref } from 'vue'
import CustomFormItem from './CustomFormItem.vue'
import InfoTooltip from './InfoTooltip.vue'
import SchemaFormItem from './SchemaFormItem'
import BatchSettings from '@/components/BatchSettings.vue'
import { BatchSettingDatabaseType } from '@/types/enum'

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
  dbType: {
    type: String as PropType<BatchSettingDatabaseType>,
  },
})
const emit = defineEmits(['update:modelValue'])

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

const keyArr = computed(() => Array.from({ length: arr.value.length }, () => createRandomString()))

const addItem = () => {
  const objData = get(initRecordByComponents(props.properties), props.propKey)
  const defaultValue = cloneDeep(objData)
  arr.value = [...arr.value, defaultValue]
}

const deleteItem = (index: number) => {
  arr.value = [...arr.value.slice(0, index), ...arr.value.slice(index + 1)]
}

const getProp = (index: number, key: string | number) => `${props.propKey}.${index}.${key}`
const getFormItemRules = (key: string | number) => {
  if (!props.rules) {
    return undefined
  }
  const fullPath = `${props.propKey}.${key}`
  return props.rules[fullPath]
}

const handleUploadedData = (val: Array<Record<string, any>>) => {
  arr.value = val
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
  .header-settings {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
