<template>
  <el-table class="key-and-value-editor shadow-none" :data="tableData" size="small">
    <el-table-column :label="keyValueLabel.key">
      <template #default="{ row }">
        <el-input v-model="row.key" class="key-input" @input="atInputChange"></el-input>
      </template>
    </el-table-column>
    <el-table-column :label="keyValueLabel.value">
      <template #default="{ row }">
        <el-input v-model="row.value" @input="atInputChange"></el-input>
      </template>
    </el-table-column>
    <el-table-column width="70">
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
</template>

<script lang="ts">
import { ref, computed, Ref, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

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
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    customLabel: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const rowData: kvRow = {
      key: '',
      value: '',
      state: State.OK,
    }
    const tableData: Ref<kvRow[]> = ref([])
    const { t } = useI18n()
    const { emit } = context

    function createTbData() {
      const d = props.modelValue
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
      emit('update:modelValue', data)
    }
    function deleteItem(row: kvRow) {
      tableData.value = tableData.value.filter(($) => $ !== row)
      atInputChange()
    }
    function addColumn() {
      tableData.value.push({ ...rowData })
    }

    return {
      tableData,
      atInputChange,
      deleteItem,
      addColumn,
      keyValueLabel,
    }
  },
})
</script>

<style lang="scss" scoped>
.key-and-value-editor {
  min-width: 200px;
}
</style>
