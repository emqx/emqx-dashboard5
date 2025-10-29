<template>
  <el-dialog v-model="isDialogVisible" width="500" destroy-on-close>
    <CertBundleInfo v-if="name" :name="name" :namespace="namespace" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="isDialogVisible = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import CertBundleInfo from './CertBundleInfo.vue'

const props = defineProps<{
  modelValue: boolean
  name: string
  namespace?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const isDialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
