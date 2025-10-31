<template>
  <!-- TODO: check before-close logic -->
  <el-drawer
    v-model="isDrawerShow"
    destroy-on-close
    :close-on-click-modal="false"
    :title="title"
    @open="handleOpen"
    @close="handleClose"
  >
    <template #default>
      <!-- For correct init CertFileInput component-->
      <div class="placeholder h-96" v-if="isLoading" :loading="isLoading"></div>
      <CertBundleCreateForm v-else ref="formRef" v-model="formData" :is-editing="isEditing" />
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
import { CertBundleIn, ManagedCerts } from '@/types/typeAlias'
import type { FormInstance } from 'element-plus'
import CertBundleCreateForm from './CertBundleForm.vue'

const props = defineProps<{
  modelValue: boolean
  bundleName?: string
  namespace?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: ManagedCerts): void
}>()

const { t } = useI18n()

const title = computed(() =>
  props.bundleName ? t('Base.editManagedCerts') : t('Base.createManagedCerts'),
)

const isDrawerShow = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const isEditing = computed(() => !!props.bundleName)

const { createEmptyCertBundleForm, getCertBundleInfo: queryBundleInfo } = useCertBundle()
const formData = ref<CertBundleForm>(createEmptyCertBundleForm())

const formRef = useTemplateRef<FormInstance>('formRef')

const isLoading = ref(false)
const getBundleInfo = async () => {
  if (!props.bundleName) {
    return
  }
  try {
    isLoading.value = true
    const info = await queryBundleInfo(props.bundleName, props.namespace)
    const infoKeys = Object.keys(info) as (keyof CertBundleIn)[]
    const bundleInfo = infoKeys.reduce((acc: CertBundleIn, key): CertBundleIn => {
      if (info[key]) {
        acc[key] = info[key].path
      }
      return acc
    }, {})
    formData.value = {
      name: props.bundleName,
      namespace: props.namespace,
      ...bundleInfo,
    }
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const handleOpen = () => {
  if (props.bundleName) {
    getBundleInfo()
  } else if (props.namespace) {
    formData.value.namespace = props.namespace
  }
}

const handleClose = async () => {
  //  TODO: check before-close logic
  isLoading.value = false
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
