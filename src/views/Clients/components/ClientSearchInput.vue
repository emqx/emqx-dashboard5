<template>
  <div class="client-search-input el-input-group el-input-group--prepend">
    <div class="el-input-group__prepend">
      <el-select :model-value="searchType" @update:model-value="changeSearchType">
        <el-option :label="tl('exactQuery')" :value="SearchType.Exact" />
        <el-option :label="tl('fuzzySearch')" :value="SearchType.Fuzzy" />
      </el-select>
    </div>
    <el-input-tag
      v-if="searchType === SearchType.Exact"
      :model-value="exactValues"
      :placeholder="placeholder"
      clearable
      @update:model-value="emit('update:modelValue', $event ?? [])"
      @keydown.enter.capture="handleTagEnter"
      @keyup.enter.stop="handleTagEnterUp"
      @clear="emit('search')"
    >
      <template #suffix>
        <InfoTooltip :content="tl('exactSearchTip')" />
      </template>
    </el-input-tag>
    <el-input
      v-else
      :model-value="fuzzyValue"
      :placeholder="placeholder"
      clearable
      @update:model-value="emit('update:modelValue', $event)"
      @clear="emit('search')"
    />
  </div>
</template>

<script setup lang="ts">
import { ClientListSearchType as SearchType } from '@/types/enum'
import InfoTooltip from '@/components/InfoTooltip.vue'

const props = defineProps<{
  modelValue?: string | string[]
  searchType: SearchType
  placeholder: string
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | string[]): void
  (event: 'update:searchType', value: SearchType): void
  (event: 'search'): void
}>()
const { tl } = useI18nTl('Clients')
const exactValues = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : [],
)
const fuzzyValue = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue.join(',') : props.modelValue,
)
const changeSearchType = (value: SearchType) => {
  emit(
    'update:modelValue',
    value === SearchType.Exact ? exactValues.value : (fuzzyValue.value ?? ''),
  )
  emit('update:searchType', value)
}

let addingTag = false
const handleTagEnter = (event: KeyboardEvent) => {
  // InputTag clears its draft on keydown; remember it until the form's keyup search.
  addingTag = event.isComposing || !!(event.target as HTMLInputElement).value
}
const handleTagEnterUp = (event: KeyboardEvent) => {
  if (!addingTag && !event.isComposing) emit('search')
}
</script>

<style lang="scss" scoped>
.client-search-input {
  --el-input-border-radius: var(--el-border-radius-base);

  display: flex;
  align-items: stretch;

  > .el-input,
  > .el-input-tag {
    flex: 1;
    min-width: 0;
    width: 0;
  }

  > .el-input-tag,
  :deep(.el-input__wrapper) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
