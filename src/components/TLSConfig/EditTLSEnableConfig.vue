<template>
  <div class="TLS-enable-config">
    <el-form-item label="SNI">
      <el-input class="TLS-input" v-model="record.server_name_indication" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>TLS Cert</span>
        <InfoTooltip :content="$t('Base.tlsConfigItemDesc', { file: 'TLS Cert' })" />
      </template>
      <TextareaWithUploader
        v-if="!record.certfile || openResetMap.certfile"
        class="TLS-input"
        v-model="record.certfile"
        :allow-extensions="fileAllowExtensions"
      />
      <ConfigItemDataLook v-else :value="record.certfile" @reset="editConfigItem('certfile')" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>TLS Key</span>
        <InfoTooltip :content="$t('Base.tlsConfigItemDesc', { file: 'TLS Key' })" />
      </template>
      <TextareaWithUploader
        v-if="!record.keyfile || openResetMap.keyfile"
        class="TLS-input"
        v-model="record.keyfile"
        :allow-extensions="fileAllowExtensions"
      />
      <ConfigItemDataLook v-else :value="record.keyfile" @reset="editConfigItem('keyfile')" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>CA Cert</span>
        <InfoTooltip :content="$t('Base.tlsConfigItemDesc', { file: 'CA Cert' })" />
      </template>
      <TextareaWithUploader
        v-if="!record.cacertfile || openResetMap.cacertfile"
        class="TLS-input"
        v-model="record.cacertfile"
        :allow-extensions="fileAllowExtensions"
      />
      <ConfigItemDataLook v-else :value="record.cacertfile" @reset="editConfigItem('cacertfile')" />
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditTLSEnableConfig',
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits, computed, PropType, WritableComputedRef, ref, Ref } from 'vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import TextareaWithUploader from '../TextareaWithUploader.vue'
import { SSL } from '@/types/common'
import ConfigItemDataLook from './ConfigItemDataLook.vue'

type ConfigItemKey = 'certfile' | 'keyfile' | 'cacertfile'

const fileAllowExtensions = ['crt', 'key', 'pem', 'jks', 'der', 'cer', 'pfx']

const props = defineProps({
  modelValue: {
    type: Object as PropType<SSL>,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const openResetMap: Ref<Record<ConfigItemKey, boolean>> = ref({
  certfile: false,
  keyfile: false,
  cacertfile: false,
})

const record: WritableComputedRef<SSL> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const editConfigItem = (key: ConfigItemKey) => {
  record.value[key] = ''
  openResetMap.value[key] = true
}
</script>
