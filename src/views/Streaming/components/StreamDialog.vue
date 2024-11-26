<template>
  <el-dialog v-model="showDialog" :title="`TODO:`"></el-dialog>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss"></style>
