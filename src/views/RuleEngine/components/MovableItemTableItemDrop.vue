<template>
  <el-dropdown
    @command="handleCommand"
    @visible-change="dropdownVisibleChanged"
    popper-class="table-dropdown-popper"
  >
    <TableButton class="table-dropdown-btn">
      <el-icon class="icon-arrow" :class="{ rotate: dropdownVisible }">
        <ArrowDown />
      </el-icon>
      <span>
        {{ t('Base.more') }}
      </span>
    </TableButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="moveUp" :disabled="rowIndex === 0 || !$hasPermission('put')">
          <el-icon><ArrowUp /></el-icon>
          {{ $t('Base.up') }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveDown"
          :disabled="rowIndex === tableDataLen - 1 || !$hasPermission('put')"
        >
          <el-icon><ArrowDown /></el-icon>
          {{ $t('Base.down') }}
        </el-dropdown-item>
        <el-dropdown-item command="moveToTop" :disabled="rowIndex === 0 || !$hasPermission('put')">
          <el-icon><Top /></el-icon>
          {{ $t('Base.moveToTop') }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveToBottom"
          :disabled="rowIndex === tableDataLen - 1 || !$hasPermission('put')"
        >
          <el-icon><Bottom /></el-icon>
          {{ $t('Base.moveToBottom') }}
        </el-dropdown-item>
        <el-dropdown-item :disabled="!$hasPermission('delete')" command="delete">
          <el-icon><Delete /></el-icon>
          {{ $t('Base.delete') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { defineEmits, defineProps, ref, Ref } from 'vue'
import { Top, Bottom, Delete, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

defineProps({
  rowIndex: {
    type: Number,
    required: true,
  },
  tableDataLen: {
    required: true,
    type: Number,
  },
})

const emit = defineEmits(['moveToTop', 'moveToBottom', 'delete', 'moveUp', 'moveDown'])

const { t } = useI18nTl('')

const dropdownVisible: Ref<boolean> = ref(false)

const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const handleCommand = (command: string) => emit(command as Parameters<typeof emit>[0])
</script>
