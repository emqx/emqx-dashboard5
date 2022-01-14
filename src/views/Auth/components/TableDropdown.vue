<template>
  <el-dropdown class="table-dropdown" @command="handleCommand(rowData, $event)">
    <el-button class="dropdown-btn" size="mini">
      <el-icon><More /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="setting">
          <el-icon><Setting /></el-icon>
          {{ $t('Auth.setting') }}
        </el-dropdown-item>
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
        <el-dropdown-item v-if="rowData.enable" class="danger" command="disable">
          <el-icon><SwitchButton /></el-icon>
          {{ $t('Auth.disable') }}
        </el-dropdown-item>
        <el-dropdown-item v-else command="enable">
          <el-icon><VideoPlay /></el-icon>
          {{ $t('Auth.enable') }}
        </el-dropdown-item>
        <el-dropdown-item command="delete">
          <el-icon><Delete /></el-icon>
          {{ $t('Base.delete') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { defineComponent } from 'vue'
import {
  Setting,
  More,
  Top,
  Bottom,
  SwitchButton,
  VideoPlay,
  Delete,
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'TableDropdown',
  components: { Setting, More, Top, Bottom, SwitchButton, VideoPlay, Delete },
  props: {
    tableDataLen: {
      required: true,
      type: Number,
    },
    rowData: {
      required: true,
      type: Object,
    },
    position: {
      required: true,
      type: Number,
    },
  },
  emits: ['setting', 'delete', 'move', 'update'],
  setup(props, ctx) {
    const handleCommand = function (row, command) {
      switch (command) {
        case 'setting':
          ctx.emit('setting', row)
          break
        case 'disable':
          ctx.emit('update', { ...row, enable: false })
          break
        case 'enable':
          ctx.emit('update', { ...row, enable: true })
          break
        case 'delete':
          ctx.emit('delete', row)
          break
        case 'moveUp':
          ctx.emit('move', row, 'top')
          break
        case 'moveDown':
          ctx.emit('move', row, 'bottom')
          break
        default:
          break
      }
    }
    return {
      handleCommand,
    }
  },
})
</script>

<style scoped>
.dropdown-btn {
  padding: 1px 6px;
}
.el-dropdown-menu__item.danger {
  color: #e34242;
}
</style>
