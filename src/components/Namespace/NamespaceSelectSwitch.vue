<template>
  <div class="flex flex-1 items-center gap-2">
    <el-switch v-model="isNamespaceEnabled" :disabled="disabled" />
    <NamespaceSelect
      v-if="isNamespaceEnabled"
      v-model="namespace"
      class="flex-1"
      :disabled="disabled"
      :global="{ enable: false }"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  disabled?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: string | undefined): void
}>()

const namespace = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const isNamespaceEnabled = computed({
  get() {
    return namespace.value !== undefined
  },
  set(val) {
    if (val && namespace.value === undefined) {
      namespace.value = ''
    } else if (!val && namespace.value !== undefined) {
      namespace.value = undefined
    }
  },
})
</script>
