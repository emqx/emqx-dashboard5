<template>
  <el-dropdown
    ref="DropdownCom"
    class="table-column-select"
    @visible-change="dropdownVisibleChanged"
  >
    <el-button>
      <Columns3 class="mr-2" />
      {{ tl('selectColumn') }}
    </el-button>
    <template #dropdown>
      <div class="table-column-select-dropdown">
        <el-scrollbar max-height="320px">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="{ label, value } in columnOptions"
              :key="value"
              :label="value"
              :value="value"
            >
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
        <div class="dropdown-ft flex justify-end">
          <el-button link @click="reset">{{ tl('reset') }}</el-button>
          <el-button link type="primary" @click="confirm">{{ tl('confirm') }}</el-button>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { Columns3 } from 'lucide-vue-next'

const { tl } = useI18nTl('Base')

const props = defineProps<{
  selected: Array<string>
  columnOptions: Array<{ label: string; value: string }>
}>()

const emit = defineEmits<{
  (e: 'change', value: Array<string>): void
  (e: 'reset'): void
}>()

const checkList = ref([...props.selected])
const dropdownVisibleChanged = (value: boolean) => {
  if (value) {
    checkList.value = [...props.selected]
  }
}
watch(
  () => props.selected,
  (value) => {
    if (!isEqual(value, checkList.value)) {
      checkList.value = [...value]
    }
  },
)

const DropdownCom = ref()
const confirm = () => {
  if (!checkList.value.length) {
    ElMessage.warning(tl('oneColumnRequired'))
    return
  }
  emit('change', checkList.value)
  DropdownCom.value?.handleClose?.()
}

const reset = () => {
  emit('reset')
  DropdownCom.value?.handleClose?.()
}
</script>

<style lang="scss">
.table-column-select-dropdown {
  padding: 4px;
  .el-scrollbar__view {
    padding: 20px 20px 4px;
  }
  .el-checkbox {
    display: block;
  }
  .dropdown-ft {
    padding: 8px 18px 8px;
    border-top: 1px solid var(--color-border-card);
    .el-button {
      margin-right: 8px;
    }
  }
}
</style>
