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
      <el-icon :size="8" class="icon-arrow" :class="{ rotate: dropdownVisible }">
        <CaretBottom />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item command="resetStatistics">
          {{ tl('resetStatistics') }}
        </el-dropdown-item> -->
        <el-dropdown-item command="copy">
          {{ tl('copy') }}
        </el-dropdown-item>
        <el-dropdown-item command="delete" class="danger">
          {{ tl('delete', 'Base') }}
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
import { CaretBottom } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const props = defineProps({
  rowData: {
    required: true,
    type: Object as PropType<PluginItem>,
  },
})

const emit = defineEmits(['resetStatistics', 'copy', 'delete'])

const dropdownVisible: Ref<boolean> = ref(false)

const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const handleCommand = function (row: PluginItem, command: 'resetStatistics' | 'copy' | 'delete') {
  emit(command, row)
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
