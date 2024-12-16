<template>
  <el-input-number
    v-model="num"
    class="custom-input-number"
    :class="{ 'is-focus': isFocus }"
    :controls-position="controlsPosition"
    :disabled="disabled"
    :placeholder="placeholder"
    :min="min"
    :max="max"
    @focus="handleFocus"
    @blur="handleBlur"
    @keypress="handleKeypress"
  />
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
  },
  controlsPosition: {
    type: String as PropType<'right' | ''>,
    default: 'right',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
  },
  min: {
    type: Number,
  },
  max: {
    type: Number,
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
const handleKeypress = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.which || event.keyCode)
  if (!/[\d.e+-]/.test(char) && !event.metaKey && !event.ctrlKey) {
    event.preventDefault()
  }
}
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
