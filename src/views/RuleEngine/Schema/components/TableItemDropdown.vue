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
        <el-dropdown-item v-if="!hideDuplicate" :disabled="!$hasPermission('post')" command="copy">
          <Copy class="w-4 h-4 mr-2" />
          <span>{{ tl('duplicate') }}</span>
        </el-dropdown-item>
        <el-dropdown-item :disabled="!$hasPermission('delete')" command="delete">
          <Trash2 class="w-4 h-4 mr-2" />
          <span>{{ t('Base.delete') }}</span>
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
import { CaretBottom } from '@element-plus/icons-vue'
import { Copy, Trash2 } from 'lucide-vue-next'

defineProps({
  rowData: {
    required: true,
    type: Object as PropType<SchemaRegistry>,
  },
  hideDuplicate: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['duplicate', 'delete'])

const { t, tl } = useI18nTl('RuleEngine')

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
