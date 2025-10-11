<template>
  <el-dropdown
    @command="handleCommand"
    @visible-change="dropdownVisibleChanged"
    popper-class="table-dropdown-popper"
  >
    <TableButton class="table-dropdown-btn">
      <span>
        {{ t('Base.more') }}
      </span>
      <el-icon :size="8" class="icon-arrow" :class="{ rotate: dropdownVisible }">
        <CaretBottom />
      </el-icon>
    </TableButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="moveUp" :disabled="rowIndex === 0 || !$hasPermission('put')">
          <Icon icon="lucide:chevron-up" class="w-4 h-4 mr-2" />
          {{ $t('Base.up') }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveDown"
          :disabled="rowIndex === tableDataLen - 1 || !$hasPermission('put')"
        >
          <Icon icon="lucide:chevron-down" class="w-4 h-4 mr-2" />
          {{ $t('Base.down') }}
        </el-dropdown-item>
        <el-dropdown-item command="moveToTop" :disabled="rowIndex === 0 || !$hasPermission('put')">
          <Icon icon="lucide:chevrons-up" class="w-4 h-4 mr-2" />
          {{ $t('Base.moveToTop') }}
        </el-dropdown-item>
        <el-dropdown-item
          command="moveToBottom"
          :disabled="rowIndex === tableDataLen - 1 || !$hasPermission('put')"
        >
          <Icon icon="lucide:chevrons-down" class="w-4 h-4 mr-2" />
          {{ $t('Base.moveToBottom') }}
        </el-dropdown-item>
        <el-dropdown-item :disabled="!$hasPermission('delete')" command="delete">
          <Icon icon="lucide:trash-2" class="w-4 h-4 mr-2" />
          {{ $t('Base.delete') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { CaretBottom } from '@element-plus/icons-vue'

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
