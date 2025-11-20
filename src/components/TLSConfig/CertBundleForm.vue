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
      <el-input v-model.trim="record.name" autocomplete="one-time-code" :disabled="isEditing" />
    </el-form-item>
    <el-form-item prop="namespace" :label="t('BasicConfig.namespace')">
      <div class="flex flex-1 items-center gap-2">
        <el-switch v-model="isNamespaceEnabled" :disabled="isEditing || requireNamespace" />
        <el-select
          v-if="isNamespaceEnabled"
          v-model="record.namespace"
          class="flex-1"
          :disabled="isEditing"
        >
          <el-option v-for="item in namespaceOptions" :key="item" :value="item" :label="item" />
        </el-select>
      </div>
    </el-form-item>

    <el-form-item :label="t('Base.configurationMethod')">
      <el-radio-group :model-value="confMethod" @change="handleConfMethodChange">
        <el-radio :value="CertBundleType.Regular">{{ t('Base.certAndKey') }}</el-radio>
        <el-radio :value="CertBundleType.ACME">{{ t('Base.acmeKey') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <template v-if="confMethod === CertBundleType.Regular">
      <el-form-item prop="chain">
        <template #label>
          <span>TLS Cert</span>
          <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'TLS Cert' })" />
        </template>
        <CertFileInput
          class="TLS-input"
          v-model="record.chain"
          :is-edit="isEditing"
          :accept="CER_FILE_ACCEPTS"
          :placeholder="t('Base.certPlaceholder')"
        />
      </el-form-item>
      <el-form-item prop="key">
        <template #label>
          <span>TLS Key</span>
          <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'TLS Key' })" />
        </template>
        <CertFileInput
          class="TLS-input"
          v-model="record.key"
          :is-edit="isEditing"
          :accept="CER_FILE_ACCEPTS"
          :placeholder="t('Base.keyFilePlaceholder')"
        />
      </el-form-item>
      <el-form-item prop="key_password" :label="t('Base.keyPassword')">
        <el-input
          v-model="record.key_password"
          type="password"
          show-password
          autocomplete="one-time-code"
        />
      </el-form-item>
    </template>

    <el-form-item v-else prop="acc_key" :label="t('Base.acmeKey')">
      <CertFileInput
        class="TLS-input"
        v-model="record.acc_key"
        :is-edit="isEditing"
        :accept="`${CER_FILE_ACCEPTS},.json`"
      />
    </el-form-item>

    <el-form-item prop="ca">
      <template #label>
        <span>CA Cert</span>
        <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'CA Cert' })" />
      </template>

      <CertFileInput
        class="TLS-input"
        v-model="record.ca"
        :is-edit="isEditing"
        :accept="CER_FILE_ACCEPTS"
        :placeholder="t('Base.certPlaceholder')"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { CertBundleForm, CertBundleType } from '@/hooks/useCertBundle'
import type { FormInstance } from 'element-plus'

const props = defineProps<{
  modelValue: CertBundleForm
  isEditing?: boolean
  requireNamespace?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: CertBundleForm): void
}>()

const { t } = useI18n()

const record = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

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
  acc_key: createRequiredRule(t('Base.acmeKey')),
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

const confMethod = ref(CertBundleType.Regular)
const initConfMethod = () => {
  if (props.isEditing) {
    confMethod.value = record.value.acc_key ? CertBundleType.ACME : CertBundleType.Regular
  }
}
initConfMethod()

const { operationWarning } = useOperationConfirm()
const handleConfMethodChange = async (val: any) => {
  try {
    const nV = val as CertBundleType
    const { acc_key, chain, key, key_password } = record.value
    if (nV === CertBundleType.ACME && (key_password || chain || key)) {
      await operationWarning(t('Base.switchConfigurationMethodToACMEWarning'))
    } else if (nV === CertBundleType.Regular && acc_key) {
      await operationWarning(t('Base.switchConfigurationMethodToRegularWarning'))
    }
    confMethod.value = nV
    if (confMethod.value === CertBundleType.Regular) {
      record.value.acc_key = ''
    } else {
      record.value.chain = ''
      record.value.key = ''
      record.value.key_password = ''
    }
  } catch (error) {
    //
  }
}

const isLoading = ref(false)
const namespaceOptions = ref<Array<string>>([])
const { getNamespaceOptions: requestNamespaceOptions } = useManagedNamespaceOptions()
const queryNamespaceList = async () => {
  try {
    isLoading.value = true
    const res = await requestNamespaceOptions()
    namespaceOptions.value = res
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
queryNamespaceList()

const validateCerts = () => {
  const { chain, key, ca } = record.value
  if (confMethod.value === CertBundleType.Regular && !chain && !key && !ca) {
    ElMessage.error(t('Base.certRequired'))
    return Promise.reject(new Error(t('Base.certsRequired')))
  }
  return Promise.resolve()
}

const { isBundleNameDuplicated } = useCertBundle()
const validate = async () => {
  try {
    await formRef.value?.validate()
    if (!props.isEditing) {
      await isBundleNameDuplicated(record.value.name, record.value.namespace)
    }
    await validateCerts()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

defineExpose({ validate })
</script>

<style lang="scss">
.cert-bundle-create-form {
  .TLS-input {
    width: 100%;
  }
}
</style>
