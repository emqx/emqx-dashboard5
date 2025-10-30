<template>
  <!-- TODO: check before-close logic -->
  <el-drawer
    v-model="isDrawerShow"
    destroy-on-close
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleClose"
  >
    <template #default>
      <CertBundleCreateForm ref="formRef" v-model="formData" />
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
import { ManagedCerts } from '@/types/typeAlias'
import type { FormInstance } from 'element-plus'
import CertBundleCreateForm from './CertBundleCreateForm.vue'

const props = defineProps<{
  modelValue: boolean
  namespace?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: ManagedCerts): void
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

const formRef = useTemplateRef<FormInstance>('formRef')

const handleOpen = () => {
  if (props.namespace) {
    formData.value.namespace = props.namespace
  }
}

const handleClose = async () => {
  //  TODO: check before-close logic
  await waitAMoment(500)
  formData.value = createEmptyCertBundleForm()
}

const isSubmitting = ref(false)
const { submitNewCertBundle } = useCertBundle()
const submit = async () => {
  try {
    await formRef.value?.validate()
    isSubmitting.value = true
    await submitNewCertBundle(formData.value)
    ElMessage.success(t('Base.createSuccess'))
    emit('submit', { namespace: formData.value.namespace, bundle_name: formData.value.name })
    isDrawerShow.value = false
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>
