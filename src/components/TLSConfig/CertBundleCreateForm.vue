<template>
  <el-form ref="formRef" :model="record" :rules="rules" v-loading="isLoading">
    <el-form-item :label="t('Base.name')" prop="name">
      <!-- TODO: rule for name -->
      <el-input v-model="record.name" />
    </el-form-item>
    <el-form-item :label="t('BasicConfig.namespace')" prop="namespace">
      <div class="vertical-align-center">
        <el-switch v-model="isNamespaceEnabled" />
        <el-select v-if="isNamespaceEnabled" v-model="record.namespace">
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
import { CertBundleIn } from '@/types/typeAlias'
import type { FormInstance } from 'element-plus'
import { getManagedNamespaceList } from '@/api/config'

interface CertBundleForm extends CertBundleIn {
  name: string
  namespace?: string
}

const { t } = useI18n()

const formRef = useTemplateRef<FormInstance>('formRef')

const { createEmptyCertBundle } = useCertBundle()
const record = ref<CertBundleForm>({ name: '', ...createEmptyCertBundle() })

const { createRequiredRule } = useFormRules()
const rules = {
  name: createRequiredRule(t('Base.name')),
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
  },
}

const isNamespaceEnabled = computed({
  get() {
    return record.value.namespace === undefined
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
</script>
