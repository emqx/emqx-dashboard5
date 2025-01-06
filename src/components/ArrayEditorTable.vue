<template>
  <el-table class="key-and-value-editor shadow-none" :data="tableData">
    <el-table-column>
      <template #default="{ $index }">
        <el-input v-model="tableData[$index]" />
      </template>
    </el-table-column>
    <el-table-column v-if="!disabled" width="100">
      <template #header>
        <el-button link type="primary" @click="addColumn">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<string | number>>,
  },
  disabled: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])

const tableData = computed({
  get() {
    return props.modelValue || []
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const addColumn = () => {
  tableData.value.push('')
}

const deleteItem = (index: number) => {
  tableData.value.splice(index, 1)
}
</script>

<style lang="scss"></style>
