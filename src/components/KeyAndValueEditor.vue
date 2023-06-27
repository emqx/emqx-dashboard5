<template>
  <el-table v-if="type === 'table'" class="key-and-value-editor shadow-none" :data="tableData">
    <el-table-column :label="keyValueLabel.key">
      <template #default="{ row }">
        <el-input
          v-model="row.key"
          class="key-input"
          @input="atInputChange"
          :readonly="fixedKeys"
        />
      </template>
    </el-table-column>
    <el-table-column :label="keyValueLabel.value">
      <template #default="{ row }">
        <el-input v-model="row.value" @input="atInputChange" />
      </template>
    </el-table-column>
    <el-table-column v-if="!disabled && !fixedKeys" width="100">
      <template #header>
        <a href="javascript:;" class="btn" @click="addColumn">
          {{ $t('Base.add') }}
        </a>
      </template>
      <template #default="{ row }">
        <a href="javascript:;" class="btn" @click="deleteItem(row)">
          {{ $t('Base.delete') }}
        </a>
      </template>
    </el-table-column>
  </el-table>
  <div class="key-and-value-editor" v-else>
    <ul class="key-value-list">
      <li class="key-value-item" v-for="(item, $index) in tableData" :key="$index">
        <el-input :placeholder="keyValueLabel.key" v-model="item.key" />
        <el-input :placeholder="keyValueLabel.value" v-model="item.value" />
        <el-button class="btn-del" link @click="deleteItem(item)">
          <el-icon :size="16"><Delete /></el-icon>
        </el-button>
      </li>
    </ul>
    <el-button link type="primary" :icon="Plus" @click="addColumn">
      {{ t('Base.add') }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { cloneDeep, isEqual, isPlainObject } from 'lodash'
import { computed, defineComponent, PropType, ref, Ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete, Plus } from '@element-plus/icons-vue'

enum State {
  OK = 0,
  Error,
}
type kvRow = {
  key: string
  value: string
  state: State
}

export default defineComponent({
  name: 'KeyAndValueEditor',
  emits: ['update:modelValue'],
  components: { Delete },
  props: {
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
      type: String as PropType<'table' | 'list'>,
      default: 'table',
    },
  },
  setup(props, context) {
    const rowData: kvRow = {
      key: '',
      value: '',
      state: State.OK,
    }
    const tableData: Ref<kvRow[]> = ref([])

    let lastTimeObjData = {}

    const { t } = useI18n()
    const { emit } = context

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

    createTbData()

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

    watch(
      () => props.modelValue,
      (val) => {
        if (!isEqual(val, lastTimeObjData)) {
          createTbData()
        }
      },
    )

    return {
      Plus,
      t,
      tableData,
      atInputChange,
      deleteItem,
      addColumn,
      keyValueLabel,
    }
  },
})
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
}
</style>
