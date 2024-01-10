<template>
  <el-select
    class="array-editor"
    v-model="selected"
    multiple
    filterable
    allow-create
    default-first-option
    :reserve-keyword="false"
    :disabled="disabled"
  >
    <el-option v-for="item in options" :key="item" :value="item" :label="item" />
  </el-select>
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

const selected: WritableComputedRef<Array<string>> = computed({
  get() {
    return props.modelValue || []
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>
