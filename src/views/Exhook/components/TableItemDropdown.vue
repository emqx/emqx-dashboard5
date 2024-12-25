<template>
  <el-dropdown
    class="table-dropdown"
    @command="handleCommand(rowData, $event)"
    @visible-change="dropdownVisibleChanged"
    popper-class="table-dropdown-popper"
  >
    <TableButton class="table-dropdown-btn">
      <span>{{ $t('Base.more') }}</span>
      <el-icon :size="8" class="icon-arrow" :class="{ rotate: dropdownVisible }">
        <CaretBottom />
      </el-icon>
    </TableButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="up" :disabled="rowIndex === 0">
          <el-icon><ArrowUp /></el-icon>
          {{ $t('Base.up') }}
        </el-dropdown-item>
        <el-dropdown-item command="down" :disabled="rowIndex === tableLen - 1">
          <el-icon><ArrowDown /></el-icon>
          <span>{{ $t('Base.down') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="top" :disabled="rowIndex === 0">
          <el-icon><Top /></el-icon>
          <span>{{ $t('Plugins.moveToTop') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="bottom" :disabled="rowIndex === tableLen - 1">
          <el-icon><Bottom /></el-icon>
          <span>{{ $t('Plugins.moveToBottom') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="delete">
          <el-icon><Delete /></el-icon>
          <span>{{ $t('Base.delete') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableItemDropdown',
})
</script>

<script setup lang="ts">
import { Exhook } from '@/types/systemModule'
import { ArrowDown, ArrowUp, Bottom, CaretBottom, Delete, Top } from '@element-plus/icons-vue'
import type { PropType, Ref } from 'vue'
import { defineEmits, defineProps, ref } from 'vue'

defineProps({
  rowData: {
    required: true,
    type: Object as PropType<Exhook>,
  },
  tableLen: {
    type: Number,
    required: true,
  },
  rowIndex: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['moveUp', 'moveDown', 'moveToTop', 'moveToBottom', 'delete'])

const dropdownVisible: Ref<boolean> = ref(false)
const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const handleCommand = function (row: Exhook, command: string) {
  switch (command) {
    case 'up':
      emit('moveUp', row)
      break
    case 'down':
      emit('moveDown', row)
      break
    case 'top':
      emit('moveToTop', row)
      break
    case 'bottom':
      emit('moveToBottom', row)
      break
    case 'delete':
      emit('delete', row)
      break
    default:
      break
  }
}
</script>
