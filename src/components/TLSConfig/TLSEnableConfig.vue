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
    <CustomFormItem
      label="SNI"
      v-if="showSni"
      :readonly="readonly"
      :prop="getFormItemProp(`server_name_indication`)"
    >
      <el-input class="TLS-input" v-model="record.server_name_indication" />
    </CustomFormItem>
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
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'CreateTLSEnableConfig',
})
</script>

<script setup lang="ts">
import { CER_FILE_ACCEPTS, SSL_VERIFY_VALUE_MAP } from '@/common/constants'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { SSL } from '@/types/common'
import CustomFormItem from '../CustomFormItem.vue'
import TextareaWithUploader from '../TextareaWithUploader.vue'
import ConfigItemDataLook from './ConfigItemDataLook.vue'

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
})

const emit = defineEmits(['update:modelValue', 'verifyChange'])

const { t, tl } = useI18nTl('Auth')

const record = computed<SSL>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

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
