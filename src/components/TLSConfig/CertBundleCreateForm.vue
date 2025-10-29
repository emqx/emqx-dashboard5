<template>
  <el-form
    ref="formRef"
    :model="record"
    :rules="rules"
    v-loading="isLoading"
    label-position="top"
    class="cert-bundle-create-form"
  >
    <el-form-item :label="t('Base.name')" prop="name">
      <!-- TODO: rule for name -->
      <el-input v-model.trim="record.name" />
    </el-form-item>
    <el-form-item :label="t('BasicConfig.namespace')" prop="namespace">
      <div class="flex flex-1 items-center gap-2">
        <el-switch v-model="isNamespaceEnabled" />
        <el-select v-if="isNamespaceEnabled" v-model="record.namespace" class="flex-1">
          <el-option v-for="item in namespaceOptions" :key="item" :value="item" :label="item" />
        </el-select>
      </div>
    </el-form-item>
    <el-form-item prop="chain">
      <template #label>
        <span>TLS Cert</span>
        <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'TLS Cert' })" />
      </template>
      <TextareaWithUploader
        class="TLS-input"
        v-model="record.chain"
        :accept="CER_FILE_ACCEPTS"
        :placeholder="t('Base.certPlaceholder')"
      />
    </el-form-item>
    <el-form-item prop="key">
      <template #label>
        <span>TLS Key</span>
        <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'TLS Key' })" />
      </template>
      <TextareaWithUploader
        class="TLS-input"
        v-model="record.key"
        :accept="CER_FILE_ACCEPTS"
        :placeholder="t('Base.keyFilePlaceholder')"
      />
    </el-form-item>
    <el-form-item prop="ca">
      <template #label>
        <span>CA Cert</span>
        <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'CA Cert' })" />
      </template>

      <TextareaWithUploader
        class="TLS-input"
        v-model="record.ca"
        :accept="CER_FILE_ACCEPTS"
        :placeholder="t('Base.certPlaceholder')"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getManagedNamespaceList } from '@/api/config'
import { CertBundleForm } from '@/hooks/useCertBundle'
import type { FormInstance } from 'element-plus'

const props = defineProps<{
  modelValue: CertBundleForm
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: CertBundleForm): void
}>()

const record = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const { t } = useI18n()

const formRef = useTemplateRef<FormInstance>('formRef')

const { createRequiredRule, createCommonIdRule } = useFormRules()
const rules = {
  name: [...createRequiredRule(t('Base.name')), ...createCommonIdRule()],
  namespace: {
    validator(_: any, value: string, callback: (error?: Error) => void) {
      if (value !== undefined && !value) {
        callback(
          new Error(t('Rule.selectFieldRequiredError', { name: t('BasicConfig.namespace') })),
        )
      } else {
        callback()
      }
    },
    trigger: 'blur',
  },
}

const isNamespaceEnabled = computed({
  get() {
    return record.value.namespace !== undefined
  },
  set(val) {
    if (val && record.value.namespace === undefined) {
      record.value.namespace = ''
    } else if (!val && record.value.namespace !== undefined) {
      record.value.namespace = undefined
    }
  },
})

const isLoading = ref(false)
const namespaceOptions = ref<Array<string>>([])
const queryNamespaceList = async () => {
  try {
    isLoading.value = true
    const res = await getManagedNamespaceList({ limit: 10000 })
    namespaceOptions.value = res
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
queryNamespaceList()

const validate = () => formRef.value?.validate()

defineExpose({ validate })
</script>

<style lang="scss">
.cert-bundle-create-form {
  .TLS-input {
    width: 100%;
  }
}
</style>
