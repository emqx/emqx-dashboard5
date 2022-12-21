<template>
  <el-dropdown
    @command="handleCommand(rowData, $event)"
    @visible-change="dropdownVisibleChanged"
    popper-class="table-dropdown-popper"
  >
    <el-button class="table-dropdown-btn" size="small">
      <span>
        {{ $t('Base.more') }}
      </span>
      <el-icon :size="8" class="icon-arrow" :class="{ rotate: dropdownVisible }">
        <CaretBottom />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="up" :disabled="rowIndex === 0">
          <el-icon><ArrowUp /></el-icon>
          <span>{{ $t('Base.up') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="down" :disabled="rowIndex === tableLen - 1">
          <el-icon><ArrowDown /></el-icon>
          <span>{{ $t('Base.down') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="top" :class="{ disabled: filtered }" :disabled="rowIndex === 0">
          <el-icon><Top /></el-icon>
          <span>{{ $t('Plugins.moveToTop') }}</span>
        </el-dropdown-item>
        <el-dropdown-item
          command="bottom"
          :class="{ disabled: filtered }"
          :disabled="rowIndex === tableLen - 1"
        >
          <el-icon><Bottom /></el-icon>
          <span>{{ $t('Plugins.moveToBottom') }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="uninstall">
          <el-icon><Delete /></el-icon>
          <span>{{ $t('Plugins.uninstall') }}</span>
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
import { CaretBottom, ArrowUp, ArrowDown, Top, Bottom, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  rowData: {
    required: true,
    type: Object as PropType<PluginItem>,
  },
  filtered: {
    type: Boolean,
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

const emit = defineEmits(['moveToTop', 'moveToBottom', 'uninstall', 'moveUp', 'moveDown'])

const dropdownVisible: Ref<boolean> = ref(false)

const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const handleCommand = function (row: PluginItem, command: string) {
  switch (command) {
    case 'up':
      emit('moveUp', row)
      break
    case 'down':
      emit('moveDown', row)
      break
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
