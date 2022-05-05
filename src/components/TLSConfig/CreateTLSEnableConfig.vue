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
        class="TLS-input"
        v-model="record.certfile"
        :allow-extensions="fileAllowExtensions"
        :placeholder="$t('Base.certPlaceholder')"
      />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>TLS Key</span>
        <InfoTooltip :content="$t('Base.tlsConfigItemDesc', { file: 'TLS Key' })" />
      </template>
      <TextareaWithUploader
        class="TLS-input"
        v-model="record.keyfile"
        :allow-extensions="fileAllowExtensions"
        :placeholder="$t('Base.keyFilePlaceholder')"
      />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span>CA Cert</span>
        <InfoTooltip :content="$t('Base.tlsConfigItemDesc', { file: 'CA Cert' })" />
      </template>
      <TextareaWithUploader
        class="TLS-input"
        v-model="record.cacertfile"
        :allow-extensions="fileAllowExtensions"
        :placeholder="$t('Base.certPlaceholder')"
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
import { defineProps, defineEmits, computed, PropType, WritableComputedRef } from 'vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import TextareaWithUploader from '../TextareaWithUploader.vue'
import { SSL } from '@/types/common'

const fileAllowExtensions = ['crt', 'key', 'pem', 'jks', 'der', 'cer', 'pfx']

const props = defineProps({
  modelValue: {
    type: Object as PropType<SSL>,
    default: () => ({}),
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
</script>
