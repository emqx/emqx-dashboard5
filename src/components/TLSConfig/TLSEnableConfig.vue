<template>
  <div class="TLS-enable-config">
    <el-form-item v-if="!hideVerify" :label="verifyLabel || t('Base.tlsVerify')">
      <el-switch
        v-model="record.verify"
        :disabled="readonly || disabledVerify"
        :active-value="SSL_VERIFY_VALUE_MAP.get(true)"
        :inactive-value="SSL_VERIFY_VALUE_MAP.get(false)"
        @change="handleVerifyChange"
      />
    </el-form-item>
    <el-form-item v-if="showMiddleboxCompMode" :prop="getFormItemProp(`middlebox_comp_mode`)">
      <template #label>
        <FormItemLabel
          :label="t('Base.middleboxCompMode')"
          :desc="t('Base.middleboxCompModeDesc')"
          desc-marked
        />
      </template>
      <el-switch v-model="record.middlebox_comp_mode" :disabled="readonly" />
    </el-form-item>

    <CustomFormItem
      v-if="showSni"
      :readonly="readonly"
      :prop="getFormItemProp(`server_name_indication`)"
    >
      <template #label>
        <span v-if="!$attrs.content">SNI</span>
        <FormItemLabel
          v-else
          label="SNI"
          :desc="($attrs as any).content"
          v-bind="$attrs"
          desc-marked
        />
      </template>
      <el-input class="TLS-input" v-model="record.server_name_indication" />
    </CustomFormItem>
    <el-form-item :label="t('Base.certificateSource')">
      <el-radio-group :model-value="certificateSource" @change="handleCertificateSourceChange">
        <el-radio :value="CertificateSource.Manual">
          {{ t('Base.enterManually') }}
        </el-radio>
        <el-radio :value="CertificateSource.ManagedCerts">
          {{ t('Base.selectFromManagedCerts') }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <template v-if="!isUsingCertBundle">
      <el-form-item :prop="getFormItemProp(`certfile`)">
        <template #label>
          <span>TLS Cert</span>
          <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'TLS Cert' })" />
        </template>
        <!-- TODO: use CertFileInput.vue -->
        <template v-if="!readonly">
          <TextareaWithUploader
            v-if="!isEdit || !record.certfile || openResetMap.certfile"
            class="TLS-input"
            v-model="record.certfile"
            :accept="CER_FILE_ACCEPTS"
            :placeholder="t('Base.certPlaceholder')"
            @vue:mounted="editConfigItem('certfile')"
          />
          <ConfigItemDataLook
            v-else
            class="TLS-input"
            :value="record.certfile"
            @reset="editConfigItem('certfile')"
          />
        </template>
        <p class="value" v-else>{{ record.certfile }}</p>
      </el-form-item>
      <el-form-item :prop="getFormItemProp(`keyfile`)">
        <template #label>
          <span>TLS Key</span>
          <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'TLS Key' })" />
        </template>
        <template v-if="!readonly">
          <TextareaWithUploader
            v-if="!isEdit || !record.keyfile || openResetMap.keyfile"
            class="TLS-input"
            v-model="record.keyfile"
            :accept="CER_FILE_ACCEPTS"
            :placeholder="t('Base.keyFilePlaceholder')"
            @vue:mounted="editConfigItem('keyfile')"
          />
          <ConfigItemDataLook
            v-else
            class="TLS-input"
            :value="record.keyfile"
            @reset="editConfigItem('keyfile')"
          />
        </template>
        <p class="value" v-else>{{ record.keyfile }}</p>
      </el-form-item>
      <!-- Displayed when verify is undefined(for confluent connector) or true -->
      <el-form-item
        :prop="getFormItemProp(`cacertfile`)"
        v-if="record.verify !== SSL_VERIFY_VALUE_MAP.get(false)"
      >
        <template #label>
          <span>CA Cert</span>
          <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'CA Cert' })" />
        </template>
        <template v-if="!readonly">
          <TextareaWithUploader
            v-if="!isEdit || !record.cacertfile || openResetMap.cacertfile"
            class="TLS-input"
            v-model="record.cacertfile"
            :accept="CER_FILE_ACCEPTS"
            :placeholder="t('Base.certPlaceholder')"
            @vue:mounted="editConfigItem('cacertfile')"
          />
          <ConfigItemDataLook
            v-else
            class="TLS-input"
            :value="record.cacertfile"
            @reset="editConfigItem('cacertfile')"
          />
        </template>
        <p class="value" v-else>{{ record.cacertfile }}</p>
      </el-form-item>
    </template>
    <template v-else>
      <ManagedCertConfig
        v-if="!managedCertsArr && !Array.isArray(record.managed_certs)"
        v-model="record.managed_certs"
        :require-namespace="requireNamespace"
        :columns="managedCertConfColumns"
      />
      <ListEditor
        v-else-if="Array.isArray(record.managed_certs)"
        class="managed-cert-list"
        :list="record.managed_certs"
        @add="addManagedCert"
        @delete="deleteManagedCert"
      >
        <template #default="{ index }">
          <el-card class="flex-1">
            <ManagedCertConfig
              v-model="record.managed_certs[index]"
              sni
              :require-namespace="requireNamespace"
              :columns="managedCertConfColumns"
            />
          </el-card>
        </template>
      </ListEditor>
    </template>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'CreateTLSEnableConfig',
})
</script>

<script setup lang="ts">
import { SSL } from '@/types/common'
import CustomFormItem from '../CustomFormItem.vue'
import FormItemLabel from '../FormItemLabel.vue'
import TextareaWithUploader from '../TextareaWithUploader.vue'
import ConfigItemDataLook from './ConfigItemDataLook.vue'
import ManagedCertConfig from './ManagedCertConfig.vue'

const enum CertificateSource {
  Manual,
  ManagedCerts,
}

type ConfigItemKey = 'certfile' | 'keyfile' | 'cacertfile'

const props = defineProps({
  modelValue: {
    type: Object as PropType<SSL>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
  },
  showSni: {
    type: Boolean,
    default: true,
  },
  showMiddleboxCompMode: {
    type: Boolean,
    default: true,
  },
  /**
   * for prop in form item when need validate form
   */
  basePath: {
    type: String,
  },
  verifyLabel: {
    type: String,
    default: function () {
      try {
        return useI18nTl('Base').tl('tlsVerify')
      } catch (error) {
        console.error(error)
        return undefined
      }
    },
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabledVerify: {
    type: Boolean,
    default: false,
  },
  hideVerify: {
    type: Boolean,
    default: false,
  },
  /**
   * for `managed_certs` in connector
   */
  requireNamespace: {
    type: Boolean,
  },
  /**
   * Setting this to true will enable the SNI configuration
   * at ssl listener, wss listener, dtls listener in gateway, exproto gateway
   */
  managedCertsArr: {
    type: Boolean,
  },
  managedCertConfColumns: {
    type: Number,
  },
  /**
   * prop for updating listener
   */
  managedCertsBundleEmptyValue: {
    type: null as unknown as PropType<null>,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue', 'verifyChange'])

const { t } = useI18nTl('Auth')

const record = computed<SSL>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const certificateSource = ref(CertificateSource.Manual)
const isUsingCertBundle = computed(() => certificateSource.value === CertificateSource.ManagedCerts)
const { operationWarning } = useOperationConfirm()
const { createEmptyManagedCertConf } = useManagedCertConf()
const handleCertificateSourceChange = async (val: any) => {
  try {
    const newVal = val as CertificateSource
    const { managed_certs: mC } = record.value
    if (
      newVal === CertificateSource.Manual &&
      ((!Array.isArray(mC) && mC?.bundle_name) || (Array.isArray(mC) && mC.length > 0))
    ) {
      await operationWarning(t('Base.certificateSourceChangeWarning'))
    }
    certificateSource.value = newVal
    const isCertBundle = isUsingCertBundle.value
    if (isCertBundle && !record.value.managed_certs) {
      if (props.managedCertsArr) {
        record.value.managed_certs = [createEmptyManagedCertConf()]
      } else {
        record.value.managed_certs = createEmptyManagedCertConf()
      }
    } else if (!isCertBundle && record.value.managed_certs) {
      record.value.managed_certs = props.managedCertsBundleEmptyValue
    }
  } catch (error) {
    //
  }
}
const addManagedCert = () => {
  if (!Array.isArray(record.value.managed_certs)) {
    return
  }
  record.value.managed_certs.push(createEmptyManagedCertConf())
}
const deleteManagedCert = (index: number) => {
  if (!Array.isArray(record.value.managed_certs)) {
    return
  }
  record.value.managed_certs.splice(index, 1)
}
const initIsUsingCertBundle = () => {
  if (!props.isEdit || !props.modelValue.managed_certs) {
    return
  }
  const { managed_certs: mC } = props.modelValue
  const withValue = (!Array.isArray(mC) && mC?.bundle_name) || (Array.isArray(mC) && mC.length > 0)
  certificateSource.value = withValue ? CertificateSource.ManagedCerts : CertificateSource.Manual
}
initIsUsingCertBundle()

const openResetMap = ref<Record<ConfigItemKey, boolean>>({
  certfile: false,
  keyfile: false,
  cacertfile: false,
})

const editConfigItem = (key: ConfigItemKey) => {
  record.value[key] = ''
  openResetMap.value[key] = true
}

const getFormItemProp = (key: string) => {
  if (props.basePath) {
    return `${props.basePath}.${key}`
  }
  return undefined
}

const handleVerifyChange = (val: string | number | boolean) => {
  emit('verifyChange', val)
}
</script>

<style lang="scss">
.TLS-input {
  width: 100%;
}
</style>
