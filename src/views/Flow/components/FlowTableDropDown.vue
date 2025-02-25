<template>
  <el-dropdown
    @command="handleCommand(rowData, $event)"
    @visible-change="dropdownVisibleChanged"
    popper-class="table-dropdown-popper"
  >
    <el-icon><MoreFilled /></el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="copy">
          <el-icon><CopyDocument /></el-icon>
        </el-dropdown-item>
        <el-dropdown-item command="delete">
          <el-icon><Delete /></el-icon>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { PluginItem } from '@/types/plugin'
import { CopyDocument, Delete, MoreFilled } from '@element-plus/icons-vue'

defineProps({
  rowData: {
    required: true,
    type: Object as PropType<PluginItem>,
  },
})

const emit = defineEmits(['copy', 'delete'])

const dropdownVisible: Ref<boolean> = ref(false)

const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const handleCommand = (row: PluginItem, command: 'copy' | 'delete') => {
  emit(command, row)
}
</script>

<style lang="scss"></style>
