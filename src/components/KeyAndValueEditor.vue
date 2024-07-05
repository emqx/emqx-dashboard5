<template>
  <el-table v-if="type === 'table'" class="key-and-value-editor shadow-none" :data="tableData">
    <el-table-column :label="keyValueLabel.key">
      <template #default="{ row }">
        <template v-if="!readonly">
          <InputWithPlaceholderSelect
            v-if="supportPlaceholder?.includes('key')"
            v-model="row.key"
            class="key-input"
            @input="atInputChange"
            :readonly="fixedKeys"
          />
          <el-input
            v-else
            v-model="row.key"
            class="key-input"
            @input="atInputChange"
            :readonly="fixedKeys"
          />
        </template>

        <p class="value" v-else>{{ row.key }}</p>
      </template>
    </el-table-column>
    <el-table-column :label="keyValueLabel.value">
      <template #default="{ row }">
        <template v-if="!readonly">
          <InputWithPlaceholderSelect
            v-if="supportPlaceholder?.includes('value')"
            v-model="row.value"
            @input="atInputChange"
          />
          <el-input v-else v-model="row.value" @input="atInputChange" />
        </template>
        <p class="value" v-else>{{ row.value }}</p>
      </template>
    </el-table-column>
    <el-table-column v-if="!disabled && !fixedKeys && !readonly" width="100">
      <template #header>
        <el-button link type="primary" @click="addColumn">
          {{ $t('Base.add') }}
        </el-button>
      </template>
      <template #default="{ row }">
        <el-button link type="primary" @click="deleteItem(row)">
          {{ $t('Base.delete') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="key-and-value-editor" v-else-if="type === 'list'">
    <ul class="key-value-list">
      <li class="key-value-item" v-for="(item, $index) in tableData" :key="$index">
        <InputWithPlaceholderSelect
          v-if="supportPlaceholder?.includes('key')"
          v-model="item.key"
          @input="atInputChange"
          :placeholder="keyValueLabel.key"
        />
        <el-input
          v-else
          :placeholder="keyValueLabel.key"
          v-model="item.key"
          @input="atInputChange"
        />
        <InputWithPlaceholderSelect
          v-if="supportPlaceholder?.includes('value')"
          v-model="item.value"
          :placeholder="keyValueLabel.value"
          @input="atInputChange"
        />
        <el-input
          v-else
          :placeholder="keyValueLabel.value"
          v-model="item.value"
          @input="atInputChange"
        />
        <el-button class="btn-del" link @click="deleteItem(item)">
          <el-icon :size="16"><Delete /></el-icon>
        </el-button>
      </li>
    </ul>
    <el-button link type="primary" :icon="Plus" @click="addColumn">
      {{ t('Base.add') }}
    </el-button>
  </div>
  <template v-else>
    <el-input
      v-if="!supportPlaceholder || supportPlaceholder.length === 0"
      class="key-and-value-input"
      v-model="inputValue"
      @blur="handleInputValueChange"
    />
    <InputWithPlaceholderSelect
      v-else
      class="key-and-value-input"
      v-model="inputValue"
      @blur="handleInputValueChange"
    />
  </template>
</template>

<script lang="ts" setup>
import { splitOnComma, splitOnSymbol } from '@/common/tools'
import { Delete, Plus } from '@element-plus/icons-vue'
import { cloneDeep, isEqual, isPlainObject } from 'lodash'
import type { PropType } from 'vue'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import InputWithPlaceholderSelect from './InputWithPlaceholderSelect.vue'

enum State {
  OK = 0,
  Error,
}
type kvRow = {
  key: string
  value: string
  state: State
}

const props = defineProps({
  modelValue: {
    type: Object,
  },
  customLabel: {
    type: Object,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fixedKeys: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<'table' | 'list' | 'input'>,
    default: 'table',
  },
  readonly: {
    type: Boolean,
  },
  /**
   * used in action configuration
   * ❗️need to provide `sql` & `eventList` at some ancestor component
   */
  supportPlaceholder: {
    type: Array as PropType<Array<'key' | 'value'>>,
  },
})

const emit = defineEmits(['update:modelValue'])

const rowData: kvRow = {
  key: '',
  value: '',
  state: State.OK,
}
const tableData = ref<kvRow[]>([])

let lastTimeObjData = {}

const { t } = useI18n()

const inputValue = ref('')

const convertObjToStr = (obj: Record<string, any>) => {
  const keyValueArr = Object.entries(obj)
  return Object.entries(obj).reduce((str, [key, value], index) => {
    const end = index < keyValueArr.length - 1 ? ', ' : ''
    return (str += `${key}=${value}${end}`)
  }, '')
}

const createKeyValueStr = () => {
  if (!props.modelValue) {
    inputValue.value = ''
  } else if (typeof props.modelValue === 'string') {
    inputValue.value = props.modelValue
  } else {
    inputValue.value = convertObjToStr(props.modelValue)
  }
}

const convertStrToObj = (str: string) => {
  const equationArr = splitOnComma(str)
  const obj: Record<string, unknown> = {}
  equationArr.forEach((item) => {
    const [key, value] = splitOnSymbol(item, '=').map((item) => item.trim())
    obj[key] = value
  })
  return obj
}

const validKeyValueStrReg = /(.+=.+,)*(.+=.+)/
const handleInputValueChange = () => {
  if (validKeyValueStrReg.test(inputValue.value)) {
    const newObj = convertStrToObj(inputValue.value)
    lastTimeObjData = cloneDeep(newObj)
    emit('update:modelValue', newObj)
  } else if (typeof props.modelValue === 'string') {
    emit('update:modelValue', inputValue.value)
  }
}

function createTbData() {
  const d = props.modelValue
  if (!d || !isPlainObject(d)) {
    return
  }
  tableData.value = []
  lastTimeObjData = cloneDeep(d)
  Object.entries(d).forEach(([key, value]: [string, string]) => {
    tableData.value.push({ key, value, state: 0 })
  })
}

const keyValueLabel = computed(() => {
  if (props.customLabel === null) {
    return {
      key: t('components.key'),
      value: t('components.value'),
    }
  }
  return props.customLabel
})

function atInputChange() {
  const data: Record<string, unknown> = {}
  tableData.value.forEach((item) => {
    const { key, value } = item
    data[key] = value
  })
  lastTimeObjData = cloneDeep(data)
  emit('update:modelValue', data)
}
function deleteItem(row: kvRow) {
  tableData.value = tableData.value.filter(($) => $ !== row)
  atInputChange()
}
function addColumn() {
  tableData.value.push({ ...rowData })
}

const updateSelfValue = () => {
  if (props.type !== 'input') {
    createTbData()
  } else {
    createKeyValueStr()
  }
}

updateSelfValue()

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, lastTimeObjData)) {
      updateSelfValue()
    }
  },
)
</script>

<style lang="scss">
.key-and-value-editor {
  min-width: 200px;
  &.el-table .cell {
    font-weight: normal;
    color: var(--el-text-color-regular);
  }
  ul {
    list-style: none;
    padding: 0;
    margin-top: 0;
    margin-bottom: 8px;
  }
  .key-value-item {
    display: flex;
    &:not(:last-child) {
      margin-bottom: 12px;
    }
    .el-input {
      margin-right: 16px;
    }
  }
  .value {
    margin: 0;
  }
}
</style>
