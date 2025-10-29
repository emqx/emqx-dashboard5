<template>
  <!-- TODO: check before-close logic -->
  <el-drawer
    v-model="isDrawerShow"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <template #default>
      <CertBundleCreateForm v-model="formData" />
    </template>
    <template #footer>
      <CancelButton @click="isDrawerShow = false" :disabled="isSubmitting" />
      <el-button type="primary" :loading="isSubmitting" @click="submit">
        {{ t('Base.create') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { CertBundleForm } from '@/hooks/useCertBundle'
import CertBundleCreateForm from './CertBundleCreateForm.vue'

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { t } = useI18n()

const isDrawerShow = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const { createEmptyCertBundleForm } = useCertBundle()
const formData = ref<CertBundleForm>(createEmptyCertBundleForm())

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const isSubmitting = ref(false)
const { submitNewCertBundle } = useCertBundle()
const submit = async () => {
  try {
    isSubmitting.value = true
    await submitNewCertBundle(formData.value)
    ElMessage.success(t('Base.createSuccess'))
    isDrawerShow.value = false
  } catch (error) {
    //
  }
}
</script>
