<template>
  <el-dropdown class="table-dropdown" @command="handleCommand(rowData, $event)">
    <el-button class="dropdown-btn" size="small">
      {{ $t('Base.more') }}
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="top">
          {{ $t('Plugins.moveToTop') }}
        </el-dropdown-item>
        <el-dropdown-item command="bottom">
          {{ $t('Plugins.moveToBottom') }}
        </el-dropdown-item>
        <el-dropdown-item command="delete">
          {{ $t('Base.delete') }}
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
import { Exhook } from '@/types/systemModule'
import { defineProps, defineEmits, PropType } from 'vue'

const props = defineProps({
  rowData: {
    required: true,
    type: Object as PropType<Exhook>,
  },
})

const emit = defineEmits(['moveToTop', 'moveToBottom', 'delete'])

const handleCommand = function (row: Exhook, command: string) {
  switch (command) {
    case 'top':
      emit('moveToTop', row)
      break
    case 'bottom':
      emit('moveToBottom', row)
      break
    case 'delete':
      emit('delete', row)
      break
    default:
      break
  }
}
</script>

<style scoped>
.dropdown-btn {
  padding: 1px 9px;
}
.el-dropdown-menu__item.danger {
  color: #e34242;
}
</style>
