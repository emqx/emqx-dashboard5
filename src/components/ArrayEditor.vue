<template>
  <el-table class="array-editor" :data="tableData" size="mini">
    <el-table-column :label="$t('components.value')">
      <template #default="{ row }">
        <el-input
          v-if="type === 'string'"
          v-model.trim="row.value"
          class="key-input"
          @input="atInputChange"
        ></el-input>
        <el-input
          v-if="type === 'number'"
          v-model.number="row.value"
          type="number"
          class="key-input"
          @input="atInputChange"
        ></el-input>
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
import { defineComponent, PropType, ref, watch } from 'vue'

export default defineComponent({
  name: 'ArrayEditor',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Array as PropType<(string | number)[]>,
    },
    type: {
      type: String,
      required: true,
      defautl: 'string',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const tableData = ref<{ value: string | number }[]>([])
    watch(
      () => props.modelValue,
      (val) => {
        if (val) {
          tableData.value = val.map((v: string | number) => ({ value: v }))
        } else {
          tableData.value = []
        }
      },
    )
    function atInputChange() {
      const data: (string | number)[] = []
      tableData.value.forEach((v) => {
        data.push(v.value)
      })
      ctx.emit('update:modelValue', data)
    }
    function deleteItem(row: { value: string | number }) {
      tableData.value = tableData.value.filter(($) => $ !== row)
      atInputChange()
    }
    function addColumn() {
      tableData.value.push({ value: '' })
    }
    return {
      tableData,
      atInputChange,
      deleteItem,
      addColumn,
    }
  },
})
</script>

<style lang="scss" scoped>
.array-editor {
  min-width: 200px;
}
</style>
