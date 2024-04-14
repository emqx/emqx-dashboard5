<template>
  <el-dropdown class="client-field-select" @visible-change="dropdownVisibleChanged">
    <el-button class="table-dropdown-btn" type="primary" plain>
      <el-icon><Setting /></el-icon>
      <span>
        {{ t('Base.selectColumn') }}
      </span>
    </el-button>
    <template #dropdown>
      <div class="client-field-select-dropdown">
        <el-checkbox-group :model-value="checkList" @update:model-value="handleChanged">
          <el-checkbox
            v-for="{ label, value } in fieldOpts"
            :key="value"
            :label="value"
            :value="value"
          >
            {{ label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { Setting } from '@element-plus/icons-vue'
import { computed, defineEmits, defineProps, ref, Ref } from 'vue'
import useClientFields from '@/hooks/Clients/useClientFields'

const { t, tl } = useI18nTl('Clients')

const props = defineProps<{
  modelValue: Array<string>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<string>): void
}>()

const dropdownVisible: Ref<boolean> = ref(false)

const dropdownVisibleChanged = (value: boolean) => {
  dropdownVisible.value = value
}

const checkList = computed({
  get() {
    return props.modelValue
  },
  set(value: Array<string>) {
    emit('update:modelValue', value)
  },
})

const { clientFields, getBaseLabel } = useClientFields()
const fieldOpts = Object.entries(clientFields).reduce(
  (arr: Array<{ label: string; value: string }>, [, fieldArr]) => {
    fieldArr.forEach((field) => {
      if (field === 'proto_type') {
        return
      }
      arr.push({ label: getBaseLabel(field), value: field })
    })
    return arr
  },
  [{ label: tl('connectedStatus'), value: 'connected' }],
)
const fieldOptIndex = fieldOpts.reduce((map, { value }, index) => {
  map.set(value, index)
  return map
}, new Map<string, number>())

// The checklist is not in order, so reorder it.
const handleChanged = (value: Array<string>) => {
  checkList.value = value.sort(
    (a, b) => (fieldOptIndex.get(a) ?? 99) - (fieldOptIndex.get(b) ?? 99),
  )
}
</script>

<style lang="scss">
.table-dropdown-btn {
  // FIXME: style of plain primary button
  height: 30px;
}
.client-field-select-dropdown {
  padding: 12px 20px 0px;
  .el-checkbox {
    display: block;
  }
}
</style>
