<template>
  <div class="TLS-base-config">
    <div class="TLS-base-config-title">
      {{ $t('Base.tlsConfig') }}
    </div>
    <div>
      <el-checkbox v-model="record.enable" :label="$t('Base.enableTLS')" border />
      <el-checkbox
        v-model="record.verify"
        :label="$t('Base.tlsVerify')"
        :true-label="SSL_VERIFY_VALUE_MAP.get(true)"
        :false-label="SSL_VERIFY_VALUE_MAP.get(false)"
        border
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TLSBaseConfig',
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits, computed, PropType, WritableComputedRef } from 'vue'
import { SSL_VERIFY_VALUE_MAP } from '@/common/constants'
import { SSL } from '@/types/common'

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

<style lang="scss">
.TLS-base-config {
  margin-bottom: 20px;

  .TLS-base-config-title {
    margin-top: 0;
    margin-bottom: 8px;
    color: #000000;
    font-weight: bold;
    line-height: 20px;
  }
}
</style>
