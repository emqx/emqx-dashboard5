<template>
  <p class="value" v-if="readonly">
    {{ Array.isArray(modelValue) ? modelValue.join(', ') : modelValue }}
  </p>
  <el-input-tag
    v-else
    class="array-editor"
    v-model="selected"
    :disabled="disabled"
    :placeholder="$t('Base.enterToCreate')"
    @add-tag="checkDuplicate"
  >
    <template #tag="{ value }">
      <CommonOverflowTooltip :content="value" />
    </template>
  </el-input-tag>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'

import CommonOverflowTooltip from './CommonOverflowTooltip.vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<string>>,
  },
  default: {
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  allowDuplicates: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const selected: WritableComputedRef<Array<string>> = computed({
  get() {
    return props.modelValue || []
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { tl } = useI18nTl('Base')
const checkDuplicate = async (tag: string) => {
  if (props.allowDuplicates) {
    return
  }
  const isDuplicated = selected.value.some((item) => item === tag)
  if (isDuplicated) {
    ElMessage({ type: 'info', message: tl('duplicatedInput'), duration: 1000 })
    await nextTick()
    selected.value = selected.value.slice(0, -1)
  }
}
</script>

<style lang="scss">
.array-editor {
  width: 100%;
  .el-tag {
    max-width: 100px;
    .el-tag__content {
      max-width: 64px;
    }
    .overflow-tooltip {
      min-width: 100%;
    }
  }
}
</style>
