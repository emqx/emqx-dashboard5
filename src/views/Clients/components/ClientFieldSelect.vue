<template>
  <el-dropdown
    ref="DropdownCom"
    class="client-field-select"
    @visible-change="dropdownVisibleChanged"
  >
    <el-button type="primary" plain>
      <el-icon><Setting /></el-icon>
      <span>
        {{ t('Base.selectColumn') }}
      </span>
    </el-button>
    <template #dropdown>
      <div class="client-field-select-dropdown">
        <el-scrollbar max-height="320px">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="{ label, value } in fieldOpts"
              :key="value"
              :label="value"
              :value="value"
            >
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
        <div class="dropdown-ft">
          <el-button link type="primary" @click="confirm">{{ t('Base.confirm') }}</el-button>
          <el-button link @click="reset">{{ t('Base.reset') }}</el-button>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { DEFAULT_CLIENT_TABLE_COLUMNS } from '@/common/constants'
import useClientFields from '@/hooks/Clients/useClientFields'
import useI18nTl from '@/hooks/useI18nTl'
import { Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { isEqual } from 'lodash'
import { defineEmits, defineProps, ref, watch } from 'vue'

const { t, tl } = useI18nTl('Clients')

const props = defineProps<{
  selected: Array<string>
}>()

const emit = defineEmits<{
  (e: 'change', value: Array<string>): void
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

const customFieldIndexMap = DEFAULT_CLIENT_TABLE_COLUMNS.reduce(
  (map: Map<string, number>, item: string, index: number) => {
    map.set(item, index)
    return map
  },
  new Map(),
)
const { clientFields, getBaseLabel } = useClientFields()
const fieldOpts = Object.entries(clientFields)
  .reduce(
    (arr: Array<{ label: string; value: string }>, [, fieldArr]) => {
      fieldArr.forEach((field) => {
        if (['proto_type', 'listener'].includes(field)) {
          return
        }
        arr.push({ label: getBaseLabel(field), value: field })
      })
      return arr
    },
    [{ label: tl('connectedStatus'), value: 'connected' }],
  )
  .sort((a, b) => {
    const aIndex = customFieldIndexMap.get(a.value) ?? 99
    const bIndex = customFieldIndexMap.get(b.value) ?? 99
    return aIndex - bIndex
  })
const fieldOptIndex = fieldOpts.reduce((map, { value }, index) => {
  map.set(value, index)
  return map
}, new Map<string, number>())

const DropdownCom = ref()
const confirm = () => {
  if (!checkList.value.length) {
    ElMessage.warning(t('Base.oneColumnRequired'))
    return
  }
  // The checklist is not in order, so reorder it.
  const list = checkList.value.sort(
    (a, b) => (fieldOptIndex.get(a) ?? 99) - (fieldOptIndex.get(b) ?? 99),
  )
  emit('change', list)
  DropdownCom.value?.handleClose?.()
}

const reset = () => {
  emit('change', [...DEFAULT_CLIENT_TABLE_COLUMNS])
  DropdownCom.value?.handleClose?.()
}
</script>

<style lang="scss">
.client-field-select-dropdown {
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
