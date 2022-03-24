<template>
  <div class="table-dropdown">
    <el-button size="small" @click="$emit('setting', rowData)">
      {{ $t('Base.setting') }}
    </el-button>
    <el-button size="small" @click="$emit('update', { ...rowData, enable: !rowData.enable })">
      {{ rowData.enable ? $t('Base.disable') : $t('Base.enable') }}
    </el-button>
    <el-dropdown
      class="table-dropdown-more"
      @command="handleCommand(rowData, $event)"
      @visible-change="dropdownVisibleChanged"
    >
      <el-button class="dropdown-btn" size="small">
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
              <el-icon><Top /></el-icon>
              {{ $t('Auth.moveUp') }}
            </el-dropdown-item>
            <el-dropdown-item command="moveDown" :disabled="position === tableDataLen - 1">
              <el-icon><Bottom /></el-icon>
              {{ $t('Auth.moveDown') }}
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
import { Top, Bottom, Delete, CaretBottom } from '@element-plus/icons-vue'
import { AuthnItem } from '@/types/auth'

export default defineComponent({
  name: 'TableDropdown',
  components: { Top, Bottom, Delete, CaretBottom },
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
  emits: ['setting', 'delete', 'move', 'update'],
  setup(props, ctx) {
    const dropdownVisible = ref<boolean>(false)
    const dropdownVisibleChanged = (value: boolean) => {
      dropdownVisible.value = value
    }
    const handleCommand = function (row: AuthnItem, command: 'delete' | 'moveUp' | 'moveDown') {
      switch (command) {
        case 'delete':
          ctx.emit('delete', row)
          break
        case 'moveUp':
          ctx.emit('move', 'up')
          break
        case 'moveDown':
          ctx.emit('move', 'down')
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

<style lang="scss" scoped>
.dropdown-btn {
  padding: 1px 6px;
}
.el-dropdown-menu__item.danger {
  color: #e34242;
}
.table-dropdown-more {
  .icon-arrow {
    vertical-align: top;
    margin-left: 4px;
    &.rotate {
      transform: rotate(180deg);
    }
  }
}
</style>
