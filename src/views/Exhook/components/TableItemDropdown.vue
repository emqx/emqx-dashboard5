<template>
  <el-dropdown
    class="table-dropdown"
    @command="handleCommand(rowData, $event)"
    @visible-change="dropdownVisibleChanged"
    popper-class="table-dropdown-popper"
  >
    <el-button class="table-dropdown-btn" size="small">
      <span>{{ $t('Base.more') }}</span>
      <el-icon :size="8" class="icon-arrow" :class="{ rotate: dropdownVisible }">
        <CaretBottom />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="up" :disabled="rowIndex === 0 || !$hasPermission('put')">
          <el-icon><ArrowUp /></el-icon>
          {{ $t('Base.up') }}
        </el-dropdown-item>
        <el-dropdown-item
          command="down"
          :disabled="rowIndex === tableLen - 1 || !$hasPermission('put')"
        >
          <el-icon><ArrowDown /></el-icon>
          <span>{{ $t('Base.down') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="top" :disabled="rowIndex === 0 || !$hasPermission('put')">
          <el-icon><Top /></el-icon>
          <span>{{ $t('Plugins.moveToTop') }}</span>
        </el-dropdown-item>
        <el-dropdown-item
          command="bottom"
          :disabled="rowIndex === tableLen - 1 || !$hasPermission('put')"
        >
          <el-icon><Bottom /></el-icon>
          <span>{{ $t('Plugins.moveToBottom') }}</span>
        </el-dropdown-item>
        <el-dropdown-item :disabled="!$hasPermission('delete')" command="delete">
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
import { defineProps, defineEmits, PropType, Ref, ref } from 'vue'
import { CaretBottom, ArrowUp, ArrowDown, Top, Bottom, Delete } from '@element-plus/icons-vue'

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
