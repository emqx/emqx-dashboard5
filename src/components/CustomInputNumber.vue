<template>
  <el-input-number
    v-model="num"
    class="custom-input-number"
    :class="{ 'is-focus': isFocus }"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
  },
})

const emit = defineEmits(['update:modelValue'])

const num = computed({
  get: () => {
    const { modelValue } = props
    if (typeof modelValue === 'string') {
      return !Number.isNaN(Number(modelValue)) ? Number(modelValue) : undefined
    }
    return modelValue
  },
  set: (val) => emit('update:modelValue', val),
})
const isFocus = ref(false)

const handleFocus = () => (isFocus.value = true)
const handleBlur = () => (isFocus.value = false)
</script>

<style lang="scss">
.custom-input-number {
  &.el-input-number.is-controls-right {
    span[role='button'] {
      visibility: hidden;
    }
    &:hover,
    &.is-focus {
      span[role='button'] {
        visibility: visible;
      }
    }
  }
}
</style>
