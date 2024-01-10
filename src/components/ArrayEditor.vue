<template>
  <el-select
    v-if="mode === 'select'"
    class="array-editor"
    v-model="selectedValue"
    multiple
    filterable
    allow-create
    default-first-option
    :reserve-keyword="false"
    :disabled="disabled"
  >
    <el-option v-for="item in options" :key="item" :value="item" :label="item" />
  </el-select>
  <el-input
    v-else-if="mode === 'input'"
    v-model="inputValue"
    class="array-editor"
    type="textarea"
    :rows="2"
    :disabled="disabled"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ArrayEditor',
})
</script>

<script setup lang="ts">
import { defineProps, computed, PropType, WritableComputedRef, defineEmits } from 'vue'

const props = defineProps({
  mode: {
    type: String as PropType<'select' | 'input'>,
    default: 'select',
  },
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
})
const emit = defineEmits(['update:modelValue'])

const options = computed(() => {
  if (props.default && Array.isArray(props.default)) {
    return props.default
  }
  return props.modelValue
})

const selectedValue: WritableComputedRef<Array<string>> = computed({
  get() {
    return props.modelValue || []
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const inputValue: WritableComputedRef<string | undefined> = computed({
  get() {
    if (props.mode === 'input') {
      return props.modelValue?.join(',')
    }
    return '' // default value
  },
  set(val) {
    if (props.mode === 'input') {
      emit('update:modelValue', val?.split(','))
    }
  },
})
</script>
