<template>
  <div class="table-dropdown">
    <TableButton v-if="isAuthItem" @click="$emit('setting', rowData, 'settings')">
      {{ $t('Base.setting') }}
    </TableButton>
    <el-dropdown
      @command="handleCommand(rowData, $event)"
      @visible-change="dropdownVisibleChanged"
      popper-class="table-dropdown-popper"
    >
      <TableButton class="table-dropdown-btn">
        <span>
          {{ $t('Base.more') }}
        </span>
        <el-icon :size="8" class="icon-arrow" :class="{ rotate: dropdownVisible }">
          <CaretBottom />
        </el-icon>
      </TableButton>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="moveUp" :disabled="position === 0 || !$hasPermission('put')">
            <ChevronUp class="w-4 h-4 mr-2" />
            {{ $t('Base.up') }}
          </el-dropdown-item>
          <el-dropdown-item
            command="moveDown"
            :disabled="position === tableDataLen - 1 || !$hasPermission('put')"
          >
            <ChevronDown class="w-4 h-4 mr-2" />
            {{ $t('Base.down') }}
          </el-dropdown-item>
          <el-dropdown-item
            command="moveToTop"
            :disabled="position === 0 || !$hasPermission('put')"
          >
            <ChevronsUp class="w-4 h-4 mr-2" />
            {{ $t('Base.moveToTop') }}
          </el-dropdown-item>
          <el-dropdown-item
            command="moveToBottom"
            :disabled="position === tableDataLen - 1 || !$hasPermission('put')"
          >
            <ChevronsDown class="w-4 h-4 mr-2" />
            {{ $t('Base.moveToBottom') }}
          </el-dropdown-item>
          <el-dropdown-item
            :disabled="!$hasPermission('delete')"
            command="delete"
            v-if="isAuthItem"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            {{ $t('Base.delete') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { AuthnItem } from '@/types/auth'
import { CaretBottom } from '@element-plus/icons-vue'
import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp, Trash2 } from 'lucide-vue-next'

export default defineComponent({
  name: 'TableDropdown',
  components: { CaretBottom, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, Trash2 },
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
    /**
     * for auth item, show setting and delete button
     */
    isAuthItem: {
      type: Boolean,
      default: true,
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
