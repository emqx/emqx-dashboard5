<template>
  <el-dropdown
    @command="handleCommand(rowData, $event)"
    @visible-change="dropdownVisibleChanged"
    popper-class="table-dropdown-popper"
    :disabled="disabled"
  >
    <TableButton class="table-dropdown-btn" :disabled="disabled">
      <el-icon class="icon-arrow" :class="{ rotate: dropdownVisible }">
        <ArrowDown />
      </el-icon>
      <span>
        {{ $t('Base.more') }}
      </span>
    </TableButton>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          command="createRule"
          v-if="canCreateRule"
          :disabled="!$hasPermission('post')"
        >
          <el-icon><DocumentAdd /></el-icon>
          <span>{{ tl('createRule') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="copy" :disabled="!$hasPermission('post')" v-if="canCopy">
          <el-icon><CopyDocument /></el-icon>
          <span>{{ tl('duplicate') }}</span>
        </el-dropdown-item>
        <el-dropdown-item :disabled="!$hasPermission('post') || disableDel" command="delete">
          <el-icon><Delete /></el-icon>
          <span>{{ tl('delete', 'Base') }}</span>
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
import { PluginItem } from '@/types/plugin'
import { defineProps, defineEmits, PropType, ref, Ref } from 'vue'
import { ArrowDown, Delete, CopyDocument, DocumentAdd } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

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
