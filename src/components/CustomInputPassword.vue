<template>
  <el-input
    v-model="password"
    autocomplete="one-time-code"
    v-bind="$attrs"
    :disabled="disabled"
    :placeholder="placeholder"
    :clearable="clearable"
    :type="isPassword ? 'password' : 'text'"
    :show-password="isPassword"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  placeholder?: string
  clearable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void
}>()

const password = computed({
  get: () => props.modelValue ?? '',
  set: (value) => emit('update:modelValue', value),
})

const encryptedPasswordRegex = /^\*{6}$/
const fileRegex = /^file:\/\//
const isPassword = computed(() => {
  return !encryptedPasswordRegex.test(password.value) && !fileRegex.test(password.value)
})
</script>
