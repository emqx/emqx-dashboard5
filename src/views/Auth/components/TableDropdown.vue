<template>
  <div class="table-dropdown">
    <el-button size="small" @click="$emit('setting', rowData)">
      {{ $t('Base.setting') }}
    </el-button>
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
          <template v-if="tableDataLen !== 1">
            <el-dropdown-item command="moveUp" :disabled="position === 0">
              <el-icon><ArrowUp /></el-icon>
              {{ $t('Base.up') }}
            </el-dropdown-item>
            <el-dropdown-item command="moveDown" :disabled="position === tableDataLen - 1">
              <el-icon><ArrowDown /></el-icon>
              {{ $t('Base.down') }}
            </el-dropdown-item>
            <el-dropdown-item command="moveToTop" :disabled="position === 0">
              <el-icon><Top /></el-icon>
              {{ $t('Base.moveToTop') }}
            </el-dropdown-item>
            <el-dropdown-item command="moveToBottom" :disabled="position === tableDataLen - 1">
              <el-icon><Bottom /></el-icon>
              {{ $t('Base.moveToBottom') }}
            </el-dropdown-item>
          </template>
          <el-dropdown-item class="danger" command="delete">
            <el-icon><Delete /></el-icon>
            {{ $t('Base.delete') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { Top, Bottom, Delete, CaretBottom, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { AuthnItem } from '@/types/auth'

export default defineComponent({
  name: 'TableDropdown',
  components: { Top, Bottom, Delete, CaretBottom, ArrowUp, ArrowDown },
  props: {
    tableDataLen: {
      required: true,
      type: Number,
    },
    rowData: {
      required: true,
      type: Object as PropType<AuthnItem>,
    },
    position: {
      required: true,
      type: Number,
    },
  },
  emits: ['setting', 'delete', 'move-up', 'move-down', 'move-to-top', 'move-to-bottom'],
  setup(props, ctx) {
    const dropdownVisible = ref<boolean>(false)
    const dropdownVisibleChanged = (value: boolean) => {
      dropdownVisible.value = value
    }

    const handleCommand = function (
      row: AuthnItem,
      command: 'delete' | 'moveToTop' | 'moveToBottom' | 'moveUp' | 'moveDown',
    ) {
      switch (command) {
        case 'delete':
          ctx.emit('delete', row)
          break
        case 'moveUp':
          ctx.emit('move-up')
          break
        case 'moveDown':
          ctx.emit('move-down')
          break
        case 'moveToTop':
          ctx.emit('move-to-top')
          break
        case 'moveToBottom':
          ctx.emit('move-to-bottom')
          break
        default:
          break
      }
    }
    return {
      dropdownVisible,
      dropdownVisibleChanged,
      handleCommand,
    }
  },
})
</script>
