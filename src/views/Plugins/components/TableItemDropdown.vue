<template>
  <el-dropdown
    class="table-dropdown"
    @command="handleCommand(rowData, $event)"
    @visible-change="dropdownVisibleChanged"
  >
    <el-button class="dropdown-btn" size="small">
      <span>
        {{ $t('Base.more') }}
      </span>
      <el-icon :size="8" class="icon-arrow" :class="{ rotate: dropdownVisible }"
        ><CaretBottom
      /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="top" :class="{ disabled: filtered }">
          {{ $t('Plugins.moveToTop') }}
        </el-dropdown-item>
        <el-dropdown-item command="bottom" :class="{ disabled: filtered }">
          {{ $t('Plugins.moveToBottom') }}
        </el-dropdown-item>
        <el-dropdown-item command="uninstall">
          {{ $t('Plugins.uninstall') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableDropdown',
})
</script>

<script setup lang="ts">
import { PluginItem } from '@/types/plugin'
import { defineProps, defineEmits, PropType, ref, Ref } from 'vue'
import { CaretBottom } from '@element-plus/icons-vue'

const props = defineProps({
  rowData: {
    required: true,
    type: Object as PropType<PluginItem>,
  },
  filtered: {
    type: Boolean,
  },
})

const emit = defineEmits(['moveToTop', 'moveToBottom', 'uninstall'])

const dropdownVisible: Ref<boolean> = ref(false)

const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const handleCommand = function (row: PluginItem, command: string) {
  switch (command) {
    case 'top':
      if (!props.filtered) {
        emit('moveToTop', row)
      }
      break
    case 'bottom':
      if (!props.filtered) {
        emit('moveToBottom', row)
      }
      break
    case 'uninstall':
      emit('uninstall', row)
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
.dropdown-btn {
  padding: 1px 9px;
  & > :deep(span) {
    display: flex;
    align-items: center;
  }
}
.icon-arrow {
  vertical-align: top;
  margin-left: 4px;
  &.rotate {
    transform: rotate(180deg);
  }
}
.el-dropdown-menu__item.danger {
  color: #e34242;
}
.el-dropdown-menu__item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
