<template>
  <el-dropdown
    @command="handleCommand(rowData, $event)"
    @visible-change="dropdownVisibleChanged"
    popper-class="table-dropdown-popper"
    :disabled="disabled"
  >
    <TableButton class="table-dropdown-btn" :disabled="disabled">
      <span>
        {{ $t('Base.more') }}
      </span>
      <el-icon :size="8" class="icon-arrow" :class="{ rotate: dropdownVisible }">
        <CaretBottom />
      </el-icon>
    </TableButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          command="createRule"
          v-if="canCreateRule"
          :disabled="!$hasPermission('post')"
        >
          <FilePlus class="w-4 h-4 mr-2" />
          <span>{{ tl('createRule') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="copy" :disabled="!$hasPermission('post')" v-if="canCopy">
          <Copy class="w-4 h-4 mr-2" />
          <span>{{ tl('duplicate') }}</span>
        </el-dropdown-item>
        <el-dropdown-item :disabled="!$hasPermission('post') || disableDel" command="delete">
          <Trash2 class="w-4 h-4 mr-2" />
          <span>{{ tl('delete', 'Base') }}</span>
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
import { PluginItem } from '@/types/plugin'
import { CaretBottom } from '@element-plus/icons-vue'
import { Copy, FilePlus, Trash2 } from 'lucide-vue-next'

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

defineProps({
  rowData: {
    required: true,
    type: Object as PropType<PluginItem>,
  },
  canCreateRule: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * for connector, when a connector associated with bridge, it should be disabled
   */
  disableDel: {
    type: Boolean,
    default: false,
  },
  canCopy: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['resetStatistics', 'copy', 'delete', 'createRule'])

const dropdownVisible: Ref<boolean> = ref(false)

const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const handleCommand = (row: PluginItem, command: 'resetStatistics' | 'copy' | 'delete') => {
  emit(command, row)
}
</script>
