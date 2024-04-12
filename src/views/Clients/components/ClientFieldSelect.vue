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
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="{ label, value } in fieldOpts"
            :key="value"
            :label="label"
            :value="value"
          />
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
</script>

<style lang="scss">
.client-field-select-dropdown {
  padding: 12px 20px 0px;
  .el-checkbox {
    display: block;
  }
}
</style>
