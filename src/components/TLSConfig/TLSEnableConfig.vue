<template>
  <div class="TLS-enable-config">
    <el-form-item :label="verifyLabel || $t('Base.tlsVerify')">
      <el-switch
        v-model="record.verify"
        :disabled="switchDisabled"
        :active-value="SSL_VERIFY_VALUE_MAP.get(true)"
        :inactive-value="SSL_VERIFY_VALUE_MAP.get(false)"
      />
    </el-form-item>
    <el-form-item v-if="showSni" :prop="getFormItemProp(`server_name_indication`)">
      <template #label>
        <span>SNI</span>
        <InfoTooltip v-if="$attrs.content" v-bind="$attrs" />
      </template>
      <el-input class="TLS-input" v-model="record.server_name_indication" />
    </el-form-item>
    <el-form-item :prop="getFormItemProp(`certfile`)">
      <template #label>
        <span>TLS Cert</span>
        <InfoTooltip :content="$t('Base.tlsConfigItemDesc', { file: 'TLS Cert' })" />
      </template>
      <TextareaWithUploader
        v-if="!isEdit || !record.certfile || openResetMap.certfile"
        class="TLS-input"
        v-model="record.certfile"
        :allow-extensions="fileAllowExtensions"
        :placeholder="$t('Base.certPlaceholder')"
        @vnode-mounted="editConfigItem('certfile')"
      />
      <ConfigItemDataLook
        v-else
        class="TLS-input"
        :value="record.certfile"
        @reset="editConfigItem('certfile')"
      />
    </el-form-item>
    <el-form-item :prop="getFormItemProp(`keyfile`)">
      <template #label>
        <span>TLS Key</span>
        <InfoTooltip :content="$t('Base.tlsConfigItemDesc', { file: 'TLS Key' })" />
      </template>
      <TextareaWithUploader
        v-if="!isEdit || !record.keyfile || openResetMap.keyfile"
        class="TLS-input"
        v-model="record.keyfile"
        :allow-extensions="fileAllowExtensions"
        :placeholder="$t('Base.keyFilePlaceholder')"
        @vnode-mounted="editConfigItem('keyfile')"
      />
      <ConfigItemDataLook
        v-else
        class="TLS-input"
        :value="record.keyfile"
        @reset="editConfigItem('keyfile')"
      />
    </el-form-item>
    <el-form-item :prop="getFormItemProp(`cacertfile`)">
      <template #label>
        <span>CA Cert</span>
        <InfoTooltip :content="$t('Base.tlsConfigItemDesc', { file: 'CA Cert' })" />
      </template>
      <TextareaWithUploader
        v-if="!isEdit || !record.cacertfile || openResetMap.cacertfile"
        class="TLS-input"
        v-model="record.cacertfile"
        :allow-extensions="fileAllowExtensions"
        :placeholder="$t('Base.certPlaceholder')"
        @vnode-mounted="editConfigItem('cacertfile')"
      />
      <ConfigItemDataLook
        v-else
        class="TLS-input"
        :value="record.cacertfile"
        @reset="editConfigItem('cacertfile')"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateTLSEnableConfig',
})
</script>

<script setup lang="ts">
import { SSL_VERIFY_VALUE_MAP } from '@/common/constants'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { SSL } from '@/types/common'
import { computed, defineEmits, defineProps, PropType, Ref, ref, WritableComputedRef } from 'vue'
import TextareaWithUploader from '../TextareaWithUploader.vue'
import ConfigItemDataLook from './ConfigItemDataLook.vue'

type ConfigItemKey = 'certfile' | 'keyfile' | 'cacertfile'

const fileAllowExtensions = ['crt', 'key', 'pem', 'jks', 'der', 'cer', 'pfx']

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
  switchDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const record: WritableComputedRef<SSL> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const openResetMap: Ref<Record<ConfigItemKey, boolean>> = ref({
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
</script>

<style lang="scss">
.TLS-input {
  width: 100%;
}
</style>
