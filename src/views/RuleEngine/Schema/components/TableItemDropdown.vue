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
        <el-dropdown-item :disabled="!$hasPermission('post')" command="copy">
          <el-icon><CopyDocument /></el-icon>
          <span>{{ tl('duplicate') }}</span>
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
export default defineComponent({
  name: 'TableItemDropdown',
})
</script>

<script setup lang="ts">
import { SchemaRegistry } from '@/types/rule'

import { CaretBottom, CopyDocument, Delete } from '@element-plus/icons-vue'
import useI18nTl from '@/hooks/useI18nTl'

defineProps({
  rowData: {
    required: true,
    type: Object as PropType<SchemaRegistry>,
  },
})

const emit = defineEmits(['duplicate', 'delete'])

const { tl } = useI18nTl('RuleEngine')

const dropdownVisible: Ref<boolean> = ref(false)
const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const handleCommand = function (row: SchemaRegistry, command: string) {
  switch (command) {
    case 'copy':
      emit('duplicate', row)
      break

    case 'delete':
      emit('delete', row)
      break
    default:
      break
  }
}
</script>
